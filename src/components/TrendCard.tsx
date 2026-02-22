import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import { TrendData } from "@/data/mockTrends";

interface TrendCardProps {
  trend: TrendData;
  rank: number;
  onClick: () => void;
}

const TrendCard = ({ trend, rank, onClick }: TrendCardProps) => {
  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left w-full hover:border-primary/40 transition-all duration-300 hover:glow-primary group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">#{rank}</span>
          <h3 className="font-semibold text-foreground group-hover:text-gradient-primary transition-colors">
            {trend.trend_name}
          </h3>
        </div>
        <EntryBadge window={trend.entry_window} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ScoreRing value={trend.trend_score} max={100} label="Score" color="primary" />
          <ScoreRing value={trend.velocity} max={30} label="Velocity" color="accent" />
          <ScoreRing value={trend.coherence} max={20} label="Coherence" color="success" />
          <ScoreRing value={trend.competition} max={15} label="Compete" color={trend.competition > 10 ? "destructive" : "warning"} />
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold text-gradient-accent">{trend.dominance_prob}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dominance</p>
        </div>
      </div>
    </button>
  );
};

export default TrendCard;
