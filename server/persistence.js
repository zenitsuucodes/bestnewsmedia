import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { put, list } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DATA_DIR = path.join(__dirname, 'data');

let blobWarned = false;

export function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function blobPath(name) {
  return `bestnewsmedia/${name}`;
}

export async function readJson(name, fallback = null) {
  if (useBlobStorage()) {
    try {
      const { blobs } = await list({ prefix: blobPath(name), limit: 1 });
      if (!blobs.length) return fallback;
      const res = await fetch(blobs[0].url, { cache: 'no-store' });
      if (!res.ok) return fallback;
      return res.json();
    } catch {
      return fallback;
    }
  }

  try {
    const raw = await fs.readFile(path.join(LOCAL_DATA_DIR, name), 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJson(name, data) {
  const body = JSON.stringify(data);

  if (process.env.VERCEL && !useBlobStorage()) {
    if (!blobWarned) {
      console.warn('Vercel Blob not linked — cache updates will not persist until Blob storage is added.');
      blobWarned = true;
    }
    return;
  }

  if (useBlobStorage()) {
    await put(blobPath(name), body, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DATA_DIR, name), body);
}

export async function readStaticCatalog() {
  const urls = new Set();

  if (process.env.VERCEL_URL) {
    urls.add(`https://${process.env.VERCEL_URL}/catalog.json`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    urls.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/catalog.json`);
  }
  urls.add('https://bestnewsmedia.vercel.app/catalog.json');

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return res.json();
    } catch {
      // try next
    }
  }

  try {
    const raw = await fs.readFile(path.join(__dirname, '..', 'public', 'catalog.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
