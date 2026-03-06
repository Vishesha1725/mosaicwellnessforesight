import { runRadar } from "../../../../../api/_lib/radarCore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const modeNormalized: "live" | "calc" = body?.mode === "calc" ? "calc" : "live";

    const data = await runRadar({
      category: body.category,
      timeframe: Number(body.timeframe) || 90,
      limit: body.limit,
      mode: modeNormalized,
    });
    return Response.json(data, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Radar run failed" }, { status: 500 });
  }
}
