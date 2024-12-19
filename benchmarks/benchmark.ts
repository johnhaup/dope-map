import Benchmark, { Target } from "benchmark";
import DopeMap from "../src";

const SIZES = [100, 1_000, 10_000];

function generateMixedKeys(size: number): object[] {
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

SIZES.forEach((size) => {
  console.log(`Running benchmarks for size: ${size} entries with mixed keys`);
  const suite = new Benchmark.Suite();

  const nativeMap = new Map<object, string>();
  const customMap = new DopeMap<string>();

  const objectKeys = generateMixedKeys(size);
  const testValue = "testValue";

  suite
    .add({
      name: `Map - Set (${size} entries)`,
      fn: function () {
        objectKeys.forEach((key) => nativeMap.set(key, testValue));
      },
    })
    .add(`Map - Set (${size} entries)`, function () {
      objectKeys.forEach((key) => nativeMap.set(key, testValue));
    })
    .add(`DopeMap - Set (${size} entries)`, function () {
      objectKeys.forEach((key) => customMap.set(key, testValue));
    })
    .add(`Map - Get (${size} entries)`, function () {
      objectKeys.forEach((key) => nativeMap.get(key));
    })
    .add(`DopeMap - Get (${size} entries)`, function () {
      objectKeys.forEach((key) => customMap.get(key));
    })
    .add(`Map - Delete (${size} entries)`, function () {
      objectKeys.forEach((key) => nativeMap.delete(key));
    })
    .add(`DopeMap - Delete (${size} entries)`, function () {
      objectKeys.forEach((key) => customMap.delete(key));
    })
    .on("complete", function () {
      console.log(`Results for ${size} entries:\n`);

      const results: { [name: string]: number } = {};

      this.forEach((bench: Target) => {
        if (bench.hz && bench.name) {
          const opsPerSec = bench.hz;
          const avgTimeMs = (1 / opsPerSec) * 1000;
          results[bench.name] = avgTimeMs;

          console.log(
            `${bench.name}: ${opsPerSec.toFixed(
              2
            )} ops/sec (${avgTimeMs.toFixed(4)} ms per operation)`
          );
        }
      });

      const nativeSet = results[`Map - Set (${size} entries)`];
      const dopeSet = results[`DopeMap - Set (${size} entries)`];
      const nativeGet = results[`Map - Get (${size} entries)`];
      const dopeGet = results[`DopeMap - Get (${size} entries)`];
      const nativeDelete = results[`Map - Delete (${size} entries)`];
      const dopeDelete = results[`DopeMap - Delete (${size} entries)`];

      console.log("\nTime Differences (DopeMap vs Map):\n");

      console.log(`Set: ${(dopeSet - nativeSet).toFixed(4)} ms`);
      console.log(`Get: ${(dopeGet - nativeGet).toFixed(4)} ms`);
      console.log(`Delete: ${(dopeDelete - nativeDelete).toFixed(4)} ms`);
    })
    .run({ async: true });
});
