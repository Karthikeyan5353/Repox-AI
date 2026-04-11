import { getReportData } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getReportsController = asyncHandler(async (request, response) => {
  const data = await getReportData(request.query.filter || '30d');
  response.json(data);
});
