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
}

const RadarHeader = ({ category, timeWindow, onCategoryChange, onTimeWindowChange, onRun, isLoading }: RadarHeaderProps) => {
  return (
    <header className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 mr-auto">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Radar size={18} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">Mosaic Foresight Engine</h1>
          <p className="text-xs text-muted-foreground">Category intelligence & trend radar</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[200px] bg-secondary border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(timeWindow)} onValueChange={(v) => onTimeWindowChange(Number(v))}>
          <SelectTrigger className="w-[120px] bg-secondary border-border text-sm">
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
          className="px-5 py-2.5 gradient-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 glow-primary"
        >
          <Radar size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Scanning…" : "Run Radar"}
        </button>
      </div>
    </header>
  );
};

export default RadarHeader;
