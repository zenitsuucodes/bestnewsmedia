import {
  findArticle,
  getRequestOrigin,
  injectArticleMeta,
  loadCatalog,
} from '../../server/embedUtils.js';

export default async function handler(req, res) {
  const slug = req.query.slug;
  if (!slug || typeof slug !== 'string') {
    res.status(400).send('Missing slug');
    return;
  }

  try {
    const origin = getRequestOrigin(req);
    const [catalog, indexRes] = await Promise.all([
      loadCatalog(origin),
      fetch(`${origin}/index.html`, { cache: 'no-store' }),
    ]);

    if (!indexRes.ok) {
      res.status(502).send('Unable to load app shell');
      return;
    }

    const article = findArticle(catalog, slug);
    if (!article) {
      res.status(404).send('Article not found');
      return;
    }

    const indexHtml = await indexRes.text();
    const html = injectArticleMeta(indexHtml, article, origin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).send(html);
  } catch {
    res.status(500).send('Unable to build preview');
  }
}
