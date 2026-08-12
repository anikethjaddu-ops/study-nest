# Study Nest

📚 DocNest — Cross-Platform Document Reader & Study Companion

A smart, beautiful document reader for Android, iPhone, and Windows that remembers where you left off, lets you take contextual notes, and helps you track your study habits.

🧭 Overview

DocNest is a cross-platform document management and reading app. It opens PDFs and other documents, resumes exactly where you left off, links private notes to each document, and gives you rich study analytics — all wrapped in a premium, modern UI.

🛠️ Tech Stack Recommendation

Platform	Framework	Language

Android + iPhone	Flutter	Dart

Windows Desktop	Flutter (desktop)	Dart

Shared Backend (optional)	Supabase or local SQLite	—

Notes Storage	.md files (local filesystem)	Markdown

PDF Rendering	pdfx / syncfusion_flutter_pdf	Flutter plugin

Why Flutter? Single codebase for all 3 platforms. Native performance. Rich plugin ecosystem. Beautiful UI with full custom control. No compromise on feel.

🗂️ App Structure & Views

1. 🏠 Home View

The first screen the user sees. Clean, modern, card-based layout.

Pinned Documents section at top (horizontal scroll cards)

Recently Opened list below (sorted by last opened time)

Each card shows:

Document thumbnail / type icon

Title

Last opened date & time

Reading progress bar (% read)

Pin/Unpin button

Quick-action menu (delete, share, view notes)

Greeting banner with time of day ("Good Evening, Aniketh 🌙")

Daily study streak badge

Quick Stats strip: today's reading time, docs opened today

2. 📁 All Documents View

Full library of every document imported into the app.

Filter bar: All | PDFs | DOCX | TXT | EPUB | Other

Sort options: Name | Date Added | Last Opened | Size | Progress

Search bar with live filtering

Grid / List toggle

Each document card shows progress, type badge, pinned status, note count

Multi-select mode: pin/unpin/delete multiple at once

Folder/Tag grouping (see Tags feature below)

3. 📖 Document Reader View

The core reading experience.

Clean full-screen reader with top/bottom navigation bars (auto-hide)

PDF: Smooth scrolling, zoom, text selection

DOCX/TXT: Formatted rich text view

Page indicator at bottom (current page / total)

Resume from last position automatically on open

Highlight text (with color options: yellow, green, pink, blue)

Search within document (Ctrl+F / tap search icon)

Bookmarks: tap bookmark icon to save current page

Reading mode themes: Light | Dark | Sepia

Font size / zoom controls

Table of Contents side drawer (for PDFs with TOC)

4. 💬 Notes Bubble & Notes System

The Bubble

A small floating action button (FAB) — circular, glowing, positioned bottom-right

Subtly animated (soft pulse) to indicate it's interactive

Tap → Notes panel slides up from bottom (like a bottom sheet)

Notes Panel UI

Shows all existing notes for this document as a beautiful markdown-rendered list

Each note is a bullet point with:

Timestamp (e.g., "Aug 12, 6:30 PM")

Page reference (auto-captured: "pg. 47")

The note text (rendered markdown)

Input area at the bottom: text field + Send button

Supports basic markdown in input (**bold**, *italic*, - list)

Send → appends a new - [timestamp] [pg.X] note text line to the .md file

Linking Notes to Documents

Each document gets its own notes file. The link is managed in the app's local database (SQLite):

📂 DocNest Storage

├── 📂 documents/          ← imported PDFs, DOCX, etc.

├── 📂 notes/

│   ├── abc123_notes.md    ← notes for document ID abc123

│   ├── def456_notes.md

│   └── ...

└── 📄 docnest.db          ← SQLite: documents table with id, path, notes_path, last_page, etc.

The .md notes file format:

markdown

# Notes — The Great Gatsby

## Session: Aug 12, 2026

- **[6:30 PM · pg. 12]** Gatsby represents the American Dream gone wrong

- **[6:45 PM · pg. 18]** The green light = hope and the unattainable past

- **[7:01 PM · pg. 24]** Daisy's voice is full of money — Fitzgerald's symbolism

## Session: Aug 10, 2026

- **[3:10 PM · pg. 5]** Nick is an unreliable narrator — subtle hints throughout

Notes Viewer (Full Page)

A dedicated "Notes" view per document

Renders the .md file as a beautiful, styled note page

Session groupings act as collapsible sections

Search within notes

Export notes as PDF or share as .md file

5. 📊 Stats & Activity View

Study Timer

Auto-timer starts when you open a document, pauses when you switch apps or lock screen

Manual Pomodoro Timer — set 25/50 min sessions with break reminders

Session duration saved per document per day

Statistics Dashboard

Today's reading time (hours:minutes)

Weekly activity heatmap (GitHub-style grid) — each day shows intensity of reading

Per-document stats: total time spent, sessions, pages covered, notes written

Reading speed estimate (pages/hour)

Top documents this week (bar chart)

Streak counter — consecutive days with reading activity

Most productive time of day (based on session timestamps)

Metadata Panel (per document)

Accessible from the document card or inside the reader:

File name, size, format

Date added to DocNest

Date modified (file system)

Total pages / word count

Author, Title (extracted from PDF metadata)

Reading progress (pages read / total)

Total study time logged

Number of highlights, bookmarks, notes

✨ Additional Features (Suggested)

🏷️ Tags & Collections

User-defined tags: "Physics", "Novel", "Work", "Research"

Color-coded tags appear on document cards

Filter documents by tag in All Documents view

🔖 Bookmarks View

Dedicated view listing all bookmarks across all documents

Click a bookmark → opens document at that page

🌟 Highlights & Annotations Export

Export all highlights from a PDF to a .md summary file

Great for revision notes

🔍 Global Search

Search across all document titles AND notes content

Shows which document a note belongs to

📤 Import Options

Open from Files app (iOS/Android)

Windows drag-and-drop

Import from cloud: Google Drive, OneDrive, Dropbox integration (future phase)

🌙 Themes

Light Mode — clean white/gray

Dark Mode — rich dark backgrounds

Sepia — warm reading mode

OLED Black — pure black for OLED screens

Custom accent color picker

🔔 Smart Reminders

"You haven't opened [Document] in 3 days" nudge

Daily reading goal reminder (configurable time)

Pomodoro break alerts

🔒 Lock / Privacy

App lock with biometrics (Face ID / fingerprint / Windows Hello)

Lock individual documents

☁️ Cloud Sync (Future Phase)

Sync reading positions, notes, and highlights across devices

End-to-end encrypted (Supabase + RLS)

📅 Reading Goals

Set a daily reading time goal (e.g., 30 minutes)

Progress ring on home screen

Weekly goal tracker

🤖 AI Summary (Future Phase)

"Summarize this chapter" button using on-device or API-based LLM

AI can answer questions about the document

🗃️ Data Model (SQLite Schema)

sql

-- Documents table

CREATE TABLE documents (

  id TEXT PRIMARY KEY,          -- UUID

  title TEXT,

  file_path TEXT,               -- local path

  file_type TEXT,               -- pdf, docx, txt, epub

  notes_path TEXT,              -- path to linked .md notes file

  last_opened_at DATETIME,

  date_added DATETIME,

  last_page INTEGER DEFAULT 1,

  total_pages INTEGER,

  is_pinned BOOLEAN DEFAULT 0,

  total_read_time_seconds INTEGER DEFAULT 0,

  highlight_count INTEGER DEFAULT 0,

  bookmark_count INTEGER DEFAULT 0,

  tags TEXT                     -- JSON array of tag names

);

-- Reading sessions

CREATE TABLE sessions (

  id TEXT PRIMARY KEY,

  document_id TEXT REFERENCES documents(id),

  started_at DATETIME,

  ended_at DATETIME,

  duration_seconds INTEGER,

  pages_covered INTEGER

);

-- Bookmarks

CREATE TABLE bookmarks (

  id TEXT PRIMARY KEY,

  document_id TEXT REFERENCES documents(id),

  page_number INTEGER,

  label TEXT,

  created_at DATETIME

);

-- Highlights

CREATE TABLE highlights (

  id TEXT PRIMARY KEY,

  document_id TEXT REFERENCES documents(id),

  page_number INTEGER,

  selected_text TEXT,

  color TEXT,

  created_at DATETIME

);

-- Tags

CREATE TABLE tags (

  id TEXT PRIMARY KEY,

  name TEXT UNIQUE,

  color TEXT

);

📱 UI Design Language

Property	Value

Font	Inter (body) + Fraunces (headings)

Primary Color	Deep Indigo #4F46E5

Accent	Violet #7C3AED

Background (Dark)	#0F0F1A

Surface	#1A1A2E

Card	#252540

Success	#10B981

Text	#E2E8F0

Corner Radius	16px (cards), 24px (sheets)

Animations	Spring physics, fade-slide transitions

Icons	Lucide Icons (consistent, clean)

🚀 Development Phases

Phase 1 — Core (MVP)

 Flutter project setup (Android + iOS + Windows)

 SQLite database setup (sqflite package)

 File import (PDF + TXT support)

 PDF Viewer with page position save/restore

 Home View (recent + pinned)

 All Documents View

 Notes Bubble + Notes Panel

 .md notes file creation and linking

 Notes Viewer with markdown rendering

Phase 2 — Study Tools

 Auto study timer (session tracking)

 Pomodoro timer UI

 Stats dashboard (weekly heatmap, per-doc stats)

 Metadata panel

 Highlights & bookmarks

 Tags system

Phase 3 — Polish & Power Features

 Global search (docs + notes)

 Theme switcher (Light/Dark/Sepia/OLED)

 Reading goals & streaks

 Smart reminders / notifications

 DOCX / EPUB support

 Biometric app lock

 Export notes as PDF

Phase 4 — Cloud & AI

 Supabase cloud sync

 Google Drive / OneDrive import

 AI chapter summary

 AI Q&A on document

❓ Open Questions for You

Cloud sync: Do you want documents synced across your phone and laptop, or is local-only fine for now?

DOCX support: Do you primarily read PDFs, or do you also use Word docs, EPUBs, text files? (Affects which parsers we prioritize)

Notes style: Should notes be global (one notebook for everything) or per-document only (as described)? Or both?

Collaboration: Is this a solo personal tool, or do you want sharing/collaboration features?

Offline-first: Should everything work 100% offline always, with optional sync?

Starting point: Should we start building Phase 1 now with Flutter, or do you want a clickable prototype/mockup first?

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/14b981b7-6040-4234-aebf-b5590851fcc4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
