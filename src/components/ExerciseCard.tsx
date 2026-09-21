import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Languages, Lightbulb, Volume2 } from "lucide-react";
import type { GenExercise } from "../data/generator";
import { cleanForSpeech } from "../hooks/useSpeech";
import { stripArticles, useSettings } from "../hooks/useSettings";

export type Mark = "idle" | "correct" | "wrong";
export const blankKey = (uid: string, id: string) => `${uid}:${id}`;
export const norm = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?,;]+$/g, "");

const CAT_LABEL: Record<string, string> = {
  modal: "Modalverb",
  dativ: "Dativ-Verb",
  article: "Artikel",
  poss: "Possessivartikel",
  pron: "Personalpronomen",
  mixed: "gemischt",
};

type Props = {
  ex: GenExercise;
  values: Record<string, string>;
  marks: Record<string, Mark>;
  solved: boolean;
  firstTry: boolean;
  tipOpen: boolean;
  showEn: boolean;
  audio: boolean;
  onValue: (ex: GenExercise, id: string, v: string) => void;
  onCheck: (ex: GenExercise) => void;
  onNext: (ex: GenExercise) => void;
  onToggleTip: (uid: string) => void;
  onToggleEn: (uid: string) => void;
  onSpeak: (text: string) => void;
  registerRef: (uid: string, el: HTMLDivElement | null) => void;
};

export const ExerciseCard = ({
  ex, values, marks, solved, firstTry, tipOpen, showEn, audio,
  onValue, onCheck, onNext, onToggleTip, onToggleEn, onSpeak, registerRef,
}: Props) => {
  const markList = ex.blanks.map((b) => marks[blankKey(ex.uid, b.id)] ?? "idle");
  const anyWrong = markList.includes("wrong");
  const allFilled = ex.blanks.every((b) => norm(values[blankKey(ex.uid, b.id)] ?? "") !== "");
  const { settings } = useSettings();
  const cue = settings.hideArticles ? stripArticles(ex.cue) : ex.cue;
  const showTipCta = !settings.hideTips;
  const showEnCta = !settings.hideEnglish;
  const tipVisible = tipOpen && !settings.hideTips;
  const enVisible = showEn && !settings.hideEnglish;

  return (
    <div
      ref={(el) => registerRef(ex.uid, el)}
      className={`relative rounded-3xl border-2 p-5 md:p-7 transition-all duration-300 ${
        solved
          ? "border-mint/70 bg-mint/[0.045]"
          : anyWrong
            ? "border-accent bg-white/70 animate-shake"
            : "border-ink/15 bg-white/60 hover:border-ink/35"
      }`}
    >
      {/* category chip */}
      <span className="absolute -top-2.5 right-5 text-[9.5px] font-bold uppercase tracking-[0.16em] bg-paper border border-line rounded-full px-2.5 py-1 text-ink-soft">
        {CAT_LABEL[ex.cat]}
      </span>

      <div className="flex items-start gap-4">
        <span
          className={`shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-display text-lg font-[750] transition-colors ${
            solved ? "bg-mint text-white" : "bg-ink text-paper"
          }`}
        >
          {solved ? <Check className="w-5 h-5" strokeWidth={3} /> : ex.n}
        </span>

        <div className="flex-1 min-w-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (solved) onNext(ex);
              else if (allFilled) onCheck(ex);
            }}
          >
            <div className="font-display text-[1.35rem] md:text-[1.65rem] font-[600] leading-[2.2] md:leading-[2.1] flex flex-wrap items-baseline gap-x-1.5">
              {ex.segments.map((seg, i) => {
                if (seg.kind === "text") return <span key={i}>{seg.text}</span>;
                const b = ex.blanks.find((x) => x.id === seg.id)!;
                const k = blankKey(ex.uid, b.id);
                const mark = marks[k] ?? "idle";
                const longest = Math.max(...b.answers.map((a) => a.length), 3);
                return (
                  <input
                    key={k}
                    value={values[k] ?? ""}
                    disabled={solved}
                    onChange={(e) => onValue(ex, b.id, e.target.value)}
                    placeholder="…"
                    aria-label={`Lücke ${b.id} in Aufgabe ${ex.n}`}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    style={{ width: `${longest + 2.2}ch` }}
                    className={`mx-0.5 rounded-lg px-1.5 text-center bg-paper-deep/50 outline-none border-b-[3px] transition-colors placeholder:text-ink/25 ${
                      mark === "correct"
                        ? "border-mint text-mint"
                        : mark === "wrong"
                          ? "border-accent text-accent-deep"
                          : "border-ink/35 focus:border-accent focus:bg-white"
                    } ${solved ? "bg-transparent" : ""}`}
                  />
                );
              })}
              {cue !== "" && (
                <span className="ml-2 align-middle">
                  <span className="text-[12px] font-sans font-semibold text-ink-soft bg-paper-deep/80 border border-line rounded-full px-3 py-1 whitespace-nowrap">
                    {cue}
                  </span>
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {!solved ? (
                <button
                  type="submit"
                  disabled={!allFilled}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer ${
                    allFilled
                      ? "bg-ink text-paper hover:bg-accent"
                      : "bg-paper-deep text-ink/40 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" strokeWidth={2.8} /> Prüfen
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-mint text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-ink transition-colors cursor-pointer"
                >
                  Weiter <ArrowRight className="w-4 h-4" strokeWidth={2.8} />
                </button>
              )}

              {showTipCta && (
                <button
                  type="button"
                  onClick={() => onToggleTip(ex.uid)}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    tipOpen ? "border-hl bg-hl/30 text-ink" : "border-line text-ink-soft hover:border-ink/40"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" strokeWidth={2.4} /> Tipp
                </button>
              )}

              {showEnCta && (
                <button
                  type="button"
                  onClick={() => onToggleEn(ex.uid)}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    showEn ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink/40"
                  }`}
                  title="Englische Übersetzung"
                >
                  <Languages className="w-4 h-4" strokeWidth={2.4} /> EN
                </button>
              )}

              {audio && solved && (
                <button
                  type="button"
                  onClick={() => onSpeak(cleanForSpeech(ex.solution))}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:border-accent hover:text-accent transition-colors cursor-pointer"
                  title="Satz anhören"
                >
                  <Volume2 className="w-4 h-4" strokeWidth={2.4} /> Hören
                </button>
              )}

              {firstTry && solved && (
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint">
                  Erster Versuch!
                </span>
              )}
            </div>
          </form>

          <AnimatePresence>
            {enVisible && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-[14px] italic text-ink-soft"
              >
                <span className="block pt-3">{ex.en}</span>
              </motion.p>
            )}
            {tipVisible && !solved && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-[14px] text-ink-soft leading-relaxed"
              >
                <span className="block pt-3">{ex.tip}</span>
              </motion.p>
            )}
            {solved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-xl bg-mint/[0.09] border border-mint/40 px-4 py-3 text-[14px] leading-relaxed text-ink/85">
                  <span className="font-bold text-mint text-[11px] uppercase tracking-[0.16em] block mb-1">Warum?</span>
                  {ex.why}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
