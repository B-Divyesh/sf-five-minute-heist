# Five-Minute Heist visual thesis

## Direction

**Luminous glass data landscape.** The screen is a midnight museum seen through a thief’s planning table. Translucent panes, etched routes, and cold edge light make the puzzle feel like a precise model of a physical gallery. The scene is atmospheric, but the board and controls remain the brightest, sharpest layer.

This fits a plan-then-watch heist: glass suggests both museum cases and a tactical overlay. The tilted editorial composition keeps it distinct from a centered game menu or a generic SaaS page.

## Palette

The tokens come from blue-black museum shadows, cyan glass edges, amber exhibit light, and coral alarm lamps.

| Token | Value | Use |
| --- | --- | --- |
| Night | `#07131b` | page background |
| Ink | `#0b1e28` | deep panels |
| Glass | `#123442` | raised surfaces |
| Frost | `#e9fbff` | primary text |
| Mist | `#a9c4cc` | secondary text |
| Laser | `#62f2dd` | focus, route, primary action |
| Vault | `#ffd166` | loot and score |
| Alarm | `#ff7b72` | danger and failed run |

Text contrast is at least 4.5:1. Color never carries game state alone; every tile also has a shape and label.

## Type and spacing

- Display: **Space Grotesk**, self-hosted OFL variable font, used for headings and large scores.
- Body: **Atkinson Hyperlegible**, self-hosted OFL regular and bold, used for controls and instructions.
- Spacing follows an 8 px grid, with 4 px only for tight internal gaps.
- Body text is 16–18 px with a maximum 68-character measure.
- Touch targets are at least 44 × 44 px.

## Composition and shape

The opening screen uses an asymmetric split. Copy occupies a narrow left column while the daily board overlaps the luminous museum scene on the right. Glass panes use clipped corners instead of rounded default cards. Fine grid lines evoke floor plans. Buttons are short rectangular tabs with one cut corner.

On phones, the scene becomes a shallow backdrop and the board stacks below the short introduction. Secondary explanation moves below the playable board so the game appears in the first captured screen.

## Interaction grammar

- Direction buttons add one move to a five-slot plan.
- The board previews the planned player and guard positions at each slot.
- Backspace removes the last move; arrow keys add moves; Enter executes.
- Execution advances one room at a time and reports loot, escape, or detection.
- Failure keeps the attempted plan visible until the player edits it.
- Sound is off by default and only starts after a deliberate toggle.

Difficulty comes from deterministic guard loops, walls, and an optional loot-before-exit rule. The generator searches every five-move route and accepts only solvable daily boards. It favors 2–18 valid plans so a run stays within 4–6 minutes.

## Motion

The signature motion is a stepped light that travels along the queued route during execution. UI transitions use 180–260 ms opacity and transform changes. The background drifts by at most 12 px. There is no flashing above 3 Hz. With `prefers-reduced-motion`, travel, drift, and entrance movement become instant opacity changes.

## Asset plan and provenance

- `public/art/museum-night-*.webp`: original generated hero scene, used as an atmospheric background and social source.
- `public/og-image.webp`: a 1200 × 630 crop derived from the original scene. No critical text appears inside the image.
- Board symbols and wordmark are hand-authored CSS/SVG and use no third-party icon set.

### Generation prompt sheet

Use case: stylized-concept. Asset: wide browser-game hero scene. An impossible after-hours museum made from suspended transparent glass galleries above a dark reflective void. A tiny empty central exhibit plinth, thin cyan route lines in the architecture, one warm amber display light, one distant coral alarm lamp. Isometric editorial composition with generous dark negative space on the left, crystalline edges, subtle volumetric haze, high-end 3D illustration, no people. Palette: blue-black, deep teal glass, pale cyan, restrained amber and coral. No text, letters, numbers, logos, brands, watermark, UI, hands, faces, or legible signage.

Generation method: Azure AI Foundry factory image deployment via `/opt/fleet/lib/gen-image.sh`, generated 2026-09-02. Original project asset. Final candidates are visually reviewed for unwanted text, symbols, seams, people, and branding before use.
