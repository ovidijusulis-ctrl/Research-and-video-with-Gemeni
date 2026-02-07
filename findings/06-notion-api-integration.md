# #6 — Notion API for Lesson Materials

**Priority:** Medium | **Used in:** QO-6 Notion page enhancement
**Status:** Pending

---

## Prompt for Gemini Deep Research

Copy everything below this line into Gemini Deep Research:

---

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

---

## Research Results

Automated Lesson Generation for Ovi English School: A Comprehensive Technical Implementation Report Using the Notion APIExecutive SummaryThe digital transformation of language education necessitates robust, scalable content delivery systems. Ovi English School, a podcast-based language learning platform, faces the challenge of converting audio content into structured, interactive study materials efficiently. This report provides an exhaustive technical analysis and implementation guide for automating the creation and publication of these lesson pages using the Notion API.As of 2026, the Notion API offers a sophisticated interface for programmatic content management, effectively functioning as a Headless CMS (Content Management System). This report details the architectural requirements, database design, block-level construction, and media orchestration necessary to build a fully automated pipeline. The proposed solution leverages the Notion Node.js SDK to ingest raw lesson data—transcripts, vocabulary matrices, grammar heuristics, and multimedia links—and render them into a rich, interactive Notion page.Key technical insights covered include:Block Architecture & Nesting Limits: Overcoming the API's strict two-level nesting constraint through iterative appending strategies, particularly for complex structures like multi-column vocabulary tables and nested toggle lists for exercises.Strict Schema Validation: Addressing the rigid requirements for Table blocks, where child rows and cells must be defined at the point of creation to avoid validation_error responses.Media Orchestration: Implementing the embed block type for Spotify and YouTube integration to ensure rich player rendering, while utilizing the new file_uploads endpoints for hosting auxiliary PDF resources.Resiliency Patterns: Designing a Node.js orchestrator that implements exponential backoff and request chunking to navigate Notion’s rate limits (3 requests/second average) and payload size constraints.Public Access Workarounds: Mitigating the inability to programmatically toggle "Share to Web" by utilizing pre-configured public parent databases and predictable URL construction.The following sections dissect each component of this automation pipeline, providing a blueprint for a system that reduces lesson publication time from hours to seconds while enhancing the pedagogical quality of the output.1. Introduction: Notion as a Headless CMS for EducationIn the landscape of educational technology, the delivery mechanism is as critical as the content itself. For Ovi English School, the objective is to transition from static audio files to a multi-dimensional learning environment. Notion, often perceived primarily as a productivity tool, has evolved into a powerful relational database and content rendering engine. When coupled with its API, it becomes a "Headless CMS"—a backend repository where content is stored and managed programmatically, yet capable of rendering a frontend (the Notion page) that is immediately accessible to end-users.1.1 The Operational ChallengeManual creation of lesson pages involves repetitive, high-friction tasks: formatting transcripts, creating uniform vocabulary tables, embedding media players, and ensuring consistent styling for grammar notes. This manual process is prone to human error—inconsistent headers, broken links, or formatting deviations—that degrade the student experience. Automation addresses these issues by enforcing strict schema compliance and style consistency through code.1.2 The API Solution LandscapeThe Notion API (Application Programming Interface) exposes RESTful endpoints that allow external scripts to manipulate the workspace. For this project, the integration interacts with three core resource types:Pages: The canvas for the lesson.Blocks: The atoms of content (paragraphs, headings, tables).Databases: The structured index organizing all lessons.By utilizing the Node.js runtime environment, we can construct an "Orchestrator"—a script that acts as the bridge between the raw content source (e.g., a podcast RSS feed or a local JSON file) and the Notion workspace. This report assumes the use of the official @notionhq/client library, which provides robust type definitions and helper functions for managing the intricacies of the API.2. System Architecture and Security ModelA robust automation pipeline requires a secure and well-configured environment. This section analyzes the authentication flow, permission models, and the necessary Node.js environment configuration.2.1 Authentication and Integration TypesNotion supports two primary integration types: Public and Internal. For the specific use case of Ovi English School, where the automation is bespoke and proprietary to the school's workspace, an Internal Integration is the optimal architectural choice.2.1.1 Internal Integration ArchitectureAn Internal Integration is bound to a specific workspace and does not require the complex OAuth 2.0 "dance" (authorization codes, access tokens, refresh tokens) associated with public apps. Instead, it utilizes a static Internal Integration Token (often referred to as the "Bot Token"). This token represents a "Bot User" within the workspace.The security model is explicitly "opt-in." The Bot User does not have access to the entire workspace by default. A human administrator must explicitly "invite" the integration to the specific pages or databases it needs to access. This isolation is a critical security feature, ensuring that a compromised token cannot access sensitive administrative or unrelated content.2.1.2 Capability ConfigurationWhen configuring the integration in the Notion Developer Portal, specific "Capabilities" must be enabled. These govern the scope of operations the token can perform. For the Ovi English School pipeline, the following configuration is mandatory:CapabilityRequirement LevelJustificationRead contentMandatoryThe script must query the database to check if an episode already exists (idempotency) to prevent duplicates.Update contentOptionalRequired only if the script needs to modify existing lessons (e.g., correcting a typo in a published page).Insert contentMandatoryThe core function of the script is to append blocks (tables, text, embeds) and create new pages.Read user infoRecommendedUseful for logging or assigning the "Author" property to a specific user profile.Attempting to perform an action without the corresponding capability results in a 403 Restricted Resource error.2.2 Node.js Environment SetupThe automation environment relies on Node.js. As of 2026, Node.js v18 or higher is the standard requirement to ensure compatibility with modern fetch APIs and the latest Notion SDK versions (v5.0.0+).2.2.1 Dependency ManagementThe project relies on a lean set of dependencies to maintain maintainability and security.@notionhq/client: The official SDK is preferred over raw HTTP calls (axios or fetch) because it handles serialization, type checking, and, crucially, automatic retries for rate limiting.dotenv: Security best practices dictate that the Internal Integration Token (NOTION_API_KEY) and the Database ID (NOTION_DATABASE_ID) must never be hardcoded. dotenv loads these from a .env file, keeping secrets out of version control.2.2.2 Directory StructureA modular architecture separates the configuration, the block generation logic (the "factories"), and the execution logic.ovi-english-automation/├──.env                    # Secrets (API Key, Database ID)├── package.json            # Dependencies├── src/│   ├── client.js           # Notion Client initialization & config│   ├── constants.js        # Color codes, Emoji maps, Fixed IDs│   ├── generators/         # Modules for creating Block Objects│   │   ├── typography.js   # Headings, Paragraphs│   │   ├── interactive.js  # Toggles, Callouts│   │   ├── data.js         # Tables, Databases│   │   └── media.js        # Embeds, Files│   ├── utils/              # Helper functions (Text chunking, Error handling)│   └── orchestrator.js     # Main execution script└── test/                   # Unit tests for block generators3. Database Design: The Content RepositoryIn Notion, a Database is not just a table; it is a collection of pages. Each row in the database is itself a page that can contain content. For Ovi English School, the database serves as the "Index" or "Course Catalog."3.1 Schema Definition StrategyThe database schema must support sorting, filtering, and status management. We define the following properties, mapping them to their specific API types.Property NameAPI TypeConfiguration & PurposeLesson TitletitleThe primary identifier. Example: "Episode 42: Advanced Phrasal Verbs".Episode No.numberA unique integer used for sorting and idempotency checks.Publish DatedateISO 8601 date (YYYY-MM-DD). utilized for scheduling.LevelselectSingle choice: "A1", "A2", "B1", "B2", "C1", "C2". Colors can be defined via API.Topicsmulti_selectTags for content discovery: "Grammar", "Travel", "Business", "Slang".StatusstatusWorkflow states: "Draft", "Review", "Published". The API creates pages as "Draft" by default for safety.Audio SourceurlA direct link to the MP3 file or podcast host page.MaterialfilesA container for attached PDF worksheets if not embedded in the body.3.2 Idempotency and Duplicate PreventionA critical feature of the automation is ensuring that running the script twice does not create "Episode 42" twice. This is achieved via the databases.query endpoint.Before creation, the script queries the database:Filter: Property "Episode No." equals the current episode number.Logic: If results.length > 0, the episode exists. The script should either abort (skip) or switch to "Update Mode" (using pages.update).Result: This ensures the database remains clean and trustworthy.4. Content Engineering: The Block Object ModelThe core of the Notion API is the Block. Everything on a page is a block. To create a rich lesson page, we must understand and manipulate the JSON structure of these blocks. The API treats a page as a container of blocks, and creating a page involves passing an array of block objects in the children parameter.4.1 Typography and Structural BlocksThe foundation of the lesson page consists of headers and text. The API separates these into heading_1, heading_2, heading_3, and paragraph types.4.1.1 Rich Text ObjectsText in Notion is not a simple string; it is an array of "Rich Text Objects." This allows for mixed formatting within a single block. For example, a sentence with one bold word consists of three objects:Text object: "Welcome to " (plain)Text object: "Ovi English" (annotations: { bold: true })Text object: " School." (plain)This granularity is powerful but requires the Node.js script to have a text parser if the input source uses Markdown or HTML. For simplicity, the rich_text array usually contains a single object with the full content unless specific highlighting is required.Text Length Constraints:
A single text object has a strict limit of 2,000 characters. If a transcript paragraph exceeds this, the API returns a validation_error. The orchestrator must implement a "chunking" utility that splits long strings into multiple text objects or multiple paragraph blocks.4.2 The Vocabulary Table: A Technical Deep DivePresenting vocabulary in a structured table is pedagogically superior to a simple list. However, the table block is one of the most complex structures in the Notion API due to strict validation rules.4.2.1 The Table SchemaUnlike other blocks where you can create a parent and then append children later, a table block validates its children (table_row) immediately upon creation.Table Width: You must define table_width (e.g., 3 columns: Word, Definition, Example).Row Integrity: Every table_row provided in the children array must have exactly 3 cells. If a row has 2 cells, the API rejects the entire request.Empty Cells: You cannot omit a cell. You must provide an empty object: `` (empty rich text array) for blank cells.JSON Structure for a Vocabulary Table:JSON{
  "object": "block",
  "type": "table",
  "table": {
    "table_width": 3,
    "has_column_header": true,
    "has_row_header": false,
    "children": [
      {
        "type": "table_row",
        "table_row": {
          "cells": [{ "type": "text", "text": { "content": "Header 1" } }],
            [{ "type": "text", "text": { "content": "Header 2" } }],
            [{ "type": "text", "text": { "content": "Header 3" } }]
        }
      }
      //... subsequent data rows
    ]
  }
}
This rigid structure demands that the Node.js script pre-validates all vocabulary data before attempting to construct the block.4.3 Interactive Elements: Toggles and CalloutsTo facilitate "Active Recall"—a key learning strategy—exercises should not show answers immediately. Notion's toggle block is ideal for this.4.3.1 Toggle ConstructionA toggle block has a summary (the visible text) and children (the hidden content).API Constraint: The API allows nesting up to two levels deep in a single request.Level 1: Toggle Block ("Question 1")Level 2: Paragraph Block ("Answer:...")Implication: This fits perfectly within the API limits. We can create the Question Toggle and nest the Answer Paragraph inside it within the same pages.create or blocks.children.append call.4.3.2 Grammar CalloutsFor grammar notes, visual distinctiveness is key. The callout block allows for an icon (emoji) and a colored background.Styling: We can programmatically set the color to gray_background or blue_background and the icon to a lightbulb (💡) to draw attention to grammar rules.5. Media Orchestration: Embeds and FilesA language lesson is incomplete without audio and visual aids. The Notion API handles media through embed blocks and file blocks, each with distinct behaviors and limitations.5.1 Embedding Streaming Services (Spotify & YouTube)For Ovi English School, the primary content is likely hosted on streaming platforms. The Notion API uses the embed block type for these services.Mechanism: When an embed block is created with a Spotify or YouTube URL, the Notion UI client (frontend) automatically detects the provider and renders the interactive IFrame player. The API does not parse the metadata; it simply stores the URL.Constraint: You cannot customize the player size via the API; it defaults to a standard width. However, embed blocks ensure that students can play the audio directly on the page without navigating away.JSON for Spotify Embed:JSON{
  "object": "block",
  "type": "embed",
  "embed": {
    "url": "https://open.spotify.com/episode/4cOdK2wGLETKBW3PvgPWqT"
  }
}
5.2 Handling File Uploads (PDF Worksheets)Historically, the Notion API did not support direct file uploads. However, recent updates  allow for uploading files via the API. This is crucial for attaching PDF worksheets or specialized audio clips.5.2.1 The Three-Step Upload WorkflowUploading a file is not a single POST request. It is a sequence:Get Upload URL: The script calls fileUploads.create (or equivalent endpoint depending on SDK version) to request a signed upload URL and a file ID from Notion.Upload Binary: The script performs a PUT request to the returned upload_url with the binary file content and the correct Content-Type. This usually goes to an AWS S3 bucket managed by Notion.Attach to Block: Once uploaded, the file is not yet visible. The script must create a file block or image block referencing the file_upload_id obtained in step 1.Note: If the strict file_upload endpoint is restricted or in beta, the "Indirect Import" method is the standard fallback. This involves hosting the PDF on a public server (like Amazon S3 or Google Cloud Storage) and passing that public URL to Notion. For this report, we assume the availability of the file upload capability or the fallback to external hosting.6. Technical Implementation: The Node.js OrchestratorThis section provides the comprehensive code solution. It is designed to be modular, robust, and readable.6.1 Configuration and Utilities (src/utils.js)We begin by establishing the client and necessary utility functions for handling data constraints.JavaScript/**
 * src/utils.js
 * Utility functions for Notion API constraints and data processing.
 */

const { Client, LogLevel } = require("@notionhq/client");
require("dotenv").config();

// Initialize the Notion Client with robust timeout settings
// We use LogLevel.WARN to keep logs clean but visible on failure.
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  logLevel: LogLevel.WARN,
  timeoutMs: 60000, // Extended timeout for large block operations
});

/**
 * Splits an array of blocks into chunks of 100.
 * Notion API 'children' array limit is 100 blocks per request.
 * @param {Array} blocks - The complete array of block objects.
 * @returns {Array} - Array of arrays, each max 100 length.
 */
function chunkBlocks(blocks) {
  const chunks =;
  for (let i = 0; i < blocks.length; i += 100) {
    chunks.push(blocks.slice(i, i + 100));
  }
  return chunks;
}

/**
 * Notion Rich Text content limit is 2000 characters.
 * This splits long text (like transcripts) to avoid validation errors.
 * @param {string} text - The raw text content.
 * @returns {string} - Array of strings <= 2000 chars.
 */
function splitTextForNotion(text) {
  if (text.length <= 2000) return [text];
  const chunks =;
  let current = text;
  while (current.length > 0) {
    chunks.push(current.substring(0, 2000));
    current = current.substring(2000);
  }
  return chunks;
}

module.exports = { notion, chunkBlocks, splitTextForNotion };
6.2 Block Generators (src/generators.js)Abstracting the JSON construction into factory functions prevents the main logic from becoming cluttered with verbose schema definitions.JavaScript/**
 * src/generators.js
 * Factory functions to generate specific Notion Block objects.
 */

// Generate a Heading 2 Block
function createHeading2(text) {
  return {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{ type: "text", text: { content: text } }],
    },
  };
}

// Generate a Callout Block (for Grammar Tips)
// Uses an emoji icon for visual distinction.
function createCallout(text, emoji = "💡") {
  return {
    object: "block",
    type: "callout",
    callout: {
      icon: { type: "emoji", emoji: emoji },
      rich_text: [{ type: "text", text: { content: text } }],
      color: "gray_background",
    },
  };
}

// Generate a Media Embed Block (Spotify/YouTube)
function createMediaEmbed(url) {
  return {
    object: "block",
    type: "embed",
    embed: {
      url: url,
    },
  };
}

/**
 * Generate a Vocabulary Table Block.
 * STRICT VALIDATION WARNING: 
 * - 'table_width' must match the number of cells in every row.
 * - All children must be 'table_row' objects.
 */
function createVocabTable(vocabList) {
  // 1. Create the Header Row
  const headerRow = {
    type: "table_row",
    table_row: {
      cells:,
       ,
        [{ type: "text", text: { content: "Example" }, annotations: { bold: true } }],
    },
  };

  // 2. Map vocabulary data to data rows
  const bodyRows = vocabList.map((item) => ({
    type: "table_row",
    table_row: {
      cells: [{ type: "text", text: { content: item.word |

| "" } }], // Fallback to empty string
        [{ type: "text", text: { content: item.definition |

| "" } }],
        [{ type: "text", text: { content: item.example |

| "" } }],
    },
  }));

  // 3. Return the Table Block containing all rows
  return {
    object: "block",
    type: "table",
    table: {
      table_width: 3,
      has_column_header: true,
      has_row_header: false,
      children:,
    },
  };
}

/**
 * Generate a Toggle Block for Exercises.
 * Supports nesting the answer immediately inside.
 */
function createExerciseToggle(question, answer) {
  return {
    object: "block",
    type: "toggle",
    toggle: {
      rich_text: [{ type: "text", text: { content: `❓ ${question}` } }],
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: answer, annotations: { italic: true } } }],
          },
        },
      ],
    },
  };
}

module.exports = { 
  createHeading2, 
  createCallout, 
  createMediaEmbed, 
  createVocabTable, 
  createExerciseToggle 
};
6.3 The Main Orchestrator (src/index.js)This script orchestrates the data flow: Validation -> Block Construction -> Page Creation -> Content Appending.JavaScript/**
 * src/index.js
 * Main execution script for publishing Ovi English School lessons.
 */

const { notion, chunkBlocks, splitTextForNotion } = require("./utils");
const blocks = require("./generators");

// MOCK DATA SOURCE
// In production, this would be replaced by a fetch() to an RSS feed or CMS.
const LESSON_DATA = {
  title: "Episode 101: Mastering Business Idioms",
  number: 101,
  date: "2026-02-10",
  level: "B2",
  tags:,
  spotifyLink: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  transcript: "Welcome to Ovi English School... [assume very long text]...",
  grammarTip: "Use 'touch base' only in professional contexts to imply brief contact.",
  vocabulary:,
  exercises:
};

async function publishLesson() {
  console.log(`🚀 Starting publication for: ${LESSON_DATA.title}`);

  try {
    // STEP 1: IDEMPOTENCY CHECK
    // Query the database to ensure this episode doesn't already exist.
    const databaseId = process.env.NOTION_DATABASE_ID;
    const existingCheck = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Episode No.",
        number: {
          equals: LESSON_DATA.number
        }
      }
    });

    if (existingCheck.results.length > 0) {
      console.warn(`⚠️ Episode ${LESSON_DATA.number} already exists. Aborting creation.`);
      return;
    }

    // STEP 2: BUILD CONTENT BLOCKS
    // We construct the "body" of the page as a linear array of blocks.
    const pageChildren =;

    // 2.1 Media Section
    pageChildren.push(blocks.createHeading2("🎧 Listen Now"));
    pageChildren.push(blocks.createMediaEmbed(LESSON_DATA.spotifyLink));

    // 2.2 Grammar Callout
    pageChildren.push(blocks.createHeading2("💡 Grammar Focus"));
    pageChildren.push(blocks.createCallout(LESSON_DATA.grammarTip));

    // 2.3 Vocabulary Table
    pageChildren.push(blocks.createHeading2("📚 Key Vocabulary"));
    pageChildren.push(blocks.createVocabTable(LESSON_DATA.vocabulary));

    // 2.4 Transcript (Inside Toggle)
    // Complex logic: Split text, create paragraphs, then wrap in toggle.
    const transcriptChunks = splitTextForNotion(LESSON_DATA.transcript);
    const transcriptParagraphs = transcriptChunks.map(chunk => ({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: [{ type: "text", text: { content: chunk } }] }
    }));
    
    // Create the Transcript Toggle manually here as it has dynamic children count
    pageChildren.push({
      object: "block",
      type: "toggle",
      toggle: {
        rich_text:,
        children: transcriptParagraphs // Note: Limit is 100 children here too.
      }
    });

    // 2.5 Exercises
    pageChildren.push(blocks.createHeading2("✍️ Practice Exercises"));
    LESSON_DATA.exercises.forEach(ex => {
      pageChildren.push(blocks.createExerciseToggle(ex.question, ex.answer));
    });

    // STEP 3: HANDLE API LIMITS (CHUNKING)
    // We can only send 100 blocks in the initial create call.
    // Complex pages might exceed this. We split the logic.
    const blockBatches = chunkBlocks(pageChildren);
    const initialBatch = blockBatches;
    const remainingBatches = blockBatches.slice(1);

    // STEP 4: CREATE THE PAGE
    console.log("Creating page with initial blocks...");
    const createResponse = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Lesson Title": { title: },
        "Episode No.": { number: LESSON_DATA.number },
        "Publish Date": { date: { start: LESSON_DATA.date } },
        "Level": { select: { name: LESSON_DATA.level } },
        "Topics": { multi_select: LESSON_DATA.tags.map(t => ({ name: t })) },
        "Status": { status: { name: "Draft" } } // Create as draft first
      },
      children: initialBatch
    });

    const pageId = createResponse.id;
    console.log(`✅ Page created! ID: ${pageId}`);

    // STEP 5: APPEND REMAINING BLOCKS
    // If the content was > 100 blocks, we loop through the rest and append.
    if (remainingBatches.length > 0) {
      console.log(`Appending ${remainingBatches.length} additional batches...`);
      for (const batch of remainingBatches) {
        await notion.blocks.children.append({
          block_id: pageId,
          children: batch
        });
        console.log("Batch appended.");
      }
    }

    console.log("🎉 Lesson publication workflow complete.");

  } catch (error) {
    console.error("❌ Error in workflow:", error);
    // Log extended validation error details if available
    if (error.code === 'validation_error') {
      console.error(JSON.stringify(error.body, null, 2));
    }
  }
}

// Execute
publishLesson();
7. Resilience and Error Handling StrategiesOperating at scale—for instance, backfilling 200 past episodes—pushes the API to its limits. A robust implementation must anticipate and handle specific failure modes.7.1 Rate Limiting (HTTP 429)Notion enforces a variable rate limit, averaging 3 requests per second. Burst traffic is allowed but tightly regulated. When a limit is hit, the API returns a 429 Too Many Requests status and a Retry-After header indicating the wait time in seconds.SDK Handling: The @notionhq/client SDK is configured by default to retry requests twice.Custom Implementation: In src/utils.js, we initialize the client with timeoutMs: 60000 and can customize retry options in the client constructor. For heavy batch operations, it is advisable to implement a "Queue" system (using libraries like p-queue) to throttle concurrency to 1 or 2 simultaneous requests, rather than firing all requests at once.7.2 Validation Errors (HTTP 400)These are critical during the development of block generators. Common causes include:Text Length: Sending > 2000 characters in a single text object. Mitigation: The splitTextForNotion utility.Nesting Depth: Attempting to put a toggle inside a toggle inside a toggle (3 levels). Mitigation: Flatten the structure or perform sequential updates.Table Structure: Mismatch between table_width and actual cells provided. Mitigation: Strict validation in the createVocabTable generator.8. Deployment and Public AccessOnce the pages are generated, the final challenge is distribution.8.1 The "Share to Web" LimitationAs of 2026, the Notion API does not support programmatically toggling the "Share to Web" page setting. A page created via API is private by default unless its parent is public.8.1.1 The Inheritance WorkaroundTo ensure lessons are public immediately upon creation:Configure Parent: Manually set the "Course Catalog" Database to "Share to Web" in the Notion UI.Inheritance: Any page created inside this database automatically inherits the public permission of the parent.URL Construction: The public URL for a page can be predicted. It follows the format: https://[workspace-domain].notion.site/-.Note: The API returns the Page ID with dashes (UUID). The Node.js script must strip these dashes to construct the link for social media sharing.8.2 Third-Party Frontend LayersFor a professional "School" look, raw Notion pages may be insufficient. Tools like Super.so or Potion.so can be layered on top.Mechanism: These tools read the public Notion page and render it as a static HTML website with custom CSS, domains, and SEO optimization.Automation Benefit: Since these tools sync with Notion, the automation script's job remains unchanged—it just needs to populate the Notion page. The third-party tool handles the presentation layer automatically.9. ConclusionThe automation of Ovi English School's lesson pages represents a significant leap in operational efficiency. By treating Notion as a structured CMS rather than a simple note-taking app, the school can standardize its curriculum delivery, ensuring that every episode is accompanied by a high-quality, interactive study guide.This report has demonstrated that while the Notion API has strict constraints regarding block nesting and table structures, these can be effectively managed through intelligent software architecture. The Node.js solution provided offers a resilient, idempotent, and scalable pipeline that handles the complexity of rich media, vocabulary data, and grammar instruction.Implementing this system shifts the focus of the school's educators from data entry to content creation, ultimately providing a superior learning experience for students. The detailed code and architectural patterns outlined herein provide a complete roadmap for immediate deployment.References & CitationsAuthentication & SDK: Block Architecture & Nesting: Table & Schema Validation: Rate Limits & Resiliency: Media & File Uploads: Public Access & Workarounds: Page Properties & Database: 

---

## Claude Notes
_This section will be filled by Claude after reviewing the research._

- Status: Pending review
- Key findings: [to be filled]
- Action items: [to be filled]
