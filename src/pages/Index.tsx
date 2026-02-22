import { useState } from "react";
import RadarHeader from "@/components/RadarHeader";
import TrendCard from "@/components/TrendCard";
import TrendPanel from "@/components/TrendPanel";
import TopOpportunity from "@/components/TopOpportunity";
import { categories, TrendData } from "@/data/mockTrends";
import { radarDataByCategory } from "@/data/radarDataByCategory";

const applyTimeWindowScoring = (trends: TrendData[], windowDays: number): TrendData[] => {
  return trends.map((t) => {
    let adjustedScore = t.trend_score;
    if (windowDays === 30) {
      adjustedScore = Math.round(t.trend_score * 0.9 + (t.velocity / 30) * 10);
    } else if (windowDays === 180) {
      adjustedScore = Math.round(t.trend_score * 0.9 + (t.coherence / 20) * 10);
    }
    return { ...t, trend_score: Math.min(adjustedScore, 99) };
  });
};

const Index = () => {
  const [category, setCategory] = useState(categories[0]);
  const [timeWindow, setTimeWindow] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleRun = () => {
    setIsLoading(true);
    setSelectedTrend(null);
    setTimeout(() => {
      const raw = radarDataByCategory[category] || [];
      const scored = applyTimeWindowScoring(raw, timeWindow);
      setTrends([...scored].sort((a, b) => b.trend_score - a.trend_score));
      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      setIsLoading(false);
    }, 1200);
  };

  const topTrend = trends.length > 0 ? trends[0] : null;

  return (
    <div className="min-h-screen bg-background bg-noise p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <RadarHeader
          category={category}
          timeWindow={timeWindow}
          onCategoryChange={setCategory}
          onTimeWindowChange={setTimeWindow}
          onRun={handleRun}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
        />

        {trends.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <span className="text-xl">📡</span>
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">Ready to scan</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Select a category and time window, then hit <span className="text-primary font-medium">Run Radar</span> to discover emerging trends.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="glass-card p-6 animate-pulse">
              <div className="h-3 bg-secondary rounded w-24 mb-4" />
              <div className="h-5 bg-secondary rounded w-48 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-secondary rounded w-full" />
                <div className="h-3 bg-secondary rounded w-3/4" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-4 bg-secondary rounded w-2/3 mb-5" />
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-1.5 bg-secondary rounded w-full" />
                      <div className="h-1.5 bg-secondary rounded w-4/5" />
                      <div className="h-1.5 bg-secondary rounded w-3/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && topTrend && (
          <>
            <TopOpportunity
              trend={topTrend}
              onViewBrief={() => setSelectedTrend(topTrend)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {trends.slice(1).map((trend, i) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  rank={i + 2}
                  onClick={() => setSelectedTrend(trend)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Side Panel Overlay */}
      {selectedTrend && (
        <>
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setSelectedTrend(null)}
          />
          <TrendPanel trend={selectedTrend} onClose={() => setSelectedTrend(null)} />
        </>
      )}
    </div>
  );
};

export default Index;
