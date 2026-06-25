# MISSING VISUAL ASSETS — ChemTrainer USG

Datum: 2026-06-25

Bron: `src/data/visualAssetRegistry.ts`  
Fysieke controle: `public/assets/chemtrainer/...`

## Batch 1 status

Zes oorspronkelijke high-priority beelden zijn toegevoegd en staan op `done` in `src/data/visualAssetRegistry.ts`:

1. titratieopstelling — `public/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp`
2. buret-meniscus — `public/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp`
3. Schellbachstreep — `public/assets/chemtrainer/titratie/schellbachstreep-detail.webp`
4. titratiestappen — `public/assets/chemtrainer/titratie/titratie-stappen.webp`
5. massaspectrum — `public/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp`
6. transcriptie/translatie — `public/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp`

Glaswerk spoelen blijft bewust zonder aparte afbeelding. Het onderwerp blijft wel in M10 en TitratieLab aanwezig als tekstuele uitleg en toetsstof.

## Nieuwe maakvolgorde voor resterende beelden

1. structuurformules
2. M9/redox/materialen
3. losse labmateriaalbeelden
4. optioneel later: glaswerk-spoelen-schema

## Statussamenvatting

- 6 Batch 1-bestanden bestaan fysiek.
- Mappen bestaan wel: `analyse`, `dna`, `labmateriaal`, `redox`, `structuurformules`, `titratie`.
- Records die eerder `done` waren zonder fysiek bestand zijn teruggezet naar `placeholder`.
- `placeholder` betekent: er is een native SVG/HTML fallback in de app of een bestaand conceptdiagram, maar nog geen los bestand in `public/assets/chemtrainer/...`.
- `needs-image` betekent: er moet nog een echte rechtenveilige afbeelding of asset worden gemaakt.

## Assetlijst

### visual-titration-setup

- module: M10
- onderwerp: titratieopstelling
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: m10-titratie / TitrationSetupDiagram
- wat het beeld moet tonen: Volledige titratieopstelling met nette calloutlijnen rechts.
- labels: `buret`, `kraantje`, `statief`, `erlenmeyer`, `indicator`, `witte tegel`, `titrant`
- alt tekst: Volledige titratieopstelling met gelabelde buret boven een erlenmeyer op een witte tegel.
- caption: Een vaste opstelling voorkomt aflees- en spoelfouten.
- type beeld: realistische afbeelding / gelabelde opstelling
- aanbevolen formaat: 1600 × 1000 px, liggend
- exacte image-generation prompt: `Rights-safe realistic Dutch school chemistry titration setup, white background, burette in clamp stand above Erlenmeyer on white tile, clear labels with thin cobalt-blue callout lines, warm lab notebook teaching style, no logos, no textbook scan`

### visual-titration-meniscus

- module: M10
- onderwerp: buret aflezen
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: M10 vragen over buret
- wat het beeld moet tonen: Close-up van onderkant meniscus op ooghoogte.
- labels: `onderkant meniscus`, `lees op ooghoogte`, `mL-schaal`
- alt tekst: Close-up van een buret waarbij de onderkant van de meniscus op ooghoogte wordt afgelezen.
- caption: Lees de onderkant van de meniscus recht op ooghoogte af.
- type beeld: echte labfoto / realistische afbeelding
- aanbevolen formaat: 1200 × 900 px, staand
- exacte image-generation prompt: `Rights-safe realistic close-up chemistry burette with transparent liquid meniscus, numbered scale, horizontal eye-level guide, teaching callout, clean white laboratory background, no branding`

### visual-titration-schellbach

- module: M10
- onderwerp: Schellbachstreep
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/titratie/schellbachstreep-detail.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: m10-titratie
- wat het beeld moet tonen: Schellbachstreep die bij de meniscus in een punt samenkomt.
- labels: `Schellbachstreep`, `scherpe punt bij meniscus`
- alt tekst: Detail van een Schellbachstreep in een buret die bij de meniscus een scherpe punt vormt.
- caption: Het punt van de Schellbachstreep wijst de onderkant van de meniscus aan.
- type beeld: schema / realistische close-up
- aanbevolen formaat: 1200 × 900 px, staand
- exacte image-generation prompt: `Clean educational close-up of a Schellbach burette stripe converging at the bottom of a meniscus, labels in Dutch, cobalt blue callouts on warm white`

### visual-titration-rinsing

- module: M10
- onderwerp: spoelen glaswerk
- prioriteit: laag
- exact pad: `public/assets/chemtrainer/titratie/glaswerk-spoelen-do-dont.webp`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: m10-titratie
- wat het beeld moet tonen: geen verplicht beeld; uitleg blijft tekstueel aanwezig.
- labels: `buret: spoelen met titrant`, `pipet: spoelen met monster`, `erlenmeyer: demiwater mag`
- alt tekst: Drie laboratoriumhandelingen die tonen welk glaswerk met welke vloeistof wordt gespoeld.
- caption: Conditioneer buret en pipet; extra demiwater in de erlenmeyer verandert het aantal mol niet.
- type beeld: realistische afbeelding / schema
- aanbevolen formaat: 1600 × 1000 px, liggend
- statusnotitie: geen Batch 1-verplichting meer; spoelregels staan in de M10-les en TitratieLab-uitlegmodus.

### visual-titration-steps

- module: M10
- onderwerp: titratiestappen
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/titratie/titratie-stappen.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: m10-titratie
- wat het beeld moet tonen: Zes stappen van vullen tot berekenen.
- labels: `1 vullen`, `2 pipetteren`, `3 indicator`, `4 titreren`, `5 aflezen`, `6 rekenen`
- alt tekst: Zes gelabelde stappen van een zuur-basetitratie.
- caption: Werk altijd in dezelfde volgorde: aflezen, liter, mol, verhouding, antwoord.
- type beeld: schema / stappenbeeld
- aanbevolen formaat: 1800 × 1000 px, liggend
- exacte image-generation prompt: `Six-panel Dutch school chemistry titration process diagram, fill burette, pipette sample, add indicator, titrate, read burette, calculate, cobalt blue and amber accent, no gradients`

### visual-lab-buret

- module: M10
- onderwerp: labmateriaal
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/labmateriaal/labmateriaal-buret.webp`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: visuele audit
- wat het beeld moet tonen: Gelabelde buret met kraantje en schaal.
- labels: `kraantje`, `schaal`, `tuit`
- alt tekst: Gelabelde buret met kraantje, schaal en tuit
- caption: Een buret doseert nauwkeurig een variabel volume.
- type beeld: realistische afbeelding / gelabelde opstelling
- aanbevolen formaat: 1200 × 900 px, staand
- exacte image-generation prompt: `Rights-safe single burette on neutral background with Dutch labels for stopcock, scale and tip, science education image`

### visual-lab-pipet

- module: M10
- onderwerp: labmateriaal
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/labmateriaal/labmateriaal-volumepipet.webp`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: visuele audit
- wat het beeld moet tonen: Volumepipet met markering.
- labels: `volumepipet`, `maatstreep`, `vast volume`
- alt tekst: Gelabelde volumepipet met maatstreep
- caption: Een volumepipet levert één vast, nauwkeurig volume.
- type beeld: realistische afbeelding / gelabelde opstelling
- aanbevolen formaat: 1200 × 900 px, staand
- exacte image-generation prompt: `Rights-safe volumetric pipette educational product photo with thin Dutch callout labels, white background`

### visual-lab-flask

- module: M10
- onderwerp: labmateriaal
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/labmateriaal/labmateriaal-volumes.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: visuele audit
- wat het beeld moet tonen: Vergelijking erlenmeyer, maatkolf en maatcilinder.
- labels: `erlenmeyer`, `maatkolf`, `maatcilinder`
- alt tekst: Erlenmeyer, maatkolf en maatcilinder met hun functie
- caption: Niet ieder glaswerk meet even nauwkeurig.
- type beeld: schema
- aanbevolen formaat: SVG, liggend
- exacte image-generation prompt: `Clean comparison diagram of Erlenmeyer flask, volumetric flask and graduated cylinder with Dutch labels, cobalt linework on warm white paper`

### visual-structure-ethanol

- module: M5D
- onderwerp: alcohol
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/structuurformules/ethanol-oh.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: StructuurLab / structuurvragen
- wat het beeld moet tonen: Heldere structuurformule van ethanol met OH-callout.
- labels: `OH-groep`, `alcohol`
- alt tekst: Structuurformule van ethanol met gemarkeerde OH-groep
- caption: De OH-groep maakt ethanol een alcohol.
- type beeld: structuurformule
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Exam-style chemistry structure formula of ethanol CH3-CH2-OH with a restrained cobalt callout around OH, white background`

### visual-structure-ethanoic

- module: M5D
- onderwerp: carbonzuur
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/structuurformules/ethaanzuur-cooh.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: StructuurLab / structuurvragen
- wat het beeld moet tonen: Ethaanszuur met afzonderlijke C=O en O-H aanwijzing.
- labels: `C=O`, `O-H`, `carbonzuurgroep`
- alt tekst: Structuurformule van ethaanzuur met carbonzuurgroep
- caption: Een carbonzuurgroep bevat zowel C=O als O-H.
- type beeld: structuurformule
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Exam style structural formula of ethanoic acid CH3-C(=O)-OH, labels for carbonyl and OH, Dutch chemistry education`

### visual-structure-ester

- module: M5D
- onderwerp: ester
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/structuurformules/ester-patroon.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: StructuurLab
- wat het beeld moet tonen: C(=O)-O-C-patroon met callout.
- labels: `C(=O)-O-C`, `ester`
- alt tekst: Structuurformule met esterpatroon C dubbel O, O, C
- caption: Een ester herken je aan C(=O)-O-C.
- type beeld: structuurformule
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Minimal exam-style ester structure formula with clear C(=O)-O-C bridge highlighted, no 3D models`

### visual-structure-amide

- module: M5D
- onderwerp: amide en peptide
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/structuurformules/amide-peptidebinding.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: StructuurLab
- wat het beeld moet tonen: C(=O)-NH met peptidecallout.
- labels: `C(=O)-NH`, `peptidebinding`, `amidebinding`
- alt tekst: Structuurformule van een peptidebinding C dubbel O N H
- caption: Een peptidebinding is een amidebinding tussen aminozuren.
- type beeld: structuurformule
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Exam style dipeptide structure fragment with C(=O)-NH peptide bond highlighted, Dutch labels, clean line art`

### visual-structure-triglyceride

- module: M5D
- onderwerp: vetten
- prioriteit: laag
- exact pad: `public/assets/chemtrainer/structuurformules/triglyceride-esterbindingen.svg`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: StructuurLab
- wat het beeld moet tonen: Vereenvoudigd triglyceride met drie esterbindingen.
- labels: `glycerol`, `vetzuurstaarten`, `esterbinding`
- alt tekst: Vereenvoudigd triglyceride met drie esterbindingen
- caption: Glycerol en drie vetzuren vormen een triglyceride.
- type beeld: structuurformule
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Educational simplified triglyceride structural diagram with three ester bonds, clear Dutch labels, white background`

### visual-dna-nucleotide

- module: M5D
- onderwerp: nucleotide
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/dna/nucleotide-bouwsteen.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: m5d-dna-polymeren
- wat het beeld moet tonen: Fosfaat-suiker-base met ruggengraatcallout.
- labels: `fosfaat`, `suiker`, `base`
- alt tekst: Nucleotide met fosfaat, suiker en base
- caption: Een nucleotide is fosfaat + suiker + base.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Clean educational DNA nucleotide block model, phosphate sugar base, Dutch labels, lab notebook style`

### visual-dna-rna

- module: M5D
- onderwerp: DNA en RNA
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/dna/dna-versus-rna.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: m5d-dna-polymeren
- wat het beeld moet tonen: DNA versus RNA met T/U en suiker.
- labels: `DNA`, `RNA`, `T`, `U`, `desoxyribose`, `ribose`
- alt tekst: Vergelijking van DNA en RNA met suikers en basen
- caption: RNA heeft ribose en U; DNA heeft desoxyribose en T.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Educational comparison diagram DNA vs RNA, sugar and T/U difference, Dutch labels, calm textbook style`

### visual-dna-expression

- module: M5D
- onderwerp: transcriptie en translatie
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: m5d-eiwitten-genexpressie / m5d-codontabel
- wat het beeld moet tonen: DNA naar mRNA naar ribosoom naar eiwit.
- labels: `DNA`, `mRNA`, `codon`, `ribosoom`, `aminozuurketen`
- alt tekst: Schema van transcriptie en translatie van DNA naar een aminozuurketen.
- caption: Transcriptie maakt mRNA; translatie maakt een eiwit.
- type beeld: schema / stappenbeeld
- aanbevolen formaat: 1600 × 900 px, liggend
- exacte image-generation prompt: `Dutch educational process diagram DNA to mRNA to ribosome to amino acid chain, simple arrows, labelled transcriptie and translatie, warm white background`

### visual-ms-instrument

- module: M8
- onderwerp: massaspectrometer
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/analyse/massaspectrometer-route.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: MassSpectrometerDiagram
- wat het beeld moet tonen: Gelabelde instrumentroute verdampen-ioniseren-versnellen-afbuigen-detecteren.
- labels: `verdampen`, `ioniseren`, `versnellen`, `afbuigen`, `detecteren`
- alt tekst: Massaspectrometer met vijf gelabelde stappen
- caption: Ionen worden op massa per lading gescheiden.
- type beeld: schema
- aanbevolen formaat: SVG, liggend
- exacte image-generation prompt: `Precise educational mass spectrometer process diagram, ion source accelerator magnetic deflection detector, Dutch labels, cobalt blueprint style`

### visual-ms-spectrum

- module: M8
- onderwerp: massaspectrum
- prioriteit: hoog
- exact pad: `public/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp`
- bestaat bestand: ja
- huidige status: done
- waar gebruikt in de app: MassSpectrumDiagram
- wat het beeld moet tonen: Massaspectrum met M, M+1, M+2, basispiek en fragmenten.
- labels: `M-piek`, `M+1`, `M+2`, `fragmentpiek`, `basispiek`, `relatieve intensiteit`
- alt tekst: Didactisch massaspectrum met gelabelde M-piek, M+1-piek, fragmentpiek en basispiek.
- caption: Piekhoogte en m/z geven verschillende informatie.
- type beeld: spectrum
- aanbevolen formaat: 1600 × 900 px, liggend
- exacte image-generation prompt: `Clean exam-style mass spectrum with M, M+1, M+2, base peak and fragment labels in Dutch, no real source reproduction`

### visual-gc-chromatogram

- module: M8
- onderwerp: GC
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/analyse/gc-chromatogram-retentietijd.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: GcChromatogramDiagram
- wat het beeld moet tonen: Drie heldere pieken met retentietijd.
- labels: `retentietijd`, `component A`, `component B`, `component C`
- alt tekst: GC chromatogram met drie componenten en retentietijden
- caption: Elke afzonderlijke piek kan een component voorstellen.
- type beeld: spectrum / chromatogram
- aanbevolen formaat: SVG, liggend
- exacte image-generation prompt: `Educational gas chromatogram with three clear peaks and retention time labels, Dutch, clean graph paper aesthetic`

### visual-redox-electrons

- module: M7
- onderwerp: redox
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/redox/redox-elektronenroute.svg`
- bestaat bestand: nee
- huidige status: placeholder
- waar gebruikt in de app: m7-redox
- wat het beeld moet tonen: Zn geeft elektronen aan Cu2+.
- labels: `reductor`, `oxidator`, `elektronen`, `Zn`, `Cu²⁺`
- alt tekst: Zink staat elektronen af aan koperionen
- caption: Elektronen gaan van reductor naar oxidator.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Educational redox diagram Zn to Zn2+ plus electrons, Cu2+ plus electrons to Cu, cobalt arrows, Dutch labels`

### visual-hydratatie

- module: M9
- onderwerp: ion-dipool en hydratatie
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/redox/hydratatie-ion-dipool.svg`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: m9-oplossen-reactiesnelheid
- wat het beeld moet tonen: Na+ en Cl- met gericht water.
- labels: `Na⁺`, `Cl⁻`, `Oδ−`, `Hδ+`, `ion-dipool`, `hydratatie`
- alt tekst: Watermoleculen die natrium- en chloride-ionen omringen
- caption: Water richt zijn δ-ladingen naar een ion.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Microscopic educational diagram of hydrated sodium and chloride ions with water dipoles oriented correctly, Dutch labels, no 3D realism`

### visual-collisions

- module: M9
- onderwerp: reactiesnelheid
- prioriteit: middel
- exact pad: `public/assets/chemtrainer/analyse/effectieve-botsingen.svg`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: m9-oplossen-reactiesnelheid
- wat het beeld moet tonen: Effectieve en niet-effectieve botsingen met activeringsenergie.
- labels: `effectieve botsing`, `niet-effectieve botsing`, `activeringsenergie`
- alt tekst: Deeltjes met effectieve en niet-effectieve botsingen
- caption: Een reactie vraagt voldoende energie en de juiste botsing.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Educational particle collision diagram showing ineffective and effective collisions, activation energy indication, Dutch labels, simple vector`

### visual-composite

- module: M9
- onderwerp: composieten
- prioriteit: laag
- exact pad: `public/assets/chemtrainer/structuurformules/composiet-matrix-vezel.svg`
- bestaat bestand: nee
- huidige status: needs-image
- waar gebruikt in de app: m9-oplossen-reactiesnelheid
- wat het beeld moet tonen: Vezels in matrix naast een legering.
- labels: `vezel`, `matrix`, `composiet`, `legering`
- alt tekst: Composiet met sterke vezels in een matrix
- caption: Composieten combineren eigenschappen van meerdere materialen.
- type beeld: schema
- aanbevolen formaat: SVG
- exacte image-generation prompt: `Educational material science diagram of fibre reinforced composite matrix next to alloy lattice, Dutch labels, clean notebook style`
