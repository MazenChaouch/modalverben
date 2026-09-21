/* =========================================================================
   Modal verbs data — single source of truth for the generator, the
   conjugation trainer and the glossary.
   ========================================================================= */

export type Gender = "m" | "f" | "n" | "pl";
export type PersonKey = "ich" | "du" | "er" | "wir" | "ihr" | "sie";
export type ModalId = "möchten" | "können" | "müssen" | "wollen" | "sollen" | "dürfen";

/* ---------------- modal verbs: full conjugation ---------------- */
export const MODAL_VERBS: Record<ModalId, {
  inf: string;
  en: string;
  forms: Record<PersonKey, string>;
  vokalwechsel?: string;
}> = {
  möchten: {
    inf: "möchten",
    en: "would like to",
    forms: { ich: "möchte", du: "möchtest", er: "möchte", wir: "möchten", ihr: "möchtet", sie: "möchten" },
  },
  können: {
    inf: "können",
    en: "can / be able to",
    forms: { ich: "kann", du: "kannst", er: "kann", wir: "können", ihr: "könnt", sie: "können" },
    vokalwechsel: "ö → a (Sg.)",
  },
  müssen: {
    inf: "müssen",
    en: "must / have to",
    forms: { ich: "muss", du: "musst", er: "muss", wir: "müssen", ihr: "müsst", sie: "müssen" },
    vokalwechsel: "ü → u (Sg.)",
  },
  wollen: {
    inf: "wollen",
    en: "want to",
    forms: { ich: "will", du: "willst", er: "will", wir: "wollen", ihr: "wollt", sie: "wollen" },
    vokalwechsel: "o → i (Sg.)",
  },
  sollen: {
    inf: "sollen",
    en: "should / ought to",
    forms: { ich: "soll", du: "sollst", er: "soll", wir: "sollen", ihr: "sollt", sie: "sollen" },
  },
  dürfen: {
    inf: "dürfen",
    en: "may / be allowed to",
    forms: { ich: "darf", du: "darfst", er: "darf", wir: "dürfen", ihr: "dürft", sie: "dürfen" },
    vokalwechsel: "ü → a (Sg.)",
  },
};

/* ---------------- dative verbs (used in exercises) ---------------- */
export type DatVerbId = "helfen" | "danken" | "antworten" | "glauben" | "gratulieren";

export const DAT_VERBS: Record<DatVerbId, {
  inf: string;
  en: string;
  forms: Record<PersonKey, string>;
}> = {
  helfen:      { inf: "helfen",      en: "to help",          forms: { ich: "helfe", du: "hilfst", er: "hilft", wir: "helfen", ihr: "helft", sie: "helfen" } },
  danken:      { inf: "danken",      en: "to thank",          forms: { ich: "danke", du: "dankst", er: "dankt", wir: "danken", ihr: "dankt", sie: "danken" } },
  antworten:   { inf: "antworten",   en: "to answer",         forms: { ich: "antworte", du: "antwortest", er: "antwortet", wir: "antworten", ihr: "antwortet", sie: "antworten" } },
  glauben:     { inf: "glauben",     en: "to believe",        forms: { ich: "glaube", du: "glaubst", er: "glaubt", wir: "glauben", ihr: "glaubt", sie: "glauben" } },
  gratulieren: { inf: "gratulieren", en: "to congratulate",  forms: { ich: "gratuliere", du: "gratulierst", er: "gratuliert", wir: "gratulieren", ihr: "gratuliert", sie: "gratulieren" } },
};

/* ---------------- nouns for exercises ---------------- */
export type NounEntry = {
  word: string;
  art: "der" | "die" | "das";
  g: Gender;
  en: string;
  plural: string;      // full plural incl. article, "—" if not used
  person?: boolean;
  noPoss?: boolean;
  noIndef?: boolean;
};

export const NOUNS: NounEntry[] = [
  { word: "Mann", art: "der", g: "m", en: "man", plural: "die Männer", person: true },
  { word: "Frau", art: "die", g: "f", en: "woman", plural: "die Frauen", person: true },
  { word: "Kind", art: "das", g: "n", en: "child", plural: "die Kinder", person: true },
  { word: "Vater", art: "der", g: "m", en: "father", plural: "die Väter", person: true, noIndef: true },
  { word: "Mutter", art: "die", g: "f", en: "mother", plural: "die Mütter", person: true, noIndef: true },
  { word: "Bruder", art: "der", g: "m", en: "brother", plural: "die Brüder", person: true },
  { word: "Schwester", art: "die", g: "f", en: "sister", plural: "die Schwestern", person: true },
  { word: "Freund", art: "der", g: "m", en: "friend", plural: "die Freunde", person: true },
  { word: "Freundin", art: "die", g: "f", en: "girlfriend", plural: "die Freundinnen", person: true },
  { word: "Lehrer", art: "der", g: "m", en: "teacher", plural: "die Lehrer", person: true },
  { word: "Arzt", art: "der", g: "m", en: "doctor", plural: "die Ärzte", person: true },
  { word: "Hund", art: "der", g: "m", en: "dog", plural: "die Hunde" },
  { word: "Katze", art: "die", g: "f", en: "cat", plural: "die Katzen" },
  { word: "Buch", art: "das", g: "n", en: "book", plural: "die Bücher" },
  { word: "Auto", art: "das", g: "n", en: "car", plural: "die Autos" },
  { word: "Haus", art: "das", g: "n", en: "house", plural: "die Häuser" },
  { word: "Kaffee", art: "der", g: "m", en: "coffee", plural: "—" },
  { word: "Brot", art: "das", g: "n", en: "bread", plural: "die Brote" },
  { word: "Milch", art: "die", g: "f", en: "milk", plural: "—" },
  { word: "Computer", art: "der", g: "m", en: "computer", plural: "die Computer" },
  { word: "Familie", art: "die", g: "f", en: "family", plural: "die Familien" },
  { word: "Eltern", art: "die", g: "pl", en: "parents", plural: "die Eltern", noIndef: true },
  { word: "Kinder", art: "die", g: "pl", en: "children", plural: "die Kinder" },
  { word: "Leute", art: "die", g: "pl", en: "people", plural: "die Leute", noIndef: true },
  { word: "Arbeit", art: "die", g: "f", en: "work", plural: "die Arbeiten" },
  { word: "Geld", art: "das", g: "n", en: "money", plural: "—" },
  { word: "Zeit", art: "die", g: "f", en: "time", plural: "die Zeiten" },
  { word: "Schule", art: "die", g: "f", en: "school", plural: "die Schulen" },
  { word: "Sprache", art: "die", g: "f", en: "language", plural: "die Sprachen" },
  { word: "Prüfung", art: "die", g: "f", en: "exam", plural: "die Prüfungen" },
];

/* ---------------- form helpers ---------------- */
export const defDat = (g: Gender) => ({ m: "dem", f: "der", n: "dem", pl: "den" })[g];
export const einDat = (g: Gender) => ({ m: "einem", f: "einer", n: "einem", pl: "" })[g];
export const defNom = (g: Gender) => ({ m: "der", f: "die", n: "das", pl: "die" })[g];
export const einNom = (g: Gender) => ({ m: "ein", f: "eine", n: "ein", pl: "" })[g];

/* ---------------- possessives ---------------- */
export const POSSESSIVES = ["mein", "dein", "sein", "ihr", "unser", "euer"] as const;
export type PossStem = (typeof POSSESSIVES)[number];

export const possDat = (stem: PossStem, g: Gender): string => {
  if (stem === "euer") {
    if (g === "m" || g === "n") return "eurem";
    if (g === "f") return "eurer";
    return "euren";
  }
  if (g === "m" || g === "n") return stem + "em";
  if (g === "f") return stem + "er";
  return stem + "en";
};

export const possForm = (stem: PossStem, g: Gender, kase: "nom" | "dat"): string => {
  const needsEn = kase === "dat" && g === "m";
  const needsE = g === "f" || g === "pl";
  if (stem === "euer") {
    if (needsEn) return "euren";
    if (needsE) return "eure";
    return "euer";
  }
  if (needsEn) return stem + "en";
  if (needsE) return stem + "e";
  return stem;
};

/* ---------------- pronouns in dative ---------------- */
export const pronDat: Record<string, string> = {
  ich: "mir", du: "dir", er: "ihm", sie: "ihr", es: "ihm",
  wir: "uns", ihr: "euch", "sie.pl": "ihnen", Sie: "Ihnen",
};

/* ---------------- dative plural word helper ---------------- */
export const datPluralNP = (plural: string): string => {
  if (plural === "—") return "—";
  const word = plural.replace(/^die\s+/, "");
  if (/[ns]$/.test(word)) return `den ${word}`;
  return `den ${word}n`;
};

export const datPlWord = (n: NounEntry): string => {
  const word = n.plural.replace(/^die\s+/, "");
  return /[ns]$/.test(word) ? word : `${word}n`;
};

/* ---------------- reference labels ---------------- */
export const G_NAME: Record<Gender, string> = { m: "maskulin", f: "feminin", n: "Neutrum", pl: "Plural" };
