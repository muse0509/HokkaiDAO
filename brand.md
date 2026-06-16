# ctsDAO — Brand System

The source of truth for the ctsDAO landing page visual system. Light-first,
quiet, premium, editorial. A winter residency in Japan for global crypto
builders — Japanese without cliché.

## Tone

- Quiet, but unforgettable.
- Serious builders, focused environments, low noise, high proximity.
- Premium and considered, but not arrogant.

## Color

Mostly Washi White + Sumi Black. Very limited red and gold.

| Token            | Hex / value             | Use                                                        |
| ---------------- | ----------------------- | ---------------------------------------------------------- |
| Washi White      | `#F4F1EA`               | Main background. **Never** pure white `#FFFFFF`.           |
| Washi Raised     | `#FAF8F2`               | Subtle lifted surface, inputs.                             |
| Washi Sunk       | `#ECE7DB`               | Subtle recessed panel.                                     |
| Sumi Black       | `#0E0E0F`               | Main text. **Never** pure black `#000000`.                 |
| Ink 700 / 500 / 400 | `#2B2A26` `#57544C` `#8B877C` | Secondary text, body, muted captions/metadata.    |
| Akane Red        | `#C8362D`               | CTAs, links, small highlights — at most one keyword/section. |
| Kojiki Gold      | `#D9A441`               | Tiny details only: numerals, dividers, small icons, rhythm. |
| Line / Line soft | `rgba(14,14,15,.12/.07)`| Hairline dividers.                                         |

Keep the ratio very restrained. No gradients, glows, neon, or generic Web3 visuals.

## Typography

- **Inter** — headings and body. Headings light (300), spacious, editorial.
- **JetBrains Mono** — small labels, captions, metadata, section markers (`.mono-label`, `.num`).

## Layout

- Increase whitespace. Thin dividers instead of heavy containers.
- Reduce card-heavy / SaaS UI. Japanese restraint via spacing, composition, type —
  not obvious motifs.
- Minimal, quiet, high-trust.

## Logo

Official mark on solid Washi White, generous clear space. Never recolor, stretch,
rotate, or place over imagery. Asset: `public/logo.svg` (see `components/Logo.tsx`).

## Implementation

Tokens live as Tailwind v4 `@theme` variables in `app/globals.css`
(`bg-washi`, `text-sumi`, `text-ink-500`, `text-akane`, `text-kojiki`,
`border-line`, `.mono-label`, `.num`).
