import { DopeMap } from "@johnhaup/dope-map";
import { useMemo, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { format, parse } from "../parse";
import { decodeShared, encodeShared } from "../share";
import { CodeEditor } from "./CodeEditor";
import { CopyButton } from "./CopyButton";
import { Flash, MapPanel } from "./MapPanel";

const PRESETS: [string, string][] = [
  ["object", '{ hey: "you", whats: "up" }'],
  ["reordered", '{ whats: "up", hey: "you" }'],
  ["array", "[1, 2, 3]"],
  ["nested", '{\n  user: { id: 7 },\n  tags: ["sale", "new"],\n}'],
  ["string", '"dope"'],
  ["number", "42"],
];

const METHODS = ["set", "get", "has", "delete"] as const;
type Method = (typeof METHODS)[number];

// hit: found an existing entry; null: neither (a .set() that added one)
type Outcome = { text: string; hit: boolean | null };
type Result = { call: string; map: Outcome; dope: Outcome };

const outcomeClass = ({ hit }: Outcome) => (hit === null ? "" : hit ? "hit" : "miss");

function createMaps() {
  const shared = decodeShared(window.location.hash);
  return {
    shared,
    map: new Map<unknown, unknown>(shared?.map),
    dope: new DopeMap<unknown, unknown>(shared?.dope),
  };
}

export function Playground() {
  const initial = useRef<ReturnType<typeof createMaps>>(null);
  if (!initial.current) initial.current = createMaps();
  const { map, dope, shared } = initial.current;

  const [, setVersion] = useState(0);
  const rerender = () => setVersion((v) => v + 1);

  const [keyText, setKeyText] = useState(shared?.key ?? PRESETS[0][1]);
  const [valueText, setValueText] = useState(shared?.value ?? '"dope."');
  // Set when a key is picked from a map: the exact object, not a copy.
  const [reference, setReference] = useState<{ key: unknown } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [flash, setFlash] = useState<Flash>(null);

  const parsedKey = useMemo(() => parse(keyText), [keyText]);
  const parsedValue = useMemo(() => parse(valueText), [valueText]);
  const ready = (reference !== null || parsedKey.ok) && parsedValue.ok;

  const editKey = (text: string) => {
    setReference(null);
    setKeyText(text);
  };

  const pick = (key: unknown) => {
    if (reference && reference.key === key) {
      setReference(null);
      return;
    }
    setReference({ key });
    setKeyText(format(key, true));
  };

  const run = (method: Method) => {
    if (!ready) return;
    // Parse again on every call: typing the same text twice must give two
    // different objects, or Map would look like it dedupes too.
    const key = reference ? reference.key : (parse(keyText) as { value: unknown }).value;
    const value = (parsedValue as { value: unknown }).value;
    const shown = format(key) + (reference ? " /* same object */" : "");
    let outcome: (m: Map<unknown, unknown> | DopeMap<unknown, unknown>) => Outcome;

    if (method === "set") {
      outcome = (m) => {
        const before = m.size;
        m.set(key, value);
        return m.size > before
          ? { text: `added (size ${m.size})`, hit: null }
          : { text: `updated existing key`, hit: true };
      };
    } else if (method === "get") {
      outcome = (m) => {
        const v = m.get(key);
        return { text: format(v), hit: v !== undefined };
      };
    } else {
      outcome = (m) => {
        const r = m[method](key);
        return { text: String(r), hit: r };
      };
    }

    setResult({
      call: `.${method}(${shown}${method === "set" ? `, ${format(value)}` : ""})`,
      map: outcome(map),
      dope: outcome(dope),
    });
    setFlash(method === "delete" ? null : { key, nonce: Date.now() });
    if (method === "delete" && reference) setReference(null);
    rerender();
  };

  const clear = () => {
    map.clear();
    dope.clear();
    setReference(null);
    setResult(null);
    setFlash(null);
    rerender();
  };

  const shareLink = () =>
    window.location.origin +
    window.location.pathname +
    encodeShared({
      key: keyText,
      value: valueText,
      map: Array.from(map.entries()),
      dope: dope.getEntries(),
    });

  return (
    <section className="section" aria-labelledby="playground-title">
      <div className="section-head">
        <h2 id="playground-title">Playground</h2>
        <p>
          Same calls, two maps. Keys and values are JavaScript literals (JSON5),
          so <code>{"{ id: 1 }"}</code> works without quoting every key.
        </p>
      </div>

      <div className="presets" role="group" aria-label="Example keys">
        <span className="presets-label">try a key:</span>
        {PRESETS.map(([name, text]) => (
          <button
            key={name}
            className={`chip ${!reference && keyText === text ? "active" : ""}`}
            onClick={() => editKey(text)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="editors">
        <CodeEditor
          label="key"
          value={keyText}
          onChange={editKey}
          parsed={reference ? { ok: true, value: reference.key } : parsedKey}
          linked={reference !== null}
        />
        <CodeEditor label="value" value={valueText} onChange={setValueText} parsed={parsedValue} />
      </div>

      <div className="methods">
        {METHODS.map((m) => (
          <button key={m} className="button method" onClick={() => run(m)} disabled={!ready}>
            .{m}()
          </button>
        ))}
      </div>

      <div className="result" aria-live="polite">
        {result ? (
          <>
            <code className="result-call">{result.call}</code>
            <div className="result-row">
              <span className="result-name dope">DopeMap</span>
              <code className={outcomeClass(result.dope)}>{result.dope.text}</code>
            </div>
            <div className="result-row">
              <span className="result-name map">Map</span>
              <code className={outcomeClass(result.map)}>{result.map.text}</code>
            </div>
          </>
        ) : (
          <span className="result-hint">
            Call <code>.set()</code> twice with the same key, then try{" "}
            <code>reordered</code>.
          </span>
        )}
      </div>

      <div className="panels">
        <MapPanel
          kind="dope"
          entries={dope.getEntries()}
          reference={reference?.key}
          hasReference={reference !== null}
          flash={flash}
          onPick={pick}
        />
        <MapPanel
          kind="map"
          entries={Array.from(map.entries())}
          reference={reference?.key}
          hasReference={reference !== null}
          flash={flash}
          onPick={pick}
        />
      </div>

      <div className="panel-actions">
        <p className="hint">
          Newest first. Click a key to reuse that exact object. Map tags show
          object identity; DopeMap tags show the key's hash.
        </p>
        <div className="panel-buttons">
          <button className="button" onClick={clear}>
            <FiTrash2 aria-hidden /> <span>clear both</span>
          </button>
          <CopyButton text={shareLink} label="Copy a link to this state">
            share link
          </CopyButton>
        </div>
      </div>
    </section>
  );
}
