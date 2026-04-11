# RepoX AI - Quick Reference Card

## 🎬 Start Here (30 seconds)

```bash
# Terminal 1: Install & Run Backend
cd d:\Repox-AI
npm install --prefix backend
npm run dev:backend

# Terminal 2: Install & Run Frontend
cd d:\Repox-AI
npm install --prefix frontend  
npm run dev:frontend
```

**Then open:** http://localhost:5173

---

## 📋 Pre-Requisites Checklist

- [ ] Node.js 16+ installed
- [ ] `.env` file created from `.env.example`
- [ ] `GITHUB_PAT` set in `.env`
- [ ] `OPENAI_API_KEY` set in `.env`

**Get credentials:**
- GitHub PAT: https://github.com/settings/tokens
- OpenAI Key: https://platform.openai.com/api-keys

---

## 🎯 First 5 Minutes

| Step | Action | Expected | Time |
|------|--------|----------|------|
| 1 | Navigate to Integrations | Dark UI loads | 10s |
| 2 | Paste GitHub PAT | "Connected" message | 5s |
| 3 | Paste OpenAI Key | "Connected" message | 5s |
| 4 | Go to Repositories | See repositories | 10s |
| 5 | Click "Sync all" | Repos appear | 20s |

**Result:** ✅ System is ready!

---

## 📍 Navigation Map

```
Dashboard (/dashboard)           → View metrics & trends
   ↓
Repositories (/repositories)    → Browse code & single-file review
   ↓
Reviews (/reviews)              → Review PRs & post comments
   ↓
Reports (/reports)              → See quality trends
   ↓
Learnings (/learnings)          → Patterns & insights
   ↓
Integrations (/integrations)    → Connect GitHub & OpenAI
```

---

## 🔑 Main Features

| Feature | Page | Use Case |
|---------|------|----------|
| PR Review | Reviews | Review pull requests with AI |
| File Explorer | Repositories | Browse and understand code |
| Analytics | Dashboard | Track code health |
| Learnings | Learnings | See patterns & export CSV |
| Trends | Reports | Monitor team progress |
| Settings | Integrations | Configure tokens |

---

## 🚀 Workflows

### Workflow 1: Review a PR (5 min)
```
1. Reviews page
2. Select repo & PR
3. Click "Review PR"
4. Wait 30 seconds
5. Click "Post comments to GitHub"
```

### Workflow 2: Review a File (3 min)
```
1. Repositories page
2. Select repo
3. Click file in tree
4. Click "Review file"
5. View insights
```

### Workflow 3: Export Learnings (1 min)
```
1. Learnings page
2. Click "Export CSV"
3. Open in Excel/Sheets
4. Share with team
```

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| Port in use | Change `BACKEND_PORT=4001` in `.env` |
| No repos appear | Check GitHub PAT has `repo` scope |
| AI returns error | Check OpenAI key at platform.openai.com |
| Files won't load | Ensure UTF-8 encoding, < 100MB size |
| Can't post to PR | Verify PAT scope, PR must be open |

---

## 📊 API Endpoints

```
GET    /api/settings/status           # Check connections
POST   /api/settings/github           # Save GitHub PAT
POST   /api/settings/openai           # Save OpenAI key

GET    /api/repositories              # List repos
POST   /api/repositories/sync         # Sync from GitHub
GET    /api/repositories/:id          # Repo details
POST   /api/repositories/:id/review-file  # Review file

GET    /api/pull-requests/:id/:number # PR details
POST   /api/pull-requests/:id/:number/review  # Review PR
POST   /api/pull-requests/comments/post  # Post to GitHub

GET    /api/dashboard                 # Metrics
GET    /api/reports                   # Trends
GET    /api/learnings                 # Patterns
GET    /api/learnings/export.csv      # Export CSV
```

---

## 💾 File Locations

```
Data store        → backend/data/store.json
Backend code      → backend/
Frontend code     → frontend/src/
Configuration     → .env (root)
Documentation    → *.md files (root)
```

---

## 🔐 Security Notes

- Tokens encrypted with AES-256-CBC
- Never committed to git
- Stored in `.env` (add to `.gitignore`)
- Masked in UI display
- Local storage only

---

## 📈 Key Metrics

| Metric | What It Shows | Where |
|--------|---------------|-------|
| Active Repositories | How many repos synced | Dashboard |
| Merged PRs | PR merge velocity | Dashboard |
| Median Merge Time | Time from create to merge | Dashboard |
| Review Comments | Total issues found | Dashboard |
| Learnings Total | Patterns learned | Learnings |
| Code Quality | Quality score trend | Reports |

---

## ⚡ Performance Targets

- Repository sync: < 30 seconds
- PR review: 20-60 seconds
- File review: 15-45 seconds
- Dashboard render: < 1 second
- File load: < 2 seconds

---

## 🤖 AI Analysis Covers

- 🐛 **Bugs** - Logic errors, edge cases
- 🔒 **Security** - Vulnerabilities
- ⚡ **Performance** - Inefficiencies
- 📝 **Quality** - Style, maintainability
- ✅ **Best Practices** - Patterns

---

## 📦 What Gets Stored

```json
{
  "repositories": [list of synced repos],
  "pullRequests": [tracked PRs],
  "reviews": [AI review results],
  "learnings": [patterns found],
  "settings": [encrypted tokens]
}
```

---

## 🎓 Key Commands

```bash
# Start everything
npm run dev

# Just backend
npm run dev:backend

# Just frontend
npm run dev:frontend

# Build for production
npm run build

# Check health
curl http://localhost:4000/api/health
```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| GitHub PAT | https://github.com/settings/tokens |
| OpenAI Keys | https://platform.openai.com/api-keys |
| GitHub API Docs | https://docs.github.com/en/rest |
| OpenAI API Docs | https://platform.openai.com/docs |

---

## 📋 Verification Checklist

- [ ] Backend running (port 4000)
- [ ] Frontend running (port 5173)
- [ ] Health endpoint responds
- [ ] GitHub PAT connected
- [ ] OpenAI key connected
- [ ] Repositories synced
- [ ] File can be reviewed
- [ ] PR can be reviewed
- [ ] Comments post to GitHub
- [ ] Dashboard shows metrics

---

## 🆘 Quick Help

**Backend not starting?**
```bash
npm run dev:backend
# Check for error messages
# Verify .env exists and has GITHUB_PAT + OPENAI_API_KEY
```

**Frontend blank?**
```bash
# Check http://localhost:5173/
# Open DevTools (F12) → Console tab
# Look for connection errors
```

**API not responding?**
```bash
curl http://localhost:4000/api/health
# Should return: {"ok":true,...}
```

**GitHub not syncing?**
```
1. Verify GitHub PAT at https://github.com/settings/tokens
2. Check it has 'repo' scope
3. Try "Add repo" with specific URL first
```

---

## 📞 Documentation Files

1. **README.md** - Project overview
2. **SETUP_GUIDE.md** - Detailed setup
3. **TESTING_GUIDE.md** - Verification
4. **PROJECT_SUMMARY.md** - Full details
5. **QUICK_REFERENCE.md** - This file

---

## 🎉 You're Ready!

```bash
npm run dev
```

Then go to: **http://localhost:5173**

Enjoy! 🚀

---

**Last updated:** April 11, 2026
**Status:** Complete & Ready for Use
**Support:** Check documentation files
