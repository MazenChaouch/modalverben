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
    meaning: "möchten drückt einen höflichen Wunsch aus — etwas, das man gern hätte oder gern tun würde. Höflich, weich, wunschbezogen.",
    en: "would like to — expresses a polite wish or desire",
    examples: [
      { de: "Ich möchte einen Kaffee, bitte.", en: "I would like a coffee, please." },
      { de: "Wir möchten nächste Woche nach Berlin fahren.", en: "We would like to travel to Berlin next week." },
      { de: "Möchtest du mir bei den Hausaufgaben helfen?", en: "Would you like to help me with my homework?" },
    ],
  },
  {
    id: "können",
    verb: "können",
    meaning: "können drückt aus, ob etwas möglich ist oder ob man die Fähigkeit dazu hat.",
    en: "can / to be able to — expresses ability or possibility",
    examples: [
      { de: "Ich kann gut schwimmen.", en: "I can swim well." },
      { de: "Kannst du heute Abend Deutsch mit uns sprechen?", en: "Can you speak German with us tonight?" },
      { de: "Er kann heute nicht zur Party kommen, er muss arbeiten.", en: "He cannot come to the party today, he has to work." },
    ],
  },
  {
    id: "müssen",
    verb: "müssen",
    meaning: "müssen zeigt, dass etwas notwendig ist — Pflicht, Zwang, Dringlichkeit.",
    en: "must / to have to — expresses necessity or obligation",
    examples: [
      { de: "Ich muss morgen früh aufstehen, mein Zug fährt um 6 Uhr.", en: "I have to get up early tomorrow, my train leaves at 6 o'clock." },
      { de: "Du musst die Hausaufgaben machen, sonst gibt es Ärger.", en: "You must do your homework, otherwise there will be trouble." },
      { de: "Wir müssen jetzt gehen, der Film fängt gleich an.", en: "We have to leave now, the movie starts soon." },
    ],
  },
  {
    id: "wollen",
    verb: "wollen",
    meaning: "wollen zeigt einen festen Willen, ein Ziel oder eine Absicht — stärker und direkter als möchten.",
    en: "to want to — expresses a firm intention or goal",
    examples: [
      { de: "Ich will Arzt werden und kranken Menschen helfen.", en: "I want to become a doctor and help sick people." },
      { de: "Sie will nach Hause gehen, weil sie müde ist.", en: "She wants to go home because she is tired." },
      { de: "Wollt ihr am Wochenende mit uns wandern gehen?", en: "Do you want to go hiking with us this weekend?" },
    ],
  },
  {
    id: "sollen",
    verb: "sollen",
    meaning: "sollen zeigt eine Empfehlung, einen Rat oder eine Pflicht, die von jemand anderem kommt.",
    en: "should / ought to — expresses advice, recommendation, or external obligation",
    examples: [
      { de: "Du sollst mehr Wasser trinken, das ist gesund.", en: "You should drink more water, it is healthy." },
      { de: "Er soll den Arzt besuchen, er hustet schon eine Woche.", en: "He should see the doctor, he has been coughing for a week." },
      { de: "Ihr sollt pünktlich sein, der Lehrer wartet nicht.", en: "You should be on time, the teacher will not wait." },
    ],
  },
  {
    id: "dürfen",
    verb: "dürfen",
    meaning: "dürfen zeigt, ob etwas erlaubt ist — Erlaubnis, Genehmigung oder Verbot.",
    en: "may / to be allowed to — expresses permission",
    examples: [
      { de: "Darf ich dich etwas fragen?", en: "May I ask you something?" },
      { de: "Hier darf man nicht rauchen, das ist verboten.", en: "You are not allowed to smoke here, it is forbidden." },
      { de: "Die Kinder dürfen bis 22 Uhr fernsehen, dann ist Schlafenszeit.", en: "The children may watch TV until 10 PM, then it is bedtime." },
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
    en: "We have to answer him.",
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
    pre: "Ich ", post: " dir gern bei den Hausaufgaben.",
    options: ["helfe", "hilfst"],
    correct: "helfe",
    why: "helfen ist ein Dativ-Verb — ich helfe. Kein Modalverb hier, das Vollverb wird konjugiert.",
  },
  {
    pre: "Kannst du ", post: " bitte helfen?",
    options: ["mir", "mich"],
    correct: "mir",
    why: "helfen ist ein Dativ-Verb — Wem sollst du helfen? mir.",
  },
  {
    pre: "Du ", post: " viel für die Prüfung lernen.",
    options: ["musst", "müsst"],
    correct: "musst",
    why: "müssen — du musst. Vokalwechsel ü → u im Singular!",
  },
  {
    pre: "Er ", post: " heute nicht mitkommen.",
    options: ["darf", "darfst"],
    correct: "darf",
    why: "dürfen — er darf. In der 3. Person Singular steht nur der Stamm mit Vokalwechsel ü → a.",
  },
  {
    pre: "Wir ", post: " am Wochenende nach Hause gehen.",
    options: ["wollen", "wollt"],
    correct: "wollen",
    why: "wollen — wir wollen. Im Plural bleibt der volle Stamm o.",
  },
  {
    pre: "Anna ", post: " dem Kind helfen.",
    options: ["soll", "sollst"],
    correct: "soll",
    why: "sollen — Anna (sie, 3. Person Singular) soll. Kein Vokalwechsel bei sollen.",
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
  { subj: "Ich", modal: "möchte", dativ: "dir", infinitiv: "helfen", en: "I would like to help you with your homework.", note: "möchte + Dativ + Infinitiv" },
  { subj: "Du", modal: "kannst", dativ: "mir", infinitiv: "danken", en: "You can thank me for the birthday gift.", note: "können — Vokalwechsel ö→a" },
  { subj: "Er", modal: "muss", dativ: "ihr", infinitiv: "antworten", en: "He has to answer her because she is waiting.", note: "müssen — Vokalwechsel ü→u" },
  { subj: "Wir", modal: "wollen", dativ: "euch", infinitiv: "gratulieren", en: "We want to congratulate you on your exam.", note: "wollen — Vokalwechsel o→i" },
  { subj: "Ihr", modal: "sollt", dativ: "ihm", infinitiv: "glauben", en: "You should believe him, he is telling the truth.", note: "sollen — kein Vokalwechsel" },
  { subj: "Sie", modal: "darf", dativ: "dir", infinitiv: "helfen", en: "She is allowed to help you with the move.", note: "dürfen — Vokalwechsel ü→a" },
];
