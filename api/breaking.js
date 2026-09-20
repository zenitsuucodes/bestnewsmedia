import { getArticles } from '../server/newsService.js';
import { sendJson, handleOptions } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const data = await getArticles();
    sendJson(res, 200, data.articles.slice(0, 6).map((a) => ({ id: a.id, title: a.title })));
  } catch (err) {
    console.error('breaking error:', err);
    sendJson(res, 500, { error: 'Unable to load breaking news' });
  }
}
