# Declared dependency and asset ledger

All versions are exact pins in `package.json` and `package-lock.json`. License
metadata was checked from the installed package manifests on 2026-09-01.

| Package | Version | Role | License |
|---|---:|---|---|
| `react` | 19.2.8 | UI runtime | MIT |
| `react-dom` | 19.2.8 | DOM renderer | MIT |
| `@axe-core/playwright` | 4.13.0 | Browser accessibility assertions | MPL-2.0 |
| `@playwright/test` | 1.62.1 | Browser journey and responsive tests | Apache-2.0 |
| `@testing-library/jest-dom` | 7.0.1 | DOM assertions | MIT |
| `@testing-library/react` | 16.3.3 | React interaction tests | MIT |
| `@testing-library/user-event` | 14.6.6 | Keyboard and input simulation | MIT |
| `@types/node` | 26.4.1 | Node.js TypeScript declarations | MIT |
| `@types/react` | 19.2.18 | React TypeScript declarations | MIT |
| `@types/react-dom` | 19.2.5 | React DOM TypeScript declarations | MIT |
| `jsdom` | 30.0.1 | Test DOM environment | MIT |
| `typescript` | 7.0.2 | Static type checking | Apache-2.0 |
| `vite` | 8.2.2 | Development and production build tool | MIT |
| `vitest` | 4.1.11 | Unit and integration test runner | MIT |

The lockfile is the authoritative transitive dependency graph. No dependency is
loaded from a CDN at runtime.

## Asset provenance

- Typography uses local system font stacks only.
- The Case folder diagram is original semantic inline SVG.
- Icons, arrows, emphasis marks, and layout treatments are original text/CSS/SVG.
- All Case records and timestamps are synthetic.
- No imagery, audio, video, third-party fonts, proprietary interface assets, or
  code from PR #30 are included.
