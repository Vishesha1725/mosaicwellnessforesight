import { getCache, setCache } from "../cache.js";

export async function fetchYoutubeSignal(query: string, timeframeDays: number) {
  const key = process.env.YOUTUBE_API_KEY || "";
  if (!key) throw new Error("missing_youtube_key");

  const cacheKey = `yt:${query}:${timeframeDays}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&order=date&maxResults=15&q=${encodeURIComponent(query)}` +
    `&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("youtube_fetch_failed");
  const data = await res.json();
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
  setCache(cacheKey, normalized);
  return normalized;
}
