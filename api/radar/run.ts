import { CATALOG } from "../_lib/catalog.js";
import { validateKeys } from "../_lib/env.js";
import { fetchGoogleTrendsSignal } from "../_lib/signals/googleTrends.js";
import { fetchYoutubeSignal } from "../_lib/signals/youtube.js";
import { fetchRedditSignal } from "../_lib/signals/reddit.js";
import { buildPricingAndFormats } from "../_lib/pricing.js";
import { scoreProduct } from "../_lib/scoring.js";
import { buildFounderMemo } from "../_lib/founderMemo.js";
import { svgDataUriForProduct } from "../_lib/imageSvg.js";

const CATEGORIES = [
  "Wellness & Supplements",
  "Functional Beverages",
  "Beauty & Personal Care",
  "Healthy Snacking",
  "Mental Health & Sleep",
  "Sports Nutrition",
] as const;

type Category = (typeof CATEGORIES)[number];

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const categoryInput = String(req.body?.category || CATEGORIES[0]);
    const category = (CATEGORIES.includes(categoryInput as Category) ? categoryInput : CATEGORIES[0]) as Category;
    const timeframeDays = clamp(Number(req.body?.timeframe) || 90, 7, 365);
    const limit = clamp(Number(req.body?.limit) || 8, 5, 10);

    const keys = validateKeys();
    const catalog = (CATALOG[category] || []).slice(0, 8);

    const demoMode = !keys.serpApi && !keys.youtube;
    let anyLiveSignal = false;

    const partialDataSources = new Set<string>();
    const results: any[] = [];

    for (const product of catalog) {
      let bestGoogle = { series: [] as number[], growthPct: 0, spikeiness: 70, related: [] as string[] };
      let bestYoutube = { recentCount: 0, sampleTitles: [] as string[], totalResults: 0 };
      let bestReddit = { mentionCount: 0, sampleThreads: [] as string[] };

      if (!demoMode) {
        for (const keyword of product.keywords.slice(0, 3)) {
          try {
            const gt = await fetchGoogleTrendsSignal(keyword, timeframeDays);
            if (gt.series.length > bestGoogle.series.length || gt.growthPct > bestGoogle.growthPct) bestGoogle = gt;
            if (gt.series.length > 0) anyLiveSignal = true;
          } catch {
            partialDataSources.add("Google Trends");
          }

          try {
            const yt = await fetchYoutubeSignal(keyword, timeframeDays);
            if (yt.recentCount > bestYoutube.recentCount) bestYoutube = yt;
            if (yt.recentCount > 0) anyLiveSignal = true;
          } catch {
            partialDataSources.add("YouTube");
          }

          try {
            const rd = await fetchRedditSignal(keyword, timeframeDays);
            if (rd.mentionCount > bestReddit.mentionCount) bestReddit = rd;
            if (rd.mentionCount > 0) anyLiveSignal = true;
          } catch {
            partialDataSources.add("Reddit");
          }
        }
      }

      const { formats, pricing } = buildPricingAndFormats(product, category);
      const metrics = scoreProduct({
        category,
        google: bestGoogle,
        youtube: bestYoutube,
        reddit: bestReddit,
        pricing,
      });

      const strongSources = [metrics.growingScore >= 55, metrics.creatorMomentumScore >= 40, metrics.buzzScore >= 30].filter(Boolean).length;
      const classification =
        metrics.willLastScore >= 60 && (metrics.growingScore >= 65 || metrics.creatorMomentumScore >= 55) && strongSources >= 2
          ? "REAL TREND"
          : metrics.fadRiskLabel === "High"
          ? "FAD"
          : "EARLY SIGNAL";

      const memo = buildFounderMemo({
        productName: product.name,
        category,
        classification,
        formats,
        pricing,
        metrics: {
          growthPct: bestGoogle.growthPct,
          recentCount: bestYoutube.recentCount,
          mentionCount: bestReddit.mentionCount,
          marketStrength: metrics.marketStrength,
          fadRiskLabel: metrics.fadRiskLabel,
        },
      });

      const founderBrief = [
        memo.whatHappening,
        `Proof: ${memo.proof}`,
        `Why: ${memo.whyRealOrFad.join(" ")}`,
        `Wedge: ${memo.productWedge.join(" ")}`,
        memo.formatsAndPricing,
        `GTM India: ${memo.gtmIndia}`,
        `Risks: ${memo.risksAndFixes.join(" ")}`,
        memo.ninetyDayPlan,
      ].join("\n\n");

      results.push({
        id: product.id,
        category,
        trend_name: product.name,
        trend_score: metrics.marketStrength,
        market_strength: metrics.marketStrength,
        classification,
        how_fast_its_growing: metrics.growingScore,
        will_it_last: metrics.willLastScore,
        money_potential: metrics.marketStrength,
        creator_momentum: metrics.creatorMomentumScore,
        people_talking: metrics.buzzScore,
        tam_estimate_cr: metrics.tamEstimateCr,
        cac_estimate_inr: metrics.cacEstimateInr,
        roi_estimate_x: metrics.roiX,
        fad_risk_label: metrics.fadRiskLabel,
        formats,
        pricing,
        image_data_uri: svgDataUriForProduct(product.name, category),
        thumbnail_url: svgDataUriForProduct(product.name, category),
        one_liner: product.oneLiner,
        keywords: product.keywords,
        why_bullets: memo.whyRealOrFad,
        founder_brief: founderBrief,
        founder_memo: memo,
        youtube_titles: bestYoutube.sampleTitles,
        youtube_counts: { d7: bestYoutube.recentCount, d30: bestYoutube.recentCount, d90: bestYoutube.recentCount },
        reddit_counts: { d30: bestReddit.mentionCount, d90: bestReddit.mentionCount },
        google_trends_data: bestGoogle.series.length ? bestGoogle.series : [20, 22, 25, 28, 30, 33, 36, 39, 41, 43, 45, 47],
        reddit_mentions: Array.from({ length: 12 }, (_, i) => clamp(bestReddit.mentionCount + i, 0, 100)),
        evidence_snippets: [memo.proof, ...memo.whyRealOrFad],
        partial_data_note: partialDataSources.size ? `Partial data: ${[...partialDataSources].join(", ")}` : undefined,

        velocity: clamp(Math.round(metrics.growingScore / 3.3), 0, 30),
        coherence: clamp(Math.round(metrics.willLastScore / 5), 0, 20),
        competition: clamp(15 - Math.round(metrics.creatorMomentumScore / 10), 1, 15),
        entry_window: classification === "REAL TREND" ? "Early" : classification === "EARLY SIGNAL" ? "Optimal" : "Late",
        dominance_prob: clamp(Math.round(metrics.marketStrength * 0.9), 0, 100),
        feasibility: clamp(Math.round(65 + metrics.marketStrength * 0.2), 0, 100),
        fad_risk: clamp(100 - metrics.willLastScore, 0, 100),
        structural_shift: clamp(metrics.willLastScore, 0, 100),
        regulatory_risk: "Estimate only. Validate claims with compliant labeling before launch.",
        tam_band: `INR ${metrics.tamEstimateCr} Cr (Estimate)`,
        cac_band: `INR ${metrics.cacEstimateInr} (Estimate)`,
        margin_band: `${metrics.marginBandLabel} (Estimate)`,
        payback_estimate: `ROI ${metrics.roiX}x (Estimate)`,
        price_ladder: `Trial INR ${pricing.trial[0]}-${pricing.trial[1]} | Monthly INR ${pricing.monthly[0]}-${pricing.monthly[1]} | Bundle INR ${pricing.bundle[0]}-${pricing.bundle[1]}`,
        format_recommendation: formats.join(" / "),
      });
    }

    results.sort((a, b) => b.market_strength - a.market_strength);
    const sliced = results.slice(0, Math.min(limit, 8));

    res.status(200).json({
      mode: demoMode || !anyLiveSignal ? "demo" : "live",
      category,
      timeframeDays,
      candidatesDiscovered: catalog.length,
      signalsUsed: ["Google Trends", "YouTube", "Reddit"],
      topPicks: sliced.slice(0, 5),
      results: sliced,
      partialData: demoMode || !anyLiveSignal || partialDataSources.size > 0,
      partialDataSources: [...partialDataSources],
      liveMode: !demoMode && anyLiveSignal,
      debug: { serpapi: keys.serpApi, youtube: keys.youtube },
    });
  } catch (error: any) {
    res.status(200).json({
      mode: "demo",
      reason: "Radar failed, fallback returned",
      category: req.body?.category || "Wellness & Supplements",
      timeframeDays: Number(req.body?.timeframe) || 90,
      candidatesDiscovered: 0,
      signalsUsed: ["Google Trends", "YouTube", "Reddit"],
      topPicks: [],
      results: [],
      partialData: true,
      error: error?.message || "unknown_error",
    });
  }
}
