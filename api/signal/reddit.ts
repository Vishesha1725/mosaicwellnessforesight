import { runRadar } from "../../app/api/_lib/radarCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { category, timeframe } = req.body || {};
    const data = await runRadar({ category, timeframe: Number(timeframe) || 90, limit: 10 });
    res.status(200).json({
      source: "reddit",
      category: data.category,
      trends: data.results.map((t) => ({
        keyword: t.trend_name,
        people_talking: t.people_talking,
        reddit_counts: t.reddit_counts,
      })),
      partialData: data.partialData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "reddit route failed" });
  }
}
