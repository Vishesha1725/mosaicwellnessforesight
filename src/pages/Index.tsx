import { useState } from "react";
import RadarHeader from "@/components/RadarHeader";
import TrendCard from "@/components/TrendCard";
import TrendPanel from "@/components/TrendPanel";
import { mockTrends, categories, TrendData } from "@/data/mockTrends";

const Index = () => {
  const [category, setCategory] = useState(categories[0]);
  const [timeWindow, setTimeWindow] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);

  const handleRun = () => {
    setIsLoading(true);
    setSelectedTrend(null);
    // Simulate loading then show mock data
    setTimeout(() => {
      setTrends([...mockTrends].sort((a, b) => b.trend_score - a.trend_score));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <RadarHeader
          category={category}
          timeWindow={timeWindow}
          onCategoryChange={setCategory}
          onTimeWindowChange={setTimeWindow}
          onRun={handleRun}
          isLoading={isLoading}
        />

        {trends.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
              <span className="text-2xl">📡</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Ready to scan</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a category and time window, then hit <span className="text-primary font-semibold">Run Radar</span> to discover emerging trends.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-4 bg-secondary rounded w-2/3 mb-4" />
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary" />
                  <div className="w-14 h-14 rounded-full bg-secondary" />
                  <div className="w-14 h-14 rounded-full bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && trends.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {trends.map((trend, i) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                rank={i + 1}
                onClick={() => setSelectedTrend(trend)}
              />
            ))}
          </div>
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
