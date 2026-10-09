(function(global) {
  "use strict";
  var chapters = [
    {id:"r",module:"M10 §4",title:"Redox & evenwicht",chapter:"4",source:"M10 practicum 4, boekpagina 4-1 t/m 4-10",minutes:65,blurb:"Van elektrodepotentiaal naar evenwichtsvoorwaarde.",concepts:["elektrodepotentiaal","aflopend vs. niet-aflopend","concentratiebreuk","reactiequotiënt Q"],links:[],tasks:[
      {id:"r1",tier:"basis",type:"choice",stem:"De reactie Zn + Cu²⁺ → Zn²⁺ + Cu verloopt spontaan. Welke stof staat elektronen af?",options:["Zn","Cu²⁺","Zn²⁺","Cu"],answer:0,why:"Zink verandert van Zn naar Zn²⁺: het staat twee elektronen af en is dus de reductor.",hints:["Volg welke lading toeneemt.","Oxidatie is het afstaan van elektronen."]},
      {id:"r2",tier:"methode",type:"choice",stem:"Voor Co(s) + Ni²⁺(aq) ⇌ Co²⁺(aq) + Ni(s): welke concentratiebreuk hoort erbij?",options:["[Co²⁺] / [Ni²⁺]","[Ni²⁺] / [Co²⁺]","[Co]·[Ni²⁺] / ([Co²⁺]·[Ni])","[Co²⁺]·[Ni²⁺]"],answer:0,why:"De concentraties van vaste stoffen komen niet in de evenwichtsbreuk. Product rechts boven, reagens links onder.",hints:["Stof Co en stof Ni zijn vaste stoffen.","Alleen variabele concentraties komen in de breuk."]},
      {id:"r3",tier:"toepassing",type:"number",stem:"Voor hetzelfde evenwicht geldt K = 13. Je meet [Co²⁺] = 0,065 mol/L. Welke [Ni²⁺] in mol/L hoort bij evenwicht?",answer:0.005,tolerance:0.00015,unit:"mol/L",why:"13 = 0,065 / [Ni²⁺], dus [Ni²⁺] = 0,065 / 13 = 0,0050 mol/L.",hints:["Gebruik K = [Co²⁺]/[Ni²⁺].","Maak [Ni²⁺] eerst vrij."]},
      {id:"r4",tier:"transfer",type:"choice",stem:"Hetzelfde evenwicht heeft K = 13. Gemeten: [Co²⁺] = 0,020 M en [Ni²⁺] = 0,010 M. Wat gebeurt er?",options:["Naar rechts totdat Q = K","Naar links totdat Q = K","Geen reactie, want Q = K","Alle vaste stof verdwijnt"],answer:0,why:"Q = 0,020 / 0,010 = 2; Q < K (13), dus meer producten moeten ontstaan: verschuiving naar rechts.",hints:["Bereken eerst Q.","Vergelijk Q=2 met K=13."]},
    ]},
    {id:"a",module:"M10 §6",title:"Zuren, basen & K",chapter:"6",source:"M10 practicum 6, boekpagina 6-1 en verder",minutes:75,blurb:"Waarom een zwak zuur anders rekent dan een sterk zuur.",concepts:["sterk en zwak","Kz en Kb","x-schema","pH en significantie"],tasks:[
      {id:"a1",tier:"basis",type:"choice",stem:"Een oplossing bevat 0,10 M NH₃. Waarom mag je niet zomaar [OH⁻] = 0,10 M nemen?",options:["NH₃ is een zwakke base; slechts een deel reageert","NH₃ is geen base","OH⁻ is altijd 10⁻⁷ M","Water bevat geen H⁺"],answer:0,why:"Ammoniak reageert in een evenwicht met water. De beginconcentratie NH₃ is niet gelijk aan de gevormde [OH⁻].",hints:["Is de reactie aflopend of niet-aflopend?","Bij een zwakke base stel je een evenwicht op."]},
      {id:"a2",tier:"methode",type:"choice",stem:"Voor NH₃ + H₂O ⇌ NH₄⁺ + OH⁻: wat is Kb?",options:["[NH₄⁺][OH⁻] / [NH₃]","[NH₃] / ([NH₄⁺][OH⁻])","[NH₄⁺][OH⁻][H₂O]","[NH₃][OH⁻] / [NH₄⁺]"],answer:0,why:"Water is hier oplosmiddel en wordt weggelaten. Productconcentraties in de teller; NH₃ in de noemer.",hints:["Kijk naar producten versus uitgangsstof.","H₂O als oplosmiddel heeft nagenoeg constante concentratie."]},
      {id:"a3",tier:"toepassing",type:"number",stem:"Een sterk zuur is volledig opgelost en levert [H₃O⁺] = 0,0020 mol/L. Bereken de pH (let op decimalen).",answer:2.7,tolerance:0.015,requiredDecimals:2,unit:"pH",why:"pH = −log(0,0020) = 2,70. Twee significante cijfers in de concentratie geven twee decimalen in de pH.",hints:["Gebruik pH = −log[H₃O⁺].","Bij pH hoort het aantal decimalen bij de significante cijfers van [H₃O⁺]."],displayAnswer:"2,70"},
      {id:"a4",tier:"transfer",type:"choice",stem:"Bij een zwak zuur gebruik je Kz = x²/(c₀−x). Wanneer mag je ongeveer c₀−x ≈ c₀ nemen?",options:["Als x klein is tegenover c₀, en je dat achteraf controleert","Altijd als het zuur verdund is","Alleen bij sterke zuren","Als de pH lager dan 7 is"],answer:0,why:"De verwaarlozing van x moet gerechtvaardigd zijn; bijvoorbeeld controle of x minder dan circa 5% van c₀ is.",hints:["Welke aanname maak je eigenlijk?","Controleer de verhouding x/c₀."]},
    ]},
    {id:"v",module:"M11 P1",title:"Verdeling, oplosbaarheid & water",chapter:"1",source:"M11 practicum 1, boekpagina 1-1 t/m 1-8",minutes:80,blurb:"Eerst verdelingsevenwicht, daarna Ks, vervolgens Kw en pOH.",concepts:["Kv","Ks","Kw","pH en pOH"],tasks:[
      {id:"v1",tier:"basis",type:"choice",stem:"Wat is een verdelingsevenwicht?",options:["Een stof verdeelt zich tussen twee fasen zonder nieuwe stof te vormen","Een neerslagreactie die altijd afloopt","Een chemische verbranding","Een oplossing waarin alle concentraties gelijk zijn"],answer:0,why:"Bij O₂(g) ⇌ O₂(aq) gaat het om verdeling tussen gas en water, geen verandering naar een nieuwe stof.",hints:["Denk aan zuurstof in water en in lucht.","Zijn de moleculen chemisch veranderd?"]},
      {id:"v2",tier:"methode",type:"choice",stem:"Ca(OH)₂(s) ⇌ Ca²⁺(aq) + 2OH⁻(aq). Wat is Ks?",options:["[Ca²⁺][OH⁻]²","[Ca²⁺][OH⁻]","[Ca(OH)₂] / ([Ca²⁺][OH⁻]²)","[Ca²⁺]²[OH⁻]"],answer:0,why:"De vaste stof telt niet mee; de coëfficiënt 2 bij OH⁻ wordt exponent 2.",hints:["Neem geen concentratie van de vaste stof op.","Gebruik de stoichiometrische coëfficiënten als exponenten."]},
      {id:"v3",tier:"toepassing",type:"number",stem:"Bij 25°C heeft een oplossing pH = 9,20. Bereken de pOH.",answer:4.8,tolerance:0.015,requiredDecimals:2,unit:"pOH",why:"Bij 25°C geldt pH + pOH = 14,00, dus pOH = 14,00 − 9,20 = 4,80.",hints:["Gebruik Kw bij 25°C.","pH + pOH = 14,00."],displayAnswer:"4,80"},
      {id:"v4",tier:"transfer",type:"number",stem:"Ca(OH)₂ lost op volgens Ca(OH)₂ ⇌ Ca²⁺ + 2OH⁻. Als [Ca²⁺] = 0,010 M, bereken Ks.",answer:0.000004,tolerance:0.00000015,unit:"mol³/L³",why:"[OH⁻] = 0,020 M. Ks = 0,010 × (0,020)² = 4,0 × 10⁻⁶.",hints:["Bij iedere Ca²⁺ ontstaan twee OH⁻.","Ks = [Ca²⁺] × [OH⁻]²."],displayAnswer:"4,0 × 10⁻⁶"},
    ]},
    {id:"b",module:"M11 P2",title:"Buffers & aminozuren",chapter:"2",source:"M11 practicum 2, boekpagina 2-1 t/m 2-5",minutes:70,blurb:"Zuur-basereacties, peptidebinding en bufferwerking.",concepts:["geconjugeerd paar","buffer","condensatie","pH in het lichaam"],tasks:[
      {id:"b1",tier:"basis",type:"choice",stem:"Welk paar is een geconjugeerd zuur-basepaar?",options:["H₂CO₃ en HCO₃⁻","HCl en NaOH","H₂O en H₂","CO₂ en O₂"],answer:0,why:"De deeltjes verschillen precies één H⁺. Een zuur kan dat proton afstaan en wordt zijn geconjugeerde base.",hints:["Zoek een paar dat exact één proton verschilt.","Denk aan koolzuur en waterstofcarbonaat."]},
      {id:"b2",tier:"methode",type:"choice",stem:"Een buffer bevat een zwak zuur HA en zijn geconjugeerde base A⁻. Je voegt een kleine hoeveelheid H⁺ toe. Wat reageert vooral?",options:["A⁻ bindt H⁺ en vormt HA","HA vormt extra H⁺","Water verdampt","De buffer wordt onmiddellijk neutraal"],answer:0,why:"De geconjugeerde base vangt toegevoegde protonen op; daardoor verandert de pH minder sterk.",hints:["Welk deeltje kan H⁺ opnemen?","De base A⁻ is de protonacceptor."]},
      {id:"b3",tier:"toepassing",type:"choice",stem:"Wat gebeurt bij het vormen van een peptidebinding tussen twee aminozuren?",options:["Een condensatiereactie: water komt vrij","Een additiereactie: water wordt opgenomen","Een redoxreactie: elektronen worden uitgewisseld","Een neerslagreactie"],answer:0,why:"De zuurgroep en aminogroep reageren en er ontstaat een C(=O)–N-binding, met afsplitsing van H₂O.",hints:["Vergelijk een OH van COOH en H van NH₂.","Condensatie is afsplitsing van een klein molecuul."]},
      {id:"b4",tier:"transfer",type:"choice",stem:"Waarom verandert bloed-pH minder sterk na toevoeging van een klein beetje zuur dan zuiver water?",options:["Een bufferpaar neemt toegevoegde protonen op","Het bloed bevat geen water","De pH is altijd exact 7","Toegevoegd zuur kan nooit reageren"],answer:0,why:"Bufferparen, waaronder koolzuur/waterstofcarbonaat, reageren met toegevoegde H⁺ en beperken de pH-verandering.",hints:["Denk aan wat HCO₃⁻ kan doen.","Bufferwerking berust op evenwichtsreacties."]},
    ]},
    {id:"c",module:"M11 P3",title:"Kleurwaarneming naar verklaring",chapter:"3",source:"M11 practicum 3, boekpagina 3-1 t/m 3-6",minutes:70,blurb:"Proefresultaat begrijpen vóór je aan complexe ionen begint.",concepts:["waarneming","verklaring","ijzerionen","BINAS redox"],tasks:[
      {id:"c1",tier:"basis",type:"choice",stem:"Je voegt een reagens toe en ziet een kleurverandering. Wat is een WAARNEMING?",options:["De oplossing verandert van geel naar rood","Er vormt zich een ijzercomplex","Het evenwicht schuift naar rechts","Het metaal heeft oxidatiegetal +3"],answer:0,why:"Een waarneming beschrijft wat je direct ziet. Een verklaring of deeltjesmodel is een interpretatie.",hints:["Wat kun je letterlijk met je ogen vaststellen?","Een complex-ion is een chemische verklaring, geen waarneming."]},
      {id:"c2",tier:"methode",type:"choice",stem:"Je moet bepalen of Fe³⁺ met I⁻ kan reageren. Waar vind je de relevante redoxgegevens?",options:["BINAS-tabel 48","BINAS-tabel 52 (indicatoren)","BINAS-tabel 45 (oplosbaarheid)","BINAS-tabel 58 (bindingsenergie)"],answer:0,why:"Voor oxidator- en reductorkoppels gebruik je de redoxreeks in BINAS 48.",hints:["Je vergelijkt oxidator en reductor.","Kies de tabel met standaardredoxpotentialen."]},
      {id:"c3",tier:"toepassing",type:"choice",stem:"Een oplossing van een ijzerzout vertoont een onverwacht andere kleur na toevoegen van een ligand. Welke hypothese test je eerst?",options:["Er ontstaan mogelijk complexe ionen","Het element ijzer is verdwenen","Er kan geen chemisch evenwicht meer zijn","Alle atomen zijn radioactief geworden"],answer:0,why:"De liganden rond een centraal ion kunnen veranderen en zo ook de waargenomen kleur; dit leidt naar practicum 4.",hints:["Denk aan de omgeving rond het metaalion.","Het metaal blijft aanwezig maar de coördinatie kan veranderen."]},
      {id:"c4",tier:"transfer",type:"explain",stem:"Een leerling zegt: 'De oplossing wordt rood, dus er moet altijd meer Fe³⁺ zijn.' Leg in 2–4 zinnen uit waarom die conclusie te snel is.",answer:"Kleur alleen bewijst geen vrije Fe³⁺-concentratie. Een kleur kan horen bij een ander complex-ion of een veranderde verdeling van deeltjes. Vergelijk waarnemingen met de verwachte reacties en controleer met geschikte reagentia.",rubric:["Maak onderscheid tussen kleur en concentratie.","Noem een mogelijke complexvorming.","Zeg welke extra chemische controle nodig is."],why:"Waarneming en model zijn niet hetzelfde; precies die scheiding is de brug naar de verklaring in practicum 4.",hints:["Kun je uit één kleur de samenstelling ondubbelzinnig afleiden?","Wat kan er met een ion gebeuren als liganden aanwezig zijn?"]},
    ]},
    {id:"k",module:"M11 P4",title:"Complexe ionen",chapter:"4",source:"M11 practicum 4, boekpagina 4-1 t/m 4-5",minutes:95,blurb:"De opbouw blijft intact: proef → ligand → complex → evenwicht.",concepts:["centraal ion","ligand","complexlading","Le Châtelier"],tasks:[
      {id:"k1",tier:"basis",type:"choice",stem:"Wat is in een complex-ion het centrale deeltje?",options:["Meestal een metaalion waar liganden aan binden","Altijd water","Altijd een elektron","Het anion buiten het complex"],answer:0,why:"Een complex wordt gevormd rond een centraal deeltje, vaak een overgangsmetaalion zoals Cu²⁺.",hints:["Denk aan Cu²⁺ omringd door moleculen.","Wie zit in het midden van het complex?"]},
      {id:"k2",tier:"methode",type:"number",stem:"Een complex heeft Fe³⁺ als centraal ion en zes CN⁻-liganden. Wat is de netto lading? (Typ het getal, bijv. -2.)",answer:-3,tolerance:0.001,unit:"lading",why:"+3 + 6 × −1 = −3; het complex is [Fe(CN)₆]³⁻.",hints:["Fe³⁺ draagt +3.","Zes cyanide-ionen dragen samen −6."]},
      {id:"k3",tier:"toepassing",type:"choice",stem:"Voor Cu(H₂O)₄²⁺ + 4Cl⁻ ⇌ CuCl₄²⁻ + 4H₂O: wat gebeurt er als je extra Cl⁻ toevoegt?",options:["Evenwicht verschuift naar rechts","Evenwicht verschuift naar links","De lading van Cu verandert","Geen effect mogelijk"],answer:0,why:"Het evenwicht verbruikt toegevoegde chloride-ionen, dus volgens Le Châtelier verschuift het naar rechts.",hints:["Cl⁻ staat links van de pijl.","Hoe kan het systeem de toevoeging tegenwerken?"]},
      {id:"k4",tier:"transfer",type:"explain",stem:"Een koperoplossing verandert van kleur na toevoegen van Cl⁻, en keert grotendeels terug na sterke verdunning met water. Verklaar beide stappen via hetzelfde evenwicht.",answer:"Extra Cl⁻ bevoordeelt het chlorocomplex; de verdeling over complex-ionen en daardoor de kleur verandert. Na toevoeging van veel water wordt de vorming van het aquacomplex weer bevoordeeld, waardoor de oorspronkelijke kleur grotendeels terugkeert.",rubric:["Noem complex-ionen of liganduitwisseling.","Leg toevoeging van chloride via verschuiving uit.","Leg verdunning via omgekeerde verschuiving uit."],why:"Dit is een transferopgave: een waarneembare kleurverandering moet je met één chemisch model verklaren.",hints:["Gebruik het evenwicht uit de vorige opgave.","Welke kant wordt relatief gunstiger bij meer water?"]},
    ]},
    {id:"p",module:"M11 P5",title:"Reactiemechanismen & verf",chapter:"5",source:"M11 practicum 5, boekpagina 5-1 t/m 5-11",minutes:110,blurb:"De keten: licht → radicalen → propagatie → terminatie → polyadditie.",concepts:["radicaal","initiatie","propagatie","terminatie","bindingsenergie"],tasks:[
      {id:"p1",tier:"basis",type:"choice",stem:"Waarom kan UV-licht een substitutiereactie met chloor op gang brengen?",options:["Het kan de Cl–Cl-binding homolytisch verbreken","Het maakt chloor meteen tot een sterk zuur","Het zorgt voor ionbinding tussen Cl₂ en water","Het schakelt alle reacties uit"],answer:0,why:"UV-fotonen kunnen leiden tot homolytische splitsing van Cl₂ in twee reactieve Cl•-radicalen.",hints:["Wat moet eerst uit Cl₂ ontstaan?","Denk aan initiatie van een radicalenkettingreactie."]},
      {id:"p2",tier:"methode",type:"choice",stem:"Welke stap is een terminatiestap in een radicalenkettingreactie?",options:["Cl• + Cl• → Cl₂","Cl₂ → 2Cl• door UV","Cl• + CH₄ → HCl + CH₃•","CH₃• + Cl₂ → CH₃Cl + Cl•"],answer:0,why:"Twee radicalen combineren tot een niet-radicaal; daarmee verdwijnen reactieve ketendragers.",hints:["Bij terminatie verdwijnen radicalen.","Kies de reactie zonder radicaalproduct."]},
      {id:"p3",tier:"toepassing",type:"number",stem:"Gegeven bindingsenergieën: C=C 614 kJ/mol en C–C 348 kJ/mol. Hoeveel kJ/mol kost het netto om C=C tot C–C te veranderen?",answer:266,tolerance:1,unit:"kJ/mol",why:"Je verbreekt niet alle bindingen in het molecuul: voor C=C → C–C is de nettokost 614 − 348 = 266 kJ/mol.",hints:["Bedenk welke binding vóór én na aanwezig is.","Netto verschil: E(C=C) − E(C–C)."]},
      {id:"p4",tier:"transfer",type:"explain",stem:"Waarom kan een radicalenpolymerisatie na een korte UV-belichting doorlopen, terwijl een andere reactie voortdurende belichting nodig heeft? Gebruik initiatie, propagatie en terminatie.",answer:"Bij een kettingmechanisme worden radicalen door initiatie gevormd en in propagatiestappen steeds opnieuw geproduceerd, zodat de keten kan doorgaan zonder voortdurend nieuw licht. Terminatie verwijdert radicalen. Als radicalen niet worden doorgegeven of steeds verdwijnen, is voortdurende initiatie door licht nodig.",rubric:["Leg initiatie met UV uit.","Leg voortzetting via propagatie uit.","Leg uit hoe terminatie of ontbreken van ketenoverdracht het verschil maakt."],why:"Je moet het mechanisme gebruiken als verklaring en niet alleen de namen van de stappen opnoemen.",hints:["Leveren propagatiestappen telkens een nieuw radicaal op?","Wat gebeurt er met de keten bij terminatie?"]},
    ]},
    {id:"q",module:"M11 P6",title:"Atoommodellen & spectra",chapter:"6",source:"M11 practicum 6, vooral 6.3, 6.4, 6.6 en 6.7; §6.5 buiten toets",minutes:95,blurb:"Na model en energieniveau kun je licht en ionisatie verklaren.",concepts:["Bohr","energieniveaus","absorptie/emissie","ionisatie"],tasks:[
      {id:"q1",tier:"basis",type:"choice",stem:"Wat is de belangrijkste uitbreiding van Bohr ten opzichte van Rutherford?",options:["Elektronen kunnen slechts bepaalde energieniveaus innemen","Een atoom heeft geen kern","Elektronen zijn positief geladen","Ieder atoom bevat evenveel protonen als neutronen"],answer:0,why:"Bohr gebruikt discrete energieniveaus, waarmee specifieke spectra verklaard kunnen worden.",hints:["Waarom zijn lijnspectra geen continu spectrum?","Denk aan toegestane waarden voor elektronenergie."]},
      {id:"q2",tier:"methode",type:"choice",stem:"Een elektron valt van een hoger naar een lager energieniveau. Wat ontstaat?",options:["Een foton met energie ΔE","Er wordt altijd een elektron afgestoten","Er wordt geen energie uitgewisseld","Een proton verdwijnt"],answer:0,why:"Bij emissie wordt het energieverschil als foton uitgezonden: ΔE = hf.",hints:["Is dit absorptie of emissie?","De energie gaat het atoom uit als elektromagnetische straling."]},
      {id:"q3",tier:"toepassing",type:"number",stem:"Een overgang heeft ΔE = 4,0 × 10⁻¹⁹ J. Gebruik h = 6,63 × 10⁻³⁴ J s. Geef de frequentie in 10¹⁴ Hz (dus typ alleen het getal voor ×10¹⁴).",answer:6.03,tolerance:0.08,requiredSigFigs:2,unit:"×10¹⁴ Hz",why:"f = ΔE/h = 4,0 × 10⁻¹⁹ / (6,63 × 10⁻³⁴) ≈ 6,0 × 10¹⁴ Hz (2 significante cijfers).",hints:["Gebruik ΔE = hf.","De machten leveren 10¹⁵; reken ook de coëfficiënten na."],displayAnswer:"6,0"},
      {id:"q4",tier:"transfer",type:"explain",stem:"Twee elementen absorberen verschillende golflengten licht. Leg uit waarom hun absorptiespectra verschillen en hoe dit samenhangt met hun atoommodellen.",answer:"De elementen hebben verschillende toegestane energieniveaus. Alleen fotonen met energie die overeenkomt met een verschil tussen toegestane niveaus kunnen worden geabsorbeerd. Daardoor verschilt de reeks absorptielijnen per element.",rubric:["Noem discrete energieniveaus.","Verbind fotonenergie aan ΔE = hf.","Leg uit waarom de niveaus per element verschillen."],why:"Dit combineert atoombouw, kwantisering en spectra in één nieuwe context.",hints:["Welke energie moet een foton hebben voor een overgang?","Zijn de mogelijke energieniveaus bij alle elementen gelijk?"]},
    ]}
  ];

  // The real schoolbooks are scaffolding, not a shuffled bank of isolated exercises.
  // Section pointers are recommendations; they are not copyrighted exercise reproductions.
  var methodFlow={
    r:[
      ["4.1–4.3","Lees de elektrochemische proefopstelling; verklaar de potentiaal en waarom de reactie stopt.","Potentiaal, elektronoverdracht en evenwicht"],
      ["4.4–4.6","Volg de stapsgewijze molverhouding en concentratiebreuk; rekenschema uitschrijven.","Stoichiometrie en K"],
      ["4.7–4.8","Gebruik de ingebouwde Test-jezelf-opgaven uit het boek als eindcontrole.","Nieuwe context en Q vs K"]
    ],
    a:[
      ["6.1–6.4","Werk de zuur-base-reacties op volgorde af en verklaar Kz en Kb.","Conjugaten en zwakke zuren/basen"],
      ["6.5–6.6","Herken sterke en zwakke zuren en basen; bouw eerst het x-schema.","Concentratie en pH"],
      ["6.7–6.8","Maak de zelfstandige pH-vragen en controleer de kleine-x-aanname.","Kwadratisch en verwaarlozing"]
    ],
    v:[
      ["1.1–1.2","Begin bij verdeling in twee fasen; ga via oplosbaarheid naar Ks.","Kv en Ks"],
      ["1.3–1.5","Volg eerst de afleiding van het waterevenwicht en Kw.","Waterevenwicht"],
      ["1.6–1.7","Maak pH/pOH-berekeningen met afronding en significantie.","pH, pOH en significantie"]
    ],
    b:[
      ["2.1–2.2","Bouw peptidevorming en de zure/basische groepen op.","Zuur-base in aminozuren"],
      ["2.3–2.4","Volg via de hulpvragen de berekening en vervolgens bufferwerking in bloed.","Buffers in context"]
    ],
    c:[
      ["3.1–3.2","Lees de verfcontext en onderscheid voorspelling van waarneming.","Waarnemen en verklaren"],
      ["3.3–3.5","Volg eerst de ijzerproeven, dan koper en complex-vorming.","Reagentia en ionen"],
      ["3.6–3.7","Verbind de proefresultaten met verklaringen en test je hypothesen.","Voorbereiding op P4"]
    ],
    k:[
      ["4.1–4.2","Begin met kleurwaarneming, voeg chloride, water en ammoniak stapsgewijs toe.","Liganduitwisseling"],
      ["4.3–4.4","Werk vanuit de waarneming naar de deeltjesreacties.","Complexe evenwichten"],
      ["4.5–4.7","Berlijns blauw, centrale ionen, liganden en evenwichtsverschuivingen.","Nieuwe complexe context"]
    ],
    p:[
      ["5.1–5.2","Kijk naar fysische versus chemische droging en de rol van licht.","Verf en droging"],
      ["5.3–5.5","Volg initiatie, propagatie en terminatie in substitutie stap voor stap.","Radicaalketen"],
      ["5.6–5.7","Beredeneer activeringsenergie, botsingen en reactiesnelheid.","Kinetiek"],
      ["5.8–5.10","Ga via additie en bindingsenergie naar polyadditie.","Polymerisatie en bindingen"]
    ],
    q:[
      ["6.1–6.2","Alleen lezen volgens de eerder vastgelegde toetsafbakening.","Kleur en model"],
      ["6.3–6.4","Rutherford en Bohr: begrijp de opbouw vóór het gebruik van energieniveaus.","Energieniveaus"],
      ["6.6–6.7","Ga door met het aangepaste model en verklaringen voor atoom-/ionbinding.","Kwantisering en elektronen"]
    ]
  };
  chapters.forEach(function(c){c.methodSteps=(methodFlow[c.id]||[]).map(function(x,i){return {sequence:i+1,sections:x[0],instruction:x[1],goal:x[2]}})});
  var allTasks=chapters.flatMap(function(ch){return ch.tasks.map(function(t){return Object.assign({},t,{unitId:ch.id,module:ch.module,unitTitle:ch.title,source:ch.source})})});
  var byId=Object.fromEntries(allTasks.map(function(t){return [t.id,t]}));
  var order=Object.fromEntries(allTasks.map(function(t,i){return [t.id,i]}));
  function blank(){return {version:2,createdAt:new Date().toISOString(),attempts:[],mode:"assessment",focus:null,sessionStart:null,sessionPause:0,sessionMinutes:0};}
  function sanitize(v){if(!v || v.version!==2 || !Array.isArray(v.attempts))return blank();return Object.assign(blank(),v,{attempts:v.attempts.filter(function(a){return a && byId[a.id] && typeof a.at==="string" && typeof a.correct==="boolean"}).slice(-700)});}
  function history(state,id){return state.attempts.filter(function(a){return a.id===id});}
  function independentPass(state,id){var h=history(state,id);return !!h.length && h[h.length-1].correct && h[h.length-1].independent}
  function mastery(state,unit){var tasks=unit.tasks;var passed=tasks.filter(function(t){return independentPass(state,t.id)}).length;return {passed:passed,total:tasks.length,percent:Math.round(passed/tasks.length*100)}}
  function weakness(state,unit){var at=state.attempts.filter(function(a){return byId[a.id].unitId===unit.id});var mistakes=at.filter(function(a){return !a.correct || !a.independent}).length;return {mistakes:mistakes,attempts:at.length}}
  function tomorrow(iso){return Date.parse(iso)+20*60*60*1000;}
  function due(state,now){var t=now||Date.now();return allTasks.filter(function(q){var h=history(state,q.id); if(!h.length || independentPass(state,q.id))return false;return t>=tomorrow(h[h.length-1].at)})}
  function choose(state){
    var focus=state.focus;
    if(state.mode==="assessment"){
      var anchors=chapters.map(function(c){return byId[c.tasks[0].id]});
      return anchors.find(function(t){return history(state,t.id).length===0})||null;
    }
    if(state.mode==="review"){return due(state)[0]||allTasks.find(function(t){return history(state,t.id).length && !independentPass(state,t.id)})||null;}
    if(state.mode==="exam"){
      var tested=allTasks.filter(function(t){return t.tier==="transfer"||t.tier==="toepassing"});
      return tested.sort(function(a,b){return history(state,a.id).length-history(state,b.id).length || order[a.id]-order[b.id]})[0];
    }
    var set=focus?chapters.filter(function(c){return c.id===focus}):chapters;
    if(focus && set.length && set[0].tasks.every(function(t){return history(state,t.id).length>0})){set=chapters;}
    var pending=due(state).filter(function(t){return set.some(function(c){return c.id===t.unitId})});
    if(pending.length)return pending[0];
    // New independent transfer exercises must take precedence over instant repeats.
    // A failed exercise is revisited after spacing, so seeing a model answer cannot
    // make the very next identical attempt appear as mastery.
    for(var i=0;i<set.length;i++){
      var unit=set[i];var newItem=unit.tasks.find(function(t){return history(state,t.id).length===0});
      if(newItem)return byId[newItem.id];
    }
    return null;
  }
  function parseNumber(raw){var s=String(raw).trim().replace(/\s/g,"").replace(",",".").replace(/×/g,"x").replace(/[−–]/g,"-");
    if(/^[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(s))return Number(s);
    var m=s.match(/^([+-]?\d+(?:\.\d+)?)[x*]10\^?([+-]?\d+)$/i);if(m)return Number(m[1])*Math.pow(10,Number(m[2]));
    return NaN;
  }
  function evaluate(q,response){
    if(q.type==="choice")return {automatic:true,correct:Number(response)===q.answer};
    if(q.type==="number"){
      var n=parseNumber(response),valueCorrect=Number.isFinite(n)&&Math.abs(n-q.answer)<=q.tolerance;
      var s=String(response).trim().replace(",",".").replace(/[−–]/g,"-");
      var precisionCorrect=true;
      if(q.requiredDecimals!=null){
        var dec=s.match(/^[+-]?\d+(?:\.(\d+))?$/);
        precisionCorrect=!!dec && !!dec[1] && dec[1].length===q.requiredDecimals;
      }
      if(q.requiredSigFigs!=null){
        var mantissa=s.replace(/^[+-]/,"").split(/[eE]/)[0].replace(/[×x*]10.*$/,"");
        var digits=mantissa.replace(".","").replace(/^0+/,"");
        // Trailing zeros after a decimal point are significant.
        precisionCorrect=/^[\d.]+$/.test(mantissa) && digits.length===q.requiredSigFigs;
      }
      return {automatic:true,correct:valueCorrect&&precisionCorrect,precisionIssue:valueCorrect&&!precisionCorrect,parsed:n};
    }
    return {automatic:false,correct:null};
  }
  function sessionProgress(state){var attempts=state.attempts.filter(function(a){return state.sessionStart && a.at>=state.sessionStart});var minutes=attempts.reduce(function(s,a){return s+Math.min(30,Math.max(1,a.minutes||4))},0);return {minutes:minutes,questions:attempts.length,remaining:Math.max(0,120-minutes)}}
  function report(state){return {passed:allTasks.filter(function(t){return independentPass(state,t.id)}).length,total:allTasks.length,weak:chapters.map(function(c){return Object.assign({id:c.id,title:c.title,module:c.module},mastery(state,c),weakness(state,c))}),reviews:due(state).length,attempts:state.attempts.length};}
  global.StudyEngine={chapters:chapters,allTasks:allTasks,byId:byId,blank:blank,sanitize:sanitize,history:history,independentPass:independentPass,mastery:mastery,due:due,choose:choose,parseNumber:parseNumber,evaluate:evaluate,sessionProgress:sessionProgress,report:report};
})(window);