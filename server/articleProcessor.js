import crypto from 'crypto';

const SOURCE_PATTERNS = [
  /\b(BBC|Reuters|AP|AFP|CNN|Fox News|The Guardian|The New York Times|Washington Post|Bloomberg|NPR|Sky News|Al Jazeera|Associated Press)\b/gi,
  /\b(according to|reported by|reports from|as reported by|via)\s+[A-Z][\w\s&]+/gi,
  /Read more at .+$/gim,
  /Source:\s*.+$/gim,
  /Image (credit|source):\s*.+$/gim,
];

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanText(text = '') {
  let cleaned = text;
  for (const pattern of SOURCE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

function buildBody(rawHtml, snippet) {
  const fromHtml = stripHtml(rawHtml);
  const base = cleanText(fromHtml || snippet || '');

  if (base.length >= 400) {
    return paragraphize(base);
  }

  const expanded = [
    base,
    'Officials and experts continue to monitor developments closely as the situation unfolds. Communities affected by the story are watching for further updates in the days ahead.',
    'Analysts say the implications could extend well beyond the immediate headlines, with policymakers and industry leaders expected to respond in the coming weeks.',
    'Readers following this story should check back for the latest details as new information becomes available.',
  ].join(' ');

  return paragraphize(expanded);
}

function paragraphize(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs = [];
  let current = [];

  for (const sentence of sentences) {
    current.push(sentence.trim());
    if (current.join(' ').length > 280) {
      paragraphs.push(current.join(' '));
      current = [];
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs.filter(Boolean);
}

function makeId(title, link) {
  return crypto.createHash('md5').update(`${title}|${link}`).digest('hex').slice(0, 12);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

export function processFeedItem(item, category) {
  const title = cleanText(item.title || 'Untitled Story');
  const rawContent = item['content:encoded'] || item.content || item.summary || item.contentSnippet || '';
  const snippet = cleanText(stripHtml(item.contentSnippet || item.summary || ''));
  const body = buildBody(rawContent, snippet);
  const published = item.isoDate || item.pubDate || new Date().toISOString();
  const id = makeId(title, item.link || title);

  return {
    id,
    title,
    excerpt: snippet.slice(0, 220) + (snippet.length > 220 ? '…' : ''),
    body,
    category,
    image: null,
    author: 'Best News Media Staff',
    publishedAt: new Date(published).toISOString(),
    readTime: estimateReadTime(body),
  };
}
