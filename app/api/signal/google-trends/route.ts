import { runRadar } from "../../_lib/radarCore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await runRadar({ category: body.category, timeframe: Number(body.timeframe) || 90, limit: 5 });
    return Response.json(
      {
        source: "google-trends",
        trends: data.results.map((t) => ({ keyword: t.trend_name, timeline: t.google_timeline })),
        partialData: data.partialData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error?.message || "google trends route failed" }, { status: 500 });
  }
}
