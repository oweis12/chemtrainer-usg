import type { ReactNode } from "react";

type M11LessonId =
  | "m11-p1-evenwichten"
  | "m11-p2-aminozuren-buffers"
  | "m11-p3-verf"
  | "m11-p4-complexen"
  | "m11-p5-verfdrogen"
  | "m11-p6-atoommodel";

const lessonVisuals: Record<M11LessonId, { title: string; caption: string; explanation: string }> = {
  "m11-p1-evenwichten": {
    title: "Evenwicht, concentraties en K",
    caption: "Bij dynamisch evenwicht zijn heen- en terugreactie even snel. De concentraties blijven constant, maar hoeven niet gelijk te zijn.",
    explanation: "K beschrijft de verhouding bij evenwicht; Q is de actuele verhouding. Kv gaat over verdeling tussen fasen, Ks over opgeloste ionen en Kw over de ionen uit water.",
  },
  "m11-p2-aminozuren-buffers": {
    title: "Aminozuren, peptidebinding en buffer",
    caption: "Een aminozuur kan een proton afstaan of opnemen. Bij condensatie ontstaat een peptidebinding; een buffer bevat beide deeltjes van een geconjugeerd paar.",
    explanation: "Volg de groepen: carboxyl en aminogroep vormen samen –C(=O)–NH– en water. In de buffer reageert elk paarlid met een andere toegevoegde stof.",
  },
  "m11-p3-verf": {
    title: "Kleur waarnemen en bewijs beoordelen",
    caption: "De waargenomen kleur hangt af van geabsorbeerd en teruggekaatst licht. Een metaalion kan vrij in oplossing zijn of aan liganden gebonden.",
    explanation: "Kleur is een waarneming die een verklaring kan ondersteunen. Meerdere stoffen kunnen vergelijkbare kleuren geven, dus kleur alleen bewijst niet welk ion aanwezig is.",
  },
  "m11-p4-complexen": {
    title: "Metaalionen en ligandwisseling",
    caption: "Liganden binden aan een centraal metaalion. De complexlading is de som van de ladingen; ligandwisseling kan omkeerbaar zijn.",
    explanation: "De schets laat alleen zien welke deeltjes aan elkaar gebonden zijn. Zij legt geen ruimtelijke vorm vast; vergelijk de ladingen en volg welke liganden worden uitgewisseld.",
  },
  "m11-p5-verfdrogen": {
    title: "Radicaalketen en drogen van verf",
    caption: "Initiatie vormt radicalen, propagatie laat een radicaal verder reageren en terminatie verbruikt radicalen.",
    explanation: "Fysisch drogen verwijdert bijvoorbeeld oplosmiddel zonder de verfstof om te zetten. Chemisch drogen vormt nieuwe bindingen en kan ketens tot een netwerk koppelen.",
  },
  "m11-p6-atoommodel": {
    title: "Energieniveaus, schillen en valentie",
    caption: "Bij absorptie neemt een elektron energie op; bij emissie komt energie vrij als een foton. Alleen bepaalde energieniveaus zijn toegestaan.",
    explanation: "Schillen bevatten subschillen en orbitalen. Valentie-elektronen zijn in dit eenvoudige model de elektronen in de buitenste bezette schil.",
  },
};

export function M11LessonVisual({ lessonId }: { lessonId: string }) {
  if (!(lessonId in lessonVisuals)) return null;
  const id = lessonId as M11LessonId;
  const content = lessonVisuals[id];
  const headingId = id + "-visual-title";

  return <figure className="m11-lesson-visual" aria-labelledby={headingId}>
    <h3 id={headingId}>In beeld · {content.title}</h3>
    <div className="m11-visual-content">{renderVisual(id)}</div>
    <figcaption>{content.caption}</figcaption>
    <p className="m11-visual-explanation"><strong>Zo lees je het:</strong> {content.explanation}</p>
  </figure>;
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={"m11-visual-panel " + className}>
    <h4>{title}</h4>
    {children}
  </section>;
}

function renderVisual(id: M11LessonId) {
  switch (id) {
    case "m11-p1-evenwichten":
      return <div className="m11-visual-grid">
        <Panel title="Dynamisch evenwicht">
          <div className="m11-rate-pair">
            <div><span className="m11-label">Heenreactie</span><strong>zelfde snelheid</strong></div>
            <span className="m11-equality" aria-label="is gelijk aan">=</span>
            <div><span className="m11-label">Terugreactie</span><strong>zelfde snelheid</strong></div>
          </div>
          <p className="m11-visual-note">Concentraties blijven constant; ze zijn niet per se gelijk.</p>
        </Panel>
        <Panel title="Vergelijk Q met K">
          <dl className="m11-qk-list">
            <div><dt>Q = K</dt><dd>evenwicht</dd></div>
            <div><dt>Q &lt; K</dt><dd>netto richting producten</dd></div>
            <div><dt>Q &gt; K</dt><dd>netto richting beginstoffen</dd></div>
          </dl>
        </Panel>
        <Panel title="Kv · verdeling">
          <p className="m11-formula">Kv = [O₂(aq)] / [O₂(g)]</p>
          <p className="m11-visual-note">Vergelijk de concentraties in beide fasen.</p>
        </Panel>
        <Panel title="Ks · oplossen">
          <p className="m11-formula">Ks = [Ca²⁺] × [OH⁻]²</p>
          <p className="m11-visual-note">Voor Ca(OH)₂(s); de vaste stof staat niet in Ks.</p>
        </Panel>
        <Panel title="Kw · water">
          <p className="m11-formula">Kw = [H₃O⁺] × [OH⁻]</p>
          <p className="m11-visual-note">Gebruik pH + pOH = pKw bij de gegeven temperatuur.</p>
        </Panel>
      </div>;
    case "m11-p2-aminozuren-buffers":
      return <div className="m11-visual-grid">
        <Panel title="Aminozuur: zuur én base" className="m11-span-two">
          <div className="m11-forms">
            <div><span className="m11-label">Molecuulvorm</span><p className="m11-formula">H₂N–CH(R)–COOH</p></div>
            <span className="m11-reaction-word">kan H⁺ afstaan of opnemen</span>
            <div><span className="m11-label">Zwitterion in water</span><p className="m11-formula">⁺H₃N–CH(R)–COO⁻</p></div>
          </div>
        </Panel>
        <Panel title="Condensatie vormt een peptidebinding" className="m11-span-two">
          <div className="m11-peptide-flow">
            <p className="m11-formula">…–C(=O)–OH + H₂N–…</p>
            <span className="m11-reaction-word">condensatie · H₂O komt vrij</span>
            <p className="m11-formula">…–C(=O)–NH–…</p>
          </div>
          <p className="m11-visual-note">De gemarkeerde verbinding –C(=O)–NH– is de peptidebinding.</p>
        </Panel>
        <Panel title="Bufferpaar NH₃ / NH₄⁺" className="m11-span-two">
          <div className="m11-buffer-grid">
            <div><span className="m11-label">Toegevoegd zuur wordt opgevangen</span><p className="m11-formula">NH₃ + H₃O⁺ → NH₄⁺ + H₂O</p></div>
            <div><span className="m11-label">Toegevoegde base wordt opgevangen</span><p className="m11-formula">NH₄⁺ + OH⁻ → NH₃ + H₂O</p></div>
          </div>
        </Panel>
      </div>;
    case "m11-p3-verf":
      return <div className="m11-visual-grid">
        <Panel title="Van licht naar waarneming" className="m11-span-two">
          <div className="m11-light-sequence">
            <div><span className="m11-step-index">1</span><strong>Wit licht valt op pigment</strong></div>
            <span className="m11-flow-mark" aria-hidden="true">→</span>
            <div><span className="m11-step-index">2</span><strong>Sommige golflengten worden geabsorbeerd</strong></div>
            <span className="m11-flow-mark" aria-hidden="true">→</span>
            <div><span className="m11-step-index">3</span><strong>Overig licht bepaalt de kleur die je ziet</strong></div>
          </div>
        </Panel>
        <Panel title="Koper in oplossing">
          <div className="m11-ion-comparison">
            <div><span className="m11-label">Vrij metaalion</span><strong>Cu²⁺</strong><span>lichtblauw</span></div>
            <span className="m11-reversible" aria-label="kan afhankelijk van omstandigheden omkeren">⇌</span>
            <div><span className="m11-label">Met NH₃-liganden</span><strong>Cu²⁺ in een amminecomplex</strong><span>diepblauw</span></div>
          </div>
        </Panel>
        <Panel title="Waarneming is nog geen bewijs">
          <dl className="m11-evidence-list">
            <div><dt>Waarneming</dt><dd>De kleur verandert.</dd></div>
            <div><dt>Aanwijzing</dt><dd>De deeltjes of hun omgeving kunnen zijn veranderd.</dd></div>
            <div><dt>Beperking</dt><dd>Een kleur alleen identificeert geen uniek metaalion.</dd></div>
          </dl>
        </Panel>
      </div>;
    case "m11-p4-complexen":
      return <div className="m11-visual-grid">
        <Panel title="Centraal metaalion met liganden" className="m11-span-two">
          <div className="m11-coordination">
            <span className="m11-ligand">NH₃ · ligand</span>
            <span className="m11-ligand">NH₃ · ligand</span>
            <strong className="m11-central-ion">Cu²⁺<small>centraal metaalion</small></strong>
            <span className="m11-ligand">NH₃ · ligand</span>
            <span className="m11-ligand">NH₃ · ligand</span>
          </div>
          <p className="m11-visual-note">Schematische weergave van [Cu(NH₃)₄]²⁺; de tekening legt geen ruimtelijke vorm vast.</p>
        </Panel>
        <Panel title="Lading optellen">
          <p className="m11-formula">Cu²⁺ + 4 × NH₃ (neutraal)</p>
          <p className="m11-charge-result">complexlading: 2+</p>
          <p className="m11-visual-note">Omringingsgetal: aantal direct gebonden liganden (hier 4).</p>
        </Panel>
        <Panel title="Ligandwisseling is omkeerbaar" className="m11-span-two">
          <p className="m11-exchange-formula">[Cu(H₂O)₆]²⁺ + 4 NH₃ <span aria-label="reversibel evenwicht">⇌</span> [Cu(NH₃)₄(H₂O)₂]²⁺ + 4 H₂O</p>
          <p className="m11-visual-note">Vier waterliganden worden vervangen door vier ammoniakliganden; het metaalion blijft Cu²⁺.</p>
        </Panel>
      </div>;
    case "m11-p5-verfdrogen":
      return <div className="m11-visual-grid">
        <Panel title="Radicale kettingreactie" className="m11-span-two">
          <ol className="m11-radical-steps">
            <li><span className="m11-step-index">1</span><div><strong>Initiatie</strong><p className="m11-formula">R–R → R• + •R</p><span>Er ontstaan radicalen.</span></div></li>
            <li><span className="m11-step-index">2</span><div><strong>Propagatie</strong><p className="m11-formula">R• + M → R–M•</p><span>De keten groeit; een radicaal blijft over.</span></div></li>
            <li><span className="m11-step-index">3</span><div><strong>Terminatie</strong><p className="m11-formula">R• + •R′ → R–R′</p><span>Radicalen worden verbruikt.</span></div></li>
          </ol>
          <p className="m11-visual-note">Radicalen zijn hier schematisch getekend; de precieze initiatiestap hangt af van het reactiemechanisme.</p>
        </Panel>
        <Panel title="Fysisch drogen">
          <strong className="m11-drying-label">Oplosmiddel verdampt</strong>
          <p>De verfstof wordt daardoor niet chemisch omgezet.</p>
        </Panel>
        <Panel title="Chemisch drogen">
          <strong className="m11-drying-label">Nieuwe bindingen ontstaan</strong>
          <p>Bindmiddelketens kunnen aan elkaar koppelen tot een netwerk.</p>
        </Panel>
      </div>;
    case "m11-p6-atoommodel":
      return <div className="m11-visual-grid">
        <Panel title="Overgangen tussen energieniveaus" className="m11-span-two">
          <svg className="m11-energy-svg" viewBox="0 0 520 190" role="img" aria-labelledby="m11-energy-title m11-energy-desc">
            <title id="m11-energy-title">Absorptie en emissie tussen twee energieniveaus</title>
            <desc id="m11-energy-desc">Een elektron neemt bij absorptie energie op en gaat naar een hoger niveau. Bij emissie valt het naar een lager niveau en zendt een foton uit. De tekening is schematisch.</desc>
            <defs>
              <marker id="m11-energy-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--blue)" />
              </marker>
            </defs>
            <text x="24" y="62" className="m11-energy-label">hoger niveau</text>
            <text x="24" y="152" className="m11-energy-label">lager niveau</text>
            <line x1="160" y1="56" x2="490" y2="56" className="m11-energy-level" />
            <line x1="160" y1="146" x2="490" y2="146" className="m11-energy-level" />
            <line x1="205" y1="135" x2="205" y2="72" className="m11-energy-transition" markerEnd="url(#m11-energy-arrow)" />
            <line x1="348" y1="68" x2="348" y2="132" className="m11-energy-transition" markerEnd="url(#m11-energy-arrow)" />
            <circle cx="205" cy="145" r="5" className="m11-energy-electron" />
            <circle cx="348" cy="57" r="5" className="m11-energy-electron" />
            <text x="224" y="94" className="m11-energy-label">absorptie</text>
            <text x="224" y="113" className="m11-energy-small">foton opgenomen</text>
            <text x="368" y="94" className="m11-energy-label">emissie</text>
            <text x="368" y="113" className="m11-energy-small">foton uitgezonden</text>
          </svg>
          <p className="m11-visual-note">Een energieniveauschema; de afstanden zijn niet op schaal.</p>
        </Panel>
        <Panel title="Van schil naar orbitaal" className="m11-span-two">
          <div className="m11-shell-hierarchy">
            <div><span className="m11-step-index">1</span><strong>Schil</strong><span>hoofdenergieniveau</span></div>
            <span className="m11-flow-mark" aria-hidden="true">→</span>
            <div><span className="m11-step-index">2</span><strong>Subschil</strong><span>bijvoorbeeld s, p, d of f</span></div>
            <span className="m11-flow-mark" aria-hidden="true">→</span>
            <div><span className="m11-step-index">3</span><strong>Orbitaal</strong><span>ruimte waar elektronen kunnen worden aangetroffen</span></div>
          </div>
          <p className="m11-valence-note"><strong>Valentie-elektronen:</strong> de elektronen in de buitenste bezette schil.</p>
        </Panel>
      </div>;
  }
}
