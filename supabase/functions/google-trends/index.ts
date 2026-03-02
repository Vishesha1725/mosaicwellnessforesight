import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── helpers ──────────────────────────────────────────────────────────
function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((s, v) => s + v, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function daysToDateParam(days: number): string {
  if (days <= 30) return "today 1-m";
  if (days <= 90) return "today 3-m";
  if (days <= 180) return "today 6-m";
  return "today 12-m";
}

// ── SerpAPI fetch ────────────────────────────────────────────────────
async function fetchFromSerpApi(keyword: string, days: number) {
  const apiKey = Deno.env.get("SERPAPI_KEY");
  if (!apiKey) throw new Error("SERPAPI_KEY not set");

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_trends");
  url.searchParams.set("q", keyword);
  url.searchParams.set("geo", "IN");
  url.searchParams.set("date", daysToDateParam(days));
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SerpAPI ${res.status}: ${text}`);
  }
  const json = await res.json();

  const timelineRaw = json?.interest_over_time?.timeline_data || [];
  const timeline = timelineRaw.map((t: any) => ({
    date: t.date || "",
    value: Number(t.values?.[0]?.extracted_value ?? t.values?.[0]?.value ?? 0),
  }));

  return timeline as { date: string; value: number }[];
}

// ── metrics ──────────────────────────────────────────────────────────
function computeMetrics(timeline: { date: string; value: number }[]) {
  const vals = timeline.map((t) => t.value);
  if (vals.length < 4) {
    return { growth_pct: 0, acceleration: 0, velocity_score: 0 };
  }

  const windowSize = Math.min(14, Math.floor(vals.length / 3));
  const avgStart = vals.slice(0, windowSize).reduce((a, b) => a + b, 0) / windowSize;
  const avgEnd = vals.slice(-windowSize).reduce((a, b) => a + b, 0) / windowSize;
  const growth_pct = ((avgEnd - avgStart) / Math.max(avgStart, 1)) * 100;

  const halfLen = Math.min(30, Math.floor(vals.length / 2));
  const slopeRecent = linearSlope(vals.slice(-halfLen));
  const slopePrev = linearSlope(vals.slice(-halfLen * 2, -halfLen));
  const acceleration = slopeRecent - slopePrev;

  // normalize into 0-30
  const growthComponent = clamp(growth_pct / 10, 0, 20);
  const accelComponent = clamp(acceleration * 5, 0, 10);
  const velocity_score = Math.round(clamp(growthComponent + accelComponent, 0, 30));

  return {
    growth_pct: Math.round(growth_pct * 10) / 10,
    acceleration: Math.round(acceleration * 100) / 100,
    velocity_score,
  };
}

// ── main handler ─────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const keywords: string[] = body.keywords || [];
    const days: number = body.days || 90;

    if (!keywords.length) {
      return new Response(JSON.stringify({ error: "keywords required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const CACHE_HOURS = 6;
    const cutoff = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000).toISOString();

    // Check cache for all keywords
    const { data: cached } = await supabase
      .from("google_trends_cache")
      .select("*")
      .in("keyword", keywords)
      .eq("days", days)
      .gte("cached_at", cutoff);

    const cachedMap = new Map<string, any>();
    (cached || []).forEach((c: any) => cachedMap.set(c.keyword, c));

    const uncached = keywords.filter((k) => !cachedMap.has(k));
    const usingSample = !Deno.env.get("SERPAPI_KEY");
    let sampleFallback = false;

    // Fetch uncached keywords with concurrency limit of 4
    const CONCURRENCY = 4;
    const freshResults: any[] = [];

    for (let i = 0; i < uncached.length; i += CONCURRENCY) {
      const batch = uncached.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(async (keyword) => {
          try {
            const timeline = await fetchFromSerpApi(keyword, days);
            const metrics = computeMetrics(timeline);
            return { keyword, timeline, ...metrics };
          } catch (err) {
            console.error(`SerpAPI error for "${keyword}":`, err);
            // Generate sample fallback data
            sampleFallback = true;
            const sampleTimeline = Array.from({ length: 12 }, (_, i) => ({
              date: `Week ${i + 1}`,
              value: Math.round(20 + i * 3 + Math.random() * 10),
            }));
            const metrics = computeMetrics(sampleTimeline);
            return { keyword, timeline: sampleTimeline, ...metrics, sample: true };
          }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") freshResults.push(r.value);
      }
    }

    // Upsert fresh results to cache
    if (freshResults.length > 0) {
      const rows = freshResults.map((r) => ({
        keyword: r.keyword,
        days,
        timeline: r.timeline,
        growth_pct: r.growth_pct,
        acceleration: r.acceleration,
        velocity_score: r.velocity_score,
        cached_at: new Date().toISOString(),
      }));

      await supabase
        .from("google_trends_cache")
        .upsert(rows, { onConflict: "keyword,days" });
    }

    // Build final response
    const response = keywords.map((keyword) => {
      const fresh = freshResults.find((r) => r.keyword === keyword);
      if (fresh) {
        return {
          keyword: fresh.keyword,
          timeline: fresh.timeline,
          growth_pct: fresh.growth_pct,
          acceleration: fresh.acceleration,
          velocity_score: fresh.velocity_score,
          sample: fresh.sample || false,
        };
      }
      const c = cachedMap.get(keyword);
      if (c) {
        return {
          keyword: c.keyword,
          timeline: c.timeline,
          growth_pct: Number(c.growth_pct),
          acceleration: Number(c.acceleration),
          velocity_score: Number(c.velocity_score),
          sample: false,
        };
      }
      return {
        keyword,
        timeline: [],
        growth_pct: 0,
        acceleration: 0,
        velocity_score: 0,
        sample: true,
      };
    });

    return new Response(
      JSON.stringify({ results: response, sample_fallback: sampleFallback || usingSample }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("google-trends error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
