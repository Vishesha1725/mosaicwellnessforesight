const RadarPulse = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
    <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-radar-ping-1" />
    <div className="absolute w-24 h-24 rounded-full border border-primary/15 animate-radar-ping-2" />
    <div className="absolute w-24 h-24 rounded-full border border-primary/10 animate-radar-ping-3" />
  </div>
);

export default RadarPulse;
