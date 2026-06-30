# M5D DNA DEEPENING REPORT

## Aangepaste bestanden

- `AGENTS.md`
- `src/data/lessonVideoRegistry.ts`
- `src/components/content/LessonVideoCard.tsx`
- `scripts/auditLessonVideos.mjs`
- `src/data/binasReferences.ts`
- `src/data/lessons.ts`
- `src/data/learningObjectives.ts`
- `src/data/coverageQaQuestions.ts`
- `M5D_DNA_AUDIT.md`
- `LESSON_DEPTH_AUDIT.md`
- `VIDEO_MAPPING_AUDIT.md`
- `NIGHTLY_REPORT.md`

## Nieuwe/verdiepte M5D DNA-lessen

- `m5d-dna-overzicht`
- `m5d-dna-rna-verschillen`
- `m5d-dna-basparen-helix`
- `m5d-transcriptie`
- `m5d-translatie-codontabel`
- `m5d-dna-naar-aminozuurketen-aanpak`
- `m5d-eiwitten-peptidebinding-hydrolyse`
- `m5d-eiwitstructuur-denaturatie`

## DNA-subonderwerpen nu afgedekt

- nucleotide als bouwsteen
- DNA als polymeer en informatiedrager
- DNA versus RNA
- basenparen en dubbele helix
- transcriptie
- translatie
- codontabel/BINAS
- aminozuurvolgorde
- peptidebinding
- hydrolyse
- primaire, secundaire en tertiaire structuur
- denaturatie
- mutatie-effect
- DNA/enzym/macroniveau-context

## BINAS-hulp gecorrigeerd

- DNA -> mRNA -> aminozuurketen verwijst nu expliciet naar de BINAS-codontabel of genetische-code-tabel.
- `117E/G` is zichtbaar gemaakt voor deze cursuscontext.
- `71E`, `71G` en `71J` zijn vastgelegd als geldige editie-/schoolalias.
- `BINAS 67` is toegevoegd voor aminozuren, peptide en eiwitstructuurcontext.

## Codontabel references

- `m5d-codontabel`
- `m5d-eiwit-67`
- `bf-m5d-codon`

## Vragen met “geen BINAS nodig” gefixt

- Ja. In de M5D DNA/codonroute staat niet langer dat BINAS overbodig is.

## Nieuwe/verbeterde DNA-vragen

- Toegevoegd of sterk verdiept:
  - `qa-m5d-dna-01`
  - `qa-m5d-dna-02`
  - `qa-m5d-rna-01`
  - `qa-m5d-helix-01`
  - `qa-m5d-helix-02`
  - `qa-m5d-transcriptie-01`
  - `qa-m5d-transcriptie-02`
  - `qa-m5d-translatie-01`
  - `qa-m5d-translatie-02`
  - `qa-m5d-peptide-01`
  - `qa-m5d-peptide-02`
  - `qa-m5d-structuur-01`
  - `qa-m5d-structuur-02`
  - `qa-m5d-aanpak-01`
  - `qa-m5d-aanpak-02`
- Bijgewerkt:
  - `qa-m5d-codon-01` t/m `qa-m5d-codon-08`

## Nieuwe/hergebruikte DNA visuals

- Hergebruikt: `/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp`
- Geen extra native diagramcomponent nodig in deze ronde.

## Video’s gezocht

- Exact wat je zoekt / Sisters in Science eerst gecontroleerd.
- Voor M5D DNA bleek daar geen voldoende precieze match voor transcriptie/translatie/codontabel.
- Daarom zijn alleen gerichte externe video’s toegevoegd waar de match duidelijk genoeg was.

## Nieuwe M5D-video’s gekoppeld

- `Van DNA naar eiwit: transcriptie en translatie`
- `DNA, mRNA, protein: how to answer questions about these in exams`
- `DNA, mRNA, eiwit: transcriptie en translatie`
- `De transcriptie en translatie / eiwitsynthese`

## Geen goede video-match gevonden voor

- `m5d-dna-polymeren`
- `m5d-eiwitten-peptidebinding-hydrolyse`
- `m5d-eiwitstructuur-denaturatie`
- `m5d-polymeerstructuur`
- `m5d-eiwitstructuur`
- `m5d-enzymen-en-werking`

## Validators

- `node scripts/validateFigureQuestionQuality.mjs`
- `node scripts/validateHintQuality.mjs`
- `node scripts/validateLearningCoverage.mjs`
- `node scripts/validateChemGraph.mjs`
- `node scripts/auditLessonVideos.mjs`

## Build

- `npm run build`

## Wat bewust niet aangepast

- Geen TitrationLab-animaties
- Geen `ProcedureActionPreview`
- Geen `MassSpectrometryLab`
- Geen backend/accounts/gamification/leaderboard
- Geen grote redesign

## Handmatige test voor Oweis

1. Open `Leren` -> `M5D`.
2. Check of DNA nu duidelijk uitgebreider is.
3. Open `Aanpak: DNA -> mRNA -> aminozuurketen`.
4. Check dat BINAS/codontabel genoemd wordt.
5. Check dat nergens staat `geen BINAS nodig` bij codonvragen.
6. Open `Oefenen` -> M5D DNA.
7. Maak een DNA -> aminozuurketen-vraag.
8. Check modelantwoord op mRNA, codons, BINAS, aminozuurvolgorde en eindantwoord.
9. Check peptidebinding/hydrolyse-vragen.
10. Check eiwitstructuur/denaturatie-vragen.
11. Check video’s bij DNA-lessen.
12. Run `npm run build`.

## STOP
