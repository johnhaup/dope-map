import XXHash from "xxhashjs";
import stringify from "fast-json-stable-stringify";

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
      const stringified = stringify(value);
      return XXHash.h32(stringified, 0xdeadbeef).toNumber();
    }
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
  }

  return "unknown";
}
