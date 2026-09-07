# Portfolio redesign implementation plan

Goal: Replace the current portfolio design, add Nova Prestige, push to GitHub and verify the existing GitHub Pages deployment.

Design: Graphite and electric lime, oversized Cyrillic typography, a chrome 3D sculpture, individually art-directed project panels, restrained scroll choreography and responsive layouts. Retain existing project URLs and contacts. Use actual project imagery. No invented outcomes or metrics.

Architecture: Keep the existing Next.js static export and GitHub Actions workflow. Separate page content, motion behavior and the Three.js scene. CSS handles layout, transitions and reduced motion; observers and requestAnimationFrame handle progressive enhancement. Content and links remain available without JavaScript or WebGL.

- [x] Replace app/page.tsx and app/globals.css with the new hero, four projects, expertise, process and contact sections; show the compiled preview.
- [x] Replace app/DeveloperScene.tsx with the interactive chrome sculpture, adaptive rendering, visibility suspension, reduced-motion support and graceful WebGL fallback.
- [x] Add app/PortfolioMotion.tsx for scroll progress, pointer effects, section reveals and magnetic buttons with cleanup and touch-safe behavior.
- [x] Optimize public/projects imagery, preserve asset paths under /dwertyfa/, update typography, metadata and favicon.
- [x] Run lint, TypeScript and the same static production build as GitHub Actions. Check exported content, project URLs and referenced local assets.
- [ ] Review the complete diff, commit, integrate into main, push without force, wait for the matching Pages workflow and verify the live document and assets.

Validation: Existing routes and all contact/project links remain functional. Export includes Nova Prestige and all prior projects. Every image and stylesheet resolves under the Pages base path. Reduced motion disables continuous animation. Keyboard focus and narrow layouts remain usable. No new service, domain, backend or hosting migration.

Validation completed: ESLint, TypeScript (production build), GitHub Pages static export, all four project links, navigation targets and 20 exported asset paths. Independent code review found no remaining actionable issues. WebGL restoration reconstructs reflection resources; 320px navigation preserves the primary links.

