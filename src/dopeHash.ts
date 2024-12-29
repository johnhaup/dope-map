import XXHash from "xxhashjs";
import stringify from "fast-json-stable-stringify";

export function dopeHash(value: unknown) {
  switch (typeof value) {
    case "number":
      return `n${value}`;
    case "string":
      return `s${value}`;
    case "boolean":
      return `b${value}`;
    case "undefined":
      return "u";
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
    case "object": {
      const stringified = stringify(value);
      return XXHash.h32(stringified, 0xdeadbeef).toString(16);
    }
  }

  return "unknown";
}
