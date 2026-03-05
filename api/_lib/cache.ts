type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

export const CACHE_TTL_MS = {
  serpapi: 60 * 60 * 1000,
  youtube: 30 * 60 * 1000,
  reddit: 15 * 60 * 1000,
};

export function getCache<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs = 10 * 60 * 1000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
