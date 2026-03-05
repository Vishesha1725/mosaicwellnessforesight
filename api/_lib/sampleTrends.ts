export function getSampleTrends(category: string) {
  const seed = [
    "magnesium glycinate sleep stack",
    "gut soda",
    "ceramide moisturizer",
    "protein snacks india",
    "glycine sleep",
    "electrolyte gel",
  ];

  return seed.slice(0, 6).map((name, idx) => ({
    id: `demo-${idx + 1}`,
    category,
    trend_name: name
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    trend_score: 70 - idx,
    classification: "EARLY SIGNAL",
    how_fast_its_growing: 55,
    will_it_last: 52,
    creator_momentum: 40,
    people_talking: 32,
    money_potential: 58,
    spikeiness: 35,
    source_count: 1,
    why_bullets: [
      "Demo result generated because live API keys are missing.",
      "Use this to verify UI flow and cards.",
      "Add keys in Vercel to switch to Live Data Mode.",
    ],
    founder_brief: "Demo memo: add API keys to enable real discovery and proof signals.",
    format_recommendation: "Format ideas: capsules / sachets / gummies.",
    youtube_titles: [],
    youtube_counts: { d7: 0, d30: 0, d90: 0 },
    reddit_counts: { d30: 0, d90: 0 },
    google_timeline: [],
    velocity: 12,
    coherence: 10,
    competition: 7,
    entry_window: "Optimal",
    dominance_prob: 48,
    feasibility: 65,
    fad_risk: 38,
    structural_shift: 50,
    regulatory_risk: "Demo mode",
    tam_band: "INR 200-500 Cr",
    cac_band: "INR 180-420",
    margin_band: "45-65%",
    payback_estimate: "10-16 months",
    price_ladder: "Entry SKU -> Core pack -> Bundle",
    google_trends_data: [20, 24, 28, 31, 34, 36, 37, 39, 40, 42, 44, 46],
    reddit_mentions: [5, 6, 6, 7, 7, 8, 8, 9, 10, 10, 11, 12],
    evidence_snippets: ["Demo signal"],
  }));
}
