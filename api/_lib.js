// Shared helpers for the /submit + /feed link wall.
//
// Storage is a single PRIVATE Vercel Blob store (`workshop-wall`). Private
// matters: entry JSON holds the submitter's email, and uploaded pages are
// served through /api/file so we control the response headers rather than
// handing out a raw public blob URL. Nothing in the store is reachable
// without BLOB_READ_WRITE_TOKEN.
import { head, put } from '@vercel/blob';

export const ENTRY_PREFIX = 'entries/';
export const MAX_FILE_BYTES = 1024 * 1024; // 1 MB of text is a very large README

export const TEXT_KINDS = {
  html: { ext: ['html', 'htm'], contentType: 'text/html; charset=utf-8' },
  markdown: { ext: ['md', 'markdown', 'mdx'], contentType: 'text/markdown; charset=utf-8' },
  text: { ext: ['txt'], contentType: 'text/plain; charset=utf-8' },
};

export function kindForFilename(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  for (const [kind, spec] of Object.entries(TEXT_KINDS)) {
    if (spec.ext.includes(ext)) return kind;
  }
  return null;
}

export function token() {
  const t = process.env.BLOB_READ_WRITE_TOKEN;
  if (!t) throw new Error('BLOB_READ_WRITE_TOKEN is not set on this deployment');
  return t;
}

// Private blobs 403 without the bearer token, so every read goes through here.
export async function readBlob(url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token()}` } });
  if (!res.ok) throw new Error(`blob read failed: ${res.status}`);
  return res;
}

export async function readEntry(id) {
  if (!/^[a-z0-9]{6,32}$/.test(id || '')) return null;
  let meta;
  try {
    meta = await head(`${ENTRY_PREFIX}${id}.json`, { token: token() });
  } catch {
    return null; // BlobNotFoundError
  }
  return await (await readBlob(meta.url)).json();
}

// Rewrites an entry in place. Used for the soft delete: anyone on the feed can
// remove a card, so "removed" is a flag on the record, never a destroyed blob —
// a mis-tap is one Undo away, and nothing is actually lost until someone runs
// `npm run wall:rm`.
export async function writeEntry(entry) {
  await put(`${ENTRY_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token: token(),
  });
}

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}
