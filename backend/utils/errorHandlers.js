export function notFoundHandler(request, _response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500;

  response.status(status).json({
    message: error.message || 'Unexpected server error',
    details: error.details || null,
  });
}
