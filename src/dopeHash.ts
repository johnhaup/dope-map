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
    case "object":
      return JSON.stringify(sortKeys(value));
    case "function":
      return `f${value.toString().replace(/\s+/g, "")}`;
    case "symbol":
      return `y${value.toString()}`;
  }

  return "unknown";
}
