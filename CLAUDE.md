# CLAUDE.md

## What this repo is

A **single talk**, and nothing else: *Build with Claude — AI Workshop #1*, Xander Steenbrugge at
Wintercircus (Ghent). Talk 13:00–14:00, hands-on build session 14:00–16:00, beginner audience.

Two files, one relationship:

- **`build_with_claude_workshop.md` — the source of truth.** The full working context: the brief,
  the core thread, per-beat talk notes, the **slide map (§4) that is the contract for the deck**,
  the build-session ladder, takeaway pack, logistics, open decisions.
- **`build_with_claude_workshop.html` — the stage deck.** The condensed performance of §4, and
  also the website: on Vercel it is served at `/` by the rewrite in `vercel.json`. There is no
  `index.html` — don't add one, it would shadow the rewrite.

**Changes flow md → html.** If the two disagree about what a slide says, the md's §4 slide map wins
and the deck is stale. Never edit the deck to say something §4 doesn't.

## The deck is deliberately one self-contained file

No build step, no dependencies, no network calls, no external scripts. Both brand fonts
(Futura Passata, Spline Sans) and both images are **base64 data URIs inside the HTML** — that's
~414 KB of its 692 KB. It must keep working offline from a USB stick, because it does: the room's
wifi is not a dependency of the talk.

So: never split assets into an `assets/` folder, never add a CDN link, a bundler, or a package
manager. Edit the HTML in place.

**Deploying:** the folder *is* the site — no build step, no framework. `vercel.json` serves the deck
at `/` and `.vercelignore` keeps the backstage files (the md, `CLAUDE.md`, `README.md`) out of the
deployment; they stay in git. Any push to `main` redeploys. On any other static host, the same
folder works by opening the deck's filename directly.

Data embedded in the deck's `<script>`: `SHIP_ROWS`/`SHIP_MONTHS`/`SHIP_NAMES` drive the
four-years-of-shipping chart on slide 4 (monthly totals exact, per-repo split rounded to ~1K lines);
`TALK_BUDGET_S` is the 60-minute clock.

Deck controls: arrows/clicker advance, **clicking does not** (copy slides, the notes panel and
in-slide steps are clickable); `N` speaker notes, `T` elapsed clock; slides 26, 28 and 35 are
click-to-copy. Slide 18 has five in-slide steps: elements with class `frag` (grouped by
`data-frag="n"`) reveal one step per arrow/tap before the deck moves on, and blocks with
`data-peek` open an overlay showing what is inside them. Mobile (`max-width: 760px` or a coarse
pointer): slides scroll vertically, tables become cards, swipe or the on-screen arrows advance.

## Provenance

Extracted 2026-09-05 from the `motherbrain` repo (`docs/presetations/`), where its sibling decks
still live. It is standalone on purpose — **do not re-couple it to motherbrain**: no imports, no
relative paths out of this folder, no shared tooling. Content *about* motherbrain (the `docs/`
three-folder workflow, the agent architecture) is illustrative material for the talk, not a
dependency.
