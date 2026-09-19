import Parser from 'rss-parser';
import { CATEGORIES, FEED_SOURCES, ARTICLES_PER_CATEGORY, ITEMS_PER_FEED } from './feeds.js';
import { processFeedItem } from './articleProcessor.js';
import { classifyArticle } from './categoryClassifier.js';
import { applyStoredImages } from './imageStore.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'content:encoded'],
    ],
  },
});

function stripSnippet(item) {
  const raw = item.contentSnippet || item.summary || '';
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function fetchAllFeedItems() {
  const pool = [];

  await Promise.all(
    CATEGORIES.map(async ({ id }) => {
      const feeds = FEED_SOURCES[id] || [];
      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url);
          for (const item of feed.items.slice(0, ITEMS_PER_FEED)) {
            pool.push({ item, feedCategory: id });
          }
        } catch {
          // Skip unavailable feeds
        }
      }
    }),
  );

  return pool;
}

export async function buildArticleCatalog(pool) {
  const byLink = new Map();

  for (const { item, feedCategory } of pool) {
    const link = item.link || item.guid;
    if (!link) continue;

    const title = item.title || '';
    const excerpt = stripSnippet(item);
    const category = classifyArticle(title, excerpt, feedCategory);
    const article = processFeedItem(item, category);

    if (!byLink.has(link)) {
      byLink.set(link, article);
      continue;
    }

    const existing = byLink.get(link);
    if (existing.category !== category && category === feedCategory) {
      byLink.set(link, article);
    }
  }

  const all = [...byLink.values()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );

  const byCategory = {};
  const usedIds = new Set();

  for (const { id } of CATEGORIES) {
    const primary = all.filter((a) => a.category === id);
    const picked = primary.slice(0, ARTICLES_PER_CATEGORY);
    picked.forEach((a) => usedIds.add(a.id));

    if (picked.length < ARTICLES_PER_CATEGORY) {
      const feedBackfill = pool
        .filter(({ feedCategory, item }) => {
          if (feedCategory !== id) return false;
          const link = item.link || item.guid;
          const article = byLink.get(link);
          return article && !usedIds.has(article.id);
        })
        .map(({ item }) => byLink.get(item.link || item.guid))
        .filter(Boolean);

      for (const article of feedBackfill) {
        if (picked.length >= ARTICLES_PER_CATEGORY) break;
        article.category = id;
        picked.push(article);
        usedIds.add(article.id);
      }
    }

    byCategory[id] = picked;
  }

  await applyStoredImages(all);

  return { all, byCategory };
}

export async function loadArticleCatalog() {
  const pool = await fetchAllFeedItems();
  return buildArticleCatalog(pool);
}
