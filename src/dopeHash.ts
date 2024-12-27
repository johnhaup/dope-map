export function dopeHash(
  value: unknown,
  options: { sortKeys?: boolean; handleCycles?: boolean } = {
    sortKeys: true,
    handleCycles: false,
  },
  stack = new WeakSet()
) {
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
      if (value === null) return "null";

      if (options.handleCycles) {
        if (stack.has(value)) return "[Circular]";
        stack.add(value);
      }

      if (Array.isArray(value)) {
        let result = "a[";
        for (let i = 0; i < value.length; i++) {
          result += `${dopeHash(value[i], options, stack)},`;
        }
        if (options.handleCycles) stack.delete(value);
        return result + "]";
      }

      let keys = Object.keys(value);
      if (options.sortKeys) {
        keys.sort();
      }

      let result = "o{";
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result += `${key}:${dopeHash(
          (value as { [key: string]: unknown })[key],
          options,
          stack
        )}`;
      }

      if (options.handleCycles) stack.delete(value);
      return result + "}";
    }
  }

  return "unknown";
}
