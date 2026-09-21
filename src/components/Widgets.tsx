import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { MODAL_VERBS } from "../data/modalVerbs";
import type { ModalId, PersonKey } from "../data/modalVerbs";
import { useSpeech, cleanForSpeech } from "../hooks/useSpeech";
import { Reveal } from "./Atoms";

const PERSONS: { key: PersonKey; label: string; en: string }[] = [
  { key: "ich", label: "ich", en: "I" },
  { key: "du", label: "du", en: "you" },
  { key: "er", label: "er/sie/es", en: "he/she/it" },
  { key: "wir", label: "wir", en: "we" },
  { key: "ihr", label: "ihr", en: "you (guys)" },
  { key: "sie", label: "sie/Sie", en: "they/you (formal)" },
];

const MODALS: { id: ModalId; label: string; en: string }[] = [
  { id: "möchten", label: "möchten", en: "would like to" },
  { id: "können", label: "können", en: "can" },
  { id: "müssen", label: "müssen", en: "must" },
  { id: "wollen", label: "wollen", en: "want to" },
  { id: "sollen", label: "sollen", en: "should" },
  { id: "dürfen", label: "dürfen", en: "may" },
];

/* ================= ModalConjugationTrainer ================= */
export const ModalConjugationTrainer = () => {
  const [selectedModal, setSelectedModal] = useState<ModalId>("möchten");
  const [selectedPerson, setSelectedPerson] = useState<PersonKey>("ich");
  const { speak, supported, enabled } = useSpeech();
  const form = MODAL_VERBS[selectedModal].forms[selectedPerson];
  const modalInfo = MODAL_VERBS[selectedModal];

  const say = (t: string) => speak(cleanForSpeech(t));

  return (
    <Reveal>
      <div className="rounded-3xl border-2 border-ink bg-white/60 p-6 md:p-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent mb-4">
          Modal-Trainer
        </div>

        {/* modal selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MODALS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModal(m.id)}
              className={`px-4 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all cursor-pointer ${
                selectedModal === m.id
                  ? "bg-ink text-paper border-ink"
                  : "bg-white/60 border-line hover:border-ink/40"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* person selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {PERSONS.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPerson(p.key)}
              className={`rounded-xl border-2 p-3 text-center transition-all cursor-pointer ${
                selectedPerson === p.key
                  ? "border-accent bg-accent/[0.08] shadow-[3px_3px_0_0_rgba(226,72,31,0.35)]"
                  : "border-line bg-white/55 hover:border-ink/30"
              }`}
            >
              <div className="font-display text-lg font-[650]">{p.label}</div>
              <div className="text-[10px] text-ink-soft">{p.en}</div>
            </button>
          ))}
        </div>

        {/* result */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedModal}-${selectedPerson}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border-2 border-ink bg-ink text-paper p-6 text-center shadow-[5px_5px_0_0_rgba(226,72,31,0.35)]"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
              {selectedPerson} + {selectedModal}
            </div>
            <div className="font-display text-4xl md:text-5xl font-[700] text-hl mb-3">
              {form}
            </div>
            {modalInfo.vokalwechsel && (
              <div className="text-[12px] font-bold text-accent mb-3">
                Vokalwechsel: {modalInfo.vokalwechsel}
              </div>
            )}
            <div className="text-[13px] text-white/60 italic">
              {selectedPerson} {form} Deutsch lernen.
            </div>
            {supported && enabled && (
              <button
                onClick={() => say(`${selectedPerson} ${form} Deutsch lernen.`)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:border-hl hover:text-hl transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" strokeWidth={2.4} /> Anhören
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* full conjugation for selected modal */}
        <div className="mt-6 rounded-2xl border border-line bg-white/55 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft mb-3">
            Vollständige Konjugation: {selectedModal}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PERSONS.map((p) => (
              <div
                key={p.key}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  p.key === selectedPerson ? "bg-accent/10 border border-accent/40" : "bg-paper-deep/50"
                }`}
              >
                <span className="text-ink-soft">{p.label}</span>{" "}
                <span className="font-display font-[650]">{MODAL_VERBS[selectedModal].forms[p.key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

/* ================= DatAkkLab ================= */
export type LabQ = { pre: string; post: string; options: string[]; correct: string; why: string };

const LAB_QUESTIONS: LabQ[] = [
  {
    pre: "Kannst du ", post: " bitte helfen?",
    options: ["mir", "mich"],
    correct: "mir",
    why: "helfen = Dativ — Wem hilfst du? mir.",
  },
  {
    pre: "Ich ", post: " dir gern.",
    options: ["helfe", "helfst"],
    correct: "helfe",
    why: "helfen — ich helfe. Modal + Infinitiv.",
  },
  {
    pre: "Du ", post: " viel lernen.",
    options: ["musst", "musst"],
    correct: "musst",
    why: "müssen — du musst. Vokalwechsel u->u.",
  },
  {
    pre: "Er ", post: " dem Kind danken.",
    options: ["soll", "sollst"],
    correct: "soll",
    why: "sollen — er soll. Dativ dem Kind nach danken.",
  },
  {
    pre: "Wir ", post: " euch gratulieren.",
    options: ["wollen", "willst"],
    correct: "wollen",
    why: "wollen — wir wollen. Infinitiv am Ende.",
  },
  {
    pre: "Sie ", post: " dir antworten.",
    options: ["darf", "darfst"],
    correct: "darf",
    why: "dürfen — sie darf. Vokalwechsel u->a.",
  },
  {
    pre: "Ich ", post: " das nicht glauben.",
    options: ["kann", "kannst"],
    correct: "kann",
    why: "können — ich kann. Vokalwechsel o->a.",
  },
  {
    pre: "Ihr ", post: " mir helfen.",
    options: ["sollt", "sollst"],
    correct: "sollt",
    why: "sollen — ihr sollt. Dativ mir nach helfen.",
  },
];

export const DatAkkLab = () => {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const q = LAB_QUESTIONS[idx];

  const handleAnswer = (a: string) => {
    setAnswered(a);
    const ok = a === q.correct;
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setIdx((i) => (i + 1) % LAB_QUESTIONS.length);
    setAnswered(null);
  };

  return (
    <Reveal>
      <div className="rounded-3xl border-2 border-ink bg-white/60 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
            Dat/Akk-Labor
          </div>
          <div className="text-[12px] font-bold text-ink-soft">
            {score.right}/{score.total} richtig
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="font-display text-2xl md:text-3xl font-[650] mb-6">
              {q.pre}<span className="text-accent font-bold">___</span>{q.post}
            </div>

            <div className="flex justify-center gap-3 mb-4">
              {q.options.map((opt) => {
                const isCorrect = opt === q.correct;
                const isSelected = opt === answered;
                return (
                  <button
                    key={opt}
                    onClick={() => !answered && handleAnswer(opt)}
                    disabled={!!answered}
                    className={`px-6 py-3 rounded-xl font-display text-lg font-[650] border-2 transition-all cursor-pointer ${
                      answered
                        ? isCorrect
                          ? "border-mint bg-mint/10 text-mint"
                          : isSelected
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-line text-ink/30"
                        : "border-line bg-white/60 hover:border-ink/40 hover:shadow-[3px_3px_0_0_rgba(226,72,31,0.35)]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <div className={`rounded-xl px-5 py-3 text-[14px] leading-relaxed ${
                  answered === q.correct
                    ? "bg-mint/[0.09] border border-mint/40 text-ink/80"
                    : "bg-accent/[0.09] border border-accent/40 text-ink/80"
                }`}>
                  <span className={`font-bold text-[11px] uppercase tracking-[0.16em] ${
                    answered === q.correct ? "text-mint" : "text-accent"
                  }`}>
                    {answered === q.correct ? "Richtig! ✓" : "Falsch ✗"}
                  </span>{" "}
                  {q.why}
                </div>
                <button
                  onClick={next}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-accent transition-colors cursor-pointer"
                >
                  Nächste Frage
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Reveal>
  );
};
