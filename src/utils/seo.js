import { titleToSlug } from './slug.js';

const DEFAULT_TITLE = 'Best News Media | Trusted Coverage Since 2009';
const DEFAULT_DESCRIPTION =
  'Best News Media — trusted independent journalism since 2009. World, technology, science, health, sports, and more.';

export function getSiteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || 'https://bestnewsmedia.vercel.app';
}

export function absoluteImageUrl(imagePath) {
  const origin = getSiteOrigin();
  if (!imagePath) return `${origin}/logo.png`;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${origin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}

function upsertMeta(selector, attributes) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyArticleSeo(article) {
  if (!article) return;

  const origin = getSiteOrigin();
  const slug = article.slug || titleToSlug(article.title);
  const pageUrl = `${origin}/article/${slug}`;
  const imageUrl = absoluteImageUrl(article.image);
  const title = `${article.title} | Best News Media`;
  const description = article.excerpt || article.title;

  document.title = title;

  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'article' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Best News Media' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: article.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: pageUrl });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: article.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
  upsertLink('canonical', pageUrl);
}

export function resetSiteSeo() {
  document.title = DEFAULT_TITLE;
  upsertMeta('meta[name="description"]', { name: 'description', content: DEFAULT_DESCRIPTION });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Best News Media' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: 'Best News Media' });
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: DEFAULT_DESCRIPTION,
  });
  upsertMeta('meta[property="og:image"]', {
    property: 'og:image',
    content: absoluteImageUrl('/logo.png'),
  });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: getSiteOrigin() });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
}
