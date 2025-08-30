# Clayface

Chrome extension that adapts CVs and generates cover letters from job postings using Claude AI.

## Features

- Extract job descriptions from LinkedIn, Wellfound, hh.ru
- AI-powered CV adaptation to match role requirements
- Generate personalized cover letters
- Local API key storage with secure management

## Quick Start

**Prerequisites:** Node.js 18+, [Claude API key](https://console.anthropic.com/)

```bash
git clone https://github.com/smirnoffmg/clayface
cd clayface
pnpm install
pnpm dev
```

**Load in Chrome:**

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. "Load unpacked" → select `build/chrome-mv3-dev`

## Usage

1. Navigate to a job posting
2. Click Clayface extension icon
3. Enter Claude API key (first time)
4. Click "Adapt CV to This Job"
5. Review and copy results

## Tech Stack

- **Framework:** Plasmo
- **UI:** React + TypeScript
- **AI:** Claude API via LangChain
- **Supported sites:** LinkedIn Jobs, Wellfound, hh.ru

## Build

## Privacy

- API keys stored locally only
- No data transmission except to Claude API
- No job data persistence

## License

MIT
