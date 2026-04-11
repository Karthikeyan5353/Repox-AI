# RepoX AI - AI-Powered Code Review Platform

A **complete, production-ready code review platform** inspired by CodeRabbit. Personal developer tool with real GitHub integration and OpenAI analysis. No authentication, no pricing, no SaaS.

> **Build → Sync GitHub → Review PRs → Get AI Insights → Post Comments**

---

## ✨ Features

### 🔗 Real GitHub Integration
- Sync repositories (public/private)
- Browse file explorer
- View pull request diffs (side-by-side)
- Post inline comments to GitHub PRs
- Fetch commits, branches, pull requests

### 🤖 AI Code Review Engine
Analyzes code for:
- **Bugs** - Logic errors, edge cases, null checks
- **Security** - Vulnerabilities, injection risks
- **Performance** - Inefficiency, memory leaks
- **Quality** - Style guides, maintainability
- **Best Practices** - Patterns, standards

### 📊 Analytics Dashboard
- Active repositories counter
- Merged PRs tracking
- Median merge time
- Reviewer time saved
- Severity distribution (low/medium/high)
- 7-day and 30-day views

### 📚 Learnings System
- Tracks common issues across reviews
- Smart pattern recognition
- Usage frequency tracking
- Export learnings as CSV
- Improves AI with each review

### 📈 Reports & Trends
- Code quality scores over time
- Review frequency charts
- Issue category breakdown
- Historical trend analysis

### 🎨 Full-Featured UI
- Dark theme (similar to CodeRabbit)
- Side-by-side diff viewer (Monaco Editor)
- Real-time file explorer
- Syntax highlighting
- Responsive design

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express.js** - REST API
- **GitHub REST API** - Repository access
- **OpenAI API** - Code analysis
- **AES-256 Encryption** - Secure token storage
- **JSON-based storage** - No database

### Frontend
- **React 18 + Vite** - Fast development
- **Monaco Editor** - Code viewing & diffing
- **Tailwind CSS** - Styling
- **Recharts** - Analytics
- **React Router** - Navigation

---

## ⚡ Quick Start

### 1. Setup

```bash
cd d:\Repox-AI
cp .env.example .env  # Edit with your tokens

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure `.env`

```env
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4.1-mini
APP_SECRET=your-random-secret-key-min-32-chars
BACKEND_PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
```

**Get tokens at:**
- GitHub PAT: https://github.com/settings/tokens
- OpenAI Key: https://platform.openai.com/api-keys

### 3. Run

```bash
npm run dev
```

Opens at `http://localhost:5173` 🎉

---

## 📖 Complete Guide

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for:
- ✅ Detailed setup instructions
- ✅ API endpoint reference
- ✅ Example workflows
- ✅ Troubleshooting guide
- ✅ Data storage details
- ✅ Production deployment

---

## 🎯 Main Workflows

### Review a PR
1. **Integrations** → Add GitHub PAT + OpenAI key
2. **Repositories** → "Sync all"
3. **Reviews** → Select PR
4. **"Review PR"** → AI analyzes
5. **"Post comments to GitHub"** → Sends findings

### Review Single File
1. **Repositories** → Select repo  
2. **Explorer** → Pick file
3. **"Review file"** → AI analyzes

### Browse Learnings
1. Run some PR reviews
2. **Learnings** → See patterns
3. **"Export CSV"** → Share with team

---

## 🔐 Security

- ✅ **Local-only** - No cloud sync
- ✅ **Encrypted tokens** - AES-256-CBC
- ✅ **No database** - JSON storage
- ✅ **No authentication** - Personal use
- ✅ **Environment variables** - Never exposed

---

## 📊 Data Stored

```json
{
  "repositories": [ ],
  "pullRequests": [ ],
  "reviews": [ ],
  "learnings": [ ],
  "settings": [ ]
}
```

Auto-created at `backend/data/store.json`

---

## 📝 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/settings/status` | Check integrations |
| POST | `/api/settings/github` | Save GitHub PAT |
| POST | `/api/settings/openai` | Save OpenAI key |
| GET | `/api/repositories` | List repos |
| POST | `/api/repositories/sync` | Sync from GitHub |
| GET | `/api/repositories/:id` | Repo details |
| GET | `/api/repositories/:id/tree` | File explorer |
| GET | `/api/repositories/:id/file` | Read file |
| POST | `/api/repositories/:id/review-file` | Review file |
| GET | `/api/pull-requests/:repoId` | List PRs |
| GET | `/api/pull-requests/:repoId/:number` | PR details |
| POST | `/api/pull-requests/:repoId/:number/review` | Review PR |
| POST | `/api/pull-requests/comments/post` | Post to GitHub |
| GET | `/api/dashboard` | Metrics |
| GET | `/api/reports` | Trends |
| GET | `/api/learnings` | Patterns |
| GET | `/api/learnings/export.csv` | Export CSV |

---

## 🚀 Development

```bash
npm run dev              # Start both
npm run dev:backend    # Backend only  
npm run dev:frontend   # Frontend only
npm run build          # Build for production
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change `BACKEND_PORT=4001` in `.env` |
| GitHub token invalid | Regenerate at https://github.com/settings/tokens |
| OpenAI rate limited | Use `gpt-3.5-turbo` or wait 60 seconds |
| No comments posting | Verify PAT has `repo` scope |
| File not loading | Check size (<100MB) and UTF-8 encoding |

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for more solutions.

---

## 🎓 Key Systems

### PR Review Pipeline
```
GitHub PR → Fetch diff → Split batches → OpenAI analysis
→ Parse results → Filter changed lines → Store review
→ Update learnings → Post comments (optional)
```

### Learnings System
```
After each review → Extract issues → Create patterns
→ Increment usage count → Store learnings
→ Future reviews reference learnings for better analysis
```

### Analytics Engine
```
Collect reviews → Aggregate metrics → Calculate trends
→ Generate charts → Dashboard & Reports
```

---

## 📁 Project Structure

```
backend/
├── controllers/       # HTTP request handlers
├── routes/           # API endpoints
├── services/
│   ├── githubService.js         # GitHub API
│   ├── openaiService.js         # OpenAI API
│   ├── reviewService.js         # Review logic
│   ├── analyticsService.js      # Metrics
│   ├── learningService.js       # Patterns
│   ├── settingsService.js       # Token storage
│   ├── cacheService.js          # Response caching
│   └── dataStore.js             # JSON persistence
├── utils/
│   ├── diffParser.js            # Parse git diffs
│   ├── encryption.js            # AES-256
│   ├── asyncHandler.js          # Error handling
│   └── csv.js                   # CSV export
├── data/                        # store.json (auto-created)
└── index.mjs                    # Express app

frontend/
├── components/
│   ├── AppShell.jsx            # Layout & navigation
│   └── Ui.jsx                  # Reusable components
├── pages/
│   ├── DashboardPage.jsx       # Metrics
│   ├── RepositoriesPage.jsx    # File explorer
│   ├── ReviewsPage.jsx         # PR review UI
│   ├── ReportsPage.jsx         # Trends
│   ├── LearningsPage.jsx       # Patterns
│   └── IntegrationsPage.jsx    # Token setup
├── services/                   # API wrappers
├── hooks/                      # useAsyncData
├── utils/                      # Formatters
└── main.jsx                    # React entry
```

---

## 🌟 Example: Complete Workflow

```
1. Setup Integrations (1 min)
   └─ Paste GitHub PAT & OpenAI key

2. Sync Repositories (30 sec)
   └─ Click "Sync all" → Loads your repos

3. Review Code (5 min)
   └─ Repositories → Explorer → Pick file → "Review file"

4. Review Pull Request (10 min)
   └─ Reviews → Select PR → "Review PR" → AI analyzes

5. Post Findings (1 min)
   └─ Click "Post comments to GitHub"

6. Check Results
   └─ GitHub PR has inline comments with suggestions

7. Track Learning (Ongoing)
   └─ Learnings page shows patterns
   └─ Export CSV for team reference
```

---

## 🆘 Support

**Not working?**

1. Check backend logs: `npm run dev:backend`
2. Verify `.env` file exists and is filled out
3. Check GitHub token scopes (needs `repo`)
4. Verify OpenAI API key is valid
5. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## ✅ Feature Checklist

- ✅ Real GitHub API integration
- ✅ Real OpenAI code review
- ✅ PR review with inline comments
- ✅ Single file review
- ✅ File explorer & tree
- ✅ Code viewer (Monaco Editor)
- ✅ Diff viewer (side-by-side)
- ✅ Learnings system
- ✅ Analytics dashboard
- ✅ Reports & trends
- ✅ Encrypted token storage
- ✅ JSON-based persistence
- ✅ CSV export
- ✅ NO authentication
- ✅ NO pricing
- ✅ NO SaaS

---

## 📄 License

Personal use. Built for developers. No restrictions.

---

**Ready to start?** Go to [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🚀
