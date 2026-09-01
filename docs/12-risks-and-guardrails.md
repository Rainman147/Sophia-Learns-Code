# Risks and Guardrails

## 1. Purpose

This project combines education, untrusted code execution, AI tutoring, cybersecurity, financial analysis, gamification, and personal learner data. Each ingredient is useful. Together they form a lively little risk octopus.

This document names the tentacles before they grab the architecture.

## 2. Risk scale

- **Likelihood:** Low, Medium, High
- **Impact:** Low, Medium, High, Critical
- **Status:** Monitor, Mitigate, Blocker, Accepted

## 3. Risk register

| Risk | Likelihood | Impact | Early signal | Primary guardrail |
|---|---:|---:|---|---|
| Completion illusion | High | High | Lessons pass but blank-editor performance fails | Require independent, delayed, and transfer evidence |
| Hidden beginner prerequisites | High | High | Learner hesitates on editor, files, punctuation, or Run | Observe first sessions; teach interface and concepts explicitly |
| Cognitive overload | High | High | Random edits, panel avoidance, inability to state goal | Segment, reduce visible state, coordinate representations |
| Over-scaffolding | High | High | Learner waits for hints or copies patterns | Adaptive fading and no-hint parallel tasks |
| Under-scaffolding | Medium | High | Long unproductive stuckness and abandonment | Recovery ladder and direct-explanation escape hatch |
| Gamification displaces learning | Medium | High | XP farming, speed chasing, shallow repeats | Rewards tied to evidence; remove mechanics that distort behavior |
| Streak shame | Medium | Medium | Missed day leads to avoidance | Streakless momentum and return-friendly review |
| Childish tone | Medium | Medium | College learner disengages or feels patronized | Adult investigation aesthetic and learner tone testing |
| Narrative overload | Medium | Medium | More reading than coding | Narrative word budgets and action-density rule |
| AI answer dependence | High | High | Learner asks tutor before attempting; copies output | Hint ceilings, support labels, parallel recovery task |
| AI hallucinated runtime claims | Medium | High | Tutor disagrees with tests or trace | Deterministic authority and structured grounding |
| AI privacy leakage | Medium | Critical | Secrets or personal data sent to model | Redaction, minimal context, provider controls, no-AI path |
| Academic-integrity conflict | High | High | Ready-to-submit assignment solutions | Integrity mode, alternate examples, attempt-centered support |
| Unsafe cyber assistance | Medium | Critical | Real targets, credentials, payload or evasion requests | Defensive scope, authorization checks, controlled labs, refusal path |
| Financial overclaim | Medium | High | Anomaly presented as proof of fraud | Required uncertainty language and interpretation rubrics |
| Sandbox escape | Low/Medium | Critical | Unexpected process, network, or filesystem access | Ephemeral isolation, limits, no secrets, no network by default |
| Browser runaway code | High | Medium | Frozen interface or memory spike | Web Worker, timeout, cancellation, worker replacement |
| Cross-learner data access | Low/Medium | Critical | Authorization mismatch | Server-side authorization, tenant boundaries, security tests |
| Sensitive student data in public repo | Medium | Critical | Raw logs, grades, transcripts, or recordings committed | Public/private data policy, review, secret scanning |
| Accessibility exclusion | Medium | High | Key task unavailable without pointer, color, motion, or audio | Equivalent interaction paths and accessibility release gates |
| Overfitting to Sophia | High | Medium | Design works only with one preference or background | Expand to varied novices after initial stability |
| Family-pressure effect | Medium | High | Learner participates to satisfy parent rather than learn | Consent, learner control, mentor boundaries, easy stop |
| Building infrastructure before pedagogy | High | High | Framework work outpaces tested lessons | Vertical-slice gates and learner observation before generalization |
| Content quality drift | Medium | High | Broken tests, inconsistent terminology, weak hints | Versioned schema, CI, review checklist, immutable releases |
| Dependency or supply-chain compromise | Medium | Critical | Malicious package or compromised build | Pinning, scanning, provenance, least privilege |
| License contamination | Medium | High | Copied lesson/code without compatible terms | Dependency ledger and legal/license review |
| Vendor lock-in | Medium | Medium | Tutor/runtime behavior tied to one provider | Product-owned contracts and replaceable adapters |
| Cost growth | Medium | High | AI or sandbox usage rises faster than learning value | Browser-first runtime, budgets, caching, model routing |
| Metrics become surveillance | Medium | High | Collection of raw keystrokes or private behavior without need | Data minimization and purpose review for every event |
| Speed mistaken for mastery | Medium | Medium | Fast typists rank above careful reasoners | Separate fluency from correctness and explanation |
| Learner cannot leave platform | Medium | High | Strong in guided UI, weak in local tools | Planned transition to files, terminal, VS Code, Git, and pytest |

## 4. Pedagogical guardrails

### Evidence over activity

Never label a capability mastered from video completion, page completion, or a single recognition item.

### One main learning target

A lesson should not introduce several unrelated concepts because the example code happens to need them.

### Support is reversible

Scaffolding can return after a misconception. Progress is not a one-way animation.

### Errors remain useful

Feedback describes expected and observed behavior. It never mocks, alarms, or implies inability.

### Transfer is required

Important skills appear in changed contexts. Surface repetition alone cannot close a capability.

### The platform teaches exit skills

Files, local execution, Git, tests, and independent projects are curriculum requirements.

## 5. Gamification guardrails

Prohibited by default:

- loot boxes;
- randomized reward scarcity;
- paid progression advantages;
- loss of earned learning access;
- public rank as the main motivator;
- countdown pressure unrelated to the skill;
- broken-streak shame;
- dark patterns that make stopping difficult;
- points for meaningless clicks; and
- celebrations that obstruct reasoning or accessibility.

Allowed only with explicit mechanism and test:

- capability badges;
- optional cosmetic unlocks;
- mission narrative;
- private personal-best fluency challenges;
- mentor celebrations;
- hidden easter eggs; and
- progression maps.

Every mechanic has a removal condition.

## 6. AI guardrails

- Runtime and tests outrank model claims.
- Model output is schema-validated.
- Authored hint ceilings constrain solution reveal.
- Full reveal changes evidence classification.
- Generated examples must execute and pass generated tests before display.
- Sensitive information is redacted before routing.
- A deterministic, no-AI lesson path remains available.
- Tutor uncertainty is visible.
- Prompt injection inside learner code or datasets is treated as untrusted content.
- Model providers remain replaceable.
- Tutor policy and evaluation versions are recorded.

## 7. Code-execution guardrails

### Browser

- run in Web Worker;
- enforce time and snapshot bounds;
- permit cancellation;
- replace poisoned workers;
- allowlist packages;
- never expose application credentials; and
- limit file and browser API access through the execution protocol.

### Remote

- ephemeral container or microVM;
- non-root;
- resource quotas;
- network disabled by default;
- immutable base;
- no host mounts or cloud credentials;
- file validation;
- process limits;
- destruction after use; and
- regular adversarial testing.

## 8. Cybersecurity guardrails

The curriculum can teach real security reasoning while enforcing authorization and containment.

### Safe domains

- secure coding;
- log analysis;
- file integrity;
- indicator extraction;
- threat-intelligence normalization;
- detection engineering;
- incident response;
- controlled CTF challenges;
- inert or synthetic artifact analysis; and
- defensive automation.

### Restricted domains

Requests involving real unauthorized targets, credential theft, destructive payloads, persistence, evasion, uncontrolled malware, or harmful operationalization require refusal or transformation into a safe synthetic lab.

### Dataset policy

- synthetic by default;
- public and appropriately licensed where not synthetic;
- no stolen data;
- no real credentials;
- no unnecessary personal data; and
- explicit provenance and allowed use.

## 9. Financial-forensics guardrails

- Use decimal-safe monetary handling where precision matters.
- Label examples as synthetic.
- Distinguish anomaly, red flag, candidate, evidence, and conclusion.
- Require documentation of false positives and alternative explanations.
- Do not claim that statistical screening proves fraud.
- Protect real financial records as highly sensitive.
- Avoid advice that crosses into unqualified legal or accounting conclusions.
- Teach reproducibility and audit trails.

## 10. Academic-integrity guardrails

- Ask whether material is active graded work when signals warrant it.
- Permit explanation, alternate examples, tests, and review of attempts.
- Restrict complete ready-to-submit solutions when course policy is unknown or forbids them.
- Make assistance levels visible to the learner.
- Preserve the learner’s final implementation decisions.
- Never fabricate work history, citations, outputs, or collaboration.

## 11. Privacy guardrails

### Data minimization

Every collected field must have a declared learning, safety, or operational purpose.

### Learner control

Provide understandable controls for:

- AI use;
- mentor sharing;
- analytics participation where applicable;
- export;
- deletion; and
- recording consent.

### Public repository boundary

Only public-safe product, content, and anonymized research summaries belong here.

### Retention

Define retention before collection. “We may need it someday” is not a purpose.

## 12. Accessibility guardrails

- Keyboard completion for every core interaction.
- Semantic controls and screen-reader labels.
- Text equivalent for execution visualizations.
- Captions and transcripts.
- Reduced motion.
- No color-only meaning.
- Adjustable text and layout.
- Untimed equivalent when speed is not the construct.
- Focus order and error announcements tested.
- Accessibility included in content schema and release gates.

## 13. Learner-wellbeing guardrails

- Never infer or display psychological diagnoses.
- Do not use guilt, fear, or social humiliation to increase engagement.
- Allow clean stopping points.
- Normalize forgetting and review.
- Provide a direct-explanation option when questioning becomes frustrating.
- Keep mentor sharing learner-controlled.
- Do not send family notifications framed as failure.

## 14. Content and licensing guardrails

- Source every borrowed asset and code dependency.
- Record license, version, modifications, and notice requirements.
- Do not copy proprietary lessons or art.
- Test all code examples.
- Review AI-generated content for accidental reproduction.
- Keep reference solutions and tests versioned.
- Choose the repository license deliberately before accepting external contributions.

## 15. Operational incident categories

### Severity 1: critical

Examples: cross-learner data exposure, sandbox escape, credential exposure, harmful cyber operationalization.

Actions:

- disable affected capability;
- preserve minimal forensic evidence;
- revoke credentials;
- notify appropriate owners and users;
- remediate and independently review; and
- document a public-safe postmortem where appropriate.

### Severity 2: high

Examples: tutor repeatedly reveals graded solutions, inaccessible release blocker, corrupted mastery history.

Actions:

- halt affected rollout;
- repair data or behavior;
- notify impacted learners where relevant; and
- add regression evaluation.

### Severity 3: normal product defect

Examples: broken hint, incorrect diagram, excessive celebration, confusing wording.

Actions:

- create issue;
- correct and validate;
- review whether evidence was affected.

## 16. Pre-release checklist

- Are lesson objectives and prerequisites explicit?
- Do reference solutions and misconception variants run?
- Can the learner recover without AI?
- Does AI remain grounded in deterministic evidence?
- Is code execution isolated and bounded?
- Is all lesson data synthetic or authorized?
- Are cyber and financial claims appropriately qualified?
- Can every interaction be completed accessibly?
- Is learner data separated from the public repository?
- Are sharing and consent controls understandable?
- Are licenses recorded?
- Has a real learner been observed?
- Has delayed performance been checked?

## 17. Escalation rule

When a feature creates tension between engagement and learner agency, between convenience and privacy, or between realism and safety, choose agency, privacy, and safety until evidence and controls justify another path.
