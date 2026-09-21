import { useCallback, useEffect, useRef, useState } from "react";

/**
 * German text-to-speech via the Web Speech API.
 * Picks the best available de-DE voice and degrades gracefully
 * (returns supported:false) when the browser has none.
 */
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem("mod-audio") !== "off"; } catch { return true; }
  });
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      const de = voices.filter((v) => v.lang?.toLowerCase().startsWith("de"));
      if (de.length) {
        voiceRef.current =
          de.find((v) => /natural|neural|premium|enhanced/i.test(v.name)) ??
          de.find((v) => v.lang.toLowerCase() === "de-de" && v.localService) ??
          de.find((v) => v.lang.toLowerCase() === "de-de") ??
          de[0];
        setSupported(true);
      }
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("mod-audio", enabled ? "on" : "off"); } catch { /* ignore */ }
  }, [enabled]);

  const speak = useCallback(
    (text: string, rate = 0.88) => {
      if (!supported || !enabled || !text) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = rate;     // slightly slow: this is for A1 learners
      u.pitch = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
    },
    [supported, enabled]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return { speak, stop, supported, speaking, enabled, setEnabled };
}

/** Strips markup-ish characters so the synthesizer reads clean German. */
export const cleanForSpeech = (s: string) =>
  s.replace(/[_…]+/g, " ").replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1").trim();
