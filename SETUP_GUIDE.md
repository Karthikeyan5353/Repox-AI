# RepoX AI - Complete Setup & Usage Guide

A personal developer tool for AI-powered code reviews, inspired by CodeRabbit. Real GitHub integration + OpenAI analysis. No authentication required.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 16+ (with npm)
- **GitHub Personal Access Token** (PAT)
- **OpenAI API Key**

### 2. Installation

```bash
# Clone or navigate to the project
cd d:\Repox-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
npm install @monaco-editor/react axios lucide-react react-router-dom recharts

# Return to root
cd ..
```

### 3. Environment Setup

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
BACKEND_PORT=4000
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174
APP_SECRET=your-random-secret-min-32-chars-long
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4.1-mini
```

#### Getting GitHub PAT
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Add scopes: `repo`, `read:user`, `user:email`
4. Copy and paste into `.env`

#### Getting OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy and paste into `.env`

---

## 🔧 Running the Project

### Option A: Run Everything Together
```bash
npm run dev
```
This starts both backend and frontend concurrently.

### Option B: Run Separately
**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Runs on http://localhost:5173 (or 5174 if 5173 is in use)
```

---

## 📱 Using the Application

### 1. **Integrations Page** (First)
`http://localhost:5173/integrations`

- Paste GitHub PAT
- Paste OpenAI API Key (model: `gpt-4.1-mini` or `gpt-4-turbo`)
- Click "Save" on each

### 2. **Repositories Page** (Second)
`http://localhost:5173/repositories`

- Click **"Sync all"** to fetch all your GitHub repositories
- OR paste a repo URL and click **"Add repo"** for a specific one
- Select a repo to browse its files
- Click **"Review file"** to get AI insights on any file

### 3. **Reviews Page** (Main Feature)
`http://localhost:5173/reviews`

- Select Repository → Pull Request
- Click **"Review PR"** to run AI analyzer
- See summary and inline issues in right panel
- Click **"Post comments to GitHub"** to send review back to GitHub

### 4. **Dashboard**
`http://localhost:5173/dashboard`

- View overall metrics (repo count, merged PRs, etc.)
- Toggle between 7-day and 30-day views

### 5. **Learnings**
`http://localhost:5173/learnings`

- AI learns from patterns across reviews
- View frequently found issues
- Export as CSV for team reference

### 6. **Reports**
`http://localhost:5173/reports`

- Quality trends over time
- Review frequency charts
- Issue category breakdown

---

## 🔌 API Endpoints (Backend)

### Settings
- `GET  /api/settings/status` - Check connections
- `POST /api/settings/github` - Save GitHub PAT
- `POST /api/settings/openai` - Save OpenAI key

### Repositories
- `GET  /api/repositories` - List synced repos
- `POST /api/repositories/sync` - Pull from GitHub
- `GET  /api/repositories/:id` - Get repo details
- `GET  /api/repositories/:id/tree` - File explorer
- `GET  /api/repositories/:id/file?path=x` - Read file content
- `POST /api/repositories/:id/review-file` - AI review single file

### Pull Requests
- `GET  /api/pull-requests/:repoId` - List PRs
- `GET  /api/pull-requests/:repoId/:number` - PR details + diff
- `POST /api/pull-requests/:repoId/:number/review` - AI review PR
- `POST /api/pull-requests/comments/post` - Post review to GitHub

### Analytics
- `GET  /api/dashboard` - Dashboard metrics
- `GET  /api/reports` - Trends and charts

### Learnings
- `GET  /api/learnings` - List patterns
- `GET  /api/learnings/export.csv` - Export CSV

---

## 📊 Data Storage

- **Location:** `backend/data/store.json`
- **Format:** Plain JSON (no database needed)
- **Auto-created:** On first run
- **Stores:**
  - Synced repositories
  - Pull requests
  - AI reviews
  - Learnings/patterns
  - Settings (encrypted tokens)

---

## 🤖 AI Review Features

### Code Analysis
The AI reviews code for:
- **Bugs** - Logic errors, edge cases
- **Security** - Vulnerabilities, injection risks
- **Performance** - Inefficiency, memory leaks
- **Quality** - Style, maintainability
- **Best Practices** - Patterns, standards

### How It Works
1. Fetches PR diff from GitHub
2. Sends changed files to OpenAI
3. AI analyzes each file batch (to stay under token limits)
4. Merges results into unified review
5. Stores learnings for future reviews
6. Posts inline comments to GitHub PR

---

## 🔐 Security Notes

- **Tokens:** Encrypted locally with AES-256-CBC
- **No Server:** All data stays on your machine
- **No Cloud Sync:** Personal use only
- **Environment:** Never commit `.env` to git

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
BACKEND_PORT=4001

# Or kill process on port 4000
npx kill-port 4000
```

### OpenAI Rate Limited
- Reduce batch size in `reviewService.js` (splitIntoBatches)
- Use `gpt-3.5-turbo` instead of `gpt-4`
- Add delays between reviews

### GitHub API Rate Limited
- GitHub allows 60 requests/hour unauthenticated
- With PAT: 5,000 requests/hour
- Check limits: `GET /rate_limit`

### Can't Post Comments to GitHub PR
- Verify PAT has `repo` scope
- PR must be in your own repo or organization
- Bot can't comment on archived repos

### Files Not Loading
- Check file encoding (UTF-8 required)
- Large files (>1MB) may fail - GitHub limits at 100MB
- Binary files won't display in editor

---

## 📦 Project Structure

```
backend/
├── controllers/      # Request handlers
├── routes/          # API endpoints
├── services/        # Business logic (GitHub, OpenAI, Analytics)
├── models/          # Data schemas
├── utils/           # Helpers (diffParser, encryption, asyncHandler)
├── data/            # store.json (auto-created)
└── index.mjs        # Express app

frontend/
├── components/      # Reusable UI (Ui.jsx, AppShell.jsx)
├── pages/          # Page components (ReviewsPage, RepositoriesPage, etc.)
├── services/       # API client wrappers
├── hooks/          # Custom hooks (useAsyncData)
├── utils/          # Formatters, helpers
└── main.jsx        # React entry point
```

---

## 🚀 Production Notes

For production deployment:

1. **Use real secrets:**
   ```bash
   APP_SECRET=$(openssl rand -base64 32)
   ```

2. **Use production model:**
   ```bash
   OPENAI_MODEL=gpt-4-turbo
   ```

3. **Backup data:**
   ```bash
   cp backend/data/store.json store.json.backup
   ```

4. **Use process manager:**
   ```bash
   npm install -g pm2
   pm2 start backend/index.mjs --name "repox-api"
   ```

---

## 📝 Example: Full Review Workflow

1. **Connect GitHub & OpenAI** → Integrations page
2. **Sync repositories** → Repositories page → Click "Sync all"
3. **Review code in repo** → Repositories page → Explorer → Select file → "Review file"
4. **Review PR** → Reviews page → Select repo/PR → "Review PR"
5. **Post to GitHub** → "Post comments to GitHub"
6. **Check learnings** → Learnings page → See patterns
7. **View trends** → Reports page → See metrics

---

## 🎯 Key Features Checklist

- ✅ Real GitHub API integration
- ✅ Real OpenAI code review
- ✅ Pull request review & inline comments
- ✅ Single file review & explorer
- ✅ Learnings system (patterns)
- ✅ Analytics dashboard
- ✅ Reports & trends
- ✅ Local JSON data (no MongoDB)
- ✅ Encrypted token storage
- ✅ NO authentication required
- ✅ NO pricing/billing
- ✅ Personal developer tool

---

## 🆘 Support

For issues:
1. Check backend logs: `npm run dev:backend`
2. Check browser DevTools → Network tab
3. Verify `.env` values
4. Try with test repo first
5. Check token scopes on GitHub

---

## 📄 License

Personal use only. Built for developers. No SaaS nonsense.
