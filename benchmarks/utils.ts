/* eslint-disable @typescript-eslint/no-explicit-any */

export const formatMs = (ms: number) => {
  return ms < 1 && ms > -1 && ms !== 0 ? ms.toFixed(3) : ms.toFixed(1);
};
export const roundMs = (ms: number) => Math.round(ms * 1000) / 1000;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sign = bytes < 0 ? "-" : "";
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${sign}${abs} B`;
  if (abs < 1024 * 1024) return `${sign}${(abs / 1024).toFixed(1)} KB`;
  return `${sign}${(abs / (1024 * 1024)).toFixed(2)} MB`;
}

export function generateMixedKeys(size: number): object[] {
  const keys: object[] = [];
  const duplicates = Math.floor(size / 2);
  const unique = size - duplicates;

  const baseKey = {
    id: 1,
    name: "Duplicate",
    nested: { level: 1, value: "Value" },
  };

  for (let i = 0; i < duplicates / 2; i++) {
    const duplicateKey = { ...baseKey, id: i };
    keys.push(duplicateKey, duplicateKey);
  }

  for (let i = 0; i < unique; i++) {
    keys.push({
      id: i + duplicates,
      name: `Unique Object ${i}`,
      nested: { level: 1, value: `Value ${i}` },
    });
  }

  return keys;
}

export function generatePrimitiveKeys(size: number): (string | number)[] {
  return Array.from({ length: size }, (_, s) =>
    s % 2 === 0 ? s : `${s}_${s}:wavves`
  );
}

export function measureMemory(
  createInstance: () => any,
  keys: any[],
  value: any
): { populated: number; afterClear: number; freed: number } {
  if (typeof global.gc !== "function") {
    throw new Error(
      "global.gc is not available. Run with --expose-gc flag."
    );
  }

  // Force GC and get baseline
  global.gc();
  const baseline = process.memoryUsage().heapUsed;

  // Populate the map
  const map = createInstance();
  keys.forEach((key) => map.set(key, value));

  global.gc();
  const populated = process.memoryUsage().heapUsed - baseline;

  // Clear and measure what was freed
  map.clear();

  global.gc();
  const afterClear = process.memoryUsage().heapUsed - baseline;

  const freed = populated - afterClear;

  return { populated, afterClear, freed };
}
