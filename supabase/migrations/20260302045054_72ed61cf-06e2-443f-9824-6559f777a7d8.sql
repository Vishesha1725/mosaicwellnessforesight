CREATE TABLE public.google_trends_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword text NOT NULL,
  days integer NOT NULL DEFAULT 90,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  growth_pct numeric NOT NULL DEFAULT 0,
  acceleration numeric NOT NULL DEFAULT 0,
  velocity_score numeric NOT NULL DEFAULT 0,
  cached_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(keyword, days)
);

ALTER TABLE public.google_trends_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read google_trends_cache" ON public.google_trends_cache FOR SELECT USING (true);
CREATE POLICY "Public insert google_trends_cache" ON public.google_trends_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update google_trends_cache" ON public.google_trends_cache FOR UPDATE USING (true);