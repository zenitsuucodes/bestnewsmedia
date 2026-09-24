import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'public', 'catalog.json');

const articleId = process.argv[2];
const draftFile = process.argv[3];
if (!articleId || !draftFile) {
  console.error('Usage: node scripts/archiveArticleToDraft.js <articleId> <drafts/filename.json>');
  process.exit(1);
}

const DRAFT_PATH = path.join(ROOT, 'drafts', draftFile);

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

const index = catalog.articles.findIndex((a) => a.id === articleId);
if (index === -1) {
  console.error(`Article not found: ${articleId}`);
  process.exit(1);
}

const article = catalog.articles[index];
await fs.mkdir(path.join(ROOT, 'drafts'), { recursive: true });
await fs.writeFile(
  DRAFT_PATH,
  JSON.stringify(
    { ...article, status: 'draft', archivedAt: new Date().toISOString() },
    null,
    2,
  ),
);

catalog.articles.splice(index, 1);
for (const key of Object.keys(catalog.byCategory || {})) {
  catalog.byCategory[key] = catalog.byCategory[key].filter((a) => a.id !== articleId);
}

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Draft saved: drafts/${draftFile}`);
console.log(`Removed from catalog: ${articleId} — ${article.title}`);
