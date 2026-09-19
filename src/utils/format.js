export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function categoryLabel(id, categories = []) {
  return categories.find((c) => c.id === id)?.label || id;
}

export function categorySlug(id, categories = []) {
  return categories.find((c) => c.id === id)?.slug || id;
}

export function categoryFromSlug(slug, categories = []) {
  return categories.find((c) => c.slug === slug)?.id;
}
