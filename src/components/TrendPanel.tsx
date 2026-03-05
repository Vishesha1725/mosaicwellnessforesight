import { useMemo, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { TrendData } from "@/data/mockTrends";
import Sparkline from "./Sparkline";
import { cleanText } from "@/lib/text";

interface TrendPanelProps {
  trend: TrendData;
  category: string;
  onClose: () => void;
  defaultTab?: "memo" | "proof";
}

const metric = (v: number | null | undefined) => (typeof v === "number" ? v : "--");

const TrendPanel = ({ trend, category, onClose, defaultTab = "memo" }: TrendPanelProps) => {
  const [tab, setTab] = useState<"memo" | "proof">(defaultTab);
  const [copied, setCopied] = useState(false);

  const timeline = useMemo(
    () => (trend.google_trends_data || []).map((value, idx) => ({ date: `P${idx + 1}`, value })),
    [trend.google_trends_data]
  );

  const copyMemo = () => {
    navigator.clipboard.writeText(cleanText(trend.founder_brief || ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border z-50 animate-slide-in-right flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{category}</p>
          <h2 className="text-base font-bold text-foreground mt-1">{cleanText(trend.trend_name)}</h2>
          <p className="text-xs mt-1 text-primary font-semibold">{trend.classification || "EARLY SIGNAL"}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-border px-2">
        {[{ key: "memo", label: "Founder Memo" }, { key: "proof", label: "See Proof" }].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as "memo" | "proof")}
            className={`flex-1 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors ${tab === item.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {tab === "memo" && (
          <>
            <div className="glass-card p-5">
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">{cleanText(trend.founder_brief || "")}</p>
            </div>
            {trend.founder_memo && (
              <div className="glass-card p-4 space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">90-Day Plan</p>
                <p className="text-xs text-secondary-foreground whitespace-pre-wrap">{cleanText(trend.founder_memo.ninetyDayPlan)}</p>
              </div>
            )}
            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Core Metrics</p>
              <p className="text-sm text-foreground">How fast it's growing: <span className="font-semibold">{metric(trend.how_fast_its_growing)}/100</span></p>
              <p className="text-sm text-foreground">Will it last: <span className="font-semibold">{metric(trend.will_it_last)}/100</span></p>
              <p className="text-sm text-foreground">Market strength: <span className="font-semibold">{metric(trend.market_strength ?? trend.trend_score)}/100</span></p>
              <p className="text-sm text-foreground">TAM: <span className="font-semibold">INR {metric(trend.tam_estimate_cr)} Cr (est)</span></p>
              <p className="text-sm text-foreground">CAC: <span className="font-semibold">INR {metric(trend.cac_estimate_inr)} (est)</span> | ROI: <span className="font-semibold">{metric(trend.roi_estimate_x)}x</span></p>
              <p className="text-sm text-foreground">Fad Risk: <span className="font-semibold">{trend.fad_risk_label ?? "Medium"}</span></p>
              {trend.proof_status && <p className="text-xs text-yellow-200">{cleanText(trend.proof_status)}</p>}
            </div>
            <button
              onClick={copyMemo}
              className="w-full py-2.5 px-4 bg-primary/10 border border-primary/20 text-primary font-medium text-sm rounded-lg hover:bg-primary/15 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Founder Memo"}
            </button>
          </>
        )}

        {tab === "proof" && (
          <>
            <div className="glass-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Google Trends (India)</p>
              {timeline.length > 0 ? <Sparkline data={timeline} height={54} /> : <p className="text-xs text-muted-foreground">No public signal found for this query yet.</p>}
              <p className="text-xs text-secondary-foreground mt-2">Keyword used: {trend.keyword_used?.trends || "--"}</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">YouTube Creator Momentum</p>
              <p className="text-sm text-foreground">New videos: 7d <span className="font-semibold">{metric(trend.youtube_counts?.d7)}</span>, 30d <span className="font-semibold">{metric(trend.youtube_counts?.d30)}</span>, 90d <span className="font-semibold">{metric(trend.youtube_counts?.d90)}</span></p>
              {(trend.youtube_titles || []).slice(0, 2).map((title, idx) => (
                <p key={`${title}-${idx}`} className="text-xs text-secondary-foreground">- {cleanText(title)}</p>
              ))}
              <p className="text-xs text-secondary-foreground">Keyword used: {trend.keyword_used?.youtube || "--"}</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reddit Discussion Proxy</p>
              <p className="text-sm text-foreground">Posts in 30d: <span className="font-semibold">{metric(trend.reddit_counts?.d30)}</span></p>
              <p className="text-sm text-foreground">Posts in 90d: <span className="font-semibold">{metric(trend.reddit_counts?.d90)}</span></p>
              <p className="text-xs text-secondary-foreground">Keyword used: {trend.keyword_used?.reddit || "--"}</p>
            </div>

            {!!trend.formats?.length && (
              <div className="glass-card p-4 space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Formats + Pricing</p>
                <p className="text-sm text-foreground">{trend.formats.map((f) => cleanText(f)).join(" / ")}</p>
                {trend.pricing && (
                  <p className="text-xs text-secondary-foreground">
                    Trial INR {trend.pricing.trial[0]}-{trend.pricing.trial[1]} | Monthly INR {trend.pricing.monthly[0]}-{trend.pricing.monthly[1]} | Bundle INR {trend.pricing.bundle[0]}-{trend.pricing.bundle[1]}
                  </p>
                )}
              </div>
            )}

            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Why this is {trend.classification || "EARLY SIGNAL"}</p>
              {(trend.why_bullets || []).slice(0, 3).map((bullet, idx) => (
                <p key={`${bullet}-${idx}`} className="text-xs text-secondary-foreground">- {cleanText(bullet)}</p>
              ))}
            </div>

            <div className="glass-card p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Raw Signals</p>
              <p className="text-xs text-secondary-foreground">Sources used: {(trend.sourcesUsed || []).join(", ") || "none"}</p>
              <p className="text-xs text-secondary-foreground">Growth %: {metric(trend.rawSignals?.growthPct)}</p>
              <p className="text-xs text-secondary-foreground">Spikeiness: {metric(trend.rawSignals?.spikeiness)}</p>
              <p className="text-xs text-secondary-foreground">YouTube recent count: {metric(trend.rawSignals?.ytRecentCount)}</p>
              <p className="text-xs text-secondary-foreground">Reddit mentions: {metric(trend.rawSignals?.redditMentions)}</p>
              <p className="text-xs text-secondary-foreground">Sparkline points: {metric(trend.rawSignals?.sparklinePoints)}</p>
              <p className="text-xs text-secondary-foreground">Timings (ms): Trends {metric(trend.timings_ms?.trends)}, YouTube {metric(trend.timings_ms?.youtube)}, Reddit {metric(trend.timings_ms?.reddit)}</p>
            </div>

            {trend.partial_data_note && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-200">
                {cleanText(trend.partial_data_note)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrendPanel;
