# RevSprint Studio

RevSprint Studio is a local-first commercial planning workspace for early-stage teams. It turns scattered customer notes, channel ideas, sales blockers, and budget limits into a six-week go-to-market sprint with channel plays, messaging angles, milestones, and an exportable operating brief.

Built for Dev Season of Code 2026, the product stays intentionally lightweight: no backend, no accounts, no external services, and a static deployment model that works the same way locally and on any public host.

## Product Shape

- Capture a company profile, target buyer, sales motion, budget, and current commercial signals.
- Generate a six-week GTM sprint with weekly priorities, checkpoints, and owner handoffs.
- Rank channel plays such as founder-led outbound, partner pilots, proof-driven content, and consultative workshops.
- Surface messaging angles that align the offer, pain point, and proof story.
- Export a concise commercial brief for advisors, teammates, or follow-up planning.
- Keep the workspace locally in the browser without a server dependency.

## Stack

- Vanilla HTML, CSS, and JavaScript
- `localStorage` for local-first persistence
- Service worker for an offline shell
- Static build output in `docs/`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Validate

```bash
npm test
npm run build
npm run verify
```

`npm run build` refreshes the deployable static output in `docs/`. To preview that production build locally:

```bash
npm run start
```

Open `http://127.0.0.1:4173`.

## Deploy

RevSprint Studio is a static site. Deploy the contents of `docs/` to GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or any equivalent static host.
