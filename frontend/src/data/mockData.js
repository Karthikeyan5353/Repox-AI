export const appNavigation = [
  { href: '/', label: 'Home' },
  { href: '/repositories', label: 'Repositories' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/ide', label: 'IDE Flow' },
];

export const repositoryCatalog = [
  {
    id: 1,
    name: 'repox-web',
    visibility: 'Private',
    platform: 'GitHub',
    status: 'Auto review enabled',
    prsReviewed: 84,
    summary: 'Frontend workspace with active pull request reviews and release summaries.',
  },
  {
    id: 2,
    name: 'repox-api',
    visibility: 'Private',
    platform: 'GitHub',
    status: 'Needs policy setup',
    prsReviewed: 41,
    summary: 'Backend services waiting for custom review rules and branch protection sync.',
  },
  {
    id: 3,
    name: 'repox-docs',
    visibility: 'Public',
    platform: 'GitHub',
    status: 'Free open-source plan',
    prsReviewed: 27,
    summary: 'Documentation repository using static summaries and issue explanations.',
  },
];

export const integrationCards = [
  {
    title: 'GitHub',
    status: 'Connected',
    detail: 'Sign in, authorize the app, sync repositories, and trigger pull request reviews.',
  },
  {
    title: 'GitLab',
    status: 'Planned',
    detail: 'Ready for future workspace wiring when multi-provider backend support is added.',
  },
  {
    title: 'Azure DevOps',
    status: 'Planned',
    detail: 'Reserved product surface for enterprise Git platform support.',
  },
  {
    title: 'Bitbucket Cloud',
    status: 'Planned',
    detail: 'Kept visible so the information architecture already matches a multi-provider product.',
  },
];

export const reviewHighlights = [
  {
    title: 'Instant Feedback',
    detail: 'Surface issues and suggestions as soon as developers request a review.',
  },
  {
    title: 'Natural-Language Chat',
    detail: 'Prepare the UI for asking why a change is risky and how to improve it.',
  },
  {
    title: 'Code Summaries',
    detail: 'Summarize pull request intent, review findings, and release readiness.',
  },
  {
    title: 'Learns Team Style',
    detail: 'Reserve space for future preference-aware review rules and team conventions.',
  },
];

export const ideSteps = [
  'Install the RepoX IDE extension from your editor marketplace.',
  'Authenticate with GitHub and confirm the redirect back into the IDE.',
  'Attach a local repository and choose which changes to review.',
  'Run a local review to see issues, explanations, and inline suggestions.',
  'Commit fixes after the review passes or warnings are resolved.',
];

export const defaultAnalysisResults = {
  score: 84,
  summary: 'The pull request is organized well, but onboarding validation and state handling still need cleanup before merge.',
  issues: [
    'Repository connect flow does not explain authorization failures clearly.',
    'Loading and success states are mixed together in a way that reduces reviewer confidence.',
    'The UI needs stronger grouping for high-severity findings versus general suggestions.',
  ],
  suggestions: [
    'Separate onboarding, sync, and review statuses into explicit cards.',
    'Add repository-level policy badges so reviewers can see coverage quickly.',
    'Use summary-first output so teammates understand the change before diving into issues.',
  ],
};
