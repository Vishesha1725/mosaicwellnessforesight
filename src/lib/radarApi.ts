import { TrendData } from "@/data/mockTrends";

interface RadarRunResponse {
  category: string;
  timeframe: number;
  results: TrendData[];
  partialData: boolean;
  partialDataSources: string[];
  liveMode: boolean;
  discoveryCount: number;
}

export async function runLiveRadar(params: {
  category: string;
  timeframe: number;
  limit?: number;
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

  return response.json();
}
