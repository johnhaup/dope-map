import { DopeMap } from "@johnhaup/dope-map";

export type RaceRequest = { size: number };
export type RaceResult = { name: string; ms: number; hits: number; size: number };

const CATEGORIES = ["shoes", "hats", "socks", "shirts", "bags"];

// The keys a cache sees in practice: request filters built fresh per call.
const makeKey = (i: number) => ({
  id: i,
  filters: { category: CATEGORIES[i % 5], price: [i % 100, (i % 100) + 50] },
  page: i % 10,
});

// An equal key built somewhere else; every other one lists its fields in a
// different order.
const makeLookup = (i: number) =>
  i % 2 === 0
    ? makeKey(i)
    : {
        page: i % 10,
        filters: { price: [i % 100, (i % 100) + 50], category: CATEGORIES[i % 5] },
        id: i,
      };

type Contender = { name: string; run: (keys: object[], lookups: object[]) => number };

const CONTENDERS: Contender[] = [
  {
    name: "Map",
    run(keys, lookups) {
      const m = new Map<object, number>();
      keys.forEach((k, i) => m.set(k, i));
      let hits = 0;
      for (const k of lookups) if (m.get(k) !== undefined) hits++;
      return hits;
    },
  },
  {
    name: "Map + JSON.stringify",
    run(keys, lookups) {
      const m = new Map<string, number>();
      keys.forEach((k, i) => m.set(JSON.stringify(k), i));
      let hits = 0;
      for (const k of lookups) if (m.get(JSON.stringify(k)) !== undefined) hits++;
      return hits;
    },
  },
  {
    name: "DopeMap",
    run(keys, lookups) {
      const m = new DopeMap<number, object>();
      keys.forEach((k, i) => m.set(k, i));
      let hits = 0;
      for (const k of lookups) if (m.get(k) !== undefined) hits++;
      return hits;
    },
  },
];

const ROUNDS = 5;

self.onmessage = ({ data }: MessageEvent<RaceRequest>) => {
  const { size } = data;
  const keys = Array.from({ length: size }, (_, i) => makeKey(i));
  const lookups = Array.from({ length: size }, (_, i) => makeLookup(i));

  for (const c of CONTENDERS) {
    c.run(keys.slice(0, 1000), lookups.slice(0, 1000)); // warm up the JIT
    const times: number[] = [];
    let hits = 0;
    for (let r = 0; r < ROUNDS; r++) {
      const start = performance.now();
      hits = c.run(keys, lookups);
      times.push(performance.now() - start);
    }
    times.sort((a, b) => a - b);
    const result: RaceResult = { name: c.name, ms: times[ROUNDS >> 1], hits, size };
    self.postMessage(result);
  }
  self.postMessage("done");
};
