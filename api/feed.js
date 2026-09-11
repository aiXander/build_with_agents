// GET    /api/feed             — the wall, newest first. Emails stripped, removed entries hidden.
// DELETE /api/feed?id=…        — anyone can take a card down. Soft: sets a flag, destroys nothing.
// PUT    /api/feed?id=…        — put it back. This is what the Undo button calls.
// DELETE /api/feed?id=…&hard=1 — actually destroy it. Needs `x-admin-token`.
//
// Delete is deliberately open: it is a workshop wall, and the room is trusted to
// tidy its own mess. Soft-by-default is what makes that safe to offer — every
// removal is reversible from the feed for a few seconds, and from
// `npm run wall:restore` forever after.
import { list, del, head } from '@vercel/blob';
import { ENTRY_PREFIX, readBlob, readEntry, writeEntry, json, token } from './_lib.js';

export default async function handler(req, res) {
  if (req.method === 'DELETE') return remove(req, res);
  if (req.method === 'PUT') return restore(req, res);
  if (req.method !== 'GET') return json(res, 405, { error: 'GET, DELETE or PUT' });

  try {
    const { blobs } = await list({ prefix: ENTRY_PREFIX, limit: 1000, token: token() });

    // One fetch per entry, all in flight at once. A workshop wall is tens of
    // entries, not thousands — if that ever changes, page it instead.
    const entries = (await Promise.all(blobs.map(async (b) => {
      try {
        const e = await (await readBlob(b.url)).json();
        if (e.removed) return null;
        return {
          id: e.id,
          name: e.name,
          title: e.title || '',
          note: e.note || '',
          link: e.link || '',
          createdAt: e.createdAt,
          file: e.file ? {
            name: e.file.name,
            kind: e.file.kind,
            size: e.file.size,
            excerpt: e.file.excerpt || '',
            url: `/api/file?id=${encodeURIComponent(e.id)}`,
          } : null,
        };
      } catch (err) {
        console.error('skipping unreadable entry', b.pathname, err);
        return null;
      }
    }))).filter(Boolean);

    entries.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return json(res, 200, { count: entries.length, entries });
  } catch (err) {
    console.error('feed failed', err);
    return json(res, 500, { error: 'Could not load the feed.' });
  }
}

async function remove(req, res) {
  const id = (req.query.id || '').toString();
  const entry = await readEntry(id);
  if (!entry) return json(res, 404, { error: 'That one is already gone.' });

  if (req.query.hard) return hardDelete(req, res, entry);

  try {
    await writeEntry({ ...entry, removed: new Date().toISOString() });
    return json(res, 200, { ok: true, removed: id, title: entry.title || '', name: entry.name });
  } catch (err) {
    console.error('remove failed', err);
    return json(res, 500, { error: 'Could not remove that.' });
  }
}

async function restore(req, res) {
  const id = (req.query.id || '').toString();
  const entry = await readEntry(id);
  if (!entry) return json(res, 404, { error: 'That one is gone for good.' });

  try {
    const { removed, ...rest } = entry;
    await writeEntry(rest);
    return json(res, 200, { ok: true, restored: id });
  } catch (err) {
    console.error('restore failed', err);
    return json(res, 500, { error: 'Could not put that back.' });
  }
}

// The only irreversible path, and the only one still behind the token.
async function hardDelete(req, res, entry) {
  const admin = process.env.ADMIN_TOKEN;
  if (!admin) return json(res, 501, { error: 'No ADMIN_TOKEN set on this deployment.' });
  if (req.headers['x-admin-token'] !== admin) return json(res, 401, { error: 'Nope.' });

  try {
    if (entry.file?.url) await del(entry.file.url, { token: token() });
    const meta = await head(`${ENTRY_PREFIX}${entry.id}.json`, { token: token() });
    await del(meta.url, { token: token() });
    return json(res, 200, { ok: true, deleted: entry.id });
  } catch (err) {
    console.error('hard delete failed', err);
    return json(res, 500, { error: 'Delete failed.' });
  }
}
