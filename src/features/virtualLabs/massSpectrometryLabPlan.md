# Plan — MassSpectrometryLab V1

Dit is alleen een plan voor later. ChemTrainer USG implementeert dit lab nog niet in deze ronde.

## Leerdoel

Leerlingen zien hoe een stof stap voor stap door een massaspectrometer gaat en hoe daar een spectrum uit ontstaat.

## Mogelijke simulatiestappen

1. Deeltje invoeren.
2. Verdampen.
3. Ioniseren.
4. Versnellen.
5. Afbuigen of scheiden op m/z.
6. Detecteren.
7. Spectrum opbouwen.
8. M-piek, M+1, basispiek en fragmentpieken uitleggen.

## Concepten die zichtbaar moeten worden

- `m/z` als massa gedeeld door lading.
- M-piek = molecuulion.
- M+1 vaak door ¹³C.
- M+2 kan wijzen op isotopenpatronen zoals Cl of Br.
- Basispiek = hoogste piek op 100%.
- Fragmentpiek = afgebroken geladen deel.

## Voorgestelde architectuur

- `MassSpectrometryScene2D.tsx`: tekent de route door het apparaat.
- `massSpectrometryEngine.ts`: bepaalt ionen, fragmenten, pieken en foutfeedback.
- `MassSpectrometryLessonWrapper.tsx`: legt de stappen rustig uit.
- `MassSpectrometryQuizLayer.tsx`: korte interpretatievragen.

## Acceptatiecriteria later

- Geen zware externe library.
- Geen kopie van officiële BINAS- of toetsafbeeldingen.
- Rechtenveilige, eigen visualisaties.
- Vraag-specifieke feedback.
- Werkt op telefoon en laptop.
- Build blijft groen.

