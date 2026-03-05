import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import RadarHeader from "@/components/RadarHeader";
import TrendPanel from "@/components/TrendPanel";
import { TrendData, timeWindows } from "@/data/mockTrends";
import { cleanText } from "@/lib/text";

interface RadarState {
  trends: TrendData[];
  sampleFallback: boolean;
  dataSource: "serpapi" | "sample";
  category: string;
  timeWindow: number;
  lastUpdated: string;
  activeSources: string[];
  partialData?: boolean;
  partialDataSources?: string[];
  discoveryCount?: number;
  timingsMs?: { total: number; trends: number; youtube: number; reddit: number };
}

const badgeClass: Record<string, string> = {
  "REAL TREND": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "EARLY SIGNAL": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  FAD: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "NO DATA": "bg-slate-500/20 text-slate-200 border-slate-400/30",
};

const placeholderGradients = [
  "linear-gradient(135deg, hsl(190 55% 28%) 0%, hsl(220 35% 18%) 100%)",
  "linear-gradient(135deg, hsl(150 40% 26%) 0%, hsl(180 30% 16%) 100%)",
  "linear-gradient(135deg, hsl(340 35% 30%) 0%, hsl(220 30% 16%) 100%)",
  "linear-gradient(135deg, hsl(32 55% 32%) 0%, hsl(10 35% 18%) 100%)",
];

const metric = (v: number | null | undefined) => (typeof v === "number" ? v : "--");
const badgeText = (t: TrendData) => (t.proof_status ? "NO DATA" : t.classification || "EARLY SIGNAL");

const RadarResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RadarState | null;
  const [selected, setSelected] = useState<{ trend: TrendData; tab: "memo" | "proof" } | null>(null);

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);
  if (!state) return null;

  const { trends, sampleFallback, dataSource, category, timeWindow, lastUpdated, activeSources, discoveryCount, timingsMs } = state;
  const topPicks = useMemo(() => trends.slice(0, 5), [trends]);
  const windowLabel = timeWindows.find((tw) => tw.value === timeWindow)?.label ?? `${timeWindow} Days`;
  const coverage = useMemo(
    () => ({
      trends: trends.some((t) => t.sourcesUsed?.includes("trends")),
      youtube: trends.some((t) => t.sourcesUsed?.includes("youtube")),
    }),
    [trends]
  );

  return (
    <div className="min-h-screen bg-noise relative overflow-hidden p-4 sm:p-6" style={{ background: "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 22% 8%) 40%, hsl(240 15% 10%) 100%)" }}>
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
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

        <div className="glass-card px-5 py-3 flex items-center gap-4 flex-wrap text-xs">
          <span className="text-muted-foreground font-medium">Scan:</span>
          <span className="text-foreground font-semibold">{category}</span>
          <span className="text-border">-</span>
          <span className="text-foreground">{windowLabel}</span>
          <span className="text-border">-</span>
          <span className="text-muted-foreground">Candidates discovered: <span className="text-foreground font-semibold">{discoveryCount ?? trends.length}</span></span>
          <span className="text-border">-</span>
          <span className="text-muted-foreground">Signals:</span>
          {activeSources.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 border border-primary/30 text-primary">{s}</span>
          ))}
          {timingsMs && (
            <>
              <span className="text-border">-</span>
              <span className="text-muted-foreground">Run: <span className="text-foreground font-semibold">{timingsMs.total}ms</span></span>
            </>
          )}
          <span className="text-border">-</span>
          <span className="text-muted-foreground">Live data used: Trends {coverage.trends ? "✅" : "❌"} | YouTube {coverage.youtube ? "✅" : "❌"}</span>
          <button onClick={() => navigate("/")} className="ml-auto text-primary hover:text-primary/80 font-medium">{"\u2190"} New Scan</button>
        </div>

        {sampleFallback && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 text-sm text-amber-300">
            Demo mode active: API keys are missing, so live discovery is limited.
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Top Picks (5)</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topPicks.map((trend, idx) => (
              <article key={trend.id || `${trend.trend_name}-${idx}`} className="rounded-2xl bg-card/80 border border-border overflow-hidden">
                {(trend.image_data_uri || trend.thumbnail_url) ? (
                  <img src={trend.image_data_uri || trend.thumbnail_url} alt={cleanText(trend.trend_name)} className="w-full h-36 object-cover" />
                ) : (
                  <div className="h-36" style={{ background: placeholderGradients[idx % placeholderGradients.length] }} />
                )}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-tight">{cleanText(trend.trend_name)}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${badgeClass[badgeText(trend)]}`}>{badgeText(trend)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="glass-card p-2"><p className="text-[10px] text-muted-foreground">Growing</p><p className="text-sm font-semibold text-foreground">{metric(trend.how_fast_its_growing)}</p></div>
                    <div className="glass-card p-2"><p className="text-[10px] text-muted-foreground">Will Last</p><p className="text-sm font-semibold text-foreground">{metric(trend.will_it_last)}</p></div>
                    <div className="glass-card p-2"><p className="text-[10px] text-muted-foreground">Market Strength</p><p className="text-sm font-semibold text-foreground">{metric(trend.market_strength)}</p></div>
                  </div>
                  {trend.proof_status && <p className="text-xs text-slate-300">{cleanText(trend.proof_status)}</p>}
                  <div className="glass-card p-2 text-[11px] text-muted-foreground leading-relaxed">
                    <p>TAM: <span className="text-foreground font-semibold">INR {metric(trend.tam_estimate_cr)} Cr (est)</span></p>
                    <p>CAC: <span className="text-foreground font-semibold">INR {metric(trend.cac_estimate_inr)} (est)</span> | ROI: <span className="text-foreground font-semibold">{metric(trend.roi_estimate_x)}x (est)</span></p>
                    <p>Fad Risk: <span className="text-foreground font-semibold">{trend.fad_risk_label ?? "Medium"}</span></p>
                  </div>
                  {!!trend.formats?.length && (
                    <div className="flex flex-wrap gap-1.5">
                      {trend.formats.slice(0, 3).map((f) => (
                        <span key={f} className="px-2 py-1 rounded-full text-[10px] border border-primary/30 bg-primary/10 text-primary">{cleanText(f)}</span>
                      ))}
                    </div>
                  )}
                  {trend.pricing && (
                    <p className="text-[11px] text-muted-foreground">
                      Trial INR {trend.pricing.trial[0]}-{trend.pricing.trial[1]} | Monthly INR {trend.pricing.monthly[0]}-{trend.pricing.monthly[1]} | Bundle INR {trend.pricing.bundle[0]}-{trend.pricing.bundle[1]}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelected({ trend, tab: "memo" })} className="flex-1 rounded-lg border border-primary/30 bg-primary/10 text-primary px-3 py-2 text-xs font-semibold">Founder Memo</button>
                    <button onClick={() => setSelected({ trend, tab: "proof" })} className="flex-1 rounded-lg border border-border bg-secondary/40 text-foreground px-3 py-2 text-xs font-semibold">See Proof</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3 pb-10">
          <h2 className="text-lg font-bold text-foreground">By Category Results</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {trends.map((trend, idx) => (
              <div key={`${trend.id}-${idx}`} className="glass-card p-4 flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden" style={!(trend.image_data_uri || trend.thumbnail_url) ? { background: placeholderGradients[idx % placeholderGradients.length] } : undefined}>
                  {(trend.image_data_uri || trend.thumbnail_url) && <img src={trend.image_data_uri || trend.thumbnail_url} alt={cleanText(trend.trend_name)} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{cleanText(trend.trend_name)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeClass[badgeText(trend)]}`}>{badgeText(trend)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Market Strength {metric(trend.market_strength)}/100 - TAM INR {metric(trend.tam_estimate_cr)} Cr - ROI {metric(trend.roi_estimate_x)}x</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setSelected({ trend, tab: "memo" })} className="text-xs text-primary font-medium">Founder Memo</button>
                    <span className="text-muted-foreground text-xs">|</span>
                    <button onClick={() => setSelected({ trend, tab: "proof" })} className="text-xs text-primary font-medium">See Proof</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selected && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setSelected(null)} />
          <TrendPanel trend={selected.trend} category={category} onClose={() => setSelected(null)} defaultTab={selected.tab} />
        </>
      )}
    </div>
  );
};

export default RadarResults;
