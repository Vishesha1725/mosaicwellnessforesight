import { cn } from "@/lib/utils";

interface EntryBadgeProps {
  window: "Early" | "Optimal" | "Late";
}

const EntryBadge = ({ window }: EntryBadgeProps) => {
  const styles = {
    Early: "bg-success/15 text-success border-success/30",
    Optimal: "bg-primary/15 text-primary border-primary/30",
    Late: "bg-warning/15 text-warning border-warning/30",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border", styles[window])}>
      {window}
    </span>
  );
};

export default EntryBadge;
