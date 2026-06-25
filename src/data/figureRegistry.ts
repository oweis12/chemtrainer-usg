export interface FigureReference {
  id: string;
  assetId: string;
  number: string;
  title: string;
  path: string;
  shortReference: string;
}

export const figureRegistry: FigureReference[] = [
  {
    id: "fig-titration-setup",
    assetId: "visual-titration-setup",
    number: "1",
    title: "Volledige titratieopstelling",
    path: "/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp",
    shortReference: "zie figuur 1",
  },
  {
    id: "fig-titration-meniscus",
    assetId: "visual-titration-meniscus",
    number: "2",
    title: "Buret aflezen op ooghoogte",
    path: "/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp",
    shortReference: "zie figuur 2",
  },
  {
    id: "fig-titration-schellbach",
    assetId: "visual-titration-schellbach",
    number: "3",
    title: "Schellbachstreep bij de meniscus",
    path: "/assets/chemtrainer/titratie/schellbachstreep-detail.webp",
    shortReference: "zie figuur 3",
  },
  {
    id: "fig-titration-steps",
    assetId: "visual-titration-steps",
    number: "4",
    title: "Titratie in 6 stappen",
    path: "/assets/chemtrainer/titratie/titratie-stappen.webp",
    shortReference: "zie figuur 4",
  },
  {
    id: "fig-dna-expression",
    assetId: "visual-dna-expression",
    number: "5",
    title: "Transcriptie en translatie",
    path: "/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp",
    shortReference: "zie figuur 5",
  },
  {
    id: "fig-ms-spectrum",
    assetId: "visual-ms-spectrum",
    number: "6",
    title: "Massaspectrum met M-piek, M+1 en basispiek",
    path: "/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp",
    shortReference: "zie figuur 6",
  },
  { id: "fig-m6-proton-transfer", assetId: "visual-m6-proton-transfer", number: "7", title: "Protonoverdracht tussen zuur en base", path: "/assets/chemtrainer/m6/zuur-base-protonoverdracht.webp", shortReference: "zie figuur 7" },
  { id: "fig-m6-strong-weak", assetId: "visual-m6-strong-weak-concentrated-dilute", number: "8", title: "Sterk of zwak, geconcentreerd of verdund", path: "/assets/chemtrainer/m6/sterk-zwak-geconcentreerd-verdund.webp", shortReference: "zie figuur 8" },
  { id: "fig-m6-hydration", assetId: "visual-m6-salt-dissolving-hydration", number: "9", title: "Zout oplossen en hydratatie", path: "/assets/chemtrainer/m6/zout-oplossen-hydratatie.webp", shortReference: "zie figuur 9" },
  { id: "fig-ms-mplus2", assetId: "visual-ms-mplus2-chlorine-bromine", number: "10", title: "M+2-patroon bij chloor of broom", path: "/assets/chemtrainer/analyse/mplus2-chloor-broom.webp", shortReference: "zie figuur 10" },
  { id: "fig-gc-chromatogram", assetId: "visual-gc-chromatogram-retention", number: "11", title: "GC-chromatogram en retentietijd", path: "/assets/chemtrainer/analyse/gc-chromatogram-retentietijd.webp", shortReference: "zie figuur 11" },
  { id: "fig-ms-route", assetId: "visual-ms-instrument-route", number: "12", title: "Massaspectrometer route", path: "/assets/chemtrainer/analyse/massaspectrometer-route.webp", shortReference: "zie figuur 12" },
  { id: "fig-dna-vs-rna", assetId: "visual-dna-vs-rna", number: "13", title: "DNA versus RNA", path: "/assets/chemtrainer/dna/dna-versus-rna.webp", shortReference: "zie figuur 13" },
  { id: "fig-dna-nucleotide", assetId: "visual-dna-nucleotide-bouwsteen", number: "14", title: "Nucleotide als bouwsteen", path: "/assets/chemtrainer/dna/nucleotide-bouwsteen.webp", shortReference: "zie figuur 14" },
  { id: "fig-m9-ionic-vs-molecular", assetId: "visual-m9-ionic-vs-molecular", number: "15", title: "Ionrooster versus moleculaire stof", path: "/assets/chemtrainer/m9/ionrooster-vs-molecuulstof.webp", shortReference: "zie figuur 15" },
  { id: "fig-m9-collisions", assetId: "visual-m9-effective-collisions", number: "16", title: "Effectieve botsingen", path: "/assets/chemtrainer/m9/effectieve-botsingen.webp", shortReference: "zie figuur 16" },
  { id: "fig-m9-forces", assetId: "visual-m9-intermolecular-forces", number: "17", title: "Intermoleculaire krachten", path: "/assets/chemtrainer/m9/krachten-waterstofbrug-dipool-vdw.webp", shortReference: "zie figuur 17" },
  { id: "fig-m7-redox-route", assetId: "visual-redox-electron-route", number: "18", title: "Elektronenroute bij redox", path: "/assets/chemtrainer/redox/redox-elektronenroute.webp", shortReference: "zie figuur 18" },
];

export const getFigureByAssetId = (assetId: string) => figureRegistry.find((figure) => figure.assetId === assetId);

export const getFigureByPath = (path?: string) => {
  if (!path) return undefined;
  return figureRegistry.find((figure) => figure.path === path);
};
