import { decryptText, encryptText, maskSecret } from '../utils/encryption.js';
import { findOne, upsert } from './dataStore.js';

export async function saveGithubToken(token) {
  const maskedValue = maskSecret(token);

  return upsert(
    'settings',
    { key: 'github-token' },
    {
      encryptedValue: encryptText(token),
      maskedValue,
    }
  );
}

export async function saveOpenAiToken(token, model) {
  const maskedValue = maskSecret(token);

  return upsert(
    'settings',
    { key: 'openai-token' },
    {
      encryptedValue: encryptText(token),
      maskedValue,
      meta: {
        model,
      },
    }
  );
}

export async function getGithubToken() {
  const envToken = process.env.GITHUB_PAT;
  if (envToken) {
    return envToken;
  }

  const setting = await findOne('settings', { key: 'github-token' });
  return setting ? decryptText(setting.encryptedValue) : '';
}

export async function getOpenAiConfig() {
  const envToken = process.env.OPENAI_API_KEY;
  const envModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (envToken) {
    return { apiKey: envToken, model: envModel };
  }

  const setting = await findOne('settings', { key: 'openai-token' });
  if (!setting) {
    return { apiKey: '', model: envModel };
  }

  return {
    apiKey: decryptText(setting.encryptedValue),
    model: setting.meta?.model || envModel,
  };
}

export async function getWorkspaceStatus() {
  const [githubSetting, openAiSetting] = await Promise.all([
    findOne('settings', { key: 'github-token' }),
    findOne('settings', { key: 'openai-token' }),
  ]);

  return {
    github: {
      connected: Boolean(process.env.GITHUB_PAT || githubSetting),
      maskedToken: process.env.GITHUB_PAT ? 'From environment' : githubSetting?.maskedValue || '',
    },
    openai: {
      connected: Boolean(process.env.OPENAI_API_KEY || openAiSetting),
      maskedToken: process.env.OPENAI_API_KEY ? 'From environment' : openAiSetting?.maskedValue || '',
      model: openAiSetting?.meta?.model || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    },
  };
}
