const CATEGORY_FALLBACKS = {
  world: 'https://picsum.photos/id/100/1200/750',
  tech: 'https://picsum.photos/id/180/1200/750',
  business: 'https://picsum.photos/id/1050/1200/750',
  science: 'https://picsum.photos/id/49/1200/750',
  health: 'https://picsum.photos/id/582/1200/750',
  animals: 'https://picsum.photos/id/237/1200/750',
  sports: 'https://picsum.photos/id/28/1200/750',
  entertainment: 'https://picsum.photos/id/1043/1200/750',
  politics: 'https://picsum.photos/id/1015/1200/750',
};

const GLOBAL_FALLBACK = 'https://picsum.photos/id/1018/1200/750';

export function getFallbackImage(category) {
  return CATEGORY_FALLBACKS[category] || GLOBAL_FALLBACK;
}

export function resolveArticleImage(article) {
  return article?.image || getFallbackImage(article?.category);
}
