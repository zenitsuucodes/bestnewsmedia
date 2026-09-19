const BLOCKED_HOSTS = [
  'bbc.co.uk', 'bbci.co.uk', 'theguardian.com', 'guim.co.uk', 'cnn.com',
  'foxnews.com', 'reuters.com', 'nytimes.com', 'washingtonpost.com',
  'telegraph.co.uk', 'dailymail.co.uk', 'skysports.com', 'espn.com',
  'theverge.com', 'arstechnica.com', 'indianexpress.com', '365dm.com',
  'gettyimages.com', 'gettyimages', 'shutterstock.com', 'alamy.com',
  'apnews.com', 'nbcnews.com', 'cbsnews.com', 'msn.com', 'news.com',
  'newsweek.com', 'huffpost.com', 'buzzfeed.com', 'mirror.co.uk',
  'express.co.uk', 'standard.co.uk', 'independent.co.uk', 'forbes.com',
  'businessinsider.com', 'techcrunch.com', 'wired.com', 'politico.com',
  'coventrytelegraph', 'thesun.co.uk', 'metro.co.uk',
  'nyt.com', 'nytimes.com', 'licdn.com', 'linkedin.com',
  'inc.com', 'img-cdn.inc.com', 'akamaized.net', 'msn.com',
];

const BLOCKED_PATH = /logo|watermark|sprite|favicon|icon-|\/ads\//i;

let lastSearch = 0;
const MIN_INTERVAL = 350;

async function throttle() {
  const wait = Math.max(0, MIN_INTERVAL - (Date.now() - lastSearch));
  if (wait) await new Promise((r) => setTimeout(r, wait));
  lastSearch = Date.now();
}

function isBlockedUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (BLOCKED_PATH.test(lower)) return true;
  return BLOCKED_HOSTS.some((host) => lower.includes(host));
}

async function fetchVqd(query) {
  const pageUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const res = await fetch(pageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;

  const html = await res.text();
  return html.match(/vqd=["']([^"']+)["']/)?.[1]
    || html.match(/vqd=([\d-]+)/)?.[1]
    || null;
}

export async function searchWebImages(query, limit = 8) {
  if (!query?.trim()) return [];

  await throttle();

  try {
    const vqd = await fetchVqd(query);
    if (!vqd) return [];

    const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://duckduckgo.com/',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || [])
      .map((r) => r.image)
      .filter((url) => url && !isBlockedUrl(url))
      .slice(0, limit);
  } catch {
    return [];
  }
}
