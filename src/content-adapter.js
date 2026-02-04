/**
 * Ovi English School - Content Adapter
 * Multi-provider LLM architecture:
 *   Primary: Z.ai GLM-4.7-flash (stable, free, automation-friendly)
 *   Fallback: Gemini (when Z.ai unavailable)
 *   Emergency: Mock data (always works)
 */

const axios = require('axios');
require('dotenv').config();

// API Keys
const ZAI_API_KEY = process.env.ZAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Z.ai Configuration (Primary - stable model identifier)
const ZAI_API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';
const ZAI_MODEL = 'glm-4.7-flash';

// Gemini Configuration (Fallback)
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro'
];

/**
 * System prompt for CEFR-controlled output
 */
const SYSTEM_PROMPT = `You are an English language teacher creating podcast scripts for learners.
Your output must be:
- Plain text only (NO markdown, NO asterisks, NO headers)
- Spoken words only (NO stage directions like "(pause)" or "[music]")
- CEFR level appropriate vocabulary and grammar
- Clear, friendly, and encouraging tone`;

/**
 * Prompt template for beginner level (A1-A2)
 */
const BEGINNER_PROMPT = `Create an English learning podcast episode for BEGINNER learners (A1-A2 level).

NEWS STORY:
Title: {TITLE}
Summary: {SUMMARY}

Create a podcast script with these sections:

1. INTRO
Welcome to Ovi English School
Brief mention of today's topic

2. NEWS STORY
Rewrite the news in VERY simple English
Use short sentences, 5 to 10 words each
Use only common words
Explain difficult words when you use them
Repeat key information

3. VOCABULARY, 5 words
For each word:
Say the word clearly
Give a simple definition
Use it in a sentence from the story

4. PRACTICE QUESTIONS, 3 questions
Simple comprehension questions
Give the answer after each question

5. OUTRO
Summarize what they learned
Thank them for learning with Ovi English School
Say goodbye

IMPORTANT RULES:
Use ONLY simple, common English words
Keep sentences SHORT, under 10 words
Speak slowly and clearly
Repeat important words
Be encouraging and friendly
Write ONLY the words that should be spoken aloud
Use simple numbered lists like "1." not bold formatting

Output ONLY the spoken words, plain text, no formatting.`;

/**
 * Prompt template for intermediate level (B1-B2)
 */
const INTERMEDIATE_PROMPT = `Create an English learning podcast episode for INTERMEDIATE learners (B1-B2 level).

NEWS STORY:
Title: {TITLE}
Summary: {SUMMARY}

Create a podcast script with these sections:

1. INTRO
Welcome to Ovi English School
Introduce today's topic with context

2. NEWS STORY
Present the full news story with good detail
Use natural English but explain idioms
Include some complex sentences
Add your analysis or context

3. VOCABULARY, 8 words
For each word:
Say the word
Explain meaning and usage
Give example sentences
Mention synonyms if helpful

4. GRAMMAR FOCUS
Pick one grammar point from the story
Explain how it works
Give 2 to 3 more examples

5. DISCUSSION QUESTIONS, 3 questions
Deeper thinking questions
Opinion-based questions

6. OUTRO
Summary of key points
Thank listeners
Preview next episode

Output as plain text script ready for text-to-speech. No markdown formatting.`;

/**
 * Strip all markdown formatting from text (for clean TTS input)
 */
function stripMarkdown(text) {
  return text
    // Remove bold/italic markers: **text**, *text*, __text__, _text_
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove headers: # Header, ## Header, etc.
    .replace(/^#{1,6}\s+/gm, '')
    // Remove stage directions: (pause), (music plays), etc.
    .replace(/\([^)]*\)/g, '')
    // Remove brackets: [text]
    .replace(/\[([^\]]*)\]/g, '$1')
    // Remove code blocks and inline code
    .replace(/```[^`]*```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Call Z.ai GLM-4.7-flash (Primary provider)
 */
async function callZai(userPrompt) {
  if (!ZAI_API_KEY) {
    console.log('   ⚠️  No ZAI_API_KEY configured');
    return null;
  }

  try {
    console.log(`   🚀 Trying Z.ai ${ZAI_MODEL}...`);
    const response = await axios.post(
      ZAI_API_URL,
      {
        model: ZAI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${ZAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      console.log(`   ✅ Z.ai ${ZAI_MODEL} success`);
      return content;
    }
    console.log('   ⚠️  Z.ai returned empty response');
    return null;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.error?.message || error.message;
    console.log(`   ❌ Z.ai failed (${status}): ${msg.slice(0, 80)}`);
    return null;
  }
}

/**
 * List available Gemini models (for auto-discovery)
 */
async function listGeminiModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const models = response.data.models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));
    return models;
  } catch (e) {
    return [];
  }
}

/**
 * Call Gemini API (Fallback provider)
 */
async function callGemini(userPrompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('   ⚠️  No GEMINI_API_KEY configured');
    return null;
  }

  // Try to find working models
  let availableModels = await listGeminiModels();
  let modelsToTry = availableModels.length > 0
    ? availableModels.filter(m => m.includes('flash') || m.includes('pro')).slice(0, 3)
    : GEMINI_MODELS;

  for (const model of modelsToTry) {
    try {
      console.log(`   🔄 Trying Gemini ${model}...`);
      const response = await axios.post(
        `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        console.log(`   ✅ Gemini ${model} success`);
        return content;
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.error?.message || error.message;
      console.log(`   ❌ Gemini ${model} failed (${status}): ${msg.slice(0, 60)}`);

      // Don't keep trying if auth/rate issue
      if (status === 429 || status === 401 || status === 403) {
        break;
      }
    }
  }

  return null;
}

/**
 * Generate mock script (Emergency fallback - always works)
 */
function generateMockScript() {
  console.log('   📝 Using mock script (no LLM available)');
  return `
Hello and welcome to Ovi English School!
I am your host.
Today, we learn English with real news.
Let's begin!

This is a test episode. Connect an LLM API for real content.

Today we will learn about world news.
News helps us learn new words.
Let's learn together!

Here are some vocabulary words:

Word 1: News
News means information about things happening in the world.
I read the news every morning.

Word 2: Learn
Learn means to get new knowledge.
I learn English every day.

Word 3: World
World means the Earth and all the people on it.
People around the world speak English.

Now let's practice!

Question 1: What do we learn with?
Answer: We learn with news!

Question 2: What language are we learning?
Answer: We are learning English!

Great job today!
Thank you for learning with Ovi English School!
See you in the next lesson!

Goodbye!
`;
}

/**
 * Main LLM call with provider cascade:
 * Z.ai (primary) → Gemini (fallback) → Mock (emergency)
 */
async function callLLM(userPrompt) {
  console.log('\n🤖 Calling LLM provider cascade...');

  // Try Z.ai first (stable, free, automation-friendly)
  let result = await callZai(userPrompt);
  if (result) return result;

  // Fallback to Gemini
  console.log('   ↓ Falling back to Gemini...');
  result = await callGemini(userPrompt);
  if (result) return result;

  // Emergency: mock data
  console.log('   ↓ All providers failed, using mock data');
  return generateMockScript();
}

/**
 * Adapt news for a specific level
 */
async function adaptNewsForLevel(story, level = 'beginner') {
  console.log(`\n✍️  Adapting content for ${level} level...`);

  const promptTemplate = level === 'beginner' ? BEGINNER_PROMPT : INTERMEDIATE_PROMPT;

  const prompt = promptTemplate
    .replace('{TITLE}', story.title)
    .replace('{SUMMARY}', story.summary);

  let script = await callLLM(prompt);

  // Post-process to remove any markdown the LLM might have added
  script = stripMarkdown(script);
  console.log(`✅ Script generated and cleaned (${script.length} characters)\n`);

  return script;
}

/**
 * Extract vocabulary from script (simple extraction)
 */
function extractVocabulary(script) {
  const vocabMatch = script.match(/Word \d+:.*?(?=Word \d+:|Now let's practice|PRACTICE|$)/gs);
  return vocabMatch || [];
}

// Export for use in other modules
module.exports = { adaptNewsForLevel, extractVocabulary, callLLM };

// Run directly for testing
if (require.main === module) {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 Content Adapter Test');
  console.log('═══════════════════════════════════════════════════');
  console.log('Providers configured:');
  console.log(`  Z.ai:    ${ZAI_API_KEY ? '✅ Key set' : '❌ No key'}`);
  console.log(`  Gemini:  ${GEMINI_API_KEY ? '✅ Key set' : '❌ No key'}`);
  console.log('');

  const testStory = {
    title: 'Technology Changes How We Learn',
    summary: 'New AI tools are helping people learn languages faster than ever before. Schools are adopting new methods.'
  };

  adaptNewsForLevel(testStory, 'beginner').then(script => {
    console.log('📜 Generated Script:\n');
    console.log(script);
  });
}
