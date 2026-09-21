import type { ReactNode } from "react";
import { B } from "./content";
import {
  DAT_VERBS, MODAL_VERBS, NOUNS, POSSESSIVES,
  defDat, einDat, possDat, pronDat, datPlWord,
} from "./modalVerbs";
import type {
  DatVerbId, Gender, ModalId, NounEntry,
  PersonKey, PossStem,
} from "./modalVerbs";

/* ================= deterministic RNG ================= */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(rng: () => number, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const shuffle = <T,>(rng: () => number, arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ================= subjects ================= */
type Subject = { t: string; f: PersonKey; person: string; en: string; third: boolean };
const SUBJECTS: Subject[] = [
  { t: "Ich", f: "ich", person: "ich", en: "I", third: false },
  { t: "Du", f: "du", person: "du", en: "You", third: false },
  { t: "Er", f: "er", person: "er", en: "He", third: true },
  { t: "Sie", f: "er", person: "sie", en: "She", third: true },
  { t: "Anna", f: "er", person: "sie", en: "Anna", third: true },
  { t: "Tom", f: "er", person: "er", en: "Tom", third: true },
  { t: "Wir", f: "wir", person: "wir", en: "We", third: false },
  { t: "Ihr", f: "ihr", person: "ihr", en: "You (guys)", third: false },
  { t: "Die Kinder", f: "sie", person: "sie.pl", en: "The children", third: false },
];

/* ================= English helpers ================= */
const D_EN: Record<DatVerbId, [string, string]> = {
  helfen: ["help", "helps"],
  danken: ["thank", "thanks"],
  antworten: ["answer", "answers"],
  glauben: ["believe", "believes"],
  gratulieren: ["congratulate", "congratulates"],
};
const MODAL_EN: Record<ModalId, string> = {
  möchten: "would like to",
  können: "can",
  müssen: "must",
  wollen: "want to",
  sollen: "should",
  dürfen: "may",
};
const POSS_EN_SHORT: Record<PossStem, string> = {
  mein: "my", dein: "your", sein: "his", ihr: "her/their", unser: "our", euer: "your",
};
const PRON_DAT_EN: Record<string, string> = {
  ich: "me", du: "you", er: "him", sie: "her", wir: "us", ihr: "you (guys)",
  "sie.pl": "them", Sie: "you",
};
const enDatVerb = (v: DatVerbId, s: Subject) => D_EN[v][s.third ? 1 : 0];
const enDef = (n: NounEntry) => `the ${n.en.split(",")[0]}`;
const enIndef = (n: NounEntry) => {
  const w = n.en.split(",")[0];
  return n.g === "pl" ? w : `${/^[aeiou]/i.test(w) ? "an" : "a"} ${w}`;
};
const enPoss = (stem: PossStem, n: NounEntry) =>
  `${POSS_EN_SHORT[stem]} ${n.en.split(",")[0]}`;

/* ================= exercise type ================= */
export type Segment = { kind: "text"; text: string } | { kind: "blank"; id: string };
export type Category = "modal" | "dativ" | "article" | "poss" | "pron" | "mixed";

export type GenExercise = {
  uid: string;
  n: number;
  segments: Segment[];
  cue: string;
  blanks: { id: string; answers: string[] }[];
  solution: string;
  en: string;
  tip: string;
  why: ReactNode;
  cat: Category;
  gender: Gender | "-";
};

const seg = (text: string) => ({ kind: "text" as const, text });
const blk = (id: string) => ({ kind: "blank" as const, id });
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

type BuilderCtx = {
  rng: () => number;
  drawNoun: (filter?: (n: NounEntry) => boolean) => NounEntry;
  n: number;
};

const PERSON_VERBS: DatVerbId[] = ["helfen", "danken", "antworten", "glauben", "gratulieren"];
const ALL_MODAL_IDS: ModalId[] = ["möchten", "können", "müssen", "wollen", "sollen", "dürfen"];
const PERSONS: PersonKey[] = ["ich", "du", "er", "wir", "ihr", "sie"];

/* ================= builders ================= */

/* --- Level 1: Simple modal conjugation + basic dative --- */

/** Modal verb conjugation: "Ich ___ Deutsch lernen." */
const tModalConj = (c: BuilderCtx): GenExercise => {
  const modal = pick(c.rng, ALL_MODAL_IDS);
  const subj = pick(c.rng, SUBJECTS);
  const form = MODAL_VERBS[modal].forms[subj.f];
  const verbs = ["Deutsch lernen", "schwimmen", "Kochen", "Gitarre spielen", "Auto fahren"];
  const verbPhrase = pick(c.rng, verbs);
  const enForm = subj.en === "I" ? "I" : (subj.third ? subj.en : subj.en.toLowerCase());

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "modal", gender: "-",
    segments: [seg(`${subj.t} `), blk("a"), seg(` ${verbPhrase}.`)],
    cue: `(${modal})`,
    blanks: [{ id: "a", answers: [form] }],
    solution: `${subj.t} ${form} ${verbPhrase}.`,
    en: `${enForm} ${MODAL_EN[modal]} ${verbPhrase}.`,
    tip: `Konjugiere "${modal}" für "${subj.person}". ${MODAL_VERBS[modal].vokalwechsel ? `Vokalwechsel: ${MODAL_VERBS[modal].vokalwechsel}` : "Kein Vokalwechsel im Singular!"}`,
    why: <>"{modal}" für <B>{subj.person}</B> = <B>{form}</B>.{MODAL_VERBS[modal].vokalwechsel ? <> Vokalwechsel: <B>{MODAL_VERBS[modal].vokalwechsel}</B>.</> : <> Kein Vokalwechsel.</>}</>,
  };
};

/** Modal + Dativ-Verb: "Ich möchte dir helfen." */
const tModalDativ = (c: BuilderCtx): GenExercise => {
  const modal = pick(c.rng, ALL_MODAL_IDS);
  const subj = pick(c.rng, SUBJECTS);
  const modalForm = MODAL_VERBS[modal].forms[subj.f];
  const datVerb = pick(c.rng, PERSON_VERBS);
  const pronKeys = ["ich", "du", "er", "sie", "wir", "ihr", "sie.pl"];
  const obj = pick(c.rng, pronKeys.filter((p) => p !== subj.person));
  const pronDatForm = pronDat[obj];
  const enObj = PRON_DAT_EN[obj] ?? obj;
  const enSubj = subj.en === "I" ? "I" : (subj.third ? subj.en : subj.en.toLowerCase());

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "modal", gender: "-",
    segments: [seg(`${subj.t} ${modalForm} `), blk("a"), seg(` ${DAT_VERBS[datVerb].inf}.`)],
    cue: `(${obj === "sie.pl" ? "sie (Pl.)" : obj})`,
    blanks: [{ id: "a", answers: [pronDatForm] }],
    solution: `${subj.t} ${modalForm} ${pronDatForm} ${DAT_VERBS[datVerb].inf}.`,
    en: `${enSubj} ${MODAL_EN[modal]} ${enDatVerb(datVerb, { ...subj, third: false })} ${enObj}.`,
    tip: `Das Dativ-Objekt steht nach dem Modalverb. Frag: Wem ${DAT_VERBS[datVerb].inf}?`,
    why: <>Dativ-Verb <B>{DAT_VERBS[datVerb].inf}</B> → Objekt im Dativ: <B>{obj} → {pronDatForm}</B>.</>,
  };
};

/** Definite article in dative: "Ich helfe ___ Mann." */
const tDefArticle = (c: BuilderCtx): GenExercise => {
  const noun = c.drawNoun((n) => n.g !== "pl");
  const subj = pick(c.rng, SUBJECTS);
  const datVerb = pick(c.rng, PERSON_VERBS);
  const verb = DAT_VERBS[datVerb].forms[subj.f];
  const ans = defDat(noun.g);

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "article", gender: noun.g,
    segments: [seg(`${subj.t} ${verb} `), blk("a"), seg(` ${noun.word}.`)],
    cue: `(${noun.art} ${noun.word})`,
    blanks: [{ id: "a", answers: [ans] }],
    solution: `${subj.t} ${verb} ${ans} ${noun.word}.`,
    en: `${subj.en === "I" ? "I" : subj.en} ${enDatVerb(datVerb, subj)} ${enDef(noun)}.`,
    tip: `${DAT_VERBS[datVerb].inf} ist ein Dativ-Verb — frag: Wem? Das Nomen ist ${noun.g === "m" ? "maskulin" : noun.g === "f" ? "feminin" : "neutral"}.`,
    why: <>„{noun.art} ${noun.word}“ steht nach einem Dativ-Verb ({DAT_VERBS[datVerb].inf}) im <B>Dativ</B> → <B>{defDat(noun.g)}</B> (Frage: <B>Wem?</B>).</>,
  };
};

/* --- Level 2: Modal + articles/pronouns in dative --- */

/** Indefinite article in dative */
const tIndefArticle = (c: BuilderCtx): GenExercise => {
  const noun = c.drawNoun((n) => !n.noIndef && n.g !== "pl");
  const subj = pick(c.rng, SUBJECTS);
  const datVerb = pick(c.rng, PERSON_VERBS);
  const verb = DAT_VERBS[datVerb].forms[subj.f];
  const ans = einDat(noun.g);

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "article", gender: noun.g,
    segments: [seg(`${subj.t} ${verb} `), blk("a"), seg(` ${noun.word}.`)],
    cue: "(ein)",
    blanks: [{ id: "a", answers: [ans] }],
    solution: `${subj.t} ${verb} ${ans} ${noun.word}.`,
    en: `${subj.en === "I" ? "I" : subj.en} ${enDatVerb(datVerb, subj)} ${enIndef(noun)}.`,
    tip: "ein verhält sich wie der — auch im Dativ.",
    why: noun.g === "f"
      ? <>Feminin im Dativ: <B>eine → einer</B>. (wie die → der).</>
      : <><B>{noun.g === "m" ? "Maskulin" : "Neutrum"}</B> im Dativ: <B>ein → {ans}</B>.</>,
  };
};

/** Possessive in dative */
const tPoss = (c: BuilderCtx): GenExercise => {
  const noun = c.drawNoun((n) => !n.noPoss);
  const subj = pick(c.rng, SUBJECTS);
  const stem = pick(c.rng, POSSESSIVES);
  const datVerb = pick(c.rng, PERSON_VERBS);
  const verb = DAT_VERBS[datVerb].forms[subj.f];
  const ans = possDat(stem, noun.g);

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "poss", gender: noun.g,
    segments: [seg(`${subj.t} ${verb} `), blk("a"), seg(` ${noun.word}.`)],
    cue: `(${stem})`,
    blanks: [{ id: "a", answers: [ans] }],
    solution: `${subj.t} ${verb} ${ans} ${noun.word}.`,
    en: `${subj.en === "I" ? "I" : subj.en} ${enDatVerb(datVerb, subj)} ${enPoss(stem, noun)}.`,
    tip: `Possessivartikel folgen dem ein-Pattern: m/n → -em, f → -er.`,
    why: <>„{noun.art} ${noun.word}“ + Dativ → <B>{stem} → {ans}</B>.</>,
  };
};

/** Pronoun in dative */
const tPronoun = (c: BuilderCtx): GenExercise => {
  const subj = pick(c.rng, SUBJECTS);
  const pronKeys = ["ich", "du", "er", "sie", "wir", "ihr", "sie.pl"] as const;
  const options = pronKeys.filter((p) => p !== subj.person);
  const obj = pick(c.rng, options);
  const datVerb = pick(c.rng, PERSON_VERBS);
  const verb = DAT_VERBS[datVerb].forms[subj.f];
  const ans = pronDat[obj];

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "pron", gender: "-",
    segments: [seg(`${subj.t} ${verb} `), blk("a"), seg(".")],
    cue: `(${obj === "sie.pl" ? "sie (Pl.)" : obj})`,
    blanks: [{ id: "a", answers: [ans] }],
    solution: `${subj.t} ${verb} ${ans}.`,
    en: `${subj.en === "I" ? "I" : subj.en} ${enDatVerb(datVerb, subj)} ${PRON_DAT_EN[obj]}.`,
    tip: "Das Pronomen ist hier das Dativ-Objekt — frag: Wem?",
    why: <>Als Dativ-Objekt steht das Pronomen im Dativ: <B>{obj} → {ans}</B>.</>,
  };
};

/* --- Level 3: Modal + possessives + mir/mich trap --- */

/** Modal + Dativ-Verb + possessive noun: "Ich möchte meinem Bruder helfen." */
const tModalPossDativ = (c: BuilderCtx): GenExercise => {
  const modal = pick(c.rng, ALL_MODAL_IDS);
  const subj = pick(c.rng, SUBJECTS);
  const modalForm = MODAL_VERBS[modal].forms[subj.f];
  const noun = c.drawNoun((n) => !n.noPoss && !!n.person);
  const stem = pick(c.rng, POSSESSIVES);
  const datVerb = pick(c.rng, PERSON_VERBS);
  const inf = DAT_VERBS[datVerb].inf;
  const ans = possDat(stem, noun.g);
  const enSubj = subj.en === "I" ? "I" : (subj.third ? subj.en : subj.en.toLowerCase());

  return {
    uid: `s0-l0-i0`, n: c.n, cat: "mixed", gender: noun.g,
    segments: [seg(`${subj.t} ${modalForm} `), blk("a"), seg(` ${noun.word} ${inf}.`)],
    cue: `(${stem} · ${noun.art} ${noun.word})`,
    blanks: [{ id: "a", answers: [ans] }],
    solution: `${subj.t} ${modalForm} ${ans} ${noun.word} ${inf}.`,
    en: `${enSubj} ${MODAL_EN[modal]} ${enDatVerb(datVerb, { ...subj, third: false })} ${enPoss(stem, noun)}.`,
    tip: `Modal + Dativ-Objekt + Infinitiv. Das Possessiv steht im Dativ.`,
    why: <>Dativ → <B>{ans}</B>. Auch bei „{modalForm} … {inf}" gilt die Regel.</>,
  };
};

/** mir oder mich? Dativ oder Akkusativ? */
const DAT_AKK_DATA: { segs: ("a" | string)[]; a: string; sol: string; en: string; tip: string; why: ReactNode }[] = [
  {
    segs: ["Ich ", "a", " dir gern bei den Hausaufgaben."],
    a: "helfe", sol: "Ich helfe dir gern bei den Hausaufgaben.",
    en: "I like helping you with your homework.",
    tip: "helfen ist ein Dativ-Verb — ich helfe, du hilfst.",
    why: <><B>helfen</B> für „ich" = <B>helfe</B>. Vokalwechsel e → i nur in der 2./3. Person Singular (hilfst, hilft).</>,
  },
  {
    segs: ["Kannst du ", "a", " bitte helfen?"],
    a: "mir", sol: "Kannst du mir bitte helfen?",
    en: "Can you please help me with my homework?",
    tip: "helfen = Dativ — Wem sollst du helfen? mir.",
    why: <><B>helfen</B> regiert den Dativ: <B>mir</B>, nicht „mich“.</>,
  },
  {
    segs: ["Du ", "a", " viel für die Prüfung lernen."],
    a: "musst", sol: "Du musst viel für die Prüfung lernen.",
    en: "You have to study a lot for the exam.",
    tip: "müssen — du musst. Vokalwechsel ü→u!",
    why: <><B>müssen</B> für „du" = <B>musst</B>. Vokalwechsel: ü → u.</>,
  },
  {
    segs: ["Er ", "a", " heute länger aufbleiben."],
    a: "darf", sol: "Er darf heute länger aufbleiben.",
    en: "He is allowed to stay up longer today.",
    tip: "dürfen — er darf. Vokalwechsel ü → a!",
    why: <><B>dürfen</B> für „er" = <B>darf</B>. Vokalwechsel: ü → a, keine Endung in der 3. Person.</>,
  },
  {
    segs: ["Wir ", "a", " Deutsch lernen."],
    a: "wollen", sol: "Wir wollen Deutsch lernen.",
    en: "We want to learn German because we live in Berlin.",
    tip: "wollen — wir wollen. Infinitiv am Satzende.",
    why: <><B>wollen</B> für „wir" = <B>wollen</B>. Infinitiv steht am Satzende.</>,
  },
  {
    segs: ["Anna ", "a", " dem Kind helfen."],
    a: "soll", sol: "Anna soll dem Kind helfen.",
    en: "Anna should help the child with its homework.",
    tip: `sollen — Anna (sie) soll. Dativ \u201Edem Kind\u201C nach helfen.`,
    why: <><B>sollen</B> für „sie" (Anna) = <B>soll</B>. Dativ-Objekt bleibt im Dativ.</>,
  },
];

const tDatAkk = (c: BuilderCtx): GenExercise => {
  const v = pick(c.rng, DAT_AKK_DATA);
  const segments: Segment[] = v.segs.map((s) => (s === "a" ? blk("a") : seg(s)));
  return {
    uid: `s0-l0-i0`, n: c.n, cat: "mixed", gender: "-",
    segments,
    cue: "(Modalverb oder Pronomen?)",
    blanks: [{ id: "a", answers: [v.a] }],
    solution: v.segs.map((s) => (s === "a" ? v.a : s)).join(""),
    en: v.en,
    tip: v.tip,
    why: v.why,
  };
};

/** Nominativ vs Dativ contrast: "Das ist mein Hund. Ich helfe meinem Hund." */
const tIstHilft = (c: BuilderCtx): GenExercise => {
  const noun = c.drawNoun((n) => n.g !== "pl" && !n.noPoss);
  const stem = pick(c.rng, POSSESSIVES);
  const a1 = possDat(stem, noun.g);
  const a2 = possDat(stem, noun.g);
  return {
    uid: `s0-l0-i0`, n: c.n, cat: "mixed", gender: noun.g,
    segments: [seg("Das ist "), blk("a"), seg(` ${noun.word}. Ich helfe `), blk("b"), seg(` ${noun.word}.`)],
    cue: `(${stem})`,
    blanks: [{ id: "a", answers: [a1] }, { id: "b", answers: [a2] }],
    solution: `Das ist ${a1} ${noun.word}. Ich helfe ${a2} ${noun.word}.`,
    en: `That is ${POSS_EN_SHORT[stem]} ${noun.en.split(",")[0]}. I help ${POSS_EN_SHORT[stem]} ${noun.en.split(",")[0]}.`,
    tip: `Nach \u201EDas ist \u2026\u201C steht der Nominativ. Nach \u201Ehelfe\u201C fragst du Wem? \u2192 Dativ.`,
    why: <>„Das ist …" → <B>Nominativ</B>. „Ich helfe" → <B>Dativ</B> → <B>{a2}</B>.</>,
  };
};

/* ================= levels & rounds ================= */
export type Level = 1 | 2 | 3;

export const LEVELS: { id: Level; name: string; desc: string; focus: string }[] = [
  { id: 1, name: "Einfach", desc: "Modal-Konjugation, einfache Dativ-Artikel — die Grundlagen.", focus: "kann/muss · dem/der" },
  { id: 2, name: "Mittel", desc: "Artikel, Pronomen, Possessive — und der Modal+Dativ-Satz.", focus: "meinem · dir · einem" },
  { id: 3, name: "Profi", desc: "Modal + Dativ-Verb + Infinitiv, mir/mich-Fallen, doppelt Lücken.", focus: "möchte helfen · mir/mich" },
];

export const ROUND_SIZE = 5;

const roundCache = new Map<string, GenExercise[]>();
const ROUND_CACHE_MAX = 80;

export function generateRound(seed: number, level: Level): GenExercise[] {
  const cacheKey = `${seed}-l${level}`;
  const cached = roundCache.get(cacheKey);
  if (cached) return cached;
  const rng = mulberry32(seed * 7919 + level * 104729);
  const pool = shuffle(rng, NOUNS.map((_, i) => i));
  let pi = 0;
  const drawNoun = (filter?: (n: NounEntry) => boolean): NounEntry => {
    for (let k = 0; k < pool.length * 2; k++) {
      const noun = NOUNS[pool[pi % pool.length]];
      pi++;
      if (!filter || filter(noun)) return noun;
    }
    return NOUNS.find((n) => !filter || filter(n)) ?? NOUNS[0];
  };
  const mk = (n: number): BuilderCtx => ({ rng, drawNoun, n });

  const builders: ((c: BuilderCtx) => GenExercise)[] =
    level === 1
      ? [
          tModalConj,
          (c) => tDefArticle(c),
          (c) => tModalDativ(c),
          (c) => tDefArticle(c),
          tModalConj,
        ]
      : level === 2
        ? [
            (c) => tIndefArticle(c),
            tPronoun,
            (c) => tPoss(c),
            tPronoun,
            (c) => tIndefArticle(c),
          ]
        : [
            tModalPossDativ,
            tDatAkk,
            tIstHilft,
            tModalPossDativ,
            tDatAkk,
          ];

  const round = builders.map((b, idx) => {
    const ex = b(mk(idx + 1));
    ex.uid = `s${seed}-l${level}-i${idx}`;
    ex.n = idx + 1;
    return ex;
  });
  if (roundCache.size >= ROUND_CACHE_MAX) {
    const oldest = roundCache.keys().next().value;
    if (oldest !== undefined) roundCache.delete(oldest);
  }
  roundCache.set(cacheKey, round);
  return round;
}

/** Regenerate one specific exercise (used by the mistake-review queue). */
export function regenerate(seed: number, level: Level, idx: number): GenExercise | null {
  const round = generateRound(seed, level);
  return round[idx] ?? null;
}
