import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRemoteImage } from './imageProxy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.join(__dirname, 'data', 'images');
const MANIFEST_PATH = path.join(__dirname, 'data', 'image-manifest.json');

let manifest = {};
let manifestLoaded = false;

async function ensureDir() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });
}

async function loadManifest() {
  if (manifestLoaded) return;
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(raw);
  } catch {
    manifest = {};
  }
  manifestLoaded = true;
}

async function saveManifest() {
  await ensureDir();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function extFromContentType(contentType = '') {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  return '.jpg';
}

export function getStoredImagePath(articleId) {
  return `/api/img/a/${articleId}`;
}

export async function hasStoredImage(articleId) {
  await loadManifest();
  const entry = manifest[articleId];
  if (!entry?.file) return false;
  try {
    await fs.access(path.join(IMAGE_DIR, entry.file));
    return true;
  } catch {
    return false;
  }
}

export async function getStoredImageUrl(articleId) {
  if (await hasStoredImage(articleId)) {
    return getStoredImagePath(articleId);
  }
  return null;
}

export async function saveArticleImage(articleId, remoteUrl) {
  await loadManifest();
  await ensureDir();

  const existing = await hasStoredImage(articleId);
  if (existing) {
    return getStoredImagePath(articleId);
  }

  const result = await fetchRemoteImage(remoteUrl);
  if (!result) return null;

  const ext = extFromContentType(result.contentType);
  const filename = `${articleId}${ext}`;
  const filePath = path.join(IMAGE_DIR, filename);

  await fs.writeFile(filePath, result.buffer);

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
  if (!entry?.file) return null;

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
