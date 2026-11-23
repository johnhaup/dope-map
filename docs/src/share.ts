export type Entries = [unknown, unknown][];

export type Shared = {
  key: string;
  value: string;
  map: Entries;
  dope: Entries;
};

const PREFIX = "#s=";

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string) {
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeShared(state: Shared) {
  return PREFIX + toBase64Url(JSON.stringify(state));
}

const isEntries = (x: unknown): x is Entries =>
  Array.isArray(x) && x.every((e) => Array.isArray(e) && e.length === 2);

// Only JSON.parse touches the link's contents: a shared link can carry data,
// never code.
export function decodeShared(hash: string): Shared | null {
  if (!hash.startsWith(PREFIX)) return null;
  try {
    const s = JSON.parse(fromBase64Url(hash.slice(PREFIX.length)));
    if (
      typeof s?.key === "string" &&
      typeof s?.value === "string" &&
      isEntries(s.map) &&
      isEntries(s.dope)
    ) {
      return s;
    }
  } catch {
    // fall through to the default state
  }
  return null;
}
