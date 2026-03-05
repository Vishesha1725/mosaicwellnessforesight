import { runRadar } from "../_lib/radarCore.js";
import { getSampleTrends } from "../_lib/sampleTrends.js";
import { validateKeys } from "../_lib/env.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { category, timeframe, limit } = req.body || {};
    const keys = validateKeys();
    if (!keys.serpApi && !keys.youtube) {
      res.status(200).json({
        mode: "demo",
        reason: "Missing API keys",
        category: category || "Wellness & Supplements",
        timeframe: Number(timeframe) || 90,
        trends: getSampleTrends(category || "Wellness & Supplements"),
        partialData: true,
      });
      return;
    }
    const data = await runRadar({ category, timeframe: Number(timeframe) || 90, limit });
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Radar run failed" });
  }
}
