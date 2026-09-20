import { getArticles } from '../server/newsService.js';
import { sendJson, handleOptions } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const data = await getArticles();
    const { category, limit = '50' } = req.query;
    let filtered = data.articles;

    if (category) {
      filtered = data.byCategory[category] || [];
    }

    sendJson(res, 200, filtered.slice(0, Number(limit)));
  } catch (err) {
    console.error('articles error:', err);
    sendJson(res, 500, { error: 'Unable to load articles', detail: err.message });
  }
}
