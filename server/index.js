import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES } from './feeds.js';
import { loadArticleCatalog } from './articleCatalog.js';
import { attachImagesToArticles } from './imageSearch.js';
import { fetchRemoteImage, getCachedImage, cacheImage } from './imageProxy.js';
import { readStoredImage, getUsedSourceUrls } from './imageStore.js';
import { initImageSources } from './imageSearch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || 3001;
const CACHE_TTL = 30 * 60 * 1000;

let cache = { articles: [], byCategory: {}, fetchedAt: 0 };
let refreshPromise = null;
let imageJobPromise = null;

async function loadImages(articles) {
  const priority = articles.slice(0, 40);
  await attachImagesToArticles(priority);

  const rest = articles.filter((a) => !a.image);
  if (rest.length) {
    await attachImagesToArticles(rest, 4);
  }
}

async function refreshArticles() {
  const { all, byCategory } = await loadArticleCatalog();

  cache = { articles: all, byCategory, fetchedAt: Date.now() };

  if (!imageJobPromise) {
    imageJobPromise = loadImages(all).finally(() => {
      imageJobPromise = null;
    });
  }

  return all;
}

async function getArticles() {
  const stale = Date.now() - cache.fetchedAt > CACHE_TTL;

  if (cache.articles.length && !stale) {
    return cache;
  }

  if (refreshPromise) {
    await refreshPromise;
    return cache;
  }

  refreshPromise = refreshArticles().finally(() => {
    refreshPromise = null;
  });

  await refreshPromise;
  return cache;
}

app.use(cors());

app.get('/api/img/a/:articleId', async (req, res) => {
  try {
    const stored = await readStoredImage(req.params.articleId);
    if (!stored) return res.status(404).end();

    res.set('Cache-Control', 'public, max-age=604800, immutable');
    res.set('Content-Type', stored.contentType);
    res.send(stored.buffer);
  } catch {
    res.status(502).end();
  }
});

app.get('/api/img', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).end();
  }

  try {
    const cached = getCachedImage(url);
    if (cached) {
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('Content-Type', cached.contentType);
      return res.send(cached.buffer);
    }

    const result = await fetchRemoteImage(url);
    if (!result) return res.status(404).end();

    cacheImage(url, result);
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Content-Type', result.contentType);
    res.send(result.buffer);
  } catch {
    res.status(502).end();
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', site: 'Best News Media', since: 2009 });
});

app.get('/api/categories', (_req, res) => {
  res.json(CATEGORIES);
});

app.get('/api/articles', async (req, res) => {
  try {
    const data = await getArticles();
    const { category, limit = '50' } = req.query;
    let filtered = data.articles;

    if (category) {
      filtered = data.byCategory[category] || [];
    }

    res.json(filtered.slice(0, Number(limit)));
  } catch {
    res.status(500).json({ error: 'Unable to load articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const data = await getArticles();
    const article = data.articles.find((a) => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch {
    res.status(500).json({ error: 'Unable to load article' });
  }
});

app.get('/api/breaking', async (_req, res) => {
  try {
    const data = await getArticles();
    res.json(data.articles.slice(0, 6).map((a) => ({ id: a.id, title: a.title })));
  } catch {
    res.status(500).json({ error: 'Unable to load breaking news' });
  }
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, async () => {
  console.log(`Best News Media running on http://localhost:${PORT}`);
  await initImageSources(await getUsedSourceUrls());
  refreshArticles().catch(() => {});
});
