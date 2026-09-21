import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Lightbulb, Quote } from "lucide-react";

/* ---------- scroll reveal wrapper ---------- */
export const Reveal = ({
  children,
  delay = 0,
  className = "",
  y = 26,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ---------- animated yellow highlighter ---------- */
export const HL = ({ children, delay = 0.15 }: { children: ReactNode; delay?: number }) => (
  <motion.span
    className="hl"
    initial={{ backgroundSize: "0% 46%" }}
    whileInView={{ backgroundSize: "100% 46%" }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.9, delay, ease: "easeOut" }}
  >
    {children}
  </motion.span>
);

/* ---------- chapter heading ---------- */
export const ChapterHead = ({
  num,
  kicker,
  title,
  lede,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  lede: string;
}) => (
  <Reveal>
    <div className="relative mb-10 md:mb-14">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-3 md:-left-8 font-display font-black text-[7rem] md:text-[10rem] leading-none text-transparent select-none"
        style={{ WebkitTextStroke: "1.5px rgba(33,27,18,0.14)" }}
      >
        {num}
      </span>
      <div className="relative pt-10 md:pt-14 pl-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-10 bg-accent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Kapitel {num} · {kicker}
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl font-[650] tracking-tight leading-[1.02]">
          {title}
        </h2>
        <p className="mt-4 text-ink-soft text-base md:text-lg max-w-xl leading-relaxed">{lede}</p>
      </div>
    </div>
  </Reveal>
);

/* ---------- golden rule callout ---------- */
export const GoldenRule = ({ children, label = "Die goldene Regel" }: { children: ReactNode; label?: string }) => (
  <Reveal>
    <div className="relative rounded-2xl border-2 border-ink bg-hl/40 px-6 py-6 md:px-9 md:py-8 shadow-[6px_6px_0_0_#211b12]">
      <span className="absolute -top-3.5 left-6 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
        {label}
      </span>
      <div className="font-display text-xl md:text-2xl font-[600] leading-snug pt-1">{children}</div>
    </div>
  </Reveal>
);

/* ---------- sticky-note memory card ---------- */
export const StickyNote = ({ children, rotate = -1.5 }: { children: ReactNode; rotate?: number }) => (
  <Reveal>
    <div
      className="relative bg-hl/90 rounded-[4px] px-6 pt-7 pb-6 shadow-[0_10px_24px_rgba(33,27,18,0.14)] max-w-md"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-16 bg-paper-deep/90 border border-line shadow-sm rotate-[-2deg]" />
      <div className="hand text-[1.45rem] leading-snug text-ink/90">{children}</div>
    </div>
  </Reveal>
);

/* ---------- tip note ---------- */
export const TipNote = ({ children }: { children: ReactNode }) => (
  <Reveal>
    <div className="flex gap-3.5 items-start rounded-xl bg-paper-deep/70 border border-line px-5 py-4">
      <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={2.2} />
      <div className="text-[15px] leading-relaxed text-ink/80">{children}</div>
    </div>
  </Reveal>
);

/* ---------- sentence flow diagram ---------- */
const toneStyles: Record<string, { line: string; chip: string }> = {
  nom: { line: "border-ink/50", chip: "bg-ink text-paper" },
  verb: { line: "border-ink/25", chip: "bg-paper-deep text-ink-soft border border-line" },
  akk: { line: "border-accent", chip: "bg-accent text-white" },
  dat: { line: "border-blau", chip: "bg-blau text-white" },
};

export const SentenceFlow = ({
  tokens,
  en,
  qa,
}: {
  tokens: { t: string; tag: string; tone: "nom" | "verb" | "akk" | "dat" }[];
  en: string;
  qa?: { q: string; a: string };
}) => (
  <div className="rounded-2xl border border-line bg-white/55 px-5 py-5 md:px-7 md:py-6">
    <div className="flex flex-wrap items-end gap-x-4 gap-y-4">
      {tokens.map((tok, i) => (
        <motion.div
          key={i}
          className="flex flex-col gap-1.5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.45 }}
        >
          <span className={`font-display text-2xl md:text-[1.75rem] font-[650] pb-0.5 border-b-[3px] ${toneStyles[tok.tone].line}`}>
            {tok.t}
          </span>
          <span className={`text-[9.5px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-md self-start ${toneStyles[tok.tone].chip}`}>
            {tok.tag}
          </span>
        </motion.div>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
      <span className="text-ink-soft italic flex items-center gap-2">
        <Quote className="w-3.5 h-3.5 shrink-0" /> {en}
      </span>
      {qa && (
        <span className="text-ink/70">
          <span className="font-semibold text-accent">Frage: </span>
          {qa.q} <span className="font-semibold">{qa.a}</span>
        </span>
      )}
    </div>
  </div>
);

/* ---------- simple wrapper per chapter ---------- */
export const Chapter = ({ id, children }: { id: string; children: ReactNode }) => (
  <section id={id} className="scroll-mt-28 py-14 md:py-20">
    {children}
  </section>
);
