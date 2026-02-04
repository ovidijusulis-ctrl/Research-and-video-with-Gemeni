#!/usr/bin/env node
/**
 * Publisher - Full publishing pipeline
 * Converts audio → video → uploads to YouTube → updates RSS feed
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { uploadVideo } = require('./youtube-uploader');
const { scanEpisodes, saveFeed } = require('./rss-generator');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

/**
 * Run Python script
 */
function runPython(script, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', [script, ...args], {
      cwd: path.join(__dirname, '..')
    });

    let output = '';
    proc.stdout.on('data', d => { output += d; process.stdout.write(d); });
    proc.stderr.on('data', d => process.stderr.write(d));
    proc.on('close', code => code === 0 ? resolve(output) : reject(new Error(`Exit ${code}`)));
  });
}

/**
 * Find latest episode
 */
function findLatestEpisode() {
  const dirs = fs.readdirSync(OUTPUT_DIR)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  if (dirs.length === 0) return null;

  const latestDir = path.join(OUTPUT_DIR, dirs[0]);
  const files = fs.readdirSync(latestDir);
  const audioFile = files.find(f => f.endsWith('.mp3') && !f.includes('-slow'));

  if (!audioFile) return null;

  return {
    date: dirs[0],
    dir: latestDir,
    audioPath: path.join(latestDir, audioFile),
    audioFile
  };
}

/**
 * Main publish flow
 */
async function publish(options = {}) {
  console.log('\n🚀 Starting publish pipeline...\n');

  // Find latest episode
  const episode = findLatestEpisode();
  if (!episode) {
    console.log('❌ No episodes found in output directory');
    return;
  }

  console.log(`📅 Latest episode: ${episode.date}`);
  console.log(`🎵 Audio: ${episode.audioFile}\n`);

  // Step 1: Convert to video
  console.log('━'.repeat(50));
  console.log('STEP 1: Convert audio to video');
  console.log('━'.repeat(50));

  const videoPath = episode.audioPath.replace('.mp3', '.mp4');

  if (fs.existsSync(videoPath) && !options.force) {
    console.log('✅ Video already exists, skipping conversion');
  } else {
    try {
      await runPython(
        path.join(__dirname, 'video-converter.py'),
        [episode.audioPath, '-o', videoPath]
      );
    } catch (err) {
      console.log('⚠️  Video conversion failed:', err.message);
      console.log('   Make sure FFmpeg is installed');
      if (!options.skipErrors) return;
    }
  }

  // Step 2: Upload to YouTube (if enabled)
  if (options.youtube !== false) {
    console.log('\n' + '━'.repeat(50));
    console.log('STEP 2: Upload to YouTube');
    console.log('━'.repeat(50));

    if (!fs.existsSync(videoPath)) {
      console.log('⚠️  No video file, skipping YouTube upload');
    } else {
      const title = `Daily English Lesson - ${formatDate(episode.date)} | Ovi English School`;
      const result = await uploadVideo(videoPath, { title });

      if (result.success) {
        // Save YouTube URL for reference
        fs.writeFileSync(
          path.join(episode.dir, 'youtube-url.txt'),
          result.url
        );
      }
    }
  } else {
    console.log('\n⏭️  Skipping YouTube upload (--no-youtube)');
  }

  // Step 3: Update RSS feed
  console.log('\n' + '━'.repeat(50));
  console.log('STEP 3: Update RSS feed');
  console.log('━'.repeat(50));

  const episodes = scanEpisodes(OUTPUT_DIR);
  const feedPath = path.join(__dirname, '..', 'feed.xml');
  saveFeed(feedPath, episodes);

  // Summary
  console.log('\n' + '━'.repeat(50));
  console.log('✅ PUBLISH COMPLETE');
  console.log('━'.repeat(50));
  console.log(`   Episode: ${episode.date}`);
  console.log(`   Video: ${fs.existsSync(videoPath) ? '✅' : '❌'}`);
  console.log(`   RSS Feed: ✅ (${episodes.length} episodes)`);
  console.log('');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    youtube: !args.includes('--no-youtube'),
    force: args.includes('--force'),
    skipErrors: args.includes('--skip-errors')
  };

  if (args.includes('--help')) {
    console.log(`
Publisher - Ovi English School

Usage: npm run publish [options]

Options:
  --no-youtube   Skip YouTube upload
  --force        Re-convert video even if exists
  --skip-errors  Continue on errors
  --help         Show this help
    `);
  } else {
    publish(options).catch(console.error);
  }
}

module.exports = { publish };
