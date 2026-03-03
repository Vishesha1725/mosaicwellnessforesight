import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, timeWindows } from "@/data/mockTrends";
import { Radar } from "lucide-react";
import mosaicLogo from "@/assets/mosaic-logo.png";

interface RadarHeaderProps {
  category: string;
  timeWindow: number;
  onCategoryChange: (v: string) => void;
  onTimeWindowChange: (v: number) => void;
  onRun: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
  dataSource?: "serpapi" | "sample" | null;
  canRun?: boolean;
}

const RadarHeader = ({
  category,
  timeWindow,
  onCategoryChange,
  onTimeWindowChange,
  onRun,
  isLoading,
  lastUpdated,
  dataSource,
  canRun = true,
}: RadarHeaderProps) => {
  return (
    <header className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sticky top-4 z-30">
      <div className="flex items-center gap-3 mr-auto">
        <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <img src={mosaicLogo} alt="Mosaic Wellness" className="w-9 h-9 rounded-lg object-cover" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight leading-tight">
            Mosaic Foresight Engine
          </h1>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-muted-foreground">Category intelligence & trend radar</p>
            {lastUpdated && (
              <>
                <span className="text-border">·</span>
                <p className="text-xs text-muted-foreground font-mono">{lastUpdated}</p>
              </>
            )}
            {dataSource && (
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  dataSource === "serpapi"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-warning/10 border-warning/30 text-warning"
                }`}
              >
                {dataSource === "serpapi" ? "Live: Google Trends (SerpAPI)" : "Sample data (no key / API error)"}
              </span>
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
          disabled={isLoading || !canRun}
          className="px-5 py-2 h-9 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Radar size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Scanning…" : "Run Radar"}
        </button>
      </div>
    </header>
  );
};

export default RadarHeader;
