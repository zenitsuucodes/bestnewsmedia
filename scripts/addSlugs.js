import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { titleToSlug } from '../src/utils/slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'public', 'catalog.json');

function assignSlug(article, used) {
  let base = titleToSlug(article.title) || article.id;
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  article.slug = slug;
}

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);
const used = new Set();

for (const article of catalog.articles) {
  assignSlug(article, used);
}

for (const category of Object.keys(catalog.byCategory)) {
  for (const article of catalog.byCategory[category]) {
    const source = catalog.articles.find((a) => a.id === article.id);
    if (source) article.slug = source.slug;
    else assignSlug(article, used);
  }
}

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

const jomon = catalog.articles.find((a) => a.id === '66b945bb61aa');
console.log(`Added slugs to ${catalog.articles.length} articles`);
if (jomon) console.log(`Jomon article slug: ${jomon.slug}`);
