# CLAUDE.md

## What this repo is

A **single talk**, and nothing else: *Build with Claude — AI Workshop #1*, Xander Steenbrugge at
Wintercircus (Ghent). Talk 13:00–14:15, break, hands-on build 14:30–15:45, show-and-tell 15:45–16:00,
beginner audience.

Two files, one relationship, plus the companion pages:

- **`build_with_claude_workshop.html` — the stage deck, and the source of truth for the talk
  itself.** What is on each slide, in what order, in what words. Also the website: on Vercel it is
  served at `/` by the rewrite in `vercel.json`. There is no `index.html` — don't add one, it would
  shadow the rewrite.
- **`build_with_claude_workshop.md` — the backstage doc. Secondary.** It holds what the deck
  can't: the brief, the core thread, per-beat talk notes, the build-session facilitation detail
  (blockers, fallbacks, the safety lines to say out loud), the takeaway pack manifest, logistics
  (Claude access model, pre-work email, helpers, and the cut order for when the talk runs long),
  open decisions, and the appendices — the `grilling` skill, the prompt library, the starter global
  `CLAUDE.md`, `skills.md` — which are the only copy of the `workshop_pack/` material. Its §4 slide
  map is now a record of how the deck was built, not a contract.
- **`global_claude_md.html` — the public cut of Xander's real global `~/.claude/CLAUDE.md`**, a
  scrollable page in the deck's theme, opened from the link on the first CLAUDE.md slide ("CLAUDE.md
  contains the most valuable tokens of your life") and served at `/claude-md` by a `vercel.json`
  rewrite. It is a hand-trimmed copy (about two thirds of the real file; the personal-goals include
  is cut), not generated from it — when the real file changes materially, re-trim by hand. Same
  no-dependency rules as the deck: fonts and logo are embedded data URIs.
- **`submit.html` + `feed.html` + `api/` — the link wall**, where the room drops what it built
  during the 15:45 show-and-tell. Served at `/submit` and `/feed`, and reached by the QR on the
  deck's final slide. Backed by a private Vercel Blob store. This is the one part of the repo that
  is not static: see [link wall](docs/reference/link-wall.md).

**Changes flow html → md, on request only.** The deck is edited directly and slide changes do
**not** need mirroring into the md — do a doc pass only when Xander explicitly asks for one. If the
two disagree about what a slide says, **the deck wins and the md is stale**; never edit the deck to
match §4. The md remains authoritative for everything that is not on a slide: logistics, the rung
detail, the open decisions, the appendices.

## The deck is a static HTML file with curated illustrations

No build step, no dependencies, no external scripts or third-party requests. Both brand fonts
(Futura Passata, Spline Sans) and the original imagery are base64 data URIs inside the HTML.
Generated illustrations live in `assets/workshop/`, as requested for deletion-based curation.
For offline use, copy that folder alongside the HTML; the room's wifi is not a dependency.

Keep the original embedded assets in place; don't add a CDN or a bundler. **This rule is about
the pages**, and it still holds for every one of them — the deck, `/claude-md`, `/submit`, `/feed`.
The `package.json` at the root exists only so the `api/` functions can import `@vercel/blob`;
Vercel installs it at deploy time and there is still no build step. Nothing the browser loads
comes from anywhere but this origin.
See [workshop images](docs/reference/workshop-images.md) for selection filenames, fallbacks,
the reusable visual style and exact generation prompts.

**Deploying:** the folder *is* the site — no build step, no framework. `vercel.json` serves the deck
at `/` and `.vercelignore` keeps the backstage files (the md, `CLAUDE.md`, `README.md`) out of the
deployment; they stay in git. Any push to `main` redeploys. On any other static host, the same
folder works by opening the deck's filename directly — **except the link wall**, which needs
Vercel's functions and the `BLOB_READ_WRITE_TOKEN` / `ADMIN_TOKEN` env vars.

Data embedded in the deck's `<script>`: `SHIP_ROWS`/`SHIP_MONTHS`/`SHIP_NAMES` drive the
four-years-of-shipping chart on slide 2 (monthly totals exact, per-repo split rounded to ~1K lines;
the last bar, Sept 2026, is a partial month — re-pulled 10 Sept 2026 and labelled as such on the
chart, so re-pulling it means updating `SHIP_ROWS`' last row, the legend's `TOTALS`, and the stats
strip together); `TALK_BUDGET_S` is the 60-minute clock. That chart holds its punchline back: the
May–Sept 2026 columns and the two annotations are drawn into `.frag` groups by `drawShipChart()`
and pop in on the slide's one click, so the first three years land alone first.

Deck controls: arrows/clicker advance, **clicking does not** (copy slides, the notes panel and
in-slide steps are clickable); `N` speaker notes, `T` elapsed clock; `.copy-slide` slides are
click-to-copy. The progressive-disclosure slide has five in-slide steps and the shipping chart one: elements with class `frag` (grouped by
`data-frag="n"`) reveal one step per arrow/tap before the deck moves on, and blocks with
`data-peek` open an overlay showing what is inside them. Mobile (`max-width: 760px` or a coarse
pointer): slides scroll vertically, tables become cards, swipe or the on-screen arrows advance.

## Provenance

Extracted 2026-09-05 from the `motherbrain` repo (`docs/presetations/`), where its sibling decks
still live. It is standalone on purpose — **do not re-couple it to motherbrain**: no imports, no
relative paths out of this folder, no shared tooling. Content *about* motherbrain (the `docs/`
three-folder workflow, the agent architecture) is illustrative material for the talk, not a
dependency.
