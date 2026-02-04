/**
 * YouTube Uploader Module
 * Uploads videos to YouTube using Data API v3
 *
 * Setup required:
 * 1. Create project at console.cloud.google.com
 * 2. Enable YouTube Data API v3
 * 3. Create OAuth 2.0 credentials (Desktop app)
 * 4. Download credentials as client_secret.json
 * 5. Place client_secret.json in project root
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = path.join(__dirname, '..', 'youtube_token.json');
const CLIENT_SECRET_PATH = path.join(__dirname, '..', 'client_secret.json');

/**
 * Load client secrets and authorize
 */
async function authorize() {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(`
      client_secret.json not found!

      To set up YouTube uploads:
      1. Go to console.cloud.google.com
      2. Create a new project (or select existing)
      3. Enable "YouTube Data API v3"
      4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
      5. Choose "Desktop app"
      6. Download the JSON and save as client_secret.json in project root
    `);
  }

  const credentials = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check for existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(token);
    return oauth2Client;
  }

  // Get new token
  return getNewToken(oauth2Client);
}

/**
 * Get new OAuth token via command line
 */
function getNewToken(oauth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    console.log('\n🔐 Authorize this app by visiting:\n');
    console.log(authUrl);
    console.log('\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter the authorization code: ', (code) => {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(new Error('Error retrieving access token: ' + err));
          return;
        }
        oauth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('✅ Token saved to', TOKEN_PATH);
        resolve(oauth2Client);
      });
    });
  });
}

/**
 * Upload video to YouTube
 */
async function uploadVideo(videoPath, metadata) {
  const auth = await authorize();
  const youtube = google.youtube({ version: 'v3', auth });

  const defaultMetadata = {
    title: 'Ovi English School - Daily Lesson',
    description: `Learn English with real news! 🎓

This episode covers today's top stories adapted for English learners.

📚 Vocabulary breakdown included
🔄 Slow version available for beginners
📝 Transcript in description

Subscribe for daily English lessons!

#EnglishLearning #ESL #LearnEnglish #OviEnglishSchool`,
    tags: ['English learning', 'ESL', 'Learn English', 'English podcast', 'News English', 'Vocabulary'],
    categoryId: '27', // Education
    privacyStatus: 'public' // or 'private', 'unlisted'
  };

  const params = { ...defaultMetadata, ...metadata };

  console.log(`\n📤 Uploading: ${path.basename(videoPath)}`);
  console.log(`   Title: ${params.title}`);

  try {
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: params.title,
          description: params.description,
          tags: params.tags,
          categoryId: params.categoryId,
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en'
        },
        status: {
          privacyStatus: params.privacyStatus,
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    }, {
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fs.statSync(videoPath).size * 100).toFixed(1);
        process.stdout.write(`\r   Progress: ${progress}%`);
      }
    });

    console.log('\n✅ Upload complete!');
    console.log(`   Video ID: ${response.data.id}`);
    console.log(`   URL: https://youtube.com/watch?v=${response.data.id}`);

    return {
      success: true,
      videoId: response.data.id,
      url: `https://youtube.com/watch?v=${response.data.id}`
    };
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check remaining quota
 */
async function checkQuota() {
  // Note: YouTube API doesn't have a direct quota check endpoint
  // You can view quota in Google Cloud Console
  console.log('\n📊 Quota Info:');
  console.log('   Daily limit: 10,000 units');
  console.log('   Video upload cost: ~1,600 units');
  console.log('   Estimated uploads/day: ~6');
  console.log('\n   View detailed quota at:');
  console.log('   https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas');
}

module.exports = {
  authorize,
  uploadVideo,
  checkQuota
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === '--auth') {
    authorize()
      .then(() => console.log('✅ Authorization complete!'))
      .catch(err => console.error('❌ Auth failed:', err.message));
  } else if (args[0] === '--quota') {
    checkQuota();
  } else if (args[0]) {
    uploadVideo(args[0], {
      title: args[1] || 'Ovi English School - Daily Lesson'
    });
  } else {
    console.log(`
YouTube Uploader - Ovi English School

Usage:
  node youtube-uploader.js --auth          # First-time authorization
  node youtube-uploader.js --quota         # View quota info
  node youtube-uploader.js <video> [title] # Upload a video
    `);
  }
}
