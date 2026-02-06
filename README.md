# Gemini Research + Dynamic Visual Generator

A helper project for your main podcast app. It does two focused jobs:

1. **Gemini Pro research** -> saves clean Markdown research notes.
2. **Dynamic visuals** -> generates scene images from your script and builds a timed slideshow video that follows the audio.

This is intentionally lightweight so it can plug into any pipeline that already creates:
- a script (`.txt`)
- an audio file (`.mp3`)

---

## What It Does

- **Research runner** (Gemini Pro text models) -> `research/*.md`
- **Scene generator** -> `scenes.json` with prompts + timing
- **Image generator** (Gemini image models, a.k.a. "Nano Banana") -> `scenes/*.png`
- **Video builder** -> FFmpeg slideshow video that changes images as the speaker talks

---

## Quick Start

### 1) Install

```bash
npm install
```

### 2) Configure

```bash
cp .env.example .env
# Add your Gemini Pro API key
```

### 3) Run Research (optional)

```bash
node src/gemini-research.js --prompt "Research best RSS sources for tech news" --out research/rss.md
```

### 4) Generate Dynamic Visuals

```bash
# 1) Create scene prompts
node src/scene-generator.js   --script output/2025-01-29/episode-script.txt   --output output/2025-01-29/scenes.json   --max-scenes 10

# 2) Generate images with Gemini image model
node src/image-generator.js   --scenes output/2025-01-29/scenes.json   --out-dir output/2025-01-29/scenes   --model gemini-3-pro-image-preview   --skip-existing

# 3) Build the video from images + audio
python3 src/video-converter.py   output/2025-01-29/episode-audio.mp3   --scenes output/2025-01-29/scenes.json   --images-dir output/2025-01-29/scenes   -o output/2025-01-29/episode-video.mp4
```

---

## Integration With Main App

Your main app should already produce:
- `episode-script.txt`
- `episode-audio.mp3`

Then call:
1) `scene-generator.js` (creates `scenes.json`)
2) `image-generator.js` (creates images)
3) `video-converter.py --scenes` (creates video)

This project does not replace your pipeline — it plugs into it.

---

## Research Hub (Claude ↔ Gemini ↔ Codex)

This repo is the shared research brain for the Ovi English School project.

**Workflow:** Claude (planner) → writes research prompts → Ovi runs them in Gemini Deep Research → saves results here → Claude + Codex read and act on them.

- **[`RESEARCH-QUEUE.md`](RESEARCH-QUEUE.md)** -> prioritized research tasks with ready-to-paste prompts
- `findings/` -> completed research summaries (Gemini Deep Research output)
- `requests/` -> open research questions and context
- `00-04 folders` -> 28 completed research documents organized by priority

### Quick Start for Research
1. Open `RESEARCH-QUEUE.md`
2. Pick the top pending item
3. Copy the prompt into [Gemini Deep Research](https://gemini.google.com)
4. Save the output to `findings/` with the specified filename
5. Push to GitHub

---

## Configuration

`.env`:
```
GEMINI_API_KEY=your_key_here
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview
GEMINI_TEXT_MODEL=gemini-3-pro-preview
```

You can also choose a different Gemini image model by passing `--model`.

---

## Project Structure

```
research-and-video-with-gemeni/
├── src/
│   ├── scene-generator.js   # Script -> scene prompts + timing
│   ├── image-generator.js   # Scene prompts -> Gemini images
│   ├── gemini-research.js   # Research runner
│   └── video-converter.py   # FFmpeg slideshow builder
├── output/                  # Your generated scenes/images/videos
├── research/                # Gemini research outputs
├── requests/                # Public research requests
├── findings/                # Public research summaries
├── .env                     # API keys (ignored)
└── package.json
```

---

## Notes

- Timing is **approximate** (based on words-per-minute). This keeps it fast and cheap.
- If you want perfect sync, we can add Whisper/WhisperX alignment later.
- Scene style is defined in `src/scene-generator.js` — you can customize it there.

---

## Author

Created by Ovi with help from AI tools.
