const BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'giftnest_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => (token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors || {};
  }
}

async function request(method, path, body) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Make sure the backend is running.', 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // A non-JSON error (e.g. 500/502 from the dev proxy) means the API itself is down.
    const fallback = response.status >= 500 ? 'Cannot reach the server. Make sure the backend is running.' : 'Request failed.';
    throw new ApiError(data.message || fallback, response.status, data.errors);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path, body) => request('DELETE', path, body),
};

// Product images are served by the API, so relative paths like /images/... need the API origin.
export const assetUrl = (path) => (path && path.startsWith('/') ? `${BASE}${path}` : path || '');

export const money = (value, digits = 2) =>
  `Tk ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const initials = (name = '') =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export const formatDate = (iso, withDay = true) =>
  new Date(iso).toLocaleDateString('en-GB', { day: withDay ? '2-digit' : undefined, month: 'short', year: 'numeric' });
