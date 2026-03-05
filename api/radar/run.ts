import { runRadar } from "../_lib/radarCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { category, timeframe, limit } = req.body || {};
    const data = await runRadar({ category, timeframe: Number(timeframe) || 90, limit });
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Radar run failed" });
  }
}
