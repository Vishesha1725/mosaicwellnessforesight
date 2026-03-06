import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { TrendData } from "@/data/mockTrends";
import { cleanText } from "@/lib/text";
import { fmt1, fmt2, fmtINR, fmtInt } from "@/lib/format";

interface TrendPanelProps {
  trend: TrendData;
  category: string;
  onClose: () => void;
  defaultTab?: "signals" | "market" | "roi" | "brief";
  modeUsed?: "live" | "calc";
  perSourceStatus?: {
    trends: "live" | "calc" | "missing";
    youtube: "live" | "calc" | "missing";
    reddit: "live" | "calc" | "missing";
  };
}

const statusLabel = (status?: "live" | "calc" | "missing") =>
  status === "live" ? "Live" : status === "calc" ? "Calculated" : "Missing";

const toPercent = (value: number | null | undefined) => (value == null ? "--" : `${fmt1(value)}%`);

const computeAcceleration = (series: number[]): number | null => {
  if (series.length < 4) return null;
  const mid = Math.floor(series.length / 2);
  const firstSlope = (series[mid] - series[0]) / Math.max(mid, 1);
  const secondSlope = (series[series.length - 1] - series[mid]) / Math.max(series.length - mid - 1, 1);
  return secondSlope - firstSlope;
};

const TrendPanel = ({ trend, category, onClose, defaultTab = "signals", perSourceStatus, modeUsed = "live" }: TrendPanelProps) => {
  const [tab, setTab] = useState<"signals" | "market" | "roi" | "brief">(defaultTab);

  const statusBadge = modeUsed === "calc" ? "CALCULATED" : "LIVE";

  const googleSeries = (trend.google_trends_data || []).filter((v) => typeof v === "number" && Number.isFinite(v));
  const growthPct = trend.rawSignals?.growthPct ?? trend.trendsGrowthPct ?? null;
  const acceleration = computeAcceleration(googleSeries);
  const latestIndex = googleSeries.length ? googleSeries[googleSeries.length - 1] : null;

  const founderBlocks = useMemo(() => {
    if (trend.founder_memo) {
      return [
        { title: "What Is Happening", items: [trend.founder_memo.whatHappening] },
        { title: "Proof", items: [trend.founder_memo.proof] },
        { title: "Why This Works", items: trend.founder_memo.whyRealOrFad || [] },
        { title: "Product Wedge", items: trend.founder_memo.productWedge || [] },
        { title: "Formats & Pricing", items: [trend.founder_memo.formatsAndPricing] },
        { title: "GTM India", items: [trend.founder_memo.gtmIndia] },
        { title: "Risks & Fixes", items: trend.founder_memo.risksAndFixes || [] },
        { title: "90-Day Plan", items: [trend.founder_memo.ninetyDayPlan] },
      ];
    }
    return [{ title: "Founder Brief", items: (trend.founder_brief || "").split("\n").map((x) => x.trim()).filter(Boolean) }];
  }, [trend.founder_memo, trend.founder_brief]);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-card/95 border-l border-border z-50 animate-slide-in-right flex flex-col backdrop-blur-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{category}</p>
            <h2 className="text-lg font-bold text-foreground">{cleanText(trend.trend_name)}</h2>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${statusBadge === "LIVE" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-violet-500/10 text-violet-300 border-violet-500/30"}`}>{statusBadge}</span>
              <span className="text-xs text-muted-foreground">{fmtInt(trend.trend_score)}/100</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-border px-2">
        {[{ key: "signals", label: "Signals" }, { key: "market", label: "Market" }, { key: "roi", label: "ROI" }, { key: "brief", label: "Founder Brief" }].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as "signals" | "market" | "roi" | "brief")}
            className={`flex-1 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors ${tab === item.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {tab === "signals" && (
          <>
            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Google Trends Evidence ({statusLabel(perSourceStatus?.trends)})</p>
              <p className="text-sm text-foreground">Growth: <span className="font-semibold">{growthPct == null ? "Not available" : toPercent(growthPct)}</span></p>
              <p className="text-sm text-foreground">Acceleration: <span className="font-semibold">{acceleration == null ? "Not available" : toPercent(acceleration)}</span></p>
              <p className="text-sm text-foreground">Latest Index: <span className="font-semibold">{latestIndex == null ? "Not available" : fmtInt(latestIndex)}</span></p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">YouTube Evidence ({statusLabel(perSourceStatus?.youtube)})</p>
              <p className="text-sm text-foreground">New videos: 7d <span className="font-semibold">{trend.youtube_counts?.d7 == null ? "Not available" : fmtInt(trend.youtube_counts?.d7)}</span>, 30d <span className="font-semibold">{trend.youtube_counts?.d30 == null ? "Not available" : fmtInt(trend.youtube_counts?.d30)}</span>, 90d <span className="font-semibold">{trend.youtube_counts?.d90 == null ? "Not available" : fmtInt(trend.youtube_counts?.d90)}</span></p>
              {(trend.youtube_titles || []).slice(0, 2).map((title, idx) => (
                <p key={`${title}-${idx}`} className="text-xs text-secondary-foreground">- {cleanText(title)}</p>
              ))}
              {!(trend.youtube_titles || []).length && <p className="text-xs text-muted-foreground">Not available</p>}
            </div>
          </>
        )}

        {tab === "market" && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">TAM (Estimated)</p>
              <p className="text-2xl font-bold text-foreground">{trend.tam_estimate_cr == null ? "Not available" : fmtINR(trend.tam_estimate_cr)}</p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <p className="text-sm text-foreground">Market Strength: <span className="font-semibold">{trend.market_strength == null ? "Not available" : fmtInt(trend.market_strength)}</span></p>
              <p className="text-sm text-foreground">Competition Proxy: <span className="font-semibold">{trend.competition == null ? "Not available" : fmtInt(trend.competition)}</span></p>
              <p className="text-sm text-foreground">Fad Risk: <span className="font-semibold">{trend.fad_risk_label ?? (trend.fad_risk == null ? "Not available" : fmtInt(trend.fad_risk))}</span></p>
            </div>
          </div>
        )}

        {tab === "roi" && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-2">
              <p className="text-sm text-foreground">CAC (Estimated): <span className="font-semibold">{trend.cac_estimate_inr == null ? "Not available" : fmtINR(trend.cac_estimate_inr)}</span></p>
              <p className="text-sm text-foreground">ROI Estimate: <span className="font-semibold">{trend.roi_estimate_x == null ? "Not available" : `${fmt2(trend.roi_estimate_x)}x`}</span></p>
              <p className="text-sm text-foreground">Margin Assumption: <span className="font-semibold">{trend.margin_band ? cleanText(trend.margin_band) : "Not available"}</span></p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pricing Bands</p>
              {trend.pricing ? (
                <>
                  <p className="text-sm text-foreground">Trial: <span className="font-semibold">{fmtINR(trend.pricing.trial[0])}-{fmtINR(trend.pricing.trial[1])}</span></p>
                  <p className="text-sm text-foreground">Monthly: <span className="font-semibold">{fmtINR(trend.pricing.monthly[0])}-{fmtINR(trend.pricing.monthly[1])}</span></p>
                  <p className="text-sm text-foreground">Bundle: <span className="font-semibold">{fmtINR(trend.pricing.bundle[0])}-{fmtINR(trend.pricing.bundle[1])}</span></p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Not available</p>
              )}
            </div>
          </div>
        )}

        {tab === "brief" && (
          <div className="space-y-4">
            {founderBlocks.map((block, idx) => (
              <div key={`${block.title}-${idx}`} className="glass-card p-4 space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{cleanText(block.title)}</p>
                {block.items.length ? block.items.map((item, i) => (
                  <p key={`${block.title}-${i}`} className="text-sm text-secondary-foreground leading-relaxed">- {cleanText(item)}</p>
                )) : <p className="text-sm text-muted-foreground">Not available</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendPanel;
