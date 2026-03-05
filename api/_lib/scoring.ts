const BASELINE_TAM: Record<string, number> = {
  "Wellness & Supplements": 600,
  "Functional Beverages": 450,
  "Beauty & Personal Care": 900,
  "Healthy Snacking": 500,
  "Mental Health & Sleep": 350,
  "Sports Nutrition": 550,
};

const MARGIN_BANDS: Record<string, [number, number]> = {
  "Wellness & Supplements": [0.65, 0.75],
  "Functional Beverages": [0.45, 0.6],
  "Beauty & Personal Care": [0.6, 0.75],
  "Healthy Snacking": [0.35, 0.55],
  "Mental Health & Sleep": [0.55, 0.7],
  "Sports Nutrition": [0.45, 0.65],
};

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

export function scoreProduct(params: {
  category: string;
  google: { series: number[]; growthPct: number; spikeiness: number };
  youtube: { recentCount: number; totalResults?: number };
  reddit: { mentionCount: number };
  pricing: { monthly: [number, number] };
}) {
  const { category, google, youtube, reddit, pricing } = params;
  const series = google.series || [];
  const slope = series.length > 1 ? (series[series.length - 1] - series[0]) / (series.length - 1) : 0;
  const volatility = series.length > 2 ? Math.abs((series[1] || 0) - (series[0] || 0)) : 0;

  const growingScore = clamp(40 + google.growthPct * 0.6 + slope * 4);
  const willLastScore = clamp(100 - google.spikeiness - volatility * 1.5);
  const creatorMomentumScore = clamp(youtube.recentCount * 8);
  const buzzScore = clamp(reddit.mentionCount * 8);

  const marketStrength = clamp(0.4 * willLastScore + 0.3 * growingScore + 0.2 * creatorMomentumScore + 0.1 * buzzScore);

  const strongSources = [growingScore >= 55, creatorMomentumScore >= 40, buzzScore >= 30].filter(Boolean).length;
  const fadRiskLabel = google.spikeiness >= 65 || strongSources <= 1 ? "High" : willLastScore >= 65 && strongSources >= 2 ? "Low" : "Medium";

  const tamEstimateCr = Math.round((BASELINE_TAM[category] || 400) * (0.6 + marketStrength / 200));
  const competitionFactor = youtube.totalResults ? Math.min(1, youtube.totalResults / 1000000) : Math.min(1, creatorMomentumScore / 100);
  const cacEstimateInr = Math.round(300 + competitionFactor * 1200);

  const marginBand = MARGIN_BANDS[category] || [0.45, 0.6];
  const marginMid = (marginBand[0] + marginBand[1]) / 2;
  const aov = (pricing.monthly[0] + pricing.monthly[1]) / 2;
  const grossProfit = aov * marginMid;
  const roiX = Math.max(0.2, Math.min(6, grossProfit / Math.max(cacEstimateInr, 1)));

  return {
    growingScore,
    willLastScore,
    creatorMomentumScore,
    buzzScore,
    marketStrength,
    fadRiskLabel,
    tamEstimateCr,
    cacEstimateInr,
    roiX: Number(roiX.toFixed(2)),
    marginBandLabel: `${Math.round(marginBand[0] * 100)}-${Math.round(marginBand[1] * 100)}%`,
  };
}
