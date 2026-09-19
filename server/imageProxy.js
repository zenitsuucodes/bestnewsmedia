const imageBufferCache = new Map();

export function toProxyUrl(url) {
  if (!url || url.startsWith('/api/img')) return url;
  return `/api/img?url=${encodeURIComponent(url)}`;
}

export async function fetchRemoteImage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: new URL(url).origin,
      },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) return null;

    return { buffer, contentType };
  } catch {
    return null;
  }
}

export async function verifyRemoteImage(url) {
  if (imageBufferCache.has(url)) return true;
  const result = await fetchRemoteImage(url);
  if (!result) return false;
  imageBufferCache.set(url, result);
  return true;
}

export function getCachedImage(url) {
  return imageBufferCache.get(url) || null;
}

export function cacheImage(url, data) {
  imageBufferCache.set(url, data);
}
