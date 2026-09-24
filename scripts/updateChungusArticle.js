import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { titleToSlug } from '../src/utils/slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'public', 'catalog.json');
const BEAR_ID = '891cf6f88a73';

const title = 'Oversized Black Bear Nicknamed ‘Chungus’ Appears as Fat Bear Week Begins';

const body = [
  'An extraordinarily large black bear spotted in Alaska has drawn attention after wildlife officials who helped corral the animal gave him a fitting nickname: “Chungus.”',
  'The massive bear was discovered wandering near a populated area, prompting Alaska wildlife officials to respond and carefully guide him away from nearby residents and back toward the wilderness.',
  'But it was the animal’s extraordinary size that immediately stood out.',
  'Based on initial observations and estimates, Chungus is believed to be the largest wild black bear on record.',
  'Wildlife officials described the animal as exceptionally large even by the upper limits normally seen in American black bears. His enormous frame surprised members of the team involved in the operation, who began referring to him as “Chungus” while working to safely corral him.',
  'The nickname stuck.',
  'An exact weight has not yet been established, and formal measurements would be needed to confirm his size. However, early estimates have placed Chungus beyond the size typically documented among wild black bears.',
  'His discovery also came with remarkable timing.',
  'Chungus appeared just as Fat Bear Week, the annual celebration of Alaska’s famously well-fed bears, was beginning.',
  'Although Fat Bear Week traditionally focuses on the brown bears of Katmai National Park, the discovery of an unusually enormous black bear during the same week created an unusual coincidence.',
  'For wildlife officials, however, the priority was simply ensuring that Chungus could be moved safely away from people and returned to suitable habitat.',
  'The operation was completed successfully, and the enormous bear was allowed to continue back into the Alaskan wilderness.',
  'If subsequent measurements confirm the initial estimates, Chungus could hold an extraordinary distinction: the largest wild black bear ever recorded.',
  'And his appearance during Fat Bear Week could hardly have come at a more fitting time.',
];

const excerpt =
  'An extraordinarily large black bear spotted in Alaska has drawn attention after wildlife officials who helped corral the animal gave him a fitting nickname: “Chungus.”';

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

function patchArticle(article) {
  article.title = title;
  article.excerpt = excerpt;
  article.body = body;
  article.slug = titleToSlug(title);
  article.image = '/images/chungus-bear.jpg';
  article.readTime = estimateReadTime(body);
  article.publishedAt = '2026-09-24T18:20:00.000Z';
  return article;
}

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

let found = false;
for (const article of catalog.articles) {
  if (article.id === BEAR_ID) {
    patchArticle(article);
    found = true;
    break;
  }
}

if (!found) throw new Error('Chungus article not found in catalog');

for (const article of catalog.byCategory.animals) {
  if (article.id === BEAR_ID) patchArticle(article);
}

catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log('Updated:', title);
console.log('Slug:', titleToSlug(title));
