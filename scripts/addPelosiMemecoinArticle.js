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
  'Pelosi Challenges California’s Memecoin Ban, Calls for Disclosure Over Prohibition';

const body = [
  'Nancy Pelosi sharply criticized California’s ban on public officials issuing memecoins, arguing that the measure takes an unnecessarily broad approach to concerns about political influence and financial misconduct.',
  'In this dispute, Pelosi calls for lawmakers to replace the prohibition with a framework built around financial disclosure, independent oversight and enforceable restrictions on conflicts of interest.',
  '“Public office must never become a vehicle for private enrichment,” Pelosi says. “But that principle demands precise rules. It does not excuse us from distinguishing between legitimate activity and abuse.”',
  'Her objection centers on whether a categorical ban addresses the conduct that makes political cryptocurrency ventures controversial. Token purchases can create opportunities for people seeking influence to direct money toward an official’s financial interests. Pelosi acknowledges that concern while arguing that legislation should target those transactions and relationships more directly.',
  '“A transaction designed to buy access should be prohibited and investigated,” she argues. “The question is whether we are writing a law against corruption or treating an entire category of financial activity as proof of corruption.”',
  'The alternative she proposes would require officials to disclose financial interests in digital assets, identify compensation associated with token projects and submit relevant arrangements to ethics review. It would also restrict participation where an official’s public responsibilities overlap with a venture’s commercial interests.',
  'Such an approach would still face a difficult practical question: whether disclosure can adequately protect the public when a token’s value depends heavily on a politician’s prominence. Transparency could reveal a financial relationship without eliminating the incentive to cultivate one.',
  'Pelosi’s response is that safeguards should be judged by how effectively they prevent misconduct, rather than by how sweeping they appear.',
  '“Californians deserve rules that can be enforced, penalties that have consequences and protections that keep pace with technology,” she says. “A blanket prohibition may deliver a headline. Our responsibility is to deliver accountable government.”',
  'The confrontation establishes a debate over where ethical restrictions should begin: with a ban on officials entering the market, or with tightly regulated participation. Pelosi’s position would place the burden on lawmakers to demonstrate that oversight can prevent the conflicts a prohibition seeks to eliminate.',
];

const article = {
  id: makeId(title),
  title,
  slug: titleToSlug(title),
  excerpt: body[0],
  body,
  category: 'politics',
  image: '/images/pelosi-memecoin.png',
  author: 'Best News Media Staff',
  publishedAt: '2026-09-28T14:00:00.000Z',
  readTime: estimateReadTime(body),
};

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

catalog.articles = catalog.articles.filter((a) => a.id !== article.id);
catalog.articles.unshift(article);
catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

if (!catalog.byCategory.politics) catalog.byCategory.politics = [];
const politics = catalog.byCategory.politics.filter((a) => a.id !== article.id);
politics.unshift(article);
catalog.byCategory.politics = politics.slice(0, 100);

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Added: ${article.id}`);
console.log(`Slug: ${article.slug}`);
console.log(`Path: /article/${article.slug}`);
