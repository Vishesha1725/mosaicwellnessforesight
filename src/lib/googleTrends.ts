import { supabase } from "@/integrations/supabase/client";

export interface GoogleTrendsResult {
  keyword: string;
  timeline: { date: string; value: number }[];
  growth_pct: number;
  acceleration: number;
  velocity_score: number;
  sample: boolean;
  source: "serpapi" | "sample";
  reason: string;
}

export async function fetchGoogleTrendsData(
  keywords: string[],
  days: number
): Promise<{ results: GoogleTrendsResult[]; sample_fallback: boolean }> {
  const { data, error } = await supabase.functions.invoke("google-trends", {
    body: { keywords, days },
  });

  if (error) {
    console.error("Google Trends fetch error:", error);
    return {
      results: keywords.map((keyword) => ({
        keyword,
        timeline: [],
        growth_pct: 0,
        acceleration: 0,
        velocity_score: 0,
        sample: true,
        source: "sample" as const,
        reason: "fetch_error",
      })),
      sample_fallback: true,
    };
  }

  console.log("[Radar] Google Trends response:", {
    sample_fallback: data.sample_fallback,
    results_count: data.results?.length,
    sources: data.results?.map((r: any) => `${r.keyword}: ${r.source} (${r.reason})`),
  });

  return data as { results: GoogleTrendsResult[]; sample_fallback: boolean };
}