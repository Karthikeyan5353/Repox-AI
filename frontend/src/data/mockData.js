export const appNavigation = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/repositories', label: 'Repositories' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/ide', label: 'IDE Flow' },
];

export const defaultAuthState = {
  provider: 'github',
  status: 'signed_out',
  isVerified: false,
  username: '',
  email: '',
  installationStatus: 'Not installed',
  accessibleRepos: 0,
};

export const verifiedGithubProfile = {
  provider: 'github',
  status: 'verified',
  isVerified: true,
  username: 'Karthikeyan5353',
  email: 'karthikeyan5353@users.noreply.github.com',
  installationStatus: 'Installed on selected repositories',
  accessibleRepos: 12,
};

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
    status: 'Ready',
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

export const landingStats = [
  { value: '9,000+', label: 'teams using AI-assisted review workflows' },
  { value: '2M+', label: 'repositories represented in the product vision' },
  { value: '13M+', label: 'pull requests reviewed across modern code-review platforms' },
  { value: '50%', label: 'faster review loops for active engineering teams' },
];

export const socialProofCompanies = ['Mercury', 'Linear', 'PostHog', 'Groupon', 'Raycast', 'Vercel'];

export const reviewDemoComments = [
  {
    severity: 'Bug',
    title: 'Missing guard before using repository config',
    body: 'This flow assumes config exists. Add a null-safe fallback before reading repository settings.',
  },
  {
    severity: 'Suggestion',
    title: 'Summarize review state for the user',
    body: 'A clearer success state would help reviewers know whether the AI finished analysis or is still running.',
  },
  {
    severity: 'Info',
    title: 'Nice separation of concerns',
    body: 'The API and UI responsibilities are already split in a way that will be easier to grow later.',
  },
];

export const pricingTiers = [
  {
    name: 'Starter',
    monthlyPrice: '$0',
    annualPrice: '$0',
    description: 'Best for open-source projects and solo developers exploring AI reviews.',
    cta: 'Start Free',
    badge: '',
    features: [
      'Up to 3 repositories',
      'PR summaries and walkthroughs',
      'Basic AI comments for 5 PRs each month',
      'GitHub and GitLab support',
      'Community support',
    ],
  },
  {
    name: 'Team',
    monthlyPrice: '$19',
    annualPrice: '$15',
    description: 'Built for product teams that want reliable code review automation in their workflow.',
    cta: 'Start Team Trial',
    badge: 'Most Popular',
    features: [
      'Unlimited repositories and pull request reviews',
      'Inline AI comments with fix suggestions',
      'Review memory and custom rules',
      'Security checks, linters, and code summaries',
      'Analytics dashboard and IDE workflows',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    description: 'For organizations that need advanced controls, deployment flexibility, and dedicated support.',
    cta: 'Talk to Sales',
    badge: '',
    features: [
      'Everything in Team',
      'SSO and advanced role management',
      'Custom model and integration options',
      'Self-hosted or on-prem deployment',
      'Dedicated support and audit controls',
    ],
  },
];

export const pricingFaqs = [
  {
    question: 'What counts as a seat?',
    answer: 'A seat represents one developer or reviewer who actively uses RepoX workflows in the organization.',
  },
  {
    question: 'Is it free for open source?',
    answer: 'Yes. The Starter plan is designed to support public repositories and lighter review usage.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes. Teams can move between Starter, Team, and Enterprise as their workflow needs change.',
  },
  {
    question: 'What Git platforms are supported?',
    answer: 'RepoX is currently centered on GitHub in this frontend and is planned to expand to GitLab, Bitbucket, and Azure DevOps.',
  },
  {
    question: 'Is my code stored?',
    answer: 'For a simple campus-ready project, RepoX is designed to review code context without needing long-term storage of full source files.',
  },
  {
    question: 'How does per-seat pricing work?',
    answer: 'Each active developer or reviewer on a team counts as a seat, making pricing easy to explain for small teams and resumes.',
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
