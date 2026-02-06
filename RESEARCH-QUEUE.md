# Research Queue - Ovi English School

> **How this works:** Claude (planner) identifies what needs researching → writes prompts here → Ovi pastes them into Gemini Deep Research → saves output back to this repo → Claude + Codex read results and act on them.

## Workflow

1. **Pick** the top `⬜ PENDING` item below
2. **Copy** the prompt in the `Gemini Deep Research Prompt` section
3. **Paste** into [Gemini Deep Research](https://gemini.google.com) and run it
4. **Save** the output as a `.md` file in `findings/` with the filename shown
5. **Update** the status below from `⬜ PENDING` to `✅ DONE`
6. **Push** to GitHub so Claude and Codex can read it

---

## Queue Status

| # | Research Topic | Priority | Status | Output File |
|---|---------------|----------|--------|-------------|
| 1 | Dialogue podcast format (2 voices) | 🔴 Critical | ⬜ PENDING | `findings/dialogue-format-research.md` |
| 2 | News virality scoring & trending APIs | 🔴 Critical | ⬜ PENDING | `findings/news-virality-scoring.md` |
| 3 | Spotify for Podcasters API automation | 🟡 High | ⬜ PENDING | `findings/spotify-api-automation.md` |
| 4 | Apple Podcasts Connect automation | 🟡 High | ⬜ PENDING | `findings/apple-podcasts-automation.md` |
| 5 | Patreon monetization tiers for ESL | 🟡 High | ⬜ PENDING | `findings/patreon-monetization-tiers.md` |
| 6 | Notion API for lesson materials | 🟢 Medium | ⬜ PENDING | `findings/notion-api-integration.md` |
| 7 | CEFR B1-B2 intermediate content design | 🟢 Medium | ⬜ PENDING | `findings/intermediate-content-design.md` |
| 8 | Podcast SEO & episode discoverability 2026 | 🟢 Medium | ⬜ PENDING | `findings/podcast-seo-2026.md` |

---

## Research Items

---

### #1 — Dialogue Podcast Format (Two Voices)
**Priority:** 🔴 Critical — Blocks Phase 1.2 of the roadmap
**Why we need this:** We're switching from monologue to Teacher + Student dialogue. Need best practices so we design the prompt correctly.
**Save to:** `findings/dialogue-format-research.md`

#### Gemini Deep Research Prompt:
```
Research best practices for two-voice dialogue format in educational language learning podcasts. I'm building "Ovi English School" — an automated English learning podcast that currently uses monologue format and I'm switching to a dialogue between a Teacher (patient, clear) and Student (curious, makes mistakes).

I need deep research on:

1. DIALOGUE STRUCTURE
   - What's the ideal ratio of teacher vs student speaking time?
   - How long should each exchange be for language learners?
   - Should the student make intentional grammar mistakes? How often?
   - What's the best episode structure? (intro → news story → vocab → grammar → recap?)

2. PROVEN FORMATS FROM SUCCESSFUL PODCASTS
   - Analyze the format of: EnglishPod, All Ears English, Luke's English Podcast, 6 Minute English (BBC)
   - What dialogue patterns do they use?
   - How do they handle vocabulary explanations within dialogue?

3. ENGAGEMENT RESEARCH
   - Academic research on dialogue vs monologue for L2 acquisition
   - What makes listeners come back to language podcasts?
   - Ideal episode length for different levels (beginner vs intermediate)

4. STUDENT CHARACTER DESIGN
   - Should the student character represent the target audience?
   - How should the student react? (confused, excited, making errors)
   - Cultural considerations for Japanese learners specifically

5. TECHNICAL IMPLEMENTATION
   - How to write LLM prompts that generate natural-sounding dialogue
   - Timing between speakers (pause length)
   - How to handle vocabulary sections in dialogue format vs lecture format

Give me specific, actionable recommendations with examples of actual dialogue scripts I can use as templates.
```

---

### #2 — News Virality Scoring & Trending APIs
**Priority:** 🔴 Critical — Blocks Priority 6 in AI-TASKS.md
**Why we need this:** Current news selection is random. Need to pick stories that are genuinely interesting so learners actually want to listen.
**Save to:** `findings/news-virality-scoring.md`

#### Gemini Deep Research Prompt:
```
Research how to build an automated news virality scoring system for selecting the most engaging stories for a daily English learning podcast.

Context: I run "Ovi English School" — a daily automated podcast that fetches news via RSS and turns it into English lessons. Problem: random news selection means boring episodes. I need to automatically pick stories that are trending and interesting.

Research:

1. TRENDING/VIRAL DETECTION APIs (free or cheap)
   - Google Trends API — how to use it, rate limits, Node.js integration
   - Twitter/X trending topics API
   - Reddit trending — r/worldnews, r/technology, r/todayilearned
   - NewsAPI.org, GNews API, or similar aggregators with "popularity" signals
   - Any free APIs that score articles by engagement/shares

2. VIRALITY SCORING ALGORITHM
   - What factors predict a story will be interesting?
   - How do news aggregators (Google News, Apple News, Flipboard) rank stories?
   - NLP-based headline scoring — what words/patterns predict engagement?
   - Celebrity/famous person detection in headlines
   - Numbers and statistics in headlines (research shows these get more clicks)

3. NEWS SOURCES FOR LANGUAGE LEARNERS
   - What RSS feeds provide engaging, globally-relevant news?
   - Which sources write at accessible English levels?
   - Best entertainment/lifestyle/tech sources (more engaging than politics)
   - Regional sources for Japanese audience specifically

4. IMPLEMENTATION APPROACH
   - Node.js code examples for fetching Google Trends
   - How to score headlines using simple NLP (no ML training needed)
   - Combining multiple signals into a single "interest score"
   - Caching and rate limiting strategies

5. CONTENT FILTERING
   - How to automatically filter out boring/dry stories
   - How to detect "clickbait" vs genuinely interesting
   - Topic diversity — ensuring variety across days (not all politics, not all tech)

I need practical, implementable solutions with code examples in Node.js. Budget: free tier APIs only.
```

---

### #3 — Spotify for Podcasters API Automation
**Priority:** 🟡 High — Currently manual upload
**Why we need this:** Episodes are auto-uploaded to YouTube but Spotify is manual. Need full automation.
**Save to:** `findings/spotify-api-automation.md`

#### Gemini Deep Research Prompt:
```
Research how to automate podcast episode uploads to Spotify for Podcasters (formerly Anchor) in 2026.

Context: I have "Ovi English School" podcast on Spotify (https://open.spotify.com/show/6muUjaQeUW2tr2MMZv1YPf). Currently uploading manually. I generate episodes daily with Node.js automation.

Research:

1. OFFICIAL API STATUS
   - Does Spotify for Podcasters have an official upload API in 2026?
   - What's the current status of the Spotify for Podcasters API?
   - Any beta programs or partner APIs?

2. UNOFFICIAL/ALTERNATIVE METHODS
   - Headless browser automation (Puppeteer/Playwright) to upload via web interface
   - Session cookie-based API calls (reverse engineering the web app)
   - Anchor API endpoints that still work
   - Third-party services that offer podcast upload APIs (Podbean, Buzzsprout, etc.)

3. RSS-BASED DISTRIBUTION
   - Can I just update my RSS feed and Spotify auto-ingests new episodes?
   - What's the typical delay for RSS-based distribution?
   - How to optimize RSS for fastest Spotify pickup
   - Are there ways to trigger Spotify to re-check the RSS faster?

4. HOSTING ALTERNATIVES
   - Podcast hosting services with APIs (Podbean, Buzzsprout, Transistor, Captivate)
   - Comparison: which hosting service has the best API for automation?
   - Can I self-host my RSS and still distribute to Spotify?
   - Pricing comparison for hosting services with API access

5. IMPLEMENTATION
   - Node.js code examples for the best approach
   - Authentication flow
   - Error handling for upload failures
   - Metadata requirements (title, description, artwork)

Which approach gives me the most reliable daily automation with free/cheap tools?
```

---

### #4 — Apple Podcasts Connect Automation
**Priority:** 🟡 High — Untapped distribution channel
**Why we need this:** Apple Podcasts is a huge channel for language learners. Need to automate.
**Save to:** `findings/apple-podcasts-automation.md`

#### Gemini Deep Research Prompt:
```
Research how to automate podcast distribution to Apple Podcasts in 2026.

Context: I run "Ovi English School" — a daily English learning podcast. Already on YouTube and Spotify. Want to expand to Apple Podcasts with full automation.

Research:

1. APPLE PODCASTS CONNECT
   - How does the submission process work?
   - Is there an API for managing episodes?
   - Apple Podcasts Connect portal — what can be automated?

2. RSS-BASED APPROACH
   - Does Apple auto-ingest from RSS like Spotify?
   - RSS feed requirements specific to Apple Podcasts
   - Required tags and metadata (itunes:category, itunes:explicit, etc.)
   - How long does Apple take to pick up new episodes from RSS?

3. PODCAST HOSTING INTEGRATION
   - Do hosting platforms (Podbean, Buzzsprout) handle Apple distribution automatically?
   - One-click distribution vs manual submission
   - Cross-platform distribution services

4. APPLE PODCASTS OPTIMIZATION
   - Category selection for language learning
   - Keywords and SEO for Apple Podcasts search
   - Artwork requirements and best practices
   - How to get featured in "New & Noteworthy"

5. ANALYTICS
   - Apple Podcasts Analytics API — does it exist?
   - What listener data can I get from Apple?
   - How to track downloads and subscriber growth

Practical steps to get listed and stay automated.
```

---

### #5 — Patreon Monetization Tiers for ESL
**Priority:** 🟡 High — Revenue blocker
**Why we need this:** Patreon is set up (https://www.patreon.com/c/OviEnglishSchool) but no tier structure yet. Need pricing that works for global ESL learners.
**Save to:** `findings/patreon-monetization-tiers.md`

#### Gemini Deep Research Prompt:
```
Research the best Patreon tier structure and monetization strategy for an English learning podcast targeting global ESL learners.

Context: "Ovi English School" — daily English learning podcast using real news. Audience: mainly Asian ESL learners (Japan, Korea, Vietnam, Brazil). Already on Patreon at https://www.patreon.com/c/OviEnglishSchool but no tiers set up.

Research:

1. SUCCESSFUL ESL PATREON MODELS
   - Analyze tier structures of: English with Lucy, Rachel's English, Papa Teach Me, mmmEnglish
   - What do successful language teachers offer at each tier?
   - What price points work for global ESL audience?
   - What's the average conversion rate (free listener → paid subscriber)?

2. TIER STRUCTURE RECOMMENDATIONS
   - Free tier: What should stay free to keep growing?
   - $3-5/month tier: What's the "impulse buy" tier content?
   - $10-15/month tier: What premium content justifies this price?
   - $25+/month tier: Is there a high-tier for serious learners?

3. CONTENT IDEAS FOR EACH TIER
   - PDF study guides (already generating these)
   - Bonus episodes / extended episodes
   - Vocabulary lists / flashcards (Anki decks?)
   - Live Q&A sessions
   - Writing correction service
   - Pronunciation feedback
   - Community Discord/group

4. PRICING FOR DEVELOPING COUNTRIES
   - Purchasing power parity considerations
   - Should I offer different pricing for different regions?
   - How do other creators handle this?
   - Patreon's regional pricing features

5. REVENUE PROJECTIONS
   - Realistic subscriber conversion rates for podcast → Patreon
   - Average revenue per subscriber for education content
   - How long to reach $1000/month? $5000/month?
   - Best practices for promoting Patreon on free episodes

Give me a specific recommended tier structure with pricing, content for each tier, and launch strategy.
```

---

### #6 — Notion API for Lesson Materials
**Priority:** 🟢 Medium — Enhancement (Priority 7 in AI-TASKS.md)
**Why we need this:** Want to auto-publish lesson pages to Notion for each episode — transcripts, vocab, exercises, links.
**Save to:** `findings/notion-api-integration.md`

#### Gemini Deep Research Prompt:
```
Research using the Notion API to automatically create and publish structured lesson pages for a language learning podcast.

Context: "Ovi English School" generates daily English lessons. For each episode I want to auto-create a Notion page with: transcript, vocabulary table, grammar notes, practice exercises, and links to audio/video. Pages should be publicly shareable.

Research:

1. NOTION API CAPABILITIES (2026)
   - Creating pages programmatically
   - Database vs page approach — which is better for lesson content?
   - Rich content support (tables, toggles, callouts, embedded media)
   - Making pages publicly shareable via API
   - Rate limits and free tier restrictions

2. PAGE STRUCTURE FOR LANGUAGE LESSONS
   - Best Notion templates for educational content
   - How to structure vocabulary tables (word, IPA, definition, example, audio)
   - Toggle blocks for answer keys
   - Embedding YouTube/Spotify links
   - Callout blocks for tips and grammar notes

3. IMPLEMENTATION
   - Node.js code using @notionhq/client package
   - Authentication setup (integration tokens)
   - Creating a database for episodes
   - Adding pages with rich content blocks
   - Generating shareable links

4. ALTERNATIVE PLATFORMS
   - Notion vs other options for public lesson pages
   - Could we use a simple website/blog instead?
   - Notion's limitations for public content

5. INTEGRATION WITH EXISTING PIPELINE
   - Where in the orchestrator.js pipeline should Notion upload happen?
   - Error handling — what if Notion API is down?
   - How to link back to Notion from YouTube description and RSS

Give me working Node.js code examples.
```

---

### #7 — CEFR B1-B2 Intermediate Content Design
**Priority:** 🟢 Medium — Blocks Phase 2.2 of roadmap
**Why we need this:** Currently only producing beginner (A1-A2) content. Need to design intermediate level properly using CEFR standards.
**Save to:** `findings/intermediate-content-design.md`

#### Gemini Deep Research Prompt:
```
Research how to design effective B1-B2 (intermediate) English learning content for a podcast format, following CEFR standards.

Context: "Ovi English School" currently produces only beginner (A1-A2) episodes using simplified news. I want to add an intermediate tier that properly targets B1-B2 learners.

Research:

1. CEFR B1-B2 SPECIFICATIONS
   - What grammar structures should B1 vs B2 learners know?
   - Vocabulary range expectations (how many words?)
   - Speaking/listening comprehension levels
   - What distinguishes B1 from B2 specifically?

2. CONTENT ADAPTATION
   - How should intermediate news scripts differ from beginner?
   - Should I use more complex sentence structures? How much more?
   - Vocabulary selection — what word frequency range?
   - Should intermediate episodes be longer? How much?
   - Topics that work best for intermediate learners

3. DIALOGUE DESIGN FOR B1-B2
   - How should the Teacher-Student dynamic change?
   - Should the "student" character make fewer mistakes?
   - More complex discussion topics
   - Debate/opinion format vs Q&A format
   - Incorporating idioms and phrasal verbs naturally

4. ASSESSMENT AND PROGRESS
   - How to help listeners self-assess their level
   - What exercises work for intermediate listeners?
   - Comprehension questions at B1-B2 level
   - How to encourage listeners to "level up"

5. SUCCESSFUL INTERMEDIATE PODCASTS
   - What do BBC 6 Minute English, TED Talks Daily, etc. do well?
   - What topics engage intermediate learners specifically?
   - How do they balance teaching vs entertainment?

Give me specific LLM prompt templates for generating B1-B2 content from news stories.
```

---

### #8 — Podcast SEO & Episode Discoverability 2026
**Priority:** 🟢 Medium — Growth blocker
**Why we need this:** Need more organic discovery on YouTube, Spotify, and Apple Podcasts.
**Save to:** `findings/podcast-seo-2026.md`

#### Gemini Deep Research Prompt:
```
Research podcast SEO and discoverability strategies for 2026, specifically for an English learning podcast.

Context: "Ovi English School" — daily English learning podcast on YouTube (@Ovi_English) and Spotify. Need to maximize organic discovery.

Research:

1. YOUTUBE PODCAST SEO (2026)
   - How does YouTube's algorithm rank podcast content?
   - Title optimization for language learning videos
   - Description templates with keyword density
   - Tags and hashtags that work for ESL content
   - Thumbnail best practices for podcast-style videos
   - YouTube Shorts for podcast clips — worth it?

2. SPOTIFY PODCAST SEO
   - How does Spotify's podcast search work?
   - Episode title optimization
   - Category and subcategory selection
   - Spotify's Q&A and Polls features — do they help ranking?
   - Spotify video podcasts — should we be there?

3. APPLE PODCASTS DISCOVERABILITY
   - Apple Podcasts search algorithm
   - How to rank in "Language Learning" category
   - Review/rating strategies
   - "New & Noteworthy" — how to get featured

4. CROSS-PLATFORM STRATEGIES
   - Social media clips (Instagram Reels, TikTok) to drive podcast traffic
   - Blog posts / show notes for Google SEO
   - Guest appearances and cross-promotion
   - Reddit communities for language learners
   - Facebook groups targeting ESL students

5. METADATA AUTOMATION
   - Templates for auto-generating SEO-optimized titles
   - Description templates with keywords
   - How to A/B test titles
   - Tracking which keywords drive traffic

Give me templates and formulas I can automate in my pipeline.
```

---

## Already Completed Research (Reference)

These exist in the priority folders — no need to re-research:

| Folder | Document | Topic |
|--------|----------|-------|
| 00-Strategic | AI Podcast Subscription Strategy | Business model |
| 00-Strategic | AI-Driven ELT Strategic Report | Market analysis |
| 00-Strategic | ESL Content and Subscription Viability | Viability study |
| 01-Critical | Copyright for Educational News Adaptation | Legal compliance |
| 01-Critical | Optimizing Qwen3-TTS for English Podcasts | TTS optimization |
| 01-Critical | Qwen3-TTS VoiceDesign Best Practices | Voice quality |
| 01-Critical | RSS Feed Research | Podcast distribution |
| 01-Critical | Claude-Codex Integration via MCP | AI workflow |
| 02-High | Automated PDF Generation | Study guides |
| 02-High | YouTube Growth Strategy | YouTube channel |
| 02-High | Prompt Engineering for Language Learning | LLM prompts |
| 03-Medium | Automated Trend Detection | Trend analysis |
| 03-Medium | Automating English Learning Pipeline | Automation |
| 04-As-Needed | Mascot Design | Ku-chan mascot |
| 04-As-Needed | Medical English Content | Medical vertical |
| ... | +13 more docs | Various topics |

---

## For Claude & Codex

When reading findings from this queue:
- **Claude:** Use findings to update the roadmap, refine architecture decisions, and write better Codex task briefs
- **Codex:** Use findings for implementation details, API code examples, and best practices
- **Both:** Flag if a finding contradicts existing plans or reveals a better approach

---

*Maintained by Claude (Cowork) — Last updated: February 6, 2026*
