import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'public', 'catalog.json');

function makeId(title) {
  return crypto.createHash('md5').update(title).digest('hex').slice(0, 12);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

const article = {
  id: makeId('Oversized Black Bear Nicknamed Chungus Goes Viral as Fat Bear Week Begins'),
  title: 'Oversized Black Bear Nicknamed “Chungus” Goes Viral as Fat Bear Week Begins',
  excerpt: 'As Fat Bear Week draws renewed attention to Alaska’s largest bears, an unusually heavy black bear spotted in a residential neighborhood has become an unexpected social-media sensation nicknamed “Chungus.”',
  body: [
    'ALASKA — As Fat Bear Week draws renewed attention to some of Alaska’s largest bears, an unusually heavy black bear spotted in a residential neighborhood has become an unexpected social-media sensation.',
    'Photographs showing the bear standing upright near several homes began circulating online after residents noticed its unusually broad frame and rounded appearance. Within hours, social-media users had given the animal a nickname: “Chungus.”',
    'The name is a reference to the long-running “Big Chungus” internet meme, which depicts an exaggeratedly large version of Bugs Bunny. Users began sharing side-by-side comparisons after noticing similarities between the meme character’s stance and the bear’s upright posture.',
    'The timing of the sighting helped the photographs spread further. Fat Bear Week, the annual online event celebrating bears that have accumulated significant fat reserves before winter, has once again brought widespread attention to the dramatic seasonal weight gain seen among Alaska’s bears.',
    'The bear pictured in the neighborhood is a black bear and has been accepted as the first official fat bear in the Fat Bear Week tournament at Katmai National Park.',
    'Several posts referred to the animal as “the people’s Fat Bear Week candidate,” while others joked that the competition had already found its champion.',
    'The bear reportedly appeared calm during the sighting and was photographed standing near trees and residential fencing before moving through the area. There were no immediate reports of aggressive behavior.',
    'Wildlife officials routinely remind residents in bear country to secure garbage, pet food and other attractants, particularly during late summer and early autumn. Bears enter a period of intense feeding before winter known as hyperphagia, during which they can spend much of the day searching for high-calorie food.',
    'That seasonal behavior can occasionally bring bears closer to residential areas, particularly where human food sources are accessible.',
    'For now, little is publicly known about the individual bear, including whether it has previously been identified or monitored.',
    'Online, however, the lack of an official name does not appear to matter.',
    'Within a short period of time, “Chungus the Bear” had gone from an unidentified neighborhood visitor to one of the latest viral wildlife images associated with Alaska’s fall bear season.',
    'And while it will not be appearing in the official Fat Bear Week bracket, social media appears to have already created a separate competition of its own.',
  ],
  category: 'animals',
  image: '/images/chungus-bear.jpg',
  author: 'Best News Media Staff',
  publishedAt: new Date().toISOString(),
  readTime: 0,
};

article.readTime = estimateReadTime(article.body);

const raw = await fs.readFile(CATALOG_PATH, 'utf8');
const catalog = JSON.parse(raw);

catalog.articles = catalog.articles.filter((a) => a.id !== article.id);
catalog.articles.unshift(article);
catalog.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const animals = catalog.byCategory.animals.filter((a) => a.id !== article.id);
animals.unshift(article);
catalog.byCategory.animals = animals.slice(0, 100);

await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog));

console.log(`Added article ${article.id} to animals (${catalog.articles.length} total articles)`);
