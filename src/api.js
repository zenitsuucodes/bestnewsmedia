const API_BASE = '/api';

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const getCategories = () => fetchJson('/categories');
export const getArticles = (category) =>
  fetchJson(category ? `/articles?category=${category}&limit=100` : '/articles?limit=80');
export const getArticle = (id) => fetchJson(`/articles/${id}`);
export const getBreaking = () => fetchJson('/breaking');
