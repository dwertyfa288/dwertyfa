# Spatial portfolio — full redesign

User direction: dark space, three-dimensional glass objects; choose the palette. Retain all four projects including Nova Prestige, publish through existing GitHub Pages.

Visual system: midnight violet, ice lavender and warm peach; translucent surfaces, oversized centered typography and several distinct WebGL sculptures. Replace the previous page structure and styles entirely.

Implementation:
- Hero: a constellation of glass torus, crystal, sphere, chrome helix and satellites reacting to the pointer and scroll.
- Projects: four native-scroll-driven chapters in a pinned perspective gallery. Number controls jump to the corresponding chapter; mobile uses horizontal scroll snap. Reduced motion and no-JavaScript show the complete static portfolio.
- Expertise: three independently visible 3D scenes for interface, systems and integrations. Existing facts and contact URLs preserved.
- Contact: a separate animated ring tunnel and a direct Telegram call to action.
- Motion: progressive enhancement only, native scrolling, keyboard access, cleanup, reduced motion and paused offscreen WebGL.

Verification: unit tests for chapter math and control scroll positions; lint, TypeScript, static build and exported asset checks; independent review; push main and verify the exact deployment and live HTML/assets.

Validation completed: four gallery math tests, ESLint, TypeScript and GitHub Pages production build; all four project chapters, five canvas fallbacks, contact URLs and 18 exported assets verified. Independent review fixes cover chapter content height, keyboard focus when changing chapters and static-mode navigation indicators.

