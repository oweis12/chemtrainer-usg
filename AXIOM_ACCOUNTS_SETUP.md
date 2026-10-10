# AXIOM cloudaccount instellen

1. Maak een Supabase-project aan via https://supabase.com/dashboard en wacht totdat de database gereed is.
2. Plak de inhoud van `supabase/axiom-progress.sql` in **SQL Editor** en voer hem uit.
3. Ga in Supabase naar **Authentication → Providers → Email**. Zet e-mail en wachtwoord aan en houd e-mailverificatie ingeschakeld. Stel onder URL Configuration het **Site URL** in op `https://chemtrainer-usg.vercel.app` en voeg eventueel dit domein toe aan de redirects.
4. Voeg in **Vercel → Project → Settings → Environment Variables** twee variabelen toe: `AXIOM_SUPABASE_URL` = de Supabase Project URL en `AXIOM_SUPABASE_PUBLISHABLE_KEY` = de **publishable** (of oude anon) key. Geen secret of service-role key gebruiken!
5. Start een nieuwe Vercel deployment. Test via `https://chemtrainer-usg.vercel.app/api/axiom-config`: `{"enabled":true,...}` geeft aan dat de publieke configuratie aanwezig is.
6. Maak via AXIOM een account, bevestig je e-mail en log in. Controleer de synchronisatie op een tweede apparaat.

**Privacy:** de voortgang wordt per ingelogde gebruiker met RLS afgeschermd en per apparaat als afzonderlijke rij opgeslagen. Er worden geen schooldocumenten naar deze database geüpload. Wachtwoorden worden verwerkt door Supabase Auth en niet door AXIOM opgeslagen.

**Bestaande data:** je browser bewaart `axiom-v2-progress` en `axiom-exams-v1`; bij de eerste aanmelding vraagt AXIOM of je deze lokale voortgang wilt koppelen. De quiz blijft zonder account offline werken.

**Let op:** de Vercel-variabelen en Supabase-project zijn nog niet automatisch aangemaakt. Zonder deze stappen toont AXIOM een duidelijke melding dat cloudaccounts nog niet zijn geactiveerd.
