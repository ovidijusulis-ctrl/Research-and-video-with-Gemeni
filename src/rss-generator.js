/**
 * RSS Feed Generator for Podcast Distribution
 * Generates valid RSS 2.0 feed with iTunes/Spotify podcast extensions
 *
 * Usage:
 * 1. Host your audio files somewhere (S3, your server, etc.)
 * 2. Update PODCAST_CONFIG with your details
 * 3. Run this to generate feed.xml
 * 4. Submit feed URL to Spotify, Apple, etc.
 */

const fs = require('fs');
const path = require('path');

// Podcast configuration - UPDATE THESE
const PODCAST_CONFIG = {
  title: 'Ovi English School',
  description: 'Learn English with real news! Daily episodes adapted for English learners at all levels. Improve your vocabulary, listening, and comprehension with current events.',
  author: 'Ovi English School',
  email: 'ovidijusulis@googlemail.com',
  website: 'https://media.rss.com/ovi-english-school/feed.xml', // RSS.com feed
  language: 'en',
  category: 'Education',
  subcategory: 'Language Learning',
  explicit: false,
  image: 'https://ovienglishschool.com/podcast-cover.jpg', // 3000x3000 recommended

  // Base URL where audio files are hosted
  audioBaseUrl: 'https://ovienglishschool.com/episodes/'
};

/**
 * Generate RSS feed from episodes
 */
function generateFeed(episodes, config = PODCAST_CONFIG) {
  const now = new Date().toUTCString();

  const episodeItems = episodes.map(ep => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description><![CDATA[${ep.description}]]></description>
      <pubDate>${new Date(ep.date).toUTCString()}</pubDate>
      <enclosure url="${ep.audioUrl}" length="${ep.fileSize || 0}" type="audio/mpeg"/>
      <guid isPermaLink="false">${ep.id || ep.audioUrl}</guid>
      <itunes:duration>${ep.duration || '00:10:00'}</itunes:duration>
      <itunes:episode>${ep.episodeNumber || 1}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>${config.explicit ? 'yes' : 'no'}</itunes:explicit>
      ${ep.transcript ? `<podcast:transcript url="${ep.transcript}" type="text/plain"/>` : ''}
    </item>`).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:podcast="https://podcastindex.org/namespace/1.0"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <description><![CDATA[${config.description}]]></description>
    <link>${config.website}</link>
    <language>${config.language}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <atom:link href="${config.website}/feed.xml" rel="self" type="application/rss+xml"/>

    <!-- iTunes/Apple Podcasts tags -->
    <itunes:author>${escapeXml(config.author)}</itunes:author>
    <itunes:summary><![CDATA[${config.description}]]></itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>${escapeXml(config.author)}</itunes:name>
      <itunes:email>${config.email}</itunes:email>
    </itunes:owner>
    <itunes:explicit>${config.explicit ? 'yes' : 'no'}</itunes:explicit>
    <itunes:category text="${config.category}">
      <itunes:category text="${config.subcategory}"/>
    </itunes:category>
    <itunes:image href="${config.image}"/>

    <!-- Podcast 2.0 tags -->
    <podcast:locked>no</podcast:locked>

    <!-- Episodes -->
    ${episodeItems}
  </channel>
</rss>`;

  return feed;
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Scan output directory and build episode list
 */
function scanEpisodes(outputDir, baseUrl = PODCAST_CONFIG.audioBaseUrl) {
  const episodes = [];

  if (!fs.existsSync(outputDir)) {
    console.log('⚠️  Output directory not found:', outputDir);
    return episodes;
  }

  // Get all date directories
  const dateDirs = fs.readdirSync(outputDir)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse(); // Most recent first

  let episodeNum = dateDirs.length;

  for (const dateDir of dateDirs) {
    const fullPath = path.join(outputDir, dateDir);
    const files = fs.readdirSync(fullPath);

    // Find main audio file (not slow version)
    const audioFile = files.find(f =>
      f.endsWith('.mp3') && !f.includes('-slow')
    );

    if (audioFile) {
      const audioPath = path.join(fullPath, audioFile);
      const stats = fs.statSync(audioPath);

      // Look for transcript
      const transcriptFile = files.find(f => f.endsWith('-transcript.md'));

      episodes.push({
        id: `ovi-english-${dateDir}`,
        title: `Daily English Lesson - ${formatDate(dateDir)}`,
        description: `Learn English with today's news! This episode covers current events adapted for English learners. Perfect for improving vocabulary and listening comprehension.`,
        date: dateDir,
        audioUrl: `${baseUrl}${dateDir}/${audioFile}`,
        fileSize: stats.size,
        duration: '00:10:00', // Estimate - could calculate from audio
        episodeNumber: episodeNum--,
        transcript: transcriptFile ? `${baseUrl}${dateDir}/${transcriptFile}` : null
      });
    }
  }

  return episodes;
}

/**
 * Format date nicely
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Save feed to file
 */
function saveFeed(outputPath, episodes, config = PODCAST_CONFIG) {
  const feed = generateFeed(episodes, config);
  fs.writeFileSync(outputPath, feed);
  console.log(`✅ RSS feed saved: ${outputPath}`);
  console.log(`   Episodes: ${episodes.length}`);
  return outputPath;
}

module.exports = {
  generateFeed,
  scanEpisodes,
  saveFeed,
  PODCAST_CONFIG
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const outputDir = args[0] || path.join(__dirname, '..', 'output');
  const feedPath = args[1] || path.join(__dirname, '..', 'feed.xml');

  console.log('\n📡 Generating podcast RSS feed...');
  console.log(`   Scanning: ${outputDir}`);

  const episodes = scanEpisodes(outputDir);

  if (episodes.length === 0) {
    console.log('\n⚠️  No episodes found. Creating sample feed...');
    // Create sample episode for testing
    episodes.push({
      id: 'sample-episode',
      title: 'Welcome to Ovi English School',
      description: 'Welcome to Ovi English School! Learn English with real news, adapted for learners at all levels.',
      date: new Date().toISOString().split('T')[0],
      audioUrl: 'https://example.com/welcome.mp3',
      fileSize: 5000000,
      duration: '00:05:00',
      episodeNumber: 1
    });
  }

  saveFeed(feedPath, episodes);

  console.log('\n📋 Next steps:');
  console.log('   1. Host your audio files at:', PODCAST_CONFIG.audioBaseUrl);
  console.log('   2. Host this feed.xml at:', PODCAST_CONFIG.website + '/feed.xml');
  console.log('   3. Submit feed to:');
  console.log('      - Spotify: podcasters.spotify.com');
  console.log('      - Apple: podcastsconnect.apple.com');
  console.log('      - Google: podcastsmanager.google.com');
}
