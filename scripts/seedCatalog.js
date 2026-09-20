import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadArticleCatalog } from '../server/articleCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

async function main() {
  console.log('Fetching RSS feeds for build catalog…');
  const started = Date.now();

  const { all, byCategory } = await loadArticleCatalog();
  const cache = { articles: all, byCategory, fetchedAt: Date.now() };
  const json = JSON.stringify(cache);

  console.log(`Fetched ${all.length} articles in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log('Writing catalog files…');

  await fs.writeFile(path.join(ROOT, 'public', 'catalog.json'), json);
  await fs.writeFile(path.join(ROOT, 'server', 'catalog.bundle.json'), json);

  console.log(`Build catalog ready (${all.length} articles, ${(json.length / 1024 / 1024).toFixed(1)} MB).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
