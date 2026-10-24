function sortKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if ("toJSON" in (obj as object)) return obj;
  const sorted: Record<string, unknown> = {};
  for (const k of Object.keys(obj as Record<string, unknown>).sort()) {
    sorted[k] = sortKeys((obj as Record<string, unknown>)[k]);
  }
  return sorted;
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
      const str = JSON.stringify(sortKeys(value));
      // Two independent 32-bit FNV-1a style lanes combined into one 53-bit
      // integer. Math.imul keeps the multiply in int32 (the plain `*` version
      // overflowed 2^53 and silently dropped low bits), and 53 bits makes
      // collisions negligible at 100k+ entries where 32 bits were not.
      let h1 = 0x811c9dc5;
      let h2 = 0x9747b28c;
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193);
        h2 = Math.imul(h2 ^ c, 0x5bd1e995);
      }
      return (h1 >>> 0) * 0x200000 + (h2 >>> 11);
    }
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
  }

  return "unknown";
}
