# #9 — Best LLM for Educational Podcast Scripts

**Priority:** Critical | **Used in:** content-adapter.js LLM provider selection
**Status:** Pending

---

## Prompt for Gemini Deep Research

Copy everything below this line into Gemini Deep Research:

---

I'm building an automated English learning podcast called "Ovi English School" that generates daily episodes from real news. The pipeline uses an LLM to create structured educational scripts (~900 words) with vocabulary, comprehension questions, and cultural explanations for A1-A2 beginner learners.

Currently I use Z.ai GLM-4.7-flash (free) as primary and Gemini 2.5 Flash as fallback. The quality is okay (~95%) but I want to find the BEST model for this specific use case.

I need deep research on:

1. BEST MODELS FOR STRUCTURED EDUCATIONAL CONTENT (2025-2026)
   - Which LLMs produce the highest quality educational/instructional content?
   - Compare: GPT-4o-mini, GPT-4o, Claude Haiku/Sonnet, Gemini Flash/Pro, Llama 3.1/3.2, Mistral, DeepSeek, Qwen, GLM-4
   - Which models are best at following strict output formats (section markers, WORD:/DEFINITION:/EXAMPLE: patterns)?
   - Which models understand pedagogy and CEFR levels best?

2. FREE OR VERY CHEAP API OPTIONS FOR DAILY AUTOMATION
   - I need to make 4 LLM calls per episode, once per day
   - Compare free tiers: Z.ai, Google AI Studio (Gemini), Groq, Together.ai, Fireworks.ai, Mistral free tier, DeepSeek API
   - Which free APIs have enough daily quota for 4 calls of ~1000 tokens input / ~2000 tokens output each?
   - Rate limits and reliability for daily automated use (not interactive)
   - Any models that are free AND high quality for educational content?

3. MODEL QUALITY FOR SPECIFIC TASKS
   - Vocabulary selection: which models are best at choosing pedagogically appropriate words (not too easy, not too hard)?
   - Cultural explanation: which models best explain Western/American culture to non-native speakers?
   - Following instructions precisely: which models stick closest to structured output formats without adding markdown, emojis, or breaking format?
   - Consistent tone: which models maintain a warm, patient teacher voice throughout long outputs?

4. OPEN-SOURCE MODELS I COULD SELF-HOST
   - Are there any 7B-13B models fine-tuned for educational content that I could run locally on a MacBook Pro (M-series)?
   - Would a fine-tuned smaller model beat a general-purpose large model for this specific task?
   - Cost comparison: API calls vs running a local model for 1 daily episode

5. MULTI-MODEL STRATEGY
   - Should I use different models for different pipeline steps? (e.g., one model for vocabulary selection, another for script writing, another for polishing)
   - What's the best cascade strategy if my primary model is rate-limited or down?
   - Are there any model-routing services (like OpenRouter) that could simplify this?

6. BENCHMARKS AND REAL-WORLD TESTING
   - Are there any benchmarks specifically for educational content generation?
   - How do models compare on the "EduBench" or similar education-focused evaluations?
   - Any research papers comparing LLMs for language teaching specifically?

Give me specific, actionable recommendations with:
- A ranked list of top 3 models for this use case
- Cost comparison table (free tier limits, paid pricing per 1M tokens)
- Specific API configuration tips (temperature, top_p, etc.) for educational content
- Any models to definitely AVOID for this use case

---

## Research Results

_Paste Gemini Deep Research results here_

---

## Claude Notes
_This section will be filled by Claude after reviewing the research._

- Status: Pending review
- Key findings: [to be filled]
- Action items: [to be filled]
