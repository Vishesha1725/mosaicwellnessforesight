import { runRadar } from "../../_lib/radarCore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await runRadar({ category: body.category, timeframe: Number(body.timeframe) || 90, limit: 10 });
    return Response.json(
      {
        source: "reddit",
        trends: data.results.map((t) => ({ keyword: t.trend_name, score: t.people_talking, counts: t.reddit_counts })),
        partialData: data.partialData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error?.message || "reddit route failed" }, { status: 500 });
  }
}
