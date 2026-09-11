#!/usr/bin/env node
// Moderating the link wall from a terminal, without the HTTP route or ADMIN_TOKEN.
//
//   node scripts/wall.mjs list           what is on the wall (emails included)
//   node scripts/wall.mjs restore <id>   put back something the room removed
//   node scripts/wall.mjs rm <id>        destroy one entry and its file, for good
//   node scripts/wall.mjs wipe           empty the wall
//   node scripts/wall.mjs emails         one address per line, for a follow-up mail
//
// Anyone on /feed can remove a card, but that only sets a `removed` flag — those
// show as [removed] here and `restore` brings them back. `rm` and `wipe` are the
// only things that actually destroy a blob.
//
// Reads BLOB_READ_WRITE_TOKEN from .env.local (`vercel env pull` puts it there).
import { list, del, head, put } from '@vercel/blob';
import fs from 'node:fs';

const ENV = '.env.local';
if (!process.env.BLOB_READ_WRITE_TOKEN && fs.existsSync(ENV)) {
  for (const line of fs.readFileSync(ENV, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('No BLOB_READ_WRITE_TOKEN. Run: vercel env pull .env.local');
  process.exit(1);
}

const read = async (url) =>
  (await fetch(url, { headers: { Authorization: `Bearer ${token}` } })).json();

async function entries() {
  const { blobs } = await list({ prefix: 'entries/', limit: 1000, token });
  const all = await Promise.all(blobs.map((b) => read(b.url).catch(() => null)));
  return all.filter(Boolean).sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
}

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'list') {
  const rows = await entries();
  if (!rows.length) console.log('The wall is empty.');
  for (const e of rows) {
    const gone = e.removed ? '  [removed]' : '';
    console.log(`${e.id}  ${new Date(e.createdAt).toLocaleString()}  ${e.name} <${e.email}>${gone}`);
    console.log(`          ${e.title || '(untitled)'}${e.link ? '  ' + e.link : ''}${e.file ? '  [' + e.file.name + ']' : ''}`);
  }
  const hidden = rows.filter((e) => e.removed).length;
  console.log(`\n${rows.length - hidden} on the wall${hidden ? `, ${hidden} removed (restore <id> to undo)` : ''}.`);

} else if (cmd === 'emails') {
  for (const e of await entries()) if (!e.removed) console.log(`${e.name} <${e.email}>`);

} else if (cmd === 'restore') {
  if (!arg) { console.error('Which id? `node scripts/wall.mjs list` shows them.'); process.exit(1); }
  let entry;
  try { entry = await read((await head(`entries/${arg}.json`, { token })).url); }
  catch { console.error(`No entry "${arg}".`); process.exit(1); }
  if (!entry.removed) { console.log(`"${entry.title || entry.id}" is already on the wall.`); process.exit(0); }
  const { removed, ...rest } = entry;
  await put(`entries/${arg}.json`, JSON.stringify(rest), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', token,
  });
  console.log(`Restored "${entry.title || entry.id}" by ${entry.name}.`);

} else if (cmd === 'rm') {
  if (!arg) { console.error('Which id? `node scripts/wall.mjs list` shows them.'); process.exit(1); }
  let entry;
  try { entry = await read((await head(`entries/${arg}.json`, { token })).url); }
  catch { console.error(`No entry "${arg}".`); process.exit(1); }
  if (entry.file?.url) await del(entry.file.url, { token });
  await del((await head(`entries/${arg}.json`, { token })).url, { token });
  console.log(`Removed "${entry.title || entry.id}" by ${entry.name}.`);

} else if (cmd === 'wipe') {
  const { blobs } = await list({ limit: 1000, token });
  if (!blobs.length) { console.log('Already empty.'); process.exit(0); }
  if (process.argv[3] !== '--yes') {
    console.error(`This deletes all ${blobs.length} blobs. Re-run with --yes to confirm.`);
    process.exit(1);
  }
  await del(blobs.map((b) => b.url), { token });
  console.log(`Wiped ${blobs.length} blobs.`);

} else {
  console.log('Usage: node scripts/wall.mjs list | emails | restore <id> | rm <id> | wipe --yes');
}
