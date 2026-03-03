import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadarHeader from "@/components/RadarHeader";
import RadarPulse from "@/components/RadarPulse";
import HowItWorks from "@/components/HowItWorks";
import SourceChips from "@/components/SourceChips";
import LoadingProgress from "@/components/LoadingProgress";
import { categories, TrendData } from "@/data/mockTrends";
import { radarDataByCategory } from "@/data/radarDataByCategory";
import { fetchGoogleTrendsData, GoogleTrendsResult } from "@/lib/googleTrends";
import { toast } from "sonner";
import { Radar } from "lucide-react";

const allSources = ["Google Trends", "YouTube", "Amazon", "Research", "Regulatory"];

const applyTimeWindowScoring = (trends: TrendData[], windowDays: number): TrendData[] => {
  return trends.map((t) => {
    const gtd = t.google_trends_data;

    if (windowDays === 30) {
      // 30-day: emphasise recent spikes & velocity; RecencyBoost
      const recentSlice = gtd.slice(-3);
      const recentAvg = recentSlice.reduce((s, v) => s + v, 0) / (recentSlice.length || 1);
      const fullAvg = gtd.reduce((s, v) => s + v, 0) / (gtd.length || 1);
      const recencyBoost = Math.min(((recentAvg - fullAvg) / Math.max(fullAvg, 1)) * 40, 20);
      const velocityBoost = (t.velocity / 30) * 15;
      const adjustedScore = Math.round(
        t.trend_score * 0.65 + velocityBoost + recencyBoost + (t.fad_risk < 25 ? 5 : 0)
      );
      return { ...t, trend_score: Math.min(Math.max(adjustedScore, 10), 99) };
    }

    if (windowDays === 180) {
      // 180-day: penalise short spikes (SpikePenalty), reward structural durability
      const firstHalf = gtd.slice(0, Math.ceil(gtd.length / 2));
      const secondHalf = gtd.slice(Math.ceil(gtd.length / 2));
      const avgFirst = firstHalf.reduce((s, v) => s + v, 0) / (firstHalf.length || 1);
      const avgSecond = secondHalf.reduce((s, v) => s + v, 0) / (secondHalf.length || 1);
      const sustainedGrowth = avgSecond > avgFirst ? (avgSecond - avgFirst) / Math.max(avgFirst, 1) : 0;

      // Spike penalty: high velocity + high fad_risk = penalised
      const spikePenalty = t.fad_risk > 28 && t.velocity > 22 ? 12 : t.fad_risk > 28 ? 6 : 0;
      const coherenceBoost = (t.coherence / 20) * 12;
      const structuralBoost = (t.structural_shift / 100) * 10;
      const adjustedScore = Math.round(
        t.trend_score * 0.55 + coherenceBoost + structuralBoost + sustainedGrowth * 15 - spikePenalty
      );
      return { ...t, trend_score: Math.min(Math.max(adjustedScore, 10), 99) };
    }

    // 90-day (default): balanced — slight velocity + coherence mix
    const velocityComponent = (t.velocity / 30) * 8;
    const coherenceComponent = (t.coherence / 20) * 7;
    const adjustedScore = Math.round(t.trend_score * 0.78 + velocityComponent + coherenceComponent);
    return { ...t, trend_score: Math.min(Math.max(adjustedScore, 10), 99) };
  });
};

export interface GoogleTrendsMap {
  [keyword: string]: GoogleTrendsResult;
}

const Index = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(categories[0]);
  const [timeWindow, setTimeWindow] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<string[]>(["Google Trends"]);
  const [dataSource, setDataSource] = useState<"serpapi" | "sample" | null>(null);

  const handleCategoryChange = (v: string) => {
    setCategory(v);
    toast.success(`Category updated: ${v}`, { duration: 2000 });
  };

  const handleTimeWindowChange = (v: number) => {
    setTimeWindow(v);
    toast.success(`Time window updated: ${v} days`, { duration: 2000 });
  };

  const handleToggleSource = (source: string) => {
    setActiveSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleRun = async () => {
    if (activeSources.length === 0) return;
    setIsLoading(true);
    setDataSource(null);
    const raw = radarDataByCategory[category] || [];
    const scored = applyTimeWindowScoring(raw, timeWindow);
    const sorted = [...scored].sort((a, b) => b.trend_score - a.trend_score);

    try {
      const keywords = sorted.map((t) => t.trend_name);
      const { results, sample_fallback } = await fetchGoogleTrendsData(keywords, timeWindow);

      const gtMap: GoogleTrendsMap = {};
      results.forEach((r) => {
        gtMap[r.keyword] = r;
      });

      const updatedTrends = sorted.map((t) => {
        const gt = gtMap[t.trend_name];
        if (gt && !gt.sample && gt.velocity_score > 0) {
          return { ...t, velocity: gt.velocity_score };
        }
        return t;
      });

      updatedTrends.sort((a, b) => b.trend_score - a.trend_score);

      const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setLastUpdated(ts);
      setDataSource(sample_fallback ? "sample" : "serpapi");
      setIsLoading(false);

      navigate("/radar", {
        state: {
          trends: updatedTrends,
          googleTrendsMap: gtMap,
          sampleFallback: sample_fallback,
          dataSource: sample_fallback ? "sample" : "serpapi",
          category,
          timeWindow,
          lastUpdated: ts,
          activeSources,
        },
      });
    } catch {
      const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setLastUpdated(ts);
      setDataSource("sample");
      setIsLoading(false);

      navigate("/radar", {
        state: {
          trends: sorted,
          googleTrendsMap: {},
          sampleFallback: true,
          dataSource: "sample",
          category,
          timeWindow,
          lastUpdated: ts,
          activeSources,
        },
      });

      toast.info("Using sample trends data — add SERPAPI_KEY for live Google Trends.", {
        duration: 6000,
      });
    }
  };

  const canRun = activeSources.length > 0;

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
          onCategoryChange={handleCategoryChange}
          onTimeWindowChange={handleTimeWindowChange}
          onRun={handleRun}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          dataSource={dataSource}
          canRun={canRun}
        />

        {isLoading ? (
          <div className="py-16">
            <LoadingProgress isActive={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
            <div className="max-w-lg space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight">
                Detect emerging wellness trends before they go mainstream
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Scan real-time signals across multiple sources, score opportunities, and generate actionable founder briefs.
              </p>
            </div>

            <SourceChips
              sources={allSources}
              activeSources={activeSources}
              onToggle={handleToggleSource}
            />

            <div className="glass-card-elevated p-10 max-w-lg w-full relative">
              <div className="relative flex items-center justify-center mb-8">
                <RadarPulse />
                <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary">
                  <Radar size={28} className="text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">Ready to scan</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Pick a category + time window, select your sources, then hit{" "}
                <span className="text-primary font-medium">Run Radar</span> to generate
                5–10 opportunity briefs.
              </p>
              <p className="text-xs text-muted-foreground/50 mt-5 font-mono">
                Last scan: {lastUpdated ?? "—"}
              </p>
            </div>

            <HowItWorks />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
