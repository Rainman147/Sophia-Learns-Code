# Visual and interaction inspection record

**Prototype:** Game Geometry Lab 1

**Routes:** `/direct`, `/hub-first`, `/earned-hub`

**Causality presentations:** `a`, `b`, `c`

**Browser:** Chromium through the Codex in-app browser and Playwright

**Laptop evidence:** default in-app width and 1366×900 automated viewport

**Narrow evidence:** 390×844

**Data:** synthetic only

## Inspected states

- direct Mission entry;
- hub-first Operations Center entry and entry into First Contact;
- earned-hub Case cold open with no pre-existing Center;
- first execution in causality A, B, and C;
- personalized result and transition into Predict;
- prediction plus first-line trace;
- intentional unmatched quotation mark and four-part recovery packet;
- repaired message;
- fresh reduced-support Field Test;
- direct completion boundary;
- earned Operations Center reveal and causation explanation;
- Stop, Resume, persistence, and confirmed route-scoped reset;
- narrow direct-Mission ordering; and
- reduced-motion first-run state.

## Final engineering observations

| Check | Result |
|---|---|
| Three entry routes | runnable and independently persisted |
| Mission rhythm | exactly five visible beats; finer internal states remain unlabeled |
| Scene continuity | source, action, output, and Case consequence evolve in one Mission scene |
| Causality parity | A/B/C preserve `Hello, Sophia!` and the same semantic result |
| Earned-hub causation | Center absent before Field Test; success explanation precedes first Center view |
| Mission 002 boundary | preview visible after completion; no action or autoplay |
| Keyboard journey | complete route, error recovery, Stop/Resume, and reset exercised |
| Reduced motion | ordered static explanation and identical Case state retained |
| Axe checks | no serious or critical findings in final tested states |
| Narrow overflow | document width stayed within 390 CSS pixels on all routes |
| Narrow action order | source → current encounter/action → causal explanation |
| Browser console | no warnings or errors observed during the final local inspection |

## Defects found and corrected during inspection

1. **Muted text missed WCAG AA contrast by a small margin.** Darkened the shared
   muted-ink token and reran the browser accessibility matrix.
2. **The five-beat row becomes horizontally scrollable at narrow width but was
   not keyboard-focusable.** Added a labeled focus target to the ordered list.
3. **Vitest collected the Playwright suite.** Separated the browser directory
   from the unit/integration test include boundary.
4. **The earned-Center entrance faded readable text from transparent.** Retained
   the short spatial transition but removed opacity animation so the reveal never
   creates a temporary contrast failure.
5. **A fixed hidden skip link appeared inside one stitched reduced-motion
   screenshot when the page was scrolled.** Returned to the top before the
   evidence capture; keyboard focus behavior remains intact.

## Representative captures

| Capture | Purpose |
|---|---|
| `screenshots/direct-mission-entry.png` | Variant A entry |
| `screenshots/hub-first-entry.png` | Variant B entry |
| `screenshots/earned-hub-cold-open.png` | Variant C cold open before the Center exists |
| `screenshots/first-run-causal-bridge.png` | first run and changed evidence |
| `screenshots/prediction-and-trace.png` | connected prediction/trace encounter |
| `screenshots/error-unmatched-quotation.png` | intentional error and recovery packet |
| `screenshots/repaired-quotation.png` | repaired result |
| `screenshots/field-test.png` | fresh reduced-support task |
| `screenshots/operations-center-reveal.png` | earned Center and visible next Mission boundary |
| `screenshots/causality-a-output-only.png` | causality A |
| `screenshots/causality-b-case-reaction.png` | causality B |
| `screenshots/causality-c-explicit-bridge.png` | causality C |
| `screenshots/narrow-layout.png` | 390×844 ordering and containment |
| `screenshots/reduced-motion-state.png` | static-equivalent causal explanation |

These captures are synthetic engineering evidence. They do not contain or imply
learner observations, preferences, or a winning geometry/causality treatment.
