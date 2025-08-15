const Parser = require('rss-parser');
const parser = new Parser();

// Simple in-memory cache
let CACHE = { items: [], ts: 0 };
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const SOURCES = [
  // NYTimes Books
  'https://rss.nytimes.com/services/xml/rss/nyt/Books.xml',
  // The Guardian Books
  'https://www.theguardian.com/books/rss',
  // Publishers Weekly News
  'https://www.publishersweekly.com/pw/feeds/index.xml'
];

async function fetchAllFeeds() {
  const results = await Promise.allSettled(SOURCES.map((u) => parser.parseURL(u)));
  const items = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value?.items) {
      for (const it of r.value.items) {
        items.push({
          id: it.guid || it.id || it.link,
          title: it.title || 'Untitled',
          link: it.link,
          isoDate: it.isoDate || it.pubDate,
          pubDate: it.pubDate || it.isoDate,
          contentSnippet: it.contentSnippet || it.content || '',
          source: r.value.title || r.value.feedUrl,
        });
      }
    }
  }
  // sort by date desc
  items.sort((a, b) => new Date(b.isoDate || b.pubDate || 0) - new Date(a.isoDate || a.pubDate || 0));
  // limit
  return items.slice(0, 24);
}

const getBooksNews = async (req, res) => {
  try {
    const now = Date.now();
    if (now - CACHE.ts < TTL_MS && CACHE.items.length) {
      return res.json({ items: CACHE.items, cached: true });
    }
    const items = await fetchAllFeeds();
    CACHE = { items, ts: now };
    return res.json({ items, cached: false });
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ message: 'Failed to fetch news' });
  }
};

module.exports = { getBooksNews };
