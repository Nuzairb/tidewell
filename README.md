# Tidewell (design prototype)

> [!IMPORTANT]
> **This is a design prototype only.** It has **no backend, no database, no API, no authentication and no real money data.**
> Every number, transaction and notification is static mock data in [`lib/data/`](lib/data) or comes from the Figma chart export.
> Nothing you do in the UI is saved — reload the page and it's back to the original state.

A pixel-perfect, working front-end implementation of the **Tidewell "Finance Dashboard — Redesign"** Figma frame
(node `1:3`, 1440 × 1024), built with **Next.js 16 (App Router)**, **shadcn/ui (Base UI)** and **Tailwind CSS v4**.

Every sidebar item is a working screen: Home `/`, Accounts, Transactions, Cashflow, Reports, Budget, Recurring, Goals, Investments, Analytics, Tracking, Data, Help & Support (`/help`) and Settings (`/settings`). Actions inside a screen that would need a backend (linking an account, trading, payments) show a short "coming soon" toast.

**One source per number.** Money figures are derived, not retyped: account balances add up to net worth; Cashflow's monthly lines (`lib/data/cashflow.ts`) feed Analytics, Budget history and Home's month card and total the Reports KPIs; Recurring takes its October charges from `UPCOMING`. Change a figure in one data file and every screen follows.

---

## Run it

```bash
pnpm install
```

```bash
pnpm dev
```

Open <http://localhost:3000>. The design is authored at **1440 × 1024** — that viewport matches Figma 1:1.

Other scripts: `pnpm build` · `pnpm start` · `pnpm lint`

---

## What works

| Area | Behaviour |
| --- | --- |
| **Sidebar** | Collapse/expand (button or <kbd>⌘B</kbd> / <kbd>Ctrl B</kbd>). Collapsed, the logo stays and the toggle glides down beneath it. Tooltips on the rail, Planning group expands/collapses, profile menu. Below 1024px it becomes a slide-in drawer |
| **Search** | Filters the transactions table by name, category or payment method. <kbd>/</kbd> focuses it, <kbd>Esc</kbd> clears it |
| **Date range** | Presets + range calendar (two months on desktop, one on phones). Press-and-drag to select, **drag either end** to adjust, or click start then end. Filters the transactions table and the CSV export |
| **Download** | Generates a real CSV of the currently filtered transactions — entirely in the browser |
| **Cash Flow chart** | Hover to scrub any day (crosshair, points and tooltip follow the line), click to pin a week, <kbd>←</kbd>/<kbd>→</kbd> (<kbd>Shift</kbd> = week) when focused. Tooltip flips side near the right edge; the active month label highlights |
| **Recent transactions** | "View all" reveals 11 more mock rows; row hover |
| **Help / Notifications** | Popovers with keyboard shortcuts and sample notifications ("Clear all" works) |

What it does **not** do: fetch or persist anything, sign in/out, change the KPI cards or the chart line when the date range changes (the chart is the exact Figma export).

---

## Responsive behaviour

| Width | Layout |
| --- | --- |
| **≥ 1280px** | Figma layout: docked 260px sidebar, 4 KPI cards in a row, floating chart tooltip, 5-column table |
| **1024–1279px** | Docked sidebar, KPI cards 2 × 2 |
| **768–1023px** | Sidebar becomes a drawer (menu button in the header, scrim, Esc to close); search stays inline |
| **< 768px** | Search collapses to an icon that expands over the header (with Cancel); Help hidden (it's keyboard shortcuts); Download is icon-only; chart readout docks above the plot and you scrub with your finger (lift to pin); table becomes a stacked list; date picker shows one month with scrollable presets |

The main scroll area reserves its scrollbar gutter (`scrollbar-gutter: stable`), so expanding "View all" never shifts the layout sideways.

## Metadata

Titles `Home · Tidewell` / `Accounts · Tidewell` / `Reports · Tidewell` (template `%s · Tidewell`), description, Open Graph + Twitter cards, web manifest and theme colour, all in [`app/layout.tsx`](app/layout.tsx). File-based icons:

- [`app/icon.svg`](app/icon.svg) — favicon (the Figma logo mark)
- [`app/apple-icon.tsx`](app/apple-icon.tsx) — 180×180 home-screen icon
- [`app/opengraph-image.tsx`](app/opengraph-image.tsx) / [`twitter-image.tsx`](app/twitter-image.tsx) — 1200×630 card: full logo (mark + Geist SemiBold wordmark) on white
- [`app/manifest.ts`](app/manifest.ts)

Pages are marked `noindex` because this is a prototype.

**Social card URLs** ([`lib/site-url.ts`](lib/site-url.ts)): production builds point `og:image` at **https://statsnap-kargul.vercel.app**. Vercel previews use their own deployment URL, and `next dev` uses localhost (link-preview crawlers can't reach localhost, so test previews on a deployed URL). To move to a custom domain, set `NEXT_PUBLIC_SITE_URL` (see [`.env.example`](.env.example)). Don't rely on `VERCEL_PROJECT_PRODUCTION_URL` here: on this project it resolves to `statsnap-eight.vercel.app`, which 404s.

## Fidelity notes

- All icons, the logo, chart gridlines, series lines, crosshair and data points are the **original Figma SVG exports** in [`public/figma/`](public/figma). Icons are tinted through CSS masks so they can follow theme tokens; their geometry is untouched.
- Sizes, spacing, radii, shadows and colours are taken from the Figma node values (see [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)).
- **One deliberate deviation:** in Figma the X-axis month labels use a narrower scale than the gridlines and data (the "Sep" label sits ~270 px left of the September gridlines, while the tooltip correctly says *Jun 18–24*). The labels here are centred on the real month gridlines so hovering lines up with the right month.
- Buttons intentionally **don't bounce** — no scale/translate on press. Feedback is a 120 ms colour + shadow change.
- Motion follows Emil Kowalski's design-engineering rules: strong custom ease-out curves, nothing over 250 ms, no animation on keyboard-triggered actions, hover effects gated behind `(hover: hover)`, and `prefers-reduced-motion` respected.

---

## Project structure

```
app/
  globals.css            ← the design system: primitives → semantic tokens → shadcn map → Tailwind theme
  layout.tsx             ← fonts (Geist, Geist Mono, Inter) + providers
  (app)/layout.tsx       ← shared <AppShell> (sidebar state survives navigation)
  (app)/page.tsx         ← Home
  (app)/<screen>/page.tsx← one route per screen (metadata title + <ScreenView />)
components/
  dashboard/
    app-shell.tsx        ← sidebar + drawer + main column, ⌘B; <PageContent> scroll area
    reports-view.tsx     ← Reports state (search, date range, table expansion)
    section-card.tsx     ← card frame (title row + body) used by Home and Accounts
    card-action.tsx      ← "View all ›" title-row control (link or coming-soon toast)
    app-sidebar.tsx      ← Figma 1:5
    page-header.tsx      ← Figma 1:125
    report-toolbar.tsx   ← Figma 1:145 (date range + Download)
    kpi-cards.tsx        ← Figma 1:159
    cash-flow-card.tsx   ← Figma 1:213 (interactive chart)
    transactions-card.tsx← Figma 1:286 (also used on Home)
  home/
    home-view.tsx        ← Home layout + search
    accounts-card.tsx, month-card.tsx, budgets-card.tsx, upcoming-card.tsx, goals-card.tsx
  accounts/
    accounts-view.tsx    ← summary KPIs + list/detail + the selected account's activity
    account-list.tsx     ← grouped, selectable accounts with subtotals
    account-detail.tsx   ← balance, 6-month chart, credit use, key facts
    account-summary.tsx  ← row content shared with Home's Accounts card
    balance-chart.tsx    ← static month-end balance line
  transactions/, cashflow/, budget/, recurring/, goals/, investments/,
  analytics/, tracking/, data-center/, help/, settings/
                         ← one folder per screen: <area>-view.tsx + its cards
  ui/meter.tsx           ← budget / goal progress bar
  ui/range-calendar.tsx  ← drag-to-select range calendar (built on react-day-picker)
  icon.tsx               ← mask-tinted Figma icon
  ui/                    ← shadcn/ui components, re-skinned with Tidewell tokens
lib/
  data/                  ← ALL mock data, one file per area (index.ts re-exports the shared ones)
  use-media-query.ts     ← SSR-safe breakpoint hook
  brand-image.tsx        ← shared logo/font for generated icons + OG card
  chart.ts               ← chart geometry + reading the Figma line export for hover
  format.ts, prototype.ts, utils.ts
public/figma/            ← Figma SVG exports (do not edit)
DESIGN_SYSTEM.md         ← full token + component documentation
```

---

## Turning this into a real product

1. Replace `lib/data/` with server data (Route Handlers / Server Components).
2. Render the chart from data (e.g. Recharts via `shadcn add chart`) instead of the static SVG — the scales in `lib/chart.ts` already describe the axes.
3. Wire the date range into the KPI and chart queries.
4. Add real routes for the sidebar items and real auth for the profile menu.
