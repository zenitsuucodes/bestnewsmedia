import { attachMoreImages } from '../../server/newsService.js';
import { isAuthorizedCron, sendJson, handleOptions } from '../../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (!isAuthorizedCron(req)) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  try {
    const cache = await attachMoreImages(80);
    const withImages = cache.articles.filter((a) => a.image).length;
    const missing = cache.articles.length - withImages;
    sendJson(res, 200, {
      ok: true,
      withImages,
      missing,
      fetchedAt: cache.fetchedAt,
    });
  } catch (err) {
    console.error('cron images error:', err);
    sendJson(res, 500, { error: 'Image batch failed' });
  }
}
