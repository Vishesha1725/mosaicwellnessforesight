export interface CalculatedSignals {
  growthPct: number;
  spikeiness: number;
  growingScore: number;
  willLastScore: number;
  marketStrength: number;
  youtubeRecentCount: { d7: number; d30: number; d90: number };
  redditMentions: { d30: number; d90: number };
  timeline: number[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRand(productId: string, timeframeDays: number, sourceName: string) {
  const seed = fnv1aHash(`${productId}:${timeframeDays}:${sourceName}`);
  return mulberry32(seed);
}

function timelinePointsForDays(days: number): number {
  if (days <= 7) return 7;
  if (days <= 30) return 12;
  if (days <= 90) return 18;
  return 24;
}

function buildTimeline(productId: string, timeframeDays: number, growthPct: number, spikeiness: number): number[] {
  const rand = seededRand(productId, timeframeDays, "trends-series");
  const points = timelinePointsForDays(timeframeDays);
  const start = 25 + rand() * 35;
  const end = start * (1 + growthPct / 100);
  const volatility = 3 + (spikeiness / 100) * 16;

  const series: number[] = [];
  for (let i = 0; i < points; i += 1) {
    const t = points === 1 ? 1 : i / (points - 1);
    const base = start + (end - start) * t;
    const wave = Math.sin((i + rand()) * 0.9) * volatility * 0.55;
    const jitter = (rand() - 0.5) * volatility;
    series.push(clamp(base + wave + jitter, 5, 100));
  }

  return series;
}

export function buildCalculatedSignals(productId: string, timeframeDays: number): CalculatedSignals {
  const trendRand = seededRand(productId, timeframeDays, "trends");
  const ytRand = seededRand(productId, timeframeDays, "youtube");
  const rdRand = seededRand(productId, timeframeDays, "reddit");

  const growthPct = clamp(8 + trendRand() * 130, 5, 160);
  const spikeiness = clamp(20 + trendRand() * 50, 15, 75);
  const growingScore = clamp(48 + growthPct * 0.32 + trendRand() * 10, 35, 98);
  const willLastScore = clamp(85 - spikeiness * 0.52 + trendRand() * 8, 30, 96);
  const marketStrength = clamp(growingScore * 0.35 + willLastScore * 0.4 + (22 + ytRand() * 62) * 0.25, 30, 97);

  const youtubeD90 = clamp(18 + ytRand() * 105, 12, 130);
  const youtubeD30 = clamp(youtubeD90 * (0.32 + ytRand() * 0.28), 8, youtubeD90 - 2);
  const youtubeD7 = clamp(youtubeD30 * (0.28 + ytRand() * 0.33), 3, youtubeD30 - 1);

  const redditD90 = clamp(16 + rdRand() * 140, 10, 160);
  const redditD30 = clamp(redditD90 * (0.35 + rdRand() * 0.3), 6, redditD90 - 2);

  const timeline = buildTimeline(productId, timeframeDays, growthPct, spikeiness);

  return {
    growthPct,
    spikeiness,
    growingScore,
    willLastScore,
    marketStrength,
    youtubeRecentCount: { d7: youtubeD7, d30: youtubeD30, d90: youtubeD90 },
    redditMentions: { d30: redditD30, d90: redditD90 },
    timeline,
  };
}
