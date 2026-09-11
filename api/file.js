// GET /api/file?id=... — serve one uploaded file from the private store.
//
// Uploaded HTML is a stranger's page rendered under our own hostname, so it
// goes out under `Content-Security-Policy: sandbox`. That drops the document
// into an opaque origin: its scripts cannot read anything of ours, and it
// cannot navigate the top window. Markdown and text are served as text/plain
// so the browser shows them rather than interpreting them.
import { TEXT_KINDS, readBlob, readEntry } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('GET only');

  const id = (req.query.id || '').toString();
  const entry = await readEntry(id);
  if (!entry || !entry.file || entry.removed) return res.status(404).send('Not found');

  try {
    const upstream = await readBlob(entry.file.url);
    const body = await upstream.text();

    const isHtml = entry.file.kind === 'html';
    res.setHeader('Content-Type', isHtml
      ? TEXT_KINDS.html.contentType
      : 'text/plain; charset=utf-8');
    if (isHtml) {
      res.setHeader('Content-Security-Policy', 'sandbox allow-scripts allow-popups allow-forms');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(body);
  } catch (err) {
    console.error('file read failed', err);
    return res.status(500).send('Could not read that file.');
  }
}
