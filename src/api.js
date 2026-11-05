// All communication with the Express backend goes through this file (Fetch API).
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'wa_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = token => (token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request('/auth/me'),
  // dashboard numbers
  stats: () => request('/stats'),
  // books
  getBooks: () => request('/books'),
  createBook: book => request('/books', { method: 'POST', body: book }),
  updateBook: (id, book) => request(`/books/${id}`, { method: 'PUT', body: book }),
  deleteBook: id => request(`/books/${id}`, { method: 'DELETE' }),
  // transactions
  getTransactions: () => request('/transactions'),
  createTransaction: tx => request('/transactions', { method: 'POST', body: tx }),
  // users
  getUsers: () => request('/users'),
  createUser: user => request('/users', { method: 'POST', body: user }),
  updateUser: (id, user) => request(`/users/${id}`, { method: 'PUT', body: user }),
  deleteUser: id => request(`/users/${id}`, { method: 'DELETE' })
};
