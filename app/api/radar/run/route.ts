import { runRadar } from "../../_lib/radarCore";
import { getSampleTrends } from "../../../../../api/_lib/sampleTrends";
import { validateKeys } from "../../../../../lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keys = validateKeys();

    if (!keys.serpApi && !keys.youtube) {
      return Response.json(
        {
          mode: "demo",
          reason: "Missing API keys",
          category: body?.category || "Wellness & Supplements",
          timeframe: Number(body?.timeframe) || 90,
          trends: getSampleTrends(body?.category || "Wellness & Supplements"),
          partialData: true,
        },
        { status: 200 }
      );
    }

    const data = await runRadar({
      category: body.category,
      timeframe: Number(body.timeframe) || 90,
      limit: body.limit,
    });
    return Response.json(data, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error?.message || "Radar run failed" }, { status: 500 });
  }
}
