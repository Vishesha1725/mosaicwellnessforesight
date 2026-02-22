import { TrendData } from "@/data/mockTrends";
import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import { ArrowRight, TrendingUp, Shield, DollarSign, Target } from "lucide-react";

interface TopOpportunityProps {
  trend: TrendData;
  onViewBrief: () => void;
}

const getStrategicHighlights = (trend: TrendData) => [
  {
    label: "Demand Elasticity",
    text: trend.velocity >= 22
      ? "High search velocity signals strong inbound demand — price sensitivity is low in early adopters."
      : "Moderate search velocity indicates growing but price-conscious demand — lean into value positioning.",
  },
  {
    label: "Repeat Purchase Potential",
    text: trend.coherence >= 16
      ? "High signal coherence across channels suggests genuine repeat intent, not one-time curiosity."
      : "Moderate coherence — build subscription mechanics early to lock in retention before novelty fades.",
  },
  {
    label: "Consumer Signal Strength",
    text: trend.structural_shift >= 70
      ? `${trend.structural_shift}% structural shift with ${trend.fad_risk}% fad risk — this is a durable behavioral change, not a trend cycle.`
      : `${trend.structural_shift}% structural shift — promising but monitor fad risk (${trend.fad_risk}%) closely over next quarter.`,
  },
  {
    label: "Competitive Whitespace",
    text: trend.competition <= 6
      ? `Competition index of ${trend.competition}/15 — significant whitespace exists. First-mover advantage is real and defensible.`
      : `Competition index of ${trend.competition}/15 — moderate crowding. Differentiate on format, brand, or channel strategy.`,
  },
];

const getFounderConclusion = (trend: TrendData): string => {
  if (trend.dominance_prob >= 65) {
    return `${trend.trend_name} presents a rare convergence of high velocity, low competition, and strong structural tailwinds. The ${trend.margin_band} margin profile with ${trend.payback_estimate} payback makes this a capital-efficient first bet. Move decisively — the window is ${trend.entry_window.toLowerCase()} and closing.`;
  }
  return `${trend.trend_name} shows promising fundamentals with a ${trend.dominance_prob}% dominance probability. The ${trend.tam_band} TAM provides sufficient runway for scale. Execute with discipline on unit economics and brand positioning to capture the opportunity before the window shifts.`;
};

const TopOpportunity = ({ trend, onViewBrief }: TopOpportunityProps) => {
  const highlights = getStrategicHighlights(trend);
  const conclusion = getFounderConclusion(trend);

  return (
    <div className="relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-xl border border-border p-8"
      style={{
        boxShadow: "0 4px 24px -4px hsl(0 0% 0% / 0.5), inset 0 1px 1px hsl(0 0% 100% / 0.03)",
      }}
    >
      {/* Top-left glow overlay */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Section label */}
        <p className="text-[11px] text-muted-foreground tracking-widest font-medium mb-6">
          Top Opportunity
        </p>

        {/* Header row: name + key metrics */}
        <div className="flex items-start gap-8 mb-8">
          <ScoreRing value={trend.trend_score} max={100} size={72} strokeWidth={3} label="Score" color="primary" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{trend.trend_name}</h2>
              <EntryBadge window={trend.entry_window} />
            </div>

            <div className="flex items-center gap-6 mt-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Est. TAM</p>
                <p className="text-sm font-semibold text-foreground">{trend.tam_band}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Dominance Prob.</p>
                <p className="text-sm font-semibold text-primary font-mono">{trend.dominance_prob}%</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Entry Window</p>
                <p className="text-sm font-semibold text-foreground">{trend.entry_window}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Margins</p>
                <p className="text-sm font-semibold text-foreground">{trend.margin_band}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Strategic highlights */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-sm text-secondary-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{h.label}:</span>{" "}
                {h.text}
              </p>
            </div>
          ))}
        </div>

        {/* Founder conclusion */}
        <div className="bg-muted/40 border border-border rounded-lg p-5 mb-6">
          <p className="text-sm text-secondary-foreground leading-relaxed italic">
            {conclusion}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onViewBrief}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary text-sm font-medium rounded-lg transition-colors"
        >
          View Full Brief
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default TopOpportunity;
