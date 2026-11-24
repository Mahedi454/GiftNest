export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognises error handlers by their 4-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 4MB or smaller.' : err.message;
    return res.status(422).json({ message });
  }
  if (err.name === 'CastError') return res.status(404).json({ message: 'Resource not found.' });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    const message = `That ${field} is already in use.`;
    return res.status(422).json({ message, errors: { [field]: message } });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? 'Something went wrong on the server.' : err.message,
    errors: err.errors,
  });
}
