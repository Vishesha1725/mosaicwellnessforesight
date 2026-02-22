import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import MeterBar from "./MeterBar";
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
      className="glass-card p-6 text-left w-full hover:border-primary/30 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted-foreground font-medium">#{rank}</span>
          <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
            {trend.trend_name}
          </h3>
        </div>
        <EntryBadge window={trend.entry_window} />
      </div>

      <div className="flex items-center gap-6">
        <ScoreRing value={trend.trend_score} max={100} label="Score" color="primary" />
        
        <div className="flex-1 space-y-2.5">
          <MeterBar value={trend.velocity} max={30} label="Velocity" color="success" />
          <MeterBar value={trend.coherence} max={20} label="Coherence" color="primary" />
          <MeterBar value={trend.competition} max={15} label="Compete" color={trend.competition > 10 ? "warning" : "primary"} />
        </div>

        <div className="text-right pl-4">
          <p className="font-mono text-xl font-bold text-primary">{trend.dominance_prob}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dominance</p>
        </div>
      </div>
    </button>
  );
};

export default TrendCard;
