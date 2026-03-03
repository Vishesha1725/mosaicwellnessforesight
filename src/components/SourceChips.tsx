import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const betaSources = ["Research", "Regulatory"];

interface SourceChipsProps {
  sources: string[];
  activeSources: string[];
  onToggle: (source: string) => void;
}

const SourceChips = ({ sources, activeSources, onToggle }: SourceChipsProps) => {
  const handleToggle = (source: string) => {
    if (betaSources.includes(source)) {
      toast.info(`${source} ingestion coming soon`, { duration: 3000 });
      return;
    }
    onToggle(source);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {sources.map((source) => {
          const isActive = activeSources.includes(source);
          const isBeta = betaSources.includes(source);

          const chip = (
            <button
              key={source}
              onClick={() => handleToggle(source)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 ${
                isBeta
                  ? "bg-card/30 border-border/50 text-muted-foreground/50 hover:text-muted-foreground"
                  : isActive
                  ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                  : "bg-card/50 border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
              }`}
            >
              {source}
              {isBeta && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  BETA
                </span>
              )}
            </button>
          );

          if (isBeta) {
            return (
              <Tooltip key={source}>
                <TooltipTrigger asChild>{chip}</TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{source} ingestion coming soon</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return chip;
        })}
      </div>
      {activeSources.length > 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          Active Signals: {activeSources.join(" + ")}
        </p>
      ) : (
        <p className="text-center text-xs text-warning">
          Select at least one signal source to enable Run Radar
        </p>
      )}
    </div>
  );
};

export default SourceChips;
