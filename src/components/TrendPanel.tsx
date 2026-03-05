import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { TrendData } from "@/data/mockTrends";
import ScoreRing from "./ScoreRing";
import MeterBar from "./MeterBar";
import EntryBadge from "./EntryBadge";
import Sparkline from "./Sparkline";
import { GoogleTrendsResult } from "@/lib/googleTrends";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { categoryFormatIdeas } from "@/data/radarDataByCategory";

interface TrendPanelProps {
  trend: TrendData;
  category: string;
  onClose: () => void;
  googleTrends?: GoogleTrendsResult;
}

type Tab = "signals" | "market" | "roi" | "brief";

const tabs: { key: Tab; label: string }[] = [
  { key: "signals", label: "Signals" },
  { key: "market", label: "Market" },
  { key: "roi", label: "ROI" },
  { key: "brief", label: "Founder Brief" },
];

const TrendPanel = ({ trend, category, onClose, googleTrends }: TrendPanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("signals");
  const [copied, setCopied] = useState(false);
  const hasGT = googleTrends && googleTrends.timeline.length > 0;
  const formatIdeas = categoryFormatIdeas[category] ?? [];

  const chartData = trend.google_trends_data.map((v, i) => ({
    month: `M${i + 1}`,
    google: v,
    reddit: trend.reddit_mentions[i],
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(trend.founder_brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l border-border z-50 animate-slide-in-right flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-base font-bold text-foreground">{trend.trend_name}</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <EntryBadge window={trend.entry_window} />
            <span className="font-mono text-sm text-primary font-semibold">{trend.trend_score}/100</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "signals" && (
          <>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Signal Velocity</h3>
              <div className="glass-card p-4 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(225, 14%, 11%)', border: '1px solid hsl(225, 12%, 15%)', borderRadius: '6px', fontSize: '11px' }}
                      labelStyle={{ color: 'hsl(210, 15%, 93%)' }}
                    />
                    <Line type="monotone" dataKey="google" stroke="hsl(187, 80%, 48%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="reddit" stroke="hsl(82, 70%, 50%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="w-3 h-0.5 bg-primary rounded" /> Google Trends
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="w-3 h-0.5 bg-success rounded" /> Reddit Mentions
                </span>
              </div>
            </div>

            {/* Google Trends Evidence */}
            {hasGT && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Google Trends Evidence</h3>
                <div className="glass-card p-4 space-y-3">
                  <Sparkline data={googleTrends!.timeline} height={48} />
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Growth</p>
                      <p className={`font-mono text-sm font-semibold ${googleTrends!.growth_pct > 0 ? "text-success" : "text-warning"}`}>
                        {googleTrends!.growth_pct > 0 ? "+" : ""}{googleTrends!.growth_pct}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Acceleration</p>
                      <p className="font-mono text-sm font-semibold text-foreground">{googleTrends!.acceleration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Latest</p>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {googleTrends!.timeline[googleTrends!.timeline.length - 1]?.value ?? "–"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Risk Metrics</h3>
              <div className="space-y-2.5">
                <MeterBar value={trend.fad_risk} max={100} label="Fad Risk" color={trend.fad_risk > 30 ? "warning" : "primary"} />
                <MeterBar value={trend.structural_shift} max={100} label="Structural" color="success" />
                <MeterBar value={trend.feasibility} max={100} label="Feasible" color="primary" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Evidence</h3>
              <div className="space-y-2">
                {trend.evidence_snippets.map((snippet, i) => (
                  <div key={i} className="glass-card p-3">
                    <p className="text-xs text-secondary-foreground leading-relaxed">{snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Regulatory</h4>
              <p className="text-xs text-secondary-foreground leading-relaxed">{trend.regulatory_risk}</p>
            </div>
          </>
        )}

        {activeTab === "market" && (
          <>
            {formatIdeas.length > 0 && (
              <div className="glass-card p-4">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Founder Format Ideas</h4>
                <p className="text-sm text-foreground">{formatIdeas.join(" / ")}</p>
              </div>
            )}
            {[
              { label: "Price Ladder", value: trend.price_ladder },
              { label: "Format", value: trend.format_recommendation },
              { label: "TAM Band", value: trend.tam_band },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{item.label}</h4>
                <p className="text-sm text-foreground">{item.value}</p>
              </div>
            ))}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Competition</h3>
              <MeterBar value={trend.competition} max={15} label="Index" color={trend.competition > 10 ? "warning" : "primary"} />
              <p className="text-xs text-muted-foreground mt-2">
                {trend.competition <= 5
                  ? "Blue ocean. Minimal competition. First-mover advantage available."
                  : trend.competition <= 10
                  ? "Moderate competition. Differentiation required."
                  : "Red ocean. High competition. Strong USP needed."}
              </p>
            </div>
          </>
        )}

        {activeTab === "roi" && (
          <>
            {[
              { label: "TAM Band", value: trend.tam_band },
              { label: "CAC Band", value: trend.cac_band },
              { label: "Margin Band", value: trend.margin_band },
              { label: "Payback", value: trend.payback_estimate },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <span className="font-mono text-sm text-foreground">{item.value}</span>
              </div>
            ))}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Feasibility</h3>
              <MeterBar value={trend.feasibility} max={100} label="Score" color="primary" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dominance Probability</h3>
              <div className="flex items-center gap-4">
                <ScoreRing value={trend.dominance_prob} max={100} size={56} strokeWidth={3} color="primary" />
                <p className="text-xs text-muted-foreground flex-1">
                  {trend.dominance_prob >= 65
                    ? "High probability of establishing market dominance."
                    : trend.dominance_prob >= 50
                    ? "Moderate dominance potential with right execution."
                    : "Challenging path to market dominance. Niche play recommended."}
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === "brief" && (
          <>
            <div className="glass-card p-5">
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                {trend.founder_brief}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 bg-primary/10 border border-primary/20 text-primary font-medium text-sm rounded-lg hover:bg-primary/15 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Founder Brief"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrendPanel;
