import { TrendData } from "@/data/mockTrends";
import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import Sparkline from "./Sparkline";
import { ArrowRight } from "lucide-react";
import { GoogleTrendsResult } from "@/lib/googleTrends";

interface TopOpportunityProps {
  trend: TrendData;
  onViewBrief: () => void;
  googleTrends?: GoogleTrendsResult;
}

const getWhyNow = (trend: TrendData): string => {
  if (trend.velocity >= 22) {
    return `Search is accelerating (velocity ${trend.velocity}) + Reddit chatter is rising → early adopter demand is real.`;
  }
  return `Search momentum building (velocity ${trend.velocity}) with consistent Reddit signal → demand forming.`;
};

const getWhitespace = (trend: TrendData): string => {
  if (trend.competition <= 6) {
    return `Competition is still low (${trend.competition}/15) in this format → first-mover edge.`;
  }
  return `Moderate competition (${trend.competition}/15) but format gap exists → differentiation wins.`;
};

const getMoney = (trend: TrendData): string => {
  return `TAM ${trend.tam_band} + margins ${trend.margin_band} → scalable fast.`;
};

const getMove = (trend: TrendData): string => {
  const weeks = trend.entry_window === "Early" ? "4–6" : trend.entry_window === "Optimal" ? "6–8" : "8–12";
  return `Launch a pilot in ${weeks} weeks. If CAC stays below ${trend.cac_band.split("–")[1] || trend.cac_band}, scale hard.`;
};

const getCreativeAngle = (trend: TrendData): string => {
  // Generate a punchy creative hook based on the trend
  const hooks: Record<string, string> = {
    "Ashwagandha Gummies": `"Make stress relief feel like candy: Ashwagandha gummies positioned as 'calm-in-60' nightly ritual."`,
    "Mushroom Coffee Blends": `"Smart coffee for sharp mornings: Lion's Mane-infused brew positioned as 'focus fuel for founders.'"`,
    "Peptide Serums": `"Skip the clinic, keep the results: peptide serums positioned as 'dermatologist-grade, your bathroom.'"`,
    "Probiotic Sparkling Water": `"Gut health that pops: probiotic sparkling water positioned as 'the soda upgrade you actually enjoy.'"`,
    "Magnesium Glycinate Sticks": `"Calm in your pocket: magnesium sticks positioned as 'the 3pm reset' for burned-out professionals."`,
    "Makhana Chips": `"Crunch without the guilt: makhana chips positioned as 'the snack your nutritionist actually approves.'"`,
  };
  return hooks[trend.trend_name] || `"Own the '${trend.trend_name.toLowerCase()}' ritual: position as a daily habit, not a product."`;
};

const TopOpportunity = ({ trend, onViewBrief, googleTrends }: TopOpportunityProps) => {
  const hasTimeline = googleTrends && googleTrends.timeline.length > 0;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl border border-border p-8"
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

        {/* Header row */}
        <div className="flex items-start gap-8 mb-6">
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

        {/* Google Trends Sparkline */}
        {hasTimeline && (
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <Sparkline data={googleTrends.timeline} height={36} />
            </div>
            <div className="text-right shrink-0">
              <span className={`font-mono text-sm font-semibold ${googleTrends.growth_pct > 0 ? "text-success" : "text-warning"}`}>
                {googleTrends.growth_pct > 0 ? "↑" : "↓"}{Math.abs(googleTrends.growth_pct)}%
              </span>
              <p className="text-[10px] text-muted-foreground">Search growth (India)</p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-border mb-5" />

        {/* Strategic Whitespace */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground tracking-widest font-medium mb-3">Strategic Whitespace</p>
          <div className="space-y-1.5">
            <p className="text-sm text-secondary-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Why now:</span> {getWhyNow(trend)}
            </p>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Whitespace:</span> {getWhitespace(trend)}
            </p>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Money:</span> {getMoney(trend)}
            </p>
          </div>
        </div>

        {/* Move */}
        <div className="bg-muted/40 border border-border rounded-lg px-5 py-3 mb-5">
          <p className="text-sm text-secondary-foreground leading-relaxed">
            <span className="font-semibold text-primary">Move:</span> {getMove(trend)}
          </p>
        </div>

        {/* Creative Angle */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground tracking-widest font-medium mb-2">Creative Angle</p>
          <p className="text-sm text-foreground/90 italic leading-relaxed">
            {getCreativeAngle(trend)}
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
