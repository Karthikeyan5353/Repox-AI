# RepoX AI - Complete Testing & Verification Guide

This guide walks through verifying that your RepoX AI installation is fully working end-to-end.

---

## ✅ Pre-Flight Checks

### 1. Files Created
```bash
# Should exist
ls -la backend/data/store.json
ls -la .env
```

### 2. Dependencies Installed
```bash
# From project root
npm list --depth=0
npm --prefix backend list --depth=0
npm --prefix frontend list --depth=0
```

### 3. Environment Variables
```bash
cat .env
# Should show:
# GITHUB_PAT=ghp_xxx
# OPENAI_API_KEY=sk-xxx
# OPENAI_MODEL=gpt-4.1-mini
# etc.
```

---

## 🚀 Startup Verification

### Step 1: Start Backend
```bash
npm run dev:backend
```

Expected output:
```
> node index.mjs
RepoX AI backend listening on port 4000
Persistence: local JSON store
```

### Step 2: Test Health Endpoint
```bash
# In a new terminal
curl http://localhost:4000/api/health

# Expected:
# {"ok":true,"service":"repox-ai-backend","timestamp":"2024-..."}
```

### Step 3: Check Store
```bash
cat backend/data/store.json

# Expected (initially):
# {
#   "settings": [],
#   "repositories": [],
#   "pullRequests": [],
#   "reviews": [],
#   "learnings": []
# }
```

### Step 4: Start Frontend
```bash
# In another terminal
npm run dev:frontend

# Expected output:
# VITE v5.4.21  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Step 5: Open UI
```bash
# Open in browser
http://localhost:5173
```

Should see: Dark themed UI with navigation sidebar

---

## 🔗 Integration Testing

### Test 1: Integrations Page

**Goal:** Verify GitHub & OpenAI connections work

1. Navigate to `http://localhost:5173/integrations`
2. Paste GitHub PAT in first field
3. Click **"Save GitHub Token"**
4. Expected: ✅ "GitHub PAT connected successfully"

5. Paste OpenAI API Key in second field
6. Keep model as `gpt-4.1-mini`
7. Click **"Save OpenAI Key"**
8. Expected: ✅ "OpenAI API key connected successfully"

**Verify in store:**
```bash
cat backend/data/store.json | jq '.settings'
# Should show encrypted tokens
```

### Test 2: Repository Sync

**Goal:** Verify GitHub API integration

1. Go to Repositories page (`/repositories`)
2. Click **"Sync all"**
3. Expected: ✅ "Repositories synced from GitHub" + list appears

**Verify in store:**
```bash
cat backend/data/store.json | jq '.repositories | length'
# Should be > 0
```

---

## 📁 File Explorer Testing

**Goal:** Verify file browsing works

1. In Repositories page, select a repo from list
2. Select a branch from the dropdown
3. In "Repository tree" section, click a file
4. Expected: File content appears in "Code viewer"

**Test with JavaScript file:**
- Click a `.js` or `.jsx` file
- Should see syntax highlighting
- Should see line numbers

---

## 🤖 AI Review Testing

### Test 1: Review Single File

1. In Repositories page, select a JavaScript file
2. Click **"Review file"**
3. Watch terminal for API calls
4. Wait 10-30 seconds...
5. Expected: AI review appears on right panel with issues

**What to expect:**
- "Summary of findings" section
- List of issues with:
  - Title (e.g., "Potential null reference")
  - Description
  - Severity badge (low/medium/high)
  - Category (bug/security/performance/quality/best-practice)

### Test 2: Review Pull Request

**Prerequisites:**
- Repository synced
- Repository has open pull requests
- GitHub token has repo scope

1. Go to Reviews page (`/reviews`)
2. Select Repository from dropdown
3. Select Pull Request from second dropdown
4. Click **"Review PR"**
5. Wait for AI analysis...
6. Expected: Review summary + issues appear

### Test 3: Find Issues in Output

Look for JSON validation in backend logs:
```bash
# You should see a successful response from OpenAI
# Contains: summary, issues array with proper structure
```

---

## 📊 Analytics Testing

### Test 1: Dashboard

1. Go to Dashboard (`/dashboard`)
2. Should see stat cards:
   - Active repositories: ≥ 0
   - Merged pull requests: ≥ 0
   - Median merge time: ≥ 0
   - Review comments count: ≥ 0

3. Try changing filter: "Last 7 days" → "Last 30 days"
4. Charts should update

### Test 2: Reports

1. Go to Reports (`/reports`)
2. Should see 4 charts:
   - Code Quality (line chart)
   - Review Volume (bar chart)
   - Issue Categories (bar chart)
   - Organization Trends (line chart)

---

## 📚 Learnings Testing

**Goal:** Verify learnings system

1. Complete at least 2 AI reviews (files or PRs)
2. Go to Learnings page (`/learnings`)
3. Should see stats:
   - Total learnings: ≥ 2
   - Recently used: ≥ 1 (if run today)

4. View learnings list - each should show:
   - Title
   - Category
   - Severity
   - Usage count
   - Last used date

5. Try CSV export:
   - Click **"Export CSV"**
   - File should download: `repox-learnings.csv`
   - Open in Excel/Google Sheets to verify

---

## 💬 GitHub Integration Testing

**Goal:** Verify posting comments to GitHub

### Prerequisites
- Repository is YOUR OWN or in an organization
- PR has open state
- GitHub PAT has `repo` scope

### Steps
1. In Reviews page, complete a PR review
2. Look for **"Post comments to GitHub"** button
3. Click it
4. Expected message: "Posted X comments to GitHub"

### Verify on GitHub
1. Open actual PR on GitHub
2. Should see:
   - **Summary comment** with review findings
   - **Inline comments** on changed lines (if any)

Example inline comment:
```
## RepoX AI Review

**HIGH** - Missing null check
This could cause runtime error if value is undefined.

Suggested fix:
if (value != null) { ... }
```

---

## 🔒 Security Verification

### Test 1: Token Encryption

```bash
# Check store.json
cat backend/data/store.json | jq '.settings[0]'

# encryptedValue should NOT be your actual PAT
# Should look like: "a1b2c3d4e5f6:encrypted..." (not your token)
```

### Test 2: Masked Display

1. Go to Integrations page
2. Both tokens should show as masked:
   - GitHub: `ghp_****xxxx` (not full token)
   - OpenAI: `sk_****xxxx` (not full key)

---

## ⚡ Performance Testing

### Test 1: Repository Sync Speed
- Sync 10-50 repos
- Should complete in < 30 seconds
- Check backend logs for caching

### Test 2: PR Review Speed
- Review a PR with 1-5 files
- Should complete in 20-60 seconds
- Check token usage in backend logs

### Test 3: Dashboard Load
- Dashboard should load instantly
- Charts should render within 1 second

---

## 🧪 Edge Case Testing

### Test 1: Empty Repository
- Sync repo with NO files
- Should not crash
- Tree should be empty

### Test 2: Binary Files
- Try reviewing `.png` or `.pdf` file
- Should gracefully skip or error
- Should NOT crash backend

### Test 3: Large Files
- Find file > 100KB
- Try to review
- Should either:
  - Work if < 500KB
  - Error gracefully if > GitHub limit

### Test 4: Private Repository
- If you have private repo access
- Sync private repo
- Should appear with "Private" badge
- Should be reviewable

### Test 5: No Changes PR
- Try reviewing PR with no file changes
- Should handle gracefully
- Message like "No files to review"

---

## 🐛 Debugging Checklist

If something fails, check:

1. **Backend running?**
   ```bash
   curl http://localhost:4000/api/health
   ```

2. **Valid tokens?**
   ```bash
   # Check .env file
   echo $GITHUB_PAT
   echo $OPENAI_API_KEY
   ```

3. **Network issues?**
   - Check browser DevTools → Network tab
   - Look for failed requests (red X)
   - Check response status codes

4. **API rate limits?**
   - GitHub: 60 requests/hour (unauthenticated), 5000 with PAT
   - OpenAI: 3500 requests/minute (varies by plan)

5. **Token scopes?**
   ```bash
   # GitHub: must have 'repo' scope
   # Check at https://github.com/settings/tokens
   ```

6. **Backend logs?**
   - Watch terminal for error messages
   - Look for stack traces

---

## ✅ Complete Verification Checklist

```
[ ] Backend starts without errors
[ ] Health endpoint responds (curl test)
[ ] Frontend loads in browser
[ ] Integrations page saves tokens
[ ] Repositories page syncs GitHub
[ ] File viewer displays code
[ ] File review runs AI analysis
[ ] PR review runs AI analysis
[ ] Dashboard shows metrics
[ ] Reports display charts
[ ] Learnings page shows patterns
[ ] CSV export works
[ ] Comments post to GitHub PR
[ ] Performance is acceptable (< 60s per operation)
[ ] No console errors in DevTools
[ ] No backend crashes in terminal
```

---

## 📈 Success Metrics

Your system is working fully if:

✅ **Integrations:** Tokens saved securely
✅ **Repositories:** Can sync and browse code
✅ **Reviews:** AI analyzes code, produces JSON
✅ **Comments:** Posts findings to GitHub
✅ **Analytics:** Dashboard shows metrics
✅ **Learnings:** Patterns persist across reviews
✅ **Performance:** All operations complete < 60s

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "OpenAI token invalid" | Verify key at https://platform.openai.com/account/api-keys |
| "GitHub API returns 401" | Regenerate PAT, check scopes |
| "Port 4000 in use" | Change `BACKEND_PORT=4001` in .env |
| "File not showing in editor" | Check encoding (must be UTF-8) |
| "AI review returns JSON error" | Check OpenAI API quota/limits |
| "Components not rendering" | Check browser console for React errors |
| "Comments not posting to GitHub" | Verify PAT has `repo` scope, PR is open |

---

## 📞 Verification Support

**Test still failing?**

1. Check **all terminal logs** (both backend & frontend)
2. Check **browser DevTools**:
   - Console tab for errors
   - Network tab for failed API calls
   - Application tab for stored data
3. Verify **each environment variable**
4. Try **with a test repository** first
5. Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 🎯 Next Steps

Once verification passes ✅ :

1. **Configure your workflows**
   - Set review standards
   - Decide which repos to sync

2. **Run first real reviews**
   - Pick a repo with open PRs
   - Review a PR
   - Post feedback to GitHub

3. **Build team practice**
   - Export learnings
   - Share with team
   - Refine patterns

4. **Integrate into workflow**
   - Use for PRs daily
   - Reference learnings in code reviews
   - Track code quality trends

---

**Ready? Start the testing now!** 🚀
