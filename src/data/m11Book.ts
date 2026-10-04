export interface M11BookTheorySection {
  heading: string;
  paragraphs: string[];
  keyTerms?: string[];
}

export interface M11BookWorkedExample {
  title: string;
  prompt: string;
  steps: string[];
  answer: string;
}

export interface M11BookExercise {
  id: string;
  sourceRefs: string[];
  question: string;
  hint: string;
  answer: string;
}

export interface M11BookChapter {
  lessonId: string;
  paragraph: "P3" | "P4" | "P5" | "P6";
  title: string;
  goal: string;
  contextNote: string;
  theorySections: M11BookTheorySection[];
  workedExample: M11BookWorkedExample;
  exercises: M11BookExercise[];
  checklist: string[];
  optionalNote: string;
}

export const m11BookChapters: M11BookChapter[] = [
  {
    lessonId: "m11-p3-verf",
    paragraph: "P3",
    title: "Verf en kleurreacties",
    goal: "Je gebruikt ionreacties en redox om pigmenten en metaalionen in verfmonsters te beredeneren.",
    contextNote: "De selectie begint bij 3.2. Noteer bij een proef eerst de waarneming en koppel die daarna aan de aanwezige vrije ionen.",
    theorySections: [
      {
        heading: "3.2 · Vrije en gecomplexeerde ionen",
        paragraphs: [
          "In water zijn Fe³⁺ en Cu²⁺ omringd door watermoleculen. ‘Vrij metaalion’ betekent hier dat het ion niet aan een toegevoegd ligand gebonden is. Een ligand kan een complex vormen: de totale hoeveelheid metaal blijft gelijk, maar de vrije-ionconcentratie daalt.",
          "K₃[Fe(CN)₆] bevat drie K⁺ en het complex-ion [Fe(CN)₆]³⁻. Met zes CN⁻ geldt x + 6(−1) = −3, dus Fe is +III. Houd de lading van het hele complex-ion en het oxidatiegetal van Fe uit elkaar."
        ],
        keyTerms: ["complex-ion", "ligand", "oxidatiegetal"]
      },
      {
        heading: "3.3 · Kwalitatieve tests en waarnemingen",
        paragraphs: [
          "OH⁻ vormt met vrij Fe³⁺ het roodbruine neerslag Fe(OH)₃: Fe³⁺ + 3 OH⁻ → Fe(OH)₃(s). Met vrij Cu²⁺ ontstaat blauw Cu(OH)₂: Cu²⁺ + 2 OH⁻ → Cu(OH)₂(s). Complexvorming kan één van die reacties minder zichtbaar maken doordat er minder vrij metaalion is.",
          "Noteer eerst de waarneming, zoals ‘er ontstaat een blauw neerslag’. Een verklaring koppelt die waarneming aan de deeltjesreactie. De conclusie blijft beperkt: een neerslag past bij een aanwezig vrij ion onder deze omstandigheden; geen neerslag bewijst niet dat het metaal ontbreekt."
        ],
        keyTerms: ["netto-ionvergelijking", "neerslag", "vrije ionen"]
      },
      {
        heading: "3.4 · Redox naast neerslag",
        paragraphs: [
          "Bij een neerslagreactie blijven de oxidatiegetallen gelijk. Bij redox worden elektronen overgedragen. Met jodide geldt 2 Fe³⁺ + 2 I⁻ → 2 Fe²⁺ + I₂: Fe³⁺ neemt elektronen op en I⁻ staat elektronen af.",
          "Een vergelijking moet kloppen in atomen én totale lading. Schrijf redox en neerslag als aparte verklaringen wanneer beide in een proef voorkomen."
        ],
        keyTerms: ["oxidator", "reductor", "halfreactie"]
      },
      {
        heading: "3.5–3.7 · Koperproeven en gevolgtrekkingen",
        paragraphs: [
          "Cu²⁺ vormt met OH⁻ Cu(OH)₂(s) en met CO₃²⁻ CuCO₃(s). Met I⁻ verloopt redox en ontstaat ook het slecht oplosbare CuI: 2 Cu²⁺ + 4 I⁻ → 2 CuI(s) + I₂. Een koper-ammoniakcomplex is diepblauw; die andere kleur hoort bij een andere ligandomgeving.",
          "Een verfmonster kan pigmentmengsels bevatten en een ligand kan Fe³⁺ of Cu²⁺ binden. Beschrijf daarom de waarneming, overweeg alternatieve verklaringen en gebruik zo nodig een controle of een tweede proef. Kleur alleen bewijst niet welk metaalion of pigment aanwezig is."
        ],
        keyTerms: ["pigment", "kwalitatieve analyse", "redox"]
      }
    ],
    workedExample: {
      title: "Een ijzerion aantonen",
      prompt: "Een oplossing bevat Fe³⁺. Je voegt OH⁻ toe. Stel de netto-ionvergelijking op en controleer de lading.",
      steps: [
        "Schrijf de reagerende ionen en het slecht oplosbare product: Fe³⁺ en OH⁻ vormen Fe(OH)₃(s).",
        "Er zijn drie OH⁻-ionen nodig voor één Fe³⁺-ion.",
        "Controleer: links is de totale lading +3 − 3 = 0; rechts is de vaste stof neutraal."
      ],
      answer: "Fe³⁺(aq) + 3 OH⁻(aq) → Fe(OH)₃(s). De atomen en totale lading kloppen aan beide kanten."
    },
    exercises: [
      {
        id: "m11-p3-ex1",
        sourceRefs: ["3.2a", "3.2d"],
        question: "Monster A bevat vrij Fe³⁺; in monster B is evenveel totaal ijzer aan een ligand gebonden. Wat verwacht je na toevoegen van OH⁻ en wat bewijst het uitblijven van neerslag niet?",
        hint: "Gebruik Fe³⁺ + 3 OH⁻ → Fe(OH)₃(s) en onderscheid vrij ion van totaal metaal.",
        answer: "In A kan Fe(OH)₃ ontstaan. In B kan complexvorming de vrije Fe³⁺-concentratie verlagen, zodat minder of geen zichtbaar neerslag ontstaat. Dat bewijst niet dat ijzer ontbreekt."
      },
      {
        id: "m11-p3-ex2",
        sourceRefs: ["3.3a", "3.3b"],
        question: "Schrijf de reactie van ijzer met zuur en daarna de neerslagreactie waarmee je Fe³⁺ aantoont.",
        hint: "Balanceer eerst de lading van Fe en H⁺. Voor Fe(OH)₃ zijn drie hydroxide-ionen nodig.",
        answer: "Fe + 2 H⁺ → Fe²⁺ + H₂. Voor het aantonen van Fe³⁺: Fe³⁺ + 3 OH⁻ → Fe(OH)₃(s)."
      },
      {
        id: "m11-p3-ex3",
        sourceRefs: ["3.3c", "3.3d"],
        question: "Aan een Fe³⁺-oplossing voeg je jodide toe. Geef de gebalanceerde ionvergelijking en benoem oxidator en reductor.",
        hint: "Fe³⁺ neemt één elektron op; twee I⁻-ionen staan samen twee elektronen af.",
        answer: "2 Fe³⁺ + 2 I⁻ → 2 Fe²⁺ + I₂. Fe³⁺ is de oxidator; I⁻ is de reductor."
      },
      {
        id: "m11-p3-ex4",
        sourceRefs: ["3.4a", "3.4d", "3.4f"],
        question: "Een Cu²⁺-oplossing is lichtblauw. Na overmaat NH₃ wordt zij diepblauw. Beschrijf de waarneming en geef een conclusie met een passende beperking.",
        hint: "Scheid de kleurwaarneming van de verklaring over de ligandomgeving.",
        answer: "Waarneming: lichtblauw verandert in diepblauw. Dat past bij vorming van een koper-ammoniakcomplex en een andere ligandomgeving. De kleur alleen bepaalt niet de totale hoeveelheid koper en is geen uniek bewijs voor één stof."
      },
      {
        id: "m11-p3-ex5",
        sourceRefs: ["3.5d", "3.5e", "3.5f"],
        question: "Geef de netto-ionvergelijkingen voor Cu²⁺ met OH⁻, met CO₃²⁻ en met I⁻.",
        hint: "Bij de jodideproef ontstaat naast vast CuI ook I₂; balanceer de elektronenoverdracht.",
        answer: "Cu²⁺ + 2 OH⁻ → Cu(OH)₂(s). Cu²⁺ + CO₃²⁻ → CuCO₃(s). 2 Cu²⁺ + 4 I⁻ → 2 CuI(s) + I₂."
      },
      {
        id: "m11-p3-ex6",
        sourceRefs: ["3.5g", "3.6c", "3.6d", "3.6e", "3.6f", "3.7"],
        question: "Een leerling doet een kwalitatieve proef met K₃[Fe(CN)₆] en ziet een kleurverandering, maar geen neerslag. Bepaal de lading van [Fe(CN)₆] en beschrijf wat de waarneming wel en niet bewijst.",
        hint: "Drie K⁺-ionen neutraliseren het complex-ion. Noteer daarna waarneming en gevolgtrekking apart.",
        answer: "[Fe(CN)₆] heeft lading 3−, omdat K₃[Fe(CN)₆] als geheel neutraal is. De kleurverandering is een waarneming die bij een reactie van de aanwezige deeltjes kan passen. Zonder neerslag mag je niet concluderen dat metaalionen ontbreken; complexvorming of andere proefomstandigheden kunnen de reactie beïnvloeden."
      }
    ],
    checklist: [
      "Ik bepaal een oxidatiegetal met de totale ionlading en de ligandladingen.",
      "Ik schrijf gebalanceerde netto-ionvergelijkingen voor neerslagproeven.",
      "Ik herken oxidator, reductor en elektronenoverdracht.",
      "Ik trek uit kleurproeven een conclusie met een passende beperking."
    ],
    optionalNote: "3.7 draait om gevolgtrekkingen: benoem wat de proef ondersteunt en welke alternatieve verklaring of controle relevant blijft."
  },
  {
    lessonId: "m11-p4-complexen",
    paragraph: "P4",
    title: "Complexen en vrije ionen",
    goal: "Je stelt complexformules en ladingen op en legt uit hoe complexvorming de hoeveelheid vrije metaalionen en proefresultaten beïnvloedt.",
    contextNote: "De kern ligt bij 4.2, 4.3 en 4.5–4.7. Paragraaf 4.4 is verdiepende keuzestof.",
    theorySections: [
      {
        heading: "4.2 · Liganden en oxidatiegetal",
        paragraphs: [
          "Een ligand bindt met een vrij elektronenpaar aan een centraal metaalion. NH₃ en H₂O zijn neutrale liganden; Cl⁻ en CN⁻ hebben elk lading −1. De lading van het complex is de som van de metaalionlading en alle ligandladingen.",
          "K₃Fe(CN)₆ bevat [Fe(CN)₆]³⁻ en dus Fe(III). [Fe(CN)₆]⁴⁻ bevat Fe(II). Zo kun je de oxidatietoestand uit de formule afleiden."
        ],
        keyTerms: ["centraal ion", "ligand", "omringingsgetal"]
      },
      {
        heading: "4.3 · De formule van een complex",
        paragraphs: [
          "Het omringingsgetal telt hoeveel donoratomen rechtstreeks aan het centrale ion gebonden zijn. Bij [CuCl₄]²⁻ zijn vier Cl⁻-liganden gebonden: +2 + 4(−1) = −2. Bij [Cu(NH₃)₄]²⁺ zijn vier neutrale NH₃-liganden gebonden en blijft de complexlading +2.",
          "Liganden kunnen elkaar omkeerbaar vervangen. Voor koper is een vereenvoudigd evenwicht [Cu(H₂O)₆]²⁺ + 4 NH₃ ⇌ [Cu(NH₃)₄(H₂O)₂]²⁺ + 4 H₂O. In overmaat NH₃ overheerst het diepblauwe complex; als NH₃ wordt weggenomen, verschuift de verdeling terug naar de aqua-ionen."
        ],
        keyTerms: ["complexlading", "coördinatie", "ligandwisseling"]
      },
      {
        heading: "4.5 · Evenwicht van Berlijns blauw",
        paragraphs: [
          "Een vereenvoudigd evenwicht in basisch milieu is Fe₄[Fe(CN)₆]₃(s) + 12 OH⁻(aq) ⇌ 4 Fe(OH)₃(s) + 3 [Fe(CN)₆]⁴⁻(aq). Toevoegen van HCl laat H⁺ met OH⁻ reageren. Doordat OH⁻ wordt verwijderd, verschuift dit evenwicht naar links en kan Berlijns blauw terugvormen.",
          "Volgens Le Chatelier verschuift een evenwicht zo dat een opgelegde verandering gedeeltelijk wordt tegengewerkt. Een verschuiving herverdeelt de aanwezige deeltjes; ze maakt geen extra ijzeratomen."
        ],
        keyTerms: ["evenwicht", "verschuiving", "neutralisatie"]
      },
      {
        heading: "4.6–4.7 · Complexvorming stuurt een ionproef",
        paragraphs: [
          "Een neerslagproef reageert met vrije metaalionen. Als die ionen in een complex gebonden zijn, kan de vrije concentratie dalen en kan een neerslag minder zichtbaar worden of oplossen. Totaal metaal en vrij metaalion zijn dus niet hetzelfde.",
          "Gebruik de deeltjesbalans en de evenwichtsrichting om een waarneming te verklaren. Bij een eigenschap die afhangt van het aantal opgeloste deeltjes telt ook mee hoeveel deeltjes na complexvorming zelfstandig in oplossing zijn."
        ],
        keyTerms: ["vrije concentratie", "maskering", "deeltjesaantal"]
      }
    ],
    workedExample: {
      title: "De lading van een kopercomplex",
      prompt: "Bepaal de lading van [Cu(NH₃)₄]²⁺ en [CuCl₄]²⁻ en vergelijk de liganden.",
      steps: [
        "NH₃ is neutraal. Vier NH₃-liganden veranderen de lading van Cu²⁺ niet: het complex is 2+.",
        "Elk Cl⁻ heeft lading −1. De som is +2 + 4(−1) = −2.",
        "Beide complexen hebben omringingsgetal vier; de liganden verschillen in lading en eigenschappen."
      ],
      answer: "[Cu(NH₃)₄]²⁺ en [CuCl₄]²⁻ hebben respectievelijk lading 2+ en 2−."
    },
    exercises: [
      {
        id: "m11-p4-ex1",
        sourceRefs: ["4.2"],
        question: "Leg met ladingen uit waarom K₃Fe(CN)₆ ijzer(III) bevat en [Fe(CN)₆]⁴⁻ ijzer(II).",
        hint: "CN⁻ draagt −1 bij en elk kaliumion +1.",
        answer: "Drie K⁺ maken het complex in K₃Fe(CN)₆ 3−; x − 6 = −3 geeft Fe = +3. In [Fe(CN)₆]⁴⁻ geldt x − 6 = −4, dus Fe = +2."
      },
      {
        id: "m11-p4-ex2",
        sourceRefs: ["4.3"],
        question: "Controleer de ladingen van [CuCl₄]²⁻ en [Cu(NH₃)₄]²⁺. Welke ligand is neutraal?",
        hint: "Tel de lading van het koperion en vier liganden op.",
        answer: "Cu²⁺ + vier Cl⁻ geeft −2. Cu²⁺ + vier neutrale NH₃ geeft +2. NH₃ is neutraal; Cl⁻ draagt −1 per ligand bij."
      },
      {
        id: "m11-p4-ex3",
        sourceRefs: ["4.5"],
        question: "Voor Fe₄(Fe(CN)₆)₃ + 12 OH⁻ ⇌ 4 Fe(OH)₃ + 3 [Fe(CN)₆]⁴⁻ geldt een evenwicht. Wat gebeurt er als je HCl toevoegt?",
        hint: "H⁺ uit het zuur reageert met OH⁻.",
        answer: "H⁺ verwijdert OH⁻ als water. Door de dalende OH⁻-concentratie verschuift het evenwicht naar links."
      },
      {
        id: "m11-p4-ex4",
        sourceRefs: ["4.6"],
        question: "Een metaalion vormt een stabiel complex met een kleurloos ligand. Waarom kan een neerslagproef daardoor minder neerslag geven?",
        hint: "De proef reageert met vrije ionen, niet rechtstreeks met al het gebonden metaal.",
        answer: "Complexvorming bindt een deel van de metaalionen en verlaagt de vrije concentratie. Er zijn daardoor minder vrije ionen beschikbaar om met het reagens te reageren."
      },
      {
        id: "m11-p4-ex5",
        sourceRefs: ["4.7"],
        question: "Een diepblauw koper-ammoniakcomplex staat in evenwicht met aqua-Cu²⁺ en NH₃. Wat gebeurt er met de ligandverdeling als zuur NH₃ omzet in NH₄⁺?",
        hint: "Zuur verlaagt de concentratie vrije NH₃; gebruik de ligandwisselingsvergelijking.",
        answer: "Doordat H₃O⁺ + NH₃ → NH₄⁺ + H₂O vrije NH₃ verbruikt, verschuift [Cu(H₂O)₆]²⁺ + 4 NH₃ ⇌ [Cu(NH₃)₄(H₂O)₂]²⁺ + 4 H₂O naar links. De ligandwisseling is omkeerbaar en de aqua-ionen nemen weer toe."
      }
    ],
    checklist: [
      "Ik bereken de lading van een complex met de lading van elk ligand.",
      "Ik onderscheid de lading van een complex van het oxidatiegetal van het metaal.",
      "Ik leg uit hoe een ligand de hoeveelheid vrij metaalion beïnvloedt.",
      "Ik leg uit dat ligandwisseling omkeerbaar is.",
      "Ik voorspel de richting van het Berlijns-blauwevenwicht met Le Chatelier."
    ],
    optionalNote: "Keuzeverdieping 4.4: werk een extra ligandwisselings- of complexevenwicht uit als je meer oefening wilt. De kernroute in dit hoofdstuk blijft bij 4.2, 4.3 en 4.5–4.7."
  },
  {
    lessonId: "m11-p5-verfdrogen",
    paragraph: "P5",
    title: "Verf drogen en polymeren",
    goal: "Je verklaart hoe verf droogt en koppelt radicalen, lichtenergie, botsingen en polymerisatie aan de eigenschappen van het gevormde materiaal.",
    contextNote: "De selectie slaat 5.1 en 5.2 over en vat 5.3–5.10 samen rond reactiemechanismen, energie en materiaaleigenschappen.",
    theorySections: [
      {
        heading: "5.3 · Een radicale kettingreactie",
        paragraphs: [
          "Een radicaal heeft een ongepaard elektron en reageert daardoor gemakkelijk. Bij radicaalsubstitutie vervangt een halogeenatoom een H-atoom in een alkaan. Bij methaan en chloor onder UV-licht is de totale reactie CH₄ + Cl₂ → CH₃Cl + HCl.",
          "Initiatie: Cl₂ + hν → 2 Cl•. Propagatie: Cl• + CH₄ → HCl + CH₃•, daarna CH₃• + Cl₂ → CH₃Cl + Cl•. Terminatie verbruikt radicalen, bijvoorbeeld Cl• + Cl• → Cl₂. Volg per stap of een radicaal ontstaat, wordt doorgegeven of verdwijnt."
        ],
        keyTerms: ["radicaal", "initiatie", "propagatie", "terminatie"]
      },
      {
        heading: "5.4–5.5 · Bindingsenergie en licht",
        paragraphs: [
          "Een binding verbreken kost energie; een binding vormen levert energie op. Voor licht geldt E = h·c/λ: een kortere golflengte hoort bij een foton met meer energie. Zet nanometer eerst om naar meter.",
          "De energie per mol fotonen vind je door de energie per foton met de constante van Avogadro te vermenigvuldigen. Vergelijk deze energie met de energie die nodig is om een binding te verbreken."
        ],
        keyTerms: ["bindingsenergie", "foton", "golflengte"]
      },
      {
        heading: "5.6 · Botsingen en reactiesnelheid",
        paragraphs: [
          "Deeltjes reageren alleen bij een effectieve botsing: ze moeten voldoende energie hebben om de activeringsenergie te bereiken en gunstig georiënteerd zijn. Een hogere temperatuur vergroot het aandeel botsingen met genoeg energie.",
          "Licht kan een reactie starten wanneer een geabsorbeerd foton voldoende energie overdraagt. Alleen meer botsingen helpt niet als de vereiste bindingsstap energetisch niet mogelijk is."
        ],
        keyTerms: ["effectieve botsing", "activeringsenergie", "oriëntatie"]
      },
      {
        heading: "5.7 · Fysisch of chemisch drogen",
        paragraphs: [
          "Bij fysisch drogen verdampt bijvoorbeeld het oplosmiddel; de verf vormt een laag zonder dat daarvoor nieuwe covalente bindingen tussen verfdeeltjes nodig zijn. Bij chemisch drogen reageren moleculen met elkaar en ontstaat een netwerk van nieuwe bindingen.",
          "Een verf kan eerst oplosmiddel verliezen en daarna verder uitharden. Beschrijf welke verandering bij elke fase plaatsvindt."
        ],
        keyTerms: ["verdamping", "chemische uitharding", "netwerk"]
      },
      {
        heading: "5.8–5.10 · Additie en polymeereigenschappen",
        paragraphs: [
          "Bij additiepolymerisatie openen de C=C-bindingen van monomeren: de π-binding verdwijnt en nieuwe σ-bindingen verbinden de keten, zonder klein bijproduct. Bij polyadditie reageren monomeren in herhaalde stappen via hun reactieve groepen, ook zonder dat daarbij een klein molecuul vrijkomt. Dat is iets anders dan polycondensatie, waarbij zo’n molecuul wel vrijkomt.",
          "De polymerisatiegraad is het gemiddelde aantal herhaaleenheden per keten; een grotere waarde betekent gemiddeld langere ketens. Koppelingen tussen ketens vormen een netwerkpolymeer. Die verbindingen beperken ketenbeweging en maken een materiaal vaak stijver en minder oplosbaar."
        ],
        keyTerms: ["monomeer", "additie", "polyadditie", "vernetting"]
      }
    ],
    workedExample: {
      title: "Fotonenergie en initiatie",
      prompt: "Een lichtbron geeft fotonen met golflengte 400 nm. Bereken de energie van één foton en bepaal of die energie per mol hoger is dan 250 kJ mol⁻¹.",
      steps: [
        "Zet 400 nm om naar 4,00 × 10⁻⁷ m.",
        "Gebruik E = h·c/λ: E ≈ (6,626 × 10⁻³⁴ × 3,00 × 10⁸)/(4,00 × 10⁻⁷) = 4,97 × 10⁻¹⁹ J per foton.",
        "Vermenigvuldig met Nₐ: ongeveer 2,99 × 10⁵ J mol⁻¹ = 299 kJ mol⁻¹. Dat is hoger dan 250 kJ mol⁻¹, al hangt daadwerkelijke reactie ook af van absorptie en het mechanisme."
      ],
      answer: "De fotonenergie is 4,97 × 10⁻¹⁹ J per foton of ongeveer 299 kJ mol⁻¹; dat is hoger dan 250 kJ mol⁻¹."
    },
    exercises: [
      {
        id: "m11-p5-ex1",
        sourceRefs: ["5.3"],
        question: "Bij UV-bestraling reageert methaan met chloor. Classificeer Cl₂ + hν → 2 Cl•, Cl• + CH₄ → HCl + CH₃• en CH₃• + Cl₂ → CH₃Cl + Cl•.",
        hint: "Bepaal bij elke vergelijking of er radicalen worden gevormd of dat de ketendrager wordt doorgegeven.",
        answer: "Cl₂ + hν → 2 Cl• is initiatie. Cl• + CH₄ → HCl + CH₃• is propagatie. CH₃• + Cl₂ → CH₃Cl + Cl• is ook propagatie, want er ontstaat opnieuw een radicaal dat de keten kan voortzetten. Een terminatiestap zou twee radicalen verbruiken, bijvoorbeeld Cl• + Cl• → Cl₂."
      },
      {
        id: "m11-p5-ex2",
        sourceRefs: ["5.4", "5.5"],
        question: "Bereken de energie per mol fotonen bij λ = 300 nm. Is dit in het eenvoudige één-fotonmodel genoeg om een binding van 400 kJ mol⁻¹ te verbreken?",
        hint: "Gebruik E = hc/λ en vermenigvuldig de energie per foton met Nₐ.",
        answer: "300 nm = 3,00 × 10⁻⁷ m. E = hc/λ = 6,63 × 10⁻¹⁹ J per foton. Per mol is dit 6,63 × 10⁻¹⁹ × 6,022 × 10²³ = 399 kJ mol⁻¹. Dat is net kleiner dan 400 kJ mol⁻¹, dus volgens dit model niet genoeg."
      },
      {
        id: "m11-p5-ex3",
        sourceRefs: ["5.6"],
        question: "Een mengsel reageert sneller bij hogere temperatuur. Verklaar dit met het botsingsmodel.",
        hint: "Denk aan de activeringsenergie en de energieverdeling van de deeltjes.",
        answer: "Bij hogere temperatuur bewegen de deeltjes gemiddeld sneller en is een groter deel van de botsingen energierijk genoeg om de activeringsenergie te halen. Daardoor ontstaan meer effectieve botsingen per seconde."
      },
      {
        id: "m11-p5-ex4",
        sourceRefs: ["5.7"],
        question: "Een verffilm verliest eerst oplosmiddel en wordt later hard door vorming van bindingen tussen ketens. Benoem beide droogprocessen.",
        hint: "Eén stap verandert vooral de hoeveelheid oplosmiddel; de andere verandert de moleculen chemisch.",
        answer: "Het verlies van oplosmiddel is fysisch drogen. Het vormen van nieuwe bindingen tussen ketens is chemisch drogen of uitharden."
      },
      {
        id: "m11-p5-ex5",
        sourceRefs: ["5.8", "5.9"],
        question: "Polymeer A heeft gemiddeld 40 herhaaleenheden per keten en polymeer B gemiddeld 120. Welke heeft de grotere polymerisatiegraad? Wat doet vernetting met de ketens?",
        hint: "Polymerisatiegraad telt gemiddeld het aantal herhaaleenheden; vernetting koppelt verschillende ketens aan elkaar.",
        answer: "Polymeer B heeft de grotere polymerisatiegraad en gemiddeld langere ketens. Vernetting verbindt ketens onderling, waardoor een netwerk ontstaat en ketens minder vrij langs elkaar bewegen."
      },
      {
        id: "m11-p5-ex6",
        sourceRefs: ["5.10"],
        question: "Waarom is een sterk vernet polymeer vaak stijver en minder oplosbaar dan losse polymeerketens?",
        hint: "Vergelijk hoeveel bewegingsruimte ketens hebben en of ze afzonderlijk uit elkaar kunnen bewegen.",
        answer: "Verbindingen tussen ketens beperken hun beweging en houden de ketens bij elkaar. Daardoor kan het materiaal stijver zijn en lossen de ketens minder gemakkelijk afzonderlijk op."
      }
    ],
    checklist: [
      "Ik onderscheid initiatie, propagatie en terminatie.",
      "Ik koppel golflengte aan fotonenergie en bindingen aan energieopname of -afgifte.",
      "Ik leg met effectieve botsingen uit waarom temperatuur de reactiesnelheid beïnvloedt.",
      "Ik onderscheid fysisch drogen van chemische uitharding en voorspel gevolgen van vernetting."
    ],
    optionalNote: "5.1 en 5.2 vallen buiten de kernroute; de selectie is gericht op toepassen en rekenen bij 5.3–5.10."
  },
  {
    lessonId: "m11-p6-atoommodel",
    paragraph: "P6",
    title: "Atoommodel en binding",
    goal: "Je gebruikt atoommodellen, schillen en elektrostatische aantrekkingen om spectra en eenvoudige bindingen te verklaren.",
    contextNote: "Gebruik 6.1 en 6.2 als leescontext voor atoomopbouw en spectra. De kern hier is 6.3, 6.4, 6.6 en 6.7; 6.5 is overgeslagen.",
    theorySections: [
      {
        heading: "6.3 · Licht en energieniveaus",
        paragraphs: [
          "Elektronen kunnen alleen bepaalde energieën hebben. Bij absorptie neemt een elektron precies het energieverschil op dat nodig is voor een overgang; bij terugvallen kan een foton met dat verschil vrijkomen. De energie bepaalt de golflengte van de spectrale lijn.",
          "Een spectrum geeft dus informatie over toegestane overgangen. Fraunhoferlijnen zijn donkere absorptielijnen in het zonnespectrum; ze ontstaan wanneer gassen in de buitenlagen bepaalde golflengten absorberen. Een losse kleurwaarneming is minder precies dan het vergelijken van golflengten."
        ],
        keyTerms: ["energieniveau", "absorptie", "emissie"]
      },
      {
        heading: "6.4 · Elektronen over schillen verdelen",
        paragraphs: [
          "De maximale bezetting van schil n volgt uit 2n². De eerste schil kan 2 elektronen bevatten, de tweede 8 en de derde maximaal 18. Deze maximumcapaciteit is een modelregel; vul schillen voor lichte elementen volgens de behandelde opbouwvolgorde.",
          "Valentie-elektronen zitten in de buitenste bezette schil en bepalen vaak hoe een atoom reageert."
        ],
        keyTerms: ["schil", "2n²", "valentie-elektron"]
      },
      {
        heading: "6.6 · Ionisatie-energie en energie-eenheden",
        paragraphs: [
          "De eerste ionisatie-energie is de energie voor X(g) → X⁺(g) + e⁻: één elektron wordt verwijderd uit een gasvormig neutraal atoom. Een elektron heeft lading −1,602 × 10⁻¹⁹ C; de grootte van de elementaire lading is e = 1,602 × 10⁻¹⁹ C. Een proton heeft +e en een neutron heeft lading 0.",
          "Eén elektronvolt is de energie die een elementaire lading bij één volt verschil krijgt: 1 eV = 1,602 × 10⁻¹⁹ J per deeltje. Per mol is dat ongeveer 96,485 kJ mol⁻¹. Vermenigvuldig eV dus met 96,485 om kJ mol⁻¹ te krijgen."
        ],
        keyTerms: ["ionisatie-energie", "elektronvolt", "elementaire lading"]
      },
      {
        heading: "6.7 · Schillen, ionen en aantrekkingskracht",
        paragraphs: [
          "Natrium heeft de verdeling 2,8,1 en één valentie-elektron. Chloor heeft 2,8,7 en kan één elektron opnemen. Natrium kan een elektron afstaan: Na → Na⁺ + e⁻. Elektronen afstaan heet oxidatie; een deeltje dat ze opneemt wordt gereduceerd.",
          "De Coulombkracht tussen twee ionladingen is evenredig met |q₁q₂|/r². Na⁺/Cl⁻ en Cs⁺/Br⁻ hebben dezelfde ladingen, maar Cs⁺ en Br⁻ zijn groter en de afstand tussen hun ionmiddens is groter; de aantrekking tussen zo’n naburig paar is daarom zwakker in CsBr. In een ionbinding houden elektrostatische krachten een ionrooster bijeen. Bij een covalente binding, zoals in H₂, delen twee atomen een elektronenpaar."
        ],
        keyTerms: ["valentie", "ionbinding", "Coulombkracht"]
      }
    ],
    workedExample: {
      title: "Van energie naar golflengte",
      prompt: "Een emissielijn heeft fotonenergie 3,20 × 10⁻¹⁹ J. Bereken de golflengte en geef de waarde ook in nanometer.",
      steps: [
        "Gebruik E = h·c/λ en herschrijf naar λ = h·c/E.",
        "Vul in: λ ≈ (6,626 × 10⁻³⁴ × 3,00 × 10⁸)/(3,20 × 10⁻¹⁹) = 6,21 × 10⁻⁷ m.",
        "Zet meter om naar nanometer: 6,21 × 10⁻⁷ m = 621 nm."
      ],
      answer: "De emissielijn heeft golflengte 6,21 × 10⁻⁷ m = 621 nm."
    },
    exercises: [
      {
        id: "m11-p6-ex1",
        sourceRefs: ["6.3"],
        question: "Een elektron absorbeert energie en valt later terug. Beschrijf de absorptie- en emissielijn. Wat zijn Fraunhoferlijnen?",
        hint: "Vergelijk de twee overgangen en onthoud dat Fraunhoferlijnen donker zijn in het zonnespectrum.",
        answer: "Bij absorptie neemt het elektron een foton op en gaat naar een hoger niveau. Bij terugval zendt het een foton met dezelfde energie en golflengte uit. Fraunhoferlijnen zijn donkere absorptielijnen in het zonnespectrum."
      },
      {
        id: "m11-p6-ex2",
        sourceRefs: ["6.4"],
        question: "Bereken de maximale capaciteit van de derde schil en geef de verdeling van de valentie-elektronen van Na en Cl.",
        hint: "Gebruik 2n² voor n = 3; de atoomnummers zijn 11 en 17.",
        answer: "Voor n = 3 is 2 × 3² = 18 elektronen. Na heeft verdeling 2,8,1 en één valentie-elektron; Cl heeft 2,8,7 en zeven valentie-elektronen."
      },
      {
        id: "m11-p6-ex3",
        sourceRefs: ["6.6"],
        question: "Zet 2,00 eV om naar joule per deeltje en kJ mol⁻¹.",
        hint: "Gebruik 1 eV = 1,602 × 10⁻¹⁹ J en 1 eV per deeltje ≈ 96,485 kJ mol⁻¹.",
        answer: "Per deeltje: 2,00 × 1,602 × 10⁻¹⁹ = 3,204 × 10⁻¹⁹ J. Per mol: 2,00 × 96,485 = 193 kJ mol⁻¹."
      },
      {
        id: "m11-p6-ex4",
        sourceRefs: ["6.7"],
        question: "Leg met de Coulombregel uit waarom een naburig Na⁺/Cl⁻-paar sterker aantrekt dan een Cs⁺/Br⁻-paar. Vergelijk daarna de binding in NaCl met die in H₂.",
        hint: "De ladingen zijn gelijk; gebruik de afstand in F ∝ |q₁q₂|/r². H₂ deelt een elektronenpaar.",
        answer: "Beide ionparen hebben ladingen +1 en −1. Na⁺ en Cl⁻ zijn kleiner, dus r is kleiner en de paarattractie groter volgens F ∝ |q₁q₂|/r². NaCl heeft ionbinding tussen ionen in een rooster. In H₂ delen twee atomen een elektronenpaar: dat is covalente binding."
      },
      {
        id: "m11-p6-ex5",
        sourceRefs: ["6.6", "6.7"],
        question: "Magnesium vormt Mg²⁺. Schrijf de elektronenoverdracht op en benoem oxidatie. Welk proces ondergaat een deeltje dat die elektronen opneemt?",
        hint: "Tel twee elektronen aan de productkant; elektronen opnemen is reductie.",
        answer: "Mg → Mg²⁺ + 2 e⁻. Magnesium staat elektronen af en wordt geoxideerd. Een deeltje dat die elektronen opneemt, wordt gereduceerd."
      }
    ],
    checklist: [
      "Ik verbind absorptie en emissie met energieverschillen tussen niveaus.",
      "Ik bereken schilcapaciteit met 2n² en herken valentie-elektronen.",
      "Ik reken tussen eV, joule per deeltje en kJ mol⁻¹.",
      "Ik koppel elektronenoverdracht aan oxidatie en reductie.",
      "Ik onderscheid ionbinding van covalente binding en gebruik de Coulombregel."
    ],
    optionalNote: "6.1 en 6.2 zijn alleen leescontext. 6.5 is expliciet overgeslagen en geen kernstof."
  }
];
