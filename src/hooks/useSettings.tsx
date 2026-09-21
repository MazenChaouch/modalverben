import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/* Learning hard-mode settings, stored per device. */

export type LearningSettings = {
  /** der/die/das → ___ in exercise cues, vocab lists and playground buttons */
  hideArticles: boolean;
  /** no English translations in exercises & vocab */
  hideEnglish: boolean;
  /** no Tipp button in exercises — pure self-test */
  hideTips: boolean;
};

const DEFAULTS: LearningSettings = {
  hideArticles: false,
  hideEnglish: false,
  hideTips: false,
};

const LS_KEY = "modalverben-settings-v1";

type Ctx = {
  settings: LearningSettings;
  update: (patch: Partial<LearningSettings>) => void;
  reset: () => void;
};

const SettingsCtx = createContext<Ctx>({
  settings: DEFAULTS,
  update: () => {},
  reset: () => {},
});

const load = (): LearningSettings => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<LearningSettings>) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<LearningSettings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const update = (patch: Partial<LearningSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));
  const reset = () => setSettings(DEFAULTS);

  return (
    <SettingsCtx.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsCtx.Provider>
  );
};

export const useSettings = () => useContext(SettingsCtx);

/* Articles removed entirely in hard mode ("der Hund" → "Hund").
   Possessives (mein/dein/…) and pronouns stay — otherwise exercises
   would become unsolvable. Leftover empty brackets are dropped too,
   so a cue like "(ein)" removes the whole hint chip. */
const ART_RE = /\b(der|die|das|den|dem|ein|eine|einen|einem|einer)\b\s?/gi;

export const stripArticles = (text: string): string =>
  text.replace(ART_RE, "").replace(/\s+/g, " ").replace(/\(\s*\)/g, "").trim();

/* Article wrapper that vanishes entirely in hard mode. */
export const Art = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { settings } = useSettings();
  if (settings.hideArticles) return null;
  return <span className={className}>{children}{" "}</span>;
};
