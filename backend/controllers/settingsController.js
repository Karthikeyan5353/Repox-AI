import { asyncHandler } from '../utils/asyncHandler.js';
import { getAuthenticatedUser } from '../services/githubService.js';
import { getWorkspaceStatus, saveGithubToken, saveOpenAiToken } from '../services/settingsService.js';

export const getStatus = asyncHandler(async (_request, response) => {
  const status = await getWorkspaceStatus();
  response.json(status);
});

export const connectGithub = asyncHandler(async (request, response) => {
  const { token } = request.body;
  if (!token) {
    const error = new Error('GitHub token is required');
    error.status = 400;
    throw error;
  }

  const profile = await getAuthenticatedUser(token);
  await saveGithubToken(token);

  response.json({
    connected: true,
    profile: {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
    },
  });
});

export const connectOpenAi = asyncHandler(async (request, response) => {
  const { apiKey, model } = request.body;
  if (!apiKey) {
    const error = new Error('OpenAI API key is required');
    error.status = 400;
    throw error;
  }

  await saveOpenAiToken(apiKey, model);

  response.json({
    connected: true,
    model,
  });
});
