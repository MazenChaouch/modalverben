import type { ReactNode } from "react";
import { Scissors } from "lucide-react";
import { MODAL_VERBS, DAT_VERBS } from "../data/modalVerbs";

/* ---------- print helpers ---------- */
const PH = ({ num, kicker, title, lede }: { num: string; kicker: string; title: ReactNode; lede: string }) => (
  <div className="avoid-break" style={{ marginBottom: "5mm" }}>
    <div style={{ fontSize: "8pt", letterSpacing: "0.22em", color: "#e2481f", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.5mm" }}>
      Kapitel {num} · {kicker}
    </div>
    <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "20pt", fontWeight: 700, lineHeight: 1.05, margin: 0 }}>{title}</h2>
    <p style={{ fontSize: "9.5pt", color: "#746a58", margin: "1.5mm 0 0" }}>{lede}</p>
  </div>
);

const PRule = ({ children, label = "Die goldene Regel" }: { children: ReactNode; label?: string }) => (
  <div className="avoid-break" style={{ border: "1.6pt solid #211b12", background: "#fff3c2", borderRadius: "3mm", padding: "4mm 5mm", margin: "4mm 0", position: "relative" }}>
    <span style={{ position: "absolute", top: "-2.6mm", left: "5mm", background: "#e2481f", color: "#fff", fontSize: "6.5pt", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "1mm 2.5mm", borderRadius: "4mm" }}>{label}</span>
    <div style={{ fontFamily: "Fraunces, serif", fontSize: "12pt", fontWeight: 600, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const PNote = ({ children }: { children: ReactNode }) => (
  <div className="avoid-break" style={{ background: "#f1ead9", borderRadius: "2.5mm", padding: "3mm 4mm", margin: "3mm 0", fontSize: "9pt", lineHeight: 1.5 }}>
    {children}
  </div>
);

const PTable = ({ headers, rows, accentCol }: { headers: string[]; rows: ReactNode[][]; accentCol?: number }) => (
  <table className="avoid-break" style={{ width: "100%", borderCollapse: "collapse", border: "1.4pt solid #211b12", margin: "3mm 0", fontSize: "10pt" }}>
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} style={{ background: "#211b12", color: i === accentCol ? "#ffb199" : "#faf6ee", textAlign: "left", padding: "2.2mm 3mm", fontSize: "7.5pt", letterSpacing: "0.14em", textTransform: "uppercase" }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          {r.map((c, j) => (
            <td key={j} style={{
              padding: "2mm 3mm",
              borderTop: "0.6pt solid #d9d2c0",
              borderLeft: j > 0 ? "0.6pt solid #d9d2c0" : undefined,
              background: j === accentCol ? "#fdeee8" : undefined,
              fontFamily: j > 0 ? "Fraunces, serif" : undefined,
              fontWeight: j > 0 ? 600 : 500,
              fontSize: j > 0 ? "11pt" : "8.5pt",
              color: j === 0 ? "#746a58" : "#211b12",
            }}>{c}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const Blank = () => <span className="print-blank" />;

/* ================= the document ================= */
export const PrintWorkbook = () => (
  <div className="print-doc">
    {/* ============ COVER ============ */}
    <div style={{ textAlign: "center", paddingTop: "26mm", paddingBottom: "10mm" }}>
      <div style={{ fontSize: "8.5pt", letterSpacing: "0.3em", fontWeight: 800, color: "#e2481f", textTransform: "uppercase" }}>
        Dein A1-Arbeitsbuch · Deutsch
      </div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "46pt", fontWeight: 750, margin: "6mm 0 3mm", lineHeight: 0.95 }}>
        Modalverben<span style={{ color: "#e2481f" }}>.</span>
      </h1>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: "16pt", color: "#211b12", margin: "2mm 0" }}>
        Kannst du mir helfen?
      </p>
      <p style={{ fontSize: "9.5pt", color: "#746a58", maxWidth: "130mm", margin: "2mm auto 0", lineHeight: 1.6 }}>
        möchten, können, müssen, wollen, sollen, dürfen — Konjugation, Vokalwechsel,
        Dativ-Objekte und der Satzbau mit Modal + Infinitiv.
      </p>
    </div>

    {/* ============ TEIL 1 ============ */}
    <div className="page-break">
      <div style={{ fontSize: "26pt", fontFamily: "Fraunces, serif", fontWeight: 750, borderBottom: "2.4pt solid #211b12", paddingBottom: "3mm", marginBottom: "6mm" }}>
        Teil 1 · Die Regeln
      </div>

      {/* K1 */}
      <PH num="01" kicker="Grundlagen" title={<>Was ist ein Modalverb?</>} lede="Hilfsverben für Möglichkeit, Notwendigkeit und Wunsch." />
      <p style={{ fontSize: "10pt", lineHeight: 1.6, margin: "0 0 3mm" }}>
        Modalverben stehen vor dem Hauptverb (Infinitiv) und werden konjugiert.
        Die sechs Modalverben sind: <b>möchten, können, müssen, wollen, sollen, dürfen</b>.
      </p>
      <PRule label="Die Satzregel">
        Subjekt + <b style={{ color: "#e2481f" }}>Modalverb (konjugiert)</b> + … + <b style={{ color: "#e2481f" }}>Infinitiv (am Ende)</b>.
      </PRule>

      {/* K2 */}
      <div style={{ marginTop: "7mm" }}>
        <PH num="02" kicker="Konjugation" title={<>Die 6 Modalverben</>} lede="Konjugation für alle Personen." />
        <PTable headers={["Person", "möchten", "können", "müssen", "wollen", "sollen", "dürfen"]} accentCol={1}
          rows={[
            ["ich", "möchte", "kann", "muss", "will", "soll", "darf"],
            ["du", "möchtest", "kannst", "musst", "willst", "sollst", "darfst"],
            ["er/sie/es", "möchte", "kann", "muss", "will", "soll", "darf"],
            ["wir", "möchten", "können", "müssen", "wollen", "sollen", "dürfen"],
            ["ihr", "möchtet", "könnt", "müsst", "wollt", "sollt", "dürft"],
            ["sie/Sie", "möchten", "können", "müssen", "wollen", "sollen", "dürfen"],
          ]} />
        <PRule>Die 1. und 3. Person Singular sind <b>gleich</b>: ich kann = er kann. Nur <b>du</b> bekommt -st.</PRule>
      </div>

      {/* K3 */}
      <div style={{ marginTop: "7mm" }}>
        <PH num="03" kicker="Vokalwechsel" title={<>Singular vs. Plural</>} lede="kann/können, muss/müssen — der Vokalwechsel." />
        <p style={{ fontSize: "10pt", lineHeight: 1.6, margin: "0 0 3mm" }}>
          Vier Modalverben haben einen Vokalwechsel im <b>Singular</b>:
          können → kann (ö→a), müssen → muss (ü→u), wollen → will (o→i), dürfen → darf (ü→a).
          Im Plural bleibt der Umlaut: können, müsst, wollt, dürft.
        </p>
        <PRule>Vokalwechsel nur im Singular! Im Plural bleibt der Stamm.</PRule>
      </div>
    </div>

    {/* K4 */}
    <div className="page-break">
      <PH num="04" kicker="Dativ-Verben" title={<>Modal + Dativ</>} lede="helfen, danken, antworten — sie verlangen den Dativ." />
      <p style={{ fontSize: "10pt", lineHeight: 1.6, margin: "0 0 3mm" }}>
        Modalverben kombinieren oft mit Dativ-Verben: <b>helfen, danken, antworten, glauben, gratulieren</b>.
        Das Objekt steht dann im Dativ (Wem?).
      </p>
      <PTable headers={["Modal", "Dativ-Verb", "Beispiel", "English"]} accentCol={2}
        rows={[
          ["möchte", "helfen", "Ich möchte dir helfen.", "I would like to help you."],
          ["kann", "danken", "Er kann mir danken.", "He can thank me."],
          ["muss", "antworten", "Wir müssen ihm antworten.", "We must answer him."],
          ["will", "gratulieren", "Sie will dir gratulieren.", "She wants to congratulate you."],
          ["soll", "glauben", "Ihr sollt mir glauben.", "You should believe me."],
          ["darf", "helfen", "Darf ich dir helfen?", "May I help you?"],
        ]} />

      {/* K5 */}
      <div style={{ marginTop: "7mm" }}>
        <PH num="05" kicker="Satzbau" title={<>Modal + Dativ + Infinitiv</>} lede="Die Wortstellung: Subjekt + Modal + Dativ-Objekt + Infinitiv." />
        <PRule label="Die Reihenfolge">
          1. Subjekt → 2. Modalverb → 3. Dativ-Objekt → 4. Infinitiv (am Ende).
        </PRule>
        <div style={{ fontSize: "10pt", lineHeight: 2 }}>
          <div>Wir <b>müssen</b> <span style={{ color: "#2f5bd7" }}>ihm</span> <b>antworten</b>.</div>
          <div>Du <b>kannst</b> <span style={{ color: "#2f5bd7" }}>mir</span> <b>helfen</b>.</div>
          <div>Ich <b>darf</b> <span style={{ color: "#2f5bd7" }}>dir</span> <b>danken</b>.</div>
        </div>
      </div>
    </div>

    {/* K6 */}
    <div className="page-break">
      <PH num="06" kicker="Artikel & Pronomen" title={<>Dativ mit Artikeln</>} lede="dem/der/dem/den — bestimmte, unbestimmte, possessive." />
      <PTable headers={["Genus", "Nominativ", "Dativ", "Beispiel"]} accentCol={2}
        rows={[
          ["Maskulin", "der", "dem", "Ich helfe dem Mann."],
          ["Feminin", "die", "der", "Ich helfe der Frau."],
          ["Neutrum", "das", "dem", "Ich helfe dem Kind."],
          ["Plural", "die", "den …-n", "Ich helfe den Kindern."],
        ]} />
      <PRule>Im Dativ: <b style={{ color: "#e2481f" }}>der→dem, die→der, das→dem, die(Pl.)→den…-n</b>.</PRule>

      <PTable headers={["Nominativ", "Dativ", "English"]} accentCol={1}
        rows={[
          ["ich", "mir", "I → me"],
          ["du", "dir", "you → you"],
          ["er", "ihm", "he → him"],
          ["sie", "ihr", "she → her"],
          ["wir", "uns", "we → us"],
          ["ihr", "euch", "you (pl.) → you"],
          ["sie (Pl.)", "ihnen", "they → them"],
          ["Sie", "Ihnen", "you (formal) → you"],
        ]} />
    </div>

    {/* K7 */}
    <div className="page-break">
      <PH num="07" kicker="Der Klassiker" title={<>mir oder mich?</>} lede="Das Verb entscheidet: Wem oder Wen?" />
      <div style={{ display: "flex", gap: "4mm" }}>
        <div className="avoid-break" style={{ flex: 1, border: "1.6pt solid #2f5bd7", background: "#eef3ff", borderRadius: "3mm", padding: "4.5mm 5mm" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "20pt", fontWeight: 800, color: "#2f5bd7" }}>mir · dir · ihm</div>
          <div style={{ fontSize: "7pt", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2f5bd7" }}>Dativ (Wem?)</div>
          <p style={{ fontSize: "9.5pt", lineHeight: 1.55, margin: "2mm 0" }}><b>helfen, danken, antworten, glauben, gratulieren</b></p>
          <div style={{ background: "#fff", borderRadius: "2mm", padding: "2.5mm 3.5mm" }}>
            Kannst du <b style={{ color: "#2f5bd7" }}>mir</b> helfen?
          </div>
        </div>
        <div className="avoid-break" style={{ flex: 1, border: "1.6pt solid #e2481f", background: "#fdeee8", borderRadius: "3mm", padding: "4.5mm 5mm" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "20pt", fontWeight: 800, color: "#e2481f" }}>mich · dich · ihn</div>
          <div style={{ fontSize: "7pt", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e2481f" }}>Akkusativ (Wen?)</div>
          <p style={{ fontSize: "9.5pt", lineHeight: 1.55, margin: "2mm 0" }}><b>sehen, kennen, lieben, kaufen</b></p>
          <div style={{ background: "#fff", borderRadius: "2mm", padding: "2.5mm 3.5mm" }}>
            Ich sehe <b style={{ color: "#e2481f" }}>dich</b>.
          </div>
        </div>
      </div>
    </div>

    {/* ============ MERKKARTE ============ */}
    <div className="page-break">
      <PH num="08" kicker="Zum Mitnehmen" title={<>Die Merkkarte</>} lede="Ausschneiden, aufhängen, nie wieder vergessen." />
      <div className="avoid-break" style={{ border: "1.4pt dashed #211b12", borderRadius: "4mm", padding: "3.5mm" }}>
        <div style={{ border: "1.8pt solid #211b12", borderRadius: "3mm", padding: "6mm 7mm", background: "#fff" }}>
          <div style={{ fontSize: "7.5pt", fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: "#e2481f" }}>Modalverben · Merkkarte</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "14pt", fontWeight: 750, margin: "1.5mm 0 4mm" }}>Die 6 Modalverben auf einen Blick</div>
          <PTable headers={["Person", "möchten", "können", "müssen", "wollen", "sollen", "dürfen"]} accentCol={1}
            rows={[
              ["ich", <b>möchte</b>, <b>kann</b>, <b>muss</b>, <b>will</b>, <b>soll</b>, <b>darf</b>],
              ["du", <b>möchtest</b>, <b>kannst</b>, <b>musst</b>, <b>willst</b>, <b>sollst</b>, <b>darfst</b>],
              ["er", <b>möchte</b>, <b>kann</b>, <b>muss</b>, <b>will</b>, <b>soll</b>, <b>darf</b>],
              ["wir", <b>möchten</b>, <b>können</b>, <b>müssen</b>, <b>wollen</b>, <b>sollen</b>, <b>dürfen</b>],
              ["ihr", <b>möchtet</b>, <b>könnt</b>, <b>müsst</b>, <b>wollt</b>, <b>sollt</b>, <b>dürft</b>],
              ["sie", <b>möchten</b>, <b>können</b>, <b>müssen</b>, <b>wollen</b>, <b>sollen</b>, <b>dürfen</b>],
            ]} />
          <div style={{ background: "#211b12", color: "#faf6ee", borderRadius: "2.5mm", padding: "4mm 5mm", marginTop: "3mm" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "13pt", fontWeight: 700 }}><span style={{ color: "#c3d4ff" }}>mir</span> = to me (Dativ)</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "13pt", fontWeight: 700 }}><span style={{ color: "#ffd84d" }}>mich</span> = me (Akkusativ)</div>
            <div style={{ fontSize: "8pt", color: "#c9c0aa", marginTop: "1.5mm" }}>Das Verb entscheidet: helfen → mir, sehen → mich.</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "2.5mm", fontSize: "8.5pt", color: "#746a58" }}>
        <Scissors className="w-3 h-3 inline-block -mt-0.5" strokeWidth={2.4} /> hier ausschneiden
      </div>
    </div>

    {/* ============ WORTSCHATZ ============ */}
    <div className="page-break">
      <div style={{ fontSize: "22pt", fontFamily: "Fraunces, serif", fontWeight: 750, borderBottom: "2.4pt solid #211b12", paddingBottom: "3mm", marginBottom: "4mm" }}>
        Wortschatz · Modalverben & Dativ-Verben
      </div>
      <div style={{ fontSize: "10pt", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e2481f", marginBottom: "2mm" }}>
        Die 6 Modalverben
      </div>
      <div style={{ fontSize: "9.5pt", lineHeight: 1.9, marginBottom: "4mm" }}>
        {(Object.keys(MODAL_VERBS) as (keyof typeof MODAL_VERBS)[]).map((v) => (
          <span key={v} style={{ marginRight: "5mm", whiteSpace: "nowrap" }}>
            <b style={{ fontFamily: "Fraunces, serif" }}>{MODAL_VERBS[v].inf}</b>{" "}
            <span style={{ color: "#746a58", fontStyle: "italic", fontSize: "8pt" }}>{MODAL_VERBS[v].en}</span>
          </span>
        ))}
      </div>
      <div style={{ fontSize: "10pt", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e2481f", marginBottom: "2mm" }}>
        Dativ-Verben
      </div>
      <div style={{ fontSize: "9.5pt", lineHeight: 1.9 }}>
        {(Object.keys(DAT_VERBS) as (keyof typeof DAT_VERBS)[]).map((v) => (
          <span key={v} style={{ marginRight: "5mm", whiteSpace: "nowrap" }}>
            <b style={{ fontFamily: "Fraunces, serif" }}>{DAT_VERBS[v].inf}</b>{" "}
            <span style={{ color: "#746a58", fontStyle: "italic", fontSize: "8pt" }}>{DAT_VERBS[v].en}</span>
          </span>
        ))}
      </div>
    </div>

    {/* ============ END ============ */}
    <div style={{ marginTop: "8mm", textAlign: "center", fontSize: "9pt", color: "#746a58" }}>
      — Ende · Viel Erfolg beim Weiterlernen! —<br />
      <span style={{ fontSize: "8pt" }}>Modalverben · Dein A1-Arbeitsbuch</span>
    </div>
  </div>
);
