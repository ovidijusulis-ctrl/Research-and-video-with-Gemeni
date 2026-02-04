#!/usr/bin/env node
/**
 * Scene Generator
 * Turns a script into timed scene prompts for dynamic visuals.
 */

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  maxScenes: 10,
  wpm: 130,
  minSeconds: 4,
  maxSeconds: 18
};

const STYLE_PROMPT = [
  'Style: hand-drawn, slightly imperfect "scuffed authenticity".',
  'Soft pastel backgrounds, simple shapes, friendly classroom vibe.',
  'No text on screen. No logos. 16:9 composition.'
].join(' ');

function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitParagraphs(text) {
  const normalized = normalizeText(text);
  return normalized
    .split(/\n\s*\n/g)
    .map(p => p.trim())
    .filter(Boolean);
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateDurationSeconds(words, wpm, minSeconds, maxSeconds) {
  const seconds = (words / wpm) * 60;
  return Math.max(minSeconds, Math.min(maxSeconds, seconds));
}

function clampScenes(paragraphs, maxScenes) {
  if (paragraphs.length <= maxScenes) return paragraphs;

  const totalWords = paragraphs.reduce((sum, p) => sum + wordCount(p), 0);
  const targetWords = Math.max(40, Math.floor(totalWords / maxScenes));

  const scenes = [];
  let buffer = [];
  let bufferWords = 0;

  for (const p of paragraphs) {
    const w = wordCount(p);
    if (bufferWords + w > targetWords && buffer.length > 0) {
      scenes.push(buffer.join(' '));
      buffer = [];
      bufferWords = 0;
    }
    buffer.push(p);
    bufferWords += w;
  }
  if (buffer.length > 0) scenes.push(buffer.join(' '));
  return scenes.slice(0, maxScenes);
}

function buildPrompt(sceneText) {
  const trimmed = sceneText.length > 420 ? sceneText.slice(0, 420) + '…' : sceneText;
  return `${STYLE_PROMPT} Scene description: ${trimmed}`;
}

function generateScenes({
  scriptText,
  maxScenes = DEFAULTS.maxScenes,
  wpm = DEFAULTS.wpm,
  minSeconds = DEFAULTS.minSeconds,
  maxSeconds = DEFAULTS.maxSeconds
}) {
  const paragraphs = splitParagraphs(scriptText);
  const rawScenes = clampScenes(paragraphs, maxScenes);

  let start = 0;
  const scenes = rawScenes.map((text, idx) => {
    const words = wordCount(text);
    const duration = estimateDurationSeconds(words, wpm, minSeconds, maxSeconds);
    const scene = {
      id: idx + 1,
      start: Number(start.toFixed(2)),
      duration: Number(duration.toFixed(2)),
      words,
      text,
      prompt: buildPrompt(text),
      image: `scene-${String(idx + 1).padStart(3, '0')}.png`
    };
    start += duration;
    return scene;
  });

  return {
    version: 1,
    created_at: new Date().toISOString(),
    wpm,
    style: STYLE_PROMPT,
    scenes
  };
}

function parseArgs(argv) {
  const args = { };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--script') args.script = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--max-scenes') args.maxScenes = Number(argv[++i]);
    else if (a === '--wpm') args.wpm = Number(argv[++i]);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.script || !args.output) {
    console.log('Usage: node src/scene-generator.js --script <script.txt> --output <scenes.json> [--max-scenes 10] [--wpm 130]');
    process.exit(1);
  }

  const scriptText = fs.readFileSync(args.script, 'utf8');
  const sceneData = generateScenes({
    scriptText,
    maxScenes: args.maxScenes || DEFAULTS.maxScenes,
    wpm: args.wpm || DEFAULTS.wpm
  });

  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(sceneData, null, 2));
  console.log(`✅ Scenes written: ${outPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateScenes };
