import { readStoredImage } from '../../../server/imageStore.js';
import { handleOptions, setCors } from '../../../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') {
    setCors(res);
    return res.status(405).end();
  }

  try {
    const stored = await readStoredImage(req.query.articleId);
    if (!stored) {
      setCors(res);
      return res.status(404).end();
    }

    setCors(res);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Type', stored.contentType);
    res.status(200).send(stored.buffer);
  } catch {
    setCors(res);
    res.status(502).end();
  }
}
