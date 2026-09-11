# build_with_agents

**Build with Claude — AI Workshop #1 (Wintercircus)**, by Xander Steenbrugge.

| File | What it is |
|---|---|
| `build_with_claude_workshop.html` | The slide deck. Fonts and original imagery are embedded; curated illustrations load from the adjacent assets folder. No external scripts. |
| `assets/workshop/` | Two JPEG options per illustrated slide. Delete the unwanted option and reload; `01` wins while both exist. Keep filenames unchanged. |
| `build_with_claude_workshop.md` | The full working context behind the deck: brief, story, per-beat talk notes, the slide map the deck is built from, build-session ladder, takeaway pack, logistics. |
| `vercel.json` | Serves the deck at `/` on Vercel. No build step, no framework. |
| `.vercelignore` | Keeps the backstage files (the md, `README.md`, `CLAUDE.md`) out of the deployment — they stay in git. |

## Running it

Double-click `build_with_claude_workshop.html` — it works offline with `assets/` alongside it. Or serve the folder:

```bash
uv run python -m http.server 8000   # → http://localhost:8000/build_with_claude_workshop.html
```

## Deploying

The folder *is* the site. Push to `main` and Vercel redeploys it: no build command, no output directory, no dependencies. `vercel.json` rewrites `/` to the deck, so the root URL opens on slide 1 with no redirect hop.

Deep links work: `/#12` opens slide 12. On any other static host (Netlify, GitHub Pages), the same folder works — the deck is reachable at its filename.

## Deck controls

- **Arrow keys / clicker** advance; **clicking does not** (copy slides and the notes panel are clickable).
- **`N`** toggles per-slide speaker notes.
- **`T`** toggles a 60-minute elapsed clock.
- Prompt slides are click-to-copy (or press the prompt's number).
