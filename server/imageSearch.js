import crypto from 'crypto';
import { extractKeywords } from './keywordExtractor.js';
import { searchWebImages } from './webImageSearch.js';
import {
  getStoredImageUrl,
  saveArticleImage,
} from './imageStore.js';

const queryCache = new Map();
const globallyUsedSources = new Set();

export async function initImageSources(usedUrls = []) {
  for (const url of usedUrls) {
    globallyUsedSources.add(url.split('?')[0]);
  }
}
let lastWikiRequest = 0;
const WIKI_MIN_INTERVAL_MS = 300;

function hashIndex(seed, length) {
  if (!length) return 0;
  const hash = crypto.createHash('md5').update(String(seed)).digest('hex');
  return parseInt(hash.slice(0, 8), 16) % length;
}

function cleanImageUrl(url) {
  return url?.split('?')[0] || url;
}

function claimSource(url) {
  const key = cleanImageUrl(url);
  if (!key || globallyUsedSources.has(key)) return false;
  globallyUsedSources.add(key);
  return true;
}

async function waitForWikiSlot() {
  const now = Date.now();
  const wait = Math.max(0, WIKI_MIN_INTERVAL_MS - (now - lastWikiRequest));
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
  lastWikiRequest = Date.now();
}

async function searchWikimedia(query) {
  if (!query?.trim()) return [];

  const cacheKey = query.toLowerCase();
  if (queryCache.has(cacheKey)) return queryCache.get(cacheKey);

  try {
    await waitForWikiSlot();

    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '10',
      prop: 'imageinfo',
      iiprop: 'url|mime|thumburl',
      iiurlwidth: '1200',
    });

    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 429 || !res.ok) {
      queryCache.set(cacheKey, []);
      return [];
    }

    const data = await res.json();
    const urls = Object.values(data.query?.pages || {})
      .map((page) => {
        const info = page.imageinfo?.[0];
        if (!info?.mime?.startsWith('image/')) return null;
        return cleanImageUrl(info.thumburl || info.url);
      })
      .filter(Boolean);

    queryCache.set(cacheKey, urls);
    return urls;
  } catch {
    queryCache.set(cacheKey, []);
    return [];
  }
}

function pickUnused(urls, articleId) {
  if (!urls.length) return null;
  const start = hashIndex(articleId, urls.length);
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[(start + i) % urls.length];
    if (!globallyUsedSources.has(cleanImageUrl(url))) return url;
  }
  return null;
}

function buildSearchQueries(article) {
  const { primary, tags, category } = extractKeywords(
    article.title,
    article.excerpt,
    article.category,
  );

  const titleCore = article.title.replace(/[^\w\s'-]/g, ' ').trim();

  const categoryFallback = {
    world: 'world news global',
    tech: 'technology innovation',
    business: 'business economy stock market',
    science: 'science discovery research',
    health: 'health medicine hospital',
    animals: 'wildlife animals nature',
    sports: 'sports stadium athletes',
    entertainment: 'entertainment celebrity film',
    politics: 'politics government parliament',
  };

  return [
    titleCore,
    `${primary} ${category}`.trim(),
    `${titleCore.split(/\s+/).slice(0, 6).join(' ')} photo`,
    tags.replace(/,/g, ' '),
    categoryFallback[category] || `${category} news`,
  ].filter(Boolean);
}

async function downloadAndStore(article, remoteUrl, { allowDuplicate = false } = {}) {
  if (!remoteUrl) return null;
  if (!allowDuplicate && !claimSource(remoteUrl)) return null;
  return saveArticleImage(article.id, remoteUrl);
}

export async function findArticleImage(article) {
  const stored = await getStoredImageUrl(article.id);
  if (stored) return stored;

  const queries = buildSearchQueries(article);

  const triedUrls = new Set();

  for (const query of queries) {
    const webResults = await searchWebImages(query, 20);
    if (!webResults.length) continue;

    const startIdx = hashIndex(article.id, webResults.length);
    const ordered = [
      ...webResults.slice(startIdx),
      ...webResults.slice(0, startIdx),
    ];

    for (const candidate of ordered) {
      triedUrls.add(cleanImageUrl(candidate));
      const saved = await downloadAndStore(article, candidate);
      if (saved) return saved;
    }
  }

  for (const query of queries) {
    const wikiResults = await searchWikimedia(query);
    if (!wikiResults.length) continue;

    const startIdx = hashIndex(article.id, wikiResults.length);
    const ordered = [
      ...wikiResults.slice(startIdx),
      ...wikiResults.slice(0, startIdx),
    ];

    for (const candidate of ordered) {
      triedUrls.add(cleanImageUrl(candidate));
      const saved = await downloadAndStore(article, candidate);
      if (saved) return saved;
    }
  }

  for (const url of triedUrls) {
    const saved = await downloadAndStore(article, url, { allowDuplicate: true });
    if (saved) return saved;
  }

  return null;
}

export async function attachImagesToArticles(articles, batchSize = 6) {
  const needsImage = articles.filter((a) => !a.image);

  for (let i = 0; i < needsImage.length; i += batchSize) {
    const batch = needsImage.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (article) => {
        const image = await findArticleImage(article);
        if (image) article.image = image;
      }),
    );
    if (i + batchSize < needsImage.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return articles;
}
