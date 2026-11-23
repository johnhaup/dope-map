import { useEffect, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";
import type { RaceResult } from "../race.worker";

const SIZES = [1_000, 10_000, 100_000];

export function SpeedRace() {
  const [size, setSize] = useState(10_000);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [running, setRunning] = useState(false);
  const worker = useRef<Worker>(null);

  useEffect(() => () => worker.current?.terminate(), []);

  const start = () => {
    worker.current?.terminate();
    const w = new Worker(new URL("../race.worker.ts", import.meta.url), { type: "module" });
    worker.current = w;
    setResults([]);
    setRunning(true);
    w.onmessage = ({ data }: MessageEvent<RaceResult | "done">) => {
      if (data === "done") {
        setRunning(false);
        w.terminate();
      } else {
        setResults((r) => [...r, data]);
      }
    };
    w.postMessage({ size });
  };

  const slowest = Math.max(...results.map((r) => r.ms), 1);

  return (
    <section className="section" aria-labelledby="race-title">
      <div className="section-head">
        <h2 id="race-title">Speed race</h2>
        <p>
          Each contender stores <code>n</code> filter objects, then looks each
          one up with an equal object built from scratch, half of them with
          fields in a different order. Runs in your browser, median of 5.
        </p>
      </div>

      <div className="race-controls">
        <div className="segmented" role="radiogroup" aria-label="Number of keys">
          {SIZES.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={size === s}
              className={size === s ? "active" : ""}
              onClick={() => setSize(s)}
              disabled={running}
            >
              {s.toLocaleString()}
            </button>
          ))}
        </div>
        <button className="button primary" onClick={start} disabled={running}>
          <FiPlay aria-hidden /> <span>{running ? "racing…" : "race"}</span>
        </button>
      </div>

      <div className="race-results">
        {results.length === 0 && !running && (
          <p className="hint">Pick a size and hit race.</p>
        )}
        {results.map((r) => {
          const pct = Math.round((r.hits / r.size) * 100);
          return (
            <div className="race-row" key={r.name}>
              <span className="race-name">{r.name}</span>
              <div className="race-track">
                <div
                  className={`race-bar ${r.name === "DopeMap" ? "dope" : ""}`}
                  style={{ width: `${Math.max((r.ms / slowest) * 100, 2)}%` }}
                />
              </div>
              <span className="race-ms">{r.ms.toFixed(1)} ms</span>
              <span className={`race-hits ${pct === 100 ? "hit" : "miss"}`}>
                found {pct}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="hint">
        Shorter bars are faster. A plain <code>Map</code> is fastest and finds
        nothing; <code>JSON.stringify</code> keys miss every reordered object.
      </p>
    </section>
  );
}
