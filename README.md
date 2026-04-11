# RepoX AI

RepoX AI is a personal full-stack AI code review platform inspired by CodeRabbit. It connects to real GitHub repositories through a Personal Access Token, stores synced workspace data in a local JSON datastore, analyzes pull requests and files with OpenAI, surfaces inline findings in a Monaco-powered workspace, persists learnings, and can post review comments back to GitHub pull requests.

## Folder Structure

```text
backend/
  controllers/
  routes/
  services/
  utils/
  data/
  index.mjs
  package.json
frontend/
  src/
    components/
    hooks/
    pages/
    services/
    utils/
  .env.example
  package.json
.env.example
package.json
README.md
```

## Features

- Real GitHub PAT connection and repository sync through the GitHub REST API
- Repository list persisted in a local JSON store with search, visibility badges, and manual sync
- Repository explorer with branches, commits, repo tree, code viewer, and single-file AI review
- Pull request review workspace with PR list, Monaco diff viewer, AI summary, severity-tagged issues, and GitHub comment posting
- Dashboard metrics for active repositories, merged pull requests, chat usage, median merge time, reviewer time saved, comment volume, and severity distribution
- Reports for code quality trends, review frequency, issue categories, and simulated organization trends
- Learnings system with persistent issue patterns, usage tracking, search/filter, and CSV export
- Cached GitHub reads and batched AI review prompts

## Setup

### 1. Environment

Create a root `.env` file from [`.env.example`](/d:/Repox-AI/.env.example).

```env
BACKEND_PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
APP_SECRET=replace-with-a-long-random-secret
GITHUB_PAT=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Create `frontend/.env` from [`.env.example`](/d:/Repox-AI/frontend/.env.example).

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2. Install Dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Start the App

From the repo root:

```bash
npm run dev
```

Or start each side separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Frontend: `http://localhost:5173`
Backend API: `http://localhost:4000/api`

## Backend API

### Settings

- `GET /api/settings/status`
- `POST /api/settings/github`
- `POST /api/settings/openai`

Example:

```http
POST /api/settings/github
Content-Type: application/json

{
  "token": "ghp_your_personal_access_token"
}
```

### Repositories

- `POST /api/repositories/sync`
- `GET /api/repositories?q=repo-name`
- `GET /api/repositories/:repositoryId`
- `GET /api/repositories/:repositoryId/tree?ref=main`
- `GET /api/repositories/:repositoryId/file?path=src/index.js&ref=main`
- `POST /api/repositories/:repositoryId/review-file`

Example:

```http
POST /api/repositories/sync
Content-Type: application/json

{
  "repositoryUrl": "https://github.com/owner/repository"
}
```

### Pull Requests

- `GET /api/pull-requests/:repositoryId`
- `GET /api/pull-requests/:repositoryId/:pullRequestNumber`
- `POST /api/pull-requests/:repositoryId/:pullRequestNumber/review`
- `POST /api/pull-requests/comments/post`

Example:

```http
POST /api/pull-requests/REPOSITORY_ID/42/review
```

Then post comments:

```http
POST /api/pull-requests/comments/post
Content-Type: application/json

{
  "reviewId": "REVIEW_DOCUMENT_ID"
}
```

### Analytics and Knowledge

- `GET /api/dashboard?filter=7d`
- `GET /api/reports?filter=30d`
- `GET /api/learnings?q=security&usage=recently-used`
- `GET /api/learnings/export.csv`

## Running Flow

1. Open the Integrations page and save your GitHub PAT plus OpenAI API key.
2. Go to Repositories and sync all repos or add one by URL.
3. Select a repository to browse branches, commits, files, and run single-file review.
4. Open Reviews, choose a PR, run `Review PR`, inspect findings, and post comments to GitHub.
5. Use Dashboard, Reports, and Learnings to track review health over time.

## Notes

- GitHub responses are cached in-memory on the backend to reduce repeat API pressure.
- Repository metadata, PR snapshots, reviews, learnings, and encrypted token settings are stored in `backend/data/store.json`.
- Active user and organization trend metrics are intentionally simulated because this is a personal tool without org auth or billing logic.
- Inline GitHub comments are attempted only when the AI maps a finding to a changed line in the PR diff.
