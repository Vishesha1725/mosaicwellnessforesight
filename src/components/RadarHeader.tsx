import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, timeWindows } from "@/data/mockTrends";
import { Radar } from "lucide-react";

interface RadarHeaderProps {
  category: string;
  timeWindow: number;
  onCategoryChange: (v: string) => void;
  onTimeWindowChange: (v: number) => void;
  onRun: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
}

const RadarHeader = ({ category, timeWindow, onCategoryChange, onTimeWindowChange, onRun, isLoading, lastUpdated }: RadarHeaderProps) => {
  return (
    <header className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 mr-auto">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Radar size={16} className="text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">Mosaic Foresight Engine</h1>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-muted-foreground">Category intelligence & trend radar</p>
            {lastUpdated && (
              <>
                <span className="text-border">·</span>
                <p className="text-[11px] text-muted-foreground font-mono">{lastUpdated}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[200px] bg-secondary/50 border-border text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(timeWindow)} onValueChange={(v) => onTimeWindowChange(Number(v))}>
          <SelectTrigger className="w-[110px] bg-secondary/50 border-border text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeWindows.map((tw) => (
              <SelectItem key={tw.value} value={String(tw.value)}>{tw.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={onRun}
          disabled={isLoading}
          className="px-4 py-2 h-9 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Radar size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Scanning…" : "Run Radar"}
        </button>
      </div>
    </header>
  );
};

export default RadarHeader;
