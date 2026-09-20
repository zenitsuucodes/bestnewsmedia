import { getArticles } from '../../server/newsService.js';
import { sendJson, handleOptions } from '../../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const data = await getArticles();
    const article = data.articles.find((a) => a.id === req.query.id);
    if (!article) return sendJson(res, 404, { error: 'Article not found' });
    sendJson(res, 200, article);
  } catch (err) {
    console.error('article error:', err);
    sendJson(res, 500, { error: 'Unable to load article' });
  }
}
