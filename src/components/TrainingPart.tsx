import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, BookOpen, ChevronDown, Dices, GraduationCap, Layers,
  RotateCcw, Search, Target, TrendingUp, Trophy, Volume2, VolumeX,
} from "lucide-react";
import type { Category, GenExercise, Level } from "../data/generator";
import { generateRound, LEVELS, ROUND_SIZE } from "../data/generator";
import { DAT_VERBS, G_NAME, MODAL_VERBS, NOUNS, datPluralNP } from "../data/modalVerbs";
import type { Gender } from "../data/modalVerbs";
import { useSpeech, cleanForSpeech } from "../hooks/useSpeech";
import { Art, stripArticles, useSettings } from "../hooks/useSettings";
import { ExerciseCard, blankKey, norm } from "./ExerciseCard";
import type { Mark } from "./ExerciseCard";
import { Reveal } from "./Atoms";
import { ModalConjugationTrainer } from "./Widgets";

type Mode = "generator" | "modal" | "review" | "vocab";
type MistakeRef = { seed: number; level: Level; idx: number };
type CatStat = { right: number; wrong: number };

type Persist = {
  level: Level;
  seed: number;
  values: Record<string, string>;
  marks: Record<string, Mark>;
  solved: string[];
  firstTry: Record<string, boolean>;
  attempts: Record<string, number>;
  byCat: Record<string, CatStat>;
  byGender: Record<string, CatStat>;
  mistakes: MistakeRef[];
  rounds: Record<string, number>;
  totalSolved: number;
};

const LS_KEY = "modalverben-training-v1";
const VOCAB_PAGE = 48;
const newSeed = () => Math.floor(Math.random() * 1e9) + 1;

const emptyPersist = (): Persist => ({
  level: 1, seed: newSeed(), values: {}, marks: {}, solved: [], firstTry: {},
  attempts: {}, byCat: {}, byGender: {}, mistakes: [], rounds: {}, totalSolved: 0,
});

const loadPersist = (): Persist => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persist;
      if (p?.seed && p?.level) return { ...emptyPersist(), ...p };
    }
  } catch { /* ignore */ }
  return emptyPersist();
};

const CAT_NAME: Record<Category, string> = {
  modal: "Modalverb-Konjugation",
  dativ: "Dativ-Verb",
  article: "Artikel (def./indef.)",
  poss: "Possessivartikel",
  pron: "Personalpronomen",
  mixed: "Kombi-Sätze",
};

const MODES: { id: Mode; label: string; icon: typeof Dices }[] = [
  { id: "generator", label: "Generator", icon: Dices },
  { id: "modal", label: "Modal-Trainer", icon: GraduationCap },
  { id: "review", label: "Fehler-Training", icon: Target },
  { id: "vocab", label: "Wortschatz", icon: Layers },
];

/* ============================== stats ============================== */
const StatBar = ({ label, s }: { label: string; s: CatStat }) => {
  const total = s.right + s.wrong;
  const pct = total ? Math.round((s.right / total) * 100) : 0;
  const tone = pct >= 80 ? "bg-mint" : pct >= 55 ? "bg-hl" : "bg-accent";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12.5px] font-semibold text-ink/80">{label}</span>
        <span className="text-[11px] font-bold text-ink-soft">
          {total ? `${pct}%` : "—"} <span className="font-normal">({total})</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-paper-deep overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/* ============================== main ============================== */
export const TrainingPart = ({ onGoRules }: { onGoRules: () => void; onPdf: () => void }) => {
  const [persist, setPersist] = useState<Persist>(loadPersist);
  const [mode, setMode] = useState<Mode>("generator");
  const [tips, setTips] = useState<Record<string, boolean>>({});
  const [ens, setEns] = useState<Record<string, boolean>>({});
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [vocabGender, setVocabGender] = useState<string>("alle");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { speak, supported, enabled, setEnabled } = useSpeech();
  const { settings } = useSettings();

  const { level, seed } = persist;
  const exercises = useMemo(() => generateRound(seed, level), [seed, level]);

  const reviewList = useMemo(
    () =>
      persist.mistakes
        .map((m) => {
          const ex = generateRound(m.seed, m.level)[m.idx];
          return ex ? { ...ex, uid: `rev-${ex.uid}` } : null;
        })
        .filter((x): x is GenExercise => !!x),
    [persist.mistakes]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(persist)); } catch { /* ignore */ }
    }, 400);
    return () => clearTimeout(t);
  }, [persist]);

  const solvedSet = useMemo(() => new Set(persist.solved), [persist.solved]);
  const allSolved = exercises.every((e) => solvedSet.has(e.uid));
  const roundFirstTry = exercises.filter((e) => persist.firstTry[e.uid]).length;
  const levelInfo = LEVELS.find((l) => l.id === level)!;

  const setValue = (ex: GenExercise, id: string, v: string) => {
    const k = blankKey(ex.uid, id);
    setPersist((s) => ({
      ...s,
      values: { ...s.values, [k]: v },
      marks: { ...s.marks, [k]: "idle" as Mark },
    }));
  };

  const check = (ex: GenExercise, isReview: boolean) => {
    const newMarks: Record<string, Mark> = { ...persist.marks };
    let allOk = true;
    for (const b of ex.blanks) {
      const k = blankKey(ex.uid, b.id);
      const ok = b.answers.some((a) => norm(a) === norm(persist.values[k] ?? ""));
      newMarks[k] = ok ? "correct" : "wrong";
      if (!ok) allOk = false;
    }

    setPersist((s) => {
      const prevAttempts = s.attempts[ex.uid] ?? 0;
      const attempts = { ...s.attempts, [ex.uid]: prevAttempts + 1 };
      const firstTry = { ...s.firstTry };
      let solved = s.solved;
      let byCat = s.byCat;
      let byGender = s.byGender;
      let mistakes = s.mistakes;
      let rounds = s.rounds;
      let totalSolved = s.totalSolved;

      if (prevAttempts === 0) {
        const c = s.byCat[ex.cat] ?? { right: 0, wrong: 0 };
        byCat = { ...s.byCat, [ex.cat]: { right: c.right + (allOk ? 1 : 0), wrong: c.wrong + (allOk ? 0 : 1) } };
        if (ex.gender !== "-") {
          const g = s.byGender[ex.gender] ?? { right: 0, wrong: 0 };
          byGender = { ...s.byGender, [ex.gender]: { right: g.right + (allOk ? 1 : 0), wrong: g.wrong + (allOk ? 0 : 1) } };
        }
        if (!allOk && !isReview) {
          const idx = exercises.findIndex((e) => e.uid === ex.uid);
          if (idx >= 0 && !s.mistakes.some((m) => m.seed === s.seed && m.level === s.level && m.idx === idx)) {
            mistakes = [{ seed: s.seed, level: s.level, idx }, ...s.mistakes].slice(0, 40);
          }
        }
      }

      if (allOk && !s.solved.includes(ex.uid)) {
        solved = [...s.solved, ex.uid];
        firstTry[ex.uid] = prevAttempts === 0;
        totalSolved = s.totalSolved + 1;
        if (isReview) {
          const bare = ex.uid.replace("rev-", "");
          mistakes = s.mistakes.filter((m) => `s${m.seed}-l${m.level}-i${m.idx}` !== bare);
        } else {
          const done = exercises.every((e) => solved.includes(e.uid));
          const was = exercises.every((e) => s.solved.includes(e.uid));
          if (done && !was) rounds = { ...s.rounds, [String(s.level)]: (s.rounds[String(s.level)] ?? 0) + 1 };
        }
      }

      return { ...s, marks: newMarks, attempts, firstTry, solved, byCat, byGender, mistakes, rounds, totalSolved };
    });
  };

  const goNext = (ex: GenExercise, list: GenExercise[]) => {
    const idx = list.findIndex((e) => e.uid === ex.uid);
    const next = [...list.slice(idx + 1), ...list.slice(0, idx)].find((e) => !solvedSet.has(e.uid));
    if (next) cardRefs.current[next.uid]?.scrollIntoView({ behavior: "smooth", block: "center" });
    else document.getElementById("ergebnis")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const startRound = (lv: Level) => {
    setPersist((s) => ({ ...s, level: lv, seed: newSeed(), values: {}, marks: {}, solved: [], firstTry: {}, attempts: {} }));
    setTips({}); setEns({}); setOpenKey(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTip = (uid: string) => setTips((t) => ({ ...t, [uid]: !t[uid] }));
  const toggleEn = (uid: string) => setEns((t) => ({ ...t, [uid]: !t[uid] }));
  const registerRef = (uid: string, el: HTMLDivElement | null) => { cardRefs.current[uid] = el; };

  const weakest = useMemo(() => {
    const entries = (Object.keys(persist.byCat) as Category[])
      .map((c) => {
        const s = persist.byCat[c];
        const t = s.right + s.wrong;
        return { c, pct: t ? s.right / t : 1, total: t };
      })
      .filter((e) => e.total >= 2);
    if (!entries.length) return null;
    entries.sort((a, b) => a.pct - b.pct);
    return entries[0].pct < 0.8 ? entries[0] : null;
  }, [persist.byCat]);

  const deferredQuery = useDeferredValue(query);
  const [vocabShown, setVocabShown] = useState(VOCAB_PAGE);
  useEffect(() => { setVocabShown(VOCAB_PAGE); }, [deferredQuery, vocabGender]);
  const vocabList = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return NOUNS.filter((n) => {
      if (vocabGender !== "alle" && n.g !== vocabGender) return false;
      if (!q) return true;
      return n.word.toLowerCase().includes(q) || n.en.toLowerCase().includes(q);
    });
  }, [deferredQuery, vocabGender]);

  const say = (t: string) => speak(cleanForSpeech(t));

  return (
    <div className="pt-32 md:pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* ---------- header ---------- */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Teil 2 · Dein Trainingsraum
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="font-display text-5xl md:text-7xl font-[680] tracking-tight leading-[0.98]">
              Endlos üben<span className="text-accent">.</span>
            </h1>
            {supported && (
              <button
                onClick={() => setEnabled(!enabled)}
                className={`mt-3 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  enabled ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink/40"
                }`}
                title="Deutsche Aussprache an/aus"
              >
                {enabled ? <Volume2 className="w-4 h-4" strokeWidth={2.5} /> : <VolumeX className="w-4 h-4" strokeWidth={2.5} />}
                Audio {enabled ? "an" : "aus"}
              </button>
            )}
          </div>
          <p className="mt-5 text-lg text-ink-soft max-w-xl leading-relaxed">
            Vier Trainingsarten, ein Ziel: Die Modalverben sollen dir in Fleisch und Blut übergehen.
            Alles wird lokal gespeichert — du kannst jederzeit weitermachen.
          </p>
        </Reveal>

        {/* ---------- mode tabs ---------- */}
        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2">
            {MODES.map((m) => {
              const active = mode === m.id;
              const Icon = m.icon;
              const badge = m.id === "review" ? persist.mistakes.length : 0;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] border-2 transition-all cursor-pointer ${
                    active ? "bg-ink text-paper border-ink" : "bg-white/60 border-line hover:border-ink/40"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {m.label}
                  {badge > 0 && (
                    <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-accent text-white" : "bg-accent/15 text-accent-deep"}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {/* ================= GENERATOR ================= */}
          {mode === "generator" && (
            <motion.div key="gen" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <Reveal delay={0.08}>
                <div className="mt-7 grid sm:grid-cols-3 gap-3">
                  {LEVELS.map((lv) => {
                    const active = lv.id === level;
                    const done = persist.rounds[String(lv.id)] ?? 0;
                    return (
                      <button
                        key={lv.id}
                        onClick={() => !active && startRound(lv.id)}
                        className={`text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                          active ? "border-ink bg-ink text-paper shadow-[5px_5px_0_0_rgba(226,72,31,0.35)]" : "border-line bg-white/55 hover:border-ink/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-display text-2xl font-[800] ${active ? "text-hl" : "text-accent"}`}>{lv.id}</span>
                          {done > 0 && (
                            <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${active ? "text-white/60" : "text-ink-soft"}`}>
                              {done} {done === 1 ? "Runde" : "Runden"}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-[15px] mb-1">{lv.name}</div>
                        <p className={`text-[12.5px] leading-snug ${active ? "text-white/65" : "text-ink-soft"}`}>{lv.desc}</p>
                        <p className={`mt-2 text-[11px] font-semibold ${active ? "text-hl/80" : "text-accent/80"}`}>{lv.focus}</p>
                      </button>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-6 mb-8 flex items-center gap-3 flex-wrap rounded-2xl border border-line bg-white/55 px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/40 text-accent-deep text-[11px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5">
                    Level {level} · {levelInfo.name}
                  </span>
                  <span className="text-sm font-semibold text-ink/70">
                    {persist.solved.filter((u) => exercises.some((e) => e.uid === u)).length}/{ROUND_SIZE} in dieser Runde
                  </span>
                  <span className="text-sm text-ink-soft">· {persist.totalSolved} Aufgaben insgesamt</span>
                  <button
                    onClick={() => startRound(level)}
                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Dices className="w-4 h-4" strokeWidth={2.5} /> Neue Runde
                  </button>
                </div>
              </Reveal>

              {weakest && (
                <Reveal>
                  <div className="mb-6 flex items-start gap-3.5 rounded-2xl border-2 border-accent/40 bg-accent/[0.05] px-5 py-4">
                    <TrendingUp className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={2.3} />
                    <p className="text-[14.5px] leading-relaxed text-ink/85">
                      <b>Dein Schwachpunkt gerade:</b> {CAT_NAME[weakest.c]} ({Math.round(weakest.pct * 100)}% richtig).
                    </p>
                  </div>
                </Reveal>
              )}

              <div className="space-y-5">
                {exercises.map((ex) => (
                  <ExerciseCard
                    key={ex.uid}
                    ex={ex}
                    values={persist.values}
                    marks={persist.marks}
                    solved={solvedSet.has(ex.uid)}
                    firstTry={!!persist.firstTry[ex.uid]}
                    tipOpen={!!tips[ex.uid]}
                    showEn={!!ens[ex.uid]}
                    audio={supported && enabled}
                    onValue={setValue}
                    onCheck={(e) => check(e, false)}
                    onNext={(e) => goNext(e, exercises)}
                    onToggleTip={toggleTip}
                    onToggleEn={toggleEn}
                    onSpeak={say}
                    registerRef={registerRef}
                  />
                ))}
              </div>

              <AnimatePresence>
                {allSolved && (
                  <motion.div
                    id="ergebnis"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-12 rounded-[2rem] border-2 border-ink bg-ink text-paper px-7 py-12 text-center relative overflow-hidden"
                  >
                    <span aria-hidden className="absolute -right-8 -top-14 font-display font-black text-[13rem] leading-none text-white/[0.05] select-none">M</span>
                    <motion.div
                      initial={{ rotate: -12, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                      className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-hl text-ink flex items-center justify-center"
                    >
                      <Trophy className="w-8 h-8" strokeWidth={2.2} />
                    </motion.div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50 mb-2">Level {level} · Runde geschafft</div>
                    <div className="font-display text-4xl md:text-6xl font-[700]">
                      {roundFirstTry}<span className="text-white/40">/{ROUND_SIZE}</span>
                    </div>
                    <div className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.22em] text-hl">beim ersten Versuch</div>
                    <p className="mt-5 text-white/70 max-w-md mx-auto leading-relaxed">
                      {level < 3
                        ? roundFirstTry >= 4
                          ? `Stark! Zeit für Level ${level + 1} — die Sätze werden länger und gemeiner.`
                          : "Solide Runde! Würfle noch eine — oder wag dich eine Stufe höher."
                        : roundFirstTry >= 4
                          ? "Profi-Level gemeistert! Du denkst in Mustern, nicht in Tabellen."
                          : "Das schwerste Level — schau in die Lösungen und nimm die nächste Runde."}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      {level < 3 && (
                        <button
                          onClick={() => startRound((level + 1) as Level)}
                          className="inline-flex items-center gap-2.5 rounded-full bg-hl text-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-white transition-colors cursor-pointer"
                        >
                          Level {level + 1} <ArrowUpRight className="w-4 h-4" strokeWidth={2.8} />
                        </button>
                      )}
                      <button
                        onClick={() => startRound(level)}
                        className="inline-flex items-center gap-2.5 rounded-full bg-accent text-white px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-hl hover:text-ink transition-colors cursor-pointer"
                      >
                        <Dices className="w-4 h-4" strokeWidth={2.6} /> Nächste Runde
                      </button>
                      {persist.mistakes.length > 0 && (
                        <button
                          onClick={() => { setMode("review"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/25 px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] hover:border-hl hover:text-hl transition-colors cursor-pointer"
                        >
                          <Target className="w-4 h-4" strokeWidth={2.6} /> {persist.mistakes.length} Fehler üben
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Reveal>
                <div className="mt-14 rounded-3xl border-2 border-ink bg-white/60 p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent mb-1">Dein Fortschritt</div>
                      <h3 className="font-display text-2xl md:text-3xl font-[700]">Wo hakt es noch?</h3>
                    </div>
                    <button
                      onClick={() => { setPersist(emptyPersist()); setTips({}); setEns({}); }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-accent transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} /> Alles zurücksetzen
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Nach Thema</div>
                      {(["modal", "article", "poss", "pron", "mixed"] as Category[]).map((c) => (
                        <StatBar key={c} label={CAT_NAME[c]} s={persist.byCat[c] ?? { right: 0, wrong: 0 }} />
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Nach Genus</div>
                      {(["m", "f", "n", "pl"] as Gender[]).map((g) => (
                        <StatBar key={g} label={G_NAME[g]} s={persist.byGender[g] ?? { right: 0, wrong: 0 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mt-14">
                <Reveal>
                  <h2 className="font-display text-2xl md:text-4xl font-[660] tracking-tight mb-2">
                    Lösungen <span className="text-ink/40">dieser Runde</span>
                  </h2>
                  <p className="text-ink-soft mb-6 text-sm">Neue Runde = neue Aufgaben = neue Lösungen.</p>
                </Reveal>
                <div className="space-y-3">
                  {exercises.map((ex) => {
                    const open = openKey === ex.uid;
                    return (
                      <div key={ex.uid} className={`rounded-2xl border transition-colors overflow-hidden ${open ? "border-ink bg-white/70" : "border-line bg-white/45"}`}>
                        <button onClick={() => setOpenKey(open ? null : ex.uid)} className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer">
                          <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold ${solvedSet.has(ex.uid) ? "bg-mint text-white" : "bg-paper-deep text-ink/60"}`}>{ex.n}</span>
                          <span className="font-display text-base md:text-lg font-[620] flex-1">{ex.solution}</span>
                          <ChevronDown className={`w-5 h-5 text-ink-soft transition-transform duration-300 ${open ? "rotate-180" : ""}`} strokeWidth={2.4} />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                              <div className="px-5 pb-5 pt-1 pl-[4.25rem] text-[14px] leading-relaxed text-ink/80">
                                <p className="italic text-ink-soft mb-2">{ex.en}</p>
                                {ex.why}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= MODAL TRAINER ================= */}
          {mode === "modal" && (
            <motion.div key="modal" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
              <ModalConjugationTrainer />
            </motion.div>
          )}

          {/* ================= REVIEW ================= */}
          {mode === "review" && (
            <motion.div key="review" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
              {reviewList.length === 0 ? (
                <Reveal>
                  <div className="rounded-3xl border-2 border-dashed border-line bg-white/50 px-7 py-16 text-center">
                    <Target className="w-10 h-10 text-ink/20 mx-auto mb-5" strokeWidth={1.8} />
                    <h3 className="font-display text-2xl md:text-3xl font-[680] mb-2">Keine Fehler gespeichert</h3>
                    <p className="text-ink-soft max-w-sm mx-auto leading-relaxed">
                      Sobald du im Generator eine Aufgabe beim ersten Versuch falsch machst, landet sie hier —
                      und du kannst sie gezielt wiederholen, bis sie sitzt.
                    </p>
                    <button
                      onClick={() => setMode("generator")}
                      className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Dices className="w-4 h-4" strokeWidth={2.6} /> Zum Generator
                    </button>
                  </div>
                </Reveal>
              ) : (
                <>
                  <Reveal>
                    <div className="mb-6 rounded-2xl border border-line bg-white/55 px-5 py-4 flex items-center gap-3 flex-wrap">
                      <Target className="w-4.5 h-4.5 text-accent" strokeWidth={2.4} />
                      <span className="text-[14.5px] text-ink/80">
                        <b>{reviewList.length}</b> {reviewList.length === 1 ? "Aufgabe wartet" : "Aufgaben warten"} auf die Revanche.
                        Richtig gelöst = aus der Liste gestrichen.
                      </span>
                      <button
                        onClick={() => setPersist((s) => ({ ...s, mistakes: [] }))}
                        className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-accent transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} /> Liste leeren
                      </button>
                    </div>
                  </Reveal>
                  <div className="space-y-5">
                    {reviewList.map((ex) => (
                      <ExerciseCard
                        key={ex.uid}
                        ex={ex}
                        values={persist.values}
                        marks={persist.marks}
                        solved={solvedSet.has(ex.uid)}
                        firstTry={!!persist.firstTry[ex.uid]}
                        tipOpen={!!tips[ex.uid]}
                        showEn={!!ens[ex.uid]}
                        audio={supported && enabled}
                        onValue={setValue}
                        onCheck={(e) => check(e, true)}
                        onNext={(e) => goNext(e, reviewList)}
                        onToggleTip={toggleTip}
                        onToggleEn={toggleEn}
                        onSpeak={say}
                        registerRef={registerRef}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ================= VOCAB ================= */}
          {mode === "vocab" && (
            <motion.div key="vocab" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
              <Reveal>
                <div className="rounded-2xl border border-line bg-white/55 p-5 mb-6">
                  <p className="text-[15px] leading-relaxed text-ink/80">
                    Alle Nomen dieses Buches mit Artikel, Plural und Dativ-Form. Genau diese Wörter
                    benutzt auch der Generator — hier kannst du sie in Ruhe nachschlagen{supported && enabled ? " und anhören" : ""}.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="flex flex-wrap gap-2.5 mb-5">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-ink-soft absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.4} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Wort oder Bedeutung suchen…"
                      className="w-full rounded-full border-2 border-line bg-white/70 pl-11 pr-4 py-2.5 text-[14px] outline-none focus:border-ink transition-colors"
                    />
                  </div>
                  {["alle", "m", "f", "n", "pl"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setVocabGender(g)}
                      className={`px-4 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] border-2 transition-all cursor-pointer ${
                        vocabGender === g ? "bg-ink text-paper border-ink" : "bg-white/60 border-line hover:border-ink/40"
                      }`}
                    >
                      {g === "alle" ? "Alle" : G_NAME[g as Gender]}
                    </button>
                  ))}
                </div>
              </Reveal>

              <p className="text-[12px] text-ink-soft mb-3">
                {vocabList.length} {vocabList.length === 1 ? "Wort" : "Wörter"}
                {deferredQuery.trim() || vocabGender !== "alle" ? " gefunden" : " im Buch"}.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {vocabList.slice(0, vocabShown).map((n) => (
                  <div
                    key={n.word}
                    className="rounded-2xl border-2 p-4 transition-colors border-accent/45 bg-accent/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-display text-xl font-[680]">
                          <Art className="text-accent">{n.art}</Art>{n.word}
                        </div>
                        {!settings.hideEnglish && (
                          <div className="text-[13px] text-ink-soft">{n.en}</div>
                        )}
                      </div>
                      {supported && enabled && (
                        <button
                          onClick={() => say(`${n.art} ${n.word}`)}
                          className="shrink-0 w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:text-accent hover:border-accent transition-colors cursor-pointer"
                          aria-label={`${n.word} anhören`}
                        >
                          <Volume2 className="w-4 h-4" strokeWidth={2.3} />
                        </button>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-line/70 grid grid-cols-2 gap-2 text-[12px]">
                      <div>
                        <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Dativ</span>
                        <span className="font-display text-[15px] font-[650]">
                          {n.g === "pl"
                            ? <>Ich helfe {settings.hideArticles ? stripArticles(datPluralNP(n.plural)) : (<span className="text-accent">{datPluralNP(n.plural)}</span>)}</>
                            : <>Ich helfe <Art className="text-accent">{n.g === "f" ? "der" : "dem"}</Art>{n.word}</>}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Plural</span>
                        <span className="font-display text-[15px] font-[650]">{n.plural}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {vocabList.length === 0 && (
                <p className="text-center text-ink-soft py-12">Kein Wort gefunden — probier einen anderen Suchbegriff.</p>
              )}

              {vocabShown < vocabList.length && (
                <div className="mt-5 text-center">
                  <button
                    onClick={() => setVocabShown((v) => v + VOCAB_PAGE)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                  >
                    Mehr zeigen ({vocabList.length - vocabShown} übrig)
                  </button>
                </div>
              )}

              {/* modal verbs reference */}
              <Reveal>
                <div className="mt-10 rounded-2xl border border-line bg-white/55 p-5 md:p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
                    Die 6 Modalverben
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                    {(Object.keys(MODAL_VERBS) as (keyof typeof MODAL_VERBS)[]).map((v) => (
                      <div key={v} className="flex items-baseline justify-between gap-2 border-b border-line/60 pb-1.5">
                        <span className="font-display text-[16px] font-[650]">{MODAL_VERBS[v].inf}</span>
                        <span className="text-[12px] text-ink-soft italic">{MODAL_VERBS[v].en}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
                    Dativ-Verben (kommen nach Modalverben)
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                    {(Object.keys(DAT_VERBS) as (keyof typeof DAT_VERBS)[]).map((v) => (
                      <div key={v} className="flex items-baseline justify-between gap-2 border-b border-line/60 pb-1.5">
                        <span className="font-display text-[16px] font-[650]">{DAT_VERBS[v].inf}</span>
                        <span className="text-[12px] text-ink-soft italic">{DAT_VERBS[v].en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>

        {/* back to rules */}
        <Reveal>
          <div className="mt-16 text-center">
            <button
              onClick={onGoRules}
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-ink hover:text-paper transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" strokeWidth={2.6} /> Zurück zu den Regeln
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
