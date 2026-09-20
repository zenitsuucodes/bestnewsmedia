# Best News Media

Universal news site (Est. 2009) — React + Vite, static article archive on Vercel.

Articles are stored in `public/catalog.json` and served directly by the frontend. No live RSS fetching at runtime.

## Local development

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5175 (loads `/catalog.json`)
- Image proxy: http://localhost:3001/api/img (for article thumbnails)

## Deploy on Vercel

Connect the repo — build runs `vite build` and deploys the static site plus `/api/img` for image proxying.

## Updating articles

Articles are fixed in `public/catalog.json`. To regenerate manually (optional):

```bash
node scripts/seedCatalog.js
```

Then commit the updated `public/catalog.json`.
