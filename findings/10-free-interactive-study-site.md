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

Architectural Blueprint for Ovi English School: A High-Performance, Zero-Cost EdTech Platform1. Executive Summary: The Convergence of Automation and PedagogyThe digital landscape for language learning has shifted precipitously from static textbook digitization to dynamic, immersive experiences. For "Ovi English School," the objective is to build a daily-updated, automated English learning platform that delivers high-fidelity audio, synchronized transcripts, and interactive assessments—all without incurring infrastructure costs. This requirement creates a complex architectural paradox: the need for dynamic, app-like interactivity typically associated with server-side processing, balanced against the requirement for a zero-cost, static hosting model.The proposed solution leverages a modern Jamstack (JavaScript, APIs, and Markup) architecture. By decoupling the content generation (the automated JSON pipeline) from the presentation layer (the static site), we can achieve a robust, secure, and infinitely scalable platform. The core of this architecture is Astro, a next-generation static site generator that utilizes "Islands Architecture" to inject interactivity only where necessary, deployed on Cloudflare Pages to capitalize on unmetered bandwidth, with media assets offloaded to Cloudflare R2 storage to eliminate egress fees.This report provides an exhaustive technical and pedagogical analysis of the proposed stack. It examines the specific requirements of daily content generation, the algorithmic challenges of audio-text synchronization, the implementation of client-side gamification without a backend database, and the search engine optimization (SEO) strategies required to compete in the saturated English Language Teaching (ELT) market. The recommendations herein are designed to ensure "Ovi English School" is not merely a blog with audio, but a Progressive Web Application (PWA) capable of functioning as a primary learning tool for students worldwide, particularly in markets with variable connectivity where static, pre-rendered content offers superior performance.2. Pedagogical Architecture: Designing for AcquisitionBefore addressing the software architecture, it is critical to define the pedagogical constraints that drive technical decisions. The effectiveness of a language learning platform is not measured by its code quality alone, but by its adherence to Second Language Acquisition (SLA) principles. The "Ovi English School" must support the progression from passive input (listening) to active intake (processing) and finally to output (quizzing).2.1 The Role of Synchronized "Karaoke" TextResearch into multimodal learning indicates that simultaneous exposure to auditory and textual input—often referred to as "bimodal presentation"—significantly enhances vocabulary retention and decoding skills. For A1-A2 level learners (beginners), the cognitive load of decoding continuous speech can be overwhelming. Synchronized text acts as a scaffold, allowing the learner to verify their auditory processing in real-time.From a technical perspective, this necessitates a "Karaoke" style transcript UI. Unlike a standard static transcript, this feature requires:Temporal Precision: The UI must highlight specific words or phrases within milliseconds of the audio playback.Visual Continuity: As the audio progresses, the text must auto-scroll (teleprompter style) to keep the active phrase in the "foveal" (central) vision zone, reducing eye strain.Interactive Navigation: Learners often engage in "micro-looping"—repeating a 3-second segment to grasp a specific phoneme. The text itself must act as a navigation controller; clicking a word should seek the audio player to that timestamp.2.2 Active Recall via GamificationPassive consumption of podcasts, while useful for extensive listening, is insufficient for grammar acquisition. The "Ovi English School" pipeline includes structured JSON quizzes (Cloze tests, matching). These are not merely engagement hacks but digital implementations of "Active Recall" testing.Cloze (Fill-in-the-Blank): This tests semantic and syntactic knowledge. The technical implementation must handle text input or dropdown selection seamlessly within the flow of a sentence.Matching/Reordering: These tasks test collocation (which words go together) and syntax (sentence structure). The drag-and-drop interface must be intuitive and touch-responsive, mirroring the tactile nature of flashcards.The architecture must support these interactions entirely on the client side. Since the project aims for a "free" infrastructure, we cannot rely on a database to verify answers. Therefore, the "truth" must be encoded in the JSON payload (obfuscated if necessary) and validated via JavaScript in the browser.2.3 CEFR Alignment and Session DurationThe Common European Framework of Reference for Languages (CEFR) suggests that moving from A1 to A2 requires approximately 100-150 guided learning hours. "Ovi English School" episodes should be structured to provide "micro-learning" sessions. Research suggests that for mobile learners, optimal engagement peaks at 15-20 minutes.Implication for Data Pipeline: The JSON generation pipeline should strictly limit episode duration and quiz complexity to fit this window. A podcast episode longer than 20 minutes risks cognitive fatigue and data abandonment. The static site template should ideally display "Time to Complete" metadata (e.g., "15 min listen + 5 min quiz") to encourage session completion.3. Framework Selection: The Static Site Generator (SSG) WarsThe selection of the underlying framework is the most consequential architectural decision. The requirement is for a system that can ingest structured JSON data, generate thousands of static pages (one per episode), and hydrate them with interactive components (audio players, quizzes). The research highlights a competitive landscape dominated by Next.js, Eleventy (11ty), and Astro.3.1 Analyzing the Contenders3.1.1 Next.js: The HeavyweightNext.js is the most popular React framework. It offers robust features for data fetching and a massive ecosystem.Pros: Native support for React components, widely understood by developers, excellent image optimization.Cons: Next.js ships a substantial JavaScript runtime bundle to the client to manage routing and hydration. For a content-heavy site (mostly text transcripts), this is inefficient. A user on a 3G connection in a developing nation (a key target for free English education) pays a "hydration tax"—waiting for the JS to load before the page becomes interactive. Furthermore, Next.js's static export features, while improved, can be memory-intensive when building thousands of pages, potentially crashing CI/CD pipelines on free tiers.3.1.2 Eleventy (11ty): The Speed DemonEleventy is renowned for its build performance. Benchmarks show it builds Markdown/JSON sites up to 10x faster than Next.js. It produces zero client-side JavaScript by default, resulting in the fastest possible page loads.Pros: Incredible build speeds (critical for a daily archive that will grow to 1000+ pages), pure HTML output, simple data cascade.Cons: It is "UI Agnostic." It does not natively support component-based interactivity (like React or Svelte). To build a complex, stateful audio player that syncs with a transcript and a drag-and-drop quiz, the developer must manually configure a bundler (like Vite or Parcel) and wire up the JavaScript logic. This increases the "glue code" required and complexity for the developer. While perfect for a blog, it struggles with the "App-like" interactivity required for "Ovi English School."3.1.3 Astro: The "Islands" ArchitectAstro represents a paradigm shift. It is designed specifically for content-rich websites that need pockets of interactivity.The "Islands" Architecture: Astro renders the page as static HTML (zero JS) but allows developers to define specific regions ("islands") that are interactive. For Ovi, the Transcript text is static HTML (fast), but the Audio Player and Quiz are hydrated components (interactive).Framework Agnostic: You can write the Quiz component in React, Svelte, Preact, or Vanilla JS. Astro handles the build process seamlessly.Content Collections (v5): Astro’s latest version introduces a robust "Content Layer" specifically for ingesting data from APIs or JSON files. It includes type safety (Zod schemas), ensuring that if the daily pipeline produces malformed data, the build fails safely.Incremental Builds: Astro supports incremental regeneration. When a new episode JSON drops, it can be configured to rebuild only that page and the index, rather than the entire historical archive. This is critical for staying within the build-minute limits of free hosting providers.3.2 The Verdict: AstroAstro is the unequivocally superior choice for "Ovi English School." It bridges the gap between the raw speed of 11ty and the developer ergonomics of Next.js.FeatureAstroEleventyNext.jsOutputZero-JS HTML (Default)Zero-JS HTMLHeavy JS BundleInteractivityComponent IslandsManual JSFull HydrationBuild SpeedFast (Incremental)FastestSlowData SourceContent Layer APIData CascadegetStaticPropsDeveloper ExperienceHigh (React/Svelte support)ModerateHighRecommendation: Initialize the project using the npm create astro@latest command. Utilize the Preact integration for the interactive components (Audio Player, Quiz) because Preact is 3kb (vs React's 35kb), further optimizing the site for low-bandwidth users.4. The Data Pipeline and Automation StrategyThe core efficiency of "Ovi English School" lies in its automation. The site must update itself daily without human intervention. This requires a robust pipeline connecting the JSON generator to the static site builder.4.1 JSON Schema DesignThe structure of the JSON data is the contract between the backend pipeline and the frontend UI. A poorly designed schema will lead to technical debt. Based on the requirements for transcripts, vocabulary, and quizzes, the following schema structure is recommended :JSON{
  "id": "episode-2026-10-12",
  "title": "Mastering the Present Perfect Tense",
  "publishedDate": "2026-10-12T08:00:00Z",
  "audio": {
    "url": "https://assets.ovienglish.com/audio/2026-10-12.mp3",
    "duration": "14:30",
    "filesize": 15400000
  },
  "transcript":,
  "vocabulary": [
    { "word": "Experience", "definition": "Practical contact with...", "timestamp": 145.5 }
  ],
  "quizzes": [
    {
      "type": "cloze",
      "question": "I have {visited} Paris three times.",
      "options": ["visited", "visiting", "visit"],
      "answer": "visited"
    },
    {
      "type": "matching",
      "pairs":
    }
  ]
}
Insight: Including the start and end times for every transcript segment is non-negotiable for the "Karaoke" effect. Some pipelines only output start times; ensuring end times are calculated during generation prevents the UI from having to guess when to de-highlight a sentence.4.2 The "Content Layer" ImplementationIn Astro, this JSON data should be ingested using the Content Loader API. This allows for validating the data against a schema before the build proceeds.TypeScript// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./data/episodes" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    audio: z.object({
      url: z.string().url(),
      duration: z.string(),
    }),
    transcript: z.array(z.object({
      start: z.number(),
      end: z.number(),
      text: z.string(),
    })),
    //... validation for quizzes
  })
});

export const collections = { episodes };
This configuration ensures type safety. If the daily pipeline generates a file missing the audio.url, the build will fail with a clear error message, preventing a broken page from going live.4.3 Automated Build TriggersTo achieve daily updates, the pipeline needs to trigger a rebuild of the static site.Repository Strategy: The JSON generator should commit the new episode.json file to the data/episodes folder in the GitHub repository.Continuous Integration (CI):Cloudflare Pages has native integration with GitHub. It listens for push events to the main branch.Mechanism: When the daily pipeline pushes the new JSON file, Cloudflare Pages automatically detects the commit, spins up a build container, runs npm run build, and deploys the new version of the site.Incremental Builds (Crucial for Scale): As the archive grows to 1,000+ episodes, rebuilding every page will become slow and potentially hit the 20-minute timeout limit on the Cloudflare Free tier.Solution: Utilize Astro’s incremental build features. The loader checks the content digest (hash) of the JSON files. If episode-001.json hasn't changed, Astro reuses the HTML from the previous build cache and only generates episode-1000.html. This keeps build times under 2-3 minutes regardless of archive size.5. Frontend Engineering: The Interactive TranscriptThe "Interactive Transcript" is the central feature distinguishing "Ovi English School" from a standard podcast blog. It requires precise synchronization between the <audio> element and the DOM.5.1 The Synchronization EngineWhile there are libraries for this, a bespoke Vanilla JS or lightweight Preact implementation is recommended to keep the site fast.5.1.1 Data Structure for SyncRendering thousands of DOM nodes (one for each word) can be heavy. The transcript should be rendered as semantic HTML, but with data attributes:HTML<div id="transcript-container">
  <p>
    <span class="word" data-start="0.0" data-end="0.5" id="w0">Welcome</span>
    <span class="word" data-start="0.5" data-end="1.2" id="w1">everyone</span>
   ...
  </p>
</div>
5.1.2 The Time-Update LoopThe core logic relies on the audio element's timeupdate event, which fires roughly 4 times per second (250ms).Naive Approach: On every event, loop through all 2,000 spans to see which one matches currentTime. This is O(N) complexity and will cause layout thrashing and battery drain on mobile devices.Optimized Approach (Binary Search or Indexing):On page load, parse the start/end times into a sorted JavaScript array: timeline = [{start:0, end:0.5, id:"w0"},...].Maintain a currentIndex variable.On timeupdate, check if currentTime is still within timeline[currentIndex]. If yes, do nothing.If currentTime > timeline[currentIndex].end, increment currentIndex.This reduces the operation to O(1) complexity in most frames.5.1.3 Auto-Scrolling (Teleprompter Effect)To keep the active text visible, the interface must scroll automatically.Logic: When the active class changes, calculate the position of the new active element relative to the container.Implementation:JavaScriptfunction scrollToActive(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center', // Keeps the reading line in the middle
    inline: 'nearest'
  });
}
UX Safeguard: Users hate fighting auto-scroll when they want to read ahead. The system must detect user scrolling (via wheel or touchmove events) and disable auto-scroll temporarily. A floating "Resume Sync" button should appear to re-engage the feature.5.2 The Persistent "Sticky" PlayerNavigating between the transcript view and the quiz view shouldn't stop the audio. In a traditional Multi-Page Application (MPA), clicking a link reloads the page, killing the audio.Astro View Transitions: Astro provides a router that swaps page content without a full browser refresh. By tagging the audio player container with transition:persist, the player remains in the DOM, maintaining its state (playback time, buffer) while the rest of the content (transcript vs. quiz) updates around it.Mobile Design: The sticky player must sit at the bottom of the viewport. On iOS, this area interacts with the Safari navigation bar.CSS Fix: Use padding-bottom: calc(env(safe-area-inset-bottom) + 60px) on the body to ensure the player doesn't cover content.Minimization: Include a "collapse" toggle to shrink the player to a thin progress bar, reclaiming screen real estate for the transcript.6. Frontend Engineering: Gamified Assessment (Quizzes)The quizzes provide the "Active Recall" necessary for language retention. Since we cannot use a backend database (to keep costs zero), all validation must happen client-side.6.1 Interactive Cloze (Fill-in-the-Blank)The JSON pipeline outputs a sentence with a missing word.UI Pattern: Instead of a text input (which brings up the virtual keyboard and obscures the screen on mobile), use a "Word Bank" approach.Display the sentence with a gap: "The negotiations reached a ______."Display 3-4 clickable chips below:[Victory][Conclusion].Clicking a chip fills the gap.Library: This requires no heavy library. Simple Vanilla JS event listeners on the chips are sufficient.Feedback: CSS animations are vital.Correct: The gap flashes green.Incorrect: The gap shakes (X-axis translation) and turns red.6.2 Matching & Reordering (Drag-and-Drop)For exercises like "Match the word to the definition" or "Unscramble this sentence," drag-and-drop is intuitive.Library Recommendation: SortableJSWhy: The native HTML5 Drag and Drop API is notoriously buggy on mobile devices and does not support touch events well. SortableJS is a lightweight (12KB) library that uses touch events, ensuring smooth performance on phones.Implementation:JavaScriptimport Sortable from 'sortablejs';
const el = document.getElementById('items');
Sortable.create(el, {
    animation: 150,
    onEnd: function (evt) {
        checkOrder(); // Validate the new order
    },
});
Accessibility (a11y): Drag and drop is often inaccessible to screen readers. To comply with WCAG standards, the interface must also offer "Move Up" / "Move Down" arrow buttons or a keyboard-friendly selection mode.6.3 State ManagementTracking the user's score across different questions requires state management.Nano Stores: Since Astro Islands might be built with different frameworks (or just Vanilla JS), sharing state can be tricky. Nano Stores is a framework-agnostic state library (tiny, <1KB). It allows the "Scoreboard" component (Preact) to update instantly when the "Quiz" component (Vanilla JS) detects a correct answer.Local Storage: To persist progress (so the user doesn't lose their place if they refresh), save the completed quiz IDs to localStorage.7. Infrastructure and "Free Tier" EconomicsThe requirement for a "FREE" website is the most dangerous constraint. Media-heavy sites often inadvertently trigger bandwidth limits, leading to site suspension or surprise bills.7.1 The Bandwidth TrapAudio files are large. A 15-minute MP3 at 128kbps is approximately 14MB.Scenario: If "Ovi English School" gains moderate traction (e.g., 200 users listening to 1 episode a day).Calculation: 200 users * 14MB * 30 days = 84 GB/month.The Limit:Netlify Free Tier: 100GB / month bandwidth limit.Vercel Free Tier: 100GB / month bandwidth limit.GitHub Pages: Soft limit of 100GB / month.At 84GB, the project is dangerously close to the limit. A single viral link or a small increase in users would take the site offline.7.2 The Solution: Cloudflare Pages + R2Cloudflare is the only provider that fundamentally solves this economic problem for media sites.7.2.1 Cloudflare Pages (Hosting)Bandwidth: Cloudflare Pages offers unlimited bandwidth on its free tier. This applies to the static assets (HTML, CSS, JS, Images). This makes it the safest choice for the frontend hosting.7.2.2 Cloudflare R2 (Media Storage)MP3 files should not be hosted inside the Git repository (which bloats the repo) or on the Pages build output (which can slow down deployments). They should be stored in Object Storage.The Competitor (AWS S3): Charges "Egress Fees" (cost for data leaving the server). 1TB of downloads could cost $90+.Cloudflare R2: Offers S3-compatible storage with Zero Egress Fees.Free Tier Limits:Storage: 10 GB / month (approx. 700 episodes).Class B Operations (Reads/Downloads): 10 million / month.Cost Scaling: Even if the library exceeds 10GB, R2 costs $0.015 per GB. Storing 100GB of audio (years of content) would cost $1.35/month—negligible compared to the bandwidth costs elsewhere.Recommendation: Configure the automated pipeline to upload the MP3 to an R2 bucket. Set up a custom domain (e.g., media.ovienglish.com) for the bucket to serve files via the Cloudflare CDN.8. Search Engine Dominance (SEO)For a new site with zero marketing budget, SEO is the primary growth engine. "Ovi English School" must leverage structured data to dominate niche searches.8.1 Long-Tail Keyword StrategyThe term "Learn English" is too competitive. The site must target "Long-Tail" keywords—specific, lower-volume queries that have high intent.Niche Targeting: Instead of "Business English," target "English vocabulary for negotiating a software contract" or "Listening practice for medical professionals."Mechanism: The automated pipeline should analyze the transcript (using simple NLP or LLM APIs if available) to extract specific keywords and inject them into the page <title> and <meta name="description">.8.2 Schema.org ImplementationSearch engines use Schema.org structured data to understand content. Using the correct schema can result in "Rich Snippets" (e.g., a Play button directly in the search results).8.2.1 PodcastEpisode SchemaThis is essential for audio content.JSON<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "PodcastEpisode",
  "name": "Episode 42: Phrasal Verbs for Travel",
  "description": "Learn how to use 'check in', 'take off', and 'get around'.",
  "datePublished": "2026-03-15",
  "timeRequired": "PT14M",
  "associatedMedia": {
    "@type": "MediaObject",
    "contentUrl": "https://media.ovienglish.com/ep42.mp3"
  },
  "partOfSeries": {
    "@type": "PodcastSeries",
    "name": "Ovi English School",
    "url": "https://ovienglish.com"
  }
}
</script>
.8.2.2 LearningResource SchemaTo differentiate the site as an educational tool, apply LearningResource schema to the quiz section.Properties: educationalLevel (e.g., "Beginner", "CEFR A2"), learningResourceType ("Quiz", "Practice Problem").Benefit: Google is increasingly surfacing "Practice Problems" in search results for educational queries. This schema signals that the page contains interactive exercises, not just text.9. Mobile Design and AccessibilitySince language learning is a "spare time" activity often done on commutes, the mobile experience is paramount.9.1 The "Thumb Zone" DesignMobile screens are growing larger, making the top corners hard to reach.Navigation: Place the Audio Player controls and Quiz navigation (Next/Prev) in the bottom third of the screen (the "Thumb Zone").Touch Targets: All interactive elements must be at least 44x44 CSS pixels with adequate spacing to prevent "fat finger" errors.9.2 Reduced Motion and Layout ShiftsCumulative Layout Shift (CLS): Loading the audio player or an ad banner late can push the text down, causing the user to lose their reading place. This is a severe UX failure.Fix: Reserve space for the audio player using CSS min-height or fixed positioning before the component hydrates.Reduced Motion: Respect the user's prefers-reduced-motion media query. If enabled, disable the "Karaoke" auto-scroll and the shaking animations on incorrect quiz answers to prevent motion sickness.10. Conclusion and RoadmapThe architecture proposed for "Ovi English School" represents the cutting edge of cost-effective EdTech. By leveraging Astro for its islands architecture and incremental builds, Cloudflare Pages for unlimited bandwidth, and R2 for zero-egress storage, the platform achieves a professional-grade feature set with a sustainable "free forever" operating model.10.1 Implementation ChecklistPhaseTaskKey Technology1. SetupInitialize Astro project, Config R2 BucketAstro CLI, Cloudflare Dash2. PipelineConfigure GitHub Action to trigger build on JSON pushGitHub Actions3. Core UIBuild Static Transcript & Persistent Audio PlayerPreact, View Transitions4. LogicImplement Binary Search sync engine for Karaoke textVanilla JS5. QuizBuild SortableJS & Cloze componentsSortableJS, Nano Stores6. SEOInject JSON-LD Schema (Podcast + LearningResource)Astro SEO Plugin7. DeployConnect Git to Cloudflare PagesCloudflare PagesThis blueprint provides a scalable foundation that transforms a simple data feed into a world-class language learning application.

---

## Claude Notes

- Status: **Reviewed** — High quality research, some parts overengineered for our stage
- Quality: 8/10 — excellent technical depth, but assumes we're building a startup with a team

### What I Agree With (Build This)

1. **Astro is the right framework.** Islands Architecture is perfect — the transcript is static HTML (fast, SEO-friendly), quizzes are interactive Preact islands. Lightweight, fast builds, great for daily auto-generation. The Content Collections API with Zod validation is exactly what we need to catch bad pipeline output before it goes live.

2. **Cloudflare Pages for hosting.** The bandwidth trap analysis is spot-on. GitHub Pages/Netlify/Vercel all have ~100GB/month limits. BUT — we don't actually host audio files on our site (podcast host handles that), so this only matters if we grow a lot. **Start with GitHub Pages (simpler setup), migrate to Cloudflare Pages when needed.**

3. **Preact over React for islands.** 3kb vs 35kb matters for mobile learners on slow connections. Good call.

4. **Schema.org markup (PodcastEpisode + LearningResource).** Free SEO win. The pipeline can auto-generate this from episode metadata. Do this from day one.

5. **Cloze exercises with word bank chips.** The research is right — don't use text input (keyboard covers the screen on mobile). Tappable chips are perfect for A1-A2 learners. Simple to build, no library needed.

6. **SortableJS for matching exercises.** 12kb, touch-friendly, solves the drag-and-drop-on-mobile problem. Worth including.

### What's Overengineered (Skip for Now)

1. **Karaoke transcript sync.** Cool feature but requires word-level timestamps from TTS. Our Qwen3-TTS doesn't produce these. The transcript should just be static text with vocabulary words highlighted/clickable. Add sync later if we switch to a TTS that outputs timestamps.

2. **Cloudflare R2 for audio storage.** We use a podcast host — audio is already hosted externally. We just embed the player. No need for R2 until we have a reason to self-host audio.

3. **Nano Stores for state management.** Overkill. A simple JavaScript object tracking quiz scores is fine. localStorage for "resume where you left off" is trivially simple.

4. **PWA / Service Worker / Offline.** Nice for v2 but adds complexity. Skip.

5. **View Transitions for persistent audio player.** Astro View Transitions are cool but we're building single episode pages, not a SPA. The audio player lives on each page. Keep it simple.

### MVP Page Structure (What We Actually Build First)

```
Episode Page:
├── Header (Episode #, Date, Topic, CEFR Level badge)
├── Audio Player (embedded from podcast host — Spotify/RSS player)
├── Transcript Section
│   ├── Full text with vocab words highlighted
│   └── Click a vocab word → popup with definition + example
├── Vocabulary Section
│   ├── 5 words with definitions and examples
│   └── Flashcard-style flip cards
├── Quiz Section
│   ├── 3 multiple-choice comprehension questions
│   ├── 5 cloze (fill-in-the-blank) vocabulary exercises
│   └── Score display
├── Feedback link (Google Form)
├── Schema.org JSON-LD (PodcastEpisode + LearningResource)
└── Footer (links to YouTube, RSS, social)

Index Page:
├── Episode archive (newest first)
├── Search/filter by topic
└── About / How to use this site
```

### Implementation Plan

**Phase 1 (MVP — Codex can build this):**
- Astro project with episode page template
- Pipeline outputs episode JSON to `data/episodes/` folder
- Static transcript with clickable vocabulary popups
- Multiple-choice quiz component (Preact island)
- Cloze exercise component (word bank chips)
- GitHub Pages deployment
- Schema.org markup auto-generated

**Phase 2 (After we have users):**
- Matching/reordering exercises (SortableJS)
- Flashcard component with flip animation
- localStorage progress tracking
- Migrate to Cloudflare Pages if bandwidth becomes an issue

**Phase 3 (After feedback):**
- Audio-text sync (requires TTS timestamps)
- PWA installable
- Spaced repetition across episodes

### Key Concern: Pipeline Integration
The pipeline currently outputs a script text file + vocabulary. For the study site, we need it to also output a structured JSON file per episode. This is a small addition to orchestrator.js — just write the existing data (title, date, vocabulary array, questions array, transcript text) as JSON alongside the other outputs.
