import { runRadar } from "../../../../../api/_lib/radarCore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await runRadar({ category: body.category, timeframe: Number(body.timeframe) || 90, limit: 10 });
    return Response.json(
      {
        source: "youtube",
        trends: data.results.map((t) => ({ keyword: t.trend_name, momentum: t.creator_momentum, counts: t.youtube_counts })),
        partialData: data.partialData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error?.message || "youtube route failed" }, { status: 500 });
  }
}
