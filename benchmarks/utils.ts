export const formatMs = (ms: number) => {
  return ms < 1 && ms > -1 && ms !== 0 ? ms.toFixed(3) : ms.toFixed(1);
};
export const roundMs = (ms: number) => Math.round(ms * 1000) / 1000;

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
