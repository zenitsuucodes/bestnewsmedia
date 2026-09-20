# Best News Media

Universal news site (Est. 2009) — React + Vite frontend, serverless API on Vercel.

## Local development

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5175
- API (Express): http://localhost:3001

## Deploy on Vercel

1. Import this repo in [Vercel](https://vercel.com).
2. **Storage → Blob → Create store** and connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
3. Deploy — build seeds `catalog.json` from RSS feeds; cron jobs keep news and images fresh.

### Cron jobs

| Schedule | Endpoint | Purpose |
|----------|----------|---------|
| Daily 6:00 UTC | `/api/cron/refresh` | Pull latest RSS articles + attach images |
| Every 4 hours | `/api/cron/images` | Backfill images for articles still missing them |

## Scripts

- `npm run build` — seed catalog + Vite production build
- `npm run backfill-images` — local image backfill (uses disk cache)
