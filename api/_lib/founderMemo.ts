export function buildFounderMemo(input: {
  productName: string;
  category: string;
  classification: "REAL TREND" | "EARLY SIGNAL" | "FAD";
  formats: string[];
  pricing: { trial: [number, number]; monthly: [number, number]; bundle: [number, number] };
  metrics: {
    growthMomentum: number;
    growthDescriptor: string;
    recentCount: number | null;
    mentionCount: number | null;
    marketStrength: number;
    fadRiskLabel: string;
  };
}) {
  const fmtInt = (n: number | null | undefined) => (typeof n === "number" && Number.isFinite(n) ? Math.round(n).toLocaleString("en-IN") : "--");
  const fmtINR = (n: number) => `INR ${Math.round(n).toLocaleString("en-IN")}`;
  const { productName, category, classification, formats, pricing, metrics } = input;
  const whatHappening = `${productName} is showing ${fmtInt(metrics.marketStrength)}/100 market strength in ${category}. Interest is building and creators are beginning to publish around this format.`;
  const proof = `Upward Momentum: ${fmtInt(metrics.growthMomentum)}/100 (${metrics.growthDescriptor}) | YouTube recent videos: ${fmtInt(metrics.recentCount)} | Reddit mentions: ${fmtInt(metrics.mentionCount)}`;
  const why = [
    `Classification: ${classification} based on growth consistency and source spread.`,
    `Fad risk is ${metrics.fadRiskLabel}.`,
    `Signal mix includes search + creator activity + community chatter.`,
  ];
  const wedge = [
    `Lead with a single clear claim and one daily usage moment.`,
    `Launch with ${formats[0]} first, then expand to ${formats[1]} and ${formats[2]}.`,
    `Use product bundles to increase repeat purchase.`
  ];
  const gtm = `Start with creators + marketplaces, then D2C site. Add gyms/studios for ${category === "Sports Nutrition" ? "performance sampling" : "niche community acquisition"}.`;
  const risks = [
    "Over-claiming efficacy can hurt trust. Keep claims simple.",
    "Price mismatch can kill repeat rate. Validate trial price early.",
    "Too many SKUs too soon increases burn. Focus on one hero SKU."
  ];

  const ninetyDayPlan = `Week 1-2: concept + landing page + waitlist.\nWeek 3-6: pilot batch + creator seeding + marketplace listing.\nWeek 7-12: retention focus, subscription bundle, scale winning channel.`;

  return {
    whatHappening,
    proof,
    whyRealOrFad: why,
    productWedge: wedge,
    formatsAndPricing: `Formats: ${formats.join(" / ")} | Trial ${fmtINR(pricing.trial[0])}-${fmtINR(pricing.trial[1])}, Monthly ${fmtINR(pricing.monthly[0])}-${fmtINR(pricing.monthly[1])}, Bundle ${fmtINR(pricing.bundle[0])}-${fmtINR(pricing.bundle[1])}`,
    gtmIndia: gtm,
    risksAndFixes: risks,
    ninetyDayPlan,
  };
}
