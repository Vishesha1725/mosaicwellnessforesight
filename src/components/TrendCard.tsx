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
      className="relative overflow-hidden rounded-xl bg-card/70 backdrop-blur-xl border border-border p-6 text-left w-full hover:border-primary/25 transition-all duration-200 group cursor-pointer"
      style={{
        boxShadow: "0 2px 12px -2px hsl(0 0% 0% / 0.35), inset 0 1px 1px hsl(0 0% 100% / 0.02)",
      }}
    >
      {/* Subtle top-left glow */}
      <div
        className="absolute -top-16 -left-16 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">#{rank}</span>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {trend.trend_name}
            </h3>
          </div>
          <EntryBadge window={trend.entry_window} />
        </div>

        <div className="flex items-center gap-6">
          <ScoreRing value={trend.trend_score} max={100} size={52} strokeWidth={2.5} label="Score" color="primary" />

          <div className="flex-1 space-y-3">
            <MeterBar value={trend.velocity} max={30} label="Velocity" color="success" />
            <MeterBar value={trend.coherence} max={20} label="Coherence" color="primary" />
            <MeterBar value={trend.competition} max={15} label="Competition" color={trend.competition > 10 ? "warning" : "primary"} />
          </div>

          <div className="text-right pl-4">
            <p className="font-mono text-xl font-bold text-primary">{trend.dominance_prob}%</p>
            <p className="text-[10px] text-muted-foreground tracking-wider">Dominance</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TrendCard;
