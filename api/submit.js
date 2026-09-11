// POST /api/submit — one entry on the wall.
//
// Body (JSON): { name, email, title?, note?, link?, file?: {name, content}, website? }
// `website` is a honeypot: real humans never see the input, bots fill it in.
// At least one of `link` / `file` must be present.
import { put } from '@vercel/blob';
import {
  ENTRY_PREFIX, MAX_FILE_BYTES, TEXT_KINDS,
  kindForFilename, newId, json, token,
} from './_lib.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LINK_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;

function clean(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

// The feed shows a plain-text taste of uploaded markdown without fetching the
// file. Strip the most common markdown furniture so the excerpt reads as prose.
function excerptOf(content) {
  return content
    .replace(/^---[\s\S]*?---/, '')       // frontmatter
    .replace(/```[\s\S]*?```/g, ' ')      // fenced code
    .replace(/<[^>]+>/g, ' ')             // tags
    .replace(/[#>*_`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 320);
}

// Everything that can make a submission invalid, in one place. Returns either
// {status, error} for the caller to hand back, or {entry, file} ready to store.
function validate(body) {
  const bad = (status, error) => ({ status, error });

  const name = clean(body.name, 80);
  const email = clean(body.email, 160);
  const link = clean(body.link, 600);

  if (name.length < 2) return bad(400, 'Please give your name (2 characters or more).');
  if (!EMAIL_RE.test(email)) return bad(400, 'That email address does not look right.');
  if (link && !LINK_RE.test(link)) return bad(400, 'A link has to start with http:// or https://');

  const raw = body.file && typeof body.file === 'object' ? body.file : null;
  let file = null;
  if (raw) {
    const fileName = clean(raw.name, 120).replace(/[^\w.\- ]+/g, '_') || 'upload.txt';
    const kind = kindForFilename(fileName);
    if (!kind) return bad(400, 'Only .html, .md or .txt files can be uploaded.');

    const content = typeof raw.content === 'string' ? raw.content : '';
    const size = Buffer.byteLength(content, 'utf8');
    if (!size) return bad(400, 'That file came through empty.');
    if (size > MAX_FILE_BYTES) return bad(413, 'That file is over 1 MB.');

    file = { fileName, kind, content, size };
  }

  if (!link && !file) {
    return bad(400, 'Add a link, or attach an .html / .md file — otherwise there is nothing to show.');
  }

  return {
    file,
    entry: {
      id: newId(),
      name,
      email, // private: lives only in the blob store, /api/feed strips it
      title: clean(body.title, 120),
      note: clean(body.note, 500),
      link,
      createdAt: new Date().toISOString(),
    },
  };
}

async function store(entry, file) {
  let stored = null;
  if (file) {
    const blob = await put(`files/${entry.id}/${file.fileName}`, file.content, {
      access: 'private',
      addRandomSuffix: false,
      contentType: TEXT_KINDS[file.kind].contentType,
      token: token(),
    });
    stored = {
      name: file.fileName,
      kind: file.kind,
      size: file.size,
      url: blob.url,
      excerpt: file.kind === 'html' ? '' : excerptOf(file.content),
    };
  }

  await put(`${ENTRY_PREFIX}${entry.id}.json`, JSON.stringify({ ...entry, file: stored }), {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/json',
    token: token(),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: 'Invalid JSON' }); }
  }
  if (!body || typeof body !== 'object') return json(res, 400, { error: 'Missing body' });

  // Honeypot: look successful, store nothing.
  if (clean(body.website, 100)) return json(res, 200, { ok: true, id: newId() });

  const result = validate(body);
  if (result.error) return json(res, result.status, { error: result.error });

  try {
    await store(result.entry, result.file);
    return json(res, 200, { ok: true, id: result.entry.id });
  } catch (err) {
    console.error('submit failed', err);
    return json(res, 500, { error: 'Could not save that — try again in a moment.' });
  }
}
