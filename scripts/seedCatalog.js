import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadArticleCatalog } from '../server/articleCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'catalog.json');

async function main() {
  console.log('Seeding catalog for static fallback…');
  const { all, byCategory } = await loadArticleCatalog();
  const cache = { articles: all, byCategory, fetchedAt: Date.now() };
  await fs.writeFile(OUT, JSON.stringify(cache));
  console.log(`Wrote ${all.length} articles to public/catalog.json`);
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
