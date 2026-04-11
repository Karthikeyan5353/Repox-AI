import { asyncHandler } from '../utils/asyncHandler.js';
import { convertToCsv } from '../utils/csv.js';
import { count, find } from '../services/dataStore.js';

export const listLearningsController = asyncHandler(async (request, response) => {
  const query = request.query.q?.trim();
  const usageFilter = request.query.usage || 'all';
  const filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ];
  }

  if (usageFilter === 'never-used') {
    filter.usageCount = 0;
  } else if (usageFilter === 'recently-used') {
    filter.lastUsedAt = { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) };
  }

  const learnings = await find('learnings', filter, { sort: { usageCount: -1, lastUsedAt: -1 } });
  const stats = {
    total: await count('learnings'),
    recentlyUsed: await count('learnings', {
      lastUsedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
    }),
    neverUsed: await count('learnings', { usageCount: 0 }),
  };

  response.json({ stats, learnings });
});

export const exportLearningsController = asyncHandler(async (_request, response) => {
  const learnings = await find('learnings', {}, { sort: { usageCount: -1 } });
  const csv = convertToCsv(learnings, [
    'title',
    'category',
    'severity',
    'usageCount',
    'pattern',
    'description',
    'suggestedFix',
    'lastUsedAt',
  ]);

  response.setHeader('Content-Type', 'text/csv');
  response.setHeader('Content-Disposition', 'attachment; filename=\"repox-learnings.csv\"');
  response.send(csv);
});
