import { CACHE_TTL_MS, getCache, setCache } from "../cache.js";
import { fetchWithTimeout } from "../fetchWithTimeout.js";
import { cleanText } from "../text.js";

export async function fetchYoutubeSignal(query: string, timeframeDays: number) {
  const key = process.env.YOUTUBE_API_KEY || "";
  if (!key) throw new Error("missing_youtube_key");

  const cacheKey = `youtube:${query}:${timeframeDays}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&order=date&maxResults=15&q=${encodeURIComponent(query)}` +
    `&key=${encodeURIComponent(key)}`;

  const result = await fetchWithTimeout<any>(url, undefined, 8000);
  if (!result.ok) throw new Error(result.timeout ? "youtube_timeout" : "youtube_fetch_failed");
  const data = result.data;
  const items = Array.isArray(data?.items) ? data.items : [];

  const now = Date.now();
  const window = Math.max(7, timeframeDays);
  const recentCount = items.filter((item: any) => {
    const published = Date.parse(item?.snippet?.publishedAt || "");
    if (!Number.isFinite(published)) return false;
    const ageDays = (now - published) / (24 * 60 * 60 * 1000);
    return ageDays <= window;
  }).length;

  const normalized = {
    recentCount,
    sampleTitles: items.map((x: any) => x?.snippet?.title).filter(Boolean).slice(0, 2),
    totalResults: Number(data?.pageInfo?.totalResults || 0),
  };
  setCache(cacheKey, normalized, CACHE_TTL_MS.youtube);
  return normalized;
}

export async function fetchYoutubeWithFallback(primaryQuery: string, fallbackQueries: string[], timeframeDays: number) {
  const queue = [primaryQuery, ...(fallbackQueries || [])]
    .map((q) => cleanText(String(q || "").toLowerCase()))
    .filter(Boolean);

  for (const query of queue) {
    try {
      const signal = await fetchYoutubeSignal(query, timeframeDays);
      const valid = Number(signal.recentCount || 0) > 0 || Number(signal.totalResults || 0) > 0;
      if (valid) {
        return { ...signal, keywordUsed: query, ok: true as const };
      }
    } catch {
      // continue with fallback query
    }
  }

  return {
    recentCount: 0,
    sampleTitles: [] as string[],
    totalResults: 0,
    keywordUsed: cleanText(String(primaryQuery || "").toLowerCase()),
    ok: false as const,
  };
}
