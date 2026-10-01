import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { titleToSlug } from '../src/utils/slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'public', 'catalog.json');

function makeId(title) {
  return crypto.createHash('md5').update(title).digest('hex').slice(0, 12);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

const title =
  'Owner Pleads for Return of Rescued Raccoon After Animal Is Seized by New York Wildlife Officials';

const body = [
  'SARATOGA COUNTY, N.Y. — A Saratoga County man is pleading for the safe return of Rocket, a rescued raccoon he raised from an orphaned kit, after wildlife officials removed the animal from his home following a complaint about the privately kept animal.',
  'Daniel Mercer, 34, says he has cared for Rocket for several years after discovering the tiny raccoon beside its dead mother near his property.',
  'Mercer said he initially took the young animal in simply to keep it alive, intending to eventually release it back into the wild. But as Rocket recovered, the raccoon became increasingly accustomed to human care and remained with him.',
  'Mercer chose the name Rocket for the quick, curious kit that never seemed to sit still. Over the years, Rocket became part of Mercer’s everyday life and developed a following online, where Mercer regularly shared photographs and videos of the raccoon.',
  'That changed this week when wildlife officials arrived at Mercer’s property after receiving a complaint concerning Rocket.',
  'Rocket was removed after officials determined Mercer did not have the authorization required to legally possess the wild animal.',
  'Mercer says his biggest concern now is what happens next.',
  'He says he has received no guarantee that Rocket will be returned or transferred to a licensed sanctuary and fears euthanasia could be considered if officials determine the raccoon cannot legally be released into the wild.',
  '“I don’t care if they decide I can’t keep him anymore. I just want Rocket alive,” Mercer said. “Send him to a sanctuary. Send him somewhere that can legally care for him. Just don’t kill him.”',
  'Mercer says he has begun contacting wildlife organizations, attorneys and licensed facilities in an effort to find somewhere legally permitted to take Rocket.',
  'Supporters have also begun calling for officials to spare Rocket and allow the raccoon to be transferred to an appropriate wildlife facility rather than euthanized.',
  'For now, Rocket remains in government custody while the raccoon’s future is determined.',
  'Mercer says he intends to keep fighting.',
  '“Rocket’s been part of my family for years. I rescued him because I didn’t want him to die. I never imagined that years later I’d be fighting to save his life all over again.”',
];

const article = {
  id: makeId(title),
  title,
  slug: titleToSlug(title),
  excerpt:
    'Daniel Mercer is pleading for the safe return of Rocket, the rescued raccoon he raised for years, after New York wildlife officials removed the animal from his Saratoga County home.',
  body,
  category: 'animals',
  image: '/images/saratoga-raccoon.jpg',
  author: 'Best News Media Staff',
  publishedAt: '2026-10-01T19:00:00.000Z',
  readTime: estimateReadTime(body),
};

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

catalog.articles = catalog.articles.filter((a) => a.id !== article.id);
catalog.articles.unshift(article);
catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

if (!catalog.byCategory.animals) catalog.byCategory.animals = [];
const animals = catalog.byCategory.animals.filter((a) => a.id !== article.id);
animals.unshift(article);
catalog.byCategory.animals = animals.slice(0, 100);

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Added: ${article.id}`);
console.log(`Slug: ${article.slug}`);
console.log(`Path: /article/${article.slug}`);
