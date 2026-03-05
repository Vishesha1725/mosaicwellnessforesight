# Mosaic Foresight Engine

Live trend discovery radar for India-focused wellness categories.

## Fixed Categories
- Wellness & Supplements
- Functional Beverages
- Beauty & Personal Care
- Healthy Snacking
- Mental Health & Sleep
- Sports Nutrition

## How Discovery Works
1. Each category starts from 6 starter anchors.
2. Radar calls Google Trends related queries (rising + top) for those anchors.
3. It merges, cleans, lowercases, and deduplicates candidates.
4. It scores top candidates using Google Trends + YouTube + Reddit.
5. It returns 5-10 ranked trends with founder memos and proof.

## Scoring (Simple)
- How fast it's growing: Google slope + growth %.
- Will it last: consistency minus spikeiness.
- Creator momentum: recent YouTube publishing density.
- People talking: Reddit discussion proxy.
- Money potential (INR): category baseline + growth signal.
- Final score gives extra weight to durability.

Classification:
- REAL TREND: durable + strong growth/momentum + at least 2 strong sources.
- FAD: spiky OR only one source is strong.
- EARLY SIGNAL: in-between.

## API Routes
Vercel server routes:
- `api/signal/google-trends.ts`
- `api/signal/youtube.ts`
- `api/signal/reddit.ts`
- `api/radar/run.ts`

Next.js App Router-compatible mirrors:
- `app/api/signal/google-trends/route.ts`
- `app/api/signal/youtube/route.ts`
- `app/api/signal/reddit/route.ts`
- `app/api/radar/run/route.ts`

All routes use 10-minute in-memory caching per keyword + timeframe.

## Environment Variables
Set these in Vercel Project Settings -> Environment Variables:
- `SERPAPI_API_KEY`
- `YOUTUBE_API_KEY`

Optional/fallback support:
- `SERPAPI_KEY` is also accepted.
- Amazon is kept optional beta and does not block runs.

## Local Run
```sh
npm i
npm run dev
```

## Notes
- `.env.local` is ignored and must never be committed.
- Demo mode appears only when required API keys are missing or a source fails.
- Partial-data runs still return results and show a small note in UI.
