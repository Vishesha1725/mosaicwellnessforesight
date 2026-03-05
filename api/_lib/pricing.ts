import type { CatalogProduct } from "./catalog.js";

const categoryDefaults: Record<string, string[]> = {
  "Wellness & Supplements": ["capsules", "sachets", "gummies"],
  "Functional Beverages": ["shots", "soda", "mix sachet"],
  "Beauty & Personal Care": ["serum", "stick", "spray"],
  "Healthy Snacking": ["bars", "cups", "laddoos"],
  "Mental Health & Sleep": ["patches", "kits", "masks"],
  "Sports Nutrition": ["gels", "preworkout", "intra hydration"],
};

export function buildPricingAndFormats(product: CatalogProduct, category: string) {
  const base = product.pricingHints || { trial: [199, 399] as [number, number], monthly: [899, 1599] as [number, number], bundle: [1999, 3499] as [number, number] };
  const formats = [...new Set([...(product.formatHints || []), ...(categoryDefaults[category] || [])])].slice(0, 3);
  return { formats, pricing: base };
}
