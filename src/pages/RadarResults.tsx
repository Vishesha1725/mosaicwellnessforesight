import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RadarHeader from "@/components/RadarHeader";
import TopOpportunity from "@/components/TopOpportunity";
import TrendCard from "@/components/TrendCard";
import TrendPanel from "@/components/TrendPanel";
import { TrendData } from "@/data/mockTrends";
import { timeWindows } from "@/data/mockTrends";
import { GoogleTrendsMap } from "@/pages/Index";

interface RadarState {
  trends: TrendData[];
  googleTrendsMap: GoogleTrendsMap;
  sampleFallback: boolean;
  dataSource: "serpapi" | "sample";
  category: string;
  timeWindow: number;
  lastUpdated: string;
  activeSources: string[];
}

const RadarResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RadarState | null;
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const { trends, googleTrendsMap, sampleFallback, dataSource, category, timeWindow, lastUpdated, activeSources } = state;
  const topTrend = trends.length > 0 ? trends[0] : null;
  const windowLabel = timeWindows.find((tw) => tw.value === timeWindow)?.label ?? `${timeWindow} Days`;

  return (
    <div
      className="min-h-screen bg-noise relative overflow-hidden p-4 sm:p-6"
      style={{
        background:
          "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 22% 8%) 40%, hsl(240 15% 10%) 100%)",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 20%, hsl(190 50% 25% / 0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 60%, hsl(260 30% 25% / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <RadarHeader
          category={category}
          timeWindow={timeWindow}
          onCategoryChange={() => {}}
          onTimeWindowChange={() => {}}
          onRun={() => navigate("/")}
          isLoading={false}
          lastUpdated={lastUpdated}
          dataSource={dataSource}
          showControls={false}
        />

        {/* Scan Config Summary */}
        <div className="glass-card px-5 py-3 flex items-center gap-4 flex-wrap text-xs">
          <span className="text-muted-foreground font-medium">Scan Config:</span>
          <span className="text-foreground font-semibold">{category}</span>
          <span className="text-border">·</span>
          <span className="text-foreground">{windowLabel}</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">Scored on: <span className="text-foreground font-semibold">{timeWindow} days</span></span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">Signals:</span>
          {activeSources.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 border border-primary/30 text-primary">
              {s}
            </span>
          ))}
          <button
            onClick={() => navigate("/")}
            className="ml-auto text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ← New Scan
          </button>
        </div>

        {sampleFallback && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl px-5 py-3 text-xs text-warning flex items-center gap-2">
            <span>⚠️</span>
            <span>Using sample trends data — add <span className="font-mono">SERPAPI_KEY</span> for live Google Trends.</span>
          </div>
        )}

        {topTrend && (
          <>
            <TopOpportunity
              trend={topTrend}
              onViewBrief={() => setSelectedTrend(topTrend)}
              googleTrends={googleTrendsMap[topTrend.trend_name]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {trends.slice(1).map((trend, i) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  rank={i + 2}
                  onClick={() => setSelectedTrend(trend)}
                  googleTrends={googleTrendsMap[trend.trend_name]}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedTrend && (
        <>
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setSelectedTrend(null)}
          />
          <TrendPanel
            trend={selectedTrend}
            onClose={() => setSelectedTrend(null)}
            googleTrends={googleTrendsMap[selectedTrend.trend_name]}
          />
        </>
      )}
    </div>
  );
};

export default RadarResults;
