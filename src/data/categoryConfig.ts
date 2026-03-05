export const categories = [
  "Wellness & Supplements",
  "Functional Beverages",
  "Beauty & Personal Care",
  "Healthy Snacking",
  "Mental Health & Sleep",
  "Sports Nutrition",
] as const;

export type CategoryName = (typeof categories)[number];

export const categoryFormatIdeas: Record<CategoryName, string[]> = {
  "Wellness & Supplements": ["capsules", "sachets", "gummies"],
  "Functional Beverages": ["shots", "soda", "mix sachet"],
  "Beauty & Personal Care": ["serum", "stick", "spray"],
  "Healthy Snacking": ["bars", "cups", "laddoos"],
  "Mental Health & Sleep": ["patches", "kits", "masks"],
  "Sports Nutrition": ["gels", "preworkout", "intra hydration"],
};

export const starterAnchors: Record<CategoryName, string[]> = {
  "Wellness & Supplements": [
    "Magnesium Glycinate",
    "Postbiotic",
    "Electrolyte Powder",
    "Algae Omega 3",
    "Creatine For Women",
    "NAD Supplement",
  ],
  "Functional Beverages": [
    "Protein Coffee",
    "Gut Drink",
    "Electrolyte Drink",
    "Sleep Tonic",
    "Collagen Drink",
    "Prebiotic Drink",
  ],
  "Beauty & Personal Care": [
    "Ceramide Moisturizer",
    "Sunscreen Stick",
    "Scalp Serum",
    "Peptide Serum",
    "Body Acne Spray",
    "Red Light Therapy Mask",
  ],
  "Healthy Snacking": [
    "Protein Snacks India",
    "Low Sugar Mithai",
    "High Protein Poha",
    "Prebiotic Snacks",
    "Seed Bars",
    "Low GI Snacks",
  ],
  "Mental Health & Sleep": [
    "Mouth Tape Sleep",
    "Sleep Gummies",
    "Glycine Sleep",
    "Nasal Strips",
    "Weighted Eye Mask",
    "Breathwork App",
  ],
  "Sports Nutrition": [
    "Electrolyte Gel",
    "Protein Coffee",
    "Creatine Gummies",
    "Intra Workout Hydration",
    "Plant Protein Blend",
    "Caffeine Free Preworkout",
  ],
};
