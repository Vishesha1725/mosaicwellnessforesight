import { CATALOG } from "../_lib/catalog.js";
import { validateKeys } from "../_lib/env.js";
import { fetchGoogleRelatedQueries, fetchGoogleTrendsSignal } from "../_lib/signals/googleTrends.js";
import { fetchYoutubeSignal } from "../_lib/signals/youtube.js";
import { fetchRedditSignal } from "../_lib/signals/reddit.js";
import { buildPricingAndFormats } from "../_lib/pricing.js";
import { scoreProduct } from "../_lib/scoring.js";
import { buildFounderMemo } from "../_lib/founderMemo.js";
import { svgDataUriForProduct } from "../_lib/imageSvg.js";
import { getSampleTrends } from "../_lib/sampleTrends.js";

const CATEGORIES = [
  "Wellness & Supplements",
  "Functional Beverages",
  "Beauty & Personal Care",
  "Healthy Snacking",
  "Mental Health & Sleep",
  "Sports Nutrition",
] as const;

type Category = (typeof CATEGORIES)[number];
const MAX_SERPAPI_REQUESTS_PER_RUN = 15;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function pLimit(limit: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  const next = () => {
    active -= 1;
    const fn = queue.shift();
    if (fn) fn();
  };
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }
    active += 1;
    try {
      return await task();
    } finally {
      next();
    }
  };
}

export default async function handler(req: any, res: any) {
  const t0 = Date.now();
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const timingsMs = { total: 0, trends: 0, youtube: 0, reddit: 0 };

  try {
    const categoryInput = String(req.body?.category || CATEGORIES[0]);
    const category = (CATEGORIES.includes(categoryInput as Category) ? categoryInput : CATEGORIES[0]) as Category;
    const timeframeDays = clamp(Number(req.body?.timeframe) || 90, 7, 365);
    const limit = clamp(Number(req.body?.limit) || 8, 5, 10);
    const budgetMode = req.body?.budgetMode !== false;

    const keys = validateKeys();
    const catalog = (CATALOG[category] || []).slice(0, 8);

    if (!keys.serpApi && !keys.youtube) {
      const sample = getSampleTrends(category).slice(0, 8).map((x) => ({
        ...x,
        image_data_uri: svgDataUriForProduct(x.trend_name, category),
        thumbnail_url: svgDataUriForProduct(x.trend_name, category),
      }));
      timingsMs.total = Date.now() - t0;
      res.status(200).json({
        mode: "demo",
        reason: "Missing API keys",
        category,
        timeframeDays,
        candidatesDiscovered: 8,
        signalsUsed: ["Google Trends", "YouTube", "Reddit"],
        topPicks: sample.slice(0, 5),
        results: sample,
        partialData: true,
        partialDataSources: ["Google Trends", "YouTube", "Reddit"],
        liveMode: false,
        discoveryCount: 8,
        serpapiBudget: { used: 0, max: MAX_SERPAPI_REQUESTS_PER_RUN, budgetMode },
        timingsMs,
      });
      return;
    }

    let serpapiUsed = 0;
    let partialData = false;
    const partialDataSources = new Set<string>();

    const incSerp = () => {
      serpapiUsed += 1;
    };

    const withTrendTiming = async <T>(fn: () => Promise<T>) => {
      const s = Date.now();
      try {
        return await fn();
      } finally {
        timingsMs.trends += Date.now() - s;
      }
    };

    const withYtTiming = async <T>(fn: () => Promise<T>) => {
      const s = Date.now();
      try {
        return await fn();
      } finally {
        timingsMs.youtube += Date.now() - s;
      }
    };

    const withRedditTiming = async <T>(fn: () => Promise<T>) => {
      const s = Date.now();
      try {
        return await fn();
      } finally {
        timingsMs.reddit += Date.now() - s;
      }
    };

    const baseRows = catalog.map((product) => {
      const { formats, pricing } = buildPricingAndFormats(product, category);
      return {
        product,
        formats,
        pricing,
        google: { series: [] as number[], growthPct: 0, spikeiness: 70, related: [] as string[] },
        youtube: { recentCount: 0, sampleTitles: [] as string[], totalResults: 0 },
        reddit: { mentionCount: 0, sampleThreads: [] as string[] },
      };
    });

    const runLimited = pLimit(4);

    // PASS 1: exactly one primary keyword Trends per product (fallback only on failure)
    await Promise.all(
      baseRows.map((row) =>
        runLimited(async () => {
          const primary = row.product.keywords[0];
          const fallback = row.product.keywords[1];

          const tryFetch = async (kw: string) => {
            if (!kw) return null;
            if (serpapiUsed >= MAX_SERPAPI_REQUESTS_PER_RUN) {
              partialData = true;
              partialDataSources.add("Google Trends (budget cap)");
              return null;
            }
            try {
              return await withTrendTiming(() =>
                fetchGoogleTrendsSignal(kw, timeframeDays, { onNetworkRequest: incSerp })
              );
            } catch {
              partialData = true;
              partialDataSources.add("Google Trends");
              return null;
            }
          };

          const first = await tryFetch(primary);
          if (first) {
            row.google = first;
            return;
          }

          const second = await tryFetch(fallback);
          if (second) {
            row.google = second;
          }
        })
      )
    );

    baseRows.sort((a, b) => (b.google.growthPct + (100 - b.google.spikeiness)) - (a.google.growthPct + (100 - a.google.spikeiness)));

    // PASS 2: deep proof for winners only
    const winnersCount = budgetMode ? 3 : 5;
    const winners = baseRows.slice(0, winnersCount);

    await Promise.all(
      winners.map((row) =>
        runLimited(async () => {
          const keyword = row.product.keywords[0];

          const [relatedResult, ytResult, rdResult] = await Promise.allSettled([
            (async () => {
              if (serpapiUsed >= MAX_SERPAPI_REQUESTS_PER_RUN) {
                partialData = true;
                partialDataSources.add("Google Trends (budget cap)");
                return [] as string[];
              }
              try {
                return await withTrendTiming(() =>
                  fetchGoogleRelatedQueries(keyword, timeframeDays, { onNetworkRequest: incSerp })
                );
              } catch {
                partialData = true;
                partialDataSources.add("Google Trends related");
                return [] as string[];
              }
            })(),
            (async () => {
              try {
                return await withYtTiming(() => fetchYoutubeSignal(keyword, timeframeDays));
              } catch {
                partialData = true;
                partialDataSources.add("YouTube");
                return { recentCount: 0, sampleTitles: [], totalResults: 0 };
              }
            })(),
            (async () => {
              try {
                return await withRedditTiming(() => fetchRedditSignal(keyword, timeframeDays));
              } catch {
                partialData = true;
                partialDataSources.add("Reddit");
                return { mentionCount: 0, sampleThreads: [] };
              }
            })(),
          ]);

          if (relatedResult.status === "fulfilled") {
            row.google.related = relatedResult.value;
          }
          if (ytResult.status === "fulfilled") {
            row.youtube = ytResult.value as any;
          }
          if (rdResult.status === "fulfilled") {
            row.reddit = rdResult.value as any;
          }
        })
      )
    );

    const results = baseRows.map((row) => {
      const metrics = scoreProduct({
        category,
        google: row.google,
        youtube: row.youtube,
        reddit: row.reddit,
        pricing: row.pricing,
      });

      const strongSources = [metrics.growingScore >= 55, metrics.creatorMomentumScore >= 40, metrics.buzzScore >= 30].filter(Boolean).length;
      const classification =
        metrics.willLastScore >= 60 && (metrics.growingScore >= 65 || metrics.creatorMomentumScore >= 55) && strongSources >= 2
          ? "REAL TREND"
          : metrics.fadRiskLabel === "High"
          ? "FAD"
          : "EARLY SIGNAL";

      const memo = buildFounderMemo({
        productName: row.product.name,
        category,
        classification,
        formats: row.formats,
        pricing: row.pricing,
        metrics: {
          growthPct: row.google.growthPct,
          recentCount: row.youtube.recentCount,
          mentionCount: row.reddit.mentionCount,
          marketStrength: metrics.marketStrength,
          fadRiskLabel: metrics.fadRiskLabel,
        },
      });

      return {
        id: row.product.id,
        category,
        trend_name: row.product.name,
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
        formats: row.formats,
        pricing: row.pricing,
        image_data_uri: svgDataUriForProduct(row.product.name, category),
        thumbnail_url: svgDataUriForProduct(row.product.name, category),
        one_liner: row.product.oneLiner,
        keywords: row.product.keywords,
        why_bullets: memo.whyRealOrFad,
        founder_brief: [memo.whatHappening, `Proof: ${memo.proof}`, memo.formatsAndPricing, memo.ninetyDayPlan].join("\n\n"),
        founder_memo: memo,
        youtube_titles: row.youtube.sampleTitles,
        youtube_counts: { d7: row.youtube.recentCount, d30: row.youtube.recentCount, d90: row.youtube.recentCount },
        reddit_counts: { d30: row.reddit.mentionCount, d90: row.reddit.mentionCount },
        google_trends_data: row.google.series.length ? row.google.series : [20, 22, 24, 27, 30, 33, 36, 38, 41, 44, 46, 49],
        reddit_mentions: Array.from({ length: 12 }, (_, i) => clamp(row.reddit.mentionCount + i, 0, 100)),
        evidence_snippets: [memo.proof, ...memo.whyRealOrFad],
        partial_data_note: partialData ? `Quick results (some sources skipped): ${[...partialDataSources].join(", ")}` : undefined,
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
        price_ladder: `Trial INR ${row.pricing.trial[0]}-${row.pricing.trial[1]} | Monthly INR ${row.pricing.monthly[0]}-${row.pricing.monthly[1]} | Bundle INR ${row.pricing.bundle[0]}-${row.pricing.bundle[1]}`,
        format_recommendation: row.formats.join(" / "),
      };
    });

    results.sort((a, b) => b.market_strength - a.market_strength);
    const sliced = results.slice(0, Math.min(limit, 8));

    timingsMs.total = Date.now() - t0;
    console.log("[radar] timing", { ...timingsMs, serpapiUsed, category, timeframeDays, budgetMode });

    res.status(200).json({
      mode: "live",
      category,
      timeframeDays,
      candidatesDiscovered: catalog.length,
      signalsUsed: ["Google Trends", "YouTube", "Reddit"],
      topPicks: sliced.slice(0, 5),
      results: sliced,
      partialData,
      partialDataSources: [...partialDataSources],
      liveMode: true,
      discoveryCount: catalog.length,
      serpapiBudget: { used: serpapiUsed, max: MAX_SERPAPI_REQUESTS_PER_RUN, budgetMode },
      timingsMs,
    });
  } catch (error: any) {
    timingsMs.total = Date.now() - t0;
    console.log("[radar] failed", { error: error?.message, timingsMs });
    res.status(200).json({
      mode: "demo",
      reason: "Quick fallback after runtime error",
      category: req.body?.category || "Wellness & Supplements",
      timeframeDays: Number(req.body?.timeframe) || 90,
      candidatesDiscovered: 8,
      signalsUsed: ["Google Trends", "YouTube", "Reddit"],
      topPicks: [],
      results: getSampleTrends(req.body?.category || "Wellness & Supplements"),
      partialData: true,
      partialDataSources: ["Google Trends", "YouTube", "Reddit"],
      liveMode: false,
      discoveryCount: 8,
      serpapiBudget: { used: 0, max: MAX_SERPAPI_REQUESTS_PER_RUN, budgetMode: true },
      timingsMs,
    });
  }
}
