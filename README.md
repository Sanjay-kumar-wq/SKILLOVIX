# Skillovix ⚡
> Evolve your skills. Elevate your career.

Skillovix is an AI-powered career planning platform for engineering students.
Built with React, Tailwind CSS, Zustand, Recharts, and Claude AI.

## Features

- ⚡ Personalized Career Roadmaps
- 🔍 Skill Gap Analysis
- 📊 Progress Dashboard
- 💼 Project Recommendations
- 🤖 AI Career Mentor (Powered by Claude)
- 📊 Internship Readiness Score
- 📄 Resume Analyzer (ATS Scoring)
- ⚖️ Career Comparison Tool
- 👤 Profile Management

## Pages

| Route | Page |
|-------|------|
| `/` | Landing |
| `/login` | Login |
| `/register` | Register |
| `/assessment` | Career Assessment |
| `/dashboard` | Dashboard |
| `/roadmap` | Learning Roadmap |
| `/skill-gap` | Skill Gap Analysis |
| `/projects` | Project Lab |
| `/mentor` | AI Career Mentor |
| `/readiness` | Readiness Score |
| `/resume` | Resume Analyzer |
| `/compare` | Career Compare |
| `/profile` | My Profile |

## Setup

```bash
npm install
npm run dev
```

## AI Mentor Setup

Add your Claude API key to `.env`:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

> If no key is provided, the AI Mentor will use smart Skillovix fallback responses automatically.

## Tech Stack

- **React 19** — UI framework
- **Tailwind CSS v4** — Styling
- **Zustand** — State management with persistence
- **Recharts** — Data visualization
- **React Router v7** — Client-side routing
- **Lucide React** — Icons
- **Claude AI** (claude-sonnet-4-6) — AI Mentor backend

## Skillovix Brand

- ⚡ Lightning bolt is the Skillovix brand icon
- "Evolve" language used throughout instead of generic "complete/finish"
- Dark mode by default with light mode toggle
- Indigo/sky blue as primary brand colors
