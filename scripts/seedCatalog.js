import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadArticleCatalog } from '../server/articleCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'catalog.json');

async function main() {
  console.log('Fetching RSS feeds for build catalog…');
  const started = Date.now();

  const { all, byCategory } = await loadArticleCatalog();

  console.log(`Fetched ${all.length} articles in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log('Writing public/catalog.json…');

  const cache = { articles: all, byCategory, fetchedAt: Date.now() };
  await fs.writeFile(OUT, JSON.stringify(cache));

  console.log(`Build catalog ready (${all.length} articles).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
