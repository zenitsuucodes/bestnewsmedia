import { fetchRemoteImage, getCachedImage, cacheImage } from '../server/imageProxy.js';
import { handleOptions, setCors } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') {
    setCors(res);
    return res.status(405).end();
  }

  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    setCors(res);
    return res.status(400).end();
  }

  try {
    const cached = getCachedImage(url);
    if (cached) {
      setCors(res);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', cached.contentType);
      return res.status(200).send(cached.buffer);
    }

    const result = await fetchRemoteImage(url);
    if (!result) {
      setCors(res);
      return res.status(404).end();
    }

    cacheImage(url, result);
    setCors(res);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Type', result.contentType);
    res.status(200).send(result.buffer);
  } catch {
    setCors(res);
    res.status(502).end();
  }
}
