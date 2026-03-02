import { supabase } from "@/integrations/supabase/client";

export interface GoogleTrendsResult {
  keyword: string;
  timeline: { date: string; value: number }[];
  growth_pct: number;
  acceleration: number;
  velocity_score: number;
  sample: boolean;
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
    // Return empty sample results
    return {
      results: keywords.map((keyword) => ({
        keyword,
        timeline: [],
        growth_pct: 0,
        acceleration: 0,
        velocity_score: 0,
        sample: true,
      })),
      sample_fallback: true,
    };
  }

  return data as { results: GoogleTrendsResult[]; sample_fallback: boolean };
}
