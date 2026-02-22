interface MeterBarProps {
  value: number;
  max: number;
  label: string;
  color?: "primary" | "success" | "warning" | "destructive";
}

const bgColorMap = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const textColorMap = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const MeterBar = ({ value, max, label, color = "primary" }: MeterBarProps) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-border/60 rounded-full overflow-hidden">
        <div
          className={`meter-bar ${bgColorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-[11px] font-semibold w-6 text-right ${textColorMap[color]}`}>{value}</span>
    </div>
  );
};

export default MeterBar;
