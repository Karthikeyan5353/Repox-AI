import { useEffect, useMemo, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { MessageSquarePlus, PlayCircle } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getRepositories, getRepositoryDetails } from '../services/repositoryService';
import { getPullRequestDetails, postReviewComments, reviewPullRequest } from '../services/reviewService';
import { formatDate, statusTone } from '../utils/formatters';
import { Button, EmptyState, Panel, Select } from '../components/Ui';

function ReviewsPage() {
  const repositoriesState = useAsyncData(() => getRepositories(''), []);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('');
  const [selectedPullRequestNumber, setSelectedPullRequestNumber] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [review, setReview] = useState(null);
  const [message, setMessage] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [posting, setPosting] = useState(false);

  const detailsState = useAsyncData(
    () => (selectedRepositoryId ? getRepositoryDetails(selectedRepositoryId, 'open') : Promise.resolve(null)),
    [selectedRepositoryId]
  );
  const prState = useAsyncData(
    () =>
      selectedRepositoryId && selectedPullRequestNumber
        ? getPullRequestDetails(selectedRepositoryId, selectedPullRequestNumber)
        : Promise.resolve(null),
    [selectedRepositoryId, selectedPullRequestNumber]
  );

  useEffect(() => {
    if (!selectedRepositoryId && repositoriesState.data?.length) {
      setSelectedRepositoryId(repositoriesState.data[0]._id);
    }
  }, [repositoriesState.data, selectedRepositoryId]);

  useEffect(() => {
    setSelectedPullRequestNumber('');
    setSelectedFileName('');
    setReview(null);
  }, [selectedRepositoryId]);

  useEffect(() => {
    if (!selectedPullRequestNumber && detailsState.data?.pullRequests?.length) {
      setSelectedPullRequestNumber(String(detailsState.data.pullRequests[0].number));
    }
  }, [detailsState.data?.pullRequests, selectedPullRequestNumber]);

  useEffect(() => {
    if (prState.data?.files?.length) {
      setSelectedFileName(prState.data.files[0].filename);
    }
    setReview(prState.data?.reviews?.[0] || null);
  }, [prState.data]);

  const selectedFile = useMemo(
    () => prState.data?.files?.find((file) => file.filename === selectedFileName),
    [prState.data?.files, selectedFileName]
  );

  async function handleReview() {
    setReviewing(true);
    setMessage('');

    try {
      const result = await reviewPullRequest(selectedRepositoryId, selectedPullRequestNumber);
      setReview(result);
      setMessage('Pull request reviewed successfully.');
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setReviewing(false);
    }
  }

  async function handlePostComments() {
    if (!review?._id) {
      return;
    }

    setPosting(true);
    setMessage('');

    try {
      const result = await postReviewComments(review._id);
      setMessage(`Posted ${result.commentsPosted} comments to GitHub.`);
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel eyebrow="Review Workspace" title="Pull request review system">
        <div className="grid gap-4 md:grid-cols-[260px_260px_1fr]">
          <Select value={selectedRepositoryId} onChange={(event) => setSelectedRepositoryId(event.target.value)}>
            <option value="">Select repository</option>
            {(repositoriesState.data || []).map((repository) => (
              <option key={repository._id} value={repository._id}>
                {repository.fullName}
              </option>
            ))}
          </Select>
          <Select value={selectedPullRequestNumber} onChange={(event) => setSelectedPullRequestNumber(event.target.value)}>
            <option value="">Select pull request</option>
            {(detailsState.data?.pullRequests || []).map((pullRequest) => (
              <option key={pullRequest.number} value={pullRequest.number}>
                #{pullRequest.number} {pullRequest.title}
              </option>
            ))}
          </Select>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleReview} disabled={reviewing || !selectedRepositoryId || !selectedPullRequestNumber}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {reviewing ? 'Reviewing PR…' : 'Review PR'}
            </Button>
            <Button variant="secondary" onClick={handlePostComments} disabled={posting || !review?._id}>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              {posting ? 'Posting…' : 'Post comments to GitHub'}
            </Button>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <Panel eyebrow="PR List" title="Changed files and context" className="max-h-[78vh] overflow-auto">
          {detailsState.data?.pullRequests?.length ? (
            <div className="space-y-3">
              {detailsState.data.pullRequests.map((pullRequest) => (
                <button
                  key={pullRequest.number}
                  type="button"
                  onClick={() => setSelectedPullRequestNumber(String(pullRequest.number))}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    String(pullRequest.number) === selectedPullRequestNumber
                      ? 'border-cyan-400/25 bg-cyan-400/10'
                      : 'border-slate-800 bg-white/[0.04] hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">PR #{pullRequest.number}</p>
                  <h3 className="mt-2 font-display text-lg text-white">{pullRequest.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">Updated {formatDate(pullRequest.updated_at)}</p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="No pull requests" copy="Pick a synced repository with open pull requests." />
          )}

          <div className="mt-6 space-y-2">
            {(prState.data?.files || []).map((file) => (
              <button
                key={file.filename}
                type="button"
                onClick={() => setSelectedFileName(file.filename)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${
                  file.filename === selectedFileName ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                <div>{file.filename}</div>
                <div className="mt-1 text-xs text-slate-500">
                  +{file.additions} / -{file.deletions}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Diff Viewer" title={selectedFile?.filename || 'Select a changed file'}>
          {!selectedFile ? (
            <EmptyState title="No diff selected" copy="Choose a changed file to inspect base and head versions side-by-side." />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 rounded-[24px] border border-slate-800 bg-white/[0.04] p-4 md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</p>
                  <p className="mt-2 text-sm text-white">{selectedFile.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Additions</p>
                  <p className="mt-2 text-sm text-emerald-300">{selectedFile.additions}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Deletions</p>
                  <p className="mt-2 text-sm text-rose-300">{selectedFile.deletions}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Patch lines</p>
                  <p className="mt-2 text-sm text-white">{selectedFile.patch?.split('\n').length || 0}</p>
                </div>
              </div>
              <DiffEditor
                height="560px"
                original={selectedFile.baseContent || ''}
                modified={selectedFile.headContent || selectedFile.patch || ''}
                theme="vs-dark"
                options={{ minimap: { enabled: false }, readOnly: true, fontSize: 13 }}
                language={selectedFile.filename.split('.').pop() || 'javascript'}
              />
            </div>
          )}
        </Panel>

        <Panel eyebrow="AI Review" title="Summary and inline suggestions" className="max-h-[78vh] overflow-auto">
          {!review ? (
            <EmptyState title="No AI review yet" copy="Run the pull request reviewer to generate summary findings, severity tags, and GitHub-ready comments." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-white/[0.04] p-4 text-sm text-slate-300">{review.summary}</div>
              {(review.issues || []).map((issue, index) => (
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
                    {issue.filePath} {issue.lineNumber ? `• line ${issue.lineNumber}` : ''} • {issue.category}
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

export default ReviewsPage;
