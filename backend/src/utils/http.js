export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function paginate(query, { defaultLimit = 12 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export const pageResult = (items, total, page, limit) => ({
  items,
  total,
  page,
  pages: Math.max(1, Math.ceil(total / limit)),
});

// Takes { field: errorMessageOrEmpty } and throws a 422 listing every field that has a message.
export function validate(rules) {
  const errors = {};
  for (const [field, message] of Object.entries(rules)) {
    if (message) errors[field] = message;
  }
  if (Object.keys(errors).length) {
    throw new HttpError(422, Object.values(errors)[0], errors);
  }
}

export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value || ''));
