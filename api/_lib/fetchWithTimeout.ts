export type TimeoutFetchResult<T = any> = {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
  timeout?: boolean;
};

export async function fetchWithTimeout<T = any>(url: string, init?: RequestInit, timeoutMs = 3000): Promise<TimeoutFetchResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...(init || {}), signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: body || `http_${res.status}`, status: res.status };
    }
    const data = (await res.json()) as T;
    return { ok: true, data, status: res.status };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return { ok: false, timeout: true, error: "timeout" };
    }
    return { ok: false, error: error?.message || "fetch_error" };
  } finally {
    clearTimeout(timer);
  }
}
