import { CACHE_TTL_MS, getCache, setCache } from "../cache.js";
import { fetchWithTimeout } from "../fetchWithTimeout.js";

type SerpOptions = { onNetworkRequest?: () => void };

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

function getSerpKey() {
  return process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY || process.env.SERP_API_KEY || "";
}

async function doSerpRequest(query: string, timeframeDays: number, extra: Record<string, string>, options?: SerpOptions) {
  const apiKey = getSerpKey();
  if (!apiKey) throw new Error("missing_serpapi_key");

  const params = new URLSearchParams({
    engine: "google_trends",
    q: query,
    geo: "IN",
    date: toSerpDate(timeframeDays),
    api_key: apiKey,
    ...extra,
  });

  options?.onNetworkRequest?.();
  const result = await fetchWithTimeout<any>(`https://serpapi.com/search.json?${params.toString()}`, undefined, 4500);
  if (!result.ok) {
    throw new Error(result.timeout ? "google_trends_timeout" : `google_trends_fetch_failed:${result.error || "unknown"}`);
  }
  return result.data;
}

export async function fetchGoogleTrendsSignal(query: string, timeframeDays: number, options?: SerpOptions) {
  const cacheKey = `serpapi:trends:${query}:${timeframeDays}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const data = await doSerpRequest(query, timeframeDays, {}, options);
  const series = parseSeries(data);
  const normalized = {
    series,
    growthPct: calcGrowthPct(series),
    spikeiness: calcSpikeiness(series),
    related: [] as string[],
  };
  setCache(cacheKey, normalized, CACHE_TTL_MS.serpapi);
  return normalized;
}

export async function fetchGoogleRelatedQueries(query: string, timeframeDays: number, options?: SerpOptions): Promise<string[]> {
  const cacheKey = `serpapi:related:${query}:${timeframeDays}`;
  const cached = getCache<string[]>(cacheKey);
  if (cached) return cached;

  const data = await doSerpRequest(query, timeframeDays, { data_type: "RELATED_QUERIES" }, options);
  const related = parseRelated(data);
  setCache(cacheKey, related, CACHE_TTL_MS.serpapi);
  return related;
}
