import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRemoteImage } from './imageProxy.js';
import { readJson, writeJson, useBlobStorage } from './persistence.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.join(__dirname, 'data', 'images');
const MANIFEST_NAME = 'image-manifest.json';

let manifest = null;

function useRemoteOnly() {
  return Boolean(process.env.VERCEL) || useBlobStorage();
}

function proxyImageUrl(remoteUrl) {
  return `/api/img?url=${encodeURIComponent(remoteUrl)}`;
}

async function loadManifest() {
  if (manifest) return;
  manifest = (await readJson(MANIFEST_NAME, {})) || {};
}

async function saveManifest() {
  await writeJson(MANIFEST_NAME, manifest);
}

function extFromContentType(contentType = '') {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  return '.jpg';
}

export function getStoredImagePath(articleId, sourceUrl) {
  if (useRemoteOnly() && sourceUrl) return proxyImageUrl(sourceUrl);
  return `/api/img/a/${articleId}`;
}

export async function hasStoredImage(articleId) {
  await loadManifest();
  const entry = manifest[articleId];
  if (!entry?.sourceUrl) return false;

  if (useRemoteOnly()) return true;

  if (!entry?.file) return false;
  try {
    await fs.access(path.join(IMAGE_DIR, entry.file));
    return true;
  } catch {
    return false;
  }
}

export async function getStoredImageUrl(articleId) {
  await loadManifest();
  const entry = manifest[articleId];
  if (!entry?.sourceUrl && !entry?.file) return null;

  if (useRemoteOnly()) {
    return entry.sourceUrl ? proxyImageUrl(entry.sourceUrl) : null;
  }

  if (await hasStoredImage(articleId)) {
    return getStoredImagePath(articleId);
  }
  return null;
}

export async function saveArticleImage(articleId, remoteUrl) {
  await loadManifest();

  const existing = manifest[articleId];
  if (existing?.sourceUrl || existing?.file) {
    return getStoredImageUrl(articleId);
  }

  if (useRemoteOnly()) {
    manifest[articleId] = {
      sourceUrl: remoteUrl,
      savedAt: new Date().toISOString(),
    };
    await saveManifest();
    return proxyImageUrl(remoteUrl);
  }

  const result = await fetchRemoteImage(remoteUrl);
  if (!result) return null;

  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const ext = extFromContentType(result.contentType);
  const filename = `${articleId}${ext}`;
  await fs.writeFile(path.join(IMAGE_DIR, filename), result.buffer);

  manifest[articleId] = {
    file: filename,
    sourceUrl: remoteUrl,
    contentType: result.contentType,
    savedAt: new Date().toISOString(),
  };
  await saveManifest();

  return getStoredImagePath(articleId);
}

export async function readStoredImage(articleId) {
  await loadManifest();
  const entry = manifest[articleId];
  if (!entry) return null;

  if (entry.sourceUrl) {
    return fetchRemoteImage(entry.sourceUrl);
  }

  if (!entry.file) return null;

  try {
    const buffer = await fs.readFile(path.join(IMAGE_DIR, entry.file));
    return { buffer, contentType: entry.contentType || 'image/jpeg' };
  } catch {
    return null;
  }
}

export async function applyStoredImages(articles) {
  for (const article of articles) {
    const stored = await getStoredImageUrl(article.id);
    if (stored) article.image = stored;
  }
  return articles;
}

export async function getUsedSourceUrls() {
  await loadManifest();
  return Object.values(manifest)
    .map((entry) => entry.sourceUrl)
    .filter(Boolean)
    .map((url) => url.split('?')[0]);
}
