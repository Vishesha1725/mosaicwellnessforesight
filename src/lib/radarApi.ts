import { TrendData } from "@/data/mockTrends";

interface RadarRunResponse {
  category: string;
  timeframe: number;
  mode?: "live" | "demo";
  reason?: string;
  results?: TrendData[];
  trends?: TrendData[];
  partialData: boolean;
  partialDataSources?: string[];
  liveMode?: boolean;
  discoveryCount?: number;
  candidatesDiscovered?: number;
  topPicks?: TrendData[];
  serpapiBudget?: { used: number; max: number; budgetMode: boolean };
  timingsMs?: { total: number; trends: number; youtube: number; reddit: number };
}

export async function runLiveRadar(params: {
  category: string;
  timeframe: number;
  limit?: number;
  budgetMode?: boolean;
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
  const liveMode = data.liveMode ?? data.mode !== "demo";
  return {
    ...data,
    results: normalizedResults,
    liveMode,
    partialDataSources: data.partialDataSources ?? [],
    discoveryCount: data.discoveryCount ?? data.candidatesDiscovered ?? normalizedResults.length,
  };
}
