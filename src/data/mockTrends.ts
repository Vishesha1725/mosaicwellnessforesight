import { categories } from "./categoryConfig";

export interface TrendData {
  id: string;
  trend_name: string;
  trend_score: number;
  category?: string;
  classification?: "REAL TREND" | "EARLY SIGNAL" | "FAD";
  how_fast_its_growing?: number;
  will_it_last?: number;
  money_potential?: number;
  creator_momentum?: number;
  people_talking?: number;
  why_bullets?: string[];
  thumbnail_url?: string;
  youtube_titles?: string[];
  youtube_counts?: { d7: number; d30: number; d90: number };
  reddit_counts?: { d30: number; d90: number };
  partial_data_note?: string;
  velocity: number;
  coherence: number;
  competition: number;
  entry_window: "Early" | "Optimal" | "Late";
  dominance_prob: number;
  feasibility: number;
  fad_risk: number;
  structural_shift: number;
  regulatory_risk: string;
  tam_band: string;
  cac_band: string;
  margin_band: string;
  payback_estimate: string;
  price_ladder: string;
  format_recommendation: string;
  founder_brief: string;
  google_trends_data: number[];
  reddit_mentions: number[];
  evidence_snippets: string[];
}

export const timeWindows = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "12 Months", value: 365 },
];
