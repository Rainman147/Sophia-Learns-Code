# Experience Identity, UI, Motion, Graphics, and Media System

**Status:** canonical supporting authority  
**Date:** 2026-09-01  
**Parent vision:** `VISION.md`

## 1. Purpose

A polished experience is not created by collecting attractive components, animations, badges, illustrations, and videos. It is created when every layer appears to belong to the same world, supports the same learner action, and obeys the same design logic.

This document defines that logic before large amounts of UI or media are produced.

## 2. Experience pillars

### Investigative precision

The interface reveals relationships, state, sequence, and evidence. Visual polish must improve understanding rather than conceal it.

### Calm futurism

The Operations Center feels modern and capable without relying on green code rain, excessive neon, fake terminal noise, or movie-hacker imagery.

### Earned discovery

The experience withholds answers, not basic orientation. The learner feels rewarded for noticing, predicting, testing, repairing, and building.

### Human warmth

The product is not a cold assessment machine. It uses clear language, forgiving recovery, restrained humor, and honest encouragement.

### Progressive professionalism

The opening workspace is simple. As capability grows, the visual language matures toward real editors, files, tests, data tools, and Git workflows.

## 3. One identity across every layer

The following must feel related:

- landing and Operations Center;
- mission briefing;
- code editor;
- output and case scene;
- Computer's Mind trace;
- error feedback;
- mastery map;
- badges and unlocks;
- Case Archive;
- tutorial video;
- sound cues;
- email or reminder surfaces later; and
- professional workspace transition.

Cohesion comes from shared tokens, vocabulary, interaction principles, motion grammar, illustration rules, and semantic events. It does not come from placing the same logo in every corner.

## 4. Canonical experience vocabulary

Use the terms in `VISION.md` consistently. In the initial product:

```text
Operations Center
Case
Mission
Encounter
Lab
Investigation Console
Computer's Mind
Debrief
Field Test
Capability Map
Case Archive
Side Mission
```

Do not freely alternate among chapter, level, quest, checkride, module, lesson, and mission in learner-facing UI. Internal implementation names may differ when necessary, but the boundary is explicit.

## 5. Visual identity direction

The working direction is **evidence-luminous investigation**:

- quiet dark or light work surfaces rather than an always-dark hacker cave;
- focused illumination around active evidence and changing state;
- crisp typography and generous spacing;
- diagrams that resemble living analytical instruments;
- restrained depth and atmospheric texture;
- icons that communicate function before decoration;
- adult geometric illustration rather than cartoon mascots; and
- a controlled accent system that can distinguish action, evidence, success, caution, error, mastery, and locked possibility without depending on color alone.

Exact colors, fonts, illustration style, and logo are not locked by this document. They require visual exploration and learner review.

## 6. Design-token architecture

Before producing many screens, define a small token system.

### Foundational tokens

- typography families and scale;
- spacing scale;
- corner and border language;
- elevation and surface hierarchy;
- focus-ring treatment;
- icon sizes;
- motion duration and easing roles;
- semantic color roles;
- opacity and disabled-state rules;
- content widths; and
- responsive breakpoints.

### Semantic tokens

Avoid component-specific values where a meaning exists:

```text
surface.workspace
surface.evidence
surface.overlay
text.primary
text.supporting
action.primary
evidence.new
evidence.changed
feedback.success
feedback.caution
feedback.error
mastery.guided
mastery.independent
mastery.durable
unlock.available
focus.visible
```

Every semantic state also needs an icon, label, shape, position, or text treatment so color is not the sole carrier.

### Component contracts

Core components should consume tokens rather than invent their own visual dialect:

- mission header;
- objective card;
- code surface;
- console result;
- evidence card;
- trace step;
- feedback packet;
- hint reveal;
- badge stage;
- unlock card;
- case timeline;
- Operations Center station; and
- Case Archive artifact.

## 7. Information hierarchy

At every mission state, the learner should be able to answer:

1. What am I trying to learn or accomplish?
2. What can I act on now?
3. What happened after my last action?
4. Where can I inspect more deeply?
5. How can I get help or stop?

The screen should have one dominant primary action. Secondary panels appear contextually rather than remaining permanently open.

### Mission workspace

```text
Mission identity and objective
────────────────────────────────────────
Primary code or puzzle surface
Relevant result or evidence surface
────────────────────────────────────────
Coach and primary action
Contextual trace, tests, or feedback
```

### Operations Center

```text
Recommended next action and reason
Active case and current artifact
Capability Map slice
Available tools and meaningful unlocks
Review or wake-up signal
Case Archive
```

The hub is not a dashboard of equal-weight cards. Recommendation, active case, and progress explanation lead the hierarchy.

## 8. Motion grammar

Motion is part of the explanatory language. Each animation is assigned one job.

### Causal motion

Shows that one action produced another state.

Examples:

- source line highlights, then a value travels conceptually to output;
- a condition evaluates, then the selected branch and case outcome update;
- a repaired line removes the error marker and restores the scene;
- a test passes, then the investigative tool calibrates.

Causal motion may be replayed or stepped through. It must match actual execution order.

### Orienting motion

Preserves spatial context when the interface changes.

Examples:

- an evidence card moves from unreviewed to review rather than disappearing and reappearing;
- an Operations Center tool expands into its Lab;
- a mission card becomes the mission header through a shared transition.

### Feedback motion

Acknowledges a direct action without stealing focus.

Examples:

- Run depresses and enters a clear executing state;
- a prediction locks in;
- changed values pulse once;
- a hint drawer opens without shifting the editor unexpectedly.

### Reward motion

Marks meaningful progress proportionally.

Examples:

- a badge stage gains a new ring;
- a tool station powers on;
- the case artifact slides into the archive;
- a case completion reveals the next route.

Routine success receives a brief response. Durable mastery or a completed case may receive a richer reveal, but no animation should block the next action.

### Ambient motion

Creates atmosphere only when it does not compete with reading, editing, or trace inspection.

Examples:

- a slow background instrument sweep;
- a subtle active-system signal;
- restrained depth movement in the Operations Center.

Ambient motion pauses during errors, focused coding, reduced-motion mode, or low-power preference.

## 9. Motion timing hypotheses

Initial prototypes should test, not blindly standardize, these ranges:

- immediate control response: within roughly 100 milliseconds;
- small UI feedback: roughly 120 to 220 milliseconds;
- panel and shared-layout transition: roughly 180 to 350 milliseconds;
- causal instructional sequence: learner-controlled or roughly 300 to 900 milliseconds per meaningful step;
- routine reward: under roughly one second;
- major case reward: roughly one to two seconds, skippable;
- live-code debounce: enough to avoid running during normal typing, measured in the runtime spike.

Perceived responsiveness matters more than decorative smoothness. If an animation delays interpretation, shorten or remove it.

## 10. Reduced motion and accessibility

The reduced-motion path is a first-class design, not an animation-off afterthought.

- Replace large transforms and parallax with opacity, outline, and state emphasis.
- Preserve causal sequence through step labels and changed-state markers.
- Do not autoplay ambient or tutorial video.
- Expose play, pause, replay, and skip controls.
- Announce meaningful execution and error state changes through appropriate live regions.
- Preserve focus location through transitions.
- Never use flashing, violent shaking, or rapid repetitive effects.
- Provide a semantic text representation of every instructional animation.

Reference: https://motion.dev/docs/react-accessibility and https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API.

## 11. Graphics implementation layers

Use the simplest layer that can express the required behavior.

### Layer 1: HTML and CSS

Use for text, controls, panels, cards, focus states, layout, and ordinary UI transitions. This provides the strongest accessibility and responsiveness baseline.

### Layer 2: semantic SVG

Use for evidence maps, flow diagrams, timelines, relationships, state links, and illustrations whose parts need labels or interaction.

### Layer 3: Motion for React or equivalent

Use as the leading candidate for layout transitions, shared-element movement, gestures, changed-state emphasis, and reduced-motion policy.

Reference: https://motion.dev/docs/react-layout-animations.

### Layer 4: Rive experiment

Use Rive only for selected interactive vector assets where a designer-authored state machine produces clear value, such as:

- one evolving Operations Center instrument;
- an animated tool activation;
- a reusable status illustration; or
- a responsive case emblem.

Rive must receive semantic state from the application. It must not own mission truth or inaccessible controls.

Reference: https://rive.app/docs/runtimes/react/react and https://rive.app/docs/runtimes/web/state-machines.

### Layer 5: GSAP experiment

Evaluate GSAP only when a complex, precisely choreographed timeline cannot be expressed cleanly through the baseline motion system. Avoid running two general-purpose animation systems across ordinary components.

Reference: https://gsap.com/docs/v3/GSAP/Timeline/.

### Layer 6: PixiJS or Phaser gate

Do not include a canvas game framework in the initial stack. Evaluate one only if the persistent game layer requires capabilities such as:

- a continuous scene with many animated objects;
- camera movement;
- sprite systems;
- particles or effects beyond a few decorative elements;
- physics; or
- a measured rendering bottleneck.

A canvas world creates a second input, layout, rendering, testing, and accessibility system. It must earn that cost.

References: https://pixijs.com/8.x/guides/components/renderers and https://docs.phaser.io/.

## 12. View transitions

The browser View Transition API may help preserve context between hub, case, and mission views. It became broadly available across newer browsers but still requires feature detection and a non-animated fallback.

Use it for navigation continuity, not execution-state instruction.

Reference: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API.

## 13. Sound system

Sound is optional and sparse.

Sound roles:

- control acknowledgment;
- successful execution;
- tool activation;
- meaningful case progression;
- quiet attention cue.

Rules:

- muted or minimal by default after onboarding;
- separate volume and mute control;
- no alarm-like error sound;
- no sound required to understand state;
- no continuous soundtrack during focused coding by default;
- no reward sound on every trivial action; and
- respect operating-system and learner preferences.

Audio should share the same emotional vocabulary as motion: precise, restrained, warm, and technical.

## 14. Tutorial-media system

Tutorial media should feel like a movable part of the application, not a foreign video player dropped into it.

### Media jobs

Use video or narrated animation when it adds something text and direct manipulation cannot provide efficiently:

- show execution order over time;
- demonstrate a professional workflow;
- explain a spatial or dynamic mental model;
- introduce a complex case dataset;
- model debugging thought; or
- compare two strategies.

### Micro-tutorial anatomy

```text
5–15 sec   question or visible problem
20–90 sec  compact explanation or demonstration
pause      prediction or manipulation
20–90 sec  consequence and explanation
immediate  code action or transfer task
```

Most clips should be roughly thirty seconds to three minutes. Longer videos require chapters and interaction points.

### Required media features

- captions;
- searchable transcript;
- playback speed;
- keyboard control;
- no essential audio-only information;
- learner-controlled replay;
- synchronized code snapshot;
- poster frame and static alternative;
- reduced-motion behavior; and
- immediate interaction after viewing.

### Production candidates

- ordinary edited video for human explanation;
- application-rendered animated diagrams;
- Rive for short interactive vector explanations;
- Remotion as a candidate for programmatic, token-driven micro-videos built from React components.

Remotion could help reuse code panels, typography, motion tokens, and case graphics between the app and rendered video. Its current licensing and production workflow must be reviewed before adoption.

Reference: https://www.remotion.dev/ or the current official documentation.

## 15. Shared app and media components

Where practical, create platform-neutral visual primitives that can appear in the application, prototype, screenshot, and video:

- code line;
- execution cursor;
- value card;
- evidence card;
- branch path;
- loop step;
- timeline event;
- test result;
- badge stage;
- Operations Center station; and
- case title card.

Do not force runtime application components directly into a video pipeline if that creates coupling. Share tokens, vector assets, and semantic scene descriptions first.

## 16. Asset pipeline

Before producing many assets, define:

- source format;
- editable source location;
- export format;
- naming and version rules;
- dark, light, and high-contrast variants;
- reduced-motion variant;
- localization constraints;
- ownership and license;
- compression and loading budget;
- semantic alt text or description; and
- fallback when the asset fails to load.

Generated or purchased assets require a provenance ledger. Do not copy proprietary course art, game UI, icon sets, videos, or animations without valid rights.

## 17. Performance budgets

The visual experience must remain fast on a representative student laptop.

Prototype and measure:

- time to first useful interaction;
- runtime initialization without blocking the shell;
- input latency while editing;
- animation frame stability;
- asset decode and memory cost;
- Operations Center idle CPU and battery use;
- reduced-data behavior;
- failure when an optional animation asset is unavailable; and
- cumulative weight of fonts, icons, motion libraries, Rive or Lottie files, and video.

Atmosphere is optional. A responsive editor is not.

## 18. Creative-direction prototype set

Before locking a visual language, create three deliberately different but product-faithful directions:

### Direction A: Analytical Noir

Evidence-board focus, restrained atmosphere, high contrast, minimal ornament.

### Direction B: Luminous Operations Lab

Brighter scientific workspace, transparent instruments, animated data movement, inviting energy.

### Direction C: Precision Field Console

More professional and utilitarian, with richer tools gradually revealed and a stronger bridge to real development software.

Each direction must show the same states:

- Operations Center;
- mission workspace;
- code-to-result causality;
- prediction;
- error and recovery;
- badge evolution;
- tool unlock; and
- reduced-motion equivalent.

Evaluate comprehension, emotional response, perceived age appropriateness, desire to continue, and implementation cost. Do not choose from a mood board alone.

## 19. Cohesion review

Every vertical slice receives this review:

### Identity

- Does every term belong to the same product language?
- Does the screen feel adult and purposeful?
- Does the case context help the code matter?

### Interaction

- Is one action dominant?
- Does the result clearly follow the action?
- Can the learner stop, retry, and recover?

### Visual system

- Are tokens reused?
- Are surfaces and hierarchy consistent?
- Is instructional emphasis stronger than decoration?

### Motion and sound

- Does each effect have a named job?
- Does it reflect semantic state?
- Is it skippable or reduced appropriately?

### Media

- Does video add information unavailable through direct interaction?
- Does it look and sound like the same product?
- Is the learner asked to act immediately afterward?

### Learning

- Did polish make the mental model clearer?
- Did the game increase meaningful experimentation?
- Did delayed and transfer evidence remain strong?

A slice fails cohesion when its parts are individually attractive but the learner cannot tell what matters, what changed, or why it belongs in the case.
