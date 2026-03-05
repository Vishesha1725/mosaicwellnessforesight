import { useState, useEffect } from "react";
import { Radio, Youtube, BarChart3, FileText, Check, Loader2 } from "lucide-react";

const steps = [
  { label: "Discovering Queries", icon: Radio },
  { label: "Fetching YouTube", icon: Youtube },
  { label: "Scoring", icon: BarChart3 },
  { label: "Building Founder Memos", icon: FileText },
];

interface LoadingProgressProps {
  isActive: boolean;
}

const LoadingProgress = ({ isActive }: LoadingProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="glass-card-elevated p-8 max-w-md mx-auto">
      <h3 className="text-base font-semibold text-foreground mb-6 text-center">Scanning signals…</h3>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isDone
                  ? "bg-success/10 text-success"
                  : isCurrent
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isDone ? (
                  <Check size={16} />
                ) : isCurrent ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Icon size={16} className="opacity-40" />
                )}
              </div>
              <span className={`text-sm font-medium ${isDone || isCurrent ? "" : "opacity-40"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingProgress;
