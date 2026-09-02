# Visual and interaction inspection record

**Prototype:** Experience Lab 0  
**Routes:** `/direct`, `/operations-center`  
**Browser:** Chrome through the browser-control lane  
**Laptop viewport:** 1440×1000  
**Narrow viewport:** 390×844 (375 CSS-pixel document width after scrollbar)  
**Data:** synthetic only

## Inspected states

### Variant A — Direct Mission

- first entry and first meaningful action;
- first execution and source-to-output Case response;
- personalized changed result;
- two-line prediction and text-equivalent trace;
- intentional unmatched quotation mark;
- Goal, Observed, Clue, and Next Action recovery packet;
- repaired result;
- fresh reduced-support Field Test;
- Debrief, honest capability evidence, restrained reward, and why-the-Case-changed explanation;
- compact next-action boundary;
- Stop, reload, resume, and reset behavior.

### Variant B — Operations Center + Mission

- initial Center with exactly one active Case, one available tool, one locked
  possibility, and one recommended Mission;
- keyboard transition into the same shared Mission;
- complete shared Mission path;
- changed Center with verified Case state, Investigation Console availability,
  one still-locked possibility, and the out-of-scope next-Mission preview;
- clean Stop and evidence-review routes.

## Checks and observations

| Check | Result |
|---|---|
| Horizontal clipping at 1440×1000 | none observed |
| Horizontal clipping at 390×844 | `scrollWidth` equaled `clientWidth` (375 px) |
| First dominant action, Variant A laptop | visible in the initial viewport after correction |
| First dominant action, Variant B laptop | visible in the initial viewport |
| Narrow action order | Console → current Encounter/action → Live Case Result |
| Keyboard activation | Run, prediction, trace, repair, Field Test, Continue, and hub transition exercised |
| Focus orientation | major shell and Debrief transitions focus the new heading and return to page top |
| Error tone | calm packet, no shake, alarm, lost progress, or color-only meaning |
| Console versus Case result | separately titled, structured, and screen-reader labeled |
| Reduced motion | OS-preference branch verified by automated `matchMedia` test and CSS inspection; text trace remains available |
| Browser console | zero warnings or errors in the final inspected path |
| Synthetic-data boundary | visible in app chrome and captures |

## Defects found and corrected during inspection

1. **Variant A first action below the laptop fold.** Reduced Mission top spacing
   and the Case glyph footprint without reducing content or visual quality.
2. **Full-page capture exposed the hidden skip link.** Changed its off-screen
   hiding method while preserving keyboard focus behavior.
3. **Debrief inherited the lower Field Test scroll position.** Major orientation
   transitions now focus the new heading and return immediately to the top.
4. **Narrow layout stacked the full Case result before the action.** Reordered
   the narrow Mission stack to Console → action → result while retaining the
   matched desktop composition.

## Representative captures

| Capture | Purpose |
|---|---|
| `screenshots/direct-laptop-entry.png` | Variant A first Mission state |
| `screenshots/direct-laptop-error.png` | calm error and recovery packet |
| `screenshots/direct-laptop-debrief.png` | honest evidence and restrained reward |
| `screenshots/operations-center-laptop-entry.png` | Variant B initial Center |
| `screenshots/operations-center-laptop-complete.png` | visibly changed Center |
| `screenshots/direct-narrow-entry.png` | narrow Variant A top hierarchy |
| `screenshots/direct-narrow-action.png` | narrow Console-to-action ordering |
| `screenshots/direct-narrow-error.png` | narrow recovery packet and action |
| `screenshots/operations-center-narrow-complete.png` | narrow changed Center header |
| `screenshots/operations-center-narrow-actions.png` | narrow Case and recommendation stack |

The captures document engineering inspection only. They do not contain or imply
learner observations, preferences, or a winning variant.
