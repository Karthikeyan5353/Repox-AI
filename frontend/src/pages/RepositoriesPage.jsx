import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { GitBranch, RefreshCcw, Search } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  getRepositories,
  getRepositoryDetails,
  getRepositoryFile,
  getRepositoryTree,
  reviewSingleFile,
  syncRepositories,
} from '../services/repositoryService';
import { formatDate, statusTone } from '../utils/formatters';
import { Button, EmptyState, Input, Panel, Select } from '../components/Ui';

function buildTree(entries = []) {
  const root = {};

  for (const entry of entries.filter((item) => item.type === 'blob')) {
    const parts = entry.path.split('/');
    let cursor = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = { __file: true, path: entry.path };
      } else {
        cursor[part] = cursor[part] || {};
        cursor = cursor[part];
      }
    });
  }

  return root;
}

function TreeNode({ name, node, onSelect, level = 0, activePath }) {
  const isFile = node.__file;

  if (isFile) {
    return (
      <button
        type="button"
        onClick={() => onSelect(node.path)}
        className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
          activePath === node.path ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
        }`}
        style={{ paddingLeft: `${level * 14 + 12}px` }}
      >
        {name}
      </button>
    );
  }

  return (
    <div>
      <div className="px-3 py-2 text-xs uppercase tracking-[0.15em] text-slate-500" style={{ paddingLeft: `${level * 14 + 12}px` }}>
        {name}
      </div>
      <div className="space-y-1">
        {Object.entries(node)
          .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
          .map(([childName, childNode]) => (
            <TreeNode key={`${name}-${childName}`} name={childName} node={childNode} onSelect={onSelect} level={level + 1} activePath={activePath} />
          ))}
      </div>
    </div>
  );
}

function RepositoriesPage() {
  const [query, setQuery] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileReview, setFileReview] = useState(null);
  const [message, setMessage] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const repositoriesState = useAsyncData(() => getRepositories(query), [query]);
  const selectedRepository = useMemo(
    () => repositoriesState.data?.find((repository) => repository._id === selectedRepositoryId),
    [repositoriesState.data, selectedRepositoryId]
  );
  const detailsState = useAsyncData(
    () => (selectedRepositoryId ? getRepositoryDetails(selectedRepositoryId, 'open') : Promise.resolve(null)),
    [selectedRepositoryId]
  );
  const treeState = useAsyncData(
    () =>
      selectedRepositoryId && selectedBranch
        ? getRepositoryTree(selectedRepositoryId, selectedBranch)
        : Promise.resolve([]),
    [selectedRepositoryId, selectedBranch]
  );

  useEffect(() => {
    if (!selectedRepositoryId && repositoriesState.data?.length) {
      setSelectedRepositoryId(repositoriesState.data[0]._id);
    }
  }, [repositoriesState.data, selectedRepositoryId]);

  useEffect(() => {
    if (detailsState.data?.repository?.defaultBranch) {
      setSelectedBranch(detailsState.data.repository.defaultBranch);
    }
  }, [detailsState.data?.repository?.defaultBranch]);

  useEffect(() => {
    setSelectedPath('');
    setFileContent('');
    setFileReview(null);
  }, [selectedRepositoryId, selectedBranch]);

  async function handleSync(syncSingle = false) {
    setSyncing(true);
    setMessage('');

    try {
      await syncRepositories(syncSingle ? repositoryUrl : '');
      const refreshed = await getRepositories(query);
      repositoriesState.setData(refreshed);
      setMessage(syncSingle ? 'Repository synced successfully.' : 'Repositories synced from GitHub.');
      if (syncSingle) {
        setRepositoryUrl('');
      }
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleSelectPath(path) {
    setSelectedPath(path);
    setFileReview(null);
    try {
      const response = await getRepositoryFile(selectedRepositoryId, path, selectedBranch);
      setFileContent(response.content);
    } catch (caughtError) {
      setFileContent(`Unable to load file: ${caughtError.response?.data?.message || caughtError.message}`);
    }
  }

  async function handleReviewFile() {
    if (!selectedPath) {
      return;
    }

    setReviewing(true);
    setMessage('');

    try {
      const response = await reviewSingleFile(selectedRepositoryId, selectedPath, selectedBranch);
      setFileReview(response.review);
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setReviewing(false);
    }
  }

  const tree = useMemo(() => buildTree(treeState.data || []), [treeState.data]);

  return (
    <div className="space-y-6">
      <Panel eyebrow="Repositories" title="GitHub repository management">
        <div className="grid gap-4 xl:grid-cols-[1fr_280px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
            <Input className="pl-11" placeholder="Search synced repositories" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Input placeholder="https://github.com/owner/repo" value={repositoryUrl} onChange={(event) => setRepositoryUrl(event.target.value)} />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => handleSync(false)} disabled={syncing}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sync all
            </Button>
            <Button className="flex-1" onClick={() => handleSync(true)} disabled={syncing || !repositoryUrl}>
              Add repo
            </Button>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
        <Panel eyebrow="Repository List" title="Stored repositories" className="max-h-[78vh] overflow-auto">
          <div className="space-y-3">
            {repositoriesState.data?.map((repository) => (
              <button
                key={repository._id}
                type="button"
                onClick={() => setSelectedRepositoryId(repository._id)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${
                  selectedRepositoryId === repository._id
                    ? 'border-cyan-400/25 bg-cyan-400/10'
                    : 'border-slate-800 bg-white/[0.04] hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg text-white">{repository.fullName}</h3>
                    <p className="mt-2 text-sm text-slate-400">{repository.description || 'No repository description available.'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${repository.private ? 'bg-rose-500/15 text-rose-200' : 'bg-emerald-500/15 text-emerald-200'}`}>
                    {repository.private ? 'Private' : 'Public'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>{repository.language || 'Unknown language'}</span>
                  <span>{repository.branchesCount} branches</span>
                  <span>{repository.openPullRequestsCount} open PRs</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Explorer" title={selectedRepository?.fullName || 'Select a repository'}>
          {!selectedRepository ? (
            <EmptyState title="No repository selected" copy="Sync a GitHub repository to browse branches, commits, and source files." />
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <div className="rounded-[24px] border border-slate-800 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <GitBranch className="h-4 w-4 text-cyan-300" />
                    Branch
                  </div>
                  <div className="mt-3">
                    <Select value={selectedBranch} onChange={(event) => setSelectedBranch(event.target.value)}>
                      {(detailsState.data?.branches || []).map((branch) => (
                        <option key={branch.name} value={branch.name}>
                          {branch.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="mt-5 space-y-2 text-sm text-slate-400">
                    {(detailsState.data?.commits || []).slice(0, 4).map((commit) => (
                      <div key={commit.sha} className="rounded-2xl bg-slate-950/55 p-3">
                        <p className="line-clamp-2 text-slate-200">{commit.commit.message}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(commit.commit.author?.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-800 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Repository tree</p>
                  <div className="mt-4 max-h-[320px] overflow-auto">
                    {Object.entries(tree)
                      .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
                      .map(([name, node]) => (
                        <TreeNode key={name} name={name} node={node} onSelect={handleSelectPath} activePath={selectedPath} />
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-slate-950/75 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Code viewer</p>
                    <p className="text-sm text-slate-300">{selectedPath || 'Select a file from the tree'}</p>
                  </div>
                  <Button onClick={handleReviewFile} disabled={!selectedPath || reviewing}>
                    {reviewing ? 'Reviewing…' : 'Review file'}
                  </Button>
                </div>
                <Editor
                  height="420px"
                  language={selectedPath?.split('.').pop() || 'javascript'}
                  value={fileContent}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, readOnly: true, fontSize: 13 }}
                />
              </div>
            </div>
          )}
        </Panel>

        <Panel eyebrow="AI Review" title="Single file insights" className="max-h-[78vh] overflow-auto">
          {!fileReview ? (
            <EmptyState title="No file review yet" copy="Open a file and run the AI reviewer to get bugs, security, performance, and quality feedback." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-white/[0.04] p-4 text-sm text-slate-300">{fileReview.summary}</div>
              {fileReview.issues.map((issue, index) => (
                <article key={`${issue.filePath}-${issue.title}-${index}`} className="rounded-[24px] border border-slate-800 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg text-white">{issue.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{issue.description}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusTone(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {issue.category} {issue.lineNumber ? `• line ${issue.lineNumber}` : ''}
                  </div>
                  <div className="mt-4 rounded-2xl bg-slate-950/55 p-3 text-sm text-slate-300">{issue.suggestedFix}</div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default RepositoriesPage;
