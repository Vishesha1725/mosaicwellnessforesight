interface SourceChipsProps {
  sources: string[];
  activeSources: string[];
  onToggle: (source: string) => void;
}

const SourceChips = ({ sources, activeSources, onToggle }: SourceChipsProps) => {
  const activeCount = activeSources.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {sources.map((source) => {
          const isActive = activeSources.includes(source);
          return (
            <button
              key={source}
              onClick={() => onToggle(source)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                  : "bg-card/50 border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
              }`}
            >
              {source}
            </button>
          );
        })}
      </div>
      {activeCount > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Active Sources: {activeSources.join(" · ")}
        </p>
      )}
    </div>
  );
};

export default SourceChips;
