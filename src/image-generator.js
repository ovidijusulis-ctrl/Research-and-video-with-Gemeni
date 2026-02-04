#!/usr/bin/env node
/**
 * Image Generator (Gemini "Nano Banana" / Gemini image models)
 * Reads scenes.json and generates scene images with Gemini image models.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image'
].filter(Boolean);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--scenes') args.scenes = argv[++i];
    else if (a === '--out-dir') args.outDir = argv[++i];
    else if (a === '--model') args.model = argv[++i];
    else if (a === '--max') args.max = Number(argv[++i]);
    else if (a === '--skip-existing') args.skipExisting = true;
  }
  return args;
}

function extractImagePart(parts) {
  if (!Array.isArray(parts)) return null;
  return parts.find(p => p.inlineData || p.inline_data);
}

async function callGeminiImage(model, prompt) {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: '16:9'
      }
    }
  };

  try {
    return await axios.post(url, payload, { timeout: 120000 });
  } catch (err) {
    // Retry with minimal payload if imageConfig is not accepted
    const minimal = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] }
    };
    return await axios.post(url, minimal, { timeout: 120000 });
  }
}

async function generateImages({ scenesPath, outDir, model, maxImages, skipExisting }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const scenesData = JSON.parse(fs.readFileSync(scenesPath, 'utf8'));
  const scenes = scenesData.scenes || [];
  const targetDir = outDir ? path.resolve(outDir) : path.join(path.dirname(scenesPath), 'scenes');
  fs.mkdirSync(targetDir, { recursive: true });

  const modelsToTry = model ? [model, ...DEFAULT_MODELS.filter(m => m !== model)] : DEFAULT_MODELS;
  if (modelsToTry.length === 0) {
    throw new Error('No Gemini image models configured.');
  }

  const limit = maxImages ? Math.min(maxImages, scenes.length) : scenes.length;
  for (let i = 0; i < limit; i++) {
    const scene = scenes[i];
    const filename = scene.image || `scene-${String(i + 1).padStart(3, '0')}.png`;
    const outputPath = path.join(targetDir, filename);

    if (skipExisting && fs.existsSync(outputPath)) {
      console.log(`⏭️  Skip existing: ${filename}`);
      continue;
    }

    let lastError = null;
    for (const m of modelsToTry) {
      try {
        console.log(`🎨 Generating image ${i + 1}/${limit} with ${m}...`);
        const response = await callGeminiImage(m, scene.prompt);
        const parts = response.data?.candidates?.[0]?.content?.parts || [];
        const imagePart = extractImagePart(parts);
        if (!imagePart) {
          throw new Error('No image returned.');
        }

        const inline = imagePart.inlineData || imagePart.inline_data;
        const data = inline.data;
        const buffer = Buffer.from(data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Saved: ${outputPath}`);
        scene.image = filename;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        console.log(`⚠️  ${m} failed: ${err.message?.slice(0, 120) || err}`);
      }
    }

    if (lastError) {
      throw lastError;
    }
  }

  // Save updated scenes with image filenames
  fs.writeFileSync(scenesPath, JSON.stringify(scenesData, null, 2));
  return targetDir;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.scenes) {
    console.log('Usage: node src/image-generator.js --scenes <scenes.json> [--out-dir output/scenes] [--model gemini-3-pro-image-preview] [--max 10] [--skip-existing]');
    process.exit(1);
  }

  await generateImages({
    scenesPath: args.scenes,
    outDir: args.outDir,
    model: args.model,
    maxImages: args.max,
    skipExisting: args.skipExisting || false
  });
}

if (require.main === module) {
  main().catch(err => {
    console.error(`❌ Image generation failed: ${err.message || err}`);
    process.exit(1);
  });
}

module.exports = { generateImages };
