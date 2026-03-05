import { CATALOG } from "../_lib/catalog.js";
import { validateKeys } from "../_lib/env.js";
import { fetchGoogleTrendsWithFallback } from "../_lib/signals/googleTrends.js";
import { fetchYoutubeWithFallback } from "../_lib/signals/youtube.js";
import { fetchRedditWithFallback } from "../_lib/signals/reddit.js";
import { buildPricingAndFormats } from "../_lib/pricing.js";
import { buildFounderMemo } from "../_lib/founderMemo.js";
import { svgDataUriForProduct } from "../_lib/imageSvg.js";
import { getSampleTrends } from "../_lib/sampleTrends.js";
import { cleanText } from "../_lib/text.js";

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

function pLimit(limit: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  const next = () => {
    active -= 1;
    const fn = queue.shift();
    if (fn) fn();
  };
  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((resolve) => queue.push(resolve));
    active += 1;
    try {
      return await task();
    } finally {
      next();
    }
  };
}

function getWindowDays(timeframeDays: number) {
  if (timeframeDays >= 180) return 90;
  if (timeframeDays >= 60) return 30;
  return 7;
}

function mean(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function std(values: number[]) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((acc, v) => acc + (v - m) ** 2, 0) / values.length);
}

function classifyTrend(input: {
  marketStrength: number;
  willLastScore: number;
  growingScore: number;
  spikeiness: number;
  strongSourceCount: number;
}) {
  const { marketStrength, willLastScore, growingScore, spikeiness, strongSourceCount } = input;
  if (marketStrength >= 55 && willLastScore >= 50) return "REAL TREND";
  if (growingScore >= 55 || (marketStrength >= 35 && marketStrength <= 54)) return "EARLY SIGNAL";
  if ((willLastScore < 30 && growingScore < 35) || (spikeiness >= 92 && strongSourceCount === 0)) return "FAD";
  return "EARLY SIGNAL";
}

function computeDynamicScores(params: {
  google: { series: number[]; growthPct: number; spikeiness: number };
  youtube: { recentCount: number; totalResults?: number };
  reddit: { mentionCount: number };
  hasTrends: boolean;
  hasYoutube: boolean;
  hasReddit: boolean;
}) {
  const { google, youtube, reddit, hasTrends, hasYoutube, hasReddit } = params;
  const ytMomentum = clamp(youtube.recentCount * 8 + Math.min(20, (youtube.totalResults || 0) / 20000), 0, 100);
  const redditBuzz = clamp(reddit.mentionCount * 8, 0, 100);

  let growingScore = 0;
  let willLastScore = 0;

  if (hasTrends) {
    const series = google.series || [];
    const slope = series.length > 1 ? (series[series.length - 1] - series[0]) / (series.length - 1) : 0;
    const volatilityPenalty = clamp((std(series) / Math.max(mean(series), 1)) * 55, 0, 45);
    growingScore = clamp(42 + google.growthPct * 0.55 + slope * 4, 0, 100);
    willLastScore = clamp(82 - google.spikeiness * 0.55 - volatilityPenalty + Math.max(0, google.growthPct * 0.08), 0, 100);
  } else if (hasYoutube && hasReddit) {
    growingScore = clamp(0.6 * ytMomentum + 0.4 * redditBuzz, 0, 100);
    const stability = 100 - Math.abs(ytMomentum - redditBuzz);
    willLastScore = clamp(50 + stability * 0.25 - 10, 20, 85);
  } else if (hasYoutube) {
    growingScore = ytMomentum;
    willLastScore = clamp(45 + ytMomentum * 0.25, 25, 80);
  } else if (hasReddit) {
    growingScore = redditBuzz;
    willLastScore = clamp(45 + redditBuzz * 0.25, 25, 80);
  }

  let marketStrength = 0;
  if (hasTrends && !hasYoutube && !hasReddit) {
    marketStrength = clamp(0.6 * willLastScore + 0.4 * growingScore, 0, 100);
  } else if (!hasTrends && hasYoutube && hasReddit) {
    marketStrength = clamp(0.5 * willLastScore + 0.5 * growingScore, 0, 100);
  } else {
    const weights: { val: number; w: number }[] = [];
    weights.push({ val: willLastScore, w: 0.4 });
    weights.push({ val: growingScore, w: 0.3 });
    if (hasYoutube) weights.push({ val: ytMomentum, w: 0.2 });
    if (hasReddit) weights.push({ val: redditBuzz, w: 0.1 });
    const denom = weights.reduce((a, b) => a + b.w, 0) || 1;
    marketStrength = clamp(weights.reduce((a, b) => a + b.val * b.w, 0) / denom, 0, 100);
  }

  const strongSourceCount = [
    hasTrends && (growingScore >= 55 || willLastScore >= 50),
    hasYoutube && ytMomentum >= 40,
    hasReddit && redditBuzz >= 30,
  ].filter(Boolean).length;

  return {
    growingScore,
    willLastScore,
    marketStrength,
    ytMomentum,
    redditBuzz,
    strongSourceCount,
  };
}

const BASELINE_TAM: Record<string, number> = {
  "Wellness & Supplements": 600,
  "Functional Beverages": 450,
  "Beauty & Personal Care": 900,
  "Healthy Snacking": 500,
  "Mental Health & Sleep": 350,
  "Sports Nutrition": 550,
};

const MARGIN_BANDS: Record<string, [number, number]> = {
  "Wellness & Supplements": [0.65, 0.75],
  "Functional Beverages": [0.45, 0.6],
  "Beauty & Personal Care": [0.6, 0.75],
  "Healthy Snacking": [0.35, 0.55],
  "Mental Health & Sleep": [0.55, 0.7],
  "Sports Nutrition": [0.45, 0.65],
};

type Row = {
  product: any;
  formats: string[];
  pricing: { trial: [number, number]; monthly: [number, number]; bundle: [number, number] };
  google: { series: number[]; growthPct: number; spikeiness: number; related: string[]; keywordUsed?: string };
  youtube: { recentCount: number; sampleTitles: string[]; totalResults: number; keywordUsed?: string };
  reddit: { mentionCount: number; sampleThreads: string[]; keywordUsed?: string };
  sourcesUsed: string[];
  sourceTimingsMs: { trends: number; youtube: number; reddit: number };
  proofStatus?: string;
};

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
    const keys = validateKeys();
    const catalog = (CATALOG[category] || []).slice(0, 8);

    if (!keys.serpApi && !keys.youtube) {
      const sample = getSampleTrends(category).slice(0, 8).map((x) => ({
        ...x,
        trend_name: cleanText(x.trend_name),
        image_data_uri: svgDataUriForProduct(cleanText(x.trend_name), category),
        thumbnail_url: svgDataUriForProduct(cleanText(x.trend_name), category),
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
        partialDataSources: ["Google Trends", "YouTube"],
        liveMode: false,
        discoveryCount: 8,
        timingsMs,
      });
      return;
    }

    let partialData = false;
    const partialDataSources = new Set<string>();
    const serpLimiter = pLimit(2);
    const rowLimiter = pLimit(4);
    const windowDays = getWindowDays(timeframeDays);

    const rows: Row[] = catalog.map((product) => {
      const { formats, pricing } = buildPricingAndFormats(product, category);
      return {
        product,
        formats,
        pricing,
        google: { series: [], growthPct: 0, spikeiness: 70, related: [] },
        youtube: { recentCount: 0, sampleTitles: [], totalResults: 0 },
        reddit: { mentionCount: 0, sampleThreads: [] },
        sourcesUsed: [],
        sourceTimingsMs: { trends: 0, youtube: 0, reddit: 0 },
      };
    });

    await Promise.all(
      rows.map((row) =>
        rowLimiter(async () => {
          const primary = cleanText(String(row.product.keywords?.[0] || "").toLowerCase());
          const fallbackKeywords = ((row.product.fallbackKeywords as string[] | undefined) || row.product.keywords?.slice(1, 3) || [])
            .map((k: string) => cleanText(String(k).toLowerCase()))
            .filter(Boolean);

          const trendsTask = (async () => {
            if (!keys.serpApi || !primary) return { ok: false };

            return serpLimiter(async () => {
              const s = Date.now();
              try {
                const gt = await fetchGoogleTrendsWithFallback(primary, fallbackKeywords, timeframeDays, {
                  onNetworkRequest: () => {},
                });
                row.sourceTimingsMs.trends += Date.now() - s;
                timingsMs.trends += Date.now() - s;
                return gt;
              } catch {
                row.sourceTimingsMs.trends += Date.now() - s;
                timingsMs.trends += Date.now() - s;
                return { ok: false };
              }
            });
          })();

          const youtubeTask = (async () => {
            if (!keys.youtube || !primary) return { ok: false };
            const s = Date.now();
            try {
              const yt = await fetchYoutubeWithFallback(primary, fallbackKeywords, windowDays);
              row.sourceTimingsMs.youtube += Date.now() - s;
              timingsMs.youtube += Date.now() - s;
              return yt;
            } catch {
              row.sourceTimingsMs.youtube += Date.now() - s;
              timingsMs.youtube += Date.now() - s;
              return { ok: false };
            }
          })();

          const redditTask = (async () => {
            const s = Date.now();
            try {
              const rd = await fetchRedditWithFallback(primary, fallbackKeywords, windowDays);
              row.sourceTimingsMs.reddit += Date.now() - s;
              timingsMs.reddit += Date.now() - s;
              return rd;
            } catch {
              row.sourceTimingsMs.reddit += Date.now() - s;
              timingsMs.reddit += Date.now() - s;
              return { ok: false };
            }
          })();

          const [trendsSettled, youtubeSettled, redditSettled] = await Promise.allSettled([trendsTask, youtubeTask, redditTask]);

          const gt = trendsSettled.status === "fulfilled" ? trendsSettled.value : { ok: false };
          const yt = youtubeSettled.status === "fulfilled" ? youtubeSettled.value : { ok: false };
          const rd = redditSettled.status === "fulfilled" ? redditSettled.value : { ok: false };

          const trendsValid =
            Boolean((gt as any)?.ok) &&
            (((gt as any)?.series?.length || 0) > 0 || Math.abs(Number((gt as any)?.growthPct || 0)) > 0);
          const youtubeValid =
            Boolean((yt as any)?.ok) &&
            (Number((yt as any)?.recentCount || 0) > 0 || Number((yt as any)?.totalResults || 0) > 0);
          const redditValid = Boolean((rd as any)?.ok) && Number((rd as any)?.mentionCount || 0) > 0;

          if (trendsValid) {
            row.google = {
              series: (gt as any).series || [],
              growthPct: Number((gt as any).growthPct || 0),
              spikeiness: Number((gt as any).spikeiness || 70),
              related: [],
              keywordUsed: (gt as any).keywordUsed || primary,
            };
            row.sourcesUsed.push("trends");
          } else {
            partialData = true;
            partialDataSources.add("Google Trends");
            row.google.keywordUsed = (gt as any)?.keywordUsed || primary;
          }

          if (youtubeValid) {
            row.youtube = {
              recentCount: Number((yt as any).recentCount || 0),
              sampleTitles: ((yt as any).sampleTitles || []).map((t: string) => cleanText(t)).slice(0, 2),
              totalResults: Number((yt as any).totalResults || 0),
              keywordUsed: (yt as any).keywordUsed || primary,
            };
            row.sourcesUsed.push("youtube");
          } else {
            partialData = true;
            partialDataSources.add("YouTube");
            row.youtube.keywordUsed = (yt as any)?.keywordUsed || primary;
          }

          if (redditValid) {
            row.reddit = {
              mentionCount: Number((rd as any).mentionCount || 0),
              sampleThreads: ((rd as any).sampleThreads || []).map((t: string) => cleanText(t)).slice(0, 2),
              keywordUsed: (rd as any).keywordUsed || primary,
            };
            row.sourcesUsed.push("reddit");
          } else {
            row.reddit.keywordUsed = (rd as any)?.keywordUsed || primary;
          }

          if (!trendsValid && !youtubeValid && !redditValid) {
            row.sourcesUsed = [];
            row.proofStatus = "Not enough public signal yet";
          }
        })
      )
    );

    const noPrimaryCoverage = rows.every((r) => !r.sourcesUsed.includes("trends") && !r.sourcesUsed.includes("youtube"));
    if (noPrimaryCoverage) {
      const sample = getSampleTrends(category).slice(0, 8).map((x) => ({
        ...x,
        trend_name: cleanText(x.trend_name),
        image_data_uri: svgDataUriForProduct(cleanText(x.trend_name), category),
        thumbnail_url: svgDataUriForProduct(cleanText(x.trend_name), category),
      }));
      timingsMs.total = Date.now() - t0;
      res.status(200).json({
        mode: "demo",
        reason: "Both Google Trends and YouTube signals unavailable",
        category,
        timeframeDays,
        candidatesDiscovered: 8,
        signalsUsed: ["Google Trends", "YouTube", "Reddit"],
        topPicks: sample.slice(0, 5),
        results: sample,
        partialData: true,
        partialDataSources: ["Google Trends", "YouTube"],
        liveMode: false,
        discoveryCount: 8,
        timingsMs,
      });
      return;
    }

    const results = rows.map((row) => {
      const hasTrends = row.sourcesUsed.includes("trends");
      const hasYoutube = row.sourcesUsed.includes("youtube");
      const hasReddit = row.sourcesUsed.includes("reddit");

      const dynamic = computeDynamicScores({
        google: row.google,
        youtube: row.youtube,
        reddit: row.reddit,
        hasTrends,
        hasYoutube,
        hasReddit,
      });

      const classification = classifyTrend({
        marketStrength: dynamic.marketStrength,
        willLastScore: dynamic.willLastScore,
        growingScore: dynamic.growingScore,
        spikeiness: row.google.spikeiness,
        strongSourceCount: dynamic.strongSourceCount,
      });

      const tamEstimateCr = Math.round((BASELINE_TAM[category] || 400) * (0.6 + dynamic.marketStrength / 200));
      const competitionFactor = row.youtube.totalResults
        ? Math.min(1, row.youtube.totalResults / 1000000)
        : Math.min(1, dynamic.ytMomentum / 100);
      const cacEstimateInr = Math.round(300 + competitionFactor * 1200);

      const marginBand = MARGIN_BANDS[category] || [0.45, 0.6];
      const marginMid = (marginBand[0] + marginBand[1]) / 2;
      const aov = (row.pricing.monthly[0] + row.pricing.monthly[1]) / 2;
      const roiX = Number(Math.max(0.2, Math.min(6, (aov * marginMid) / Math.max(cacEstimateInr, 1))).toFixed(2));
      const fadRiskLabel =
        row.google.spikeiness >= 85 && dynamic.marketStrength < 35 ? "High" : dynamic.willLastScore >= 60 ? "Low" : "Medium";

      const memo = buildFounderMemo({
        productName: cleanText(row.product.name),
        category,
        classification,
        formats: row.formats.map((f) => cleanText(f)),
        pricing: row.pricing,
        metrics: {
          growthPct: row.google.growthPct,
          recentCount: row.youtube.recentCount,
          mentionCount: row.reddit.mentionCount,
          marketStrength: dynamic.marketStrength,
          fadRiskLabel,
        },
      });

      return {
        id: row.product.id,
        category,
        trend_name: cleanText(row.product.name),
        trend_score: dynamic.marketStrength,
        market_strength: dynamic.marketStrength,
        classification,
        how_fast_its_growing: hasTrends || hasYoutube || hasReddit ? dynamic.growingScore : null,
        will_it_last: hasTrends || hasYoutube || hasReddit ? dynamic.willLastScore : null,
        money_potential: dynamic.marketStrength,
        creator_momentum: hasYoutube ? dynamic.ytMomentum : null,
        people_talking: hasReddit ? dynamic.redditBuzz : null,
        tam_estimate_cr: tamEstimateCr,
        cac_estimate_inr: cacEstimateInr,
        roi_estimate_x: roiX,
        fad_risk_label: fadRiskLabel,
        formats: row.formats.map((f) => cleanText(f)),
        pricing: row.pricing,
        image_data_uri: svgDataUriForProduct(cleanText(row.product.name), category),
        thumbnail_url: svgDataUriForProduct(cleanText(row.product.name), category),
        one_liner: cleanText(row.product.oneLiner),
        keywords: row.product.keywords,
        why_bullets: (memo.whyRealOrFad || []).map((x: string) => cleanText(x)),
        founder_brief: [memo.whatHappening, `Proof: ${memo.proof}`, memo.formatsAndPricing, memo.ninetyDayPlan]
          .map((x: string) => cleanText(x))
          .join("\n\n"),
        founder_memo: {
          ...memo,
          whatHappening: cleanText(memo.whatHappening),
          proof: cleanText(memo.proof),
          formatsAndPricing: cleanText(memo.formatsAndPricing),
          gtmIndia: cleanText(memo.gtmIndia),
          risksAndFixes: (memo.risksAndFixes || []).map((x: string) => cleanText(x)),
          ninetyDayPlan: cleanText(memo.ninetyDayPlan),
        },
        youtube_titles: row.youtube.sampleTitles,
        youtube_counts: {
          d7: row.youtube.recentCount || null,
          d30: timeframeDays >= 60 ? row.youtube.recentCount || null : null,
          d90: timeframeDays >= 180 ? row.youtube.recentCount || null : null,
        },
        reddit_counts: {
          d30: row.reddit.mentionCount || null,
          d90: timeframeDays >= 180 ? row.reddit.mentionCount || null : null,
        },
        google_trends_data: row.google.series,
        evidence_snippets: [memo.proof, ...memo.whyRealOrFad].map((x: string) => cleanText(x)),
        partial_data_note: "Full scan: Google Trends + YouTube (may take longer)",
        proof_status: row.proofStatus,
        sourcesUsed: row.sourcesUsed,
        keyword_used: {
          trends: row.google.keywordUsed || null,
          youtube: row.youtube.keywordUsed || null,
          reddit: row.reddit.keywordUsed || null,
        },
        rawSignals: {
          growthPct: hasTrends ? row.google.growthPct : null,
          spikeiness: hasTrends ? row.google.spikeiness : null,
          ytRecentCount: hasYoutube ? row.youtube.recentCount : null,
          ytTotalResults: hasYoutube ? row.youtube.totalResults : null,
          redditMentions: hasReddit ? row.reddit.mentionCount : null,
          sparklinePoints: hasTrends ? row.google.series.length : null,
        },
        trendsGrowthPct: hasTrends ? row.google.growthPct : null,
        trendsSparklinePointsCount: hasTrends ? row.google.series.length : null,
        youtubeRecentCount: hasYoutube ? row.youtube.recentCount : null,
        timings_ms: row.sourceTimingsMs,
        velocity: clamp(Math.round((dynamic.growingScore || 0) / 3.3), 0, 30),
        coherence: clamp(Math.round((dynamic.willLastScore || 0) / 5), 0, 20),
        competition: clamp(15 - Math.round((dynamic.ytMomentum || 0) / 10), 1, 15),
        entry_window: classification === "REAL TREND" ? "Early" : classification === "EARLY SIGNAL" ? "Optimal" : "Late",
        dominance_prob: clamp(Math.round(dynamic.marketStrength * 0.9), 0, 100),
        feasibility: clamp(Math.round(65 + dynamic.marketStrength * 0.2), 0, 100),
        fad_risk: clamp(100 - dynamic.willLastScore, 0, 100),
        structural_shift: clamp(dynamic.willLastScore, 0, 100),
        regulatory_risk: "Estimate only. Validate claims with compliant labeling before launch.",
        tam_band: `INR ${tamEstimateCr} Cr (Estimate)`,
        cac_band: `INR ${cacEstimateInr} (Estimate)`,
        margin_band: `${Math.round(marginBand[0] * 100)}-${Math.round(marginBand[1] * 100)}% (Estimate)`,
        payback_estimate: `ROI ${roiX}x (Estimate)`,
        price_ladder: `Trial INR ${row.pricing.trial[0]}-${row.pricing.trial[1]} | Monthly INR ${row.pricing.monthly[0]}-${row.pricing.monthly[1]} | Bundle INR ${row.pricing.bundle[0]}-${row.pricing.bundle[1]}`,
        format_recommendation: row.formats.map((f) => cleanText(f)).join(" / "),
        reddit_mentions: hasReddit ? [row.reddit.mentionCount] : [],
      };
    });

    results.sort((a, b) => b.market_strength - a.market_strength);
    const sliced = results.slice(0, Math.min(limit, 8));

    timingsMs.total = Date.now() - t0;
    console.log("[radar] timing", { ...timingsMs, category, timeframeDays });

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
      timingsMs,
    });
  } catch (error: any) {
    timingsMs.total = Date.now() - t0;
    console.log("[radar] failed", { error: error?.message, timingsMs });
    res.status(200).json({
      mode: "demo",
      reason: "Fallback after runtime error",
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
      timingsMs,
    });
  }
}
