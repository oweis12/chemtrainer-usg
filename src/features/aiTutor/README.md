# AI Tutor Plan

Doel: later een kleine "Leg dit makkelijker uit"-functie toevoegen zonder de toetslogica of privacy te verzwakken.

## Gewenst gedrag

- Leerling selecteert tekst of klikt op een hulpknop.
- Frontend stuurt alleen de geselecteerde tekst, de module en de huidige vraag naar `/api/explain`.
- De API-key blijft server-side.
- De backend/proxy geeft een uitleg terug die helpt begrijpen, maar niet direct het juiste toetsantwoord weggeeft.
- Bij falen valt de UI terug op de bestaande lokale uitleg en hints.

## Randvoorwaarden

- Geen leerlingnamen of andere privédata meesturen.
- Geen directe modelaanroep vanuit de browser.
- Max requests en rate limiting zijn nodig.
- Gebruik geen onbeperkt gratis gebruik als aanname.

## Mogelijke latere modelopties

- Goedkope of free-tier opties zoals Qwen, DeepSeek, OpenRouter of Hugging Face.
- Keuze blijft later afhankelijk van kosten, beschikbaarheid en kwaliteit.

## Nog niet doen

- Geen echte `/api/explain` bouwen.
- Geen API-key toevoegen.
- Geen chatvenster of assistent-UI bouwen.
- Geen modelintegratie in deze ronde.
