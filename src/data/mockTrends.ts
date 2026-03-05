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
  image_data_uri?: string;
  market_strength?: number | null;
  tam_estimate_cr?: number | null;
  cac_estimate_inr?: number | null;
  roi_estimate_x?: number | null;
  fad_risk_label?: "Low" | "Medium" | "High";
  formats?: string[];
  pricing?: { trial: [number, number]; monthly: [number, number]; bundle: [number, number] };
  founder_memo?: {
    whatHappening: string;
    proof: string;
    whyRealOrFad: string[];
    productWedge: string[];
    formatsAndPricing: string;
    gtmIndia: string;
    risksAndFixes: string[];
    ninetyDayPlan: string;
  };
  sourcesUsed?: string[];
  rawSignals?: {
    growthPct?: number | null;
    spikeiness?: number | null;
    ytRecentCount?: number | null;
    ytTotalResults?: number | null;
    redditMentions?: number | null;
    sparklinePoints?: number | null;
  };
  keyword_used?: { trends?: string | null; youtube?: string | null; reddit?: string | null };
  queryUsed?: { trends?: string | null; youtube?: string | null; reddit?: string | null };
  proof_status?: string;
  trendsGrowthPct?: number | null;
  trendsSparklinePointsCount?: number | null;
  youtubeRecentCount?: number | null;
  timings_ms?: { trends: number; youtube: number; reddit: number };
  one_liner?: string;
  keywords?: string[];
  youtube_titles?: string[];
  youtube_counts?: { d7?: number | null; d30?: number | null; d90?: number | null };
  reddit_counts?: { d30?: number | null; d90?: number | null };
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
