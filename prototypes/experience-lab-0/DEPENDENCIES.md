# Declared dependency and license ledger

All versions are exact pins in `package.json` and `package-lock.json`. Package
license metadata was checked from the installed package manifests and npm
registry metadata on 2026-09-01.

| Package | Version | Role | License |
|---|---:|---|---|
| `react` | 19.2.8 | UI runtime | MIT |
| `react-dom` | 19.2.8 | DOM renderer | MIT |
| `@testing-library/jest-dom` | 7.0.1 | DOM assertions | MIT |
| `@testing-library/react` | 16.3.3 | React interaction tests | MIT |
| `@testing-library/user-event` | 14.6.6 | Keyboard and input simulation | MIT |
| `@types/react` | 19.2.18 | React TypeScript declarations | MIT |
| `@types/react-dom` | 19.2.5 | React DOM TypeScript declarations | MIT |
| `jsdom` | 30.0.1 | Test DOM environment | MIT |
| `typescript` | 7.0.2 | Static type checking | Apache-2.0 |
| `vite` | 8.2.2 | Development and production build tool | MIT |
| `vitest` | 4.1.11 | Test runner | MIT |

The lockfile is the authoritative transitive dependency graph. No dependency is
loaded from a CDN at runtime.

## Asset provenance

- typography: local system font stacks only;
- icons and diagrams: original semantic text, CSS shapes, and inline SVG;
- Case data: synthetic;
- imagery, audio, video, third-party fonts, and proprietary interface assets:
  none.
