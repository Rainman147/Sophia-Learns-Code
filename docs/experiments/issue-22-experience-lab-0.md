# Issue #22 First Contact Controlled Comparison

**Status:** ready for owner/learner review; decision intentionally open

**Prototype classification:** transferable interaction concepts; disposable issue #26 spike implementation

**Product question:** Does a restrained Operations Center improve anticipation, progress understanding, tool desirability, Case identity, and return motivation enough to justify its added navigation, authoring, visual, and engineering cost?

**Exact base SHA:** `c442c5bd6fdbf09c0ac59cf3bc9ae1e3f5ecbe43`

**Exact tested implementation/evidence SHA:** `fcef1c043f6b03b39692de225d29e798b509a315`

**Branch:** `spike/mission-shell-stack`

**Draft PR:** [#30](https://github.com/Rainman147/Sophia-Learns-Code/pull/30)

No winner is selected in this package. Engineering evidence says both controlled routes are runnable, matched, accessible within the automated scope, and visually reviewable. It cannot answer which route improves comprehension, desire, or return motivation; that requires owner judgment and consented learner observation.

## Open the two variants

From the repository root:

```text
cd spikes/mission-shell
npm ci
npm run dev
```

- **Variant A — Direct Mission:** `http://127.0.0.1:3100/direct/`
- **Variant B — Operations Center + Mission:** `http://127.0.0.1:3100/operations/`
- **Deterministic synthetic review mode:** append `?runtime=scripted`

The default route uses the issue #26 real Pyodide Worker. The scripted route is labelled synthetic and exists so reviewers and browser tests can compare the same UI sequence deterministically.

## Controlled comparison

| Area | Variant A — Direct Mission | Variant B — Operations + Mission | Control status |
|---|---|---|---|
| Entry boundary | Compact Case cold open inside the Mission | Restrained Operations Center with one active Case, one available tool, one locked possibility, and one recommended Mission | Deliberate experimental variable |
| Actions before first Run | `Begin Mission` (1 action) | `Begin First Contact`, then `Begin Mission` (2 actions) | Deliberate navigation cost |
| Mission definition and 16-stage sequence | Shared | Shared | Matched and browser-asserted |
| Learning objective and Python tasks | Shared | Shared | Matched and browser-asserted |
| Story facts and wording | Shared | Shared | Matched and browser-asserted |
| Editor, execution, evaluation, and Case event | Shared | Shared | Identical implementation |
| Intentional error and repair | Shared | Shared | Identical source, clue, and recovery |
| Prediction and execution trace | Shared | Shared | Identical prompts and outcomes |
| Capability evidence and reward | Shared | Shared | Identical evidence and wording |
| Visual tokens and accessibility support | Shared | Shared | Same CSS/components and test expectations |
| Completion boundary | Compact capability/next-action panel | Return to a visibly changed Operations Center | Deliberate experimental variable |
| Continue/Stop behavior | Explicit choice; no autoplay | Explicit choice; no autoplay | Matched |
| Persistence/export/reset | Shared local `EvidenceStore` | Shared local `EvidenceStore` | Matched |

The hub is the principal variable. Neither route was intentionally weakened.

## Complete First Contact path

Both variants support the same experience:

1. Understand the compact Case question.
2. Distinguish Investigation Console source from result/Case state.
3. Run `print("Hello, Sophia!")`.
4. See explicit code-to-world causality.
5. Personalize the text and see a changed result.
6. Predict a two-line result or choose **Not sure yet**.
7. Inspect a short execution sequence.
8. Encounter an intentional unmatched quotation mark.
9. Receive calm Goal, Observed, Clue, and Next action feedback.
10. Repair the source personally.
11. Complete a fresh, reduced-support Field Test.
12. Review honest capability evidence and one restrained reward.
13. Understand why the Case changed.
14. Choose Continue or Stop without autoplay pressure.
15. Reload and recover supported local stage/source/revision state.
16. Export synthetic evidence or deliberately reset to the authored baseline.

## Hypotheses

### H1 — Direct Mission

Direct entry may minimize hesitation and the number of decisions before meaningful code while still giving enough Case identity through a compact cold open and completion panel.

### H2 — Operations Center + Mission

The hub may improve anticipation, progress comprehension, tool desirability, Case identity, and return motivation by showing one active Case, one available tool, one locked possibility, and one recommendation before the Mission—and by visibly changing after success.

### Cost hypothesis

The hub adds one pre-Mission navigation action, a persistent state projection before and after the Mission, additional responsive/accessibility states, more authoring copy, and extra visual QA. That cost is justified only if owner/learner evidence is meaningfully better than the direct route.

## Engineering observations — not learner evidence

| Observation | Variant A | Variant B | Method and interpretation |
|---|---:|---:|---|
| Automated first useful interface | 389.16 ms | 439.19 ms | One Chromium run per route from navigation until labelled editor + enabled Run; automation immediately activates boundary buttons. The 50.03 ms difference is noise-scale, not evidence about learner hesitation or preference. |
| Navigation actions before first Run | 1 | 2 | Browser trace: Direct has `Begin Mission`; Operations adds `Begin First Contact`. Editing and Run remain explicit in both. |
| Matched Mission stages | 16 | 16 | Actor sequence and E2E parity assertion. |
| Happy + designed error path | Pass | Pass | Chromium and Firefox at laptop/narrow sizes using the same test procedure. |
| Reload/resume | Pass | Pass | Exact source/revision/stage survives reload in both engines/sizes. |
| Stop boundary | Clean completion | Changed hub, then clean completion | Both offer Continue/Stop and never autoplay the next Mission. |
| Likely heuristic hesitation | Understanding the cold-open Case and choosing Begin | Understanding whether the hub is actionable, then choosing the recommended Mission | Heuristic inspection only; must be observed with learners. |
| Additional surface | One compact entry and one compact completion projection | Hub-before + hub-after projections, three cards, changed state, one extra boundary action | Source/design inspection; no claim of long-term production cost. |
| Narrow-layout defects | None remaining in checked states | None remaining in checked states | Chromium/Firefox 390×844; essential actions visible with no horizontal overflow/hover dependency. |
| Keyboard path | Pass | Pass | Full completion with visible focus in both engines/sizes. Firefox CodeMirror Tab escape was repaired in the shared adapter. |
| Reduced-motion path | Pass | Pass | Same semantic Case consequence and text equivalent with nonessential motion disabled. |
| Accessibility baseline | Pass within automated scope | Pass within automated scope | Axe at key states, semantic labels, polite/atomic status, non-color errors; no real screen-reader session. |

Direct and Operations measurements ran on the same high-end Windows/AMD host. The Operations run has only three warm samples; the Direct run has twelve. These timings must not be used to infer comprehension, motivation, desirability, or “winner.”

## What the screenshots show

All captures use synthetic prototype data. They are evidence of implemented states, not learner preference.

| Review state | Artifact | What to inspect |
|---|---|---|
| Side-by-side route index | [comparison index — laptop](../../spikes/mission-shell/artifacts/screenshots/comparison-index-laptop.png) | Whether the comparison mechanism is obvious without privileging a route. |
| Operations before Mission | [Operations before — laptop](../../spikes/mission-shell/artifacts/screenshots/operations-before-laptop.png) | Whether one active Case, one tool, one locked possibility, and one recommendation create anticipation or dashboard friction. |
| Direct cold open | [Direct briefing — laptop](../../spikes/mission-shell/artifacts/screenshots/direct-briefing-laptop.png) | Whether the Case question and dominant action provide enough context without a hub. |
| Direct calm error | [Direct calm error — laptop](../../spikes/mission-shell/artifacts/screenshots/direct-calm-error-laptop.png) | Goal/Observed/Clue/Next-action hierarchy and editor/result distinction. |
| Direct completion | [Direct completion — laptop](../../spikes/mission-shell/artifacts/screenshots/direct-completion-laptop.png) | Whether capability evidence, reward restraint, and next action are understandable without a persistent hub. |
| Operations after Mission | [Operations after — laptop](../../spikes/mission-shell/artifacts/screenshots/operations-after-laptop.png) | Whether the changed Case/tool/possibility state makes progress and return value clearer. |
| Narrow fallback | [Direct briefing — narrow](../../spikes/mission-shell/artifacts/screenshots/direct-briefing-narrow.png) | Hierarchy, action visibility, line length, and absence of horizontal overflow. |

Capture metadata is recorded in the [screenshot manifest](../../spikes/mission-shell/artifacts/screenshots/manifest.json).

## Owner comparison rubric — intentionally open

For each row, record one of `keep`, `revise`, `remove`, or `retest`, plus one concrete reason. The observation fields remain open until a human actually reviews the routes.

| Question | Variant A observation | Variant B observation | Owner judgment |
|---|---|---|---|
| Which route makes the Case question clearest before Run? | Open | Open | Open — keep/revise/remove/retest |
| Does the hub create useful anticipation or merely delay code? | Open | Open | Open — keep/revise/remove/retest |
| Which route makes the Investigation Console feel more desirable? | Open | Open | Open — keep/revise/remove/retest |
| Which route better explains what changed after the Mission? | Open | Open | Open — keep/revise/remove/retest |
| Is the locked Computer's Mind possibility motivating or decorative? | Open | Open | Open — keep/revise/remove/retest |
| Does the changed hub improve voluntary return intention? | Open | Open | Open — keep/revise/remove/retest |
| Which experience feels more cohesive, adult, and calm? | Open | Open | Open — keep/revise/remove/retest |
| What is remembered: Python capability or interface decoration? | Open | Open | Open — keep/revise/remove/retest |
| Is the additional authoring/engineering surface justified? | Open | Open | Open — keep/revise/remove/retest |
| Does either route obscure Continue versus Stop? | Open | Open | Open — keep/revise/remove/retest |

## Learner observation script

Do not coach unless the learner reaches a genuine dead end. Counterbalance order. Record exact behavior and quotes only with consent, and do not commit identifying information.

1. Randomize which variant appears first.
2. Ask: “What do you think this Case needs from you?”
3. Start the timer when the route becomes visible.
4. Record the first hesitation, first meaningful action, navigation actions, and time to first Run.
5. After first output, ask: “What changed, and what caused it?”
6. During personalization, record whether the learner distinguishes source from result.
7. During prediction, record whether the learner reasons, guesses, or chooses **Not sure yet**.
8. During the intentional error, ask only: “What is Python telling you?” Record whether the learner uses Goal, Observed, Clue, or Next action.
9. At Field Test completion, ask: “What can you now do without help?”
10. At reward, ask: “What does the app believe you can do, and why?”
11. At the natural boundary, offer Continue and Stop without prompting either; record voluntary choice.
12. After both variants, use the comparison prompts below.

### Comparison prompts

- Which beginning made the Case easiest to understand?
- Did either route delay the moment you wanted to write or run code?
- Which future tool, if any, would you want to open?
- What progress do you think you made?
- Which screen would make you more likely to return voluntarily?
- What do you remember about `print` and quotation marks?
- What visual detail do you remember that was not related to learning?
- Which route felt more polished and coherent, and why?
- If the Operations Center disappeared, what useful information would be lost?

Preference alone is not learning evidence; correctness alone is not complete experience evidence. Report comprehension, behavior, affect, and continuation separately.

## Accessibility observations and manual review prompts

Automated evidence covers both variants in Chromium and Firefox at 1366×768 and 390×844:

- keyboard-only completion and visible focus;
- logical Tab/Shift+Tab escape from CodeMirror;
- labelled source, output, Case state, prediction, feedback, reward, and runtime status;
- polite, atomic, bounded live status that settles after a run;
- error and progress meaning not conveyed by color alone;
- reduced-motion semantic/text parity;
- no essential hover-only information;
- no horizontal overflow or hidden essential narrow-screen action;
- axe baseline checks at Operations, editor, and calm-error states.

Human review still needs a real screen reader, 200%/400% zoom, Windows high contrast, touch/virtual keyboard, and representative learner behavior. In particular, listen for whether status timing is useful rather than merely standards-shaped, and whether the CodeMirror instructions are discoverable without visual context.

## Additional authoring and engineering cost

### Shared cost

Both variants use one Mission definition, actor, editor, execution runtime, evaluator, Case event/state, scene projection, evidence store, feedback vocabulary, test helper, and responsive token set. The controlled parity assertion prevents content/outcome drift.

### Direct-only cost

- One compact cold-open boundary.
- One compact capability/reward/next-action completion projection.
- Corresponding screenshot/visual-QA states.

### Operations-only cost

- A pre-Mission hub projection with exactly three meaningful cards/states.
- An additional `Begin First Contact` boundary before the shared briefing.
- A post-Mission hub projection whose Case, available tool, locked possibility, recommendation, and copy must all respond truthfully to shared Case/evidence state.
- Additional narrow/keyboard/axe/visual-QA states and two representative screenshots.
- Ongoing authoring obligations for locked possibilities, recommendations, hub-state changes, and the explanation of why the learner returned there.

The prototype deliberately keeps this cost in one shared controller with conditional boundary projections. That implementation convenience does not prove that a production hub is cheap; a persistent Operations Center would become a product/content commitment across Missions.

## Questions that require owner or learner judgment

Engineering cannot resolve these from the current evidence:

- Does the hub improve Case comprehension before any code is run?
- Does one extra action feel like useful anticipation or avoidable friction?
- Is the available Investigation Console more desirable when placed beside a locked future capability?
- Is the changed Operations state legible as earned progress rather than decorative dashboard change?
- Does the direct completion panel provide enough orientation and return motivation by itself?
- Which route produces better recall of the learning objective rather than the interface?
- Is the hub's recurring authoring and QA cost justified by observed behavior, not stated preference alone?
- Does either route need one named revision before a fair learner test?

## Decision field — intentionally open

Human review must choose one outcome only after recording evidence:

- mission-only;
- hub plus mission;
- hybrid hub at natural boundaries;
- remove the hub; or
- retest after a named change.

**Owner decision:** open

**Reason/evidence:** open

**Required change or follow-up:** open

**Learner sample/context:** open

**Review date:** open

## Scope confirmation

This package does not select a winner, fabricate learner evidence, close issue #22, declare a permanent Operations Center/brand/design system, migrate prototype code into production, alter canonical architecture, or add the next Mission. The issue #26 real-Python path is shared technical-spike infrastructure, not a production architecture decision.

Both variants are runnable, fully traversed in browser automation, visually inspected at laptop and narrow sizes, documented with synthetic screenshots, and placed in draft PR [#30](https://github.com/Rainman147/Sophia-Learns-Code/pull/30). That satisfies the issue #22 packet's stop condition while leaving the owner decision open.
