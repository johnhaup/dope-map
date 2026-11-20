// Streaming structural hash: walks the value once with keys sorted and feeds
// every token straight into two independent 32-bit FNV-1a style lanes, which
// are combined into one 53-bit integer. No intermediate sorted copy and no
// JSON string is built. Semantics follow JSON.stringify: undefined, function
// and symbol values are dropped from objects and become null in arrays,
// non-finite numbers become null, and toJSON is honoured (Date etc.).
let h1 = 0;
let h2 = 0;

function mix(c: number) {
  h1 = Math.imul(h1 ^ c, 0x01000193);
  h2 = Math.imul(h2 ^ c, 0x5bd1e995);
}

function mixString(s: string) {
  // Length prefix keeps adjacent strings unambiguous without escaping.
  mix(s.length);
  for (let i = 0; i < s.length; i++) mix(s.charCodeAt(i));
}

function mixNumber(n: number) {
  if (n !== n || n === Infinity || n === -Infinity) {
    mix(0x6e); // null
  } else if ((n | 0) === n) {
    mix(0x69);
    mix(n);
  } else {
    mix(0x64);
    mixString(String(n));
  }
}

function skipped(v: unknown) {
  return (
    v === undefined || typeof v === "function" || typeof v === "symbol"
  );
}

function walk(v: unknown): void {
  switch (typeof v) {
    case "string":
      mix(0x73);
      mixString(v);
      return;
    case "number":
      mixNumber(v);
      return;
    case "boolean":
      mix(v ? 0x74 : 0x66);
      return;
    case "bigint":
      throw new TypeError("Do not know how to serialize a BigInt");
    case "object": {
      if (v === null) {
        mix(0x6e);
        return;
      }
      const toJSON = (v as { toJSON?: unknown }).toJSON;
      if (typeof toJSON === "function") {
        walk(toJSON.call(v));
        return;
      }
      if (Array.isArray(v)) {
        mix(0x5b);
        for (let i = 0; i < v.length; i++) {
          if (skipped(v[i])) mix(0x6e);
          else walk(v[i]);
        }
        mix(0x5d);
        return;
      }
      const o = v as Record<string, unknown>;
      const keys = Object.keys(o);
      // Insertion sort: keys are few, and this avoids Array.sort overhead.
      for (let i = 1; i < keys.length; i++) {
        const k = keys[i];
        let j = i - 1;
        while (j >= 0 && keys[j] > k) {
          keys[j + 1] = keys[j];
          j--;
        }
        keys[j + 1] = k;
      }
      mix(0x7b);
      for (let i = 0; i < keys.length; i++) {
        const val = o[keys[i]];
        if (skipped(val)) continue;
        mixString(keys[i]);
        walk(val);
      }
      mix(0x7d);
      return;
    }
  }
}

export function dopeHash(value: unknown) {
  switch (typeof value) {
    case "number":
      return value;
    case "string":
      return value;
    case "boolean":
    case "undefined":
      return `${value}`;
    case "object": {
      h1 = 0x811c9dc5;
      h2 = 0x9747b28c;
      walk(value);
      return (h1 >>> 0) * 0x200000 + (h2 >>> 11);
    }
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
  }

  return "unknown";
}
