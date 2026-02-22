import { cn } from "@/lib/utils";

interface EntryBadgeProps {
  window: "Early" | "Optimal" | "Late";
}

const EntryBadge = ({ window }: EntryBadgeProps) => {
  const styles = {
    Early: "bg-success/10 text-success border-success/20",
    Optimal: "bg-primary/10 text-primary border-primary/20",
    Late: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", styles[window])}>
      {window}
    </span>
  );
};

export default EntryBadge;
