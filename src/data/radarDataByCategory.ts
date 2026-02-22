import { TrendData } from "./mockTrends";

const wellnessSupplements: TrendData[] = [
  {
    id: "ws-1", trend_name: "Ashwagandha Gummies", trend_score: 87, velocity: 26, coherence: 18, competition: 6,
    entry_window: "Optimal", dominance_prob: 72, feasibility: 85, fad_risk: 18, structural_shift: 78,
    regulatory_risk: "FSSAI approved ingredient. Low regulatory barrier for supplements.",
    tam_band: "₹1,200–1,800 Cr", cac_band: "₹180–350", margin_band: "62–71%", payback_estimate: "8–12 months",
    price_ladder: "₹499 (30ct) → ₹899 (60ct) → ₹1,499 (90ct sub)", format_recommendation: "Gummies first, then powder sachets for B2B/HoReCa",
    founder_brief: "Ashwagandha gummies represent a structural shift in adaptogen delivery. Google Trends shows 3.2x growth over 180 days in India, corroborated by Reddit discussions shifting from curiosity to purchase intent. The gummy format solves the bitter taste barrier that limited powder adoption. Entry window is optimal—first-movers exist but no dominant D2C brand has emerged. Capital efficiency is strong: contract manufacturing available at scale. Recommend launching with a hero SKU at ₹499, building a subscription moat early.",
    google_trends_data: [20, 22, 25, 28, 32, 35, 40, 45, 52, 58, 65, 72],
    reddit_mentions: [5, 8, 12, 15, 22, 28, 35, 42, 55, 68, 78, 85],
    evidence_snippets: [
      "r/IndianSkincareAddicts: 'Finally found ashwagandha gummies that don't taste like dirt. Game changer for stress.'",
      "r/india: 'The wellness supplement market here is exploding. Ashwagandha everything now.'",
      "r/Supplements: 'Indian brands making adaptogen gummies are way more affordable than US ones.'"
    ],
  },
  {
    id: "ws-2", trend_name: "Mushroom Coffee Blends", trend_score: 82, velocity: 25, coherence: 15, competition: 5,
    entry_window: "Early", dominance_prob: 70, feasibility: 75, fad_risk: 28, structural_shift: 65,
    regulatory_risk: "Functional mushroom extracts need clear FSSAI labeling.",
    tam_band: "₹500–1,000 Cr", cac_band: "₹200–380", margin_band: "60–70%", payback_estimate: "10–14 months",
    price_ladder: "₹599 (30 sachets) → ₹999 (60 sachets) → ₹2,499 (quarterly)", format_recommendation: "Single-serve sachets, instant mix, coffee-first positioning",
    founder_brief: "Mushroom coffee is the most exciting white space in this scan. High velocity, low competition, and strong functional positioning. Reddit: consumers want cognitive benefits without jitters — Lion's Mane + Coffee is the perfect pitch. India's coffee culture provides natural demand. Risk: consumer education on functional mushrooms. Lead with coffee taste, trail with mushroom benefits. The brand that owns 'smart coffee' in India wins big.",
    google_trends_data: [8, 12, 16, 22, 28, 35, 42, 48, 55, 62, 70, 78],
    reddit_mentions: [4, 6, 9, 12, 16, 20, 25, 30, 38, 45, 52, 60],
    evidence_snippets: [
      "r/Coffee: 'Lion's Mane coffee. Focus is incredible, no crash. Why isn't this mainstream?'",
      "r/india: 'Functional mushrooms are the next big thing in wellness.'",
      "r/Nootropics: 'Mushroom coffee replacing my pre-workout. Sustained energy without crash.'"
    ],
  },
  {
    id: "ws-3", trend_name: "Collagen Peptide Drinks", trend_score: 81, velocity: 23, coherence: 16, competition: 9,
    entry_window: "Early", dominance_prob: 65, feasibility: 78, fad_risk: 25, structural_shift: 70,
    regulatory_risk: "Marine collagen sourcing needs import compliance.",
    tam_band: "₹800–1,400 Cr", cac_band: "₹250–450", margin_band: "55–65%", payback_estimate: "12–16 months",
    price_ladder: "₹299 (single) → ₹1,999 (7-pack) → ₹6,999 (30-day kit)", format_recommendation: "RTD shots, then powdered sachets for scaling",
    founder_brief: "Collagen peptide drinks ride the 'beauty from within' wave. Search velocity accelerating but market still early-stage in India. Reddit shows high curiosity paired with price sensitivity. Key advantage: marine collagen RTD is a format gap—most Indian brands sell powders. First-mover in convenient format wins. Watch for plant-based collagen alternatives gaining traction.",
    google_trends_data: [10, 12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 58],
    reddit_mentions: [3, 5, 8, 10, 14, 18, 22, 28, 35, 42, 50, 56],
    evidence_snippets: [
      "r/30PlusSkinCare: 'Looking for good collagen drinks in India. Most options are overpriced powders.'",
      "r/IndianBeautyDeals: 'Korean collagen drinks are ₹500/bottle. Someone please make an affordable Indian version.'",
      "r/Supplements: 'Marine collagen peptides > bovine. The science is clear.'"
    ],
  },
  {
    id: "ws-4", trend_name: "Sleep Supplement Strips", trend_score: 73, velocity: 21, coherence: 17, competition: 8,
    entry_window: "Optimal", dominance_prob: 58, feasibility: 82, fad_risk: 22, structural_shift: 68,
    regulatory_risk: "Melatonin regulations evolving. Stick to herbal formulations.",
    tam_band: "₹600–1,100 Cr", cac_band: "₹150–300", margin_band: "70–78%", payback_estimate: "6–10 months",
    price_ladder: "₹349 (15 strips) → ₹599 (30 strips) → ₹1,499 (90-day sub)", format_recommendation: "Oral dissolving strips. Melatonin-free herbal formula.",
    founder_brief: "Sleep supplements are validated but the strip format is genuine innovation for Indian consumers. High margin, low COGS, easy shipping. Coherence of 17 shows strong signal alignment. Competition exists in tablets but strips are differentiated. Key risk: melatonin regulatory uncertainty. Go herbal (Valerian + L-Theanine + Chamomile). Payback fastest in cohort at 6-10 months.",
    google_trends_data: [15, 18, 20, 22, 25, 28, 32, 36, 40, 44, 48, 52],
    reddit_mentions: [8, 10, 12, 15, 18, 22, 26, 30, 35, 40, 45, 50],
    evidence_snippets: [
      "r/india: 'My sleep schedule is wrecked. Are those dissolving strips legit?'",
      "r/Nootropics: 'Oral strips for supplements are genius. Sublingual absorption > pills.'",
      "r/bangalore: 'Every other person I know has insomnia. The sleep economy is real.'"
    ],
  },
  {
    id: "ws-5", trend_name: "Vitamin D3+K2 Drops", trend_score: 68, velocity: 18, coherence: 14, competition: 10,
    entry_window: "Late", dominance_prob: 48, feasibility: 88, fad_risk: 15, structural_shift: 72,
    regulatory_risk: "Well-established supplement category. Standard FSSAI compliance.",
    tam_band: "₹900–1,500 Cr", cac_band: "₹120–250", margin_band: "65–74%", payback_estimate: "6–9 months",
    price_ladder: "₹399 (30ml) → ₹699 (60ml) → ₹1,799 (family pack)", format_recommendation: "Liquid drops with MCT oil carrier. Family positioning.",
    founder_brief: "D3+K2 is a validated combination with strong scientific backing. The drops format offers superior bioavailability over tablets. Market is maturing but liquid format still under-penetrated in India. Low fad risk makes this a stable bet. Competition is moderate—differentiate through clean label and transparent sourcing.",
    google_trends_data: [30, 32, 33, 35, 36, 38, 40, 42, 44, 45, 47, 48],
    reddit_mentions: [15, 16, 18, 20, 22, 24, 25, 27, 28, 30, 31, 33],
    evidence_snippets: [
      "r/Supplements: 'D3+K2 combo is non-negotiable. Finally some Indian brands doing liquid drops.'",
      "r/india: 'Doctor said 80% of Indians are D3 deficient. Makes sense as a daily.'",
      "r/IndianFitness: 'Switched to drops from tablets. Absorption feels better.'"
    ],
  },
  {
    id: "ws-6", trend_name: "Probiotic Gummy Bears", trend_score: 65, velocity: 16, coherence: 12, competition: 11,
    entry_window: "Late", dominance_prob: 42, feasibility: 80, fad_risk: 35, structural_shift: 55,
    regulatory_risk: "Standard supplement regulations. Probiotic strain claims need backing.",
    tam_band: "₹400–800 Cr", cac_band: "₹200–400", margin_band: "58–66%", payback_estimate: "10–14 months",
    price_ladder: "₹449 (30ct) → ₹799 (60ct) → ₹1,999 (90-day sub)", format_recommendation: "Gummies targeting kids and young adults. Fruity flavors.",
    founder_brief: "Probiotic gummies are a growing category but competitive. Multiple brands already have offerings. Differentiation through strain specificity (gut-brain axis focus) or demographic targeting (kids line) could carve a niche. Fad risk is moderate. Not a first-bet opportunity but viable as a line extension for an existing supplement brand.",
    google_trends_data: [22, 24, 25, 27, 28, 30, 32, 34, 35, 37, 38, 40],
    reddit_mentions: [10, 12, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26],
    evidence_snippets: [
      "r/Supplements: 'Kids won't take capsules. Probiotic gummies are the only way.'",
      "r/india: 'Gut health is trending everywhere. Probiotics feel like a must-have now.'",
      "r/HealthyFood: 'Are probiotic gummies actually effective or just candy?'"
    ],
  },
];

const functionalBeverages: TrendData[] = [
  {
    id: "fb-1", trend_name: "Probiotic Sparkling Water", trend_score: 84, velocity: 28, coherence: 14, competition: 4,
    entry_window: "Early", dominance_prob: 68, feasibility: 72, fad_risk: 30, structural_shift: 62,
    regulatory_risk: "Novel food category. May need FSSAI product approval for probiotic claims.",
    tam_band: "₹400–900 Cr", cac_band: "₹200–400", margin_band: "48–58%", payback_estimate: "14–20 months",
    price_ladder: "₹79 (single) → ₹449 (6-pack) → ₹1,599 (24-pack sub)", format_recommendation: "Slim cans, 250ml. Start with 3 flavors. Metro focus.",
    founder_brief: "Probiotic sparkling water sits at gut health × premium beverages intersection. Velocity of 28 is the highest signal. Competition score of 4 is extremely low—virtually no Indian brand owns this space. Risk: cold chain complexity and FSSAI approval timeline. Start metro D2C, build brand, then negotiate modern trade shelf space.",
    google_trends_data: [5, 7, 10, 14, 18, 25, 32, 40, 50, 58, 65, 70],
    reddit_mentions: [2, 3, 4, 6, 10, 14, 18, 22, 28, 32, 38, 42],
    evidence_snippets: [
      "r/india: 'Had kombucha for the first time. Why isn't there a simpler probiotic drink?'",
      "r/HealthyFood: 'Probiotic sparkling water is huge in the US. When will India get these?'",
      "r/mumbai: 'Would love a healthy alternative to soda that actually tastes good.'"
    ],
  },
  {
    id: "fb-2", trend_name: "Adaptogen Iced Teas", trend_score: 79, velocity: 24, coherence: 16, competition: 5,
    entry_window: "Early", dominance_prob: 64, feasibility: 76, fad_risk: 26, structural_shift: 68,
    regulatory_risk: "Herbal ingredients generally FSSAI compliant. Claims need careful wording.",
    tam_band: "₹300–700 Cr", cac_band: "₹180–350", margin_band: "52–62%", payback_estimate: "12–16 months",
    price_ladder: "₹89 (single) → ₹499 (6-pack) → ₹1,799 (monthly sub)", format_recommendation: "RTD bottles, 330ml. Ashwagandha+Tulsi and Brahmi+Mint hero flavors.",
    founder_brief: "Adaptogen iced teas combine India's herbal heritage with modern RTD convenience. Strong coherence between search and social signals. The iced tea format is familiar but the functional angle is fresh. Key differentiation from plain iced tea: stress-relief positioning backed by Ayurvedic ingredients. Metro millennials are the primary audience.",
    google_trends_data: [12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 58, 64],
    reddit_mentions: [5, 7, 10, 13, 16, 20, 24, 28, 33, 38, 44, 50],
    evidence_snippets: [
      "r/tea: 'Adaptogen iced tea sounds amazing. Ashwagandha + cold brew green tea?'",
      "r/india: 'We have centuries of herbal knowledge. Time someone bottled it properly.'",
      "r/Ayurveda: 'RTD adaptogen drinks could be India's answer to energy drinks.'"
    ],
  },
  {
    id: "fb-3", trend_name: "Electrolyte Coconut Water+", trend_score: 76, velocity: 20, coherence: 15, competition: 8,
    entry_window: "Optimal", dominance_prob: 58, feasibility: 82, fad_risk: 20, structural_shift: 70,
    regulatory_risk: "Coconut water is well-regulated. Added electrolyte claims need substantiation.",
    tam_band: "₹600–1,200 Cr", cac_band: "₹150–300", margin_band: "45–55%", payback_estimate: "10–14 months",
    price_ladder: "₹59 (250ml) → ₹299 (6-pack) → ₹999 (24-pack)", format_recommendation: "Tetra packs and PET bottles. Sport + daily hydration positioning.",
    founder_brief: "Enhanced coconut water bridges natural hydration with sports nutrition. India is the world's largest coconut producer—supply chain advantage. Adding electrolytes and vitamins to coconut water creates a premium positioning. Competition exists in plain coconut water but the 'enhanced' segment is nascent. Low fad risk, strong structural shift.",
    google_trends_data: [20, 22, 25, 28, 30, 33, 36, 40, 44, 48, 52, 56],
    reddit_mentions: [8, 10, 12, 14, 17, 20, 23, 26, 30, 34, 38, 42],
    evidence_snippets: [
      "r/IndianFitness: 'Why buy Gatorade when coconut water + salt does the same thing naturally?'",
      "r/india: 'Enhanced coconut water is huge in the US. Vita Coco model could work here.'",
      "r/running: 'Need a natural electrolyte drink for marathon training. Coconut water based would be ideal.'"
    ],
  },
  {
    id: "fb-4", trend_name: "CBD-Free Calm Shots", trend_score: 71, velocity: 19, coherence: 13, competition: 6,
    entry_window: "Early", dominance_prob: 55, feasibility: 70, fad_risk: 32, structural_shift: 58,
    regulatory_risk: "L-Theanine and GABA are approved. Marketing claims need careful positioning.",
    tam_band: "₹200–500 Cr", cac_band: "₹250–450", margin_band: "58–68%", payback_estimate: "14–18 months",
    price_ladder: "₹149 (single) → ₹799 (6-pack) → ₹2,499 (monthly sub)", format_recommendation: "60ml shots. Evening/stress positioning. Premium glass bottles.",
    founder_brief: "Calm shots target the massive stress/anxiety market without CBD complications. L-Theanine + GABA + Magnesium is a proven stack. The 'shot' format implies fast-acting, which appeals to anxious consumers. Moderate fad risk but the mental health mega-trend provides structural support. Needs strong brand positioning to avoid being seen as a gimmick.",
    google_trends_data: [8, 10, 13, 16, 19, 22, 26, 30, 34, 38, 42, 46],
    reddit_mentions: [3, 5, 7, 9, 12, 15, 18, 22, 26, 30, 34, 38],
    evidence_snippets: [
      "r/Nootropics: 'L-Theanine shots work better than any anti-anxiety supplement I've tried.'",
      "r/india: 'Stress levels are through the roof. Need something quick and effective.'",
      "r/mentalhealth: 'Non-CBD calm drinks are the future. Legal everywhere, actually work.'"
    ],
  },
  {
    id: "fb-5", trend_name: "Protein Coffee RTD", trend_score: 68, velocity: 17, coherence: 12, competition: 9,
    entry_window: "Optimal", dominance_prob: 50, feasibility: 78, fad_risk: 28, structural_shift: 60,
    regulatory_risk: "Standard food product regulations. Protein claims need testing.",
    tam_band: "₹400–900 Cr", cac_band: "₹200–380", margin_band: "50–60%", payback_estimate: "12–16 months",
    price_ladder: "₹129 (single) → ₹699 (6-pack) → ₹2,499 (monthly sub)", format_recommendation: "330ml cans. Cold brew + whey isolate. Gym + office positioning.",
    founder_brief: "Protein coffee combines two daily habits into one product. The RTD format is convenient for gym-goers and office workers. Moderate competition from imported brands but no strong Indian player. Cold chain is the main operational challenge. Target urban fitness enthusiasts aged 25-40.",
    google_trends_data: [15, 17, 19, 22, 24, 27, 30, 33, 36, 39, 42, 45],
    reddit_mentions: [6, 8, 10, 12, 14, 16, 19, 22, 25, 28, 31, 34],
    evidence_snippets: [
      "r/IndianFitness: 'Protein coffee would save me so much time in the morning.'",
      "r/Coffee: 'Why isn't there a good protein coffee brand in India yet?'",
      "r/Supplements: 'Mixing whey into cold brew at home. Someone should just bottle this.'"
    ],
  },
  {
    id: "fb-6", trend_name: "Turmeric Latte Mix", trend_score: 62, velocity: 14, coherence: 11, competition: 12,
    entry_window: "Late", dominance_prob: 40, feasibility: 85, fad_risk: 35, structural_shift: 50,
    regulatory_risk: "Traditional ingredient. No regulatory concerns.",
    tam_band: "₹300–600 Cr", cac_band: "₹150–300", margin_band: "55–65%", payback_estimate: "8–12 months",
    price_ladder: "₹349 (30 sachets) → ₹599 (60 sachets) → ₹1,499 (quarterly)", format_recommendation: "Instant sachets with oat milk powder. Premium gift-box positioning.",
    founder_brief: "Golden latte/turmeric latte has peaked globally but remains under-commercialized in convenient formats in India. High competition from unbranded haldi doodh. Differentiation through premiumization: curcumin-enhanced, with black pepper extract for absorption, paired with oat milk powder. Best as a product line within a broader wellness brand rather than a standalone bet.",
    google_trends_data: [28, 29, 30, 31, 32, 33, 34, 35, 35, 36, 36, 37],
    reddit_mentions: [14, 15, 16, 16, 17, 18, 18, 19, 20, 20, 21, 22],
    evidence_snippets: [
      "r/india: 'Turmeric latte is just haldi doodh with marketing. But the instant sachets are convenient.'",
      "r/Coffee: 'Golden latte trend feels past its peak in the West but India hasn't really done it.'",
      "r/Ayurveda: 'Curcumin-enhanced turmeric latte with piperine would actually be effective.'"
    ],
  },
];

const beautyPersonalCare: TrendData[] = [
  {
    id: "bp-1", trend_name: "Peptide Serums", trend_score: 86, velocity: 27, coherence: 19, competition: 7,
    entry_window: "Optimal", dominance_prob: 71, feasibility: 80, fad_risk: 16, structural_shift: 82,
    regulatory_risk: "Cosmetic-grade peptides well regulated. Clinical claims need trials.",
    tam_band: "₹1,500–2,500 Cr", cac_band: "₹200–400", margin_band: "68–76%", payback_estimate: "8–12 months",
    price_ladder: "₹699 (15ml) → ₹1,199 (30ml) → ₹2,999 (serum + moisturizer kit)", format_recommendation: "Glass dropper bottles. Clinical packaging. Dermatologist endorsements.",
    founder_brief: "Peptide serums are the next evolution beyond Vitamin C and retinol in skincare. Strong search velocity with high coherence—consumers are both searching and discussing peptides actively. The science is robust (copper peptides, matrixyl). Indian consumers are increasingly ingredient-aware. Premium positioning is key; don't compete on price. Build authority through dermatologist partnerships.",
    google_trends_data: [15, 18, 22, 28, 34, 40, 46, 52, 58, 65, 72, 80],
    reddit_mentions: [8, 11, 15, 20, 26, 32, 38, 44, 52, 60, 68, 76],
    evidence_snippets: [
      "r/IndianSkincareAddicts: 'Peptide serums are the real deal. My skin texture changed in 2 weeks.'",
      "r/SkincareAddiction: 'Copper peptides + matrixyl is the gold standard combo.'",
      "r/IndianBeautyDeals: 'Korean peptide serums are amazing but overpriced here. Need good Indian options.'"
    ],
  },
  {
    id: "bp-2", trend_name: "Rice Water Hair Products", trend_score: 80, velocity: 24, coherence: 17, competition: 6,
    entry_window: "Early", dominance_prob: 66, feasibility: 84, fad_risk: 22, structural_shift: 72,
    regulatory_risk: "Traditional ingredient. Standard cosmetic regulations apply.",
    tam_band: "₹800–1,500 Cr", cac_band: "₹180–350", margin_band: "60–70%", payback_estimate: "10–14 months",
    price_ladder: "₹399 (shampoo) → ₹699 (shampoo+conditioner) → ₹1,499 (complete kit)", format_recommendation: "Shampoo + conditioner + leave-in spray. Fermented rice water hero ingredient.",
    founder_brief: "Rice water for hair is a viral trend backed by centuries of Asian beauty tradition. The fermented rice water angle provides scientific credibility (amino acids, inositol). Strong social proof from influencer content. Low competition in branded, premium rice water products. Natural fit for the Indian market given rice's cultural significance.",
    google_trends_data: [10, 14, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72],
    reddit_mentions: [6, 9, 13, 17, 22, 27, 32, 38, 44, 50, 56, 62],
    evidence_snippets: [
      "r/IndianHairCare: 'Rice water rinse changed my hair game completely.'",
      "r/HairCare: 'Fermented rice water > regular rice water. The amino acids make the difference.'",
      "r/india: 'My grandmother used rice water on her hair. Now it's trending on TikTok.'"
    ],
  },
  {
    id: "bp-3", trend_name: "Barrier Repair Moisturizers", trend_score: 77, velocity: 22, coherence: 16, competition: 8,
    entry_window: "Optimal", dominance_prob: 60, feasibility: 82, fad_risk: 14, structural_shift: 80,
    regulatory_risk: "Standard cosmetic product. Ceramide sourcing well established.",
    tam_band: "₹1,000–2,000 Cr", cac_band: "₹220–400", margin_band: "62–72%", payback_estimate: "10–14 months",
    price_ladder: "₹599 (50ml) → ₹999 (100ml) → ₹2,499 (barrier repair kit)", format_recommendation: "Cream + serum duo. Ceramide + cholesterol + fatty acids trifecta.",
    founder_brief: "Barrier repair is moving from niche to mainstream skincare concern. Low fad risk (14%) signals lasting relevance. Indian consumers over-exfoliate and need barrier repair education. The ceramide + cholesterol + fatty acid ratio (3:1:1) is the gold standard. Build a brand around 'skin health' not just 'skin beauty.' Strong structural shift suggests this will become a permanent skincare category.",
    google_trends_data: [18, 20, 23, 26, 30, 34, 38, 42, 46, 50, 54, 58],
    reddit_mentions: [10, 12, 15, 18, 22, 26, 30, 34, 38, 42, 46, 50],
    evidence_snippets: [
      "r/IndianSkincareAddicts: 'Destroyed my barrier with too much retinol. Now I'm all about ceramides.'",
      "r/SkincareAddiction: 'Barrier repair is not a trend, it's a fundamental skincare need.'",
      "r/AsianBeauty: 'Korean barrier creams are ₹2000+. India needs affordable options.'"
    ],
  },
  {
    id: "bp-4", trend_name: "Scalp Care Serums", trend_score: 74, velocity: 21, coherence: 14, competition: 7,
    entry_window: "Early", dominance_prob: 62, feasibility: 78, fad_risk: 20, structural_shift: 74,
    regulatory_risk: "Cosmetic product. Active ingredient concentrations need compliance.",
    tam_band: "₹600–1,200 Cr", cac_band: "₹200–380", margin_band: "64–72%", payback_estimate: "10–14 months",
    price_ladder: "₹599 (30ml) → ₹999 (50ml) → ₹2,199 (scalp care routine kit)", format_recommendation: "Dropper serum for scalp. Salicylic acid + niacinamide hero formula.",
    founder_brief: "Scalp care is skincare-ification of hair care—treating the scalp like face skin. Early-stage opportunity with strong structural backing. Indian consumers deal with pollution, sweat, and product buildup. Scalp serums with actives (salicylic acid, niacinamide, tea tree) address real problems. Position as 'facial for your scalp.' Premium D2C play.",
    google_trends_data: [8, 11, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50],
    reddit_mentions: [4, 6, 9, 12, 15, 18, 22, 26, 30, 34, 38, 42],
    evidence_snippets: [
      "r/IndianHairCare: 'Started treating my scalp like my face. Game changer for hair growth.'",
      "r/HairCare: 'Scalp serum with salicylic acid cleared my flakes in a week.'",
      "r/IndianSkincareAddicts: 'Why is no one talking about scalp care in India?'"
    ],
  },
  {
    id: "bp-5", trend_name: "Bakuchiol Anti-Aging", trend_score: 70, velocity: 18, coherence: 13, competition: 9,
    entry_window: "Optimal", dominance_prob: 54, feasibility: 76, fad_risk: 24, structural_shift: 66,
    regulatory_risk: "Plant-based retinol alternative. Standard cosmetic regulations.",
    tam_band: "₹500–1,000 Cr", cac_band: "₹250–450", margin_band: "66–74%", payback_estimate: "12–16 months",
    price_ladder: "₹799 (15ml) → ₹1,399 (30ml) → ₹3,499 (anti-aging kit)", format_recommendation: "Oil-serum hybrid. Night-time positioning. Clean beauty angle.",
    founder_brief: "Bakuchiol is a plant-based retinol alternative derived from the babchi plant—an Ayurvedic ingredient. This creates a unique India-origin story. Appeals to consumers who want anti-aging without retinol sensitivity. Moderate competition but most brands treat it as a secondary ingredient. Opportunity to build a brand where bakuchiol is the hero.",
    google_trends_data: [12, 14, 16, 18, 21, 24, 27, 30, 34, 38, 42, 46],
    reddit_mentions: [5, 7, 9, 11, 14, 17, 20, 23, 27, 31, 35, 39],
    evidence_snippets: [
      "r/SkincareAddiction: 'Bakuchiol gave me retinol results without the peeling.'",
      "r/IndianSkincareAddicts: 'Babchi seed oil is basically bakuchiol. Ayurveda had it first.'",
      "r/AsianBeauty: 'Bakuchiol is gentler than retinol. Perfect for sensitive Indian skin.'"
    ],
  },
  {
    id: "bp-6", trend_name: "Sunscreen Sticks SPF50", trend_score: 66, velocity: 15, coherence: 11, competition: 11,
    entry_window: "Late", dominance_prob: 44, feasibility: 86, fad_risk: 12, structural_shift: 78,
    regulatory_risk: "Sunscreen regulations well established. SPF testing required.",
    tam_band: "₹800–1,600 Cr", cac_band: "₹150–300", margin_band: "55–65%", payback_estimate: "8–12 months",
    price_ladder: "₹499 (15g) → ₹799 (30g) → ₹1,999 (sunscreen essentials kit)", format_recommendation: "Twist-up stick format. No white cast formula for Indian skin tones.",
    founder_brief: "Sunscreen sticks solve the reapplication problem—portable, mess-free, easy to use over makeup. Very low fad risk; sun protection is a permanent need. Competition is growing but no Indian brand has nailed the stick format for Indian skin tones (no white cast is essential). Late entry window means speed matters. Focus on the 'reapply' use case.",
    google_trends_data: [25, 26, 27, 28, 30, 31, 33, 34, 36, 37, 39, 40],
    reddit_mentions: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    evidence_snippets: [
      "r/IndianSkincareAddicts: 'Need a sunscreen stick that doesn't leave white cast on brown skin.'",
      "r/SkincareAddiction: 'Stick sunscreens are so much easier to reapply than lotions.'",
      "r/india: 'Why are all good sunscreen sticks imported and overpriced?'"
    ],
  },
];

const healthySnacking: TrendData[] = [
  {
    id: "hs-1", trend_name: "Makhana Snack Packs", trend_score: 85, velocity: 26, coherence: 18, competition: 7,
    entry_window: "Optimal", dominance_prob: 69, feasibility: 88, fad_risk: 15, structural_shift: 80,
    regulatory_risk: "Standard food product. Well-established category.",
    tam_band: "₹1,000–2,000 Cr", cac_band: "₹120–250", margin_band: "55–65%", payback_estimate: "6–10 months",
    price_ladder: "₹49 (single) → ₹249 (6-pack) → ₹899 (monthly box)", format_recommendation: "Flavored makhana in resealable packs. Bold Indian flavors.",
    founder_brief: "Makhana (fox nuts) is India's answer to the global healthy snacking wave. Low calorie, high protein, inherently Indian. The flavored snack pack format transforms a traditional ingredient into a modern snacking occasion. Strong coherence between search and social—consumers actively seeking and discussing. Supply chain is India-centric, giving cost advantages. Fast payback makes this an attractive first bet.",
    google_trends_data: [18, 22, 26, 30, 35, 40, 45, 50, 56, 62, 68, 75],
    reddit_mentions: [8, 11, 15, 19, 24, 29, 34, 40, 46, 52, 58, 65],
    evidence_snippets: [
      "r/india: 'Makhana is the OG superfood. Way better than overpriced kale chips.'",
      "r/HealthyFood: 'Roasted makhana with peri-peri seasoning is insanely addictive.'",
      "r/IndianFitness: 'High protein, low cal snack that's actually affordable. Makhana wins.'"
    ],
  },
  {
    id: "hs-2", trend_name: "Protein Cookies", trend_score: 78, velocity: 22, coherence: 15, competition: 8,
    entry_window: "Early", dominance_prob: 62, feasibility: 82, fad_risk: 25, structural_shift: 65,
    regulatory_risk: "Standard food product. Protein content claims need lab testing.",
    tam_band: "₹600–1,200 Cr", cac_band: "₹180–350", margin_band: "50–60%", payback_estimate: "10–14 months",
    price_ladder: "₹79 (single) → ₹449 (6-pack) → ₹1,599 (monthly sub)", format_recommendation: "Soft-baked cookies, 15g protein each. Choco-chip and peanut butter heroes.",
    founder_brief: "Protein cookies bridge indulgence and nutrition—the guilt-free treat positioning. Early-stage in India with limited quality options. Key challenge: making a protein cookie that actually tastes good. Soft-baked texture is essential. Target gym-goers initially, then expand to broader health-conscious consumers. Moderate fad risk but the protein mega-trend provides support.",
    google_trends_data: [12, 15, 18, 22, 26, 30, 34, 38, 43, 48, 53, 58],
    reddit_mentions: [5, 8, 11, 14, 18, 22, 26, 30, 35, 40, 45, 50],
    evidence_snippets: [
      "r/IndianFitness: 'Every protein cookie in India tastes like cardboard. Someone fix this.'",
      "r/Fitness: 'Soft-baked protein cookies are a game changer for sweet cravings.'",
      "r/india: 'Would pay premium for a protein cookie that actually tastes like a cookie.'"
    ],
  },
  {
    id: "hs-3", trend_name: "Freeze-Dried Fruit Chips", trend_score: 75, velocity: 21, coherence: 14, competition: 5,
    entry_window: "Early", dominance_prob: 64, feasibility: 70, fad_risk: 22, structural_shift: 68,
    regulatory_risk: "Standard food processing. Freeze-drying facility investment needed.",
    tam_band: "₹400–800 Cr", cac_band: "₹200–400", margin_band: "58–68%", payback_estimate: "14–18 months",
    price_ladder: "₹99 (25g) → ₹549 (6-pack) → ₹1,899 (monthly variety box)", format_recommendation: "Single-serve pouches. Mango, strawberry, jackfruit hero flavors.",
    founder_brief: "Freeze-dried fruit chips offer the nutritional profile of whole fruit with snack-level convenience. Very low competition (score: 5) in India. The main barrier is freeze-drying infrastructure—capital intensive but defensible once built. Indian tropical fruits (mango, jackfruit, banana) create unique flavors unavailable from global brands. Premium positioning for metro consumers.",
    google_trends_data: [8, 10, 13, 16, 20, 24, 28, 32, 37, 42, 47, 52],
    reddit_mentions: [3, 5, 7, 10, 13, 16, 20, 24, 28, 32, 37, 42],
    evidence_snippets: [
      "r/HealthyFood: 'Freeze-dried mango is basically candy but it's just fruit.'",
      "r/india: 'Why is freeze-dried fruit so expensive here? It's just fruit with no water.'",
      "r/IndianFitness: 'Best snack for hiking. Light, nutritious, tastes amazing.'"
    ],
  },
  {
    id: "hs-4", trend_name: "Ragi Puffs & Crisps", trend_score: 72, velocity: 19, coherence: 15, competition: 9,
    entry_window: "Optimal", dominance_prob: 56, feasibility: 85, fad_risk: 18, structural_shift: 74,
    regulatory_risk: "Traditional grain. Standard food product regulations.",
    tam_band: "₹500–1,000 Cr", cac_band: "₹130–270", margin_band: "52–62%", payback_estimate: "8–12 months",
    price_ladder: "₹39 (single) → ₹199 (6-pack) → ₹699 (monthly box)", format_recommendation: "Puffed ragi snacks in Indian masala flavors. Kids + adults range.",
    founder_brief: "Ragi (finger millet) is a nutritional powerhouse with deep cultural roots in South India. The puffed/crisp format modernizes a traditional grain. Low fad risk and high structural shift suggest lasting category. Strong coherence indicates genuine consumer interest. Affordable price point enables mass-market penetration. Dual-track strategy: fun flavors for kids, sophisticated flavors for adults.",
    google_trends_data: [15, 17, 19, 22, 24, 27, 30, 33, 36, 40, 44, 48],
    reddit_mentions: [7, 9, 11, 13, 16, 19, 22, 25, 28, 32, 36, 40],
    evidence_snippets: [
      "r/india: 'Ragi is incredibly nutritious but boring. Puffs format makes it fun.'",
      "r/IndianFood: 'My kids love ragi puffs. Finally a healthy snack they actually eat.'",
      "r/HealthyFood: 'Finger millet snacks are the next quinoa chips. Calling it now.'"
    ],
  },
  {
    id: "hs-5", trend_name: "Nut Butter Bites", trend_score: 67, velocity: 16, coherence: 12, competition: 10,
    entry_window: "Optimal", dominance_prob: 48, feasibility: 80, fad_risk: 28, structural_shift: 58,
    regulatory_risk: "Standard food product. Allergen labeling important.",
    tam_band: "₹300–700 Cr", cac_band: "₹200–380", margin_band: "48–58%", payback_estimate: "12–16 months",
    price_ladder: "₹149 (4-pack) → ₹399 (12-pack) → ₹1,299 (monthly sub)", format_recommendation: "Chocolate-coated nut butter balls. On-the-go energy positioning.",
    founder_brief: "Nut butter bites combine protein, healthy fats, and indulgence in a portable format. Moderate competition from energy balls but the nut butter + chocolate angle is under-explored. Fad risk is moderate. Best positioned as a premium on-the-go energy snack for urban professionals and gym-goers. Needs strong chocolate coating to compete with confectionery.",
    google_trends_data: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    reddit_mentions: [8, 10, 11, 13, 14, 16, 18, 20, 22, 24, 26, 28],
    evidence_snippets: [
      "r/HealthyFood: 'Almond butter bites dipped in dark chocolate. Why isn't this a thing in India?'",
      "r/IndianFitness: 'Need a grab-and-go protein snack that isn't a boring bar.'",
      "r/india: 'Nut butter is getting popular but we need more formats beyond jars.'"
    ],
  },
  {
    id: "hs-6", trend_name: "Protein Ice Cream", trend_score: 62, velocity: 14, coherence: 10, competition: 12,
    entry_window: "Late", dominance_prob: 40, feasibility: 60, fad_risk: 40, structural_shift: 48,
    regulatory_risk: "Standard food product. Ice cream regulations established.",
    tam_band: "₹300–700 Cr", cac_band: "₹300–550", margin_band: "40–52%", payback_estimate: "18–24 months",
    price_ladder: "₹199 (pint) → ₹549 (3-pack) → ₹1,799 (variety 6-pack)", format_recommendation: "Pints first, then bars. Cold chain is the bottleneck.",
    founder_brief: "Protein ice cream has strong consumer appeal but closing entry window. Multiple brands launched or launching. Cold chain logistics remain challenging. Coherence of 10 suggests inflated demand signal. Fad risk highest in cohort at 40%. Not recommended as primary bet unless you have existing cold chain infrastructure.",
    google_trends_data: [30, 32, 34, 36, 38, 40, 42, 44, 45, 46, 47, 48],
    reddit_mentions: [12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    evidence_snippets: [
      "r/IndianFitness: 'Halo Top is ₹599 for a tiny tub. Need affordable options.'",
      "r/india: 'Protein ice cream feels like a gimmick. Just eat regular ice cream.'",
      "r/Fitness: 'The protein ice cream market is getting saturated fast.'"
    ],
  },
];

const mentalHealthSleep: TrendData[] = [
  {
    id: "ms-1", trend_name: "Sleep Tracking Wearables", trend_score: 83, velocity: 25, coherence: 17, competition: 8,
    entry_window: "Optimal", dominance_prob: 66, feasibility: 68, fad_risk: 18, structural_shift: 80,
    regulatory_risk: "Consumer electronics regulations. Medical claims prohibited.",
    tam_band: "₹1,500–3,000 Cr", cac_band: "₹300–500", margin_band: "45–55%", payback_estimate: "14–20 months",
    price_ladder: "₹2,999 (basic) → ₹4,999 (pro) → ₹7,999 (premium + subscription)", format_recommendation: "Minimal ring or band form factor. Companion app with AI insights.",
    founder_brief: "Sleep tracking wearables represent the hardware entry point to the sleep economy. Strong structural shift (80%) indicates lasting category. The ring form factor is emerging as preferred over wrist bands for sleep tracking. Key challenge: hardware development is capital-intensive. Consider white-labeling hardware and building differentiated software/AI layer. India's sleep deprivation crisis creates massive demand.",
    google_trends_data: [12, 16, 20, 25, 30, 36, 42, 48, 54, 60, 66, 72],
    reddit_mentions: [6, 9, 13, 17, 22, 27, 32, 38, 44, 50, 56, 62],
    evidence_snippets: [
      "r/india: 'Every techie I know has terrible sleep. Need a good sleep tracker.'",
      "r/QuantifiedSelf: 'Sleep ring data helped me fix my insomnia. Game changer.'",
      "r/bangalore: 'Would pay good money for a device that actually improves my sleep.'"
    ],
  },
  {
    id: "ms-2", trend_name: "Digital Therapy Apps", trend_score: 80, velocity: 23, coherence: 16, competition: 9,
    entry_window: "Early", dominance_prob: 63, feasibility: 72, fad_risk: 20, structural_shift: 78,
    regulatory_risk: "Digital therapeutics regulations evolving. Clinical validation needed for claims.",
    tam_band: "₹2,000–4,000 Cr", cac_band: "₹400–700", margin_band: "75–85%", payback_estimate: "18–24 months",
    price_ladder: "₹199/mo (basic) → ₹499/mo (premium) → ₹4,999/yr (annual)", format_recommendation: "Mobile app. CBT-i for insomnia, CBT for anxiety. Vernacular support.",
    founder_brief: "Digital therapy apps (CBT-i for insomnia, guided therapy for anxiety) are a massive global category largely untapped in India. High margin SaaS economics. The key differentiator for India: vernacular language support and culturally adapted therapy modules. Regulatory landscape is evolving but currently favorable. High CAC due to stigma around mental health, but structural shift indicates growing acceptance.",
    google_trends_data: [10, 13, 17, 21, 26, 31, 36, 42, 48, 54, 60, 66],
    reddit_mentions: [5, 7, 10, 14, 18, 22, 27, 32, 38, 44, 50, 56],
    evidence_snippets: [
      "r/india: 'Therapy is ₹2000/session. An app that does CBT would be accessible to so many.'",
      "r/mentalhealth: 'CBT-i apps cured my insomnia better than sleeping pills.'",
      "r/bangalore: 'Mental health apps in Indian languages would be revolutionary.'"
    ],
  },
  {
    id: "ms-3", trend_name: "Magnesium Sleep Sprays", trend_score: 76, velocity: 22, coherence: 15, competition: 5,
    entry_window: "Early", dominance_prob: 68, feasibility: 84, fad_risk: 24, structural_shift: 65,
    regulatory_risk: "Topical magnesium. Standard cosmetic/supplement regulations.",
    tam_band: "₹300–700 Cr", cac_band: "₹150–300", margin_band: "65–75%", payback_estimate: "8–12 months",
    price_ladder: "₹449 (100ml) → ₹799 (200ml) → ₹1,999 (sleep routine kit)", format_recommendation: "Spray bottle with lavender scent. Bedtime routine positioning.",
    founder_brief: "Magnesium sleep sprays are a simple, effective product with strong unit economics. Transdermal magnesium absorption is debated scientifically but consumer belief is strong. Very low competition (5) in India. The spray format is novel and creates a bedtime ritual. Pair with lavender for sensory appeal. Fast payback, high margins, simple manufacturing. Excellent first product for a sleep wellness brand.",
    google_trends_data: [8, 11, 14, 18, 22, 26, 30, 35, 40, 45, 50, 55],
    reddit_mentions: [4, 6, 9, 12, 15, 19, 23, 27, 32, 37, 42, 47],
    evidence_snippets: [
      "r/Sleep: 'Magnesium spray before bed knocks me out. Better than melatonin.'",
      "r/india: 'Topical magnesium for sleep? Sounds too good to be true but it works.'",
      "r/SkincareAddiction: 'Magnesium spray + lavender oil = best sleep of my life.'"
    ],
  },
  {
    id: "ms-4", trend_name: "Weighted Blanket D2C", trend_score: 72, velocity: 18, coherence: 14, competition: 7,
    entry_window: "Optimal", dominance_prob: 56, feasibility: 80, fad_risk: 28, structural_shift: 62,
    regulatory_risk: "Consumer product. Standard textile regulations. Safety testing for children.",
    tam_band: "₹400–900 Cr", cac_band: "₹300–500", margin_band: "50–60%", payback_estimate: "12–16 months",
    price_ladder: "₹2,499 (single) → ₹3,999 (queen) → ₹5,999 (cooling premium)", format_recommendation: "Bamboo/cooling fabric cover for Indian climate. Weight-by-body-weight sizing.",
    founder_brief: "Weighted blankets are proven for anxiety and insomnia (deep pressure stimulation). The D2C model works well for this category. India's hot climate requires a cooling variant—bamboo or Tencel fabric covers. Moderate fad risk but strong anxiety prevalence provides structural support. Key differentiator: weight customization and cooling technology. Heavy product means shipping costs matter.",
    google_trends_data: [15, 17, 19, 22, 24, 27, 30, 33, 36, 39, 42, 45],
    reddit_mentions: [7, 9, 11, 13, 16, 19, 22, 25, 28, 31, 34, 37],
    evidence_snippets: [
      "r/india: 'Weighted blanket in Delhi summer? Need a cooling version desperately.'",
      "r/Anxiety: 'My weighted blanket is the best purchase I've ever made for my mental health.'",
      "r/Sleep: 'Deep pressure stimulation works. Science backs weighted blankets for anxiety.'"
    ],
  },
  {
    id: "ms-5", trend_name: "Herbal Sleep Strips", trend_score: 73, velocity: 21, coherence: 17, competition: 6,
    entry_window: "Optimal", dominance_prob: 58, feasibility: 82, fad_risk: 22, structural_shift: 68,
    regulatory_risk: "Melatonin regulations evolving. Herbal formulations safer.",
    tam_band: "₹600–1,100 Cr", cac_band: "₹150–300", margin_band: "70–78%", payback_estimate: "6–10 months",
    price_ladder: "₹349 (15 strips) → ₹599 (30 strips) → ₹1,499 (90-day sub)", format_recommendation: "Oral dissolving strips. Valerian + L-Theanine + Chamomile.",
    founder_brief: "Sleep strips combine convenience with efficacy. The oral dissolving format enables sublingual absorption, faster onset than capsules. High margin, low COGS, easy shipping. Go herbal to avoid melatonin regulatory uncertainty. Coherence of 17 signals strong demand validation. Fastest payback in this cohort at 6-10 months.",
    google_trends_data: [15, 18, 20, 22, 25, 28, 32, 36, 40, 44, 48, 52],
    reddit_mentions: [8, 10, 12, 15, 18, 22, 26, 30, 35, 40, 45, 50],
    evidence_snippets: [
      "r/india: 'My sleep schedule is wrecked. Are those dissolving strips legit?'",
      "r/Nootropics: 'Oral strips for supplements are genius. Sublingual absorption > pills.'",
      "r/bangalore: 'Every other person I know has insomnia. The sleep economy is real.'"
    ],
  },
  {
    id: "ms-6", trend_name: "Blue Light Therapy Lamps", trend_score: 64, velocity: 15, coherence: 11, competition: 10,
    entry_window: "Late", dominance_prob: 42, feasibility: 65, fad_risk: 30, structural_shift: 55,
    regulatory_risk: "Light therapy devices may need medical device classification.",
    tam_band: "₹200–500 Cr", cac_band: "₹350–600", margin_band: "45–55%", payback_estimate: "16–22 months",
    price_ladder: "₹1,999 (portable) → ₹3,499 (desk) → ₹5,999 (smart + app)", format_recommendation: "Portable, app-connected. Circadian rhythm optimization positioning.",
    founder_brief: "Light therapy for circadian rhythm management is scientifically validated but consumer awareness in India is low. High education cost translates to high CAC. Medical device classification risk adds regulatory complexity. Late entry window with global players already established. Better as a product line within a broader sleep tech brand than a standalone bet.",
    google_trends_data: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    reddit_mentions: [10, 11, 12, 12, 13, 14, 14, 15, 16, 16, 17, 18],
    evidence_snippets: [
      "r/Sleep: 'SAD lamp in the morning + blue light blocking at night = fixed circadian rhythm.'",
      "r/india: 'Do light therapy lamps even work? Seems like a Western trend.'",
      "r/biohacking: 'Light exposure timing is the single most important factor for sleep quality.'"
    ],
  },
];

const sportsNutrition: TrendData[] = [
  {
    id: "sn-1", trend_name: "Plant Protein Isolates", trend_score: 84, velocity: 25, coherence: 18, competition: 8,
    entry_window: "Optimal", dominance_prob: 67, feasibility: 78, fad_risk: 14, structural_shift: 84,
    regulatory_risk: "Standard supplement regulations. Protein content claims need lab verification.",
    tam_band: "₹2,000–4,000 Cr", cac_band: "₹200–400", margin_band: "55–65%", payback_estimate: "10–14 months",
    price_ladder: "₹1,499 (500g) → ₹2,499 (1kg) → ₹6,999 (3kg sub)", format_recommendation: "Pea + rice blend isolate. Clean label, no artificial sweeteners.",
    founder_brief: "Plant protein isolates are experiencing a structural shift in India—driven by flexitarian consumers, not just vegans. Very low fad risk (14%) confirms lasting demand. The pea + rice protein blend achieves a complete amino acid profile matching whey. Differentiate through clean label (no sucralose/ace-K) and transparent sourcing. The vegetarian cultural context in India creates a massive addressable market.",
    google_trends_data: [15, 19, 23, 28, 33, 38, 44, 50, 56, 62, 68, 74],
    reddit_mentions: [8, 11, 15, 19, 24, 29, 34, 40, 46, 52, 58, 64],
    evidence_snippets: [
      "r/IndianFitness: 'Plant protein that doesn't taste like chalk? Take my money.'",
      "r/vegan: 'Pea protein isolate from India is incredibly affordable and high quality.'",
      "r/Fitness: 'Plant protein isolates have closed the gap with whey. The science is there.'"
    ],
  },
  {
    id: "sn-2", trend_name: "EAA Intra-Workout", trend_score: 79, velocity: 23, coherence: 16, competition: 7,
    entry_window: "Early", dominance_prob: 64, feasibility: 80, fad_risk: 20, structural_shift: 72,
    regulatory_risk: "Amino acid supplements. Standard FSSAI compliance.",
    tam_band: "₹800–1,600 Cr", cac_band: "₹180–350", margin_band: "60–70%", payback_estimate: "8–12 months",
    price_ladder: "₹999 (30 servings) → ₹1,799 (60 servings) → ₹4,999 (quarterly sub)", format_recommendation: "Powder mix. Electrolyte + EAA combo. Tropical flavors.",
    founder_brief: "EAA (Essential Amino Acids) intra-workout supplements are replacing BCAAs as the science-backed choice. Low competition in India despite growing awareness. The combination of EAAs + electrolytes creates a compelling 'during workout' occasion. Strong velocity driven by fitness influencer education. Early entry window with significant first-mover advantage. Good margins and fast payback.",
    google_trends_data: [10, 13, 17, 21, 26, 31, 36, 42, 48, 54, 60, 66],
    reddit_mentions: [5, 8, 11, 14, 18, 22, 27, 32, 37, 42, 48, 54],
    evidence_snippets: [
      "r/IndianFitness: 'EAAs > BCAAs. Every sports scientist agrees now.'",
      "r/Fitness: 'Sipping EAAs during workout made a noticeable difference in recovery.'",
      "r/Supplements: 'Indian EAA brands are emerging. Finally moving past whey-only.'"
    ],
  },
  {
    id: "sn-3", trend_name: "Creatine HCL Capsules", trend_score: 76, velocity: 21, coherence: 15, competition: 9,
    entry_window: "Optimal", dominance_prob: 60, feasibility: 85, fad_risk: 12, structural_shift: 82,
    regulatory_risk: "Well-studied supplement. Clear FSSAI pathway.",
    tam_band: "₹1,200–2,200 Cr", cac_band: "₹150–300", margin_band: "62–72%", payback_estimate: "6–10 months",
    price_ladder: "₹599 (60 caps) → ₹999 (120 caps) → ₹2,499 (quarterly sub)", format_recommendation: "Capsules over powder. HCL form for zero bloating positioning.",
    founder_brief: "Creatine is the most researched sports supplement with proven efficacy. The HCL form solves the bloating complaint associated with monohydrate. Capsule format adds convenience over powder. Very low fad risk—creatine's efficacy is settled science. Good competition (9) means the market is validated. Differentiate through the HCL + capsule convenience angle. Fast payback makes this a reliable revenue generator.",
    google_trends_data: [20, 22, 25, 28, 31, 34, 38, 42, 46, 50, 54, 58],
    reddit_mentions: [10, 12, 14, 17, 20, 23, 27, 31, 35, 39, 43, 47],
    evidence_snippets: [
      "r/IndianFitness: 'Creatine HCL doesn't bloat me like monohydrate. Worth the premium.'",
      "r/Fitness: 'Creatine capsules are so much more convenient than scooping powder.'",
      "r/Supplements: 'Why is creatine HCL not more popular? No loading phase needed.'"
    ],
  },
  {
    id: "sn-4", trend_name: "Electrolyte Hydration Tabs", trend_score: 74, velocity: 20, coherence: 14, competition: 8,
    entry_window: "Optimal", dominance_prob: 58, feasibility: 86, fad_risk: 16, structural_shift: 74,
    regulatory_risk: "Standard food/supplement product. Electrolyte claims straightforward.",
    tam_band: "₹700–1,400 Cr", cac_band: "₹130–260", margin_band: "58–68%", payback_estimate: "8–12 months",
    price_ladder: "₹299 (20 tabs) → ₹549 (40 tabs) → ₹1,399 (quarterly sub)", format_recommendation: "Effervescent tablets. Sugar-free. Citrus + berry flavors.",
    founder_brief: "Electrolyte hydration tablets are a simple, scalable product with broad appeal—athletes, travelers, hangover recovery, summer hydration. The effervescent format is familiar and fun. Low fad risk and strong structural shift. India's hot climate creates year-round demand. Light weight makes e-commerce economics favorable. Good as a gateway product that builds brand trust for premium supplements.",
    google_trends_data: [18, 20, 22, 25, 28, 31, 34, 38, 42, 46, 50, 54],
    reddit_mentions: [8, 10, 12, 14, 17, 20, 23, 26, 30, 34, 38, 42],
    evidence_snippets: [
      "r/IndianFitness: 'Electrolyte tabs before and after gym. Recovery is noticeably better.'",
      "r/india: 'Summer + dehydration. Need something better than Glucon-D.'",
      "r/running: 'Fizzy electrolyte tabs are perfect for long runs. Easy to carry.'"
    ],
  },
  {
    id: "sn-5", trend_name: "Collagen Peptides for Joints", trend_score: 70, velocity: 18, coherence: 13, competition: 8,
    entry_window: "Optimal", dominance_prob: 52, feasibility: 76, fad_risk: 20, structural_shift: 70,
    regulatory_risk: "Marine collagen import compliance. Joint health claims need substantiation.",
    tam_band: "₹900–1,800 Cr", cac_band: "₹220–420", margin_band: "55–65%", payback_estimate: "12–16 months",
    price_ladder: "₹999 (30 sachets) → ₹1,799 (60 sachets) → ₹4,499 (quarterly sub)", format_recommendation: "Unflavored powder sachets. Mix into any drink. Type II collagen focus.",
    founder_brief: "Collagen peptides for joint health target an older demographic (35+) with genuine pain points. Type II collagen specifically supports cartilage. Less saturated than beauty collagen. The unflavored powder format is versatile. Moderate competition allows differentiation through clinical studies and orthopedic endorsements. Longer payback but loyal customer base with high LTV.",
    google_trends_data: [14, 16, 18, 20, 23, 26, 29, 32, 36, 40, 44, 48],
    reddit_mentions: [6, 8, 10, 12, 14, 17, 20, 23, 26, 30, 34, 38],
    evidence_snippets: [
      "r/Fitness: 'Type II collagen actually helped my knee pain. 3 months consistent use.'",
      "r/india: 'Joint pain at 35. Doctor suggested collagen supplements. Any good Indian brands?'",
      "r/Supplements: 'Hydrolyzed collagen peptides for joints. The evidence is solid now.'"
    ],
  },
  {
    id: "sn-6", trend_name: "Pre-Workout Gummies", trend_score: 64, velocity: 15, coherence: 11, competition: 11,
    entry_window: "Late", dominance_prob: 42, feasibility: 74, fad_risk: 35, structural_shift: 50,
    regulatory_risk: "Caffeine content limits. FSSAI compliance for stimulant ingredients.",
    tam_band: "₹300–600 Cr", cac_band: "₹250–450", margin_band: "52–62%", payback_estimate: "14–18 months",
    price_ladder: "₹499 (30ct) → ₹899 (60ct) → ₹2,199 (quarterly sub)", format_recommendation: "Gummies with caffeine + beta-alanine. Sour candy flavors.",
    founder_brief: "Pre-workout gummies are a fun format but face competition from established powder pre-workouts and the emerging stim market. High fad risk (35%) suggests caution. The gummy format limits dosing flexibility—a key drawback for experienced gym-goers. Better suited as a gateway product for casual fitness consumers than serious athletes. Late entry window makes this a risky standalone bet.",
    google_trends_data: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    reddit_mentions: [10, 11, 12, 12, 13, 14, 14, 15, 16, 16, 17, 18],
    evidence_snippets: [
      "r/IndianFitness: 'Pre-workout gummies seem fun but can they actually dose enough caffeine?'",
      "r/Fitness: 'Gummies for pre-workout feel gimmicky. Just drink the powder.'",
      "r/Supplements: 'Pre-workout gummies are for casuals. Serious lifters need proper dosing.'"
    ],
  },
];

export const radarDataByCategory: Record<string, TrendData[]> = {
  "Wellness & Supplements": wellnessSupplements,
  "Functional Beverages": functionalBeverages,
  "Beauty & Personal Care": beautyPersonalCare,
  "Healthy Snacking": healthySnacking,
  "Mental Health & Sleep": mentalHealthSleep,
  "Sports Nutrition": sportsNutrition,
};
