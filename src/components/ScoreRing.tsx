interface ScoreRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
}

const colorMap = {
  primary: "stroke-primary",
  accent: "stroke-accent",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
};

const textColorMap = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const ScoreRing = ({ value, max, size = 56, strokeWidth = 4, label, color = "primary" }: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-border"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={colorMap[color]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-mono text-xs font-bold ${textColorMap[color]}`}>
          {value}
        </span>
      </div>
      {label && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>}
    </div>
  );
};

export default ScoreRing;
