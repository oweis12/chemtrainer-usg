import { createContext, useContext, useState, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

type Consent = { analytics: boolean; media: boolean };
const KEY = "chemtrainer-consent-v1";
const PrivacyContext = createContext({ media: false, openSettings: () => {} });
export const usePrivacy = () => useContext(PrivacyContext);
function readConsent(): Consent | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return value && typeof value.analytics === "boolean" && typeof value.media === "boolean" ? value : null;
  } catch { return null; }
}
export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(readConsent);
  const [open, setOpen] = useState(() => !readConsent());
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [media, setMedia] = useState(consent?.media ?? false);
  function save(next: Consent) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Choice remains valid for this session. */ }
    const revokeAnalytics = consent?.analytics && !next.analytics;
    setConsent(next); setOpen(false);
    // Reload also removes listeners installed by the analytics script.
    if (revokeAnalytics) window.location.reload();
  }
  function openSettings() {
    setAnalytics(consent?.analytics ?? false); setMedia(consent?.media ?? false); setOpen(true);
  }
  return <PrivacyContext.Provider value={{ media: consent?.media ?? false, openSettings }}>
    {children}
    {consent?.analytics && <Analytics />}
    <button className="privacy-settings" onClick={openSettings}>Cookie-instellingen</button>
    {open && <section className="cookie-consent-panel" role="region" aria-labelledby="privacy-title">
      <span className="section-kicker">Jouw privacy</span>
      <h2 id="privacy-title">Cookies en externe diensten</h2>
      <p>Je profiel, antwoorden en voortgang blijven in deze browser. Deze lokale opslag is nodig om je werk te bewaren.</p>
      <p>Vercel Analytics en ingesloten YouTube-video's staan standaard uit. Als je ze toestaat, laden we die diensten in ChemTrainer. YouTube ontvangt bij het insluiten onder meer je IP-adres. Een link naar Exact of YouTube opent alleen wanneer je erop klikt en gaat dan rechtstreeks naar die aanbieder.</p>
      <div className="privacy-choices">
        <label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> Bezoekstatistieken (Vercel)</label>
        <label><input type="checkbox" checked={media} onChange={e => setMedia(e.target.checked)} /> Externe video's (YouTube)</label>
      </div>
      <div className="privacy-actions">
        <button className="secondary-button" onClick={() => save({ analytics: false, media: false })}>Alleen noodzakelijk</button>
        <button className="secondary-button" onClick={() => save({ analytics, media })}>Keuze opslaan</button>
        <button className="secondary-button" onClick={() => save({ analytics: true, media: true })}>Alles toestaan</button>
      </div>
      <a className="privacy-policy-link" href="/privacy.html" target="_blank" rel="noreferrer">Lees de privacyverklaring</a>
      <small>Je kunt je keuze altijd wijzigen via Cookie-instellingen onderaan de pagina. Weigeren heeft geen invloed op lessen of oefenen.</small>
    </section>}
  </PrivacyContext.Provider>;
}
