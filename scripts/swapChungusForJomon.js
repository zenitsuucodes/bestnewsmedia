import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'public', 'catalog.json');
const DRAFT_PATH = path.join(ROOT, 'drafts', 'chungus-bear-article.json');
const BEAR_ID = '891cf6f88a73';

function makeId(title) {
  return crypto.createHash('md5').update(title).digest('hex').slice(0, 12);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

const body = [
  '[Nara] What began as an ordinary animal rescue in the interior of the Kii Peninsula could lead to one of the most unusual discoveries in modern Japanese canine history.',
  'An injured male dog found on a forest road in the sparsely populated mountains around Mount Odaigahara and Mount Omine may belong to an ancient line of dog thought to have disappeared thousands of years ago—the so-called Jomon dog.',
  'The discovery was made by a driver passing through a remote mountain area. In a landscape of steep valleys, dense cedar forest, and abandoned forestry roads, a small dog that at first glance looked like a shiba or mixed breed was dragging its hind leg. Its reddish-brown coat, erect triangular ears, curled tail, and compact build all pointed toward an older Japanese dog type.',
  'Noticing that the animal could not put weight on its rear leg, the driver took it to a veterinary hospital in Nara Prefecture.',
  'At first the case appeared routine. Veterinarians logged the dog as an unidentified Japanese-type animal and began treating the leg injury. X-rays, however, revealed skeletal traits unlike those of a typical shiba: a straighter skull profile, a shallow stop from forehead to muzzle, a heavier jaw, and larger teeth.',
  'That finding prompted the hospital to contact specialists who study the form and ancestry of ancient Japanese dogs. A routine rescue had entered a phase that could become a scientific breakthrough.',
  'Researchers initially assumed the animal was an unusual shiba or a mixed breed with primitive features. Samples taken from blood and cheek cells were compared against known data for modern Japanese breeds, including the shiba, Kishu, Shikoku, Kai, Akita, and Hokkaido dog.',
  'There was never any doubt that the animal was a dog. Yet its DNA did not fit cleanly into any existing modern Japanese breed population.',
  'As analysis continued, its genetic profile appeared unusually close to the small early dogs that lived in Japan thousands of years ago—Jomon-period dogs known only through archaeological remains.',
  'Researchers stress that the living animal is not a perfect duplicate of an excavated specimen. After thousands of years, an exact match would be scientifically impossible. Even so, the combination of genetics and skeletal form suggests the possibility of an isolated surviving line more directly connected to ancient Jomon dogs than any modern breed.',
  'The team has provisionally classified the animal as part of an unrecorded lineage under the scientific name Jomocyon Japonicus. The rescued male has been named Shiro.',
  'The case has drawn special attention in Japan because enthusiasts and preservation groups have long been fascinated by ancient dog types.',
  'For decades, organizations such as Shibaho have selectively bred certain shiba lines to preserve or recreate traits associated with ancient Jomon dogs—shallow stops, strong teeth, compact bodies, and a more primitive temperament.',
  'Those programs, however, were modern preservation efforts based on archaeological interpretation and selective breeding. They were not proof of a pure surviving Jomon population.',
  'In other words, Japan has spent decades trying to breed dogs that look like ancient Jomon dogs, yet until now no naturally surviving pure group had ever been confirmed. That contrast is what makes this case so striking.',
  'Shibaho expressed astonishment at the preliminary findings, calling the possibility of a naturally surviving ancient line extraordinary. "We have worked for years to preserve traits thought to reflect Japan\'s earliest dogs," the group said. "If part of that lineage survived on its own in an isolated environment, that would be remarkable."',
  'After the genetic results, researchers went back to the mountain area where the dog was found. Camera traps were placed along forest trails, stream banks, and disused logging roads.',
  'For weeks the cameras recorded only deer, wild boar, martens, and raccoon dogs. Then one unit captured a small dog-like animal crossing the forest before dawn—compact in build, with a curled tail and distinctive facial structure matching the rescued individual.',
  'Over the following month, footage suggesting at least two more animals was recorded, including what appeared to be an adult female and younger individuals. Hair samples were also collected from a narrow game trail used repeatedly.',
  'If genetically confirmed, the rescued male would be more likely a member of a small remaining population in the mountains than a one-off anomaly or hybrid.',
  'Researchers believe the main reason such animals have been overlooked is that they do not look dramatically wild or exotic. At a glance they resemble ordinary small Japanese dogs.',
  'For that reason, sightings over generations may have been dismissed as stray shibas, village mixes, or abandoned pets. Detailed imaging and genetic work revealed a skull and ancestry that do not match the standard modern shiba profile.',
  'The rescued dog is recovering well under observation, and the research team continues to monitor the surrounding forest while comparing findings with museum specimens and archaeological data.',
  'If confirmed, the significance would extend far beyond a strange dog found in the mountains. It would challenge the long-held assumption that Jomon-type dogs survive only in bones, ancient DNA, and traits selectively preserved in modern Japanese breeds.',
  'While preservationists tried to recreate the ancient form through breeding, a small remnant of that lineage may have been living quietly in one of Japan\'s most isolated forests.',
  'It all began with one driver\'s decision to help what looked like an injured shiba.',
];

const newArticle = {
  id: makeId('Injured Dog Found in Kii Peninsula Mountains May Be Extinct Ancient Lineage Scientists Say'),
  title: 'Injured Dog Found in Kii Peninsula Mountains May Be Extinct Ancient Lineage, Scientists Say',
  excerpt: 'What began as an ordinary animal rescue in the interior of the Kii Peninsula could lead to one of the most unusual discoveries in modern Japanese canine history.',
  body,
  category: 'animals',
  image: '/images/jomon-dog-shiro.jpg',
  author: 'Best News Media Staff',
  publishedAt: new Date().toISOString(),
  readTime: estimateReadTime(body),
};

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

const bearIndex = catalog.articles.findIndex((a) => a.id === BEAR_ID);
if (bearIndex === -1) throw new Error('Bear article not found');

const bearArticle = catalog.articles[bearIndex];
await fs.mkdir(path.join(ROOT, 'drafts'), { recursive: true });
await fs.writeFile(
  DRAFT_PATH,
  JSON.stringify({ ...bearArticle, status: 'draft', archivedAt: new Date().toISOString() }, null, 2),
);

catalog.articles.splice(bearIndex, 1, newArticle);
catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const animals = catalog.byCategory.animals.filter((a) => a.id !== BEAR_ID && a.id !== newArticle.id);
animals.unshift(newArticle);
catalog.byCategory.animals = animals.slice(0, 100);

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Draft saved: drafts/chungus-bear-article.json`);
console.log(`Published: ${newArticle.id} — ${newArticle.title}`);
