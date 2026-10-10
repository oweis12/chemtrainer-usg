# AXIOM cloudaccounts activeren

De accountinterface en voortgangssynchronisatie zijn ingebouwd. Echte registratie blijft **uitgeschakeld tot er een Supabase-project is gekoppeld**. De oude lokale voortgang blijft ongewijzigd.

1. Maak een gratis Supabase-project aan: https://supabase.com/dashboard.
2. Ga naar **SQL Editor** en voer `supabase/axiom-progress.sql` uit. Dit maakt de privé-opslag aan en schakelt Row Level Security in.
3. Stel in **Authentication → Providers → Email** e-mail/wachtwoord in, met bevestiging via e-mail. Zet onder URL Configuration het Site URL op `https://chemtrainer-usg.vercel.app`.
4. Open `public/toetsweek/cloud-config.js` en vul **alleen** de publieke project-URL en **publishable** key in. Zet `enabled: true`. Een publishable/anon key mag volgens Supabase in de frontend staan, mits RLS juist is ingesteld. **Gebruik nooit de secret of service-role key.**
5. Deploy de commit naar Vercel. Test registratie, e-mailbevestiging, inloggen, en progressie op een tweede apparaat.

De cloud gebruikt afzonderlijke rijen per gebruiker en browser, beveiligd met RLS. Oudere lokale pogingen kunnen na aanmelden worden geïmporteerd. Zonder account blijven oefenvragen en lokaal opslaan gewoon werken.

Let op: dit project heeft nog geen werkelijk gekoppelde Supabase-instance; alleen broncode deployen creëert geen gebruikersdatabase.
