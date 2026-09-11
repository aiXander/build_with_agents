# The link wall — `/submit` and `/feed`

What the room built, collected during the workshop. Two pages and three API routes bolted onto
the static deck site. Added Sept 2026 for the 15:45–16:00 show-and-tell.

- **`/submit`** — name + email (both required), then a link *and/or* an `.html` / `.md` / `.txt`
  file. At least one of link/file, or it's rejected.
- **`/feed`** — the public wall. Newest first, refreshes itself every 20s, shows the QR that
  points back at `/submit`. This is the page to put on the projector. **Anyone can remove any
  card**, no login — see *Removal is open, and soft* below.
- The deck's **final slide (56, "Put it on the wall")** carries the same QR.

## Where the pieces are

| File | Role |
|---|---|
| `submit.html` | The form. Reads the file client-side as text, POSTs one JSON body. |
| `feed.html` | The wall. Polls `/api/feed`, renders cards, lazily opens sandboxed previews. |
| `api/_lib.js` | Shared: blob reads, id/kind validation, JSON responses. |
| `api/submit.js` | Validates and writes one entry (+ optional file blob). |
| `api/feed.js` | `GET` lists the wall; `DELETE` is moderation. |
| `api/file.js` | Serves one uploaded file back out of the private store. |
| `assets/wall-fonts.css` | The two brand `@font-face` rules, copied out of the deck. |
| `scripts/wall.mjs` | Terminal moderation: list, restore, destroy one, wipe, dump emails. |

The leading underscore in `_lib.js` is load-bearing: Vercel treats every other file in `api/` as a
route, and `_`-prefixed ones as plain modules.

## Removal is open, and soft

Deleting from the feed is deliberately unauthenticated: it is a workshop wall and the room is
trusted to tidy its own mess. What makes that safe to offer is that the button does not destroy
anything — `DELETE /api/feed?id=…` only sets a `removed` timestamp on the entry, and the feed
filters those out. So:

| | |
|---|---|
| **Remove** (feed button, two taps) | Sets the flag. Reversible by anyone, forever. |
| **Undo** (toast, 15s) | `PUT /api/feed?id=…` clears the flag. |
| **`npm run wall:restore -- <id>`** | The same, from the terminal, long after the toast is gone. |
| **`npm run wall:rm -- <id>`** / **`?hard=1`** | The only paths that actually destroy a blob. `hard=1` still needs `ADMIN_TOKEN`. |

`npm run wall` lists removed entries marked `[removed]`, which is how you find an id to restore.

Two things the UI has to do because of this, both non-obvious and both load-bearing:

1. **`render()` reconciles, it does not rebuild.** Cards already on screen keep their DOM nodes.
   Rebuilding the list every 20s would reset a half-pressed Remove button and collapse any HTML
   preview someone is reading.
2. **The tab trusts its own recent actions over the server for 30 seconds** (`pending` in
   `feed.html`). Blob reads are read-after-write *eventual* across function instances: a `GET`
   issued immediately after a remove can still return the old record and resurrect the card. The
   optimistic overlay hides that lag. Don't remove it because "it works locally" — it is exactly
   the kind of race that only shows up with a room full of people clicking.

## Why it is shaped this way

**Storage is one *private* Vercel Blob store (`workshop-wall`), no database.** A submission is two
blobs: `entries/<id>.json` (the record, including the email) and `files/<id>/<name>` (the upload).
`list()` over the `entries/` prefix *is* the query layer. There is no read-modify-write of a shared
index anywhere, which is the whole point — thirty people submitting at once cannot lose each
other's entries.

Two things follow from *private*, and both are deliberate:

1. **The email never becomes a public URL.** Entry JSON holds it; `/api/feed` strips it before
   responding. Nothing in the store is readable without `BLOB_READ_WRITE_TOKEN` (verified: an
   unauthenticated GET on a blob URL returns 403).
2. **Uploads are re-served by us, not linked directly.** `/api/file?id=…` fetches the blob
   server-side and sets the headers. Uploaded HTML goes out under
   `Content-Security-Policy: sandbox`, which drops a stranger's page into an opaque origin — it
   cannot touch anything of ours, and it cannot navigate the top window. The feed's inline preview
   is a second belt: an `<iframe sandbox="allow-scripts">`. Markdown and text are served as
   `text/plain` so the browser shows them rather than running them.

Blob pathnames are **deterministic** (`addRandomSuffix: false`), which is what lets `/api/file` and
the delete route find an entry from its id alone. Ids are random enough that this costs nothing.

`/api/feed` does one blob read per entry, all in parallel. Fine for tens of entries; if a wall ever
holds thousands, page it rather than widening the fan-out.

## Operating it

**Environment** (both already set on the `build-with-claude` Vercel project, all environments):

| Var | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Injected by the linked blob store. Everything reads and writes with it. |
| `ADMIN_TOKEN` | Moderation only. Without it the delete route returns 501 and the wall is append-only. |

### There is only one store

`BLOB_READ_WRITE_TOKEN` has the same value in production, preview and development, so **local
`vercel dev`, preview deploys and the live site all write to the same wall.** There is no staging
copy. Testing puts real rows on it; wipe before the room arrives.

### Moderating from a terminal — `scripts/wall.mjs`

The everyday tool. Talks to the blob store directly, so it needs neither the site to be up nor
`ADMIN_TOKEN`; it reads `BLOB_READ_WRITE_TOKEN` out of `.env.local`.

```bash
npm run wall                    # what is on the wall, with ids; [removed] ones included
npm run wall:restore -- <id>    # put back something the room removed
npm run wall:rm -- <id>         # destroy one entry and its file, for good
npm run wall:emails             # one address per line, for the follow-up mail
npm run wall:wipe               # empty it
```

`wipe` refuses without `--yes`, which the npm script supplies — so `npm run wall:wipe` really does
wipe, no second prompt.

### `ADMIN_TOKEN` — now only for destroying things

Since the room can remove cards on its own, the token guards just the irreversible path:

```bash
curl -X DELETE -H "x-admin-token: $ADMIN_TOKEN" \
  "https://build-with-agents.vercel.app/api/feed?id=<entry id>&hard=1"
```

That deletes the entry blob and its uploaded file for good. Without `&hard=1` the same call is the
ordinary soft remove and needs no token at all.

`ADMIN_TOKEN` is stored on Vercel as a *secret*, which means it cannot be read back — `vercel env
pull` writes `[SENSITIVE]` as a placeholder. If the only copy is lost, `vercel env rm` + `vercel env
add` a new one.

### Running it locally

`vercel dev` (after `vercel link` and `vercel env pull .env.local`), then
`localhost:3000/submit` and `/feed`. The pages are useless opened as `file://` — they need the
functions.

**Never add a `dev` script to `package.json`.** Vercel adopts it as the project's Development
Command, and `vercel dev` then invokes itself and refuses to start with
*"must not recursively invoke itself"*.

## Regenerating the QR

The QR encodes the absolute URL `https://build-with-agents.vercel.app/submit`, so it is baked into
**three** files: `submit.html`, `feed.html`, and slide 56 of the deck. If the domain ever changes,
all three need the new path, and the visible URL caption under each one too. On slide 56 the caption
*and* the code itself are also `<a href>`s to that same absolute URL — absolute on purpose, because
the deck is opened from `file://` for offline use, where a relative `/submit` would go nowhere.
`grep -c build-with-agents.vercel.app` across the three files is the quick check that nothing was
missed.

```bash
uvx --from segno segno --output=qr.svg --scale=1 --border=2 --dark=000 --light="" --error=m \
  "https://<new-domain>/submit"
```

Then copy the single `<path d="…">` value into each of the three `<svg viewBox="0 0 37 37">` blocks.
The `37` is the module count for a version-5 code at this URL length — a longer URL produces a
bigger matrix, so update the `viewBox` to match segno's `width`/`height` attributes.

Worth actually decoding the result (OpenCV's `QRCodeDetector`, or any phone) before printing it.
A wrong QR is not something you find out about gracefully at 15:45.

## Traps

- **Don't add an `index.html`.** Same reason as the deck: it shadows the `/` rewrite.
- The `vercel.json` header block sets `Cache-Control: no-store` on `/api/(.*)`, which **overrides**
  anything the functions set themselves. Change it there, not in the handler.
- `submit.html` reads files with `FileReader.readAsText`, so only text formats can ever work. An
  image or a zip would arrive as mojibake; the extension allowlist is what keeps that from
  happening.
- The honeypot field (`website`) returns a fake success rather than an error — a bot that gets told
  "rejected" just tries again.
