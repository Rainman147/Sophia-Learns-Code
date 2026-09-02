# Experience Lab 0 — First Contact entry comparison

## Status and provenance

This is the owner comparison package for GitHub issue
[#22](https://github.com/Rainman147/Sophia-Learns-Code/issues/22), governed by
Wayfinder map [#20](https://github.com/Rainman147/Sophia-Learns-Code/issues/20).
It asks a product question; it does not establish production architecture or a
winning experience.

| Record | Exact value |
|---|---|
| Branch | `prototype/experience-lab-0` |
| Latest `main` base before prototype work | `c442c5bd6fdbf09c0ac59cf3bc9ae1e3f5ecbe43` |
| Tested and visually captured prototype head | `a5c32ec9e12a67b6b19426553b6bcd5b80ade1e8` |
| Final publication head | Recorded in the live draft PR and final lane handoff after this report commit |
| Prototype classification | **Throwaway research instrument** |

The tested head is the exact implementation commit used for the automated test,
build, and screenshot evidence in this package. The final branch head also adds
this report. A commit cannot contain its own derived SHA, so the exact final
publication SHA is recorded in the draft PR after the documentation commit
exists.

### Authority applied

The lane read the launch packet, all twelve repository authorities named in its
Full Prompt, the First Contact YAML specimen, issue #22 and its comments, and
Wayfinder map #20. Issue #21 was also checked because issue #22 names it as the
vocabulary-resolution dependency. Issue #21 remains open with no recorded
resolution at the time of this package.

When older Flight Deck, lesson, and checkride language conflicted with
`docs/22-rebaseline-decisions.md`, the rebaseline vocabulary governed this
prototype: Python Investigator, Operations Center, Case, Mission, Encounter,
Investigation Console, Debrief, and Field Test.

## Product question

Does a restrained persistent Operations Center improve anticipation, progress
understanding, tool desirability, Case identity, and return motivation enough to
justify its navigation, visual, authoring, and engineering cost?

This package presents evidence and prompts for an owner decision. It deliberately
does not answer that question on behalf of the owner or learners.

## Controlled variants

Run from `prototypes/experience-lab-0/` with:

```powershell
npm ci
npm run dev -- --port 4173
```

| Variant | Route | Experimental treatment |
|---|---|---|
| A — Direct Mission | `http://127.0.0.1:4173/direct` | Begins in First Contact; completion moves to a compact capability and next-action panel. |
| B — Operations Center + Mission | `http://127.0.0.1:4173/operations-center` | Begins in a restrained Center; completion returns to the visibly changed Center. |
| Reviewer comparison home | `http://127.0.0.1:4173/` | Explains the controlled variable and links to both routes; it is not part of either learner path. |

Each variant stores state under a separate versioned local-storage key so they
can be inspected independently. A visible Reset action asks for confirmation and
clears only the current variant.

### Shared and held equivalent

Both routes use the same `FIRST_CONTACT` mission definition, typed reducer,
scripted evaluator, visual language, and component implementation for the Mission.
The following are matched:

- Case question, story facts, and learning objective;
- Python-looking source tasks and all authored output;
- first run, personalization, prediction, trace, error, personal repair, Field
  Test, Debrief, Continue, and Stop sequence;
- feedback wording, evidence statements, reward, and final capability label;
- Investigation Console, Live Case Result, coach language, progress treatment,
  focus behavior, announcements, and reduced-motion support;
- approximate Mission length and all final learning evidence; and
- visual quality, synthetic data boundary, and prototype disclosure.

The shared semantic event sequence is:

1. `mission_opened`
2. `investigation_console_online`
3. `message_personalized`
4. `prediction_recorded`
5. `execution_sequence_inspected`
6. `unmatched_quote_observed`
7. `quotation_repaired`
8. `field_test_passed`
9. `mission_completed`

### Intentionally different

Only the shell boundary changes:

- Variant A has zero navigation actions before the first Mission run and exits
  to a compact capability/next-action panel.
- Variant B has one navigation action before the first Mission run. Its initial
  Center shows exactly one active Case, one available tool, one locked
  possibility, and one recommended Mission. Its return Center makes the verified
  Case state and newly available Investigation Console visible while preserving
  exactly one locked possibility and one recommended next Mission preview.

The next Mission is not implemented and cannot autoplay from either route.

## Prototype truth boundary

This is a deterministic, scripted React and TypeScript prototype, not a Python
runtime validation. The evaluator recognizes only the bounded `print(...)`
examples needed for this research path. It does not use Pyodide, a backend,
authentication, AI tutoring, or a generalized course engine.

Source actions dispatch typed state-machine actions. Those actions emit semantic
Case events; the Console and Case surfaces render from explicit state. The visible
consequence is therefore causal within the prototype rather than coordinated by
loose animation callbacks.

No conclusion should be drawn here about a production framework, mission schema,
runtime, statechart library, editor, persistence layer, visual identity, or asset
pipeline.

## Hypotheses to test with people

These are pre-observation hypotheses, not findings.

| ID | Neutral hypothesis | Evidence needed |
|---|---|---|
| H1 | The Center may make the active Case and the purpose of First Contact easier to anticipate before code begins. | Learner explanation before entering the Mission; hesitation and misinterpretation notes. |
| H2 | The Center may make progress and the Investigation Console reward easier to understand after completion. | Learner explanation of what changed and what became available. |
| H3 | A locked possibility may create useful curiosity, have no effect, or read as artificial gating. | Unprompted attention plus a non-leading desirability prompt. |
| H4 | Returning to a changed Center may increase voluntary exploration or return intent. | Voluntary click behavior and stated return intent, recorded separately. |
| H5 | The extra Center boundary may delay the first code action or create navigation uncertainty. | Instrumented elapsed time, navigation count, and observed hesitation. |
| H6 | Either shell may be remembered mainly for decoration rather than the `print` learning relationship. | Delayed explanation of what was learned compared with remembered visual details. |
| H7 | The Center may require enough authoring and engineering effort that any human benefit does not justify making it persistent. | Human evidence considered alongside the implementation-cost observations below. |

## Engineering observations

The statements in this section come from code, automated tests, and browser
inspection. They are not learner evidence.

### First meaningful action instrumentation

The state model records route initialization time as `openedAt` and the first
attempt to run source as `firstCodeActionAt`. The Debrief reports the rounded
elapsed seconds and meaningful-action count. Variant B separately records the
single `ENTER_MISSION` navigation before that run.

No time from the authoring or QA sessions is reported as learner time. For a
human session, the observer should copy the displayed value and also note any
long pause, reading behavior, wrong turn, or facilitation that makes the number
hard to interpret.

| Measure | Variant A structure | Variant B structure | Human result |
|---|---:|---:|---|
| Required navigation actions before first code run | 0 | 1 | _Not yet observed_ |
| Instrument start | Route state creation | Route state creation | _Not yet observed_ |
| Instrument stop | First source-run attempt | First source-run attempt | _Not yet observed_ |
| Time to first meaningful code action | _Not yet observed_ | _Not yet observed_ | _Leave blank until a learner session_ |

### Navigation steps and likely hesitation points

“Likely” here means a place worth observing, not a defect already witnessed in a
learner.

| Boundary | Variant A | Variant B | Observation target |
|---|---|---|---|
| Entry | Mission cold open → Run message | Center → Open First Contact → Run message | Does the extra boundary orient, distract, or merely delay? |
| During Mission | Identical eight-stage Mission progression | Identical eight-stage Mission progression | Confirm the shell treatment does not change task comprehension. |
| Completion | Debrief → compact capability panel | Debrief → changed Center | Can the learner explain capability evidence and why the Case changed? |
| Stop | Stop → saved-state screen → Resume | Stop → saved-state screen → Resume | Does Stop feel safe and final enough without losing progress? |
| Return | Reload restores current boundary | Reload restores current boundary | Can the learner reorient without facilitation? |

Specific hesitation points to mark are: distinguishing source from Console
output, distinguishing Console output from Case state, understanding why the
first Center button is recommended, deciding whether “locked” is meaningful,
and interpreting Continue after the Debrief.

### Additional authoring and engineering cost

These are implementation-size proxies from the tested artifact, not forecasts
for production:

- Variant B adds a dedicated `OperationsCenter.tsx` surface (154 source lines),
  before/after content states, one entry reducer transition, and one changed-hub
  exit treatment.
- Variant A adds a smaller `CompletionScreen.tsx` boundary (67 source lines).
- The shared Mission is concentrated in `MissionScreen.tsx` (397 source lines)
  and the typed reducer (441 source lines); neither is duplicated between routes.
- Variant B requires authored copy for an active Case, available tool, locked
  possibility, recommended Mission, and each item’s post-Mission change. This is
  recurring content work if the Center persists beyond the prototype.
- The Center also introduces additional responsive hierarchy, focus orientation,
  persistence, and regression-test states. It adds no package dependency.

Line counts include formatting and are supplied only to make the bounded
increment inspectable. They do not estimate design effort, future schema cost,
or production maintainability.

### Accessibility observations

- Both routes use semantic landmarks, heading hierarchy, explicit source/output/
  Case labels, a skip link, and a polite live region for meaningful transitions.
- The complete path, including prediction, trace, recovery, Continue, Stop,
  Resume, and Reset confirmation, is keyboard-operable.
- Major shell and Debrief transitions move focus to the new heading and reset the
  page to the top. Visible focus does not depend on color alone.
- Statuses include text and symbols; error recovery supplies Goal, Observed,
  Clue, and Next Action without shaking or alarm behavior.
- `prefers-reduced-motion` removes nonessential transitions. The execution trace
  always has a text equivalent, and no information depends on animation, hover,
  audio, or sound.
- Laptop and narrow layouts were inspected at 1440×1000 and 390×844. At the
  narrow viewport, document `scrollWidth` equaled `clientWidth`; no horizontal
  clipping was observed.

These are prototype observations, not a WCAG conformance claim. Human keyboard,
screen-reader, zoom, and cognitive-load testing remain open.

### Visual inspection and corrections

Browser inspection covered both complete routes at laptop and narrow viewports.
It found and corrected four issues before publication:

1. Variant A’s first dominant action initially fell below the laptop fold.
2. A hidden skip link appeared in a stitched full-page capture.
3. The Debrief inherited the Field Test’s lower scroll position.
4. The narrow layout placed the full Case result before the current action.

The final browser pass produced no console warnings or errors. Detailed state
coverage and synthetic screenshots are recorded in
`prototypes/experience-lab-0/artifacts/visual-inspection.md`.

## Human observation package

Nothing below has been filled with inferred or simulated learner behavior.

### Session setup

1. Use a fresh state for the assigned route and record participant/session ID
   without personally identifying data.
2. Counterbalance route order across learners when the same person sees both
   variants. Reset each route separately before its run.
3. Say: “This is a prototype. Some execution is scripted. Please work as you
   normally would. I may stay quiet so I can see what the interface explains.”
4. Do not explain the Center, the locked possibility, the Console/Case
   distinction, or the intended learning relationship in advance.
5. Mark first-run time, navigation actions, pauses, wrong turns, requests for
   help, self-corrections, voluntary exploration, and Stop/Continue behavior.
6. Ask the non-leading prompts below only at the named boundaries. Record actions,
   direct learner language, and observer interpretation in separate fields.
7. If the participant cannot proceed or becomes uncomfortable, help or stop;
   record the intervention rather than treating the resulting timing as clean.

### Case comprehension prompts

Ask after the cold open and before the first source run:

- “What do you think is happening here?”
- “What question are you trying to answer?”
- “What do you expect the Console and the Case result to show?”

Ask after the first successful run:

- “What changed, and what caused it?”
- “Which part is your instruction, which part is the computer’s result, and
  which part is the Case interpretation?”

### Progress and tool-desirability prompts

Ask only after the Mission is complete:

- “What can you do now that you could not do at the start?”
- “What evidence supports that?”
- “What changed in the Case, if anything?”
- “What do you think the Investigation Console is for?”
- “Is there anything here you would want to unlock or use later? Why or why not?”
- “What feels complete, and what still feels open?”

### Voluntary continuation and return prompts

First observe whether the learner chooses Continue, Stop, review, or another
visible action without prompting. Then ask:

- “What would you choose next?”
- “Would you want to continue now, come back later, or stop here? What shaped
  that choice?”
- “If you returned tomorrow, what would you expect to see first?”

Do not treat stated intent as observed return behavior. A later voluntary return
must be recorded as a separate behavioral observation.

### Remembered learning versus remembered decoration prompt

After a short unrelated break, ask without showing the interface:

- “What do you remember learning or proving?”
- “How would you explain what `print(...)` did to someone else?”
- “What do you remember seeing?”
- “Which remembered detail would help you write another message, and which was
  mostly atmosphere?”

Record the learning explanation before asking about visual memory so decoration
is not primed first.

### Blank learner observation record

| Field | Variant A | Variant B |
|---|---|---|
| Session/participant code |  |  |
| Route order |  |  |
| Time to first source-run attempt |  |  |
| Navigation actions before first run |  |  |
| Pauses or hesitation points (observable only) |  |  |
| Help requested or supplied |  |  |
| Learner’s Case explanation (direct words) |  |  |
| Learner’s source/output/Case distinction |  |  |
| Error response and repair behavior |  |  |
| Capability/evidence explanation |  |  |
| Tool or locked-possibility response |  |  |
| Voluntary action at final boundary |  |  |
| Stated continuation/return intent |  |  |
| Later return behavior, if observed |  |  |
| Remembered learning |  |  |
| Remembered decoration |  |  |
| Accessibility barriers or adaptations |  |  |
| Direct quotations |  |  |
| Observer interpretation (kept separate) |  |  |

## Owner review rubric

Review both routes before requesting cosmetic iteration. Do not total these
dimensions into a pseudo-objective score; record evidence and tradeoffs.

| Dimension | Owner question | Evidence to inspect | A judgment | B judgment |
|---|---|---|---|---|
| Anticipation | Can the learner predict the immediate purpose and next action? | Cold-open explanation, first-action hesitation |  |  |
| First-action cost | Is any added orientation worth its time and navigation? | Instrumented timing, step count, wrong turns |  |  |
| Case identity | Does the Case feel causally connected to code rather than decorative lore? | Source → event → Case explanation |  |  |
| Console/result distinction | Can the learner distinguish instruction, runtime-looking output, and world consequence? | First-run and post-run explanations |  |  |
| Progress understanding | Can the learner state what changed and what capability was introduced? | Debrief and final-boundary explanation |  |  |
| Tool desirability | Does the available/locked tool treatment create useful curiosity without pressure? | Unprompted attention and tool prompts |  |  |
| Continuation and return | Does the boundary support a voluntary next choice and later reorientation? | Behavior first, stated intent second |  |  |
| Learning memory | Is the `print` relationship remembered more clearly than decoration? | Delayed recall prompt |  |  |
| Accessibility | Are orientation, focus, status, motion, and narrow layout usable in practice? | Automated evidence plus human assistive-tech observation |  |  |
| Quality and cohesion | Does the shell feel calm, adult, precise, and internally coherent? | Owner inspection and learner language |  |  |
| Authoring cost | Is the recurring before/after Center content burden justified? | Content inventory and future Mission implications |  |  |
| Engineering cost | Are added states and regression surfaces justified by observed benefit? | B-specific surface/state cost and defects |  |  |

### Human decision fields — intentionally open

| Disposition | What specifically belongs here? | Evidence supporting it | Named follow-up |
|---|---|---|---|
| Keep |  |  |  |
| Revise |  |  |  |
| Remove |  |  |  |
| Retest |  |  |  |

The owner’s eventual resolution may be **mission-only**, **hub plus mission**,
**hybrid hub at natural boundaries**, **remove the hub**, or **retest after a
named change**. No option is selected in this report.

## Meaningful contradictions and unresolved questions

1. Older authorities and the YAML specimen still use Flight Deck, lesson, and
   checkride terminology. The rebaseline explicitly replaces those learner-facing
   terms with Operations Center, Mission, and Field Test. This prototype follows
   the rebaseline but does not rewrite the older canonical files.
2. `docs/05-lesson-design-system.md` points to the existing lesson schema, while
   the rebaseline says not to grow that schema by accumulation and requires domain
   boundaries to be learned through prototypes first. This lane therefore uses a
   local typed model only; it does not propose a canonical Mission schema.
3. The rebaseline describes a real-runtime direction as a gated hypothesis, while
   this lane explicitly permits scripted execution. The artifact labels that
   boundary and makes no runtime claim.
4. Issue #21, which is meant to lock learner-facing identity and language, remains
   open. The working vocabulary is allowed by issue #22, but all labels in this
   prototype remain provisional.
5. The First Contact specimen contains delayed and transfer evidence beyond a
   single session. This prototype reports only “First execution · Introduced” and
   does not claim mastery, retention, or transfer.

## Verification evidence

At tested prototype head `a5c32ec9e12a67b6b19426553b6bcd5b80ade1e8`:

- `npm test`: 4 test files, 19 tests passed;
- `npm run build`: TypeScript no-emit check and Vite production build passed;
- browser paths: both complete variants exercised at 1440×1000 and 390×844;
- keyboard path: Run, prediction, trace, repair, Field Test, Continue, Center
  transition, Stop, Resume, and Reset exercised or automated as appropriate;
- persistence: reload/revisit recovery verified independently for both variants;
- console: zero warnings or errors on the final inspected paths; and
- parity: automated check confirms both shells point to the same First Contact
  definition and differ only in entry/exit shell metadata.

Representative synthetic captures:

- `prototypes/experience-lab-0/artifacts/screenshots/direct-laptop-entry.jpg`
- `prototypes/experience-lab-0/artifacts/screenshots/direct-laptop-error.jpg`
- `prototypes/experience-lab-0/artifacts/screenshots/direct-laptop-debrief.jpg`
- `prototypes/experience-lab-0/artifacts/screenshots/operations-center-laptop-entry.jpg`
- `prototypes/experience-lab-0/artifacts/screenshots/operations-center-laptop-complete.jpg`
- five corresponding narrow-screen inspection captures in the same directory.

## Known limitations

- No real Python execution, editor integration, backend, account, or cross-device
  persistence is present.
- Local storage is a prototype convenience, not a production evidence store.
- The evaluator intentionally accepts only the authored examples needed here.
- Timing is local wall-clock instrumentation and has no learner sample yet.
- No learner, assistive-technology, delayed-retention, or return-behavior session
  has been run in this lane.
- The visual direction and working vocabulary are provisional.
- The prototype contains one complete Mission only. It does not validate recurring
  Center authoring across a Case or define the next Mission.
- Screenshot inspection cannot establish perceived quality, comprehension,
  motivation, desirability, or cognitive load.

## Lane conclusion

The controlled artifact and observation package are ready for owner and learner
comparison. The engineering record demonstrates that both routes are runnable,
matched, recoverable, keyboard-operable, responsive, and inspectable. Human
questions remain deliberately unanswered: no winner is selected, issue #22 stays
open, and no production architecture is declared.
