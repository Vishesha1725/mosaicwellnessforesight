import { Radio, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: Radio,
    title: "Scan signals",
    desc: "Pull real-time data from Google Trends, Reddit, YouTube, and research databases.",
  },
  {
    icon: BarChart3,
    title: "Score trends",
    desc: "Rank each signal by velocity, coherence, competition, and structural shift.",
  },
  {
    icon: FileText,
    title: "Generate briefs",
    desc: "Get founder-ready opportunity briefs with TAM, entry window, and go-to-market hooks.",
  },
];

const HowItWorks = () => (
  <div className="mt-8">
    <p className="text-xs text-muted-foreground mb-4 text-center tracking-wide">How it works</p>
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="glass-card p-5 flex flex-col items-center text-center gap-3 hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <s.icon size={18} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default HowItWorks;
