import type { Question, QuestionVisual } from "../types";

const forbiddenOnlyHints = new Set([
  "kijk goed naar de vraag.",
  "gebruik het modelantwoord.",
  "denk aan de formule.",
  "markeer de gegevens.",
  "controleer je antwoord.",
  "markeer eerst de gegeven grootheden en de gevraagde grootheid.",
]);

const unique = (items: string[]) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];
const haystack = (question: Question) => `${question.module} ${question.topic} ${question.skill} ${question.type} ${question.question} ${question.modelAnswer}`.toLowerCase();
const has = (question: Question, pattern: RegExp) => pattern.test(haystack(question));

function specificHintsFor(question: Question) {
  const hints: string[] = [];
  const text = haystack(question);

  if (question.module === "M10" && (question.type === "calculation" || /titr|buret|schellbach|molariteit|massa%|massa-aandeel|azijn|naoh|volume/.test(text))) {
    hints.push("Begin bij de meetgegevens: gebruikt volume = eindstand buret − beginstand buret.");
    hints.push("Zet elk titratievolume om naar liter voordat je n = molariteit × volume gebruikt.");
    hints.push(/massa|massa%|massa-aandeel/.test(text) ? "Voor massa-aandeel: reken mol om met de molmassa en deel daarna door de massa van het monster." : "Gebruik daarna pas de molverhouding uit de reactievergelijking.");
  }

  if (question.module === "M10" && /zuur|base|h₃o|h\+|oh|ph|proton/.test(text)) {
    hints.push("Zoek eerst welke stof H⁺ afgeeft en welke stof H⁺ opneemt.");
    hints.push("Controleer de ladingen na de H⁺-overdracht: een deeltje dat H⁺ opneemt wordt één lading positiever.");
  }

  if (question.module === "M8" && /massaspect|spectrum|m-piek|m\+1|m\+2|basispiek|fragment|m\/z/.test(text)) {
    hints.push("Lees eerst de x-as: m/z betekent massa gedeeld door lading van het gemeten ion.");
    hints.push("De basispiek is de hoogste piek op 100%; de M-piek hoort bij het molecuulion.");
    hints.push(/m\+1|m\+2|isoto/.test(text) ? "M+1 wijst vaak op ¹³C; een duidelijke M+2 kan passen bij isotopen zoals Cl of Br." : "Fragmentpieken zijn afgebroken geladen stukjes en kunnen lager liggen dan de M-piek.");
  }

  if (question.module === "M8" && /gc|chromatografie|retentietijd/.test(text)) {
    hints.push("Bij GC kijk je naar retentietijd: elke piek komt op een bepaald moment uit de kolom.");
    hints.push("GC scheidt eerst stoffen; MS kan daarna per GC-piek massa en fragmenten geven.");
  }

  if (question.module === "M8" && /ir|infrarood/.test(text)) {
    hints.push("Bij IR zoek je naar bindingen of functionele groepen, bijvoorbeeld O–H, N–H of C=O.");
  }

  if (question.module === "M8" && /nmr|omgeving/.test(text)) {
    hints.push("Bij NMR kijk je naar verschillende omgevingen van H- of C-atomen, niet alleen naar de molecuulmassa.");
  }

  if (question.module === "M8" && /atoommodel|rutherford|thomson|goudfolie|bohr|schillenmodel|alfadeeltjes/.test(text)) {
    hints.push("Koppel elk model aan het bewijs: Thomson heeft positieve massa verspreid, Rutherford verklaart de goudfolie-waarnemingen met een kleine positieve kern.");
    hints.push("Bij goudfolievragen: meeste alfadeeltjes rechtdoor betekent veel lege ruimte; sterke afbuiging betekent een kleine positieve kern.");
    hints.push(/bohr|schillenmodel|teken/.test(text) ? "Rutherford is niet automatisch een schillenmodel: Bohr voegt vaste elektronenbanen of schillen toe." : "Noem bij Rutherford altijd kern, lege ruimte en elektronen buiten de kern.");
  }

  if (question.module === "M8" && /atoomnummer|massagetal|proton|neutron|elektron|isotoop|ion/.test(text) && !/massaspect|spectrum|m-piek|m\+1|m\+2|basispiek|fragment|m\/z/.test(text)) {
    hints.push("Gebruik atoomnummer voor protonen; neutronen bereken je met massagetal - atoomnummer.");
    hints.push("Bij isotopen blijft het aantal protonen gelijk en verandert het aantal neutronen.");
    hints.push("Bij ionen verandert het aantal elektronen; controleer de lading door protonen en elektronen te vergelijken.");
  }

  if (question.module === "M5D" && /dna|rna|nucleotide|transcriptie|translatie|codon|base|eiwit|peptide|hydrolyse|denaturatie/.test(text)) {
    hints.push(/nucleotide|dna|rna/.test(text) ? "Een nucleotide bestaat uit drie delen: fosfaat, suiker en base." : "Bedenk of de vraag gaat over de bouwsteen, de keten of de 3D-vorm.");
    hints.push(/transcriptie|mrna|rna/.test(text) ? "Transcriptie betekent: DNA-informatie overschrijven naar mRNA; RNA gebruikt U in plaats van T." : "Bij DNA horen de basen A, T, C en G; bij RNA staat U op de plaats van T.");
    hints.push(/translatie|codon|amino/.test(text) ? "Translatie leest mRNA in codons van drie basen en koppelt daar aminozuren aan." : "Bij eiwitten let je op peptidebinding, hydrolyse en denaturatie van de ruimtelijke vorm.");
  }

  if (/structure|structuur|functionele groep|ester|amide|alcohol|carbonzuur|hydrofiel|hydrofoob|h-brug|waterstofbrug/.test(text) || question.structure) {
    hints.unshift("Koppel de structuur daarna aan polariteit, H-bruggen en hydrofiel/hydrofoob gedrag.");
    hints.unshift("Zoek eerst de functionele groep: O–H, N–H, C=O, COOH, ester of amide.");
  }

  if (question.module === "M7" || /redox|oxidator|reductor|halfreactie|elektron/.test(text)) {
    if (/binas 48|standaardelektrode|elektrodepotential/.test(text)) hints.push("BINAS 48 geeft reductiehalfreacties; draai een halfreactie alleen om als die in jouw reactie oxidatie is.");
    hints.push("Elektronen rechts in een halfreactie betekent afstaan: die stof is de reductor.");
    hints.push("Elektronen links betekent opnemen: die stof is de oxidator.");
    hints.push("Elektronen lopen van reductor naar oxidator en verdwijnen uit de totaalreactie.");
  }

  if (question.module === "M9" && /polair|apolair|dipool|δ|elektronegativiteit/.test(text)) {
    if (/binas 40a|elektronegativiteit/.test(text)) hints.push("Gebruik BINAS 40A om elektronegativiteiten te vergelijken voordat je δ+ en δ− noteert.");
    hints.push("Een binding is polair door verschil in elektronegativiteit; een molecuul is pas polair als de dipolen niet opheffen.");
  }

  if (question.module === "M9" && /waterstofbrug|h-brug|o–h|n–h|o-h|n-h/.test(text)) {
    hints.push("Een H-brug donor heeft H direct aan O, N of F; een acceptor heeft een vrij elektronenpaar op O, N of F.");
  }

  if (question.module === "M4" || /molmassa|mol|molariteit|concentratie|massa%|reactievergelijking|formule/.test(text)) {
    hints.push("Schrijf eerst de grootheid met eenheid op: massa in g, volume in L, molariteit in mol/L.");
    hints.push(/reactie|molverhouding/.test(text) ? "Gebruik coëfficiënten uit de reactievergelijking als molverhouding, niet de indexcijfers in een formule." : "Kies daarna de passende relatie: n = m / molmassa, n = molariteit × volume of massa%.");
  }

  if (question.module === "M6" || /ion|zout|oplossen|geleid|ph|zuur|base/.test(text)) {
    hints.push(/geleid|oplos/.test(text) ? "Voor geleidbaarheid zoek je vrije bewegende ionen; vaste ionroosters hebben die niet." : "Let op ladingen: een zoutformule moet elektrisch neutraal zijn.");
    hints.push(/zuur|base|ph/.test(text) ? "Bij zuur-base zoek je de H⁺-overdracht en controleer je daarna de ladingen." : "Bij oplossen in water helpen ion-dipoolinteracties en hydratatie de ionen los te maken.");
  }

  if (!hints.length) {
    hints.push("Bepaal eerst welk scheikundig begrip centraal staat en schrijf één concrete eigenschap of deeltjesstap op.");
  }

  const sanitized = unique(hints)
    .filter((hint) => !forbiddenOnlyHints.has(hint.toLowerCase()))
    .slice(0, 3);
  return sanitized.length ? sanitized : ["Koppel de gegevens aan één concreet begrip uit deze module voordat je rekent of uitlegt."];
}

function imageVisual(src: string, alt: string, caption: string): QuestionVisual {
  return { type: "image", src, alt, caption };
}

function attachVisual(question: Question): Question {
  const text = haystack(question);
  const visual = question.visual;

  if (visual?.src) return question;

  if (visual?.component === "MassSpectrumDiagram" || (question.module === "M8" && /massaspect|spectrum|m-piek|m\+1|basispiek|fragment/.test(text))) {
    return { ...question, visual: { ...(visual ?? imageVisual("", "Massaspectrum", "")), type: "image", src: "/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp", alt: visual?.alt ?? "Didactisch massaspectrum met M-piek, M+1, fragmentpiek en basispiek.", caption: visual?.caption ?? "Gebruik M, M+1, basispiek en fragmentpieken als vaste leesvolgorde." } };
  }

  if (question.module === "M10" && /schellbach/.test(text)) {
    return { ...question, visual: { ...(visual ?? imageVisual("", "Schellbachstreep bij een buret", "")), type: "image", src: "/assets/chemtrainer/titratie/schellbachstreep-detail.webp", alt: visual?.alt ?? "Detail van een Schellbachstreep bij de meniscus in een buret.", caption: visual?.caption ?? "De Schellbachstreep helpt je de onderkant van de meniscus te vinden." } };
  }

  if (question.module === "M10" && (/buret|meniscus|aflezen/.test(text) || visual?.variant === "meniscus")) {
    return { ...question, visual: { ...(visual ?? imageVisual("", "Buretmeniscus op ooghoogte", "")), type: "image", src: "/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp", alt: visual?.alt ?? "Close-up van een buretmeniscus op ooghoogte.", caption: visual?.caption ?? "Lees onderkant meniscus op ooghoogte; verbruik = eindstand − beginstand." } };
  }

  if (question.module === "M10" && /titratie|equivalentiepunt|indicator|azijn/.test(text)) {
    return { ...question, visual: { ...(visual ?? imageVisual("", "Titratieopstelling", "")), type: "image", src: "/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp", alt: visual?.alt ?? "Volledige titratieopstelling met callouts.", caption: visual?.caption ?? "Buret met titrant boven erlenmeyer met monsteroplossing en indicator." } };
  }

  if (question.module === "M5D" && /transcriptie|translatie|codon|mrna|dna.*eiwit/.test(text)) {
    return { ...question, visual: { ...(visual ?? imageVisual("", "DNA naar mRNA naar eiwit", "")), type: "image", src: "/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp", alt: visual?.alt ?? "Schema van transcriptie en translatie van DNA naar eiwit.", caption: visual?.caption ?? "Transcriptie maakt mRNA; translatie leest codons en bouwt een aminozuurketen." } };
  }

  return question;
}

export function enhanceQuestion(question: Question): Question {
  return {
    ...attachVisual(question),
    hints: specificHintsFor(question),
  };
}

export function countGenericOnlyHints(questions: Question[]) {
  return questions.filter((question) => question.hints.length === 1 && forbiddenOnlyHints.has(question.hints[0].toLowerCase())).length;
}
