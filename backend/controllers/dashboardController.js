import { getDashboardMetrics } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardController = asyncHandler(async (request, response) => {
  const data = await getDashboardMetrics(request.query.filter || '30d');
  response.json(data);
});
