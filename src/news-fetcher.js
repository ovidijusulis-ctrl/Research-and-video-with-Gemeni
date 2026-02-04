/**
 * Ovi English School - News Fetcher
 * Fetches news from RSS feeds (completely free)
 */

const Parser = require('rss-parser');
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'OviEnglishSchool/1.0'
  }
});

// Free RSS feeds for news
const RSS_FEEDS = {
  english: [
    { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best' }
  ],
  spanish: [
    { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' },
    { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' }
  ]
};

/**
 * Fetch news from a single RSS feed
 */
async function fetchFromFeed(feedInfo) {
  try {
    console.log(`  📡 Fetching from ${feedInfo.name}...`);
    const feed = await parser.parseURL(feedInfo.url);

    return feed.items.slice(0, 5).map(item => ({
      title: item.title,
      summary: item.contentSnippet || item.content || '',
      link: item.link,
      date: item.pubDate,
      source: feedInfo.name
    }));
  } catch (error) {
    console.log(`  ⚠️  Failed to fetch from ${feedInfo.name}: ${error.message}`);
    return [];
  }
}

/**
 * Fetch news from all feeds and deduplicate
 */
async function fetchAllNews(language = 'english') {
  console.log(`\n📰 Fetching ${language} news...`);

  const feeds = RSS_FEEDS[language] || RSS_FEEDS.english;
  const allStories = [];

  for (const feed of feeds) {
    const stories = await fetchFromFeed(feed);
    allStories.push(...stories);
  }

  // Simple deduplication by title similarity
  const seen = new Set();
  const unique = allStories.filter(story => {
    const key = story.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`✅ Found ${unique.length} unique stories\n`);
  return unique;
}

/**
 * Select best stories for the episode
 */
function selectBestStories(stories, count = 1) {
  // Prefer stories with good summaries
  const scored = stories.map(s => ({
    ...s,
    score: (s.summary?.length || 0) + (s.title?.length || 0)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count);
}

/**
 * Main function - fetch and select news
 */
async function getNewsForEpisode(language = 'english') {
  const allNews = await fetchAllNews(language);

  if (allNews.length === 0) {
    // Fallback sample story if feeds fail
    console.log('⚠️  Using fallback story...');
    return [{
      title: 'Technology Changes How We Learn Languages',
      summary: 'New apps and AI tools are helping millions of people learn new languages. Experts say technology makes learning faster and more fun. Many schools now use apps in their classrooms.',
      source: 'Sample',
      date: new Date().toISOString()
    }];
  }

  const selected = selectBestStories(allNews, 1);

  console.log('📌 Selected story:');
  console.log(`   "${selected[0].title}"`);
  console.log(`   Source: ${selected[0].source}\n`);

  return selected;
}

// Export for use in other modules
module.exports = { getNewsForEpisode, fetchAllNews, selectBestStories };

// Run directly for testing
if (require.main === module) {
  getNewsForEpisode('english').then(stories => {
    console.log('\n📋 Full story data:');
    console.log(JSON.stringify(stories, null, 2));
  });
}
