import { refreshArticles } from '../../server/newsService.js';
import { isAuthorizedCron, sendJson, handleOptions } from '../../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (!isAuthorizedCron(req)) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  try {
    const cache = await refreshArticles({ imageBatch: 100 });
    const withImages = cache.articles.filter((a) => a.image).length;
    sendJson(res, 200, {
      ok: true,
      articles: cache.articles.length,
      withImages,
      fetchedAt: cache.fetchedAt,
    });
  } catch (err) {
    console.error('cron refresh error:', err);
    sendJson(res, 500, { error: 'Refresh failed' });
  }
}
