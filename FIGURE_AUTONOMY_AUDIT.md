# Figure Autonomy Audit

Datum: 2026-06-30
Scope: eerste autonome batch voor educatieve figuren in ChemTrainer, met nadruk op M5D, plus QA-notities voor M8, M9 en M10.

## Beslisregels

- `native SVG`: exacte chemische processen, bindingsvorming/-breking, transcriptie/translatie, eiwitstructuur, vraagdiagrammen met interpretatie.
- `static image asset`: brede lesintro, samenvattende visuele poster, niet-kritische sfeer- of overzichtsfiguren.
- `data diagram`: spectrum, chromatogram, meetfiguur, buretdata.
- `geen figuur`: als tekst/formule duidelijker is of als een figuur het antwoord direct weggeeft.

## Batchstatus

- Geimplementeerd in deze batch:
  - `PeptideBondFormationDiagram`
  - `DnaExpressionDiagram`
  - `ProteinStructureDiagram`
  - Leskoppelingen voor M5D met caption + uitlegblok
  - Geselecteerde M5D-vraagfiguren omgezet naar native SVG
- Niet aangepakt in deze batch:
  - TitrationLab animaties of `ProcedureActionPreview`
  - Nieuwe MassSpectrometryLab-flow
  - Backend/accounts/gamification/SEO-wijzigingen

## Audit Tabel

| module | target | huidige situatie | mist figuur | bestaand zwak | nodig type | reden | prioriteit | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M5D | `m5d-dna-overzicht` | static nucleotide asset aanwezig, maar toetsuitleg miste native bouwsteenfiguur | ja | ja | native SVG | bouwsteen vs polymeer expliciet maken | high | implemented |
| M5D | `m5d-dna-basparen-helix` | tekst goed, maar modelregel A-T/C-G niet als native vraagbaar schema aanwezig | ja | ja | native SVG | complementaire basenparing en waterstofbruggen | high | implemented |
| M5D | `m5d-transcriptie` | proces werd vooral tekstueel en via algemene image uitgelegd | ja | ja | native SVG | DNA-matrijs naar mRNA zonder T/U-fouten | high | implemented |
| M5D | `m5d-translatie-codontabel` | algemene route-afbeelding aanwezig, maar geen leesbare codonfocus | ja | ja | native SVG | codons van drie, stopcodon, BINAS-route | high | implemented |
| M5D | `m5d-dna-naar-aminozuurketen-aanpak` | stappenplan tekstueel sterk, maar mutatieketen niet zichtbaar | ja | ja | native SVG | DNA -> mRNA -> codon -> aminozuur | high | implemented |
| M5D | `m5d-eiwitten-peptidebinding-hydrolyse` | peptidebinding werd alleen summier getoond | ja | ja | native SVG | condensatie, hydrolyse en C(=O)-NH-patroon | high | implemented |
| M5D | `m5d-eiwitstructuur-denaturatie` | definities aanwezig, maar structuurniveaus/denaturatie misten native schoolboekfiguur | ja | ja | native SVG | primair/secundair/tertiair + denaturatie | high | implemented |
| M5D | `figure-m5d-01` | gebruikte algemene image voor codonvraag | nee | ja | native SVG | codons lezen zonder brede illustratieve ruis | high | implemented |
| M5D | `figure-m5d-02` | gebruikte algemene image voor mutatieketen | nee | ja | native SVG | oorzaak-gevolg zichtbaar zonder antwoordtekst | high | implemented |
| M5D | `priority-m5d-01` | oud peptide-schema was bruikbaar maar te generiek | nee | ja | native SVG | peptidebinding scherp markeren | high | implemented |
| M5D | `priority-m5d-03` | hydrolysevraag had geen ondersteunend schema | ja | nee | native SVG | water als reactant zichtbaar maken | high | implemented |
| M5D | `priority-m5d-06` | transcriptievraag was alleen tekstueel | ja | nee | native SVG | 3′/5′ en RNA-regels steun geven | high | implemented |
| M5D | `priority-m5d-10` | denaturatievraag zonder vormschema | ja | nee | native SVG | peptideketen intact vs actieve plaats veranderd | high | implemented |
| M5D | `priority-m5d-15` | causale ketenvraag zonder routekaart | ja | nee | native SVG | DNA -> enzymwerking als vaste toetsroute | high | implemented |
| M8 | `m8-massaspectrometrie` | sterke assetset aanwezig; native fallback al deels aanwezig | nee | deels | data diagram | vooral kwaliteitscontrole, geen nieuwe batch nodig | medium | deferred |
| M8 | `figure-m8-01` t/m `figure-m8-05` | figuurvragen zijn didactisch bruikbaar en lekken het antwoord niet | nee | nee | data diagram | huidige vraagset is passend | low | not-needed |
| M8 | Rutherford/atoommodellen | bestaande native componenten aanwezig en leesbaar | nee | deels | native SVG | alleen browser QA op mobiel en dark mode | medium | deferred |
| M9 | polariteit/bindingen | bestaande native/assetmix aanwezig; geen acute ontbrekende high-value lesfiguur gevonden | nee | deels | native SVG of none | eerst QA op crop/leesbaarheid, dan pas uitbreiden | medium | deferred |
| M10 | titratie-datafiguren | datafiguren en assets aanwezig; TitrationLab buiten scope | nee | nee | data diagram | alleen validatie dat vraagfiguren rekenen ondersteunen | medium | deferred |

## Open Volgende Kandidaten

- `m5d-dna-rna-verschillen`: mogelijk later een native side-by-side figuur als de bestaande asset te illustratief blijkt op mobiel.
- `m5d-rna-en-ribosomen`: kans op een native tRNA/ribosoom-detail zonder antwoordlekkage.
- `m8-isotopen-structuur`: alleen uitbreiden als browser-QA laat zien dat bestaande atoommodeldiagrammen te druk of te krap zijn.
- `m9-bindingen`: alleen extra native polariteitsschema als crop/contrastproblemen blijven bestaan.

## Risico-Checks

- Geen figuur mag een vraag beantwoorden door het gevraagde begrip letterlijk te labelen als dat label de kern van de vraag is.
- DNA/codon-vraagfiguren moeten BINAS-gebruik blijven ondersteunen, niet vervangen.
- Lesfiguren horen gevolgd te worden door expliciete uitleg: wat zie je, wat betekent dit, wat doe je ermee op de toets, wat gaat vaak mis.
