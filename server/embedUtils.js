import { titleToSlug } from '../src/utils/slug.js';

export function getRequestOrigin(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  if (!host) return 'https://bestnewsmedia.vercel.app';
  return `${proto}://${host}`;
}

export function absoluteUrl(origin, path) {
  if (!path) return `${origin}/logo.png`;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function findArticle(catalog, slugOrId) {
  if (!catalog?.articles?.length || !slugOrId) return null;
  return catalog.articles.find(
    (a) => a.slug === slugOrId || a.id === slugOrId || titleToSlug(a.title) === slugOrId,
  );
}

export async function loadCatalog(origin) {
  const res = await fetch(`${origin}/catalog.json`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildMetaTags(article, origin) {
  const title = escapeHtml(article.title);
  const description = escapeHtml(article.excerpt || article.title);
  const slug = article.slug || titleToSlug(article.title);
  const pageUrl = `${origin}/article/${slug}`;
  const imageUrl = escapeHtml(absoluteUrl(origin, article.image));

  return `
    <title>${title} | Best News Media</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Best News Media" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="canonical" href="${pageUrl}" />
  `;
}

export function injectArticleMeta(indexHtml, article, origin) {
  const meta = buildMetaTags(article, origin);
  return indexHtml
    .replace(/<meta name="description"[^>]*>\s*/i, '')
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, meta.trim());
}
