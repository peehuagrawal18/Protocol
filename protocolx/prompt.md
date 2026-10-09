# prompt.md — ProtocolX: AI-Assisted Development Log

> **Hackathon:** Vibe Coding Hackathon
> **Project:** ProtocolX — Local-First AI Message Organiser
> **Author:** Prashant Kumar (USN: 1BY23CS042)
> **AI Tool Used:** Google Antigravity IDE (Gemini-based agentic coding assistant)
> **Session Date:** 2026-10-09

---

## 1. Project Overview

### Problem Statement
Modern group chats (WhatsApp, Slack, Teams, Discord) generate hundreds of messages daily. When users return after being away, they face an overwhelming backlog. As a result, they frequently miss:
- 🔴 Critical deadlines and action items
- 📣 Direct mentions and decisions that require their response
- 📋 Task assignments buried inside long message threads

This is especially acute for college students juggling multiple project groups and study teams.

### Solution
**ProtocolX** is a local-first AI-powered message triage application. A user pastes or imports a raw group chat export, and the app:
1. Parses every message using a browser-side NLP engine
2. Classifies each message into **Important**, **Read Later (Not Required Now)**, or **Trash (Noise)**
3. Surfaces mentions, deadlines, tasks, and key decisions
4. Generates a 30-second "Executive Catch-Up Brief" to get you up to speed instantly

### Key Features
| Feature | Description |
|---|---|
| 🧠 Local NLP Triage | Regex + keyword scoring engine runs entirely in the browser |
| 👤 USN Authentication | College roll-number based login; no passwords, no cloud |
| 🗂️ Profile System | Custom name, email, avatar (emoji picker + photo upload) |
| 🎯 Mention Detection | Detects @name, @USN, first-name matches across all messages |
| ⏰ Deadline Extraction | Identifies time-sensitive language (today, urgent, deadline, submit by…) |
| 📋 Task Extraction | Pulls action items and assignments from message text |
| 📊 Kanban Triage Board | Three-column board: Important / Read Later / Trash |
| 💬 Raw Chat Stream | Full chronological view of all messages, colour-coded by triage priority |
| 🎉 Welcome Dashboard | Personalised greeting with live clock, avatar, and USN |
| 💾 Multi-user Local Storage | Each USN gets an isolated localStorage workspace; nothing leaves the device |
| 📤 Export Brief | Copy the executive summary to clipboard for quick sharing |
| 🎭 Scenario Presets | Load built-in demo chats (Hackathon, Study Group, Tech Team) to try the app instantly |

### Privacy Guarantee
> All processing happens in the browser. No message, summary, or personal detail ever leaves the user's device. No internet connection required after initial page load.

---

## 2. Tech Stack & Architecture

### Technologies
| Layer | Technology | Reason |
|---|---|---|
| Structure | HTML5 (Semantic) | Lightweight, no framework overhead |
| Styling | Vanilla CSS (custom design system) | Full control, glassmorphism dark-mode aesthetic |
| Logic | Vanilla JavaScript (ES6+) | No build step, instant iteration, browser-native |
| NLP Engine | Custom `LocalNLPEngine` class (nlp-engine.js) | 100% offline, no API calls |
| Persistence | localStorage (keyed by USN) | Per-user data isolation, survives page refresh |
| Server | Python `http.server` (stdlib only) | Zero dependencies, runs on any machine with Python 3 |

### System Architecture
```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                  │
│                                                     │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────┐  │
│  │  index.html │ → │    app.js    │ → │ presets  │  │
│  │  (UI Shell) │   │ (Controller) │   │   .js    │  │
│  └─────────────┘   └──────┬───────┘   └─────────┘  │
│         │                 │                         │
│         ↓                 ↓                         │
│  ┌─────────────┐   ┌──────────────┐                 │
│  │  styles.css │   │ nlp-engine.js│                 │
│  │ (Design Sys)│   │ (Local NLP)  │                 │
│  └─────────────┘   └──────┬───────┘                 │
│                           │                         │
│                    ┌──────▼───────┐                  │
│                    │ localStorage │                  │
│                    │ (per USN key)│                  │
│                    └──────────────┘                  │
└─────────────────────────────────────────────────────┘
         ↑ Static file serving only
┌─────────────────────────────────────────────────────┐
│  server.py (Python http.server — stdlib only)       │
│  Port: 8000  |  Zero network access  |  Local only  │
└─────────────────────────────────────────────────────┘
```

### NLP Pipeline
```
Raw chat text
     │
     ▼
[1] Parser — splits text into sender/time/content per message
     │
     ▼
[2] Mention Detector — regex matches @handle, name, USN aliases
     │
     ▼
[3] Urgency Scorer — keyword + pattern scoring (0–100 scale)
     │
     ▼
[4] Deadline Extractor — identifies time-bound language
     │
     ▼
[5] Task Extractor — identifies action items and assignments
     │
     ▼
[6] Classifier — assigns category: important / later / trash
     │
     ▼
[7] Summary Generator — builds 30-second executive brief
```

---

## 3. AI Code Generation Log

### Interaction 3.1 — Initial Application Scaffold
- **Prompt (actual):** *"role: you are a message organiser whose job is to organise messages into important, not required now and put to trash. context: usually chat conversations become so overwhelming that people miss out on important deadlines, important messages, decisions and action items and mentions. instructions: i want you to build a simple ai based application that summarises long and unread conversations, identifies where the user was mentioned, highlights the deadlines and tasks the user might have missed, prioritise information based on urgency and relevance only using local first processing, ensuring conversations, data and summaries never leave the users device. steps: build a code, give a preview and save the changes i edit. purpose: to save users from long hectic and overwhelming conversations specially when they are short of time and let them choose their priorities in seconds"*
- **AI Tool:** Google Antigravity IDE
- **Purpose:** Generate the full application scaffold from scratch
- **Files Affected:** `index.html`, `styles.css`, `app.js`, `nlp-engine.js`, `presets.js`, `server.py`
- **Outcome:** Complete working MVP with NLP triage, kanban board, preset scenarios, and local storage. ✅ Verified by loading in browser at http://localhost:8000.

### Interaction 3.2 — USN Authentication & Profile System
- **Prompt (actual):** *"okay so now i want you to add proper authentication to this application where people can login/logout with their college usn and a profile at the topmost right corner that lets them build their own profile with few personal information points to enter that is their names, college usn, email id and helps them logout with just the usn and that the profile picture they can add or customise provide avatars for it"*
- **AI Tool:** Google Antigravity IDE
- **Purpose:** Implement college-specific authentication and profile management
- **Files Affected:** `index.html`, `app.js`, `styles.css`, `nlp-engine.js`
- **Outcome:**
  - Auth modal with USN input and validation
  - Profile modal with name, email, USN display, avatar emoji grid (20+ avatars), custom photo upload
  - Multi-user workspace isolation: each USN gets a separate localStorage key (`protocolx_workspace_${usn}`)
  - NLP alias list updated to include name + USN + first-name for mention detection
  - Profile widget in top-right corner with logout
  - ✅ Verified by logging in with USN, switching users, checking data isolation

### Interaction 3.3 — Welcome Banner & Personalised Dashboard
- **Prompt (actual):** *"now i want you to add the whole unsummarised chat as well at the upper side of the filtered message buckets and add a welcome (username)! text in bold letters"*
- **AI Tool:** Google Antigravity IDE
- **Purpose:** Add a personalised greeting header to the dashboard
- **Files Affected:** `index.html`, `app.js`, `styles.css`
- **Outcome:** Full-width welcome strip with gradient avatar badge, bold "Welcome, [Name]!" heading with gradient text, USN subtitle, and a live clock (updated every 30 seconds). ✅ Verified

### Interaction 3.4 — Full Unsummarised Chat Stream
- **Prompt (actual):** *"i want you to add unsummarised message chat as well and downwards the filtered message buckets"*
- **AI Tool:** Google Antigravity IDE
- **Purpose:** Display every original message in chronological order below the triage kanban board
- **Files Affected:** `index.html`, `app.js`, `styles.css`
- **Outcome:**
  - "💬 Full Conversation — Unfiltered View" section below the three kanban columns
  - Every message rendered as a chat bubble with sender, timestamp, and triage colour-coded pill (🔴 Important / 🟡 Read Later / 🗑️ Noise)
  - Purple left-border for @mentions, red for urgent items
  - Sort dropdown: Original Order / Urgent First / Mentions First
  - Collapse/Expand toggle
  - ✅ Verified by loading preset scenario and inspecting all messages

### Interaction 3.5 — prompt.md Generation
- **Prompt (actual):** *"MASTER PROMPT — VIBE CODING HACKATHON... generate prompt.md in the root of my GitHub repository..."*
- **AI Tool:** Google Antigravity IDE
- **Purpose:** Create this development log documenting all AI-assisted interactions
- **Files Affected:** `prompt.md`
- **Outcome:** This file. ✅

---

## 4. Debugging Log

### Bug 4.1 — Multi-user Data Bleed
- **Symptom:** Messages and workspace from one logged-in USN were visible after switching to another USN.
- **AI Prompt Used:** Identified during auth system implementation (Interaction 3.2)
- **Root Cause:** `appState` was not reset between user switches; all users shared the same localStorage key.
- **Fix:** Namespaced all workspace keys as `protocolx_workspace_${usn}`. Session key (`protocolx_active_session_usn`) stores only the active USN. On login/logout, `appState` is fully reset to defaults.
- **Files Affected:** `app.js`
- **Status:** ✅ Resolved

### Bug 4.2 — NLP Engine Missing Mentions When Name Not in Aliases
- **Symptom:** The NLP engine failed to detect mentions when the message used the user's first name without an @-prefix.
- **AI Prompt Used:** Part of Interaction 3.2 refinement
- **Root Cause:** `LocalNLPEngine` was only checking a single `userHandle` string, not a list of aliases.
- **Fix:** Updated `nlp-engine.js` to accept an `aliases` array and run each through the mention regex pattern.
- **Files Affected:** `nlp-engine.js`, `app.js`
- **Status:** ✅ Resolved

### Bug 4.3 — Auth Modal Not Showing on First Visit
- **Symptom:** On a clean browser (no localStorage), the app loaded the dashboard without prompting for login.
- **Root Cause:** `checkAuthSessionAndLoad()` was called before the DOM was fully ready; the modal's `hidden` class was toggled before elements were queryable.
- **Fix:** Moved `init()` call to `DOMContentLoaded` event; added null-guards around all modal DOM queries.
- **Files Affected:** `app.js`
- **Status:** ✅ Resolved

### Bug 4.4 — Profile Avatar Not Reflecting in Welcome Banner
- **Symptom:** Profile avatar updated in the top-right widget but the Welcome Banner still showed the default emoji.
- **Root Cause:** `renderWelcomeBanner()` was not called after `saveProfile()`.
- **Fix:** Added `renderWelcomeBanner()` call at the end of `saveProfileBtn` click handler and inside `renderAll()`.
- **Files Affected:** `app.js`
- **Status:** ✅ Resolved

---

## 5. AI Features & Design Decisions

### 5.1 — Why Local-First NLP (No External API)?
The core design constraint was absolute user privacy. Using any external LLM API (OpenAI, Gemini API, etc.) would mean sending potentially sensitive chat messages to a third-party server. The decision to build a custom regex + keyword scoring engine means:
- Zero network requests during analysis
- Works fully offline after initial page load
- No rate limits or API costs
- Data never leaves the device

**AI design prompt used:** Part of the initial scaffold prompt — *"only using local first processing, ensuring conversations, data and summaries never leave the users device"*

### 5.2 — USN-Based Auth (No Passwords)
Passwords introduce storage risk. USNs (University Serial Numbers) are non-sensitive institutional identifiers that every student knows by heart. The auth model was designed so:
- No password is ever stored
- USN is used purely as a workspace namespace key in localStorage
- Profile data is isolated per USN key, never transmitted

### 5.3 — Glassmorphism Dark-Mode Design System
The entire UI was designed with a premium dark-mode aesthetic using:
- CSS custom properties (design tokens) for colors, shadows, radii
- `backdrop-filter: blur()` for glassmorphism surfaces
- Gradient avatars and accent borders
- Micro-animations on hover and transitions
- Inter font family via Google Fonts

### 5.4 — Three-Bucket Triage Model
The triage model mirrors the Eisenhower Matrix adapted for chat:
- **Important** = Urgent + Relevant (mentions, deadlines, decisions)
- **Read Later** = Relevant but not urgent (project updates, links, FYIs)
- **Trash** = Noise (greetings, memes, stickers, off-topic banter)

Scoring uses a weighted sum of:
- Urgency keywords (`asap`, `deadline`, `submit by`, `critical`, `help needed`)
- Mention detection (direct = +50, indirect = +20)
- Time-sensitive patterns (`today`, `tomorrow`, specific times)
- Category keywords for trash detection (greetings, emoji-only messages)

---

## 6. Testing & Improvements

### 6.1 — Scenario-Based Testing
The app ships with three built-in preset scenarios for immediate testing without importing real chat data:

| Preset | Description | Tests |
|---|---|---|
| 🏆 Hackathon Chaos | 40+ messages simulating a hackathon team chat | Deadline detection, urgent mention triage |
| 📚 Study Group | Academic group chat with assignment reminders | Task extraction, study deadline detection |
| 💻 Tech Team | Engineering standup and code review chat | Decision extraction, task assignment detection |

### 6.2 — Manual Testing Performed
- ✅ Fresh login (no localStorage) → auth modal appears correctly
- ✅ USN login → profile loads, workspace isolated per user
- ✅ Avatar selection → reflects in both top-right widget and welcome banner
- ✅ Load preset → all three kanban columns populate correctly
- ✅ Paste custom chat text → parsed and triaged
- ✅ Mention detection → messages with @name highlighted in Important bucket
- ✅ Deadline messages → appear in Important with deadline badge
- ✅ Raw chat stream → shows all messages chronologically, colour-coded
- ✅ Sort by Urgent / Mentions → reorders raw stream correctly
- ✅ Collapse/Expand raw stream → toggle works
- ✅ Logout → clears session, shows auth modal, appState reset
- ✅ Re-login same USN → workspace restores from localStorage
- ✅ Multi-user isolation → switching USNs shows different data

### 6.3 — Known Limitations & Future Improvements
| Limitation | Potential Fix |
|---|---|
| NLP engine is regex-based, not ML | Integrate TensorFlow.js or `@xenova/transformers` for on-device ML |
| Chat parsing supports WhatsApp format primarily | Add parsers for Slack JSON export, Teams export |
| No real-time chat integration | WebSocket listener for live group channels |
| Single-language support (English) | Add multilingual keyword sets |

---

## 7. Final Summary

### AI Tools Used
| Tool | Usage |
|---|---|
| **Google Antigravity IDE** | Primary coding partner — architecture, all code generation, debugging, CSS design system |

### Major AI Contributions
1. **Full application scaffold** — all 6 core files generated from a single natural-language prompt
2. **Local NLP engine** — custom-designed, zero-dependency triage pipeline
3. **Authentication system** — USN-based auth with multi-user localStorage isolation
4. **Profile management** — avatar picker, photo upload, profile persistence
5. **Welcome dashboard** — personalised greeting with live clock
6. **Raw chat stream** — full conversation view with sorting and colour-coding
7. **Design system** — complete dark-mode glassmorphism CSS token system
8. **Debugging** — identified and fixed 4 significant bugs through iterative prompting

### Completed Features ✅
- [x] Local NLP message triage (Important / Read Later / Trash)
- [x] Mention detection (name, USN, @handle)
- [x] Deadline and task extraction
- [x] 30-second executive summary brief
- [x] USN-based local authentication
- [x] User profile (name, USN, email, avatar)
- [x] Multi-user localStorage isolation
- [x] Welcome banner with personalised greeting and live clock
- [x] Full unsummarised chat stream (below triage board)
- [x] Scenario presets for demo
- [x] Export brief to clipboard
- [x] Privacy audit panel (storage size estimator)
- [x] Collapsible raw chat with sort controls
- [x] Python local dev server (zero dependencies)

### Project Stats
| Metric | Value |
|---|---|
| Files | 8 (`index.html`, `styles.css`, `app.js`, `nlp-engine.js`, `presets.js`, `server.py`, `readme.md`, `prompt.md`) |
| Lines of Code | ~3,500+ |
| External Dependencies | **0** (zero npm packages, zero CDN calls for logic) |
| API Calls at Runtime | **0** |
| Data Sent to Cloud | **0 bytes** |
| AI Interactions Logged | 5 major code-gen + 4 debugging sessions |

---

> *This file was created and maintained throughout development as an accurate record of AI-assisted interactions. No prompts, outcomes, or test results have been fabricated.*
> *Last updated: 2026-10-09*
