# ChemTrainer USG — design QA

## Comparison evidence

- **Source visual truth:** `/Users/kanakri/.codex/generated_images/019ef130-0034-7cb2-83d9-aba2b69672ed/exec-0281fe0b-d19c-40f8-a6be-aea8d466583b.png` (selected *Nachtkatern* dashboard).
- **Implementation screenshot:** `/private/tmp/chemtrainer-dashboard-dark-desktop.png`.
- **Full-view comparison:** `/private/tmp/chemtrainer-dark-comparison.png` (reference and implementation stitched side by side and visually inspected).
- **Viewport/state:** 1440 × 1024; dashboard; dark mode; non-empty local progress state.
- **Focused checks:** dashboard hero + sidebar + seven-module register were evaluated from the same desktop state. A 390 × 844 mobile dashboard capture was also checked for navigation, touch targets, card stacking, and bottom navigation.

## Findings

No actionable P0, P1, or P2 findings.

- [P3] The source mock uses a fuller desktop rail with more secondary destinations, while the implementation limits the rail to the five requested app areas. This is intentional scope reduction; it keeps the navigation cleaner and preserves the required learn/practice/test/error separation.
- [P3] The live dashboard grows vertically when weak topics and history are present. This is expected product behavior and is contained by responsive sections rather than fixed-height clipping.

## Required fidelity surfaces

- **Fonts and typography:** Source Serif 4 supplies the editorial display hierarchy; Inter handles interface copy; IBM Plex Mono is used for registers, values, formulas, and metadata. Headline scale, condensed line-height, and small uppercase labels match the selected exam-booklet direction.
- **Spacing and layout rhythm:** The implementation preserves the fixed left rail, ruled top header, large left-aligned study focus, concise right study overview, horizontal M4–M10 register, fine dividers, and low-radius surfaces. Desktop and mobile layouts have been checked without overlap or clipped controls.
- **Colors and visual tokens:** Light paper / cobalt / amber / green / vermilion tokens and the dark charcoal / muted cobalt *Nachtkatern* tokens are defined centrally in `src/styles.css`. The theme switch changes the full system and persists locally.
- **Image quality and asset fidelity:** The selected design uses no photographic or custom illustration assets. Interface symbols are rendered with the Phosphor icon library, with a consistent line/duotone treatment; no placeholder imagery or handcrafted SVG assets are used.
- **Copy and content:** All primary product copy is Dutch and reflects the requested VWO/HAVO chemistry workflows. Lesson, formula, question, answer, error-log, and test states use coherent domain terms.
- **States and interactions:** Verified the light/dark switch, practice filters, a calculation answer with immediate practice feedback, test mode’s feedback-free answer capture, post-submit analysis, local progress/error updates, and mobile navigation.
- **Accessibility:** Native buttons, radios, selects, text areas, semantic headings, labels for practice filters, and visible keyboard focus styling are present. The mobile bottom bar uses broad, separated touch targets.

## Patches made since the previous QA pass

- Added explicit `for`/`id` associations to practice filters after browser verification exposed absent accessible labels.
- Corrected the expected answer for M10-17: `5,83%`.

## Implementation checklist

- [x] Selected dashboard hierarchy implemented in light and dark modes.
- [x] Responsive desktop and mobile navigation implemented.
- [x] Core learning, practice, test, feedback, progress, and errors flows functionally verified.
- [x] Source/implementation same-state visual comparison completed.

## Follow-up polish

- Consider adding optional individual lesson illustrations or a printable worksheet export only if those become a future product requirement.

**final result: passed**
