function handleApiError(error, request, response, _next) {
  console.error(error.message);

  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({
      message: 'Invalid JSON in request body',
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return response.status(400).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: 'An internal server error occurred',
  });
}

export default handleApiError;