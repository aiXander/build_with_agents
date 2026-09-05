# build_with_agents

**Build with Claude — AI Workshop #1 (Wintercircus)**, by Xander Steenbrugge.

| File | What it is |
|---|---|
| `build_with_claude_workshop.html` | The slide deck — the stage version (34 slides). Fully self-contained: fonts and images are base64-inlined, no network calls, no external scripts. |
| `build_with_claude_workshop.md` | The full working context behind the deck: brief, story, per-beat talk notes, the slide map the deck is built from, build-session ladder, takeaway pack, logistics. |
| `vercel.json` | Serves the deck at `/` on Vercel. No build step, no framework. |
| `.vercelignore` | Keeps the backstage files (the md, `README.md`, `CLAUDE.md`) out of the deployment — they stay in git. |

## Running it

Double-click `build_with_claude_workshop.html` — it works offline from a USB stick. Or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000/build_with_claude_workshop.html
```

## Deploying

The folder *is* the site. Push to `main` and Vercel redeploys it: no build command, no output directory, no dependencies. `vercel.json` rewrites `/` to the deck, so the root URL opens on slide 1 with no redirect hop.

Deep links work: `/#12` opens slide 12. On any other static host (Netlify, GitHub Pages), the same folder works — the deck is reachable at its filename.

## Deck controls

- **Arrow keys / clicker** advance; **clicking does not** (copy slides and the notes panel are clickable).
- **`N`** toggles per-slide speaker notes.
- **`T`** toggles a 60-minute elapsed clock.
- Slides 27 and 34 are click-to-copy (or press the prompt's number).
