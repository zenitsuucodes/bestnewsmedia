import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadArticleCatalog } from './articleCatalog.js';
import { attachImagesToArticles, initImageSources } from './imageSearch.js';
import { getUsedSourceUrls } from './imageStore.js';
import { readJson, writeJson } from './persistence.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRIORITY_IMAGE_COUNT = 40;
const CRON_IMAGE_BATCH = 60;
const IS_VERCEL = Boolean(process.env.VERCEL);

const BUNDLE_PATHS = [
  path.join(__dirname, 'catalog.bundle.json'),
  path.join(process.cwd(), 'server', 'catalog.bundle.json'),
];

let memoryCache = null;
let refreshPromise = null;
let bundledCatalog = null;

async function loadBundledCatalog() {
  if (bundledCatalog?.articles?.length) return bundledCatalog;

  for (const bundlePath of BUNDLE_PATHS) {
    try {
      const raw = await fs.readFile(bundlePath, 'utf8');
      bundledCatalog = JSON.parse(raw);
      if (bundledCatalog?.articles?.length) return bundledCatalog;
    } catch {
      // try next path
    }
  }

  return null;
}

async function loadPersistedCache() {
  const blobCache = await readJson('catalog.json');
  if (blobCache?.articles?.length) return blobCache;

  return loadBundledCatalog();
}

async function saveCache(cache) {
  memoryCache = cache;
  await writeJson('catalog.json', cache);
}

export async function refreshArticles({ imageBatch = PRIORITY_IMAGE_COUNT } = {}) {
  await initImageSources(await getUsedSourceUrls());

  const { all, byCategory } = await loadArticleCatalog();

  const batch = IS_VERCEL ? Math.min(imageBatch, 30) : imageBatch;
  const needsImage = all.filter((a) => !a.image).slice(0, batch);
  if (needsImage.length) {
    await attachImagesToArticles(needsImage, 4);
  }

  const cache = { articles: all, byCategory, fetchedAt: Date.now() };
  await saveCache(cache);
  bundledCatalog = cache;
  return cache;
}

export async function attachMoreImages(batchSize = CRON_IMAGE_BATCH) {
  const cache = (await loadPersistedCache()) || memoryCache;
  if (!cache?.articles?.length) {
    return refreshArticles({ imageBatch: batchSize });
  }

  await initImageSources(await getUsedSourceUrls());

  const needsImage = cache.articles.filter((a) => !a.image).slice(0, batchSize);
  if (!needsImage.length) return cache;

  await attachImagesToArticles(needsImage, 4);

  cache.fetchedAt = Date.now();
  await saveCache(cache);
  return cache;
}

export async function getArticles() {
  if (memoryCache?.articles?.length) {
    return memoryCache;
  }

  const persisted = await loadPersistedCache();
  if (persisted?.articles?.length) {
    memoryCache = persisted;
    return persisted;
  }

  if (IS_VERCEL) {
    throw new Error('Article catalog missing from deployment bundle');
  }

  if (refreshPromise) {
    await refreshPromise;
    return memoryCache;
  }

  refreshPromise = refreshArticles({ imageBatch: PRIORITY_IMAGE_COUNT }).finally(() => {
    refreshPromise = null;
  });

  await refreshPromise;
  return memoryCache;
}
