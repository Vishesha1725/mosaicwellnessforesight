import { TrendData } from "@/data/mockTrends";
import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import { ArrowRight, TrendingUp, Shield, DollarSign } from "lucide-react";

interface TopOpportunityProps {
  trend: TrendData;
  onViewBrief: () => void;
}

const TopOpportunity = ({ trend, onViewBrief }: TopOpportunityProps) => {
  const insights = [
    {
      icon: TrendingUp,
      text: `${trend.velocity}/30 velocity with ${trend.coherence}/20 signal coherence — strong momentum`,
    },
    {
      icon: Shield,
      text: `${trend.fad_risk}% fad risk, ${trend.structural_shift}% structural shift — durable opportunity`,
    },
    {
      icon: DollarSign,
      text: `${trend.margin_band} margins, ${trend.payback_estimate} payback — capital efficient`,
    },
  ];

  return (
    <div className="glass-card-elevated p-6 border-primary/15">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-primary uppercase tracking-widest font-semibold">Top Opportunity</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex items-start gap-6">
        <ScoreRing value={trend.trend_score} max={100} size={64} strokeWidth={4} label="Score" color="primary" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-foreground">{trend.trend_name}</h2>
            <EntryBadge window={trend.entry_window} />
          </div>

          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <insight.icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-secondary-foreground leading-snug">{insight.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onViewBrief}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary text-sm font-medium rounded-lg transition-colors"
          >
            View Brief
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopOpportunity;
