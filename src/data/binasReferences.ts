import type { BinasReference, ModuleId } from "../types";

type BinasReferenceSource = {
  id: string;
  subject: string;
  module: ModuleId;
  table: string;
  whenToUse: string;
  exampleQuestion: string;
  warning: string;
  keywords?: string[];
};

const sourceBinasReferences: BinasReferenceSource[] = [
  { id: "m4-40", subject: "Elementen, formules en atoommassa's", module: "M4", table: "Tabel 40", whenToUse: "Gebruik deze wanneer je een elementsymbool, formule-onderdeel of relatieve atoommassa nodig hebt voor een berekening.", exampleQuestion: "Bereken de molmassa van CaCO₃ voordat je massa en mol aan elkaar koppelt.", warning: "Neem niet zomaar een afgeronde massa uit je hoofd: gebruik de waarde die bij jouw BINAS-editie staat en rond pas aan het einde af.", keywords: ["element", "formule", "molmassa", "atoommassa", "reactie"] },
  { id: "m4-66a", subject: "Rationele namen", module: "M4", table: "Tabel 66A", whenToUse: "Gebruik deze om een stofnaam en formule gecontroleerd aan elkaar te koppelen, vooral bij zouten en samengestelde ionen.", exampleQuestion: "Welke formule hoort bij natriumsulfaat en welke ionen komen daarin voor?", warning: "Verwar de index in een formule niet met een ionlading. Controleer altijd of de totale lading van een zout nul is.", keywords: ["naam", "rationele", "formule", "zout", "ion"] },
  { id: "m4-96a", subject: "Grenswaarden en eenheden", module: "M4", table: "Tabel 96A", whenToUse: "Gebruik deze alleen wanneer een opgave om een grenswaarde, norm of beoordeling van een concentratie vraagt.", exampleQuestion: "Vergelijk een berekende concentratie met de grenswaarde die de opgave noemt.", warning: "Een grenswaarde is geen rekenformule. Bereken eerst de grootheid met de juiste eenheid en vergelijk daarna pas.", keywords: ["grenswaarde", "grens", "norm"] },
  { id: "m4-98", subject: "Molmassa's van veelgebruikte stoffen", module: "M4", table: "Tabel 98", whenToUse: "Gebruik deze als een opgave vraagt om een molmassa van een veelgebruikte stof of oplossing.", exampleQuestion: "Zet 0,250 mol NaOH om naar massa in gram.", warning: "Kies óf een opgegeven molmassa uit de opgave óf BINAS; tel niet beide opnieuw samen met verschillende afrondingen.", keywords: ["molmassa"] },

  { id: "m5d-67", subject: "Macromoleculaire materialen", module: "M5D", table: "Tabel 67A", whenToUse: "Gebruik deze bij een vraag over eigenschappen, toepassingen of herhalende groepen van polymeren en macromoleculaire materialen.", exampleQuestion: "Koppel een polymeer met amide- of esterbindingen aan een materiaaltoepassing en zijn eigenschappen.", warning: "De tabel geeft materiaalinformatie; herken zelf nog steeds de monomeren en de bindingen in de structuurformule.", keywords: ["polymeer", "polymeren", "polyamide", "polyester", "materiaal", "amide", "ester"] },

  { id: "m6-45a", subject: "Oplosbaarheid van zouten", module: "M6", table: "Tabel 45A", whenToUse: "Gebruik deze om te voorspellen of ionen in water opgelost blijven of een neerslag kunnen vormen.", exampleQuestion: "Ontstaat er een neerslag wanneer twee ionoplossingen worden gemengd?", warning: "Lees altijd beide ionen samen als één zout. Alleen weten dat één los ion voorkomt, vertelt nog niet of het zout oplosbaar is.", keywords: ["oplos", "neerslag", "slecht oplosbaar"] },
  { id: "m6-65b", subject: "Ionen herkennen aan kleur of aantoonreactie", module: "M6", table: "Tabel 65B", whenToUse: "Gebruik deze bij waarnemingen: kleur, neerslag of een aantoonreactie die iets zegt over aanwezige ionen.", exampleQuestion: "Welke waarneming ondersteunt de aanwezigheid van een bepaald metaalion?", warning: "Een kleur is een aanwijzing, geen losstaand bewijs. Koppel hem aan de beschreven proef en de ionnotatie.", keywords: ["kleur", "aantonen", "ion", "neerslag", "waarneming"] },

  { id: "m7-48", subject: "Standaardelektrodepotentialen", module: "M7", table: "Tabel 48", whenToUse: "Gebruik deze bij redox- en elektrochemievraagstukken om te bepalen welke halfreactie als reductie gunstig is en welke combinatie een cel kan vormen.", exampleQuestion: "Welke elektrode is in een Daniellcel de anode en wat is de richting van de elektronenstroom?", warning: "De tabel geeft reductiehalfreacties. Draai je een halfreactie om voor oxidatie, dan veranderen de elektronen van kant; verander niet zomaar een tabelwaarde in je rekenstappen.", keywords: ["daniell", "celspanning", "elektrode", "potentiaal", "celdiagram"] },
  { id: "m7-65b", subject: "Ionkleur bij redoxwaarnemingen", module: "M7", table: "Tabel 65B", whenToUse: "Gebruik deze als een redoxvraag een kleurverandering of metaalafzetting beschrijft en je de betrokken ionen moet onderbouwen.", exampleQuestion: "Een oplossing verandert van kleur tijdens een redoxreactie. Welke ionen passen bij die waarneming?", warning: "Kleur ondersteunt je conclusie, maar de oxidator en reductor bepaal je uiteindelijk met elektronenopname en -afstaan.", keywords: ["kleur", "ion", "waarneming", "metaal", "oplossing"] },

  { id: "m8-7a", subject: "Constanten bij atoom- en ladingvragen", module: "M8", table: "Tabel 7A", whenToUse: "Gebruik deze wanneer een opgave expliciet een constante nodig heeft, zoals de Faradayconstante of de lading van een elektron.", exampleQuestion: "Bereken de totale lading van een gegeven aantal elektronen met een constante uit BINAS.", warning: "Kies eerst welke grootheid je nodig hebt. Een constante invullen zonder eenhedencontrole leidt snel tot een factorfout.", keywords: ["faraday", "elektron", "lading", "constante", "atoom"] },
  { id: "m8-40", subject: "Isotopen en relatieve massa", module: "M8", table: "Tabel 40", whenToUse: "Gebruik deze bij isotopen- en massavragen om elementgegevens of relatieve massa te controleren.", exampleQuestion: "Controleer of een berekende gemiddelde atoommassa past bij het element in de opgave.", warning: "Isotopen hebben hetzelfde aantal protonen, niet noodzakelijk hetzelfde massagetal. De tabel vervangt die redenering niet.", keywords: ["isotoop", "massa", "massagetal", "atoomnummer", "m+1", "m+2"] },
  { id: "m8-39d", subject: "Massaspectrometrie en isotopenpatronen", module: "M8", table: "Tabel 39D", whenToUse: "Gebruik deze bij een M-, M+1- of M+2-vraag wanneer je een isotopenpatroon of massa-informatie uit BINAS moet koppelen aan een spectrum.", exampleQuestion: "Onderbouw waarom een M : M+2-verhouding ongeveer 3 : 1 naar één chlooratoom wijst.", warning: "Een patroon is een aanwijzing. Combineer het altijd met m/z, fragmenten en zo nodig IR of NMR; claim niet meteen een volledige structuur.", keywords: ["massaspectrometrie", "spectrum", "m-piek", "m+1", "m+2", "isotoop", "fragment"] },

  { id: "m9-44", subject: "Oplosbaarheid en deeltjesinteracties", module: "M9", table: "Tabel 44", whenToUse: "Gebruik deze als een opgave je laat vergelijken welke stoffen of ionen in water kunnen voorkomen; controleer de exacte legenda in jouw BINAS-editie.", exampleQuestion: "Welke stof is volgens de gegeven oplosbaarheidsinformatie het best in water te verwachten?", warning: "Gebruik BINAS als controle naast je verklaring. Een tabel vervangt niet de uitleg met polair, apolair en intermoleculaire krachten.", keywords: ["oplos", "hydrofiel", "hydrofoob", "water", "stofeigenschap"] },
  { id: "m9-45", subject: "Oplosbaarheid bij ionen en zouten", module: "M9", table: "Tabel 45", whenToUse: "Gebruik deze bij een vergelijking van ionstoffen, oplossen en neerslagvorming; check de tabelkop in jouw editie.", exampleQuestion: "Welke combinatie van ionen blijft opgelost en welke levert een slecht oplosbaar zout?", warning: "Maak onderscheid tussen de binding ín een stof en de interacties met water. 'Oplosbaar' betekent niet dat de ionbinding verdwijnt.", keywords: ["oplos", "ion", "zout", "neerslag", "water"] },
  { id: "m9-45a", subject: "Oplosbaarheid van zouten", module: "M9", table: "Tabel 45A", whenToUse: "Gebruik deze bij concrete vragen over een zout in water of een mogelijke neerslagreactie.", exampleQuestion: "Voorspel met BINAS of BaSO₄ als vaste stof kan ontstaan.", warning: "Noteer eerst de aanwezige ionen. Pas daarna zoek je het gevormde zout op; niet andersom.", keywords: ["oplos", "zout", "neerslag", "ion", "barium"] },
  { id: "m9-40", subject: "Atoomgegevens en elektronegativiteit", module: "M9", table: "Tabel 40", whenToUse: "Gebruik deze als je elementgegevens nodig hebt om een verschil in elektronegativiteit of een bindingsdipool te onderbouwen.", exampleQuestion: "Leg met de gegevens van O en H uit waarom de O—H-binding polair is.", warning: "Een polaire binding maakt een molecuul niet automatisch polair: kijk daarna altijd naar de molecuulvorm en het opheffen van dipolen.", keywords: ["elektronegativiteit", "polair", "apolair", "dipool", "binding", "atoom"] },
  { id: "m9-materialen", subject: "Materiaal- en composietgegevens", module: "M9", table: "Tabel 67A en 67B", whenToUse: "Gebruik tabel 67A bij macromoleculaire materialen en tabel 67B bij nieuwe materialen. Koppel de gegevens daarna aan de rol van vezels en matrix in een composiet.", exampleQuestion: "Koppel een opgegeven materiaaleigenschap aan de rol van vezels en matrix in een composiet.", warning: "De tabellen geven materiaalinformatie; leg op de toets nog steeds op microniveau uit waarom een eigenschap ontstaat.", keywords: ["materiaal", "composiet", "vezel", "matrix"] },

  { id: "m10-48", subject: "Redox/evenwicht in gecombineerde opgaven", module: "M10", table: "Tabel 48", whenToUse: "Gebruik deze alleen wanneer een M10-vraag echt een redoxstap of elektrochemisch evenwicht bevat, niet voor elke gewone zuur-basetitratie.", exampleQuestion: "Onderbouw met standaardpotentialen welke redoxreactie in een gecombineerde analyse mogelijk is.", warning: "Bij een gewone titratie is n = c × V en de molverhouding meestal de kern. Pak tabel 48 er alleen bij als redox werkelijk wordt gevraagd.", keywords: ["redox", "evenwicht", "elektrode", "potentiaal"] },
  { id: "m10-zuurbase", subject: "Zuur-basegegevens", module: "M10", table: "Tabel 49", whenToUse: "Gebruik deze bij vragen waarin je de sterkte van een zuur/base, een pH-gebied of een passende reactie moet onderbouwen.", exampleQuestion: "Kies welk zuur-basepaar je in de reactievergelijking moet gebruiken en licht de richting toe.", warning: "Verwar een zuur-basegegeven niet met het equivalentiepunt. Dat punt bepaal je eerst met de molverhouding uit de reactie.", keywords: ["zuur", "base", "ph", "zuur-base", "evenwicht"] },
  { id: "m10-indicator", subject: "Indicatoren", module: "M10", table: "Tabel 52A", whenToUse: "Gebruik deze wanneer je moet kiezen of beoordelen welke indicator past bij het omslaggebied van een titratie.", exampleQuestion: "Leg uit waarom een indicator met een passend omslagtraject nodig is bij deze titratie.", warning: "Het eindpunt is de waargenomen kleurverandering; het equivalentiepunt is het berekende stoichiometrische punt. Die twee begrippen zijn niet identiek.", keywords: ["indicator", "omslag", "equivalentiepunt", "titratie", "buret"] },
  { id: "m10-97a", subject: "Groene chemie", module: "M10", table: "Tabel 97A", whenToUse: "Gebruik deze als een opgave een practicum, titratie of productiemethode laat beoordelen op duurzaamheid.", exampleQuestion: "Noem een verbetering waarmee een analysemethode minder afval of gevaarlijke stoffen oplevert.", warning: "Noem niet alleen 'milieuvriendelijk'. Koppel je keuze aan een concreet principe, zoals minder afval, veiliger oplosmiddel of energiebesparing.", keywords: ["groene", "duurzaam", "afval", "veilig", "practicum"] },
];

export const binasReferences: BinasReference[] = sourceBinasReferences.map((reference) => ({
  id: reference.id,
  onderwerp: reference.subject,
  module: reference.module,
  tabel: reference.table,
  wanneerGebruikJeDezeTabel: reference.whenToUse,
  voorbeeldvraag: reference.exampleQuestion,
  waarschuwing: reference.warning,
  keywords: reference.keywords,
}));

export interface BinasFindingChallenge {
  id: string;
  module: ModuleId;
  prompt: string;
  referenceId: string;
  optionIds: string[];
}

export const binasFindingChallenges: BinasFindingChallenge[] = [
  { id: "bf-m4-mass", module: "M4", prompt: "Je moet de molmassa van CaCO₃ bepalen voordat je mol naar gram omzet. Welke BINAS-tabel is de logischste eerste stap?", referenceId: "m4-40", optionIds: ["m4-40", "m4-66a", "m6-45a", "m10-97a"] },
  { id: "bf-m4-name", module: "M4", prompt: "Je kent de naam natriumsulfaat en moet de formule betrouwbaar opschrijven. Welke tabel helpt het meest?", referenceId: "m4-66a", optionIds: ["m4-66a", "m4-98", "m7-48", "m8-7a"] },
  { id: "bf-m6-salt", module: "M6", prompt: "Twee ionoplossingen worden gemengd. Je wilt voorspellen of er een neerslag ontstaat. Welke tabel zoek je op?", referenceId: "m6-45a", optionIds: ["m6-45a", "m6-65b", "m9-40", "m10-indicator"] },
  { id: "bf-m7-cell", module: "M7", prompt: "Je vergelijkt twee halfreacties om de anode en kathode van een elektrochemische cel te bepalen. Welke tabel heb je nodig?", referenceId: "m7-48", optionIds: ["m7-48", "m7-65b", "m4-40", "m10-zuurbase"] },
  { id: "bf-m8-constant", module: "M8", prompt: "Je moet de lading van een hoeveelheid elektronen uitrekenen. Welke BINAS-tabel past hierbij?", referenceId: "m8-7a", optionIds: ["m8-7a", "m8-40", "m7-48", "m4-96a"] },
  { id: "bf-m9-polar", module: "M9", prompt: "Je wilt met elementgegevens onderbouwen waarom de O—H-binding polair is. Welke tabel gebruik je?", referenceId: "m9-40", optionIds: ["m9-40", "m9-45a", "m6-65b", "m10-97a"] },
  { id: "bf-m9-solubility", module: "M9", prompt: "Je moet voorspellen of BaSO₄ als vaste stof kan ontstaan in water. Welke tabel is het meest gericht?", referenceId: "m9-45a", optionIds: ["m9-45a", "m9-44", "m4-98", "m7-48"] },
  { id: "bf-m10-indicator", module: "M10", prompt: "Je moet beoordelen welke indicator bij het omslaggebied van een titratie past. Waar zoek je gericht?", referenceId: "m10-indicator", optionIds: ["m10-indicator", "m10-zuurbase", "m10-48", "m4-40"] },
  { id: "bf-m10-green", module: "M10", prompt: "Je moet een practicumvoorstel beoordelen op minder afval en veiliger werken. Welke tabel past hierbij?", referenceId: "m10-97a", optionIds: ["m10-97a", "m10-48", "m6-45a", "m8-7a"] },
];

export function getBinasReferencesFor(module: ModuleId, context = "") {
  const candidates = binasReferences.filter((reference) => reference.module === module);
  const normalized = context.toLocaleLowerCase("nl-NL");
  const matched = candidates.filter((reference) => reference.keywords?.some((keyword) => normalized.includes(keyword)));
  return matched.slice(0, 3);
}

export const binasReferenceMap = Object.fromEntries(binasReferences.map((reference) => [reference.id, reference]));
