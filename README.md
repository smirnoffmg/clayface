# Clayface

**Clayface** is a Chrome extension built with [Plasmo](https://www.plasmo.com/) that helps job seekers adapt their CVs and generate tailored cover letters directly from job postings.  
Powered by [Claude API](https://www.anthropic.com/) via [LangChain](https://js.langchain.com/), it analyzes vacancy text on a page and reshapes the user's CV to highlight relevant skills and experience.

---

## Features
- Extracts job descriptions from web pages (e.g., LinkedIn, Wellfound, hh.ru).
- Uses AI to adapt your CV to match role requirements.
- Generates concise, personalized cover letters.
- Simple UI to review, copy, or download results.
- Secure API key management.

---

## Tech Stack
- **Plasmo** – framework for building Chrome extensions.
- **React** – extension UI.
- **TypeScript** – type safety and better development experience.
- **LangChain** – AI/LLM integration framework.
- **Claude API** – AI-powered text analysis and generation.

---

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start development server:
   ```bash
   pnpm dev
   ```
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

### Usage
1. Navigate to a job posting on LinkedIn, Wellfound, or hh.ru
2. Click the Clayface extension icon
3. Enter your Claude API key (first time only)
4. Click "Adapt CV to This Job"
5. Review and copy the adapted CV and cover letter

---

## Architecture

### Components
- **Content Script** (`content.ts`) - Extracts job descriptions from web pages
- **Popup UI** (`popup.tsx`) - Main user interface for the extension
- **LangChain Integration** (`claude-api.ts`) - Handles AI operations via Claude API

### Supported Job Sites
- LinkedIn Jobs (`linkedin.com/jobs/*`)
- Wellfound (`wellfound.com/jobs/*`)
- hh.ru (`hh.ru/vacancy/*`)

---

## Development

### Building
```bash
pnpm build
```

### Packaging
```bash
pnpm package
```

---

## Security
- API keys are stored locally and never transmitted to external servers
- All AI processing happens through official Claude API
- No job data is stored or transmitted

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License
MIT License - see LICENSE file for details.