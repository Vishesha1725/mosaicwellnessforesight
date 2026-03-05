import { runRadar } from "../_lib/radarCore.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { category, timeframe } = req.body || {};
    const data = await runRadar({ category, timeframe: Number(timeframe) || 90, limit: 5 });
    res.status(200).json({
      source: "google-trends",
      category: data.category,
      timeframe: data.timeframe,
      trends: data.results.map((t) => ({
        keyword: t.trend_name,
        timeline: t.google_timeline,
        growth_score: t.how_fast_its_growing,
        durability_score: t.will_it_last,
      })),
      partialData: data.partialData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "google trends route failed" });
  }
}
