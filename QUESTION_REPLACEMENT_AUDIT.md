# QUESTION REPLACEMENT AUDIT

## Samenvatting

- Replacementbron: `src/data/qualityReplacementQuestions.ts`.
- Centrale merge: `src/data/questions.ts`.
- Replacements totaal: 68.
- Unieke replacement IDs: 68.
- Effectief gekoppeld aan bestaande bronvraag: 68.
- Orphan replacements: 0.
- Duplicate replacement IDs: 0.

## Integratiepunt

`src/data/questions.ts` bouwt eerst `baseQuestions` uit de gewone bronnen en maakt daarna:

```ts
const replacementById = new Map(qualityReplacementQuestions.map((question) => [question.id, question]));
```

Daarna wordt elke bronvraag op hetzelfde `id` vervangen voordat `enhanceQuestion` draait:

```ts
const active = replacementById.get(question.id) ?? question;
return enhanceQuestion(...active...);
```

Daardoor krijgen replacements dezelfde hints, common mistakes en UI-afhandeling als gewone vragen.

## Routecontrole

| Route | Gebruikt centrale `questions`? | Effect voor replacements |
|---|---:|---|
| Gewone oefenmodus `src/pages/Practice.tsx` | ja | filters en vraagkaart gebruiken vervangen vraagobject |
| Module/topic/skill filter `src/utils/questionFilters.ts` | ja | filtert op vervangen vraagobjecten |
| Practice scheduler `src/utils/practiceScheduler.ts` | ja, via aangeleverde vraaglijst | bewaart alleen IDs; oude decks worden gesaneerd tegen actuele IDs |
| Toetsmodus `src/pages/TestMode.tsx` | ja | official/random/priority/challenge/leerdoelentoets gebruiken replacements |
| Officiële oefentoets `officialPracticeTest` | bewust apart | niet via replacements; relevante visuals direct opgeschoond |
| Leerdoelenpagina `CoverageChecklist` | ja | objective question IDs zoeken in centrale vraagmap |
| Foutenlog `MistakeLog` | ja | oude fout-ID opent huidig vervangen vraagobject |

## Duplicate Cleanup

Vóór deze QA-pass stonden vijf verouderde duplicate replacement-records in `qualityReplacementQuestions.ts`:

- `priority-m8-01`
- `priority-m8-02`
- `priority-m8-08`
- `priority-m8-10`
- `priority-m8-14`

Deze werkten functioneel door `Map`-gedrag, maar waren audit-onvriendelijk. De oude duplicaten zijn verwijderd; de verbeterde actieve records blijven staan.

## Orphan Check

De replacement IDs zijn vergeleken met vraagblokken uit:

- `src/data/questions.ts`
- `src/data/priorityQuestions.ts`
- `src/data/figureQuestions.ts`
- `src/data/coverageQaQuestions.ts`
- `src/data/extendedQuestions.ts`

Resultaat: 0 orphan replacements.

## Conclusie

Replacements zijn centraal geïntegreerd en worden gebruikt door de normale oefenroutes, modulefilters, toetsmodus, leerdoelenkoppeling en reviewroutes die de centrale `questions`-export gebruiken.
