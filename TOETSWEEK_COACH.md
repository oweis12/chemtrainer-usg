# AXIOM — Toetsweek Coach

A deliberately separate learning experience on \`/toetsweek/\`, hosted in the existing ChemTrainer Vite repository, using source-aligned M10/M11 skill chains. **No school text or answer documents are published.** Original questions only, with pointers to schoolbook sections.

## What works without a server
- Local, versioned progress (browser localStorage) and JSON export/import.
- 8-item initial screen, using one introductory anchor per chain.
- Source-aligned method sequences for M10 §4 and §6, M11 practica 1–6 (special note: §6.5 excluded, §6.1/6.2 reading-only per previously known plan).
- 32 original conceptual, numerical and transfer exercises; structured hint ladder; answer comparison; optional strict self-evaluation for explanation questions.
- Scoring only for correct independent first attempts; hint use and retry are tracked separately.
- 120-minute active study-time budget tracking (browser-tab foreground, study mode only), error queue, postponed review, focus-map, exam mode and progress reporting.

## Important scope and limitations
- This is a **functional first version**, not a complete digitization of the books. The exercise set is a starting pool, not a full VWO chemistry assessment.
- A green card is a single independent item passed, **not a predicted grade**.
- Open-ended offline self-scoring relies on student honesty; there is no arbitrary "AI grading" without a configured server.
- Multi-device sync is not provided; use the JSON export/import.
- AI is optional and server-side only; the online coach is usable without it.

## Optional AI service (Vercel serverless)
The \`api/coach-feedback.mjs\` endpoint uses the OpenAI Responses API. Configure Vercel environment variables (never embed keys in frontend):
- \`OPENAI_API_KEY\`: API key for the server.
- \`COACH_ACCESS_CODE\`: a private user-selected access code; sent via X-Coach-Code.
- \`OPENAI_MODEL\`: optional, e.g. \`gpt-4.1-mini\`.

The endpoint is disabled (503 with friendly guidance) when env vars are absent. The UI can always copy a prompt for ChatGPT. API exposure should be restricted to private/student access if the site is publicly available.

## QA checklist
1. Build the Vite project: \`npm ci && npm run build\`.
2. Open \`/toetsweek/\`; verify the AXIOM UI is isolated from ChemTrainer and scales on mobile.
3. Start the 8-item assessment; submit a correct and incorrect answer, reload, verify persistence.
4. A hinted answer must not increase independent mastery; a failed answer must not repeat as the next question.
5. Navigate the learning chain, switch focus to M11 P4, enter an explanation, compare model and mark rubric.
6. Use number input for \`4,0e-6\`, verify numerical tolerance and units, including pH sig figs.
7. Export local progress, reset, import the JSON; verify it restores.
8. Test the 2-hour active timer (foreground question only); background tabs must pause it.
9. Without API env vars: AI endpoint should return 503; copy-to-ChatGPT should work.
10. With API env vars, verify authorized requests and rejection for wrong codes, invalid payloads, non-POST methods.

## Architecture
Public assets: \`public/toetsweek/index.html\`, \`coach.css\`, \`engine.js\`, \`app.js\`.
Optional backend: \`api/coach-feedback.mjs\`.
All source-aligned exercise content sits in \`engine.js\` so no public schoolbook PDFs or answer documents are required.
