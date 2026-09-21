import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { BookOpen, FileDown, PenLine, Printer, X } from "lucide-react";
import { chapters } from "./data/content";
import { RulesPart } from "./components/RulesPart";
import { TrainingPart } from "./components/TrainingPart";
import { PrintWorkbook } from "./components/PrintWorkbook";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingsProvider } from "./hooks/useSettings";

type Part = "regeln" | "uebungen";

export default function App() {
  const [part, setPart] = useState<Part>("regeln");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [printArmed, setPrintArmed] = useState(false);
  const [activeChapter, setActiveChapter] = useState("km1");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const goPart = useCallback((p: Part) => {
    setPart(p);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  /* scroll-spy for the chapter rail */
  useEffect(() => {
    if (part !== "regeln") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveChapter(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [part]);

  /* If the user prints via browser menu / Ctrl+P, mount the doc in time. */
  useEffect(() => {
    const onBefore = () => setPrintArmed(true);
    const onAfter = () => setPrintArmed(false);
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, []);

  const openPrint = () => {
    setPrintArmed(true);
    setPdfOpen(false);
    setTimeout(() => window.print(), 120);
  };

  return (
    <SettingsProvider>
      {/* ================= screen app ================= */}
      <div className="no-print min-h-screen">
        {/* scroll progress */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[60] origin-left"
          style={{ scaleX: progress }}
        />

        {/* nav */}
        <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => goPart("regeln")}
              className="font-display text-xl md:text-2xl font-[750] tracking-tight cursor-pointer select-none"
            >
              Modalverben<span className="text-accent">.</span>
              <span className="ml-2 align-middle text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-ink-soft bg-paper-deep border border-line rounded-full px-2.5 py-1">
                A1-Arbeitsbuch
              </span>
            </button>

            <div className="ml-auto flex items-center gap-2.5">
              {/* part switcher */}
              <div className="relative flex items-center rounded-full border-2 border-ink bg-white/60 p-1">
                {(["regeln", "uebungen"] as Part[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => goPart(p)}
                    className={`relative z-10 flex items-center gap-2 rounded-full px-4 md:px-5 py-2 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                      part === p ? "text-paper" : "text-ink/65 hover:text-ink"
                    }`}
                  >
                    {part === p && (
                      <motion.span
                        layoutId="partPill"
                        className="absolute inset-0 -z-10 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {p === "regeln" ? (
                      <BookOpen className="w-3.5 h-3.5" strokeWidth={2.6} />
                    ) : (
                      <PenLine className="w-3.5 h-3.5" strokeWidth={2.6} />
                    )}
                    <span className="hidden sm:inline">{p === "regeln" ? "1 · Regeln" : "2 · Training"}</span>
                    <span className="sm:hidden">{p === "regeln" ? "Regeln" : "Training"}</span>
                  </button>
                ))}
              </div>

              {/* settings */}
              <SettingsPanel />

              {/* pdf button */}
              <button
                onClick={() => setPdfOpen(true)}
                className="flex items-center gap-2 rounded-full bg-accent text-white px-4 md:px-5 py-2.5 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-ink transition-colors shadow-[3px_3px_0_0_rgba(33,27,18,0.9)] cursor-pointer"
              >
                <FileDown className="w-4 h-4" strokeWidth={2.6} />
                <span className="hidden md:inline">PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* chapter rail (rules only) */}
        <AnimatePresence>
          {part === "regeln" && (
            <motion.nav
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              className="fixed left-3.5 2xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1.5"
            >
              {chapters.map((c) => {
                const active = activeChapter === c.id;
                return (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    title={typeof c.title === "string" ? c.title : c.kicker}
                    className={`group flex items-center gap-2.5 rounded-full px-2 py-1.5 transition-all ${
                      active ? "text-accent" : "text-ink/35 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`font-display text-[11px] font-[700] w-7 transition-all ${
                        active ? "scale-110" : ""
                      }`}
                    >
                      {c.num}
                    </span>
                    <span
                      className={`h-[3px] rounded-full transition-all duration-300 ${
                        active ? "w-7 bg-accent" : "w-3.5 bg-ink/20 group-hover:bg-ink/50"
                      }`}
                    />
                  </a>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* main */}
        <main>
          <AnimatePresence mode="wait">
            {part === "regeln" ? (
              <motion.div
                key="regeln"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <RulesPart onGoExercises={() => goPart("uebungen")} />
              </motion.div>
            ) : (
              <motion.div
                key="uebungen"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <TrainingPart onGoRules={() => goPart("regeln")} onPdf={() => setPdfOpen(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* footer */}
        <footer className="border-t border-line">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="font-display text-lg font-[700]">
              Modalverben<span className="text-accent">.</span>{" "}
              <span className="text-ink-soft font-sans text-sm font-normal">
                — Dein A1-Arbeitsbuch für die 6 Modalverben.
              </span>
            </div>
            <div className="md:ml-auto flex flex-wrap gap-2">
              <button onClick={() => goPart("regeln")} className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-accent transition-colors cursor-pointer px-2 py-1">
                Teil 1 · Regeln
              </button>
              <button onClick={() => goPart("uebungen")} className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-accent transition-colors cursor-pointer px-2 py-1">
                Teil 2 · Training
              </button>
              <button onClick={() => setPdfOpen(true)} className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent hover:text-ink transition-colors cursor-pointer px-2 py-1">
                Als PDF speichern
              </button>
            </div>
          </div>
        </footer>

        {/* pdf modal */}
        <AnimatePresence>
          {pdfOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/45 backdrop-blur-sm"
              onClick={() => setPdfOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl border-2 border-ink bg-paper p-7 md:p-8 shadow-[10px_10px_0_0_rgba(33,27,18,0.9)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent mb-1.5">Dein Arbeitsbuch</div>
                    <h3 className="font-display text-3xl font-[700] leading-tight">Als PDF speichern</h3>
                  </div>
                  <button
                    onClick={() => setPdfOpen(false)}
                    className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink transition-colors cursor-pointer"
                    aria-label="Schließen"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-3.5 mb-6">
                  {[
                    "Der Druckdialog öffnet sich mit einer speziellen A4-Buchversion: Regeln, Übungen mit Lücken, Answer Key und Merkkarte.",
                    "Wähle als Ziel 'Als PDF speichern' (Save as PDF).",
                    "Empfehlung: Format A4 · Hintergrundgrafiken aktivieren, damit die Farben sichtbar bleiben.",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3.5 items-start">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-ink text-paper font-display font-[700] text-sm flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[14.5px] leading-relaxed text-ink/80">{step}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={openPrint}
                  className="w-full flex items-center justify-center gap-2.5 rounded-full bg-accent text-white px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] hover:bg-ink transition-colors cursor-pointer"
                >
                  <Printer className="w-4.5 h-4.5" strokeWidth={2.4} /> Druckdialog öffnen
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= print document (on demand only) ================= */}
      {(pdfOpen || printArmed) && <PrintWorkbook />}
    </SettingsProvider>
  );
}
