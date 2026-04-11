import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { connectGithub, connectOpenAi, getWorkspaceStatus } from '../services/settingsService';
import { Button, Input, Panel } from '../components/Ui';

function IntegrationsPage() {
  const { data, loading, error, setData } = useAsyncData(() => getWorkspaceStatus(), []);
  const [githubToken, setGithubToken] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleGithubSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await connectGithub(githubToken);
      const status = await getWorkspaceStatus();
      setData(status);
      setMessage('GitHub PAT connected successfully.');
      setGithubToken('');
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenAiSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await connectOpenAi(openAiKey, model);
      const status = await getWorkspaceStatus();
      setData(status);
      setMessage('OpenAI API key connected successfully.');
      setOpenAiKey('');
    } catch (caughtError) {
      setMessage(caughtError.response?.data?.message || caughtError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel eyebrow="Setup" title="Connect GitHub and OpenAI">
        <p className="max-w-3xl text-sm text-slate-400">
          This workspace is intentionally personal-only. Tokens are stored locally in an encrypted JSON-backed workspace so the app can sync repositories, read pull request diffs, and send review comments back to GitHub.
        </p>
        {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-400">Checking existing connections…</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel eyebrow="GitHub" title="Personal Access Token">
          <form className="space-y-4" onSubmit={handleGithubSubmit}>
            <Input type="password" placeholder="ghp_xxxxxxxxx" value={githubToken} onChange={(event) => setGithubToken(event.target.value)} />
            <div className="rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-400">
              Connected: <span className="text-white">{data?.github?.connected ? data.github.maskedToken : 'No token saved'}</span>
            </div>
            <Button type="submit" disabled={saving || !githubToken}>
              {saving ? 'Saving…' : 'Save GitHub Token'}
            </Button>
          </form>
        </Panel>

        <Panel eyebrow="OpenAI" title="API key and model">
          <form className="space-y-4" onSubmit={handleOpenAiSubmit}>
            <Input type="password" placeholder="sk-..." value={openAiKey} onChange={(event) => setOpenAiKey(event.target.value)} />
            <Input placeholder="Model name" value={model} onChange={(event) => setModel(event.target.value)} />
            <div className="rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-400">
              Connected: <span className="text-white">{data?.openai?.connected ? `${data.openai.maskedToken} (${data.openai.model})` : 'No key saved'}</span>
            </div>
            <Button type="submit" disabled={saving || !openAiKey}>
              {saving ? 'Saving…' : 'Save OpenAI Key'}
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export default IntegrationsPage;
