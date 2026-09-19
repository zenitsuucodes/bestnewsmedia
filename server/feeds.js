export const CATEGORIES = [
  { id: 'world', label: 'World', slug: 'world' },
  { id: 'tech', label: 'Technology', slug: 'technology' },
  { id: 'business', label: 'Business', slug: 'business' },
  { id: 'science', label: 'Science', slug: 'science' },
  { id: 'health', label: 'Health', slug: 'health' },
  { id: 'animals', label: 'Animals & Nature', slug: 'animals-nature' },
  { id: 'sports', label: 'Sports', slug: 'sports' },
  { id: 'entertainment', label: 'Entertainment', slug: 'entertainment' },
  { id: 'politics', label: 'Politics', slug: 'politics' },
];

export const ARTICLES_PER_CATEGORY = 100;
export const ITEMS_PER_FEED = 60;

export const FEED_SOURCES = {
  world: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.theguardian.com/world/rss',
    'https://feeds.npr.org/1004/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
    'https://feeds.bbci.co.uk/news/world/asia/rss.xml',
  ],
  tech: [
    'https://feeds.arstechnica.com/arstechnica/index',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
    'https://feeds.feedburner.com/TechCrunch',
    'https://www.engadget.com/rss.xml',
  ],
  business: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.theguardian.com/business/rss',
    'https://feeds.npr.org/1019/rss.xml',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  ],
  science: [
    'https://www.sciencedaily.com/rss/all.xml',
    'https://www.sciencedaily.com/rss/space_time.xml',
    'https://www.sciencedaily.com/rss/fossils_ruins.xml',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://www.theguardian.com/science/rss',
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
  ],
  health: [
    'https://feeds.bbci.co.uk/news/health/rss.xml',
    'https://www.theguardian.com/society/rss',
    'https://www.medicalnewstoday.com/rss',
    'https://www.sciencedaily.com/rss/health_medicine.xml',
    'https://feeds.npr.org/1128/rss.xml',
    'https://www.sciencedaily.com/rss/mind_brain.xml',
  ],
  animals: [
    'https://www.nationalgeographic.com/animals/rss',
    'https://www.theguardian.com/environment/rss',
    'https://www.sciencedaily.com/rss/plants_animals.xml',
    'https://www.sciencedaily.com/rss/earth_climate.xml',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  ],
  sports: [
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://www.theguardian.com/sport/rss',
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://feeds.bbci.co.uk/sport/cricket/rss.xml',
    'https://feeds.bbci.co.uk/sport/formula1/rss.xml',
  ],
  entertainment: [
    'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    'https://www.theguardian.com/film/rss',
    'https://www.theguardian.com/music/rss',
    'https://www.theguardian.com/tv-and-radio/rss',
    'https://www.theguardian.com/culture/rss',
    'https://www.theguardian.com/stage/rss',
  ],
  politics: [
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://www.theguardian.com/politics/rss',
    'https://feeds.npr.org/1014/rss.xml',
    'https://www.theguardian.com/us-news/rss',
  ],
};
