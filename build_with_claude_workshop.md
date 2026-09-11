# Build with Claude — AI Workshop #1 (Wintercircus)

Full working context for the workshop. The slide deck next to this file
(`build_with_claude_workshop.html`) is the condensed stage version; this doc holds
everything behind it: the brief, the story, the per-beat talk notes, the **slide map the deck
is built from (§4)**, the build-session ladder, the takeaway pack, logistics, risks, and the
open decisions.

> **Deck status:** built to the slide map in §4 (46 slides, same visual system as the
> launch deck). Speaker view: `N` toggles per-slide notes (the §3 talk notes, condensed), `T` a
> 60-minute elapsed clock. Keys and clickers advance; **clicking does not** (the copy slides, the
> notes panel and the steps on slide 19 are clickable). Slides 31, 33, 38 and 46 are click-to-copy (or
> press the prompt's number). Slide 19 builds in five steps (→ or a tap) before the deck moves on; going
> back into it shows all five. On phones and touch tablets each slide scrolls vertically and a swipe
> or the on-screen arrows advance; the nav dots, key hints and notes panel are hidden there.
> Slides 10 and 22 use HTML mock-ups (a terminal, the trimmed global file) instead of screenshots.
> The four-years chart (slide 4) is redrawn from the *Four Years of Shipping* report; its data is
> embedded in the deck's script (`SHIP_ROWS`), monthly totals exact, per-repo split to ~1K lines.

---

## 1. The brief (as published by Wintercircus)

> **1st AI Workshop — Build with Claude (for beginners): Skills, Tools & MCP Servers**
> with Xander Steenbrugge · Level: beginner 🌶️
>
> You've heard about AI agents. Maybe you've used Claude. But do you know what's actually
> happening under the hood and how to build something yourself? This one is for beginners!
>
> Xander Steenbrugge does. AI researcher, full-stack engineer, and the architect behind
> our Digital Community — the agent, memory and matchmaking layer powering the
> Wintercircus community. In this hands-on workshop, he breaks down what AI agents
> actually are, how they're built, and how you can start putting them to work.
> No prior experience needed.
>
> Come prepared. Bring your laptop and your questions.

| Slot | Time | Format |
|---|---|---|
| Talk | 13:00 – 14:00 | Xander on stage, laptop + projector |
| Build | 14:00 – 16:00 | Interactive building session, with guidance |

**Audience:** beginners. Expect a mix of founders, ops/marketing people, a few devs who
have never used an agent, and some who've only used the Claude chat app. Assume no
terminal experience for a meaningful share of the room.

---

## 2. The core thread

**"Four months ago I was a backend Python dev. Now I ship a full-stack product. The only
thing that changed was how I work."**

And the second half of that sentence, which the whole middle of the talk unpacks:
**"…and 'how I work' mostly means: I stopped writing code and started writing English."**

Everything in the three hours hangs off those two lines:

- Claude is the senior engineer who knows every stack and never gets tired of questions.
- You are the architect: you decide *what* to build, *for whom*, and *whether it's right*.
- The scarce resource is no longer implementation skill. It's the spark, the judgment, and
  **the quality of the context you hand the model.**

The point of the workshop is not to teach Claude Code. It's to make people leave believing
they can build the thing they've been carrying around in their head, and to give them the
first 200 metres of the path — plus the handful of working habits that took me four months
to learn.

### Proof that this works: the Wintercircus Community Brain

The product I built from scratch since ~March 2026, launched on stage at the Collective
Opening (3 Sept 2026):

| Layer | What I used | Had I used it before? |
|---|---|---|
| Frontend | Next.js 16 App Router, on Vercel | No |
| Auth | Clerk | No |
| Database | Neon Postgres + pgvector | Postgres yes, Neon/pgvector no |
| Backend | FastAPI on Modal (serverless) | Python yes, Modal yes |
| Agents | Hermes workers, one sandbox per user, custom MCP server | No (built it) |
| Voice | ElevenLabs realtime | No |
| Memory | A from-scratch collective memory engine | No (built it) |

All of it built in conversation with Claude Code, with Claude doing the typing and me doing
the deciding. That table is the hook slide.

---

## 3. The talk (13:00 – 14:00)

Seven beats, ~62 minutes of content for a 60-minute slot — deliberately over budget, so the cut
order in §7 matters and at least one item on it *will* be used. Demos over slides wherever
possible. The beats build on each other: *agent → context → the file that holds the context →
the English that produces the code → what it takes to put the result on the internet → what
you'll do with it.*

| # | Beat | Min | The one idea |
|---|---|---|---|
| 3.1 | The hook | 8 | The only thing that changed was how I work |
| 3.2 | What an agent actually is | 9 | A model + tools + a loop — and the harness runs wherever you put it |
| 3.3 | Everything is context engineering | 13 | Your real job is managing one context window; tools, MCP, skills and `.md` files are all ways to do that — and a full window is a worse model |
| 3.4 | CLAUDE.md: the most valuable tokens of your life | 8 | The file the model reads first, every time — global and per project |
| 3.5 | 80% of my tokens are English | 15 | The loop: Analyze & Propose → Improve → Implement → Review; work in sprints, not tweaks; grill yourself; the prompts I reuse; the failures; two weeks is a day |
| 3.6 | Deploy your own product | 5 | A product is many pieces; for every one you don't know, ask — the lesson: a willingness to learn |
| 3.7 | What people actually do with it + bridge | 4 | The use-case menu, then the ladder |

### 3.1 The hook (8 min)

- Open cold with the **live demo** of the Community Brain inside the Wintercircus app.
  Ask it something real ("who here has scaled a hardware product?"). Let the room see an
  agent do actual work before any theory. Optional: the "No women?" exchange from
  `agent_moments.md` (2026-09-05) — the agent naming a data gap instead of padding a list is
  a better ad for *judgment* than any feature.
- Then the reveal: the stack table above. "I had never touched most of this before March."
- Land the thread: the only thing that changed was *how I work*.

Stage notes: the demo must be rehearsed and have a fallback (screen recording) in case the
venue wifi dies. Keep it under 3 minutes.

### 3.2 What an agent actually is (9 min)

Demystify. Most people picture either a chatbot or a sci-fi robot. It's neither.

- **A model + some tools + a loop.** Think → Act (call a tool) → Observe (result comes
  back as text) → repeat until done. A chatbot stops after "think." An agent runs the loop.
- **Show a real tool call happening.** Open Claude Code in a terminal, ask it something that
  requires reading a file, and narrate what's on screen: "that's the model deciding, that's
  the tool call, that's the result coming back."
- Everything else people hear about (memory, planning, "autonomy", multi-agent) is this
  same loop with better tools and a longer leash.
- Plant the seed for the next beat: *everything the model knows about your problem is
  whatever is inside that one window right now.* Point at the terminal: "that scrollback
  is its entire world."

Four slides in the deck (5–8), one running example: the model is a text machine → a tool is a
description and a call is text the model writes → the harness (ten lines of code) catches it,
runs the real function, pastes the result back → the loop. No architecture porn.

**Then one slide on where the harness runs (slide 9)**, because beginners never ask and it bites
them in week one. The model is always remote — Anthropic's servers. The *harness* is the part you
place. In Claude Code the harness is a program in your terminal, on your laptop: the loop, the tool
calls, your files are all local, which is why closing the lid stops everything. On the claude.ai
website the harness runs on their servers: close the lid, open your phone, the conversation is still
there — but that harness can't touch your files or your tools. The fix, once you want an agent that
keeps working: run your own harness on an always-on machine in the cloud (a small VM; many ways to
do it), and talk to it from your phone. Same loop, different room.

### 3.3 Everything is context engineering (13 min)

The intellectual centre of the talk. "Prompt engineering" was about the sentence you type.
Working with agents is about **what's in the window and when it gets there.**

**The problem in one line:** the model is brilliant and has amnesia. Every session starts
empty. Everything it knows about you, your project, your taste and your tools has to be
*put* there — and the window is finite and costs money, so you can't put everything there
all the time.

**So the whole craft is: the right context, at the right moment, and nothing else.** Every
mechanism people hear about is one answer to that:

| Mechanism | What it is | Context-engineering role | When it's loaded |
|---|---|---|---|
| **CLAUDE.md** | A prose file the agent reads at the start of every session | The *always-on* map: mission, conventions, gotchas, pointers | Always (so keep it small) |
| **`docs/*.md`** | Ordinary markdown files in the repo | Knowledge *on demand* — the agent reads the one doc relevant to today's task | When the map points at it |
| **Skills** | A folder: instructions + examples for one kind of task | **Progressive disclosure** — a one-line description is always visible, the full instructions load only when triggered | On trigger |
| **Tools** | A function the model may call, one verb each | The agent's *hands*; each tool's schema is context too, so fewer sharper tools beat many vague ones | At session start (schemas), results on call |
| **MCP servers** | A standard plug: a service exposes its tools + instructions once, any agent can use them | Packaging tools *and* the instructions for using them into one connectable unit | On connect |
| **Memory** | Whatever the agent writes down to read back later | Context that survives the session (the Community Brain is exactly this, at community scale) | On recall |

Examples for each, all from the brain so it isn't abstract: `find_matches` / `recall_memory`
(tools); the one MCP server handing ~15 community tools to every member's agent + the Odoo
MCP reading the member CRM (MCP); the `event_calendar` skill teaching the agent how to
recommend events (skill); `docs/reference/*.md` — one doc per subsystem, loaded only when
that subsystem is touched (docs on demand).

In the deck the table (slide 12) is followed by one slide per mechanism (13–18), each with a
visual of the thing itself and the same three facts: what it is, when it's in the window, where
it shows up in the brain. The three words in the workshop title are three of the six.

Two rules that follow directly, and that beginners get wrong:

1. **Progressive disclosure beats a giant prompt.** Don't paste everything you know into
   every session. Write it once, somewhere the agent can find it when it matters.
2. **Stale context is worse than no context.** The model *believes* what's in the window.
   A doc describing code that no longer exists is a lie the agent will act on. (Failure
   story for 3.5.)
3. **More skills is not a better agent.** Only a skill's *body* is lazy — its description
   sits in the window every session, forever, and the model has to choose between all of
   them. Twenty half-used skills is a junk drawer you pay rent on. Install for a pain you
   actually had this week; write your own for the chores you repeat. (Paid off in 3.7.)

**Context rot** (slide 20, right after progressive disclosure, which ends on "the conversation so
far — the one block you can't unload"). The window has a hard limit, but the answers get worse long
before you hit it: the fuller the window, the worse the model. In hour three of a session it still
reads everything, but it holds on to less — it forgets a rule from hour one, repeats itself, drifts
from the plan; it is slower and pricier too. Two fixes, in order of how much I trust them. The real
one: **condense and start over** — ask for a handover (what changed, what was decided, what's open)
into a markdown doc, then open a fresh session that reads that doc. The doc is the version you can
read and correct, and it is exactly the handover prompt in Appendix B. The lazy one: `/compact`,
which squeezes the conversation in place; fine for a quick reset, invisible to you. Say the habit
out loud: long session → write it down → new session. It is the `docs/` move at a smaller scale.

**The shape test — which of the six a thing belongs in.** Two questions: *does it fire at a
moment, or always?* and *is it yours, or anyone's?* **Always + yours** is `CLAUDE.md`: how you
want to be talked to, your toolchain, your never-without-asking list. Nobody else's version of
that is any use to you, and you never want it *sometimes*. **A moment + anyone's** is a skill:
"polish this page", "de-AI this draft", "grill me" — a procedure with a trigger, which is
exactly what makes it worth packaging and sharing. People get this backwards constantly, and
the tell is a skill folder full of preferences.

### 3.4 CLAUDE.md: the most valuable tokens of your life (8 min)

Show, don't tell: put a trimmed version of my real global `CLAUDE.md` on screen. It is
*just prose.* No syntax, no config. That's the whole point.

**Two levels, two jobs:**

| File | Lives at | Loaded for | What goes in it |
|---|---|---|---|
| **Global** `~/.claude/CLAUDE.md` | Your home dir | Every project, every session | *How to work with me*: communication rules, your toolchain, your standing preferences |
| **Project** `<repo>/CLAUDE.md` | Repo root | That project only | *How this project works*: mission, layout, commands, the gotchas that bite every session, pointers to deeper docs |

They're read together — global first, project on top. Write them **as you go**: every time
the agent does something you had to correct, the correction goes in the file so you never
say it twice. That's why it's the most valuable file you own — it's the compressed residue
of every mistake.

**The rules from my global file worth handing out** (these are the "ideas that should
become part of the workshop"):

*How to talk to me* (the model writes a wall of text for free; you pay to read it):
- Every token at a human touchpoint must earn its place. Concise and clear over exhaustive.
- Frame with one representative example (a before/after, one snippet) instead of narrating
  everything.
- Never use a bare pointer as if I remember it — a task number, a doc section, a ticket id
  lives in *your* context, not mine. Restate what it is inline, every first mention.
- Rich visual markdown: headers, tables, bold, code blocks. Scannable beats complete.
- Tell it your toolchain once (for me: `uv` for Python, `ruff` for lint, VideoToolbox for
  ffmpeg) so it never guesses.

Worth one sentence on stage, because it is the most common beginner mistake: these five are
**always on, and they are yours.** That is exactly why they belong in `CLAUDE.md` and not in a
skill — a skill fires at a moment; this fires at all of them, and no two people want the same
five. (People do package response style as an installable skill; it's the wrong shape *and* it
isn't yours.)

*The map, not the encyclopedia* (how to keep the file from bloating):
- `CLAUDE.md` is what an agent reads cold at first contact: mission, conventions, commands,
  layout, cross-cutting gotchas, **and a pointer map** into deeper docs. Per-feature depth
  goes in its own doc; history goes in git; in-flight plans go in a TODO folder.
- The bar for every sentence: *would a future agent landing cold be misled without it?* If
  no, cut it. Give the file a size budget (mine: ~4,500 words) and defend it.
- No status markers or datelines as content — describe the steady state.

*Docs as living working memory* (the pattern behind the Community Brain repo):
- Three folders: `docs/TODO/` (plans; where work starts) → `docs/reference/` (how things
  actually work now, and why) → `docs/finished/` (write-only archive). Work flows one way.
- A reference doc is **a map, not a mirror**: which files to read and why, what was tried
  and rejected, which invariants are load-bearing. Anything the code already says is
  redundant *and* a drift surface — cut it.
- **Reference docs follow code, never lead it.** Code is the source of truth; when a doc
  and the code disagree, fix the doc.
- The doc pass is part of the task, not a follow-up. Stale docs mislead the next agent.

Optional 20-second aside (it lands well): *"I even have a `life_goals.md` the agent reads —
so when I ask it to help with something, it knows what everything nests under."* The
principle: context engineering isn't a coding thing. Anything you'd explain to a new
colleague on day one belongs in a file.

### 3.5 80% of my tokens are English (15 min)

The most valuable beat for beginners and the part most talks skip. The workflow, not the
tech. Open with the number: **most of what I do with the model is not code.** It's sprint
docs being written and improved, specs being interrogated, plans being argued with, diffs
being reviewed, handovers being written for the *next* session. Code generation is the very
last step — the compile step — and it's the part I now spend the *least* time on.

Corollary for the room: **if you can write a clear paragraph, you can build software.**
The English *is* the work.

**The frame that makes it click for a room of founders and ops people** — most of whom have
never written a line of code but have all run a team: you are not a typist any more, you are a
**manager whose entire job is the meeting.** Your team ships in the hour and never gets bored
of your questions; what it needs from you is exactly what any team needs — to know what we're
building, why, and what each of them picks up next. So the work moves into the artefacts a
good manager produces, and slide 27 maps them one to one: the plan doc is **the brief**;
"grill me" is **the 1:1** where you discover they understood something else; "step 1 only, then
stop" is **scoping the ticket**, not doing it; the cold review is **code review**; `CLAUDE.md`
is **the onboarding doc** every new hire reads; the handover is **the meeting notes**.

Two things keep this from being a joke about bullshit jobs. Say both:

- **The notes are executable.** A bad manager's meeting produces alignment and nothing else.
  Here the code is regenerated from the doc — so improving the paragraph *is* shipping. That
  is where the 80% goes, and why the English artefacts get better every loop while the code
  is disposable.
- **Your team has amnesia.** The one place the metaphor breaks, and the callback to slide 10
  ("that scrollback is its entire world"). A colleague remembers Tuesday; this one doesn't.
  Anything you didn't write into a file was said to someone who has already left — which is
  the entire reason `CLAUDE.md` and `docs/` exist.

**The recurring loop — every feature goes through it:**

| Step | What I ask for | What I do | Rule |
|---|---|---|---|
| **1 · Analyze & Propose** | "Read this, don't change anything. Tell me what's wrong with my plan and give me 2–3 ways to do it with trade-offs." | Read the proposal. This is where I learn the stack. | No code yet. Ever. |
| **2 · Improve** | "Grill me." The model interrogates *me* until the spec has no holes. Then: edit the doc, not the code. | Answer the questions. Decide. | The spec is done when the model has no questions left. |
| **3 · Implement** | "Do step 1 of the plan. Run the tests. One line on what changed. Stop if you hit a decision I haven't made." | Watch, steer, small steps. | One thing at a time. Never "build the whole app". |
| **4 · Review** | "Review this diff as a senior engineer who didn't write it. Findings only, most severe first." Often in a *fresh* session. | Read the findings. Then the doc pass. | Trust boilerplate; check anything touching money, auth, deletion, other people's data. |

Then it cycles: the review feeds the next proposal. The English artefacts (plan doc,
reference doc, CLAUDE.md) get *better* with every loop; the code is regenerated from them.

**Then the unit-of-work slide (30), which is the habit most beginners get wrong.** The instinct
is one tiny prompt per tiny edit: *"make this button red, bump the font a bit, centre the
text"* — a new tab, a new cold start, three sessions that each know nothing about the other two
and leave nothing behind. The alternative is a **sprint**: one dedicated push that bundles
everything touching the same part of the stack. Same three edits, said once: *"read the brand
template, then polish the entire site to that spec — professional, clean, and don't forget the
phone view."* Bigger asks get better answers, because the agent can see how the pieces relate
instead of nudging one pixel blind.

The habit to teach, and the thing that ties this beat to 3.4: **ideas go into the sprint doc,
not into a new tab.** When something occurs to you mid-week, explain it to the agent and have it
folded into the plan; then point a coding agent at that doc. That is exactly what the three
prompts on the next slide do — which is why they all aim at the same file.

**What that looks like on a normal day (slide 31):** ~50% of my prompts are literally one of
three, all pointed at the same docs — *"Read `docs/TODO/<plan>.md` — analyze, scrutinize and
improve this spec before I hand it off to a coding agent"* (steps 1–2, typed ten times per
feature; the output is a better file, not code), *"Implement `docs/TODO/<plan>.md`"* (step 3,
typed once), and the one nobody does: *"Take everything we did and learned in this session and
persist it in the docs, so a future session can pick it up cold."* Say the asymmetry out loud:
beginners assume the skill lives in the second prompt; it lives entirely in the first.

The third is the **save button**, and the callback to *your team has amnesia* (slide 28): a
session you don't write down is thrown away, and tomorrow's agent starts from zero. It is the
same move as the context-rot fix (slide 20) and the doc pass in 3.4 — said as a habit rather
than a workflow, because that is how people will actually use it.

**Grill me** — the one skill to take home. It's a ~20-line `SKILL.md` (full text in
Appendix A) that turns the model into a relentless interviewer: it maps your idea as a
*design tree*, asks every question whose prerequisites are settled — numbered, each with its
own recommended answer — waits, then asks the next round, until nothing is left silently
assumed. Looking up facts is *its* job; making decisions is *yours*. Live demo: type
"grill me on the workshop rung-1 artefact", show one round. Most people have never had a
tool push back on their thinking; this is the moment they get it.

**Prompt library** — a handful of explicit prompts I reuse constantly (Appendix B has the
full text; the slide shows three). Draft versions below; swap in real ones from your history:

- **The no-code opener:** "Read X. Don't change anything. Tell me what the doc gets wrong,
  give me 2–3 ways to build it with the trade-off in one line each, pick one, wait for me."
- **The grill:** "Grill me on this plan before we build anything."
- **The scoped build:** "Implement option 2. Small steps; after each, run the tests and tell
  me in one line what changed. Stay inside the scope we agreed. Stop and ask on any decision
  I haven't made."
- **The cold review:** "Review the diff as a senior engineer who didn't write it. Bugs,
  things I'll regret in 3 months, anything touching auth/money/deletion. Findings only."
- **The handover:** "Summarise for a human who didn't watch you work: what changed, one
  before/after example, what's still open. Restate every pointer."
- **The tour:** "Give me a guided tour of this repo: what it does, the five files to read
  first and why, how one request flows through. Don't narrate every file."

**Honest failure stories** (two on stage, three if there's time; each one line + lesson):
- It confidently "fixed" the wrong thing because I hadn't read the plan. *Lesson: step 1
  exists so you read before it builds.*
- A setting that worked locally silently defaulted to "off" in prod because a secret never
  shipped. *Lesson: "it ran" is not "it's verified". Ask it how it knows.*
- A doc described a feature that had been removed; the agent built on it for an hour.
  *Lesson: stale context is worse than none — the model believes the window.*

**When to trust, when to check:** boilerplate, config, glue, tests: trust. Anything touching
money, auth, data deletion, or other people's data: read every line, and put that rule in
`CLAUDE.md` so the agent asks before it ships.

**Close the beat by resetting their sense of scale (slide 36).** Ask Claude how long something
will take and it answers like a tech lead scoping a team: *"about two weeks."* It is quoting its
training data — tickets, standups, handovers, people who go home at six. In practice a
"two-week" feature is usually **a day**: an afternoon of deciding, twenty minutes of generation.
Two honest caveats so it isn't hype — the day is real work (the spec, the review, the going-live
list from 3.6), and the 10× only holds when the spec is good, which is what the previous six
slides were about. The failure mode in this room won't be over-ambition; it's people building
the small version of their idea because they're still pricing it in 2023 hours. So: ask for the
estimate, then ask the follow-up — *"what would this look like if we did all of it today?"*

### 3.6 Deploy your own product (5 min)

The beat that stops "it works on my laptop" from being the end of the story. Nobody else can see
a thing that runs on your laptop; a product is the same code plus everything that lets a stranger
open a URL and use it. Beginners don't know that list exists, and the list is exactly what makes
them feel "I'm not a dev". So: show the list once, not deep, then hand them the way out.

**The pieces (slide 37)** — one card each, with the kind of service that provides it. Examples,
not recommendations; the ones I used are in the slide-3 table.

| Piece | What it is, in one line | Where it lives |
|---|---|---|
| The pages | What people see and click | A website host: Vercel, Netlify |
| The code that runs | Your logic, answering requests | A cloud: Modal, AWS, GCP — or a €5 server |
| The data | What has to survive a reload | A database: Neon, Supabase, Postgres |
| Who is who | Sign-up, login, permissions | An auth service: Clerk, Auth0 |
| A name | A domain, DNS, the padlock (HTTPS) | Any registrar; the host does the padlock |
| Secrets | API keys, passwords | The host's settings — never in git |
| Things on a schedule | Nightly jobs, reminders | Cron, routines |
| Knowing it broke | Logs, alerts | The host's dashboard, one alert channel |
| Paying for it | The bill you didn't expect | A spend cap, set on day one |

Say plainly: the slide-3 stack table *was* this list, filled in once. Yours will be filled in
differently. And the boring choice (managed, free tier, popular) is the right first choice — you
are buying "someone else runs it" so you can keep building.

**For everything you don't know: ask (slide 38).** The point of the section. The agent knows every
one of these providers better than any tutorial, and the loop from 3.5 applies unchanged: no-code
proposal first (which pieces, simplest option each, why, what it costs), then one step at a time,
then "how do you know it's live?". Two click-to-copy prompts on the slide, both in the pack
(Appendix B, 8 and 9): the going-live walk-through, and the "explain this piece to me as if I've
never built software" prompt for any word on the previous slide they didn't recognise.

**The most important lesson of the workshop (slide 39)** — the section's capstone and the
emotional peak of the talk, so it gets a quiet full-screen slide and a breath before the use-case
menu. When you start building something you'll have gaps in your knowledge everywhere: hosting,
databases, auth, deploys, words you've never heard. That feels daunting, and the sentence that
follows is "I'm not a dev". The core insight: AI can help you understand *and* do every single one
of those things. What it asks of you is not knowledge. It's patience, and a gigantic willingness to
learn as you go. **If your will is strong, you can build anything.** Say it slowly; it's the line
people quote back.

### 3.7 What people actually do with it + bridge (4 min)

A single "use-case menu" slide, deliberately not all code, because half the room won't
write software next week. (Inspired by the "Master Claude in 28 days" poster; use the
*idea*, not its layout.) One line each, with the mechanism it uses so it ties back to 3.3:

| Use it to… | Mechanism |
|---|---|
| Learn any codebase in an hour — a guided, file-by-file tour | Claude Code |
| Build a small CLI tool from a plain-English description | Claude Code |
| Search your own notes, mail and drive and get cited answers | Connectors / MCP |
| Automate your browser — "find the cheapest flight under 6h" | Claude in Chrome |
| Design pages and decks without Figma — *this deck* was made this way | Claude Code + a design skill |
| Rehearse: a mock interview, a pitch, a hard conversation | A skill |
| Spin up your own MCP server so every agent can reach your service | MCP |
| Schedule routines that run while you sleep | Routines |
| Write your sprint doc, then have it argue with you | Grill me |

**Then the correction, because the room will otherwise go home and start collecting.** There
is a genre of post doing very well right now — *"the 19 skills I'd install on a fresh setup"*,
600K views, a star count next to every entry. It isn't fraudulent: the repos are real (I
checked them) and two or three are genuinely good. What's wrong is the causality it sells —
that capability arrives by installing things. Everything in the previous forty minutes says
the opposite: the leverage was in the context, and the best skill you will ever own is the
twenty lines of English you write about the chore *you* repeat.

So slide 41 is a **diagnosis, not a shopping list** — *what hurts → what fixes it* — and the
thing to point at on stage is how often the fix is a paragraph in `CLAUDE.md` rather than a
download. Two rules on screen:

- **Write one before you install five.**
- **Read anything you install.** A skill is instructions you are letting a stranger put in
  your context window; it can tell your agent to do anything you can. Same care as `curl | sh`.

Two real ones to name on the slide, because they show the *shape* of a skill worth installing
— both fire at a specific moment and neither encodes anyone's personal taste in being talked
to: **`blader/humanizer`** (~45K stars) rewrites a draft, hunts the AI tells, rewrites again —
fires before you publish; **`jakubkrehel/make-interfaces-feel-better`** (~3K) does a pass purely
on *feel* — spacing, hover states, dead hit areas, motion — and fires after a page is built,
which is exactly where the room will be at 15:30 with the thing they made at rung 1. Third one
is `grilling`, which they already have.

Contrast that with row 1 of the same slide: the fix for a chatty agent is three lines in
`CLAUDE.md`, not a download. Same shape test as 3.3 — always + yours vs a moment + anyone's.

Then the bridge:

- "In the next two hours you'll do all of it in miniature: build something, plug in an MCP
  server, write a CLAUDE.md and a skill, and get grilled."
- Show the ladder slide. Rules: common track, nobody stares at a blank screen, racing ahead
  is allowed, helpers roam.
- "Laptops open. Rung zero starts now."

---

## 4. Slide map (the contract for the deck)

`build_with_claude_workshop.html` is built to this list, same visual system as the launch
deck. Titles are the on-screen headline; "on it" is the content; notes are for the speaker
view or for the deck agent's judgment. Keep the click-to-copy cheat sheet as the last slide
and leave it on the projector during the build.

| # | Title (on screen) | On it | Beat |
|---|---|---|---|
| 1 | **Build with Claude** | Title, name, "beginners 🌶️", Wintercircus | — |
| 2 | **The only thing that changed was how I work** | The one sentence + "…I stopped writing code and started writing English" | 3.1 |
| 3 | **Built since March. Never touched most of it before.** | The stack table (7 rows, "had I used it before?" column) | 3.1 |
| 4 | **Four years of shipping. Three quarters of it since May.** | The "monthly output by repository" chart from the *Four Years of Shipping* report, redrawn in the deck's style (data embedded in the deck's script); stats strip: 903,861 lines · 282,785 in Aug 2026 · 46% of days · 23% Markdown | 3.1 |
| 5 | **A language model is a text machine** | Text in → model → text out; the umbrella question it *can't* answer; the "no internet / no files / no clock / no memory" chips | 3.2 |
| 6 | **A tool is a description in the window. A tool call is just text the model writes.** | The window with the tool's plain-text description + the model generating `<call>get_weather("Ghent")</call>`; "nothing has happened yet" | 3.2 |
| 7 | **The harness catches the call, runs real code, and pastes the result back** | The same window with the result appended + a ten-line harness loop in code | 3.2 |
| 8 | **A model. Some tools. A loop.** | Think (model) → Act (harness) → Observe (window); "a chatbot stops after think"; live tool-call demo cue | 3.2 |
| 9 | **Where does the harness run?** | Three cards: Claude Code = harness on your laptop (close the lid, everything stops) · claude.ai = harness in the cloud (survives the lid, can't touch your files) · the fix = your own harness on an always-on VM, talk to it from your phone | 3.2 |
| 10 | **That scrollback is its entire world** | Terminal mock with the context window outlined; "brilliant, with amnesia" | 3.2→3.3 |
| 11 | **Everything is context engineering** | The one-liner: *the right context, at the right moment, and nothing else* | 3.3 |
| 12 | **Six ways to put things in the window** | The mechanism table (CLAUDE.md / docs / skills / tools / MCP / memory): role + "when loaded" columns only; what each *is* gets said, and gets its own slide next | 3.3 |
| 13 | **CLAUDE.md — read first, every session** | The file anatomy (mission / layout / commands / rules / pointers); what · when · in the brain | 3.3 |
| 14 | **docs/*.md — read only when the subject comes up** | The `docs/reference/` tree with one file lit for today's task; what · when · in the brain | 3.3 |
| 15 | **Skills — a hook always on, a body on trigger** | `SKILL.md` anatomy: frontmatter (always) vs body (on trigger); what · when · in the brain | 3.3 |
| 16 | **Tools — one verb each, described in text** | `find_matches` as the model sees it (schema + token cost) → the call the model writes → the result; what · when · in the brain | 3.3 |
| 17 | **MCP servers — publish once, plug in anywhere** | Your agent plugged into three servers (browser, Odoo CRM, community brain), each "tools + instructions"; what · when · in the brain | 3.3 |
| 18 | **Memory — written now, read back later** | Session 1 writes → memory store → session 2 recalls (the Pixiboo example); what · when · in the brain | 3.3 |
| 19 | **Progressive disclosure** | Three windows side by side, block height = tokens: "paste everything" (over budget) vs session start vs "grill me on the memory bug". Builds in five steps (→ or tap): session start → ten minutes later → the skill body loads → the doc loads, still fits → the stale-context corollary. Tap any block to peek at what is inside it | 3.3 |
| 20 | **Context rot. The fuller the window, the worse the answers.** | One window in hour three, the conversation block filling most of it ("still fits · the answers get worse"); three cards: the symptom (forgets hour-one rules, repeats, drifts) · the fix (handover into a markdown doc, fresh session reads it) · the lazy version (`/compact`); "long session → write it down → new session" | 3.3 |
| 21 | **CLAUDE.md contains the most valuable tokens of your life** | Global vs project table; "the compressed residue of every mistake" | 3.4 |
| 22 | **It's just prose** | The trimmed real global file, rendered as two-column prose | 3.4 |
| 23 | **How to talk to me** | The five communication rules (earn its place / one example / no bare pointers / rich markdown / toolchain once) | 3.4 |
| 24 | **The map, not the encyclopedia** | What belongs in CLAUDE.md vs in a doc vs in git; the "would a cold agent be misled?" test; size budget | 3.4 |
| 25 | **Docs are the agent's working memory** | TODO → reference → finished flow; "a map, not a mirror"; "docs follow code, never lead it" | 3.4 |
| 26 | **80% of my tokens are English** | Big number; what the English is (plans, specs, reviews, handovers); "code is the compile step" | 3.5 |
| 27 | **The job is the meeting** | *What you do → what it is on a team* (brief · cold review · 1:1 · onboarding doc · scoping the ticket · meeting notes); one line: the notes are executable, so improving the paragraph is shipping | 3.5 |
| 28 | **Your team has amnesia** | Quiet vision slide, the one place the metaphor breaks: a colleague remembers Tuesday, this one's world is the scrollback | 3.5 |
| 29 | **Analyze & Propose → Improve → Implement → Review** | The four-step loop as a cycle; one rule per step | 3.5 |
| 30 | **Think in sprints, not tweaks** | Two cards: *a tab per tweak* ("make this button red, bump the font, centre the text" — a cold start per idea, nothing written down) vs *a sprint* ("read the brand template, then polish the entire site to that spec — professional, clean, don't forget the phone view"); punchline: a new idea goes into the sprint doc, not into a new tab | 3.5 |
| 31 | **50% of my prompts are one of these three** | Three verbatim prompts, click-to-copy: *"Read `docs/TODO/<plan>.md` — analyze, scrutinize and improve this spec before I hand it off to a coding agent"*, *"Implement `docs/TODO/<plan>.md`"*, and *"Take everything we did and learned in this session and persist it in the docs, so a future session can pick it up cold"*; the asymmetry (01 typed ten times per feature, 02 once) and 03 as the save button | 3.5 |
| 32 | **Grill me** | The skill in three lines: design tree · frontier rounds · you decide, it looks things up; live demo cue | 3.5 |
| 33 | **Prompts I reuse** | Three prompts verbatim (opener, scoped build, cold review), click-to-copy; "full library in the pack" | 3.5 |
| 34 | **Three times it went wrong** | The failure stories, one line + lesson each | 3.5 |
| 35 | **Trust / Check** | Two columns | 3.5 |
| 36 | **If it says two weeks, it's probably a day** | Three cards: where the estimate comes from (it's quoting human teams from its training data) · where your time actually goes (deciding, not typing) · so aim higher (the "someday, if I had a team" idea is this weekend); follow-up question: *"what would this look like if we did all of it today?"* | 3.5 |
| 37 | **A product is more pieces than the code** | Nine cards, the pieces map from §3.6 (pages · code that runs · data · who is who · a name · secrets · schedule · knowing it broke · paying), each with the kind of service that provides it; "the stack table at the start was this list, filled in once — pick boring" | 3.6 |
| 38 | **For everything you don't know: ask.** | Two prompts click-to-copy: *going live* (pieces + simplest option + cost, wait, then one step at a time with "how can I check it's live") and *explain a piece* ("as if I've never built software, one paragraph, then the one decision I have to make") | 3.6 |
| 39 | **The only thing you need: a willingness to learn.** | Quiet vision slide, the lesson of the workshop: the gaps are everywhere and it feels like "I'm not a dev" — AI can help you understand and do every one of them; all it asks is patience and a gigantic willingness to learn as you go. Punchline: *if your will is strong, you can build anything* | 3.6 |
| 40 | **What people actually do with it** | The use-case menu (9 rows, mechanism column) | 3.7 |
| 41 | **Skills are not stickers** | *What hurts → what fixes it*, six rows — two named third-party skills (`humanizer`, an interface-polish pass), `grilling`, and twice a paragraph in `CLAUDE.md` rather than a download | 3.7 |
| 42 | **Does it fire at a moment, or always? Is it yours, or anyone's?** | The shape test as two cards: always + yours = `CLAUDE.md` (not a download); a moment + anyone's = a skill (worth sharing); punchline: write one before you install five, read anything you install | 3.7 |
| 43 | **Six rungs** | The build ladder table | 3.7 |
| 44 | **You are the imagination.** | Manifesto beat; Murmura mention | 3.7 |
| 45 | **Go build** | Rules of the floor; helpers; "rung zero starts now" | 3.7 |
| 46 | **Starter prompts** | Click-to-copy cheat sheet, one block per rung (see §5) — stays on screen | build |

Slides 10, 22 and 32 are demo cues, not content slides — they should be visually quiet, as are
the two vision slides that carry a single line (28, 39). Slides 5–8 build the agent up step by
step (text machine → tool as text → harness → loop) around one running example (`get_weather`),
and slide 9 places the harness; slides 13–18 are one slide per mechanism from the table on
slide 12, each with the same three facts: what it is, when it's in the window, where it shows up
in the brain. Slides 37–39 are the deploy section: the map, the way out, the lesson.

---

## 5. The build session (14:00 – 16:00)

A guided ladder. Everyone climbs the same rungs in the same order; people who finish early
branch into free build. Every rung has a starter prompt (on the cheat-sheet slide, click to
copy) so nobody has to invent the first sentence. The rungs now mirror the talk: build →
plug in → give it context → get grilled → show.

| Rung | Min | Goal | Done when |
|---|---|---|---|
| **0 · Setup** | 15 | Claude Code installed, logged in, first prompt answered in an empty folder | Everyone has seen Claude respond in their own terminal |
| **1 · First build** | 20 | Everyone ships the same small thing end to end | It opens in a browser and does something |
| **2 · Plug in the world** | 25 | Connect one MCP server, make the thing use it | The agent did something it couldn't do at rung 1 |
| **3 · Give it context** | 25 | A global CLAUDE.md ("how to talk to me"), a project CLAUDE.md, one skill | Behaviour visibly changes on the next prompt |
| **4 · Free build, grilled** | 20 | Install the grilling skill, get grilled on your own idea, build step one | The plan survived one round of questions |
| **Thunder talks** | 15 | 60-second show-and-tell from whoever wants to | Room has seen 5–10 things built by peers |

### 5.1 Rung 0 — Setup triage (15 min)

This is where beginner workshops die, so it gets a real budget and all helpers on the
floor.

- Install Claude Code (`npm install -g @anthropic-ai/claude-code` or the native installer),
  run `claude`, log in.
- First prompt in an empty folder: something trivial and fun ("make a file that lists
  three things you can help me with today").
- Common blockers: no Node on the machine, corporate laptop restrictions, no terminal
  familiarity on Windows (point them to PowerShell or WSL), no Claude subscription (see §7).
- Pre-work email (§7) exists to shrink this rung. Expect ~30% of the room to have ignored it.

### 5.2 Rung 1 — First build (20 min)

Everyone builds the **same** small thing, so helpers can debug a known shape and people can
compare notes with their neighbour.

Candidate artefact (to decide, see §8): a single-page browser app with no backend, e.g. a
personal "what should I work on today" board. Criteria: fun, visible, works on every OS,
opens in a browser so it demos well at the thunder talks, zero dependencies.

Teach through the prompt itself: the starter prompt asks Claude to **propose a plan first
and wait**, then build in small steps, explain each in one line, ask before adding anything
unrequested, and say how to open the result. That's Analyze & Propose → Implement, felt
rather than told.

### 5.3 Rung 2 — Plug in the world (25 min)

Connect one MCP server. Options, from easiest to most interesting:

- **Chrome / browser MCP (Claude in Chrome)** — the agent opens their own app and critiques
  it. Very visible.
- **Filesystem MCP** — boring but universal.
- **A public API MCP** (weather, GitHub, etc.) — needs keys, riskier for beginners.

Default to the browser one; it produces the strongest "it just did that?" moment and needs
no keys. Have the filesystem one as a fallback for machines where the browser extension
won't install. Tie back to slide 17: "you just added reach — new tools *and* the
instructions for using them, in one plug."

Say the safety line once, out loud, while everyone is connecting: an agent driving a browser
should get **its own Chrome profile**, not the one with your mail, your bank and your password
manager already logged in.

### 5.4 Rung 3 — Give it context (25 min)

Three small artefacts, in this order, each proven by a before/after prompt:

1. **Global `~/.claude/CLAUDE.md`** — start from the template in Appendix C: three rules
   about how you want to be talked to, your toolchain, "ask before anything destructive".
   Prove it: re-run the rung-1 "explain this" prompt and watch the answer get shorter.
2. **Project `CLAUDE.md`** — ask Claude to write one for the rung-1 project: what it is,
   layout, three rules. Read it before saving; delete anything that just narrates the code.
3. **One skill — one they write themselves**, as `.claude/skills/<name>/SKILL.md`: their
   preferred way of adding a feature, or any three-step chore they have already typed twice.
   Show the one-line description vs the body: that's progressive disclosure in their own
   hands. Nobody installs somebody else's skill today — the point of the rung is the feeling
   that a skill is just a file you wrote. For Monday, point at `skills.md` in the pack
   (Appendix D).

This is the rung where people realise the agent is *steerable*, not just capable — and that
steering is done in English, in files, once.

### 5.5 Rung 4 — Free build, grilled (20 min)

- Drop the grilling skill into `~/.claude/skills/grilling/SKILL.md` (Appendix A; in the
  pack as a copy-paste file).
- Starter prompt: "Here's my idea in two sentences: … Grill me." Answer one round.
- Then the plan-first prompt: five-step plan, flag the hardest part, build step one.
  Helpers roam.
- **Close the rung with the persistence prompt** (Appendix B, 5): *"take everything we did and
  learned in this session and persist it in the docs."* Two minutes, and it is the difference
  between going home with a folder and going home with a folder that a fresh agent can continue
  on Monday. This is slide 31's third prompt, felt rather than told.

People who finish early: pick anything from the use-case menu (slide 40).

### 5.6 Thunder talks (15 min)

Stolen from Mars College, same format as Murmura: 60 seconds each, strictly timed, demos
encouraged, live failure welcome. Whoever wants to. Close on this so the room ends with
peers showing peers, not with me.

Mention Murmura (the monthly Ghent builders' meetup at Wintercircus) as the place to keep
going.

---

## 6. The takeaway pack

One folder attendees can download (link on the last slide + in the follow-up mail). To be
created next to this doc as `workshop_pack/`:

| File | What | Source |
|---|---|---|
| `README.md` | The ladder + the cheat-sheet prompts, plain markdown | §5 + slide 46 |
| `CLAUDE.global.template.md` | A starter global CLAUDE.md, ~25 lines, with `<fill in>` slots | Appendix C |
| `skills/grilling/SKILL.md` | The grilling skill, verbatim | Appendix A |
| `prompts.md` | The prompt library, incl. the two going-live prompts from slide 38 | Appendix B |
| `docs_workflow.md` | The TODO → reference → finished pattern in one page | 3.4 |
| `skills.md` | The *what hurts → what fixes it* diagnosis, the Day 1 / Day 2 / Week 1 order, and the read-before-you-install rule | Appendix D |
| `links.md` | Install page, MCP servers used, Claude in Chrome, Murmura | — |

---

## 7. Logistics and risks

### Access to Claude — the biggest single risk

Claude Code needs a paid plan (Pro / Max) or API credits. Beginners won't have this.
Options, pick one before the pre-work email goes out:

1. **Ask attendees to bring a Claude Pro subscription** (cheapest for us, filters out the
   least committed, but will lose people at the door).
2. **Wintercircus-sponsored API credits** on a shared org key with a spend cap, handed out
   as per-person keys at rung 0. Cleanest experience; needs budget sign-off.
3. **Free-tier fallback**: the Claude web app for people who can't get set up, so they can
   at least follow the propose/improve/review loop in chat — and get grilled there.

Recommendation: 2 with 3 as a fallback.

### Pre-work email (send ~5 days before)

- Bring a laptop you can install software on (not a locked-down corporate machine).
- Install Node ≥ 22 and Claude Code; run `claude` once and log in. Link to the install page.
- Have your Claude account / key ready (per the decision above).
- Optional: bring one idea you've always wanted to exist, in two sentences. (It gets grilled
  at rung 4.)
- "If anything fails, don't worry, the first 15 minutes are for exactly that."

### Helpers

Two hours of 1-on-1 guidance for beginners needs **2–3 roaming helpers** besides me. Brief
them on the ladder, the starter prompts, the top five setup failures, and the three rung-3
artefacts. Ideal: people from the Murmura crowd who already use Claude Code daily.

### Venue

- Wifi capacity for 30–60 laptops all hitting the API at once. Check with Wintercircus ops.
- Power strips at every table.
- Projector + my laptop for the talk; the same projector shows the cheat-sheet slide during
  the build (leave it up).
- Demo fallback: screen recording of the Community Brain demo on local disk.

### Timing buffers

The talk is scheduled at exactly 60 minutes with no buffer, and the content is now planned for
~62, so expect to use this list. In order: drop the third failure story; the `life_goals.md`
aside; say the pieces slide (37) in one sentence over the ask-prompt slide (38); drop slides
41–42 (*skills are not stickers* + the shape test — they survive in the pack); compress slide 25
(docs are the agent's working memory) to one sentence; say slide 36 (*two weeks is a day*) as one
sentence over slide 35 (trust / check). Never cut the grill demo, and never cut slide 39 (the
willingness-to-learn lesson): it is the line people take home. Slide 30 (*think in sprints*) and
slide 27 (*the job is the meeting*) can each be said over their neighbour in two sentences if the
clock is really gone, but both land with the non-coders in the room, so cut them late. If the
talk runs over, cut rung-4 time, never rung-0 time.

---

## 8. Open decisions (before next week)

- [ ] **Access model** for Claude (§7): sponsored credits vs bring-your-own.
- [ ] **The rung-1 artefact**: pick the one thing everyone builds. Must be fun, visible,
      cross-platform, browser-based, dependency-free.
- [ ] **The MCP server for rung 2**: browser (default) vs filesystem (fallback). Test the
      install on a clean Mac and a clean Windows machine.
- [ ] **Real prompts for Appendix B**: the ones there now are drafts in my voice; replace with
      2–3 verbatim from actual sessions.
- [ ] **Trim the global CLAUDE.md** into the show-and-tell version for slide 22 (strip
      personal context; keep the communication rules + docs workflow).
- [ ] **Build the takeaway pack** (§6).
- [ ] **Helpers**: names confirmed, briefed.
- [ ] **Pre-work email**: drafted, sent by Wintercircus comms.
- [ ] **Demo fallback recording** made.

---

## 9. Materials

| File | What |
|---|---|
| `build_with_claude_workshop.html` | The stage deck, built to §4 (same visual system as the launch deck). `N` = speaker notes, `T` = talk clock. Last slide = click-to-copy cheat sheet; leave it on screen during the build. |
| `build_with_claude_workshop.md` | This file. |
| `workshop_pack/` | The takeaway pack (§6) — to be created. |
| `agent_moments.md` | Verified, quotable exchanges from the live brain; source for the hook demo fallback. |
| `wintercircus_launch.html` | The Collective Opening deck; the Community Brain demo prompts on its last slide are reusable for the hook. |

---

## Appendix A — the grilling skill (verbatim, `~/.claude/skills/grilling/SKILL.md`)

```markdown
---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each question should be formatted like so:

❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
```

Why it works, for the slide: it separates *facts* (the model's job) from *decisions* (yours),
it asks in rounds so you're never answering a question that depends on one you haven't
answered yet, and it refuses to build until the tree is empty.

## Appendix B — the prompt library (drafts; swap in verbatim ones from real sessions)

**1 · Analyze & Propose (no code)**
```
Read docs/TODO/<plan>.md and the code it touches. Do not change anything.
Tell me:
1. what the doc gets wrong about the code as it is today,
2. the 2–3 ways to build this, with the trade-off of each in one line,
3. which one you'd pick and why.
Then wait for me.
```

**2 · Improve (the grill)**
```
Grill me on this plan before we build anything. One round at a time, your
recommended answer next to every question. Don't build until we agree.
```

**3 · Implement (scoped)**
```
Implement option 2 from your proposal, step 1 only. After the step: run the tests,
tell me in one line what changed. Stay inside the scope we agreed. If you hit a
decision I haven't made, stop and ask.
```

**4 · Review (cold)**
```
Review the diff as a senior engineer who didn't write it. Look for bugs, things
I'll regret in three months, and anything touching auth, money, deletion or other
people's data. Findings only, most severe first. No praise.
```

**5 · Persist the session (slide 31 — the one nobody types)**
```
Take everything we did and learned in this session and persist it in the docs, so
a future session can pick it up cold.
```
The long version, for the end of a real phase: *"Do the doc pass: promote what's durable into
`docs/reference`, collapse the finished phase in the TODO doc to a few lines, and remove
anything in the docs that describes code that no longer exists."*

**6 · The handover**
```
Summarise for a human who didn't watch you work: what changed, one before/after
example, what's still open. Every task number, doc section or ticket id gets a
few-word explainer the first time you mention it.
```

**7 · The tour (any unfamiliar codebase)**
```
Give me a guided tour of this repo: what it does, the five files I should read
first and why, and how one request flows through it end to end. Don't narrate
every file.
```

**8 · Going live (slide 38)**
```
I've built this locally and it works. I want it live on the internet with a real
URL anyone can open. First, no changes: list the pieces I need (hosting, database,
secrets, domain...), pick the simplest well-supported option for each and say why
in one line, and tell me what it will cost. Then wait. When I say go: one step at
a time, and after each step tell me how I can check it's live.
```

**9 · Explain a piece (slide 38)**
```
Explain what a <database / auth service / environment variable / DNS record> is
and why my app needs one, as if I've never built software. One paragraph. Then the
one decision I actually have to make, with your recommendation.
```

**10 · Fold an idea into the sprint (slide 30 — instead of opening a new tab)**
```
New idea, don't build it yet: <the idea, one or two sentences>. Work out where it
belongs in docs/TODO/<plan>.md, fold it in, and tell me what it changes about the
plan and what it conflicts with. If it doesn't belong in this sprint, say so.
```

## Appendix C — starter global `CLAUDE.md` for beginners (~25 lines)

```markdown
# How to work with me

## Talking to me
- Be concise. Lead with the answer. One representative example beats a full narration.
- Never reference a step, file or task by number alone — restate what it is.
- Use headers, tables and code blocks so I can scan.

## Before you build
- Propose a plan and wait for my ok before writing code.
- Build in small steps. After each step, say in one line what changed and how I can check it.
- If you hit a decision I haven't made, stop and ask.

## Never without asking
- Deleting files or data, sending anything anywhere, spending money, touching secrets.

## My tools
- <language / package manager>
- <editor / OS quirks>
- <anything you always have to correct>
```

## Appendix D — `skills.md` for the pack (what to install, and when not to)

> Goes in `workshop_pack/skills.md`. Written for the person on the train home who is about to
> install nineteen things.

**A skill is a file.** A paragraph of English about how you like one job done. That makes them
free to collect and very easy to over-collect. Only the *body* is lazy: the one-line
description is in the window every session, forever, and the model has to choose between all
of them. Twenty half-used skills is a junk drawer you pay rent on.

**Diagnose, don't shop.**

| It hurts when… | What actually fixes it |
|---|---|
| Every answer opens with three paragraphs of throat-clearing | Three lines in your global `CLAUDE.md`. Not a skill, not a download. |
| It starts building before you have finished thinking | `grilling` — in this pack, 20 lines |
| You explain your stack again in every new session | `CLAUDE.md` first; memory tooling only after. Most "it forgot" is a missing map. |
| Your draft reads like a press release | a humanizer skill (`blader/humanizer`, ~45K ★): rewrite, hunt the tells, rewrite. Fires before you publish. |
| The page works, but it feels cheap and generic | an interface-polish pass (`jakubkrehel/make-interfaces-feel-better`, ~3K ★): spacing, hover states, hit areas, motion. Fires after it's built. |
| You have typed the same three-step chore twice | **write your own** — the one skill nobody else can give you |

**The shape test — skill, or `CLAUDE.md`?** Two questions. *Does it fire at a moment, or
always?* *Is it yours, or anyone's?* Always + yours belongs in `CLAUDE.md` — how you want to be
talked to, your toolchain, your never-without-asking list; nobody else's version of that is any
use to you. A moment + anyone's is a skill — "polish this page", "de-AI this draft", "grill me".
A skill folder full of preferences is the tell that someone has it backwards.

**An order, if you want one.**

- **Day 1** — global `CLAUDE.md` (how to talk to me + never-without-asking), the two prompts
  from the cheat sheet, `grilling`.
- **Day 2** — a project `CLAUDE.md` on one real repo; one MCP server that removes a chore you
  actually have.
- **Week 1** — the `docs/TODO → reference → finished` folders; one skill you wrote yourself.
  Then ship something before you install anything else.

**Before you install anyone else's skill.** It is instructions you are letting a stranger put
in your context window — it can tell your agent to do anything you can do. Read the `SKILL.md`
first, the way you would read a script before piping it into a shell. Give an autonomous
browser agent its own Chrome profile, not the one logged into your mail and your bank. Keep
secrets out of prompts and skill files. Prefer local tools when the data is sensitive.

**On star counts.** The lists going around ("the 19 skills I'd install on a fresh setup") point
at mostly real repos — but stars measure attention, not fit. The set that helps you is the
small one you actually trigger.
