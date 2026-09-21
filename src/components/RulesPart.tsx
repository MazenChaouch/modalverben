import { motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Brain,
  PenLine, Scissors, Star, Target, User, Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  B, M, N, R, introFlows, marqueeItems, modalExamples, modalMeanings,
} from "../data/content";
import {
  MODAL_VERBS,
} from "../data/modalVerbs";
import {
  Chapter, ChapterHead, GoldenRule, HL, Reveal,
  SentenceFlow, StickyNote, TipNote,
} from "./Atoms";
import { DatAkkLab, ModalConjugationTrainer } from "./Widgets";

/* ================= hero ================= */
const Hero = ({ onGoExercises }: { onGoExercises: () => void }) => (
  <header className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24">
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute top-[8%] right-[6%] font-display font-black text-[16rem] md:text-[24rem] leading-none text-accent/[0.07] select-none">M</span>
      <span className="animate-floaty absolute top-[38%] right-[22%] font-display font-black text-7xl md:text-9xl leading-none text-ink/[0.05] select-none" style={{ ["--rot" as never]: "12deg" }}>m</span>
      <span className="animate-floaty absolute bottom-[10%] left-[42%] font-display font-black text-5xl md:text-7xl leading-none text-blau/[0.07] select-none" style={{ ["--rot" as never]: "-9deg", animationDelay: "1.4s" }}>k</span>
    </div>

    <div className="relative max-w-5xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 px-4 py-2 mb-8"
      >
        <BookOpen className="w-4 h-4 text-accent" strokeWidth={2.4} />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/70">
          Dein interaktives A1-Arbeitsbuch · Teil 1: Regeln
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08 }}
        className="font-display font-[680] tracking-tight leading-[0.95] text-[clamp(2.8rem,14vw,6.6rem)]"
      >
        Modalverben<span className="text-accent">.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.18 }}
        className="mt-6 text-xl md:text-2xl max-w-2xl leading-relaxed text-ink/85"
      >
        <HL delay={0.6}>Kannst du mir helfen?</HL>{" "}
        Sechs Verben, die dein Deutsch <b><span className="text-accent font-black">möglich</span></b>,{" "}
        <b><span className="text-accent font-black">nötig</span></b> und{" "}
        <b><span className="text-accent font-black">erwünscht</span></b> machen.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-3 text-sm md:text-base text-ink-soft max-w-xl"
      >
        möchten, können, müssen, wollen, sollen, dürfen — Konjugation, Vokalwechsel,
        Dativ-Objekte und der Satzbau mit Modal + Infinitiv.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.38 }}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <a
          href="#km1"
          className="inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] hover:bg-accent transition-colors shadow-[5px_5px_0_0_rgba(226,72,31,0.35)]"
        >
          Kapitel 1 starten <ArrowDown className="w-4 h-4" strokeWidth={2.6} />
        </a>
        <button
          onClick={onGoExercises}
          className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-white/60 px-7 py-[14px] text-sm font-bold uppercase tracking-[0.14em] hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          <PenLine className="w-4 h-4" strokeWidth={2.6} /> Direkt zum Training
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="mt-14 flex flex-wrap gap-2"
      >
        {[
          ["Konjugation", "#km2"], ["Vokalwechsel", "#km3"], ["Modal + Dativ", "#km4"],
          ["Satzbau", "#km5"], ["Artikel & Pronomen", "#km6"], ["mir ≠ mich", "#km7"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white/50 px-4 py-2 text-[13px] font-semibold text-ink/75 hover:border-accent hover:text-accent transition-colors"
          >
            {label}
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
          </a>
        ))}
      </motion.div>
    </div>
  </header>
);

/* ================= marquee ================= */
const Marquee = () => (
  <div className="relative -rotate-[0.6deg] border-y-2 border-ink bg-ink text-paper py-3.5 overflow-hidden">
    <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap pr-8">
      {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
        <span key={i} className="flex items-center gap-8 text-sm font-bold tracking-wide">
          {item} <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
        </span>
      ))}
    </div>
  </div>
);

/* ================= modal conjugation table ================= */
const ModalTable = () => (
  <Reveal>
    <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white/60">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-ink text-paper text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em]">
        <div className="px-3 py-3">Person</div>
        <div className="px-3 py-3 border-l border-white/10">möchten</div>
        <div className="px-3 py-3 border-l border-white/10">können</div>
        <div className="px-3 py-3 border-l border-white/10">müssen</div>
        <div className="px-3 py-3 border-l border-white/10">wollen</div>
        <div className="px-3 py-3 border-l border-white/10">sollen</div>
        <div className="px-3 py-3 border-l border-white/10">dürfen</div>
      </div>
      {(["ich", "du", "er", "wir", "ihr", "sie"] as const).map((person, i) => {
        const isSingular = person === "ich" || person === "du" || person === "er";
        return (
          <div
            key={person}
            className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center ${i < 5 ? "border-b border-line" : ""} ${isSingular ? "bg-accent/[0.03]" : ""} transition-colors`}
          >
            <div className="px-3 py-3 font-semibold text-sm">{person}</div>
            {(["möchten", "können", "müssen", "wollen", "sollen", "dürfen"] as const).map((m) => (
              <div key={m} className="px-3 py-3 border-l border-line/70 font-display text-[15px] md:text-lg font-[650]">
                {MODAL_VERBS[m].forms[person]}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  </Reveal>
);

/* ================= sentence structure diagram ================= */
const SentenceStructure = () => (
  <Reveal>
    <div className="rounded-2xl border-2 border-ink bg-white/60 p-6 md:p-8 shadow-[5px_5px_0_0_rgba(226,72,31,0.35)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4">Die Satzstruktur</div>
      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        <div className="flex flex-col items-center gap-1.5">
          <span className="bg-ink text-paper px-4 py-2 rounded-xl font-display text-xl font-[700]">Ich</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Subjekt</span>
        </div>
        <span className="text-accent text-2xl font-bold">→</span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="bg-accent text-white px-4 py-2 rounded-xl font-display text-xl font-[700]">möchte</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Modalverb</span>
        </div>
        <span className="text-accent text-2xl font-bold">→</span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="bg-blau text-white px-4 py-2 rounded-xl font-display text-xl font-[700]">dir</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blau">Dativ-Objekt</span>
        </div>
        <span className="text-accent text-2xl font-bold">→</span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="bg-mint text-white px-4 py-2 rounded-xl font-display text-xl font-[700]">helfen</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mint">Infinitiv</span>
        </div>
      </div>
      <p className="mt-5 text-[14px] text-ink-soft leading-relaxed">
        Der Infinitiv steht <b>am Satzende</b>. Das Modalverb wird konjugiert, das Hauptverb bleibt im Infinitiv.
      </p>
    </div>
  </Reveal>
);

/* ================= the whole rules part ================= */
export const RulesPart = ({ onGoExercises }: { onGoExercises: () => void }) => (
  <div>
    <Hero onGoExercises={onGoExercises} />
    <Marquee />

    <div className="max-w-5xl mx-auto px-5 md:px-8">
      {/* ------------- K1 ------------- */}
      <Chapter id="km1">
        <ChapterHead
          num="01"
          kicker="Grundlagen"
          title={<>Was ist ein <span className="text-accent">Modalverb</span>?</>}
          lede="The auxiliary verbs that express ability, necessity, and desire."
        />

        <div className="space-y-6">
          <Reveal>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl">
              Modalverben sind Hilfsverben, die zeigen, ob etwas <B>möglich</B>, <B>nötig</B> oder{" "}
              <B>erwünscht</B> ist. Sie stehen vor dem Hauptverb (im Infinitiv) und werden selbst konjugiert.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-line bg-white/55 p-5">
                <Zap className="w-5 h-5 text-ink/60 mb-3" strokeWidth={2.2} />
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft mb-1.5">1 · Subjekt</div>
                <div className="font-display text-lg font-[650] leading-snug">Wer macht etwas?</div>
                <div className="text-sm text-ink-soft mt-1">Der Täter → Nominativ. Frag: <B>Wer?</B></div>
              </div>
              <div className="rounded-2xl border border-line bg-white/55 p-5">
                <User className="w-5 h-5 text-ink/60 mb-3" strokeWidth={2.2} />
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft mb-1.5">2 · Modalverb</div>
                <div className="font-display text-lg font-[650] leading-snug">kann, muss, darf …</div>
                <div className="text-sm text-ink-soft mt-1">Wird konjugiert: ich kann, du kannst …</div>
              </div>
              <div className="rounded-2xl border-2 border-accent bg-accent/[0.06] p-5">
                <Target className="w-5 h-5 text-accent mb-3" strokeWidth={2.2} />
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent mb-1.5">3 · Infinitiv</div>
                <div className="font-display text-lg font-[650] leading-snug">lernen, helfen …</div>
                <div className="text-sm text-ink/70 mt-1">Das Hauptverb steht am <B>Satzende</B>.</div>
              </div>
            </div>
          </Reveal>

          <GoldenRule label="Die goldene Satzregel">
            Modal + konjugiert + … + Infinitiv am Ende.
            <span className="block mt-1 text-base font-normal text-ink-soft">
              Beispiel: Ich <span className="text-accent font-bold">kann</span> Deutsch <span className="text-accent font-bold">lernen</span>.
            </span>
          </GoldenRule>

          <div className="grid gap-4 pt-2">
            {introFlows.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <SentenceFlow tokens={f.tokens} en={f.en} qa={f.qa} />
              </Reveal>
            ))}
          </div>

          <SentenceStructure />
        </div>
      </Chapter>

      {/* ------------- K2 ------------- */}
      <Chapter id="km2">
        <ChapterHead
          num="02"
          kicker="Konjugation"
          title={<>Die 6 <span className="text-accent">Modalverben</span></>}
          lede="möchten, können, müssen, wollen, sollen, dürfen — complete conjugation."
        />
        <div className="space-y-7">
          <ModalTable />

          {/* --- Bedeutungen & Beispiele --- */}
          <Reveal>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">Bedeutungen & Beispiele</div>
          </Reveal>

          <div className="space-y-4">
            {modalMeanings.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.04}>
                <div className="rounded-2xl border border-line bg-white/55 p-5 md:p-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-2xl font-[700]">{m.verb}</span>
                    <span className="text-sm text-ink-soft italic">{m.en}</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink/80 mb-3">{m.meaning}</p>
                  <div className="space-y-2">
                    {m.examples.map((ex, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-[14px]">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-ink/10 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {j + 1}
                        </span>
                        <div>
                          <span className="font-semibold">{ex.de}</span>
                          <span className="text-ink-soft ml-2 italic">{ex.en}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <GoldenRule>
            Die 1. und 3. Person Singular sind <B>gleich</B>: ich kann = er kann, ich muss = er muss.
            Nur <B>du</B> bekommt ein -st: du kannst, du musst, du darfst.
          </GoldenRule>
          <StickyNote rotate={-1.2}>
            Sechs Verben, ein Muster: Im Plural bleibt der Stamm (wir können, ihr dürft). Im Singular
            bei du kommt -st dazu. Ich und er sind immer gleich.
          </StickyNote>
        </div>
      </Chapter>

      {/* ------------- K3 ------------- */}
      <Chapter id="km3">
        <ChapterHead
          num="03"
          kicker="Vokalwechsel"
          title={<>Singular vs. <span className="text-accent">Plural</span></>}
          lede="kann/können, muss/müssen — the vowel change pattern."
        />
        <div className="space-y-7">
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(MODAL_VERBS).filter(([, v]) => v.vokalwechsel).map(([id, v]) => (
                <div key={id} className="rounded-2xl border border-line bg-white/55 p-5">
                  <div className="font-display text-xl font-[680] mb-2">{v.inf}</div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-2">{v.vokalwechsel}</div>
                  <div className="font-display text-lg">
                    ich {v.forms.ich} → du {v.forms.du} → er {v.forms.er}
                  </div>
                  <div className="font-display text-lg text-ink-soft">
                    wir {v.forms.wir} → ihr {v.forms.ihr} → sie {v.forms.sie}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <GoldenRule>
            Vokalwechsel nur im <B>Singular</B>: können → kann/kannst/kann. Im Plural bleibt der
            Umlaut: können, dürft, müsst. <B>sollen</B> und <B>möchten</B> haben keinen Vokalwechsel.
          </GoldenRule>
        </div>
      </Chapter>

      {/* ------------- K4 ------------- */}
      <Chapter id="km4">
        <ChapterHead
          num="04"
          kicker="Dativ-Verben"
          title={<>Modal + <span className="text-accent">Dativ</span></>}
          lede="helfen, danken, antworten — they demand the dative."
        />
        <div className="space-y-7">
          <Reveal>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl">
              Viele Modalverben kombinieren mit Dativ-Verben: <B>helfen</B>, <B>danken</B>, <B>antworten</B>,{" "}
              <B>glauben</B>, <B>gratulieren</B>. Das Objekt steht dann im <HL>Dativ</HL>.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-2 gap-3">
              {modalExamples.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-line bg-white/55 px-5 py-4">
                  <div className="font-display text-lg font-[650]">
                    {ex.subj} {ex.modal} <span className="text-blau font-bold">{ex.dativ}</span> {ex.infinitiv}.
                  </div>
                  <div className="text-[13px] text-ink-soft italic mt-1">{ex.en}</div>
                  <div className="text-[11px] text-accent font-semibold mt-1">{ex.note}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <TipNote>
            Der Infinitiv (helfen, danken …) steht immer am <B>Satzende</B>. Das Dativ-Objekt
            steht zwischen Modalverb und Infinitiv: <B>Ich möchte dir helfen.</B>
          </TipNote>
        </div>
      </Chapter>

      {/* ------------- K5 ------------- */}
      <Chapter id="km5">
        <ChapterHead
          num="05"
          kicker="Satzbau"
          title={<>Modal + Dativ + <span className="text-accent">Infinitiv</span></>}
          lede="Word order: Subject + Modal + Dativ-Objekt + Infinitiv."
        />
        <div className="space-y-7">
          <SentenceStructure />
          <GoldenRule label="Die Reihenfolge">
            1. Subjekt → 2. Modalverb (konjugiert) → 3. Dativ-Objekt → 4. Infinitiv (am Ende).
            <span className="block mt-2 text-base font-normal text-ink-soft">
              Beispiel: Wir <span className="text-accent font-bold">müssen</span> <span className="text-blau font-bold">ihm</span> <span className="text-mint font-bold">antworten</span>.
            </span>
          </GoldenRule>
          <TipNote>
            In <B>Fragen</B> kommt das Modalverb an die erste Stelle: <B>Kannst du mir helfen?</B>
            Das Subjekt (du) folgt direkt danach.
          </TipNote>
        </div>
      </Chapter>

      {/* ------------- K6 ------------- */}
      <Chapter id="km6">
        <ChapterHead
          num="06"
          kicker="Artikel & Pronomen"
          title={<>Dativ mit <span className="text-accent">Artikeln</span></>}
          lede="dem/der/dem/den — definite, indefinite, possessive in dative."
        />
        <div className="space-y-7">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white/60">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] bg-ink text-paper text-[10px] md:text-xs font-bold uppercase tracking-[0.14em]">
                <div className="px-4 py-3.5">Genus</div>
                <div className="px-4 py-3.5 border-l border-white/10">Nominativ</div>
                <div className="px-4 py-3.5 border-l border-white/10">Dativ</div>
                <div className="px-4 py-3.5 border-l border-white/10">Beispiel</div>
              </div>
              {[
                { g: "Maskulin", nom: "der", dat: "dem", ex: "Ich helfe dem Mann." },
                { g: "Feminin", nom: "die", dat: "der", ex: "Ich helfe der Frau." },
                { g: "Neutrum", nom: "das", dat: "dem", ex: "Ich helfe dem Kind." },
                { g: "Plural", nom: "die", dat: "den …-n", ex: "Ich helfe den Kindern." },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center ${i < 3 ? "border-b border-line" : ""} transition-colors hover:bg-hl/25`}>
                  <div className="px-4 py-3.5 font-semibold text-sm">{row.g}</div>
                  <div className="px-4 py-3.5 border-l border-line/70 font-display text-lg">{row.nom}</div>
                  <div className="px-4 py-3.5 border-l border-line/70 font-display text-lg font-[650] text-accent">{row.dat}</div>
                  <div className="px-4 py-3.5 border-l border-line/70 text-sm text-ink-soft">{row.ex}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <GoldenRule>
            Im Dativ: <span className="text-accent">der → dem</span>, <span className="text-accent">die → der</span>,{" "}
            <span className="text-accent">das → dem</span>, <span className="text-accent">die (Pl.) → den …-n</span>.
          </GoldenRule>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white/60">
              <div className="grid grid-cols-[1fr_1fr_1fr] bg-blau text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.14em]">
                <div className="px-4 py-3.5">Nominativ</div>
                <div className="px-4 py-3.5 border-l border-white/15">Dativ</div>
                <div className="px-4 py-3.5 border-l border-white/15">English</div>
              </div>
              {[
                { nom: "ich", dat: "mir", en: "I → me" },
                { nom: "du", dat: "dir", en: "you → you" },
                { nom: "er", dat: "ihm", en: "he → him" },
                { nom: "sie", dat: "ihr", en: "she → her" },
                { nom: "wir", dat: "uns", en: "we → us" },
                { nom: "ihr", dat: "euch", en: "you (pl.) → you" },
                { nom: "sie (Pl.)", dat: "ihnen", en: "they → them" },
                { nom: "Sie", dat: "Ihnen", en: "you (formal) → you" },
              ].map((r, i) => (
                <div key={i} className={`grid grid-cols-[1fr_1fr_1fr] items-center ${i < 7 ? "border-b border-line" : ""} ${r.nom === "ich" || r.nom === "du" ? "bg-blau-soft/60" : ""} transition-colors`}>
                  <div className="px-4 py-3 font-display font-[600] text-lg">{r.nom}</div>
                  <div className="px-4 py-3 border-l border-line/70 font-display font-[720] text-lg text-blau">{r.dat}</div>
                  <div className="px-4 py-3 border-l border-line/70 text-sm text-ink-soft">{r.en}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <StickyNote rotate={-1.6}>
            <b>mir–dir</b> (reimt sich!), <b>ihm–ihr–ihnen</b> (die i-Familie), <b>uns–euch</b> (bleiben gleich).
            Und <b>Ihnen</b>? Immer groß — sonst ist die Chefin böse.
          </StickyNote>
        </div>
      </Chapter>

      {/* ------------- K7 ------------- */}
      <Chapter id="km7">
        <ChapterHead
          num="07"
          kicker="Der Klassiker"
          title={<><span className="text-blau">mir</span> <span className="text-ink/35">oder</span> <span className="text-accent">mich</span>?</>}
          lede="Dative or accusative? The verb decides — learn to ask the right question."
        />
        <div className="space-y-7">
          <Reveal>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl">
              Stelle dir immer <B>eine Frage</B>: Verlangt das Verb <HL>Wem?</HL> oder{" "}
              <HL>Wen?</HL>? Danach ist alles klar.
            </p>
          </Reveal>
          <DatAkkLab />
          <div className="grid md:grid-cols-2 gap-4">
            <Reveal>
              <div className="rounded-2xl border border-line bg-white/55 p-5">
                <div className="font-display text-xl font-[650]">Ich helfe <span className="text-blau">dir</span>.</div>
                <div className="text-sm text-ink-soft italic mt-1">Dativ: helfen will Wem?</div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-white/55 p-5">
                <div className="font-display text-xl font-[650]">Ich sehe <span className="text-accent">dich</span>.</div>
                <div className="text-sm text-ink-soft italic mt-1">Akkusativ: sehen will Wen?</div>
              </div>
            </Reveal>
          </div>
        </div>
      </Chapter>

      {/* ------------- CTA to exercises ------------- */}
      <Reveal>
        <div className="my-16 md:my-24 rounded-[2.2rem] border-2 border-ink bg-ink text-paper px-7 py-12 md:px-14 md:py-16 text-center relative overflow-hidden">
          <span aria-hidden className="absolute -left-8 -bottom-14 font-display font-black text-[13rem] leading-none text-white/[0.05] select-none">?</span>
          <h3 className="relative font-display text-3xl md:text-5xl font-[680] leading-tight">
            Theorie geschafft.<br />Jetzt <span className="text-hl">beweisen</span>.
          </h3>
          <p className="relative mt-4 text-white/65 max-w-lg mx-auto">
            Vier Trainingsarten: der endlose Aufgaben-Generator (3 Level), der Modal-Trainer für
            die Konjugation, dein persönliches Fehler-Training und der Wortschatz — mit deutscher Aussprache.
          </p>
          <button
            onClick={onGoExercises}
            className="relative mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] hover:bg-hl hover:text-ink transition-colors cursor-pointer"
          >
            <PenLine className="w-4 h-4" strokeWidth={2.6} /> Teil 2: Zum Training
          </button>
        </div>
      </Reveal>
    </div>
  </div>
);
