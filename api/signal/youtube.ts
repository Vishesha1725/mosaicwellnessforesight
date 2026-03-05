import { runRadar } from "../_lib/radarCore.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { category, timeframe } = req.body || {};
    const data = await runRadar({ category, timeframe: Number(timeframe) || 90, limit: 10 });
    res.status(200).json({
      source: "youtube",
      category: data.category,
      trends: data.results.map((t) => ({
        keyword: t.trend_name,
        creator_momentum: t.creator_momentum,
        youtube_counts: t.youtube_counts,
        youtube_titles: t.youtube_titles,
        thumbnail_url: t.thumbnail_url,
      })),
      partialData: data.partialData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "youtube route failed" });
  }
}
