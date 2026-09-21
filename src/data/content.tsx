import type { ReactNode } from "react";

/* ---------- small helpers: the emphasized dative endings ---------- */
export const M = ({ children }: { children?: ReactNode }) => (
  <em className="not-italic font-[800] text-accent">{children ?? "m"}</em>
);
export const R = ({ children }: { children?: ReactNode }) => (
  <em className="not-italic font-[800] text-accent">{children ?? "r"}</em>
);
export const N = ({ children }: { children?: ReactNode }) => (
  <em className="not-italic font-[800] text-accent">{children ?? "n"}</em>
);
export const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold">{children}</strong>
);

/* ---------- chapters for side rail ---------- */
export type ChapterDef = {
  id: string;
  num: string;
  kicker: string;
  title: ReactNode;
  lede: string;
};

export const chapters: ChapterDef[] = [
  {
    id: "km1",
    num: "01",
    kicker: "Grundlagen",
    title: <>Was ist ein <span className="text-accent">Modalverb</span>?</>,
    lede: "The auxiliary verbs that express ability, necessity, and desire.",
  },
  {
    id: "km2",
    num: "02",
    kicker: "Konjugation",
    title: <>Die 6 <span className="text-accent">Modalverben</span></>,
    lede: "möchten, können, müssen, wollen, sollen, dürfen — complete conjugation.",
  },
  {
    id: "km3",
    num: "03",
    kicker: "Vokalwechsel",
    title: <>Singular vs. <span className="text-accent">Plural</span></>,
    lede: "kann/können, muss/müssen — the vowel change pattern.",
  },
  {
    id: "km4",
    num: "04",
    kicker: "Dativ-Verben",
    title: <>Modal + <span className="text-accent">Dativ</span></>,
    lede: "helfen, danken, antworten — they demand the dative.",
  },
  {
    id: "km5",
    num: "05",
    kicker: "Satzbau",
    title: <>Modal + Dativ + <span className="text-accent">Infinitiv</span></>,
    lede: "Word order: Subject + Modal + Dativ-Objekt + Infinitiv.",
  },
  {
    id: "km6",
    num: "06",
    kicker: "Artikel & Pronomen",
    title: <>Dativ mit <span className="text-accent">Artikeln</span></>,
    lede: "dem/der/dem/den — definite, indefinite, possessive in dative.",
  },
  {
    id: "km7",
    num: "07",
    kicker: "Der Klassiker",
    title: <><span className="text-blau">mir</span> oder <span className="text-accent">mich</span>?</>,
    lede: "Dative or accusative? The verb decides.",
  },
];

/* ---------- modal verb meanings & examples ---------- */
export type ModalMeaning = {
  id: string;
  verb: string;
  meaning: string;
  en: string;
  examples: { de: string; en: string }[];
};

export const modalMeanings: ModalMeaning[] = [
  {
    id: "möchten",
    verb: "möchten",
    meaning: "möchte ausdrücken, dass man etwas gern hätte oder tun würde — höflich, weich, wunschbezogen.",
    en: "would like to — expresses a polite wish or desire",
    examples: [
      { de: "Ich möchte einen Kaffee, bitte.", en: "I would like a coffee, please." },
      { de: "Wir möchten nach Berlin fahren.", en: "We would like to go to Berlin." },
      { de: "Möchtest du mir helfen?", en: "Would you like to help me?" },
    ],
  },
  {
    id: "können",
    verb: "können",
    meaning: "können drückt aus, ob etwas möglich ist oder ob man die Fähigkeit dazu hat.",
    en: "can / to be able to — expresses ability or possibility",
    examples: [
      { de: "Ich kann gut schwimmen.", en: "I can swim well." },
      { de: "Kannst du Deutsch?", en: "Can you (speak) German?" },
      { de: "Er kann heute nicht kommen.", en: "He cannot come today." },
    ],
  },
  {
    id: "müssen",
    verb: "müssen",
    meaning: "müssen zeigt, dass etwas notwendig ist — Pflicht, Zwang, Dringlichkeit.",
    en: "must / to have to — expresses necessity or obligation",
    examples: [
      { de: "Ich muss morgen früh aufstehen.", en: "I have to get up early tomorrow." },
      { de: "Du musst die Hausaufgaben machen.", en: "You must do the homework." },
      { de: "Wir müssen jetzt gehen.", en: "We have to leave now." },
    ],
  },
  {
    id: "wollen",
    verb: "wollen",
    meaning: "wollen zeigt einen festen Willen, ein Ziel oder eine Absicht — stärker als möchten.",
    en: "to want to — expresses a firm intention or goal",
    examples: [
      { de: "Ich will Arzt werden.", en: "I want to become a doctor." },
      { de: "Sie will nach Hause gehen.", en: "She wants to go home." },
      { de: "Wollt ihr mitkommen?", en: "Do you (guys) want to come along?" },
    ],
  },
  {
    id: "sollen",
    verb: "sollen",
    meaning: "sollen zeigt eine Empfehlung, einen Rat oder eine Pflicht, die von别人 kommt.",
    en: "should / ought to — expresses advice, recommendation, or external obligation",
    examples: [
      { de: "Du sollst mehr Wasser trinken.", en: "You should drink more water." },
      { de: "Er soll den Arzt besuchen.", en: "He should visit the doctor." },
      { de: "Ihr sollt pünktlich sein.", en: "You (guys) should be on time." },
    ],
  },
  {
    id: "dürfen",
    verb: "dürfen",
    meaning: "dürfen zeigt, ob etwas erlaubt ist — Erlaubnis, Genehmigung, Verbot.",
    en: "may / to be allowed to — expresses permission",
    examples: [
      { de: "Darf ich fragen?", en: "May I ask?" },
      { de: "Hier darf man nicht rauchen.", en: "You are not allowed to smoke here." },
      { de: "Die Kinder dürfen bis 22 Uhr fernsehen.", en: "The children may watch TV until 10 PM." },
    ],
  },
];

/* ---------- sentence flows for intro chapter ---------- */
export type FlowToken = { t: string; tag: string; tone: "nom" | "verb" | "akk" | "dat" };

export const introFlows: { tokens: FlowToken[]; en: string; qa: { q: string; a: string } }[] = [
  {
    tokens: [
      { t: "Ich", tag: "Subjekt", tone: "nom" },
      { t: "möchte", tag: "Modalverb", tone: "verb" },
      { t: "dir", tag: "Dativ-Objekt", tone: "dat" },
      { t: "helfen.", tag: "Infinitiv", tone: "verb" },
    ],
    en: "I would like to help you.",
    qa: { q: "Wem möchtest du helfen?", a: "→ dir (Dativ)" },
  },
  {
    tokens: [
      { t: "Er", tag: "Subjekt", tone: "nom" },
      { t: "kann", tag: "Modalverb", tone: "verb" },
      { t: "mir", tag: "Dativ-Objekt", tone: "dat" },
      { t: "danken.", tag: "Infinitiv", tone: "verb" },
    ],
    en: "He can thank me.",
    qa: { q: "Wem kann er danken?", a: "→ mir (Dativ)" },
  },
  {
    tokens: [
      { t: "Wir", tag: "Subjekt", tone: "nom" },
      { t: "müssen", tag: "Modalverb", tone: "verb" },
      { t: "ihm", tag: "Dativ-Objekt", tone: "dat" },
      { t: "antworten.", tag: "Infinitiv", tone: "verb" },
    ],
    en: "We must answer him.",
    qa: { q: "Wem müssen wir antworten?", a: "→ ihm (Dativ)" },
  },
];

/* ---------- marquee items ---------- */
export const marqueeItems = [
  "möchte → mir helfen",
  "kann → dir danken",
  "muss → ihm antworten",
  "soll → uns glauben",
  "darf → euch gratulieren",
  "will → ihr glauben",
  "können → Vokalwechsel: ö → a",
  "müssen → Vokalwechsel: ü → u",
  "wollen → Vokalwechsel: o → i",
  "dürfen → Vokalwechsel: ü → a",
];

/* ---------- lab questions for mir/mich ---------- */
export type LabQ = { pre: string; post: string; options: string[]; correct: string; why: string };

export const labQuestions: LabQ[] = [
  {
    pre: "Ich ", post: " dir gern.",
    options: ["helfe", "helfst"],
    correct: "helfe",
    why: "helfen — ich helfe. Das Modalverb konjugiert sich nach dem Subjekt.",
  },
  {
    pre: "Kannst du ", post: " bitte?",
    options: ["mir", "mich"],
    correct: "mir",
    why: "helfen ist ein Dativ-Verb — Wem helfe ich? mir.",
  },
  {
    pre: "Du ", post: " Deutsch lernen.",
    options: ["musst", "musst"],
    correct: "musst",
    why: "müssen — du musst. Vokalwechsel im Singular!",
  },
  {
    pre: "Er ", post: " das nicht machen.",
    options: ["darf", "darfst"],
    correct: "darf",
    why: "dürfen — er darf. Im Singular gibt es keinen -st.",
  },
  {
    pre: "Wir ", m: "", post: " nach Hause gehen.",
    options: ["wollen", "willst"],
    correct: "wollen",
    why: "wollen — wir wollen. Im Plural bleibt der Stamm.",
  },
  {
    pre: "Sie ", post: " dem Kind helfen.",
    options: ["soll", "sollst"],
    correct: "soll",
    why: "sollen — sie soll. Drittperson Singular = Stamm.",
  },
];

/* ---------- modal sentence examples for rules ---------- */
export type ModalExample = {
  subj: string;
  modal: string;
  dativ: string;
  infinitiv: string;
  en: string;
  note: string;
};

export const modalExamples: ModalExample[] = [
  { subj: "Ich", modal: "möchte", dativ: "dir", infinitiv: "helfen", en: "I would like to help you.", note: "möchte + Dativ + Infinitiv" },
  { subj: "Du", modal: "kannst", dativ: "mir", infinitiv: "danken", en: "You can thank me.", note: "können — Vokalwechsel ö→a" },
  { subj: "Er", modal: "muss", dativ: "ihr", infinitiv: "antworten", en: "He must answer her.", note: "müssen — Vokalwechsel ü→u" },
  { subj: "Wir", modal: "wollen", dativ: "euch", infinitiv: "gratulieren", en: "We want to congratulate you.", note: "wollen — Vokalwechsel o→i" },
  { subj: "Ihr", modal: "sollt", dativ: "ihm", infinitiv: "glauben", en: "You (guys) should believe him.", note: "sollen — kein Vokalwechsel" },
  { subj: "Sie", modal: "darf", dativ: "dir", infinitiv: "helfen", en: "She may help you.", note: "dürfen — Vokalwechsel ü→a" },
];
