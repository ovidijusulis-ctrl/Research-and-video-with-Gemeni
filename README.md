# 🎓 Ovi English School

Automated English learning podcast generator using real news.

## Features

- 📰 **Real News**: Fetches current news from RSS feeds (free)
- 🤖 **AI Content**: Adapts news for learners using Gemini (free tier)
- 🎙️ **Audio Generation**: Creates podcasts using Edge TTS (free)
- 📚 **Multi-Level**: Beginner, Intermediate, Advanced (coming soon)
- 🌍 **Multi-Language**: English now, Spanish coming soon

## Quick Start

### 1. Install dependencies

```bash
cd ovi-english-school
npm install
pip install edge-tts
```

### 2. Set up API key (optional but recommended)

```bash
cp .env.example .env
# Edit .env and add your Gemini API key
# Get free key at: https://aistudio.google.com/app/apikey
```

### 3. Run the generator

```bash
npm start
```

This will:
1. Fetch today's news
2. Adapt it for beginners
3. Generate audio podcast
4. Save transcripts

---

## Dynamic Scene Images (Gemini Pro Image / "Nano Banana")

Generate changing images based on what the speaker is saying, then render a dynamic video.

### 1) Create scene prompts from the script

```bash
node src/scene-generator.js --script output/2025-01-29/ovi-english-beginner-2025-01-29-script.txt --output output/2025-01-29/scenes.json --max-scenes 10
```

### 2) Generate images with Gemini image models

```bash
node src/image-generator.js --scenes output/2025-01-29/scenes.json --out-dir output/2025-01-29/scenes --model gemini-3-pro-image-preview --skip-existing
```

### 3) Build a dynamic slideshow video

```bash
python3 src/video-converter.py output/2025-01-29/ovi-english-beginner-2025-01-29.mp3 --scenes output/2025-01-29/scenes.json --images-dir output/2025-01-29/scenes -o output/2025-01-29/ovi-english-beginner-2025-01-29.mp4
```

## Output

Each run creates files in `output/YYYY-MM-DD/`:

```
output/2025-01-29/
├── ovi-english-beginner-2025-01-29.mp3      # Audio episode
├── ovi-english-beginner-slow-2025-01-29.mp3 # Slow version
├── ovi-english-beginner-2025-01-29-script.txt
└── ovi-english-beginner-2025-01-29-transcript.md
```

## Cost

| Component | Cost |
|-----------|------|
| News (RSS) | Free |
| Content AI (Gemini) | Free (1500 req/day) |
| Audio (Edge TTS) | Free |
| **Total** | **$0** |

## Project Structure

```
ovi-english-school/
├── src/
│   ├── orchestrator.js    # Main pipeline
│   ├── news-fetcher.js    # RSS news fetching
│   ├── content-adapter.js # AI content generation
│   └── audio-generator.py # Text-to-speech
│   ├── scene-generator.js # Script -> scene prompts
│   ├── image-generator.js # Scene prompts -> Gemini images
│   └── gemini-research.js # Research runner
├── output/                # Generated episodes
├── config/
├── .env                   # API keys (create from .env.example)
└── package.json
```

## Future Plans

- [ ] Intermediate & Advanced levels
- [ ] Spanish language support
- [ ] YouTube auto-upload
- [ ] Spotify/podcast distribution
- [ ] Daily automation (cron)
- [ ] PDF worksheets

## Author

Created by Ovi with ❤️
