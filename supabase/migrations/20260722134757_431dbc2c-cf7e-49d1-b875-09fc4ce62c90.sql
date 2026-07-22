
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE public.government_schemes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.government_schemes TO anon, authenticated;
GRANT ALL ON public.government_schemes TO service_role;

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read schemes"
  ON public.government_schemes FOR SELECT
  USING (true);
