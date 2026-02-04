/**
 * Metadata Generator for Ovi English School
 * Auto-generates titles, descriptions, tags for all platforms
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate metadata for all platforms from episode content
 */
function generateMetadata(episode) {
  const { date, level, topic, vocabulary = [], newsSource } = episode;

  const formattedDate = formatDate(date);
  const vocabList = vocabulary.slice(0, 5).join(', ');

  return {
    // YouTube metadata
    youtube: {
      title: `${formattedDate} - Daily English Lesson | ${capitalize(level)} | Ovi English School`,
      description: `🎓 Learn English with real news!\n\n` +
        `📰 Today's Topic: ${topic}\n` +
        `📚 Level: ${capitalize(level)} (${getLevelCEFR(level)})\n` +
        `📝 Vocabulary: ${vocabList}\n\n` +
        `In this episode:\n` +
        `• Real news story adapted for English learners\n` +
        `• Key vocabulary with definitions\n` +
        `• Clear pronunciation at ${level === 'beginner' ? 'slower' : 'natural'} pace\n\n` +
        `🔔 Subscribe for daily English lessons!\n` +
        `📱 Available on Spotify & Apple Podcasts\n\n` +
        `#EnglishLearning #LearnEnglish #ESL #IELTS #TOEFL`,
      tags: [
        'English learning', 'Learn English', 'ESL', 'English lesson',
        'English vocabulary', 'English listening', 'IELTS', 'TOEFL',
        `${level} English`, 'news English', 'Ovi English School',
        ...vocabulary.slice(0, 5)
      ],
      category: 27, // Education category ID
      privacy: 'public'
    },

    // Podcast/RSS metadata
    podcast: {
      title: `Daily English Lesson - ${formattedDate}`,
      description: `Learn English with today's news! ` +
        `This ${level}-level episode covers: ${topic}. ` +
        `Vocabulary focus: ${vocabList}. ` +
        `Perfect for ${getLevelCEFR(level)} learners.`,
      keywords: ['English learning', 'ESL', level, 'vocabulary', 'news']
    },

    // Social media snippets
    social: {
      twitter: `🎓 New English lesson! Learn "${vocabulary[0] || 'new words'}" and more.\n` +
        `📰 Topic: ${topic}\n` +
        `🎧 Listen now: [LINK]\n` +
        `#LearnEnglish #ESL`,

      instagram: `📚 Daily English Lesson\n\n` +
        `Today's vocabulary:\n` +
        vocabulary.slice(0, 5).map(v => `• ${v}`).join('\n') + `\n\n` +
        `🎧 Full lesson in bio!\n\n` +
        `#englishlearning #learnenglish #esl #vocabulary #englishteacher`
    },

    // File naming
    files: {
      audio: `ovi-english-${level}-${date}.mp3`,
      audioSlow: `ovi-english-${level}-slow-${date}.mp3`,
      video: `ovi-english-${level}-${date}.mp4`,
      transcript: `ovi-english-${level}-${date}-transcript.md`,
      worksheet: `ovi-english-${level}-${date}-worksheet.docx`
    }
  };
}

/**
 * Helper functions
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getLevelCEFR(level) {
  const levels = {
    beginner: 'A1-A2',
    intermediate: 'B1-B2',
    advanced: 'C1-C2'
  };
  return levels[level] || 'A1-A2';
}

/**
 * Save metadata to JSON file
 */
function saveMetadata(outputDir, episode) {
  const metadata = generateMetadata(episode);
  const metadataPath = path.join(outputDir, `metadata-${episode.date}.json`);

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Metadata saved: ${metadataPath}`);

  return metadata;
}

/**
 * Load episode info and generate metadata
 */
function generateFromScript(scriptPath) {
  const script = fs.readFileSync(scriptPath, 'utf8');

  // Extract info from script
  const episode = {
    date: new Date().toISOString().split('T')[0],
    level: 'beginner',
    topic: extractTopic(script),
    vocabulary: extractVocabulary(script),
    newsSource: 'BBC/NPR/Reuters'
  };

  return generateMetadata(episode);
}

function extractTopic(script) {
  // Try to find topic in script
  const lines = script.split('\n').filter(l => l.trim());
  for (const line of lines) {
    if (line.toLowerCase().includes('today') && line.length < 100) {
      return line.replace(/^[#\-*\s]+/, '').trim();
    }
  }
  return 'Current Events & Vocabulary';
}

function extractVocabulary(script) {
  // Look for vocabulary section
  const vocabMatch = script.match(/vocabulary[:\s]*([\s\S]*?)(?:\n\n|\n#|$)/i);
  if (vocabMatch) {
    const words = vocabMatch[1].match(/\b[A-Z][a-z]+\b/g) || [];
    return [...new Set(words)].slice(0, 10);
  }
  return ['vocabulary', 'grammar', 'pronunciation'];
}

module.exports = {
  generateMetadata,
  saveMetadata,
  generateFromScript
};

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === '--demo') {
    const demo = generateMetadata({
      date: new Date().toISOString().split('T')[0],
      level: 'beginner',
      topic: 'Climate Change and Environmental Action',
      vocabulary: ['remarkable', 'sustainable', 'initiative', 'carbon', 'renewable'],
      newsSource: 'BBC'
    });

    console.log('\n📋 Generated Metadata:\n');
    console.log('YOUTUBE:');
    console.log(`  Title: ${demo.youtube.title}`);
    console.log(`  Tags: ${demo.youtube.tags.slice(0, 5).join(', ')}...`);
    console.log('\nPODCAST:');
    console.log(`  Title: ${demo.podcast.title}`);
    console.log('\nSOCIAL:');
    console.log(`  Twitter: ${demo.social.twitter.split('\n')[0]}...`);
  } else {
    console.log('Usage: node metadata-generator.js --demo');
  }
}
