import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRemoteImage, getCachedImage, cacheImage } from './imageProxy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/img', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).end();
  }

  try {
    const cached = getCachedImage(url);
    if (cached) {
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('Content-Type', cached.contentType);
      return res.send(cached.buffer);
    }

    const result = await fetchRemoteImage(url);
    if (!result) return res.status(404).end();

    cacheImage(url, result);
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Content-Type', result.contentType);
    res.send(result.buffer);
  } catch {
    res.status(502).end();
  }
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Best News Media running on http://localhost:${PORT}`);
});
