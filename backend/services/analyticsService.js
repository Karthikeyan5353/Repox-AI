import { find } from './dataStore.js';
import { buildDateBuckets, getDateRange } from '../utils/dateRange.js';

function fillBuckets(items, getter, days) {
  const buckets = buildDateBuckets(days);
  const map = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const item of items) {
    const key = getter(item);
    if (!key) {
      continue;
    }

    const bucket = map.get(key);
    if (bucket) {
      bucket.value += 1;
    }
  }

  return buckets.map((bucket) => ({
    date: bucket.key,
    value: bucket.value,
  }));
}

function toDayKey(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function getIssues(review) {
  return Array.isArray(review?.issues) ? review.issues : [];
}

export async function getDashboardMetrics(filter) {
  const { start, days } = getDateRange(filter);

  const [repositories, pullRequests, reviews, learnings] = await Promise.all([
    find('repositories'),
    find('pullRequests', { updatedAt: { $gte: start } }),
    find('reviews', { createdAt: { $gte: start } }),
    find('learnings'),
  ]);

  const mergedPullRequests = pullRequests.filter((pullRequest) => pullRequest.merged);
  const mergeTimes = mergedPullRequests
    .filter((pullRequest) => pullRequest.createdAtGithub && pullRequest.mergedAt)
    .map((pullRequest) => new Date(pullRequest.mergedAt) - new Date(pullRequest.createdAtGithub))
    .sort((left, right) => left - right);

  const medianMergeTimeHours = mergeTimes.length
    ? Math.round(mergeTimes[Math.floor(mergeTimes.length / 2)] / 36e5)
    : 0;

  const reviewCommentsCount = reviews.reduce((sum, review) => sum + (review.metrics?.totalIssues || 0), 0);
  const severityDistribution = reviews.reduce(
    (aggregate, review) => ({
      low: aggregate.low + (review.metrics?.lowSeverity || 0),
      medium: aggregate.medium + (review.metrics?.mediumSeverity || 0),
      high: aggregate.high + (review.metrics?.highSeverity || 0),
    }),
    { low: 0, medium: 0, high: 0 }
  );

  return {
    summary: {
      activeRepositories: repositories.length,
      mergedPullRequests: mergedPullRequests.length,
      activeUsers: Math.max(1, Math.round(repositories.length * 1.7)),
      chatUsage: reviews.filter((review) => review.scopeType === 'chat').length,
      medianMergeTimeHours,
      reviewerTimeSavedHours: Math.round(reviewCommentsCount * 0.18),
      reviewCommentsCount,
      severityDistribution,
      totalLearnings: learnings.length,
    },
    trends: {
      reviewFrequency: fillBuckets(reviews, (review) => toDayKey(review.createdAt), days),
      mergedPrs: fillBuckets(mergedPullRequests, (pullRequest) => toDayKey(pullRequest.updatedAt), days),
      issueCategories: ['bug', 'security', 'performance', 'quality', 'best-practice'].map((category) => ({
        category,
        value: reviews.reduce(
          (sum, review) => sum + getIssues(review).filter((issue) => issue.category === category).length,
          0
        ),
      })),
    },
  };
}

export async function getReportData(filter) {
  const { start, days } = getDateRange(filter);
  const reviews = await find('reviews', { createdAt: { $gte: start } });
  const pullRequests = await find('pullRequests', { updatedAt: { $gte: start } });

  const codeQualityTrend = fillBuckets(
    reviews,
    (review) => toDayKey(review.createdAt),
    days
  ).map((entry) => {
    const sameDayReviews = reviews.filter((review) => toDayKey(review.createdAt) === entry.date);
    const issueCount = sameDayReviews.reduce((sum, review) => sum + getIssues(review).length, 0);
    return {
      date: entry.date,
      score: sameDayReviews.length ? Math.max(35, 100 - issueCount * 4) : 0,
    };
  });

  const reviewFrequency = fillBuckets(
    reviews,
    (review) => toDayKey(review.createdAt),
    days
  );

  const issueCategoryBreakdown = ['bug', 'security', 'performance', 'quality', 'best-practice'].map((category) => ({
    category,
    count: reviews.reduce((sum, review) => sum + getIssues(review).filter((issue) => issue.category === category).length, 0),
  }));

  const organizationTrends = fillBuckets(
    pullRequests,
    (pullRequest) => toDayKey(pullRequest.updatedAt),
    days
  ).map((entry) => ({
    date: entry.date,
    activity: entry.value,
    simulatedTeams: Math.max(1, entry.value * 2),
  }));

  return {
    codeQualityTrend,
    reviewFrequency,
    issueCategoryBreakdown,
    organizationTrends,
  };
}
