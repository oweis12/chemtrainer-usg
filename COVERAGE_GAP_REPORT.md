# COVERAGE GAP REPORT — ChemTrainer USG

Datum: 2026-06-25

Deze QA-ronde was geen algemene contentuitbreiding. De focus lag op ontbrekende of verkeerd gekoppelde leerdoelen, toetswaardige dekking en leerlingvriendelijke vraagnotatie.

## Opgeloste gaten

| Leerdoel | Probleem vóór QA | Aangepaste of nieuwe dekking | Status |
| --- | --- | --- | --- |
| M5D hydrolyse | Tweede gekoppelde vraag ging over additie/condensatie in plaats van hydrolyse van peptidebindingen. | `priority-m5d-03`, nieuw `qa-m5d-hydrolyse-01` | Gedekt |
| M5D DNA-basen | Eén link ging naar DNA als polymeer, niet naar A/T/C/G en basenparen. | `m5d-01`, `m5d-06` | Gedekt |
| M5D DNA/RNA | Eén link ging naar enzymen; validator herkende DNA/RNA-kenmerken niet scherp genoeg. | `m5d-05`, `priority-m5d-24` | Gedekt |
| M5D transcriptie/translatie | Links verwezen deels naar denaturatie. | `priority-m5d-06`, `qa-m5d-codon-03`, `priority-m5d-07`, `qa-m5d-codon-02` | Gedekt |
| M6 ionrooster/oplossen/geleidbaarheid/pH | Meerdere leerdoelen verwezen naar naburige onderwerpen in plaats van de getoetste kern. | `m6-01`, `m6-17`, `m6-07`, `m6-14`, `m6-03`, `m6-13`, `m6-06`, `m6-18` | Gedekt |
| M8 isotopen/MS/GC | Enkele replacement-vragen overschreven eerdere ids; leerdoelen wezen daardoor naar verkeerde actieve vragen. | `m8-01`, `m8-12`, `priority-m8-06`, `priority-m8-21`, `m8-03`, `priority-m8-17`, `priority-m8-02`, `priority-m8-03`, nieuw `qa-m8-gc-01` | Gedekt |
| M9 atoombinding | Er ontbrak een tweede directe vraag over covalente binding als gedeeld elektronenpaar. | `m9-22`, nieuw `qa-m9-covalent-01` | Gedekt |
| M9 ionbinding/intermoleculaire krachten/oplosbaarheid | Links verwezen deels naar polariteit, materialen of ion-dipool in plaats van de juiste kern. | `m9-20`, `m9-45`, `m9-26`, `m9-30`, `m9-23`, `m9-29`, `m9-25`, `m9-39`, `m9-28`, `m9-43` | Gedekt |
| M10 concentratiecel | Tweede link ging over algemeen iontransport, niet specifiek over concentratiecellen. | `qa-m10-elektro-04`, nieuw `qa-m10-elektro-08` | Gedekt |
| M10 zuur/base/pH/evenwicht | Enkele links wezen naar titratie- of duurzaamheidsonderwerpen. | `official-01`, `m10-14`, `m10-24`, `m10-13`, `official-03`, `m10-18`, `qa-m10-k-03` | Gedekt |
| M10 massa-aandeel | Actieve replacement overschreef `m10-11` met een foutenanalysevraag. | `priority-m10-11`, `m10-17` | Gedekt |

## Validatorverbeteringen

- Vraagblokken worden nu veilig per `q({...})` en `s({...})` gelezen.
- De validator gebruikt actieve vraagdata na replacements; de laatste definitie van een vraag-id telt.
- Module-specifieke sleutelwoorden voorkomen valse koppelingen, zoals `ionvorming` dat eerder per ongeluk op `vormingswarmte` leek.
- Leerlingvraagteksten worden gecontroleerd op cryptische formuleringen zoals `Bereken c(...)`, `Bereken n(...)`, `Bereken massa%` en `mol L⁻¹`.

## Eindstatus

- `node scripts/validateLearningCoverage.mjs`: geslaagd.
- `node scripts/validateChemGraph.mjs`: geslaagd.
- `npm run build`: geslaagd.
