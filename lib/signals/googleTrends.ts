export async function fetchGoogleTrends(query: string, options?: { date?: string; dataType?: "TIMESERIES" | "RELATED_QUERIES" }) {
  const params = new URLSearchParams({
    engine: "google_trends",
    q: query,
    geo: "IN",
    hl: "en",
    api_key: process.env.SERPAPI_API_KEY || "",
  });

  if (options?.date) params.set("date", options.date);
  if (options?.dataType) params.set("data_type", options.dataType);

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("SerpAPI request failed");
  const data = await res.json();
  return data;
}
