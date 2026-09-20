import { loadArticleCatalog } from './articleCatalog.js';
import { attachImagesToArticles, initImageSources } from './imageSearch.js';
import { getUsedSourceUrls } from './imageStore.js';
import { readJson, writeJson, readStaticCatalog } from './persistence.js';

const CACHE_TTL = 30 * 60 * 1000;
const PRIORITY_IMAGE_COUNT = 60;
const CRON_IMAGE_BATCH = 80;

let memoryCache = null;
let refreshPromise = null;

async function loadPersistedCache() {
  const blobCache = await readJson('catalog.json');
  if (blobCache?.articles?.length) return blobCache;

  const staticCache = await readStaticCatalog();
  if (staticCache?.articles?.length) return staticCache;

  return null;
}

async function saveCache(cache) {
  memoryCache = cache;
  await writeJson('catalog.json', cache);
}

export async function refreshArticles({ imageBatch = PRIORITY_IMAGE_COUNT } = {}) {
  await initImageSources(await getUsedSourceUrls());

  const { all, byCategory } = await loadArticleCatalog();

  const needsImage = all.filter((a) => !a.image).slice(0, imageBatch);
  if (needsImage.length) {
    await attachImagesToArticles(needsImage, 5);
  }

  const cache = { articles: all, byCategory, fetchedAt: Date.now() };
  await saveCache(cache);
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

  await attachImagesToArticles(needsImage, 5);

  cache.fetchedAt = Date.now();
  await saveCache(cache);
  return cache;
}

export async function getArticles() {
  const stale = !memoryCache || Date.now() - memoryCache.fetchedAt > CACHE_TTL;

  if (memoryCache && !stale) {
    return memoryCache;
  }

  const persisted = await loadPersistedCache();
  if (persisted && Date.now() - persisted.fetchedAt < CACHE_TTL) {
    memoryCache = persisted;
    return persisted;
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
