# Profile System Audit

## Implementatie
- Lokale profielen toegevoegd in `src/utils/storage.ts` met sleutels:
  - `chemtrainer:profiles:v1`
  - `chemtrainer:activeProfileId:v1`
- Oude single-user voortgang wordt backwards compatible gemigreerd naar een standaardprofiel.
- Profielen bewaren:
  - naam
  - avatar-id
  - kleur
  - actieve voortgang
  - TitratieLab-voortgang
  - lokale game-state
- `ProfileSwitcher` toegevoegd aan de header voor:
  - profiel wisselen
  - profiel maken
  - hernoemen
  - resetten
  - verwijderen met bescherming tegen het verwijderen van het laatste profiel

## Export / Import
- JSON-backup voor actief profiel en alle profielen toegevoegd.
- Import valideert het backupformaat en voorkomt een crash bij kapotte JSON.

## Privacy
- Tekst toegevoegd dat voortgang lokaal in de browser wordt opgeslagen.
- Geen online account, geen wachtwoordopslag en geen backend-auth toegevoegd.

## Opmerking
- TitratieLab-voortgang gaat nu ook mee per actief profiel in plaats van als losse gedeelde browserstatus.
