# Design System — ROY KNOX Flare

## Scene

Black-box stage — neutral graphite and true near-black, not navy. Electric blue flame is the melodic-bass signal; restrained gold appears only for tickets, commerce, and proof moments. Metal aggression meets refined ceremony (Sleep Token / BMTH lane filtered through Roy's flame identity). Burning piano video bleeds through a dark scrim, not white paper.

## Color Strategy

**Neutral monochrome + committed blue flame + rare gold.** Graphite carries the void; off-white ink provides contrast; electric blue appears on CTAs, links, music interactions, and selective emphasis. Gold is reserved for ticketing and commerce urgency. No navy surfaces, no generic purple-blue gradients, no ambient glow halos.

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `oklch(0.09 0.004 260)` | Near-black stage |
| `--color-surface` | `oklch(0.16 0.007 260)` | Graphite panels |
| `--color-surface-raised` | `oklch(0.2 0.008 260)` | Hover / elevated states |
| `--color-ink` | `oklch(0.94 0.004 260)` | Primary text — off-white |
| `--color-ink-muted` | `oklch(0.76 0.009 260)` | Secondary text — WCAG AA on charcoal |
| `--color-flame` | `oklch(0.72 0.2 244)` | Electric blue accent |
| `--color-flame-hot` | `oklch(0.64 0.23 244)` | Accent pressed state |
| `--color-gold` | `oklch(0.78 0.13 88)` | Ticket / commerce accent |
| `--color-border` | `oklch(0.94 0.004 260 / 0.12)` | Hairline rules |
| `--color-border-strong` | `oklch(0.94 0.004 260 / 0.26)` | Structural borders |

## Typography

- **Display:** Gloock — high-contrast poster serif for ceremonial scale (metal weight, not editorial fashion)
- **Prose / labels:** Archivo — tight grotesque sans for body, nav, buttons, and indexed labels (`FLR.01`, `DISC.02`); italic Archivo for lead prose
- **Scale:** fixed `rem` body scale plus fluid `clamp()` display scale; sizing tokens expose the 1 / 1.5 / 2 / 2.5 rhythm (`--size-4`, `--size-6`, `--size-8`, `--size-10`)
- **Display tracking:** `0.045–0.105em` positive stage-signage spacing
- **Balance:** `text-wrap: balance` on h1–h3

## Texture

Subtle film-grain overlay on `body` via CSS/SVG noise tile (`mix-blend-mode: overlay`, low opacity on dark bg). Sections can opt into `.grain` for local emphasis. Grain disabled under `prefers-reduced-motion`.

## Sizing & Radius

All element dimensions use `rem` / `em` sizing tokens wherever practical. Slight rounding only: `--radius-1: 0.25rem`, `--radius-2: 0.375rem`, `--radius-3: 0.5rem`, `--radius-4: 0.75rem`. Pills are reserved for badges.

## Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-quart)
- Hero: burning piano video (poster fallback on `prefers-reduced-motion`)
- Marquee: linear infinite scroll
- Section reveals: opacity + translateY, 600ms, staggered children
- Grain: subtle `steps()` shift; disabled under `prefers-reduced-motion`
- No glow pulses, no neon box-shadows, no glassmorphism

## Z-Index Scale

- `--z-base`: 0
- `--z-marquee`: 50
- `--z-sticky`: 100
- `--z-modal`: 200
- `--z-grain`: 9000

## Components

Small, composable Astro components — no monolithic page files. Token-driven CSS custom properties in `src/styles/tokens.css`.

## Anti-patterns removed

- Grainy white paper / cream backgrounds
- `--color-flame-glow` ambient shadows
- Filled header at page top
- Ghost cards (border + shadow + rounded panels)
- Gradient text
- Hero metrics
- Section eyebrows on every block
- Drenched blue void with neon halos everywhere
