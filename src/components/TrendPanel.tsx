import { useState } from "react";
import { X } from "lucide-react";
import { TrendData } from "@/data/mockTrends";
import ScoreRing from "./ScoreRing";
import EntryBadge from "./EntryBadge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TrendPanelProps {
  trend: TrendData;
  onClose: () => void;
}

type Tab = "signals" | "risk" | "market" | "roi" | "brief";

const tabs: { key: Tab; label: string }[] = [
  { key: "signals", label: "Signals" },
  { key: "risk", label: "Risk" },
  { key: "market", label: "Market" },
  { key: "roi", label: "ROI" },
  { key: "brief", label: "Founder Brief" },
];

const TrendPanel = ({ trend, onClose }: TrendPanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("signals");

  const chartData = trend.google_trends_data.map((v, i) => ({
    month: `M${i + 1}`,
    google: v,
    reddit: trend.reddit_mentions[i],
  }));

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l border-border z-50 animate-slide-in-right flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">{trend.trend_name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <EntryBadge window={trend.entry_window} />
            <span className="font-mono text-sm text-primary">{trend.trend_score}/100</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
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
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "signals" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Google Trends vs Reddit Mentions</h3>
              <div className="glass-card p-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(220, 18%, 12%)', border: '1px solid hsl(220, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }}
                      labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
                    />
                    <Line type="monotone" dataKey="google" stroke="hsl(185, 80%, 50%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="reddit" stroke="hsl(45, 90%, 55%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-primary rounded" /> Google Trends
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-accent rounded" /> Reddit Mentions
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Evidence Snippets</h3>
              <div className="space-y-2">
                {trend.evidence_snippets.map((snippet, i) => (
                  <div key={i} className="glass-card p-3">
                    <p className="text-xs text-secondary-foreground leading-relaxed">{snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="space-y-6">
            <div className="flex gap-6">
              <ScoreRing value={trend.fad_risk} max={100} size={80} strokeWidth={5} label="Fad Risk" color="destructive" />
              <ScoreRing value={trend.structural_shift} max={100} size={80} strokeWidth={5} label="Structural" color="success" />
            </div>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Regulatory Risk</h4>
              <p className="text-sm text-secondary-foreground leading-relaxed">{trend.regulatory_risk}</p>
            </div>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Signal Coherence</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(trend.coherence / 20) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-primary">{trend.coherence}/20</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {trend.coherence >= 15
                  ? "Strong alignment between search and social signals. High confidence."
                  : trend.coherence >= 10
                  ? "Moderate alignment. Signals trending in same direction."
                  : "Weak alignment. Signals may be noise."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "market" && (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Price Ladder</h4>
              <p className="text-sm text-foreground font-mono">{trend.price_ladder}</p>
            </div>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Format Recommendation</h4>
              <p className="text-sm text-secondary-foreground">{trend.format_recommendation}</p>
            </div>
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Competition Index</h4>
              <div className="flex items-center gap-3">
                <ScoreRing value={trend.competition} max={15} size={64} strokeWidth={4} color={trend.competition > 10 ? "destructive" : "warning"} />
                <p className="text-xs text-muted-foreground flex-1">
                  {trend.competition <= 5
                    ? "Blue ocean. Minimal competition. First-mover advantage available."
                    : trend.competition <= 10
                    ? "Moderate competition. Differentiation required."
                    : "Red ocean. High competition. Need strong USP."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roi" && (
          <div className="space-y-4">
            {[
              { label: "TAM Band", value: trend.tam_band },
              { label: "CAC Band", value: trend.cac_band },
              { label: "Margin Band", value: trend.margin_band },
              { label: "Payback Estimate", value: trend.payback_estimate },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <span className="font-mono text-sm text-foreground">{item.value}</span>
              </div>
            ))}
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Feasibility Score</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${trend.feasibility}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-primary">{trend.feasibility}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "brief" && (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                {trend.founder_brief}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(trend.founder_brief)}
              className="w-full py-2.5 px-4 gradient-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Copy Founder Brief
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendPanel;
