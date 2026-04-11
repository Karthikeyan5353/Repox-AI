import { find, findOne, upsert } from './dataStore.js';

function buildLearningKey(issue) {
  return `${issue.category || 'quality'}:${issue.title?.trim().toLowerCase() || 'untitled'}`;
}

export async function recordLearnings(issues, reviewId) {
  const operations = issues.map((issue) => {
    const key = buildLearningKey(issue);

    return (async () => {
      const existing = await findOne('learnings', { key });
      const sourceReviews = Array.isArray(existing?.sourceReviews) ? existing.sourceReviews : [];

      return upsert(
        'learnings',
        { key },
        {
          title: existing?.title || issue.title,
          category: issue.category || existing?.category || 'quality',
          pattern: existing?.pattern || issue.filePath || '',
          description: existing?.description || issue.description || '',
          suggestedFix: issue.suggestedFix || existing?.suggestedFix || '',
          severity: issue.severity || existing?.severity || 'medium',
          usageCount: (existing?.usageCount || 0) + 1,
          lastUsedAt: new Date().toISOString(),
          firstSeenAt: existing?.firstSeenAt || new Date().toISOString(),
          sourceReviews: sourceReviews.includes(reviewId) ? sourceReviews : [...sourceReviews, reviewId],
        }
      );
    })();
  });

  await Promise.all(operations);
}

export async function getLearningContext(limit = 20) {
  const learnings = await find('learnings', {}, { sort: { usageCount: -1, lastUsedAt: -1 }, limit });

  return learnings
    .map(
      (learning) =>
        `- ${learning.title} [${learning.category}/${learning.severity}] usage=${learning.usageCount}: ${learning.description}`
    )
    .join('\n');
}
