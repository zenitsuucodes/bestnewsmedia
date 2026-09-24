export function titleToSlug(title = '') {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function articlePath(article) {
  const slug = article.slug || titleToSlug(article.title) || article.id;
  return `/article/${slug}`;
}
