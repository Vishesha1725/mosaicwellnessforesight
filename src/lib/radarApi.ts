import { TrendData } from "@/data/mockTrends";

interface RadarRunResponse {
  category: string;
  timeframe: number;
  modeUsed?: "live" | "calc";
  results?: TrendData[];
  trends?: TrendData[];
  partialData: boolean;
  partialDataSources?: string[];
  perSourceStatus?: {
    trends: "live" | "calc" | "missing";
    youtube: "live" | "calc" | "missing";
    reddit: "live" | "calc" | "missing";
  };
  discoveryCount?: number;
  candidatesDiscovered?: number;
  topPicks?: TrendData[];
  timingsMs?: { total: number; trends: number; youtube: number; reddit: number };
}

export async function runLiveRadar(params: {
  category: string;
  timeframe: number;
  limit?: number;
  mode: "live" | "calc";
}): Promise<RadarRunResponse> {
  const response = await fetch("/api/radar/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Radar run failed (${response.status})`);
  }

  const data = (await response.json()) as RadarRunResponse;
  const normalizedResults = data.results ?? data.trends ?? [];
  return {
    ...data,
    results: normalizedResults,
    modeUsed: data.modeUsed ?? params.mode,
    perSourceStatus: data.perSourceStatus ?? {
      trends: params.mode === "calc" ? "calc" : "missing",
      youtube: params.mode === "calc" ? "calc" : "missing",
      reddit: params.mode === "calc" ? "calc" : "missing",
    },
    partialDataSources: data.partialDataSources ?? [],
    discoveryCount: data.discoveryCount ?? data.candidatesDiscovered ?? normalizedResults.length,
  };
}
