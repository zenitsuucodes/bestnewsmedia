const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
  'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
  'see', 'two', 'way', 'who', 'boy', 'did', 'let', 'put', 'say', 'she', 'too', 'use', 'with',
  'that', 'this', 'from', 'they', 'will', 'been', 'have', 'were', 'said', 'each', 'which',
  'their', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many',
  'over', 'such', 'take', 'than', 'them', 'well', 'only', 'year', 'your', 'about', 'after',
  'again', 'being', 'could', 'first', 'into', 'more', 'other', 'some', 'then', 'there',
  'these', 'think', 'those', 'through', 'under', 'where', 'while', 'would', 'says', 'amid',
  'against', 'between', 'during', 'before', 'without', 'within', 'across', 'around', 'back',
  'still', 'also', 'even', 'most', 'much', 'must', 'should', 'might', 'every', 'own', 'same',
  'last', 'next', 'big', 'top', 'win', 'wins', 'loss', 'draw', 'live', 'hold', 'holds',
]);

const CATEGORY_TERMS = {
  world: 'world international',
  tech: 'technology computer digital',
  business: 'business economy finance',
  science: 'science research laboratory',
  health: 'health medical healthcare',
  animals: 'animals wildlife nature',
  sports: 'sports athletics',
  entertainment: 'entertainment film music',
  politics: 'politics government election',
};

function uniqueWords(words) {
  const seen = new Set();
  return words.filter((w) => {
    const key = w.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function extractKeywords(title, excerpt = '', category = '') {
  const proper = (title.match(/\b[A-Z][a-z]+(?:[''][a-z]+)?\b/g) || [])
    .map((w) => w.replace(/['']/g, ''))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));

  const titleWords = title
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const excerptWords = excerpt
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP_WORDS.has(w));

  const combined = uniqueWords([...proper, ...titleWords, ...excerptWords]);
  const categoryHint = (CATEGORY_TERMS[category] || category).split(' ')[0];

  if (combined.length < 2 && categoryHint) combined.push(categoryHint);

  const named = proper.slice(0, 4);
  const primaryTerms = named.length >= 2 ? named : combined.slice(0, 4);
  const imageTags = combined.slice(0, 6);

  return {
    primary: primaryTerms.join(' '),
    tags: imageTags.join(','),
    category: categoryHint,
  };
}
