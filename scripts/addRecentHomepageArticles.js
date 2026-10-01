import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { titleToSlug } from '../src/utils/slug.js';
import { fetchRemoteImage } from '../server/imageProxy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'public', 'catalog.json');
const IMAGE_DIR = path.join(ROOT, 'public', 'images', 'recent-oct');

function makeId(title) {
  return crypto.createHash('md5').update(title).digest('hex').slice(0, 12);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

function buildArticle({ title, category, publishedAt, image, body }) {
  return {
    id: makeId(title),
    title,
    slug: titleToSlug(title),
    excerpt: body[0],
    body,
    category,
    image,
    author: 'Best News Media Staff',
    publishedAt,
    readTime: estimateReadTime(body),
  };
}

const imageSources = {
  'shutdown.jpg': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
  'cyber.jpg': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  'retail.jpg': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  'vaccines.jpg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  'storm.jpg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
};

await fs.mkdir(IMAGE_DIR, { recursive: true });
for (const [file, url] of Object.entries(imageSources)) {
  const dest = path.join(IMAGE_DIR, file);
  try {
    await fs.access(dest);
  } catch {
    const result = await fetchRemoteImage(url);
    if (!result) throw new Error(`Unable to download image: ${file}`);
    await fs.writeFile(dest, result.buffer);
  }
}

const img = (file) => `/images/recent-oct/${file}`;

const fillers = [
  buildArticle({
    title: 'Congress Faces Midnight Deadline as Talks Continue on Short-Term Funding Bill',
    category: 'politics',
    publishedAt: '2026-10-01T15:30:00.000Z',
    image: img('shutdown.jpg'),
    body: [
      'Lawmakers returned to the Capitol on Wednesday with less than 48 hours before federal funding is set to lapse, as leaders from both parties traded proposals for a temporary spending measure.',
      'Agency officials began notifying employees of possible furlough plans while maintaining that essential safety and security operations would continue in any partial shutdown.',
      'Budget negotiators said the latest sticking points involve disaster relief offsets and policy riders tied to health programs, though staff-level talks continued through the evening.',
      'Financial markets showed limited reaction, with analysts noting that brief funding gaps have become more common and usually resolve within days.',
      'The White House urged Congress to pass a clean extension while signaling willingness to discuss longer-term spending caps in a separate negotiation track.',
    ],
  }),
  buildArticle({
    title: 'Homeland Security Officials Warn of Holiday Shopping Scams Targeting Mobile Payments',
    category: 'tech',
    publishedAt: '2026-10-01T11:00:00.000Z',
    image: img('cyber.jpg'),
    body: [
      'U.S. and European cybersecurity agencies issued a joint advisory warning consumers and small businesses about a surge in phishing pages mimicking major retailers ahead of the holiday season.',
      'Investigators said fraudsters are increasingly using text messages and social-media ads to steer victims toward fake checkout sites designed to capture payment credentials and one-time passcodes.',
      'Retailers are being urged to enable stronger fraud monitoring on digital wallets and to publish verified links for seasonal promotions.',
      'Consumer groups recommend using credit cards for online purchases, enabling transaction alerts, and avoiding payment links sent through unsolicited messages.',
      'Officials said reporting suspicious sites early helps takedown teams remove malicious pages before they spread through search and ad networks.',
    ],
  }),
  buildArticle({
    title: 'Retail Chains Signal Cautious Outlook After Mixed Back-to-School Results',
    category: 'business',
    publishedAt: '2026-09-30T20:45:00.000Z',
    image: img('retail.jpg'),
    body: [
      'Several large U.S. retailers told investors that back-to-school sales finished below expectations in some categories, even as traffic held steady in suburban stores.',
      'Executives cited warmer-than-usual weather in parts of the country and delayed purchasing for apparel, while electronics and dorm essentials performed comparatively well.',
      'Inventory levels remain elevated at discount chains, prompting additional promotions as companies try to clear seasonal goods before holiday assortments arrive.',
      'Economists said the reports fit a broader pattern of selective spending, with households prioritizing services and experiences while hunting for deals on discretionary items.',
      'Analysts expect the next earnings cycle to focus on how successfully retailers convert early foot traffic into full-price holiday baskets.',
    ],
  }),
  buildArticle({
    title: 'Health Officials Recommend Updated Flu and COVID Shots as Clinic Demand Rises',
    category: 'health',
    publishedAt: '2026-09-30T14:20:00.000Z',
    image: img('vaccines.jpg'),
    body: [
      'Public-health agencies encouraged eligible Americans to schedule updated influenza and COVID-19 vaccinations as clinics reported a steady increase in appointment requests.',
      'Hospital leaders said combined respiratory admissions remain manageable but warned that late vaccination could leave communities vulnerable if multiple viruses circulate at once.',
      'Pharmacies expanded evening and weekend hours in several states to accommodate families ahead of school breaks and travel plans.',
      'Pediatricians emphasized that children with asthma or other chronic conditions benefit from early protection before indoor gatherings become more frequent.',
      'Officials said vaccination coverage among older adults continues to lag targets in rural counties, where mobile clinics are being redeployed this month.',
    ],
  }),
  buildArticle({
    title: 'Gulf Coast States Monitor Developing Storm System Ahead of Weekend',
    category: 'world',
    publishedAt: '2026-09-30T09:15:00.000Z',
    image: img('storm.jpg'),
    body: [
      'Meteorologists are tracking a tropical disturbance in the Gulf of Mexico that could strengthen before approaching the northern Gulf Coast late this week.',
      'Emergency managers in Louisiana, Mississippi and Alabama advised residents to review evacuation routes and refresh hurricane kits even though the system’s final track remains uncertain.',
      'Energy companies said offshore platforms are operating normally but will pause nonessential work if forecast confidence increases over the next 48 hours.',
      'Forecast models disagree on how much wind shear the system will encounter, making rainfall totals and storm surge the primary planning concerns for coastal communities.',
      'Officials urged travelers to monitor local alerts and avoid driving through flooded roads if heavy bands move inland over the weekend.',
    ],
  }),
];

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

const ids = new Set(fillers.map((a) => a.id));
catalog.articles = catalog.articles.filter((a) => !ids.has(a.id));

for (const article of fillers) {
  catalog.articles.push(article);
  if (!catalog.byCategory[article.category]) catalog.byCategory[article.category] = [];
  catalog.byCategory[article.category] = catalog.byCategory[article.category].filter(
    (a) => a.id !== article.id,
  );
  catalog.byCategory[article.category].unshift(article);
  catalog.byCategory[article.category] = catalog.byCategory[article.category].slice(0, 100);
}

catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Added ${fillers.length} recent homepage articles:`);
for (const a of fillers.sort((x, y) => new Date(y.publishedAt) - new Date(x.publishedAt))) {
  console.log(`  ${a.publishedAt.slice(0, 10)}  ${a.title.slice(0, 62)}…`);
}
