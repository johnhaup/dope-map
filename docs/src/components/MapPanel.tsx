import { dopeHash } from "@johnhaup/dope-map/hash";
import { FiLink } from "react-icons/fi";
import { format } from "../parse";

// Stable "obj #n" labels so you can see which Map keys are distinct objects.
const ids = new WeakMap<object, number>();
let nextId = 1;
function objectId(key: unknown) {
  if (typeof key !== "object" || key === null) return null;
  if (!ids.has(key)) ids.set(key, nextId++);
  return ids.get(key)!;
}

export function hashLabel(key: unknown) {
  const h = dopeHash(key);
  return typeof h === "number" && typeof key === "object" && key !== null
    ? `#${h.toString(16).padStart(14, "0")}`
    : null;
}

export type Flash = { key: unknown; nonce: number } | null;

type Props = {
  kind: "map" | "dope";
  entries: [unknown, unknown][];
  reference: unknown;
  hasReference: boolean;
  flash: Flash;
  onPick: (key: unknown) => void;
};

export function MapPanel({ kind, entries, reference, hasReference, flash, onPick }: Props) {
  const matches = (key: unknown) => {
    if (!flash) return false;
    if (kind === "map") return Object.is(key, flash.key);
    return dopeHash(key) === dopeHash(flash.key);
  };

  return (
    <div className={`panel panel-${kind}`}>
      <div className="panel-header">
        <h3>{kind === "map" ? "Map" : "DopeMap"}</h3>
        <span className="panel-size">size {entries.length}</span>
      </div>
      {entries.length === 0 ? (
        <p className="panel-empty">empty. hit .set()</p>
      ) : (
        <ol className="entries" reversed>
          {entries
            .map((entry, i) => [entry, i] as const)
            .reverse()
            .map(([[key, value], i]) => {
              const linked = hasReference && key === reference;
              const tag = kind === "map" ? objectId(key) : hashLabel(key);
              return (
                <li
                  key={matches(key) ? `${i}-${flash!.nonce}` : i}
                  className={`entry ${matches(key) ? "hit" : ""}`}
                >
                  <button
                    className={`entry-key ${linked ? "linked" : ""}`}
                    onClick={() => onPick(key)}
                    title={linked ? "Stop using this key" : "Use this exact key object"}
                  >
                    {format(key)}
                    {linked && <FiLink aria-label="in use as reference" />}
                  </button>
                  <span className="entry-arrow" aria-hidden>
                    →
                  </span>
                  <span className="entry-value">{format(value)}</span>
                  {tag !== null && (
                    <span
                      className="entry-tag"
                      title={kind === "map" ? "Object identity" : "dopeHash of the key"}
                    >
                      {kind === "map" ? `obj #${tag}` : tag}
                    </span>
                  )}
                </li>
              );
            })}
        </ol>
      )}
    </div>
  );
}
