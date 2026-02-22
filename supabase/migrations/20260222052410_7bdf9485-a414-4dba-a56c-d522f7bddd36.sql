
-- Create radar_runs table
CREATE TABLE public.radar_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT NOT NULL,
  time_window INTEGER NOT NULL DEFAULT 90,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Create trends table
CREATE TABLE public.trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.radar_runs(id) ON DELETE CASCADE,
  trend_name TEXT NOT NULL,
  trend_score NUMERIC NOT NULL DEFAULT 0,
  velocity NUMERIC NOT NULL DEFAULT 0,
  coherence NUMERIC NOT NULL DEFAULT 0,
  competition NUMERIC NOT NULL DEFAULT 0,
  entry_window TEXT NOT NULL DEFAULT 'Early',
  dominance_prob NUMERIC NOT NULL DEFAULT 0,
  feasibility NUMERIC NOT NULL DEFAULT 0,
  fad_risk NUMERIC NOT NULL DEFAULT 0,
  structural_shift NUMERIC NOT NULL DEFAULT 0,
  regulatory_risk TEXT,
  tam_band TEXT,
  cac_band TEXT,
  margin_band TEXT,
  payback_estimate TEXT,
  price_ladder TEXT,
  format_recommendation TEXT,
  founder_brief TEXT,
  google_trends_data JSONB DEFAULT '[]'::jsonb,
  reddit_mentions JSONB DEFAULT '[]'::jsonb
);

-- Create evidence table
CREATE TABLE public.evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  payload_json JSONB DEFAULT '{}'::jsonb,
  snippets_json JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS on all tables (public read for now, no auth required)
ALTER TABLE public.radar_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this internal tool)
CREATE POLICY "Public read radar_runs" ON public.radar_runs FOR SELECT USING (true);
CREATE POLICY "Public insert radar_runs" ON public.radar_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update radar_runs" ON public.radar_runs FOR UPDATE USING (true);

CREATE POLICY "Public read trends" ON public.trends FOR SELECT USING (true);
CREATE POLICY "Public insert trends" ON public.trends FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read evidence" ON public.evidence FOR SELECT USING (true);
CREATE POLICY "Public insert evidence" ON public.evidence FOR INSERT WITH CHECK (true);
