const TOKEN_KEY = 'femcare_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),

  listLogs: () => request('/cycle'),
  addLog: (payload) => request('/cycle', { method: 'POST', body: payload }),
  deleteLog: (id) => request(`/cycle/${id}`, { method: 'DELETE' }),

  getReminders: () => request('/screening'),
  updateScreening: (payload) => request('/screening', { method: 'POST', body: payload }),

  listSpecialists: () => request('/specialists'),

  listBookings: () => request('/bookings'),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: payload }),
};
