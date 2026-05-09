import stringify from "fast-json-stable-stringify";

function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) | 0; // FNV prime, keep 32-bit
  }
  return hash >>> 0; // Unsigned
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
    case "object":
      return fnv1aHash(stringify(value));
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
  }

  return "unknown";
}
