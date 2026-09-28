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

function buildArticle({ title, category, publishedAt, image, body }) {
  const excerpt = body[0];
  return {
    id: makeId(title),
    title,
    slug: titleToSlug(title),
    excerpt,
    body,
    category,
    image,
    author: 'Best News Media Staff',
    publishedAt,
    readTime: estimateReadTime(body),
  };
}

const fillers = [
  buildArticle({
    title: 'Week Ahead: Tech Firms Face New Disclosure Rules as AI Audits Expand',
    category: 'tech',
    publishedAt: '2026-09-27T18:30:00.000Z',
    image: '/images/gap-fillers/tech.jpg',
    body: [
      'Regulators in the United States and Europe are preparing parallel reviews of how large technology companies document artificial-intelligence training data, safety testing and third-party model access.',
      'Company filings due this week are expected to show more detailed breakdowns of compute spending, cloud partnerships and internal red-team results than in prior quarters.',
      'Analysts say investors are watching for signs that compliance costs are slowing product rollouts, particularly in consumer chatbots and automated coding tools.',
      'Industry groups have asked for phased reporting timelines, arguing that rapid model updates make static disclosures outdated within weeks.',
      'Officials counter that standardized audit trails are necessary if policymakers are to compare risk controls across vendors ahead of next year’s legislative calendar.',
    ],
  }),
  buildArticle({
    title: 'UN General Assembly Week Opens With Focus on Gaza Ceasefire Talks',
    category: 'world',
    publishedAt: '2026-09-26T16:00:00.000Z',
    image: '/images/gap-fillers/world.jpg',
    body: [
      'Diplomats arriving in New York for the annual United Nations General Assembly say ceasefire negotiations and humanitarian access in Gaza will dominate bilateral meetings on the sidelines.',
      'Several delegations confirmed they will push for renewed funding pledges for refugee programs and for independent monitoring of aid corridors.',
      'European officials described the week as a test of whether major powers can align on a short-term truce framework without resolving longer-term political questions.',
      'Security around Manhattan’s east side has been tightened as protests are scheduled near the UN campus and at nearby transit hubs.',
      'Secretary-General briefings are expected to emphasize climate finance and debt relief for small island states, issues several leaders plan to link to broader security discussions.',
    ],
  }),
  buildArticle({
    title: 'Markets Steady as Investors Parse Inflation Data and Rate Outlook',
    category: 'business',
    publishedAt: '2026-09-25T14:15:00.000Z',
    image: '/images/gap-fillers/business.jpg',
    body: [
      'U.S. and European indexes closed little changed Friday as traders weighed fresh consumer-price data against signals from central bankers about the path of interest rates.',
      'Energy shares led gains after inventory reports showed tighter supplies, while large retailers slipped on concerns that back-to-school spending softened in late August.',
      'Bond markets implied slightly lower odds of an additional rate cut before year-end, though economists noted revisions to seasonal adjustment could shift that view next month.',
      'Corporate debt issuance picked up midweek as investment-grade borrowers sought to lock in yields ahead of a heavy calendar of economic releases.',
      'Portfolio managers said they remain cautious on small-cap exposure until earnings revisions stabilize across manufacturing and logistics firms.',
    ],
  }),
  buildArticle({
    title: 'Researchers Report Progress on Satellite-Based Wildfire Detection Network',
    category: 'science',
    publishedAt: '2026-09-24T11:45:00.000Z',
    image: '/images/gap-fillers/science.jpg',
    body: [
      'A consortium of universities and space agencies said a pilot network of low-Earth-orbit sensors cut average wildfire detection times by more than a third in Western North America this summer.',
      'The system combines thermal imaging with machine-learning models trained to filter out agricultural burns and industrial heat sources that previously triggered false alerts.',
      'Fire agencies participating in the trial received automated text alerts with GPS coordinates and confidence scores within minutes of a hotspot crossing a size threshold.',
      'Scientists cautioned that detection speed does not guarantee faster ground response, noting that staffing and aircraft availability remain bottlenecks during peak fire weeks.',
      'Funding for a expanded constellation is under review in several national budgets, with advocates arguing that early warnings could reduce insured losses and smoke-related health costs.',
    ],
  }),
  buildArticle({
    title: 'Health Officials Urge Early Flu Shots as Clinics Report Strong Demand',
    category: 'health',
    publishedAt: '2026-09-23T13:20:00.000Z',
    image: '/images/gap-fillers/health.jpg',
    body: [
      'Public-health departments in multiple countries reported higher-than-usual appointment bookings for influenza vaccines as clinics open autumn campaigns earlier than in prior years.',
      'Officials say the shift is partly preventive: last season’s late surge strained pediatric wards in several regions, prompting pharmacies to expand walk-in hours for families.',
      'Updated formulations aim to match recently circulating strains, though researchers note that effectiveness varies year to year and should not replace other respiratory precautions.',
      'Employers are again offering on-site vaccination drives, with logistics firms and schools among the sectors moving dates forward to cover shift workers.',
      'Doctors emphasized that high-risk groups—including older adults and people with chronic lung disease—benefit most from vaccination before holiday travel peaks.',
    ],
  }),
  buildArticle({
    title: 'Campaigns Adjust Ad Strategies After New Platform Transparency Rules',
    category: 'politics',
    publishedAt: '2026-09-22T15:50:00.000Z',
    image: '/images/gap-fillers/politics.jpg',
    body: [
      'Political committees in several U.S. states rewrote digital ad plans this week after platforms began enforcing stricter labels on synthetic media and micro-targeted fundraising appeals.',
      'Consultants said smaller campaigns feel the changes most acutely because they rely on low-cost social placements to reach donors outside traditional media markets.',
      'Election administrators welcomed clearer ad libraries but asked for faster takedowns when impersonation clips circulate near registration deadlines.',
      'Lawmakers debating follow-on legislation disagree over whether disclosure requirements should apply equally to issue-advocacy groups and candidate committees.',
      'Analysts expect spending to shift toward email and text programs while teams test how automated creative tools comply with new certification steps.',
    ],
  }),
  buildArticle({
    title: 'European Football: Title Race Tightens After Weekend Upsets',
    category: 'sports',
    publishedAt: '2026-09-21T19:10:00.000Z',
    image: '/images/gap-fillers/sports.jpg',
    body: [
      'Unexpected results across top European leagues reshuffled early-season standings, with two preseason favorites dropping points at home against promoted sides.',
      'Managers cited fixture congestion and international break fatigue as factors, though statisticians noted finishing quality—not chance creation—separated winners from draw specialists.',
      'Transfer-window departures continued to ripple through squads, with at least one club confirming a long-term injury to a key midfielder picked up on national-team duty.',
      'Television audiences for Sunday’s marquee match hit a three-year high in several markets, driven by a late comeback and debate over a disputed penalty decision.',
      'Supporters’ groups used the weekend to renew calls for tighter scheduling rules, arguing that midweek travel compresses recovery time for players under 23.',
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

console.log(`Added ${fillers.length} gap-filler articles (Sep 21–27):`);
for (const a of fillers.sort((x, y) => new Date(y.publishedAt) - new Date(x.publishedAt))) {
  console.log(`  ${a.publishedAt.slice(0, 10)}  ${a.title.slice(0, 60)}…`);
}
