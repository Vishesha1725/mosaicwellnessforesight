import { validateKeys } from "../../lib/env";
import { fetchGoogleTrends } from "../../lib/signals/googleTrends";
import { fetchYoutubeVideos } from "../../lib/signals/youtube";

export type CategoryName =
  | "Wellness & Supplements"
  | "Functional Beverages"
  | "Beauty & Personal Care"
  | "Healthy Snacking"
  | "Mental Health & Sleep"
  | "Sports Nutrition";

export type TrendLabel = "REAL TREND" | "EARLY SIGNAL" | "FAD";

export interface TimePoint {
  date: string;
  value: number;
}

export interface DiscoveryTrend {
  id: string;
  category: CategoryName;
  trend_name: string;
  trend_score: number;
  classification: TrendLabel;
  how_fast_its_growing: number;
  will_it_last: number;
  creator_momentum: number;
  people_talking: number;
  money_potential: number;
  spikeiness: number;
  source_count: number;
  why_bullets: string[];
  founder_brief: string;
  format_recommendation: string;
  thumbnail_url?: string;
  youtube_titles: string[];
  youtube_counts: { d7: number; d30: number; d90: number };
  reddit_counts: { d30: number; d90: number };
  google_timeline: TimePoint[];
  partial_data_note?: string;
  velocity: number;
  coherence: number;
  competition: number;
  entry_window: "Early" | "Optimal" | "Late";
  dominance_prob: number;
  feasibility: number;
  fad_risk: number;
  structural_shift: number;
  regulatory_risk: string;
  tam_band: string;
  cac_band: string;
  margin_band: string;
  payback_estimate: string;
  price_ladder: string;
  google_trends_data: number[];
  reddit_mentions: number[];
  evidence_snippets: string[];
}

interface RunRadarInput {
  category: CategoryName;
  timeframe: number;
  limit?: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; data: unknown }>();

const GENERIC_BLOCKLIST = [
  "benefits",
  "meaning",
  "side effects",
  "what is",
  "uses",
  "price",
  "review",
  "near me",
  "amazon",
  "flipkart",
  "reddit",
  "youtube",
  "recipe",
  "wiki",
  "definition",
  "dosage",
  "before after",
  "vs",
  "comparison",
];

const CATEGORY_ANCHORS: Record<CategoryName, string[]> = {
  "Wellness & Supplements": [
    "magnesium glycinate",
    "postbiotic",
    "electrolyte powder",
    "algae omega 3",
    "creatine for women",
    "nad supplement",
  ],
  "Functional Beverages": [
    "protein coffee",
    "gut drink",
    "electrolyte drink",
    "sleep tonic",
    "collagen drink",
    "prebiotic drink",
  ],
  "Beauty & Personal Care": [
    "ceramide moisturizer",
    "sunscreen stick",
    "scalp serum",
    "peptide serum",
    "body acne spray",
    "red light therapy mask",
  ],
  "Healthy Snacking": [
    "protein snacks india",
    "low sugar mithai",
    "high protein poha",
    "prebiotic snacks",
    "seed bars",
    "low gi snacks",
  ],
  "Mental Health & Sleep": [
    "mouth tape sleep",
    "sleep gummies",
    "glycine sleep",
    "nasal strips",
    "weighted eye mask",
    "breathwork app",
  ],
  "Sports Nutrition": [
    "electrolyte gel",
    "protein coffee",
    "creatine gummies",
    "intra workout hydration",
    "plant protein blend",
    "caffeine free preworkout",
  ],
};

const CATEGORY_FORMATS: Record<CategoryName, string[]> = {
  "Wellness & Supplements": ["capsules", "sachets", "gummies"],
  "Functional Beverages": ["shots", "soda", "mix sachet"],
  "Beauty & Personal Care": ["serum", "stick", "spray"],
  "Healthy Snacking": ["bars", "cups", "laddoos"],
  "Mental Health & Sleep": ["patches", "kits", "masks"],
  "Sports Nutrition": ["gels", "preworkout", "intra hydration"],
};

const MONEY_BASE: Record<CategoryName, number> = {
  "Wellness & Supplements": 72,
  "Functional Beverages": 62,
  "Beauty & Personal Care": 70,
  "Healthy Snacking": 58,
  "Mental Health & Sleep": 64,
  "Sports Nutrition": 68,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getCache<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit || Date.now() > hit.expiresAt) {
    cache.delete(key);
    return null;
  }
  return hit.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, data });
}

function toSerpDate(days: number): string {
  if (days <= 7) return "now 7-d";
  if (days <= 30) return "today 1-m";
  if (days <= 90) return "today 3-m";
  return "today 12-m";
}

function cleanTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCandidateAllowed(term: string): boolean {
  if (term.length < 5 || term.length > 64) return false;
  return !GENERIC_BLOCKLIST.some((bad) => term.includes(bad));
}

function toTitleCase(text: string): string {
  return text
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

async function safeFetchJson(url: string, init?: RequestInit): Promise<any> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

function parseTimeline(json: any): TimePoint[] {
  const raw =
    json?.interest_over_time?.timeline_data ||
    json?.interest_over_time ||
    json?.timeline_data ||
    json?.default?.timelineData ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: any) => {
      const date = item?.date || item?.formattedTime || item?.time || "";
      const valueRaw =
        item?.values?.[0]?.extracted_value ??
        item?.values?.[0]?.value ??
        item?.value ??
        item?.extracted_value ??
        0;
      const value = Number(valueRaw) || 0;
      return { date: String(date), value };
    })
    .filter((p: TimePoint) => p.date && Number.isFinite(p.value));
}

function parseRelatedQueries(json: any): { query: string; score: number }[] {
  const rising = json?.related_queries?.rising || json?.rising || [];
  const top = json?.related_queries?.top || json?.top || [];
  const merged = [...(Array.isArray(rising) ? rising : []), ...(Array.isArray(top) ? top : [])];

  return merged
    .map((item: any) => {
      const q = cleanTerm(String(item?.query || item?.keyword || ""));
      const score = Number(item?.value || item?.extracted_value || 0);
      return { query: q, score: Number.isFinite(score) ? score : 0 };
    })
    .filter((x: { query: string; score: number }) => !!x.query);
}

function stats(values: number[]) {
  if (!values.length) {
    return { mean: 0, std: 0, max: 0, min: 0 };
  }
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  return { mean, std, max: Math.max(...values), min: Math.min(...values) };
}

function computeGrowthScore(values: number[]): { growthScore: number; growthPct: number; slope: number; acceleration: number } {
  if (values.length < 2) {
    return { growthScore: 0, growthPct: 0, slope: 0, acceleration: 0 };
  }

  const start = values[0] || 1;
  const end = values[values.length - 1];
  const growthPct = ((end - start) / Math.max(start, 1)) * 100;
  const slope = (end - start) / (values.length - 1);

  const mid = Math.floor(values.length / 2);
  const firstSlope = (values[mid] - values[0]) / Math.max(mid, 1);
  const secondSlope = (values[values.length - 1] - values[mid]) / Math.max(values.length - mid - 1, 1);
  const acceleration = secondSlope - firstSlope;

  const growthScore = clamp(growthPct * 0.45 + slope * 5 + acceleration * 4 + 35);
  return { growthScore, growthPct, slope, acceleration };
}

function computeDurability(values: number[]): { durability: number; spikeiness: number } {
  if (values.length < 3) return { durability: 0, spikeiness: 100 };

  const { mean, std, max } = stats(values);
  const peakIndex = values.findIndex((v) => v === max);
  const afterPeak = values.slice(Math.min(peakIndex + 1, values.length - 1));
  const afterPeakMean = afterPeak.length
    ? afterPeak.reduce((sum, v) => sum + v, 0) / afterPeak.length
    : values[values.length - 1];
  const dropAfterPeak = ((max - afterPeakMean) / Math.max(max, 1)) * 100;

  const peakDominance = (max / Math.max(mean, 1)) * 20;
  const volatilityPenalty = (std / Math.max(mean, 1)) * 50;
  const spikeiness = clamp(peakDominance + dropAfterPeak * 0.5 + volatilityPenalty * 0.3);

  const consistency = clamp(100 - volatilityPenalty);
  const durability = clamp(consistency * 0.6 + (100 - spikeiness) * 0.4);

  return { durability, spikeiness };
}

async function googleInterest(keyword: string, days: number): Promise<TimePoint[]> {
  const key = `gt:interest:${keyword}:${days}`;
  const hit = getCache<TimePoint[]>(key);
  if (hit) return hit;

  const keys = validateKeys();
  if (!keys.serpApi) throw new Error("missing_SERPAPI_API_KEY");
  const json = await fetchGoogleTrends(keyword, {
    date: toSerpDate(days),
    dataType: "TIMESERIES",
  });

  const timeline = parseTimeline(json);
  setCache(key, timeline);
  return timeline;
}

async function googleRelatedQueries(anchor: string, days: number): Promise<{ query: string; score: number }[]> {
  const key = `gt:related:${anchor}:${days}`;
  const hit = getCache<{ query: string; score: number }[]>(key);
  if (hit) return hit;

  const keys = validateKeys();
  if (!keys.serpApi) throw new Error("missing_SERPAPI_API_KEY");
  const json = await fetchGoogleTrends(anchor, {
    date: toSerpDate(days),
    dataType: "RELATED_QUERIES",
  });

  const related = parseRelatedQueries(json);
  setCache(key, related);
  return related;
}

async function youtubeSignal(keyword: string): Promise<{
  momentum: number;
  counts: { d7: number; d30: number; d90: number };
  titles: string[];
  thumbnail?: string;
}> {
  const key = `yt:${keyword}`;
  const hit = getCache<any>(key);
  if (hit) return hit;

  const keys = validateKeys();
  if (!keys.youtube) throw new Error("missing_YOUTUBE_API_KEY");

  const now = Date.now();
  const items = await fetchYoutubeVideos(keyword);

  let d7 = 0;
  let d30 = 0;
  let d90 = 0;
  for (const item of items) {
    const t = Date.parse(item?.snippet?.publishedAt || "");
    if (!Number.isFinite(t)) continue;
    const ageDays = (now - t) / (24 * 60 * 60 * 1000);
    if (ageDays <= 90) d90 += 1;
    if (ageDays <= 30) d30 += 1;
    if (ageDays <= 7) d7 += 1;
  }

  const momentum = clamp((d7 * 10 + d30 * 6 + d90 * 3) / 2);
  const titles = items
    .map((x: any) => x?.snippet?.title)
    .filter((x: unknown): x is string => typeof x === "string")
    .slice(0, 2);
  const thumbnail = items?.[0]?.snippet?.thumbnails?.medium?.url || items?.[0]?.snippet?.thumbnails?.default?.url;

  const data = { momentum, counts: { d7, d30, d90 }, titles, thumbnail };
  setCache(key, data);
  return data;
}

async function redditSignal(keyword: string): Promise<{ score: number; counts: { d30: number; d90: number } }> {
  const key = `rd:${keyword}`;
  const hit = getCache<any>(key);
  if (hit) return hit;

  const params = new URLSearchParams({
    q: keyword,
    sort: "new",
    t: "year",
    limit: "100",
  });

  const json = await safeFetchJson(`https://www.reddit.com/search.json?${params.toString()}`, {
    headers: { "User-Agent": "mosaic-foresight/1.0" },
  });

  const nowSec = Date.now() / 1000;
  const items = Array.isArray(json?.data?.children) ? json.data.children : [];
  let d30 = 0;
  let d90 = 0;
  for (const item of items) {
    const created = Number(item?.data?.created_utc || 0);
    if (!created) continue;
    const ageDays = (nowSec - created) / (60 * 60 * 24);
    if (ageDays <= 90) d90 += 1;
    if (ageDays <= 30) d30 += 1;
  }

  const score = clamp(d30 * 8 + d90 * 3);
  const data = { score, counts: { d30, d90 } };
  setCache(key, data);
  return data;
}

function buildFounderMemo(category: CategoryName, trendName: string, label: TrendLabel, growth: number, durability: number) {
  const formats = CATEGORY_FORMATS[category].join(" / ");
  return [
    `${toTitleCase(trendName)} is currently classified as ${label}.`,
    `Signal read: growth ${growth}/100 and durability ${durability}/100 in India.`,
    `Founder move: launch one simple hero SKU in ${formats}, then scale with bundles after repeat rate is stable.`,
  ].join(" ");
}

export async function runRadar(input: RunRadarInput): Promise<{
  category: CategoryName;
  timeframe: number;
  results: DiscoveryTrend[];
  partialData: boolean;
  partialDataSources: string[];
  liveMode: boolean;
  discoveryCount: number;
}> {
  const { category, timeframe } = input;
  const limit = Math.max(5, Math.min(10, input.limit ?? 10));
  const anchors = CATEGORY_ANCHORS[category] || [];

  const partialDataSources = new Set<string>();
  const candidateMap = new Map<string, { score: number; sourceAnchors: number }>();

  for (const anchor of anchors) {
    const normalizedAnchor = cleanTerm(anchor);
    candidateMap.set(normalizedAnchor, { score: 100, sourceAnchors: 1 });
    try {
      const related = await googleRelatedQueries(normalizedAnchor, timeframe);
      for (const rel of related.slice(0, 20)) {
        if (!isCandidateAllowed(rel.query)) continue;
        const prev = candidateMap.get(rel.query);
        if (prev) {
          prev.score = Math.max(prev.score, rel.score || 0);
          prev.sourceAnchors += 1;
        } else {
          candidateMap.set(rel.query, { score: rel.score || 0, sourceAnchors: 1 });
        }
      }
    } catch {
      partialDataSources.add("Google Trends related queries");
    }
  }

  const candidates = [...candidateMap.entries()]
    .filter(([term]) => isCandidateAllowed(term))
    .sort((a, b) => b[1].score + b[1].sourceAnchors * 20 - (a[1].score + a[1].sourceAnchors * 20))
    .slice(0, 30)
    .map(([term]) => term);

  const trends: DiscoveryTrend[] = [];

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];

    let timeline: TimePoint[] = [];
    let growthScore = 0;
    let growthPct = 0;
    let acceleration = 0;
    try {
      timeline = await googleInterest(candidate, timeframe);
      const growth = computeGrowthScore(timeline.map((t) => t.value));
      growthScore = growth.growthScore;
      growthPct = growth.growthPct;
      acceleration = growth.acceleration;
    } catch {
      partialDataSources.add("Google Trends interest over time");
    }

    const values = timeline.map((t) => t.value);
    const { durability, spikeiness } = computeDurability(values);

    let ytMomentum = 0;
    let youtubeCounts = { d7: 0, d30: 0, d90: 0 };
    let youtubeTitles: string[] = [];
    let thumbnail: string | undefined;
    try {
      const yt = await youtubeSignal(candidate);
      ytMomentum = yt.momentum;
      youtubeCounts = yt.counts;
      youtubeTitles = yt.titles;
      thumbnail = yt.thumbnail;
    } catch {
      partialDataSources.add("YouTube");
    }

    let redditScore = 0;
    let redditCounts = { d30: 0, d90: 0 };
    try {
      const rd = await redditSignal(candidate);
      redditScore = rd.score;
      redditCounts = rd.counts;
    } catch {
      partialDataSources.add("Reddit");
    }

    const moneyPotential = clamp(MONEY_BASE[category] + growthScore * 0.25 + durability * 0.1);

    const trendScore = clamp(
      durability * 0.34 + growthScore * 0.26 + ytMomentum * 0.16 + redditScore * 0.1 + moneyPotential * 0.14
    );

    const strongGrowth = growthScore >= 65;
    const strongCreator = ytMomentum >= 60;
    const sourceCount = [growthScore >= 55, ytMomentum >= 45, redditScore >= 35].filter(Boolean).length;

    let classification: TrendLabel = "EARLY SIGNAL";
    if (durability >= 60 && (strongGrowth || strongCreator) && sourceCount >= 2) {
      classification = "REAL TREND";
    } else if (spikeiness >= 72 || sourceCount <= 1) {
      classification = "FAD";
    }

    const whyBullets = [
      `Durability score ${durability}/100 (${spikeiness >= 60 ? "spiky" : "stable"} search pattern).`,
      `Growth signal ${growthScore}/100 with ${growthPct >= 0 ? "+" : ""}${clamp(growthPct, -999, 999)}% change in timeframe.`,
      `Cross-source proof: ${sourceCount}/3 strong sources (Google, YouTube, Reddit).`,
    ];

    const formatRecommendation = `Format ideas: ${CATEGORY_FORMATS[category].join(" / ")}.`;

    const entryWindow: "Early" | "Optimal" | "Late" =
      classification === "REAL TREND" ? "Early" : classification === "EARLY SIGNAL" ? "Optimal" : "Late";

    const trend: DiscoveryTrend = {
      id: `${category.slice(0, 2).toLowerCase()}-${i + 1}`,
      category,
      trend_name: toTitleCase(candidate),
      trend_score: trendScore,
      classification,
      how_fast_its_growing: growthScore,
      will_it_last: durability,
      creator_momentum: ytMomentum,
      people_talking: redditScore,
      money_potential: moneyPotential,
      spikeiness,
      source_count: sourceCount,
      why_bullets: whyBullets,
      founder_brief: buildFounderMemo(category, candidate, classification, growthScore, durability),
      format_recommendation: formatRecommendation,
      thumbnail_url: thumbnail,
      youtube_titles: youtubeTitles,
      youtube_counts: youtubeCounts,
      reddit_counts: redditCounts,
      google_timeline: timeline,
      partial_data_note: partialDataSources.size
        ? `Partial data used. Missing/limited: ${[...partialDataSources].join(", ")}.`
        : undefined,
      velocity: clamp((growthScore + ytMomentum) / 5, 0, 30),
      coherence: clamp((durability + sourceCount * 20) / 6, 0, 20),
      competition: clamp(15 - sourceCount * 3, 1, 15),
      entry_window: entryWindow,
      dominance_prob: clamp((trendScore + durability) / 2),
      feasibility: clamp(78 - (classification === "FAD" ? 10 : 0) + sourceCount * 4),
      fad_risk: clamp(spikeiness),
      structural_shift: clamp(durability + sourceCount * 8),
      regulatory_risk: "Keep ingredient and efficacy claims conservative and label-safe for India.",
      tam_band: moneyPotential >= 70 ? "INR 1,000 Cr+" : moneyPotential >= 55 ? "INR 500-1,000 Cr" : "INR 200-500 Cr",
      cac_band: "INR 180-420",
      margin_band: category === "Beauty & Personal Care" || category === "Wellness & Supplements" ? "60-75%" : "45-65%",
      payback_estimate: classification === "REAL TREND" ? "8-12 months" : "10-16 months",
      price_ladder: "Entry SKU -> Core pack -> Bundle/subscription",
      google_trends_data: timeline.map((t) => t.value),
      reddit_mentions: Array.from({ length: Math.max(timeline.length, 12) }, (_, idx) => {
        const base = redditCounts.d90 / Math.max(timeline.length, 1);
        return clamp(base + idx * 0.6, 0, 100);
      }),
      evidence_snippets: whyBullets,
    };

    trends.push(trend);
  }

  trends.sort((a, b) => b.trend_score - a.trend_score);
  const results = trends.slice(0, limit);

  const keys = validateKeys();
  const liveMode = keys.serpApi && keys.youtube;

  return {
    category,
    timeframe,
    results,
    partialData: partialDataSources.size > 0,
    partialDataSources: [...partialDataSources],
    liveMode,
    discoveryCount: candidates.length,
  };
}
