import { useState } from "react";
import RadarHeader from "@/components/RadarHeader";
import TrendCard from "@/components/TrendCard";
import TrendPanel from "@/components/TrendPanel";
import TopOpportunity from "@/components/TopOpportunity";
import RadarPulse from "@/components/RadarPulse";
import HowItWorks from "@/components/HowItWorks";
import { categories, TrendData } from "@/data/mockTrends";
import { radarDataByCategory } from "@/data/radarDataByCategory";
import { fetchGoogleTrendsData, GoogleTrendsResult } from "@/lib/googleTrends";
import { toast } from "sonner";
import { Radar } from "lucide-react";

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

export interface GoogleTrendsMap {
  [keyword: string]: GoogleTrendsResult;
}

const Index = () => {
  const [category, setCategory] = useState(categories[0]);
  const [timeWindow, setTimeWindow] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [googleTrendsMap, setGoogleTrendsMap] = useState<GoogleTrendsMap>({});
  const [sampleFallback, setSampleFallback] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setSelectedTrend(null);
    setSampleFallback(false);

    const raw = radarDataByCategory[category] || [];
    const scored = applyTimeWindowScoring(raw, timeWindow);
    const sorted = [...scored].sort((a, b) => b.trend_score - a.trend_score);

    // Fetch Google Trends data for all trend keywords
    try {
      const keywords = sorted.map((t) => t.trend_name);
      const { results, sample_fallback } = await fetchGoogleTrendsData(keywords, timeWindow);

      const gtMap: GoogleTrendsMap = {};
      results.forEach((r) => {
        gtMap[r.keyword] = r;
      });

      // Update velocity scores from live data
      const updatedTrends = sorted.map((t) => {
        const gt = gtMap[t.trend_name];
        if (gt && !gt.sample && gt.velocity_score > 0) {
          return { ...t, velocity: gt.velocity_score };
        }
        return t;
      });

      // Re-sort after velocity update
      updatedTrends.sort((a, b) => b.trend_score - a.trend_score);

      setGoogleTrendsMap(gtMap);
      setTrends(updatedTrends);
      setSampleFallback(sample_fallback);

      if (sample_fallback) {
        toast.info("Using sample trends data — add SERPAPI_KEY for live Google Trends.", {
          duration: 6000,
        });
      }
    } catch {
      // Fallback to mock data
      setTrends(sorted);
      setSampleFallback(true);
      toast.info("Using sample trends data — add SERPAPI_KEY for live Google Trends.", {
        duration: 6000,
      });
    }

    setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    setIsLoading(false);
  };

  const topTrend = trends.length > 0 ? trends[0] : null;

  const proofChips = ["Google Trends", "Reddit", "YouTube", "Research", "Regulatory"];

  return (
    <div className="min-h-screen bg-noise relative overflow-hidden p-4 sm:p-6"
      style={{
        background: "linear-gradient(135deg, hsl(200 40% 12%) 0%, hsl(210 45% 10%) 40%, hsl(250 25% 14%) 100%)",
      }}
    >
      {/* Hero gradient mesh overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 20%, hsl(190 60% 30% / 0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 60%, hsl(260 40% 35% / 0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-4">
        <RadarHeader
          category={category}
          timeWindow={timeWindow}
          onCategoryChange={setCategory}
          onTimeWindowChange={setTimeWindow}
          onRun={handleRun}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
        />

        {sampleFallback && trends.length > 0 && (
          <div className="bg-muted/60 border border-border rounded-lg px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
            <span>⚠️</span>
            <span>Using sample trends data — add <span className="font-mono text-primary">SERPAPI_KEY</span> for live Google Trends.</span>
          </div>
        )}

        {trends.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Tagline + proof chips */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6 leading-relaxed">
              Detect emerging wellness trends in India before they go mainstream.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {proofChips.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-border bg-card/50 text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Hero empty state card */}
            <div className="glass-card-elevated p-8 sm:p-10 max-w-lg w-full relative">
              <div className="relative flex items-center justify-center mb-6">
                <RadarPulse />
                <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary">
                  <Radar size={28} className="text-primary" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Ready to scan</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Pick a category + time window, then hit{" "}
                <span className="text-primary font-medium">Run Radar</span> to generate
                5–10 opportunity briefs.
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-4 font-mono">
                Last scan: {lastUpdated ?? "—"}
              </p>
            </div>

            <HowItWorks />
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

      {/* Side Panel Overlay */}
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

export default Index;
