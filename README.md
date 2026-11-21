# Security+ SY0-701 Practice Exam Simulator

Unofficial English practice exam web app for **CompTIA Security+ SY0-701**. Models a Pearson VUE-style delivery: NDA, tutorial, timed session, flag/review, MCQs, and simulation PBQs.

**Not affiliated with CompTIA.** Original practice items only — no braindumps.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Navigation model

1. **`/`** — Choose a **certification** (Security+, A+, Network+ placeholders)
2. **`/certs/[certId]`** — Choose a **product** in that suite
3. Product routes (Security+ live) — Exam, Cram, Guides, Links, PBQ Lab, Drills

Header includes a **Cert** switcher on suite/product pages. Add a new exam line in [`src/lib/certs.ts`](src/lib/certs.ts) without rewriting the hub UI.

## Products (Security+)

| Path | Product |
|------|---------|
| `/certs/security-plus` | Security+ product hub |
| `/security-plus` | Full exam + domain drills |
| `/cram` | 30-min mid-review packs |
| `/guides` | Tips & guides |
| `/links` | Useful official links |
| `/pbq-lab` | PBQ-only lab |
| `/drills` | Ports / acronyms / controls / recovery drills |

## Features

- Full exam: 90 items / 90 minutes, domain-weighted assembly, 3 PBQs first
- Domain drills: 20 items / 25 minutes
- **30-Min Mid-Review cram packs** (`/cram`): high-yield secrets ranked by domain weights
- Tips & Guides, Useful Links, PBQ Lab, Ports & Acronyms drills
- Pearson-style exam chrome: flag, navigator, Exhibit window, calculator, review
- Score report with scaled score estimate (100–900, pass at 750)

## Content

- `content/sy0-701/mcq.json`, `pbq.json`, `cram-packs.json`
- Guides / links / drills live under `src/lib/`
