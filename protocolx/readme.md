# ⚡ PROTOCOL-X — What Did I Miss?
> **Local-First AI Message Organiser & Executive Catch-Up Engine**  
> *Developed for the Challenge: "The Unread Problem — What Did I Miss?" (IEEE Computational Intelligence Society / Google)*

---

## 🎯 The Problem
In busy team chats (Slack, WhatsApp, Discord, Teams), unread message counts quickly spiral out of control. Critical deadlines, blockers, decisions, and personal mentions get buried under dozens of greetings, memes, and casual banter. Users are short on time and cannot spend 20 minutes scrolling through backlogs.

---

## 💡 The Solution: PROTOCOL-X
**PROTOCOL-X** is a **100% Local-First AI Micro-App** that triages long and chaotic conversations in seconds into three actionable streams:

| Stream | Purpose | Characteristics |
|---|---|---|
| 🔴 **Important** | Action Required | P0 blockers, direct `@mentions`, tight deadlines, decisions needing you |
| 🟡 **Not Required Now** | Read Later / FYI | Status updates, general announcements, non-blocking discussions |
| 🗑️ **Put to Trash** | Noise Filtered | Greetings (*"gm"*, *"morning"*), coffee runs, memes, casual small-talk |

### 🔒 100% Local-First Guarantee
- **Zero Cloud APIs**: All NLP heuristics, mention scans, deadline parsers, and summarization logic run **in-browser**.
- **Zero Data Leaks**: Conversations, summaries, and edits never leave your machine.
- **Auditable Privacy**: Includes an interactive Privacy Audit dashboard confirming **0 outbound network calls**.

---

## 🌟 Key Features

1. **⚡ 30-Second Executive Catch-Up**
   - High-level AI TL;DR synthesizing critical updates into a few digestible sentences.
   - **Editable**: Click on the executive summary to refine it, and save your custom edits locally.

2. **📌 Mention & Assignment Detection**
   - Configurable user profile handle (`@prashant`).
   - Automatically spots where you were tagged and highlights the message with glowing purple indicators.

3. **⏰ Deadlines & Cutoffs Extractor**
   - Parses times, dates, and temporal expressions (*"by 11:30 AM"*, *"before 1:00 PM today"*, *"SLA breach occurs at 14:45"*).
   - Click **"View ➔"** on any deadline to scroll and highlight the source message instantly.

4. **✅ Interactive Action Items Checklist**
   - Automatically extracts tasks (*"action item: update banner"*, *"deploy rollback migration"*).
   - Check off completed tasks with persistent state saved to browser storage.
   - Add custom action items via the **"+ Add Task"** button.

5. **🎛️ Tri-Column Kanban Board & Custom Triage**
   - Move any message between **Important**, **Not Required Now**, and **Trash** with 1 click.
   - Edit any message text inline to annotate notes or correct details.
   - Purge filtered noise with **"Purge Trash"**.

6. **💾 Save Changes & Local Persistence**
   - Every user edit (summary modifications, task completion, re-categorizations, custom tasks) is auto-synced to `localStorage`.
   - Dedicated **"💾 Save Changes"** button provides immediate confirmation toast.

7. **📥 Custom Chat Import & Live Simulation**
   - **Paste Chat**: Supports Slack, Discord, WhatsApp, and generic formats (`[10:30 AM] Alice: Message`).
   - **Live Msg Simulator**: Test incoming real-time messages and observe automated triage.
   - **Export Brief**: Download a clean, formatted Markdown report (`Executive_Briefing.md`).

8. **🎓 Student USN Authentication & Profile Customizer (Top-Right Corner)**
   - **Login & Logout with College USN**: Secure, on-device student authentication gating your personal triage workspace.
   - **Student Profile Management**: Click the top-right profile widget to edit Full Name, College USN, and Email ID.
   - **Avatar Customization**: Pick from a curated 12-avatar emoji/badge collection or upload a custom photo directly from your machine.
   - **Multi-User Isolation**: Each USN keeps its own private message prioritizations, checklists, and summary edits.
   - **1-Click USN Logout**: Logout with just your USN, returning to the college authentication portal.

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch (Zero Installation)
Simply open [`index.html`](file:///c:/Users/prash/OneDrive/Desktop/protocolx/index.html) in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Python Local Server
Run the included zero-dependency Python script:
```bash
python server.py
```
This serves the application on `http://localhost:8000` and automatically opens your browser.

---

## 📂 Project Architecture

```
protocolx/
├── index.html       # Single-page interface & executive dashboard
├── styles.css       # Next-gen glassmorphic dark design system
├── nlp-engine.js    # Client-side NLP parsing, scoring & summarization
├── presets.js       # Pre-packaged scenarios (Hackathon, P0 Outage, Product Launch)
├── app.js           # State manager, LocalStorage persistence & UI event loop
├── server.py        # Python standard library local web server
└── readme.md        # Comprehensive documentation
```
