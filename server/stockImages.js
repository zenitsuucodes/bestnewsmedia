import crypto from 'crypto';

// Verified Picsum IDs — stable, no watermarks, always load
const CATEGORY_PHOTOS = {
  world: [100, 101, 1015, 1018, 1025, 1035],
  tech: [180, 366, 775, 684, 1060, 1074],
  business: [1050, 1060, 1074, 48, 100, 1018],
  science: [49, 1035, 1043, 1025, 1015, 684],
  health: [582, 1025, 1035, 1043, 1018, 49],
  animals: [237, 433, 582, 28, 49, 1015],
  sports: [28, 48, 49, 433, 684, 775],
  entertainment: [1043, 1050, 1018, 1074, 366, 180],
  politics: [100, 1015, 1060, 101, 1025, 1050],
};

const DEFAULT_PHOTOS = [100, 101, 1015, 1018, 1025];

function hashIndex(seed, length) {
  const hash = crypto.createHash('md5').update(String(seed)).digest('hex');
  return parseInt(hash.slice(0, 8), 16) % length;
}

export function getStockImage(category, articleId) {
  const pool = CATEGORY_PHOTOS[category] || DEFAULT_PHOTOS;
  const photoId = pool[hashIndex(articleId || category, pool.length)];
  return buildImageUrl(photoId);
}

export function getCategoryFallback(category) {
  const pool = CATEGORY_PHOTOS[category] || DEFAULT_PHOTOS;
  return buildImageUrl(pool[0]);
}

function buildImageUrl(id) {
  return `https://picsum.photos/id/${id}/1200/750`;
}
