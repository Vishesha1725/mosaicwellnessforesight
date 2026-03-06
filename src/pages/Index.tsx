import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RadarHeader from "@/components/RadarHeader";
import RadarPulse from "@/components/RadarPulse";
import HowItWorks from "@/components/HowItWorks";
import SourceChips from "@/components/SourceChips";
import LoadingProgress from "@/components/LoadingProgress";
import { timeWindows, TrendData } from "@/data/mockTrends";
import { categories, starterAnchors } from "@/data/categoryConfig";
import { runLiveRadar } from "@/lib/radarApi";
import { toast } from "sonner";
import { Radar } from "lucide-react";

const allSources = ["Google Trends", "YouTube"];

const Index = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>(categories[0]);
  const [timeWindow, setTimeWindow] = useState(90);
  const [mode, setMode] = useState<"live" | "calc">(() => {
    if (typeof window === "undefined") return "live";
    const stored = window.localStorage.getItem("radar_mode");
    return stored === "calc" ? "calc" : "live";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<string[]>(["Google Trends", "YouTube"]);
  const [dataSource, setDataSource] = useState<"live" | "calc" | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setScanProgress(0);
      return;
    }
    setScanProgress(1);
    const timer = setInterval(() => {
      setScanProgress((prev) => (prev < 8 ? prev + 1 : prev));
    }, 350);
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleCategoryChange = (v: string) => {
    setCategory(v);
    toast.success(`Category updated: ${v}`, { duration: 1800 });
  };

  const handleTimeWindowChange = (v: number) => {
    setTimeWindow(v);
    toast.success(`Time window updated: ${timeWindows.find((x) => x.value === v)?.label ?? `${v} days`}`, {
      duration: 1800,
    });
  };

  const handleToggleSource = (source: string) => {
    setActiveSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleModeChange = (v: "live" | "calc") => {
    setMode(v);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("radar_mode", v);
    }
    toast.success(`Mode updated: ${v === "live" ? "Live" : "Calculated"}`, { duration: 1800 });
  };

  const handleRun = async () => {
    if (activeSources.length === 0) return;
    setIsLoading(true);
    setDataSource(null);

    try {
      const payload = await runLiveRadar({
        category,
        timeframe: timeWindow,
        limit: 10,
        mode,
      });

      const trends = payload.results as TrendData[];
      const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setLastUpdated(ts);
      setDataSource(payload.modeUsed ?? mode);
      setIsLoading(false);

      navigate("/radar", {
        state: {
          trends,
          category,
          timeWindow,
          modeUsed: payload.modeUsed ?? mode,
          perSourceStatus: payload.perSourceStatus,
          lastUpdated: ts,
          activeSources,
          dataSource: payload.modeUsed ?? mode,
          partialData: payload.partialData,
          partialDataSources: payload.partialDataSources,
          discoveryCount: payload.discoveryCount,
          timingsMs: payload.timingsMs,
        },
      });
    } catch (error: any) {
      setIsLoading(false);
      setDataSource(mode);
      toast.error(error?.message || "Radar failed. Check API routes and environment keys.");
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
          mode={mode}
          onCategoryChange={handleCategoryChange}
          onTimeWindowChange={handleTimeWindowChange}
          onModeChange={handleModeChange}
          onRun={handleRun}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          dataSource={dataSource}
          canRun={canRun}
        />

        {isLoading ? (
          <div className="py-16">
            <LoadingProgress isActive={isLoading} />
            <p className="text-center text-xs text-muted-foreground mt-4 font-mono">Scanning {scanProgress}/8...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
            <div className="max-w-lg space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight">
                Real trend discovery for Indian wellness categories
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We score curated futuristic products with Google Trends, YouTube, and Reddit signals to generate founder-ready opportunities.
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
              <h3 className="text-lg font-bold text-foreground mb-3">Ready to discover</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Select category + timeframe and run radar. The system scans 6 starter anchors and expands into live candidates automatically.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-4">
                Starter anchors: {starterAnchors[category as keyof typeof starterAnchors].join(", ")}
              </p>
              <p className="text-xs text-muted-foreground/50 mt-4 font-mono">Last scan: {lastUpdated ?? "-"}</p>
            </div>

            <HowItWorks />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
