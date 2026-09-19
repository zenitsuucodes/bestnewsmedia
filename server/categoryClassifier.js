const CATEGORY_KEYWORDS = {
  sports: [
    'football', 'soccer', 'cricket', 'tennis', 'golf', 'rugby', 'basketball', 'nba', 'nfl',
    'mlb', 'premier league', 'champions league', 'olympic', 'world cup', 'match', 'goal',
    'coach', 'stadium', 'f1', 'formula', 'athlete', 'tournament', 'wimbledon', 'ufc',
    'boxing', 'marathon', 'cycling', 'arsenal', 'chelsea', 'liverpool', 'manchester',
    'everton', 'tottenham', 'spurs', 'villa', 'forest', 'brighton', 'coventry', 'wsl',
    'holmberg', 'arteta', 'mcilroy', 'pga', 'buttler', 't20', 'rugby', 'grand prix',
  ],
  tech: [
    'ai', 'artificial intelligence', 'software', 'apple', 'google', 'microsoft', 'meta',
    'facebook', 'iphone', 'android', 'chip', 'semiconductor', 'cyber', 'hack', 'startup',
    'robot', 'machine learning', 'openai', 'chatgpt', 'app', 'cloud', 'data breach',
    'crypto', 'bitcoin', 'smartphone', 'tesla', 'spacex', 'nasa rocket',
  ],
  business: [
    'market', 'stock', 'shares', 'economy', 'inflation', 'bank', 'trade', 'tariff',
    'company', 'ceo', 'profit', 'revenue', 'investment', 'investor', 'wall street',
    'nasdaq', 'dow', 'interest rate', 'fed', 'central bank', 'merger', 'acquisition',
    'startup funding', 'earnings', 'billion', 'million deal',
  ],
  science: [
    'research', 'study', 'scientist', 'laboratory', 'space', 'nasa', 'telescope',
    'climate', 'carbon', 'species', 'discovery', 'experiment', 'physics', 'chemistry',
    'biology', 'genome', 'vaccine research', 'asteroid', 'planet', 'quantum',
  ],
  health: [
    'health', 'hospital', 'doctor', 'patient', 'disease', 'cancer', 'virus', 'vaccine',
    'treatment', 'drug', 'medicine', 'mental health', 'surgery', 'symptom', 'diagnosis',
    'who', 'medical', 'clinical', 'therapy', 'diet', 'nutrition', 'fitness',
  ],
  animals: [
    'animal', 'wildlife', 'species', 'bird', 'dog', 'cat', 'elephant', 'whale', 'dolphin',
    'tiger', 'lion', 'bear', 'wolf', 'shark', 'penguin', 'zoo', 'habitat', 'endangered',
    'conservation', 'forest', 'ocean life', 'insect', 'butterfly', 'reptile',
  ],
  entertainment: [
    'film', 'movie', 'cinema', 'actor', 'actress', 'hollywood', 'music', 'album', 'concert',
    'tv', 'television', 'series', 'netflix', 'celebrity', 'award', 'oscar', 'grammy',
    'festival', 'theatre', 'broadway', 'box office', 'streaming',
  ],
  politics: [
    'election', 'parliament', 'congress', 'senate', 'president', 'minister', 'prime minister',
    'government', 'policy', 'vote', 'voter', 'democrat', 'republican', 'labour', 'conservative',
    'reform uk', 'white house', 'downing street', 'legislation', 'diplomat', 'sanction',
    'trump', 'biden', 'starmer', 'putin',
  ],
  world: [
    'war', 'conflict', 'un', 'nato', 'gaza', 'ukraine', 'israel', 'china', 'europe',
    'africa', 'asia', 'refugee', 'earthquake', 'flood', 'hurricane', 'diplomacy',
    'embassy', 'foreign', 'international', 'border', 'humanitarian',
  ],
};

const FEED_BOOST = 6;
const TITLE_WEIGHT = 4;
const EXCERPT_WEIGHT = 1;

function normalize(text = '') {
  return text.toLowerCase().replace(/[^\w\s'-]/g, ' ');
}

function scoreCategory(text, categoryId) {
  const keywords = CATEGORY_KEYWORDS[categoryId] || [];
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

export function classifyArticle(title, excerpt = '', feedCategory = '') {
  const titleText = normalize(title);
  const excerptText = normalize(excerpt);
  const combined = `${titleText} ${excerptText}`;

  let bestCategory = feedCategory || 'world';
  let bestScore = -1;

  for (const categoryId of Object.keys(CATEGORY_KEYWORDS)) {
    let score = 0;
    score += scoreCategory(titleText, categoryId) * TITLE_WEIGHT;
    score += scoreCategory(excerptText, categoryId) * EXCERPT_WEIGHT;
    if (feedCategory === categoryId) score += FEED_BOOST;

    if (score > bestScore) {
      bestScore = score;
      bestCategory = categoryId;
    }
  }

  if (bestScore <= 0 && feedCategory) return feedCategory;
  return bestCategory;
}
