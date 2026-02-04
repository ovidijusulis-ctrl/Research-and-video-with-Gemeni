#!/usr/bin/env node
/**
 * Gemini Research Runner
 * Generates a research summary from a prompt and saves to a Markdown file.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_MODELS = [
  process.env.GEMINI_TEXT_MODEL,
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
].filter(Boolean);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--prompt') args.prompt = argv[++i];
    else if (a === '--prompt-file') args.promptFile = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--model') args.model = argv[++i];
  }
  return args;
}

function extractText(parts) {
  if (!Array.isArray(parts)) return '';
  return parts.map(p => p.text || '').join('').trim();
}

async function callGeminiText(model, prompt) {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 }
  };
  return axios.post(url, payload, { timeout: 120000 });
}

async function runResearch({ prompt, outputPath, model }) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const modelsToTry = model ? [model, ...DEFAULT_MODELS.filter(m => m !== model)] : DEFAULT_MODELS;
  if (modelsToTry.length === 0) {
    throw new Error('No Gemini text models configured.');
  }

  let lastError = null;
  for (const m of modelsToTry) {
    try {
      console.log(`🔎 Research with ${m}...`);
      const response = await callGeminiText(m, prompt);
      const parts = response.data?.candidates?.[0]?.content?.parts || [];
      const text = extractText(parts);
      if (!text) throw new Error('Empty response');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, text);
      console.log(`✅ Research saved: ${outputPath}`);
      return outputPath;
    } catch (err) {
      lastError = err;
      console.log(`⚠️  ${m} failed: ${err.message?.slice(0, 120) || err}`);
    }
  }

  throw lastError;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt && !args.promptFile) {
    console.log('Usage: node src/gemini-research.js --prompt "..." --out research/result.md [--model gemini-3-pro-preview]');
    console.log('   or: node src/gemini-research.js --prompt-file prompt.txt --out research/result.md');
    process.exit(1);
  }

  const prompt = args.prompt || fs.readFileSync(args.promptFile, 'utf8');
  const outputPath = args.out || path.join('research', `research-${Date.now()}.md`);

  await runResearch({ prompt, outputPath, model: args.model });
}

if (require.main === module) {
  main().catch(err => {
    console.error(`❌ Research failed: ${err.message || err}`);
    process.exit(1);
  });
}

module.exports = { runResearch };
