# #10 — Free Interactive Study Site for Language Learning Episodes

**Priority:** Critical | **Used in:** Replacing Notion as learner-facing study page
**Status:** Pending

---

## Context

Our pipeline already generates all the data needed for an interactive study page:
- Full episode transcript (with vocabulary words, definitions, examples)
- 5 vocabulary words with definitions and example sentences
- 3 comprehension questions with answers
- Episode metadata (title, date, news topic, difficulty level)

Currently this goes to a Notion page, which is clunky for learners. We want to build a proper interactive study page hosted for free. The pipeline would auto-generate a new page per episode.

**Constraints:**
- Must be 100% free hosting (GitHub Pages, Vercel free tier, Cloudflare Pages, or Netlify free)
- No backend server — static site only (we have no budget for servers)
- Must work on mobile (most language learners study on phones)
- Generated automatically by our Node.js pipeline — no manual work per episode
- Must be SEO-friendly so learners can discover episodes through Google

---

## Prompt for Gemini Deep Research

Copy everything below this line into Gemini Deep Research:

---

I'm building an automated English learning podcast called "Ovi English School." Each day, the pipeline generates an episode from real news and produces structured data: a transcript, 5 vocabulary words with definitions and examples, 3 comprehension questions with answers, and metadata.

I want to build a FREE interactive study website where each episode gets its own page. Learners visit the page, listen to the episode, read the transcript, do vocabulary quizzes, and answer comprehension questions — all interactively.

I need deep research on:

### 1. BEST STATIC SITE FRAMEWORK FOR THIS USE CASE (2025-2026)
- Compare frameworks for generating static pages from JSON data:
  - Plain HTML/CSS/JS (no framework)
  - Next.js (static export mode)
  - Astro
  - 11ty (Eleventy)
  - Hugo
  - Gatsby
- Which is simplest to integrate into an existing Node.js pipeline?
- Which produces the fastest, most lightweight pages for mobile users?
- Which has the best SEO capabilities out of the box?
- Which is easiest for a solo developer to maintain long-term?
- Consider: I need to auto-generate one new page per day. The build must be scriptable from Node.js.

### 2. INTERACTIVE QUIZ AND EXERCISE PATTERNS FOR LANGUAGE LEARNING
- What interactive exercise types work best for A1-A2 English learners on the web?
- Compare exercise types with research backing:
  - Multiple choice vocabulary quizzes
  - Fill-in-the-blank (cloze) exercises
  - Match word to definition (drag & drop)
  - Flashcard-style reveal (click to flip)
  - Sentence reordering
  - Listen-and-type (dictation)
  - Spaced repetition integrated into the page
- Which exercises can be built purely client-side with vanilla JS (no backend)?
- Are there any open-source JS libraries for language learning exercises? (e.g., H5P, quiz.js, or similar)
- What's the optimal number of exercises per study session for beginners?
- How should exercises be sequenced for maximum retention?

### 3. TRANSCRIPT PRESENTATION FOR LANGUAGE LEARNERS
- Best practices for displaying podcast transcripts to language learners:
  - Should vocabulary words be highlighted/clickable in the transcript?
  - Should there be a "simplified" vs "full" transcript toggle?
  - Should timestamps be shown for audio sync?
  - Should there be a read-along mode where text highlights as audio plays?
- Are there any open-source audio-text sync libraries? (e.g., for karaoke-style highlighting)
- How do successful language learning apps (Duolingo, LingQ, Readlang) present reading content?
- What font sizes, line spacing, and contrast ratios work best for non-native readers?

### 4. FREE HOSTING AND DEPLOYMENT AUTOMATION
- Compare free hosting for a static site that grows by 1 page per day:
  - GitHub Pages (limits, build minutes, custom domain)
  - Vercel free tier (limits, serverless functions if needed later)
  - Cloudflare Pages (limits, performance)
  - Netlify free tier (limits, forms if needed)
- How to automate deployment from a Node.js script (the pipeline runs daily on a MacBook)
- Can the site auto-deploy when the pipeline pushes a new episode JSON to the GitHub repo?
- Storage/bandwidth limits: at 365 episodes/year with audio embedded via external player, will we hit any limits?

### 5. SEO FOR EDUCATIONAL CONTENT PAGES
- How should each episode page be structured for Google discoverability?
- Schema.org markup for educational content / podcast episodes
- What meta tags help language learning content rank?
- Should we use a blog-style index page or a course-style table of contents?
- How do successful language learning sites (EnglishClass101, BBC Learning English, VOA Learning English) structure their episode pages?
- Long-tail keyword strategy for "learn English with news" niche

### 6. MOBILE-FIRST DESIGN FOR LANGUAGE LEARNERS
- What percentage of language learners study on mobile vs desktop?
- Mobile UX patterns that work well for study pages (swipe between sections, collapsible panels, sticky audio player)
- Touch-friendly quiz interactions (tap vs drag on small screens)
- Offline capability: is it worth adding a service worker for offline study? How complex is this?
- PWA (Progressive Web App): should we make it installable? What's the effort?

### 7. EXISTING OPEN-SOURCE TEMPLATES OR PROJECTS
- Are there any open-source projects that do something similar (auto-generated language learning pages)?
- Any templates for educational static sites I could fork and customize?
- Open-source podcast websites with transcript features?
- Any Astro/Next.js/11ty templates designed for educational content?

Give me specific, actionable recommendations with:
- A ranked recommendation for the static site framework (considering our constraints)
- A list of the top 5 most effective interactive exercise types with JS implementation difficulty
- A recommended page layout/structure for an episode study page
- Specific free hosting recommendation with deployment automation steps
- Any open-source libraries or templates I should look at immediately

---

## Research Results

_Paste Gemini Deep Research results here_

---

## Claude Notes
_This section will be filled by Claude after reviewing the research._

- Status: Pending review
- Key findings: [to be filled]
- Action items: [to be filled]
