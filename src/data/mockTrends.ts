export interface TrendData {
  id: string;
  trend_name: string;
  trend_score: number;
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

export const mockTrends: TrendData[] = [
  {
    id: "1",
    trend_name: "Ashwagandha Gummies",
    trend_score: 87,
    velocity: 26,
    coherence: 18,
    competition: 6,
    entry_window: "Optimal",
    dominance_prob: 72,
    feasibility: 85,
    fad_risk: 18,
    structural_shift: 78,
    regulatory_risk: "FSSAI approved ingredient. Low regulatory barrier for supplements.",
    tam_band: "₹1,200–1,800 Cr",
    cac_band: "₹180–350",
    margin_band: "62–71%",
    payback_estimate: "8–12 months",
    price_ladder: "₹499 (30ct) → ₹899 (60ct) → ₹1,499 (90ct subscription)",
    format_recommendation: "Gummies first, then powder sachets for B2B/HoReCa channel",
    founder_brief: "Ashwagandha gummies represent a structural shift in adaptogen delivery. Google Trends shows 3.2x growth over 180 days in India, corroborated by Reddit discussions shifting from curiosity to purchase intent. The gummy format solves the bitter taste barrier that limited powder adoption. Entry window is optimal—first-movers like Wellbeing Nutrition exist but no dominant D2C brand has emerged. Capital efficiency is strong: contract manufacturing is available at scale in Baddi/Haridwar. Recommend launching with a hero SKU at ₹499, building a subscription moat early.",
    google_trends_data: [20, 22, 25, 28, 32, 35, 40, 45, 52, 58, 65, 72],
    reddit_mentions: [5, 8, 12, 15, 22, 28, 35, 42, 55, 68, 78, 85],
    evidence_snippets: [
      "r/IndianSkincareAddicts: 'Finally found ashwagandha gummies that don't taste like dirt. Game changer for my stress.'",
      "r/india: 'The wellness supplement market here is exploding. Ashwagandha everything now.'",
      "r/Supplements: 'Indian brands making adaptogen gummies are way more affordable than US ones.'"
    ],
  },
  {
    id: "2",
    trend_name: "Collagen Peptide Drinks",
    trend_score: 81,
    velocity: 23,
    coherence: 16,
    competition: 9,
    entry_window: "Early",
    dominance_prob: 65,
    feasibility: 78,
    fad_risk: 25,
    structural_shift: 70,
    regulatory_risk: "Marine collagen sourcing needs import compliance. Plant-based alternatives emerging.",
    tam_band: "₹800–1,400 Cr",
    cac_band: "₹250–450",
    margin_band: "55–65%",
    payback_estimate: "12–16 months",
    price_ladder: "₹299 (single) → ₹1,999 (7-pack) → ₹6,999 (30-day kit)",
    format_recommendation: "Ready-to-drink shots, then powdered sachets for scaling",
    founder_brief: "Collagen peptide drinks are riding the 'beauty from within' wave. Search velocity is accelerating but market is still early-stage in India with limited quality options. Reddit sentiment shows high curiosity paired with price sensitivity. The key advantage: marine collagen RTD is a format gap — most Indian brands sell powders. First-mover in convenient format wins. Watch out for plant-based collagen alternatives gaining traction.",
    google_trends_data: [10, 12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 58],
    reddit_mentions: [3, 5, 8, 10, 14, 18, 22, 28, 35, 42, 50, 56],
    evidence_snippets: [
      "r/30PlusSkinCare: 'Looking for good collagen drinks in India. Most options are overpriced powders.'",
      "r/IndianBeautyDeals: 'Korean collagen drinks are ₹500/bottle. Someone please make an affordable Indian version.'",
      "r/Supplements: 'Marine collagen peptides > bovine. The science is clear.'"
    ],
  },
  {
    id: "3",
    trend_name: "Probiotic Sparkling Water",
    trend_score: 76,
    velocity: 28,
    coherence: 14,
    competition: 4,
    entry_window: "Early",
    dominance_prob: 68,
    feasibility: 72,
    fad_risk: 30,
    structural_shift: 62,
    regulatory_risk: "Novel food category. May need FSSAI product approval for probiotic claims.",
    tam_band: "₹400–900 Cr",
    cac_band: "₹200–400",
    margin_band: "48–58%",
    payback_estimate: "14–20 months",
    price_ladder: "₹79 (single) → ₹449 (6-pack) → ₹1,599 (24-pack subscription)",
    format_recommendation: "Slim cans, 250ml. Start with 3 flavors. Metro focus.",
    founder_brief: "Probiotic sparkling water sits at the intersection of gut health and premium beverages — two mega-trends converging. Velocity is the highest in this cohort at 28, but coherence between search and social signals is moderate. This suggests early-adopter buzz hasn't crossed into mainstream yet. The competition score of 4 is extremely low — virtually no Indian brand owns this space. Risk: cold chain complexity and FSSAI approval timeline. Recommendation: start with metro D2C, build brand, then negotiate modern trade shelf space.",
    google_trends_data: [5, 7, 10, 14, 18, 25, 32, 40, 50, 58, 65, 70],
    reddit_mentions: [2, 3, 4, 6, 10, 14, 18, 22, 28, 32, 38, 42],
    evidence_snippets: [
      "r/india: 'Had kombucha for the first time. Why isn't there a simpler probiotic drink option?'",
      "r/HealthyFood: 'Probiotic sparkling water is huge in the US. Olipop, Poppi — when will India get these?'",
      "r/mumbai: 'Would love a healthy alternative to soda that actually tastes good.'"
    ],
  },
  {
    id: "4",
    trend_name: "Sleep Supplement Strips",
    trend_score: 73,
    velocity: 21,
    coherence: 17,
    competition: 8,
    entry_window: "Optimal",
    dominance_prob: 58,
    feasibility: 82,
    fad_risk: 22,
    structural_shift: 68,
    regulatory_risk: "Melatonin regulations evolving. Stick to herbal formulations for safety.",
    tam_band: "₹600–1,100 Cr",
    cac_band: "₹150–300",
    margin_band: "70–78%",
    payback_estimate: "6–10 months",
    price_ladder: "₹349 (15 strips) → ₹599 (30 strips) → ₹1,499 (90-day subscription)",
    format_recommendation: "Oral dissolving strips. Melatonin-free herbal formula.",
    founder_brief: "Sleep supplements are a validated category but the strip format is a genuine innovation for Indian consumers. High margin, low COGS, easy shipping. The coherence score of 17 shows strong signal alignment — people are searching AND discussing sleep solutions. Competition exists in tablets/capsules but strips are differentiated enough. Key risk: melatonin regulatory uncertainty. Mitigate by going herbal (Valerian + L-Theanine + Chamomile). Payback is fastest in this cohort at 6-10 months.",
    google_trends_data: [15, 18, 20, 22, 25, 28, 32, 36, 40, 44, 48, 52],
    reddit_mentions: [8, 10, 12, 15, 18, 22, 26, 30, 35, 40, 45, 50],
    evidence_snippets: [
      "r/india: 'My sleep schedule is wrecked. Are those dissolving strips legit?'",
      "r/Nootropics: 'Oral strips for supplements are genius. Sublingual absorption > pills.'",
      "r/bangalore: 'Every other person I know has insomnia. The sleep economy is real.'"
    ],
  },
  {
    id: "5",
    trend_name: "Protein Ice Cream",
    trend_score: 69,
    velocity: 19,
    coherence: 12,
    competition: 11,
    entry_window: "Late",
    dominance_prob: 45,
    feasibility: 65,
    fad_risk: 40,
    structural_shift: 52,
    regulatory_risk: "Standard food product. Ice cream regulations well established.",
    tam_band: "₹300–700 Cr",
    cac_band: "₹300–550",
    margin_band: "40–52%",
    payback_estimate: "18–24 months",
    price_ladder: "₹199 (pint) → ₹549 (3-pack) → ₹1,799 (variety 6-pack)",
    format_recommendation: "Pints first, then bars. Cold chain is the bottleneck.",
    founder_brief: "Protein ice cream has strong consumer appeal but the entry window is closing. Multiple brands have launched or are launching. Cold chain logistics in India remain challenging and capital-intensive. The coherence score of 12 suggests search interest outpaces social discussion — possible inflated demand signal. Fad risk is the highest in this cohort at 40%. Not recommended as a primary bet unless you have existing cold chain infrastructure or a strategic partnership with a dairy company.",
    google_trends_data: [30, 32, 34, 36, 38, 40, 42, 44, 45, 46, 47, 48],
    reddit_mentions: [12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    evidence_snippets: [
      "r/IndianFitness: 'Halo Top finally came to India but it's ₹599 for a tiny tub. Need affordable options.'",
      "r/india: 'Protein ice cream feels like a gimmick. Just eat regular ice cream and add a scoop of whey.'",
      "r/Fitness: 'The protein ice cream market is getting saturated fast.'"
    ],
  },
  {
    id: "6",
    trend_name: "Mushroom Coffee Blends",
    trend_score: 82,
    velocity: 25,
    coherence: 15,
    competition: 5,
    entry_window: "Early",
    dominance_prob: 70,
    feasibility: 75,
    fad_risk: 28,
    structural_shift: 65,
    regulatory_risk: "Functional mushroom extracts (Reishi, Lion's Mane) need clear FSSAI labeling.",
    tam_band: "₹500–1,000 Cr",
    cac_band: "₹200–380",
    margin_band: "60–70%",
    payback_estimate: "10–14 months",
    price_ladder: "₹599 (30 sachets) → ₹999 (60 sachets) → ₹2,499 (quarterly box)",
    format_recommendation: "Single-serve sachets. Instant mix format. Coffee-first positioning.",
    founder_brief: "Mushroom coffee is the most exciting white space in this scan. High velocity, low competition, and strong functional positioning. The key insight from Reddit: consumers want cognitive benefits without the jitters — Lion's Mane + Coffee is the perfect pitch. India's massive coffee culture (especially South India) provides natural demand. Risk: consumer education on functional mushrooms. Mitigate by leading with coffee taste, trailing with mushroom benefits. The brand that owns 'smart coffee' in India wins big.",
    google_trends_data: [8, 12, 16, 22, 28, 35, 42, 48, 55, 62, 70, 78],
    reddit_mentions: [4, 6, 9, 12, 16, 20, 25, 30, 38, 45, 52, 60],
    evidence_snippets: [
      "r/Coffee: 'Tried Lion's Mane coffee. Focus is incredible, no crash. Why isn't this mainstream?'",
      "r/india: 'Functional mushrooms are the next big thing in wellness. Mark my words.'",
      "r/Nootropics: 'Mushroom coffee blends are replacing my pre-workout. Sustained energy without the crash.'"
    ],
  },
];

export const categories = [
  "Wellness & Supplements",
  "Functional Beverages",
  "Beauty & Personal Care",
  "Healthy Snacking",
  "Mental Health & Sleep",
  "Sports Nutrition",
];

export const timeWindows = [
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "180 Days", value: 180 },
];
