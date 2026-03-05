import { getCache, setCache } from "../cache.js";

function toSerpDate(days: number) {
  if (days <= 7) return "now 7-d";
  if (days <= 30) return "today 1-m";
  if (days <= 90) return "today 3-m";
  return "today 12-m";
}

function parseSeries(data: any): number[] {
  const timeline = data?.interest_over_time?.timeline_data || data?.timeline_data || [];
  if (!Array.isArray(timeline)) return [];
  return timeline
    .map((item: any) => Number(item?.values?.[0]?.extracted_value ?? item?.value ?? 0) || 0)
    .filter((x: number) => Number.isFinite(x));
}

function parseRelated(data: any): string[] {
  const rising = data?.related_queries?.rising || [];
  const top = data?.related_queries?.top || [];
  const merged = [...(Array.isArray(rising) ? rising : []), ...(Array.isArray(top) ? top : [])];
  return merged
    .map((x: any) => String(x?.query || "").trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

function calcGrowthPct(series: number[]) {
  if (series.length < 2) return 0;
  const first = Math.max(series[0], 1);
  const last = series[series.length - 1];
  return Math.round(((last - first) / first) * 100);
}

function calcSpikeiness(series: number[]) {
  if (series.length < 3) return 70;
  const mean = series.reduce((a, b) => a + b, 0) / series.length;
  const peak = Math.max(...series);
  const spike = (peak / Math.max(mean, 1)) * 20;
  return Math.max(0, Math.min(100, Math.round(spike)));
}

export async function fetchGoogleTrendsSignal(query: string, timeframeDays: number) {
  const keyName = process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY || process.env.SERP_API_KEY || "";
  if (!keyName) throw new Error("missing_serpapi_key");

  const cacheKey = `gt:${query}:${timeframeDays}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&geo=IN&date=${encodeURIComponent(toSerpDate(timeframeDays))}&api_key=${encodeURIComponent(keyName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("google_trends_fetch_failed");
  const data = await res.json();

  const series = parseSeries(data);
  const normalized = {
    series,
    growthPct: calcGrowthPct(series),
    spikeiness: calcSpikeiness(series),
    related: parseRelated(data),
  };
  setCache(cacheKey, normalized);
  return normalized;
}
