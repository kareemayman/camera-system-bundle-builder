# Camera Bundle Builder

Build your own camera security system step by step, and watch the price add up live in the panel beside you.

**Live demo → https://camera-bundle-builder.vercel.app/**

It's a frontend take-home: a React rebuild of a Figma design for a multi-step bundle builder with a review panel next to it. Pick your cameras, a plan, some sensors and a few extras — the panel keeps a running list and total as you go.

## Run it

You'll need a recent Node (20.19+ / 22.12+).

```bash
npm install
npm run dev
```

Vite prints a local URL (usually http://localhost:5173). Open it. That's the whole setup — clean clone to running app.

Other scripts:

```bash
npm run build     # production build → dist/
npm run preview   # serve that build locally
npm run lint      # eslint
```

## Tech

- **React 19** + **Vite 8**
- **React Compiler** is on — so there's no hand-written `useMemo`/`useCallback`/`memo`; it handles the memoization and the components stay plain.
- **Plain CSS** via **CSS Modules**, with the design tokens (colors, sizes) as CSS variables in `src/index.css`. No CSS framework.
- **[auto-animate](https://auto-animate.formkit.com/)** for the accordion + review-line animations, **[react-hot-toast](https://react-hot-toast.com/)** for the save/checkout confirmations.
- Local fonts (Gilroy + TT Norms Pro).

## What it does

- A **4-step accordion** (cameras → plan → sensors → extra protection) next to a **live review panel**.
- **Everything renders from `src/data/products.json`** — no per-product markup. Change the data, change the app.
- **Variants keep their own quantities.** Add two white cams and one black, and the review panel lists each as its own line; the card's stepper binds to whichever variant you've got selected.
- **Steppers stay in sync** — nudge a quantity on a card or on its review line and both move, because they read the same shared state.
- **Totals are always derived** from quantity × price (never stored), so nothing drifts. Savings and the monthly financing line recompute as you go.
- **"Save my system for later"** writes to `localStorage` — reload and your build is still there.
- **Responsive** down to ~360px, matched to the desktop, tablet and mobile Figma frames.
- A layer of **polish**: page-load / accordion / list animations, hover + press micro-interactions, themed scrollbar and text selection — all of which back off when you ask for `prefers-reduced-motion`.

## A few decisions

- **Context + `useState`, not Redux or a reducer.** Context is only there to *share* the config so both columns stay in sync. The updates themselves (bump a quantity, pick a plan, save) are simple enough that a reducer would've been ceremony. So: store the few things that are genuinely state (per-variant quantities, active variant, open step) and derive the rest.
- **Prices are computed, never hardcoded.** One side effect: my totals don't exactly match the numbers printed in the mock — a couple of those didn't add up, and I went with correct math over copying a wrong total.
- **auto-animate over Framer Motion / GSAP.** It does the accordion open/close and review lines appearing/leaving with a one-line hook at ~2KB; the bigger libraries were overkill here.
- **Toasts over modals** for the save/checkout feedback — they confirm something that already happened, so blocking the screen felt wrong.

## Not done / what's next

- The **checkout** button is a placeholder (it just fires a toast) — no real cart or checkout flow.
- Skipped nice-to-haves: serving `products.json` from a tiny API, and a left-to-right column stagger on load (right now the whole shell rises as one).