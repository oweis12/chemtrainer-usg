# M5D DNA Audit

Datum: 2026-06-30

## Huidige DNA-lessen

- M5D heeft nu 15 lessen in totaal.
- De DNA/RNA/transcriptie/translatie-kern zit nu expliciet in:
  - `m5d-dna-overzicht`
  - `m5d-dna-rna-verschillen`
  - `m5d-dna-basparen-helix`
  - `m5d-transcriptie`
  - `m5d-translatie-codontabel`
  - `m5d-dna-naar-aminozuurketen-aanpak`
  - `m5d-eiwitten-peptidebinding-hydrolyse`
  - `m5d-eiwitstructuur-denaturatie`
- Oudere M5D-lessen blijven daarnaast bestaan als extra anker:
  - `m5d-dna-polymeren`
  - `m5d-eiwitten-genexpressie`
  - `m5d-codontabel`
  - `m5d-polymeerstructuur`
  - `m5d-eiwitstructuur`
  - `m5d-rna-en-ribosomen`
  - `m5d-enzymen-en-werking`

## Ontbrekende onderwerpen die zijn opgelost

- DNA als informatie-polymeer is nu apart uitgewerkt.
- DNA versus RNA is nu apart uitgewerkt met ribose/desoxyribose, T/U en mRNA-functie.
- Basenparen, dubbele helix en waterstofbruggen hebben nu een eigen les.
- Transcriptie en translatie zijn nu los van elkaar uitgelegd.
- De route `DNA -> mRNA -> aminozuurketen` heeft nu een apart toetsstappenplan.
- Peptidebinding, hydrolyse en eiwitstructuur zijn verdiept naar toetsniveau.
- BINAS-gebruik bij codons staat nu expliciet in lessen en vragen.

## BINAS-hulp

- Foute boodschap zoals `geen BINAS nodig` is voor de DNA/codonroute verwijderd.
- Nieuwe hoofdreferentie:
  - `m5d-codontabel`
  - tabeltekst: `BINAS codontabel / genetische-code-tabel (vaak 117E/G; soms 71E/71G/71J)`
- Nieuwe eiwitreferentie:
  - `m5d-eiwit-67`
  - tabeltekst: `BINAS 67`
- Gebruikte leerlingformulering:
  - gebruik de BINAS-codontabel of genetische-code-tabel om mRNA-codons naar aminozuren te vertalen
  - in deze cursus kan dat als BINAS `117E/G` aangeduid zijn
  - in sommige BINAS-edities of schoolcontexten staan genetische code/codons bij `71E`, `71G` of `71J`
- Belangrijke waarschuwing staat nu expliciet in de referentie:
  - zoek mRNA-codons op, niet direct DNA-triplets
  - controleer eerst matrijsstreng, coderende streng of al-mRNA

## Vragenaudit

- De M5D-vraagbank is uitgebreid met 15 nieuwe of sterk verbeterde DNA-vragen in `src/data/coverageQaQuestions.ts`.
- Nieuwe dekking:
  - DNA als polymeer
  - DNA versus RNA
  - basenparen en helix
  - transcriptie
  - translatie
  - codontabel/BINAS
  - DNA -> mRNA -> aminozuurketen
  - mutatie-effect
  - peptidebinding
  - hydrolyse
  - primaire/secundaire/tertiaire structuur
  - denaturatie
- De codonvragen `qa-m5d-codon-01` t/m `qa-m5d-codon-08` zijn herschreven zodat ze:
  - BINAS expliciet noemen
  - mRNA-codons centraal zetten
  - stopcodons correct behandelen
  - T/U-fouten actief helpen voorkomen
- Verplichte toetsroute is nu zichtbaar in de modelantwoorden:
  - streng bepalen
  - mRNA maken
  - codons opdelen
  - BINAS gebruiken
  - aminozuurvolgorde noteren
  - eindantwoord formuleren

## Video-audit

- Er zijn nu 9 M5D-lessen met een gecureerde video.
- Exact had geen sterke DNA-match voor deze cluster, dus M5D gebruikt hier bewust gecureerde YouTube-links.
- Gekoppelde M5D-video’s:
  - `youtube-m5d-dna-rna-eiwit-overview`
  - `youtube-m5d-codons-exam-approach`
  - `youtube-m5d-dna-mrna-eiwit-scheikunde`
  - `youtube-m5d-eiwitsynthese`
- M5D-lessen zonder video blijven bewust zonder video als de match niet sterk genoeg is:
  - `m5d-dna-polymeren`
  - `m5d-eiwitten-peptidebinding-hydrolyse`
  - `m5d-eiwitstructuur-denaturatie`
  - `m5d-polymeerstructuur`
  - `m5d-eiwitstructuur`
  - `m5d-enzymen-en-werking`

## Visuals

- Bestaande DNA-visual is hergebruikt:
  - `/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp`
- Er was voor deze ronde geen extra native SVG-diagram nodig om de validators en de leskwaliteit te halen.

## Validators en build

- `node scripts/validateFigureQuestionQuality.mjs`
- `node scripts/validateHintQuality.mjs`
- `node scripts/validateLearningCoverage.mjs`
- `node scripts/validateChemGraph.mjs`
- `node scripts/auditLessonVideos.mjs`
- `npm run build`

Status: groen na de M5D-DNA-verdieping.
