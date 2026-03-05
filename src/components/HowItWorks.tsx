import { Radio, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: Radio,
    title: "Discover queries",
    desc: "Start from 6 category anchors, expand with live related rising queries, and build fresh candidates automatically.",
  },
  {
    icon: BarChart3,
    title: "Score quality",
    desc: "Score each candidate on growth speed, durability, creator momentum, and discussion depth.",
  },
  {
    icon: FileText,
    title: "Ship founder memos",
    desc: "Get 5-10 ranked trends with REAL/FAD labels, proof bullets, and clear launch format ideas.",
  },
];

const HowItWorks = () => (
  <div className="mt-10 w-full max-w-2xl">
    <p className="text-xs text-muted-foreground mb-5 text-center tracking-widest font-medium">
      HOW IT WORKS
    </p>
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="glass-card p-6 flex flex-col items-center text-center gap-3 hover:border-primary/30 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <s.icon size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default HowItWorks;
