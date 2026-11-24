export function notFound(req, res) {
  res.status(404).json({ message: 'We could not find what you were looking for.' });
}

// Express recognises error handlers by their 4-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 4MB or smaller.' : err.message;
    return res.status(422).json({ message });
  }
  if (err.name === 'CastError') return res.status(404).json({ message: 'We could not find what you were looking for.' });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    const message = `That ${field} is already in use.`;
    return res.status(422).json({ message, errors: { [field]: message } });
  }
  // Errors we raise on purpose (HttpError) carry a status and a message that is safe to show.
  // Anything else is unexpected, so its details stay in the server log only.
  const expected = Boolean(err.status);
  const status = err.status || 500;
  if (!expected) console.error(err);
  res.status(status).json({
    message: expected ? err.message : 'Something went wrong on the server.',
    errors: err.errors,
  });
}
