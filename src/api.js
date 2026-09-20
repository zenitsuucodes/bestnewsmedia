import { CATEGORIES } from './data/categories.js';

let catalogPromise = null;

async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch('/catalog.json').then((res) => {
      if (!res.ok) throw new Error('Catalog unavailable');
      return res.json();
    });
  }
  return catalogPromise;
}

export const getCategories = () => Promise.resolve(CATEGORIES);

export async function getArticles(category) {
  const data = await loadCatalog();
  if (category) {
    return (data.byCategory[category] || []).slice(0, 100);
  }
  return data.articles.slice(0, 80);
}

export async function getArticle(id) {
  const data = await loadCatalog();
  const article = data.articles.find((a) => a.id === id);
  if (!article) throw new Error('Article not found');
  return article;
}

export async function getBreaking() {
  const data = await loadCatalog();
  return data.articles.slice(0, 6).map((a) => ({ id: a.id, title: a.title }));
}
