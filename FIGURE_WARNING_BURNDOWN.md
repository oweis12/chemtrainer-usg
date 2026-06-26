# FIGURE WARNING BURNDOWN

## Samenvatting

- Validator: `node scripts/validateFigureQuestionQuality.mjs`.
- Warnings vóór: 65.
- Warnings na: 0.
- High-priority warnings gefixt: alle.
- Medium warnings gefixt: alle.
- Bewust geaccepteerd: 0.

## Acties

- Visuals zonder `purpose` voorzien van expliciet doel.
- Vragen met visual expliciet laten verwijzen naar figuur, schema, spectrum of chromatogram.
- Modelantwoorden zonder duidelijk eindantwoord aangescherpt.
- Decoratieve visuals bij oefenvragen verwijderd of vervangen door native oefendiagrammen.
- GC/MS-oefenvragen waar nodig omgezet naar `QuestionGcChromatogram` of `QuestionMassSpectrum`.
- Officiële oefentoetsfiguren direct opgeschoond omdat die route bewust niet door replacements loopt.

## Burndown Per Vraag

| Vraag id | Module | Warningtype(s) | Ernst | Actie |
|---|---|---|---|---|
| priority-m10-02 | M10 | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m10-03 | M10 | purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | high | gefixt |
| priority-m8-16 | M8 | purpose ontbreekt | medium | gefixt |
| priority-m8-17 | M8 | purpose ontbreekt | medium | gefixt met native spectrum |
| priority-m8-21 | M8 | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m8-22 | M8 | purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | high | gefixt met native spectrum |
| priority-m8-23 | M8 | purpose ontbreekt | medium | gefixt met native spectrum |
| priority-m8-24 | M8 | purpose ontbreekt | medium | gefixt |
| priority-m8-27 | M8 | purpose ontbreekt | high | decoratieve visual verwijderd |
| priority-m8-29 | M8 | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt met native spectrum |
| priority-m8-33 | M8 | purpose ontbreekt | medium | gefixt met native spectrum |
| priority-m8-36 | M8 | purpose ontbreekt; geen expliciete figuurverwijzing | high | gefixt met native spectrum |
| priority-m5d-19 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | medium | gefixt |
| priority-m5d-22 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | medium | gefixt |
| priority-m5d-24 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m5d-27 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m5d-35 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m8-03 | M8 | replacement purpose ontbreekt; geen expliciete figuurverwijzing | high | gefixt met native spectrum |
| priority-m8-04 | M8 | replacement purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | high | gefixt met native spectrum |
| priority-m8-07 | M8 | replacement purpose ontbreekt; geen expliciete figuurverwijzing; modelantwoord niet expliciet | high | gefixt met native spectrum |
| priority-m8-09 | M8 | replacement purpose ontbreekt; modelantwoord niet expliciet | high | gefixt |
| priority-m5d-01 | M5D | replacement purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| priority-m5d-04 | M5D | replacement purpose ontbreekt | medium | gefixt |
| priority-m5d-05 | M5D | replacement purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| figure-m6-01 | M6 | purpose ontbreekt | low | gefixt |
| figure-m6-02 | M6 | purpose ontbreekt | low | gefixt |
| figure-m6-03 | M6 | purpose ontbreekt | low | gefixt |
| figure-m9-01 | M9 | purpose ontbreekt | low | gefixt |
| figure-m5d-01 | M5D | purpose ontbreekt | low | gefixt |
| figure-m5d-02 | M5D | purpose ontbreekt | low | gefixt |
| figure-m10-01 | M10 | purpose ontbreekt | low | gefixt |
| figure-m10-02 | M10 | purpose ontbreekt | low | gefixt |
| figure-m10-03 | M10 | purpose ontbreekt | low | gefixt |
| qa-m5d-codon-01 | M5D | purpose ontbreekt; geen expliciete figuurverwijzing | medium | gefixt |
| qa-m5d-codon-08 | M5D | purpose ontbreekt | low | gefixt |
| official-09 | M5D | purpose ontbreekt; modelantwoord niet expliciet | high | gefixt |
| official-10 | M5D | purpose ontbreekt | medium | gefixt |
| official-18 | M9 | purpose ontbreekt | medium | gefixt |
| official-22 | M9 | purpose ontbreekt; modelantwoord niet expliciet | high | gefixt |

## Resultaat

Laatste run:

```text
Figure question quality validation completed: 419 vraagblokken gecontroleerd; 51 met visual; 0 waarschuwingen.
```
