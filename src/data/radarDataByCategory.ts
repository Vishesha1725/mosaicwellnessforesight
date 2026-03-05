import { TrendData } from "./mockTrends";

export const categoryFormatIdeas: Record<string, string[]> = {
  "Wellness & Supplements": ["capsules", "sachets", "gummies"],
  "Functional Beverages": ["shots", "soda", "mix sachet"],
  "Beauty & Personal Care": ["serum", "stick", "spray"],
  "Healthy Snacking": ["bars", "cups", "laddoos"],
  "Mental Health & Sleep": ["patches", "kits", "masks"],
  "Sports Nutrition": ["gels", "preworkout", "intra hydration"],
};

const categorySeeds: Record<string, string[]> = {
  "Wellness & Supplements": [
    "postbiotic gut capsules",
    "magnesium glycinate sleep stack",
    "electrolyte powder high potassium",
    "algae omega 3 softgels",
    "creatine for women",
    "nad supplement",
    "protein shots",
    "fatigue recovery kit",
    "iron b12 fatigue reset",
    "longevity lite supplements",
  ],
  "Functional Beverages": [
    "gut soda",
    "gut shots",
    "sleep tonic",
    "caffeine free focus drink",
    "electrolyte hydration",
    "protein iced coffee",
    "collagen drink",
    "coconut water electrolytes",
    "acv sparkling drink",
    "heat adaptation hydration",
  ],
  "Beauty & Personal Care": [
    "ceramide moisturizer",
    "scalp serum",
    "red light therapy mask",
    "sunscreen stick",
    "body acne spray",
    "fragrance free skincare",
    "peptide serum",
    "blue light skincare",
    "skin barrier repair cream",
    "microbiome scalp tonic",
  ],
  "Healthy Snacking": [
    "protein snacks india",
    "low sugar mithai",
    "prebiotic snacks",
    "electrolyte gummies",
    "seed bars",
    "high protein poha",
    "low GI snacks",
    "protein upma cup",
    "cycle support snacks",
    "fiber snack bites",
  ],
  "Mental Health & Sleep": [
    "mouth tape sleep",
    "nasal strips",
    "sleep gummies",
    "calm patches",
    "breathwork app",
    "dopamine detox kit",
    "glycine sleep",
    "weighted eye mask",
    "melatonin alternative",
    "blue light glasses",
  ],
  "Sports Nutrition": [
    "electrolyte gel",
    "creatine gummies",
    "protein coffee",
    "intra workout hydration",
    "plant protein blend",
    "recovery sleep stack",
    "joint collagen",
    "caffeine free preworkout",
    "runner hydration ors",
    "cycling performance gels",
  ],
};

const categoryPrefix: Record<string, string> = {
  "Wellness & Supplements": "ws",
  "Functional Beverages": "fb",
  "Beauty & Personal Care": "bp",
  "Healthy Snacking": "hs",
  "Mental Health & Sleep": "ms",
  "Sports Nutrition": "sn",
};

const formatMessage = (category: string) =>
  `Format ideas: ${categoryFormatIdeas[category].join(" / ")}.`;

const buildTrend = (category: string, seed: string, index: number): TrendData => {
  const rank = index + 1;
  const baseScore = Math.max(62, 92 - index * 3);
  const velocity = Math.max(13, 28 - index);
  const coherence = Math.max(10, 19 - Math.floor(index / 2));
  const competition = Math.min(12, 4 + index);
  const entryWindow: TrendData["entry_window"] =
    index < 4 ? "Early" : index < 8 ? "Optimal" : "Late";
  const dominanceProb = Math.max(41, 74 - index * 3);
  const feasibility = Math.max(66, 88 - index * 2);
  const fadRisk = Math.min(35, 14 + index * 2);
  const structuralShift = Math.max(58, 86 - index * 2);
  const start = 12 + index * 2;
  const growth = 4 + (10 - index);
  const timeline = Array.from({ length: 12 }, (_, m) => start + m * growth);
  const reddit = Array.from({ length: 12 }, (_, m) => 4 + index + m * Math.max(1, growth - 2));

  return {
    id: `${categoryPrefix[category]}-${rank}`,
    trend_name: seed,
    trend_score: baseScore,
    velocity,
    coherence,
    competition,
    entry_window: entryWindow,
    dominance_prob: dominanceProb,
    feasibility,
    fad_risk: fadRisk,
    structural_shift: structuralShift,
    regulatory_risk: "Use compliant claims and keep labeling aligned with FSSAI guidance.",
    tam_band: "INR 400-1,800 Cr",
    cac_band: "INR 150-420",
    margin_band: "48-72%",
    payback_estimate: "8-16 months",
    price_ladder: "Entry SKU -> Core pack -> Subscription bundle",
    format_recommendation: `${formatMessage(category)} Start with one hero SKU and one repeat-purchase bundle.`,
    founder_brief: `${seed} is showing early demand in Indian search behavior and community chatter. Keep the positioning simple: one clear promise, one clear usage moment, and strong repeat frequency. ${formatMessage(category)} Product ideas for founders: launch a hero format first, then a premium bundle once retention is stable.`,
    google_trends_data: timeline,
    reddit_mentions: reddit,
    evidence_snippets: [
      `Signal: ${seed} discussions are rising in India-first wellness communities.`,
      `Demand pattern: users are searching for easy daily formats and cleaner labels.`,
      `Execution note: win with better format + pricing clarity, not with complex claims.`,
    ],
  };
};

const buildCategoryTrends = (category: string): TrendData[] =>
  categorySeeds[category].map((seed, index) => buildTrend(category, seed, index));

export const radarDataByCategory: Record<string, TrendData[]> = {
  "Wellness & Supplements": buildCategoryTrends("Wellness & Supplements"),
  "Functional Beverages": buildCategoryTrends("Functional Beverages"),
  "Beauty & Personal Care": buildCategoryTrends("Beauty & Personal Care"),
  "Healthy Snacking": buildCategoryTrends("Healthy Snacking"),
  "Mental Health & Sleep": buildCategoryTrends("Mental Health & Sleep"),
  "Sports Nutrition": buildCategoryTrends("Sports Nutrition"),
};

