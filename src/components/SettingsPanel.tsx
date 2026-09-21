import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Settings2, X } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import type { LearningSettings } from "../hooks/useSettings";

type Row = {
  key: keyof LearningSettings;
  title: string;
  desc: string;
};

const ROWS: Row[] = [
  {
    key: "hideArticles",
    title: "Artikel verstecken",
    desc: "der/die/das wird zu ___ — in Übungen und Wortschatz. Für Profis mit Genus-Gedächtnis.",
  },
  {
    key: "hideEnglish",
    title: "Englisch ausblenden",
    desc: "Keine Übersetzungen in Übungen & Wortschatz. Denke auf Deutsch!",
  },
  {
    key: "hideTips",
    title: "Tipps ausblenden",
    desc: "Der Tipp-Button verschwindet — reiner Selbsttest ohne Hilfen.",
  },
];

const Switch = ({ on, onFlip, label }: { on: boolean; onFlip: () => void; label: string }) => (
  <button
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onFlip}
    className={`relative shrink-0 w-12 h-7 rounded-full transition-colors cursor-pointer ${
      on ? "bg-accent" : "bg-ink/15"
    }`}
  >
    <motion.span
      animate={{ x: on ? 22 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow"
    />
  </button>
);

export const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const { settings, update, reset } = useSettings();
  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Lern-Einstellungen öffnen"
        title="Lern-Einstellungen"
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-line bg-white/60 text-ink-soft hover:text-ink hover:border-ink transition-colors cursor-pointer"
      >
        <Settings2 className="w-[18px] h-[18px]" strokeWidth={2.4} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border-2 border-ink bg-paper p-7 md:p-8 shadow-[10px_10px_0_0_rgba(33,27,18,0.9)]"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent mb-1.5">
                    Hard-Mode für dein Gehirn
                  </div>
                  <h3 className="font-display text-3xl font-[700] leading-tight">
                    Lern-Einstellungen
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink transition-colors cursor-pointer"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              <p className="text-[13.5px] text-ink-soft leading-relaxed mb-5">
                Alles ist standardmäßig <b>aus</b> — schalte Optionen an, wenn du
                dich fordern willst. Wird auf diesem Gerät gespeichert.
              </p>

              <div className="space-y-3 mb-6">
                {ROWS.map((row) => {
                  const on = settings[row.key];
                  return (
                    <div
                      key={row.key}
                      className={`flex items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${
                        on ? "border-accent bg-accent/[0.05]" : "border-line bg-white/55"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px]">{row.title}</div>
                        <div className="text-[13px] text-ink-soft leading-relaxed mt-0.5">
                          {row.desc}
                        </div>
                      </div>
                      <Switch
                        on={on}
                        label={row.title}
                        onFlip={() => update({ [row.key]: !on })}
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={reset}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-line px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft hover:border-ink hover:text-ink transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={2.5} /> Alles zurücksetzen
              </button>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
