import JSON5 from "json5";

export type Parsed =
  | { ok: true; value: unknown }
  | { ok: false; message: string; row: number; column: number };

// Editor input is JSON5 (unquoted keys, single quotes, trailing commas), so
// object literals read naturally without ever running user code. That matters
// because shared links put this text in the URL.
export function parse(source: string): Parsed {
  try {
    return { ok: true, value: JSON5.parse(source) };
  } catch (e) {
    const err = e as SyntaxError & { lineNumber?: number; columnNumber?: number };
    const message = err.message.replace(/^JSON5: /, "");
    return {
      ok: false,
      message: /invalid character|invalid end/.test(message)
        ? `${message}. Strings need quotes: "dope"`
        : message,
      row: (err.lineNumber ?? 1) - 1,
      column: (err.columnNumber ?? 1) - 1,
    };
  }
}

const IDENT = /^[A-Za-z_$][\w$]*$/;

// One-line JS-literal display: { id: 1, tags: ["a"] }
function inline(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(inline).join(", ")}]`;
  if (value !== null && typeof value === "object") {
    const fields = Object.entries(value).map(
      ([k, v]) => `${IDENT.test(k) ? k : JSON.stringify(k)}: ${inline(v)}`
    );
    return fields.length ? `{ ${fields.join(", ")} }` : "{}";
  }
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

export function format(value: unknown, pretty = false): string {
  if (!pretty) return inline(value);
  return JSON5.stringify(value, { space: 2, quote: '"' }) ?? String(value);
}
