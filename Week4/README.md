# Finance Tracker

A browser-based personal finance tracker with a ledger-inspired UI and AI-powered insights via Google Gemini.

## Features

- **Dashboard** — View your balance, total income, and total expenses at a glance
- **Add Transaction** — Log income or expenses with description, amount, category, and date
- **History** — Browse, search, and delete past transactions
- **Reports** — Visual breakdown of spending by category (Chart.js pie chart) with AI-generated insights
- **AI Assistant** — Ask plain-language questions about your finances (e.g. "How much did I spend on food this month?")
- **Settings** — Set a budget goal, choose your currency, or reset all data
- **Privacy-first** — All data stays in your browser's localStorage; nothing leaves your device

## Getting started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Setup

```bash
# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Then edit .env and paste your Gemini API key

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
Week4/
├── public/
│   ├── css/
│   │   └── style.css          # Design system & component styles
│   ├── js/
│   │   ├── storage.js         # localStorage CRUD helpers
│   │   └── ai.js              # AI API client
│   ├── index.html             # Landing page
│   ├── dashboard.html         # Balance, income & expenses overview
│   ├── add-transaction.html   # Transaction form
│   ├── history.html           # Transaction log with delete
│   ├── reports.html           # Category chart + AI insights
│   ├── assistant.html         # Chat-style AI assistant
│   └── settings.html          # Budget goal, currency, data reset
├── server.js                  # Express server proxying Gemini API
├── package.json
├── .env.example
└── .gitignore
```

## Tech stack

- **Frontend** — Vanilla HTML/CSS/JS (no framework)
- **Backend** — Express.js (serves static files + API proxy)
- **AI** — Google Gemini 2.5 Flash via `@google/generative-ai`
- **Charts** — Chart.js (CDN)
- **Storage** — Browser localStorage
- **Design** — Ledger-inspired: Fraunces (display), Inter (body), IBM Plex Mono (tabular data), brass + forest palette
