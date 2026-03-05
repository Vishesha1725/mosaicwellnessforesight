import { getCache, setCache } from "../cache.js";

export async function fetchRedditSignal(query: string, timeframeDays: number) {
  const cacheKey = `rd:${query}:${timeframeDays}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=new&limit=30&t=year`;
  const res = await fetch(url, { headers: { "User-Agent": "mosaic-foresight/1.0" } });
  if (!res.ok) throw new Error("reddit_fetch_failed");
  const data = await res.json();

  const nowSec = Date.now() / 1000;
  const items = Array.isArray(data?.data?.children) ? data.data.children : [];
  const mentionCount = items.filter((x: any) => {
    const t = Number(x?.data?.created_utc || 0);
    if (!t) return false;
    const ageDays = (nowSec - t) / (24 * 60 * 60);
    return ageDays <= Math.max(30, timeframeDays);
  }).length;

  const normalized = {
    mentionCount,
    sampleThreads: items.map((x: any) => x?.data?.title).filter(Boolean).slice(0, 2),
  };
  setCache(cacheKey, normalized);
  return normalized;
}
