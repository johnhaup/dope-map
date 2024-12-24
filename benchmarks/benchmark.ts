import Benchmark, { Target } from "benchmark";
import DopeMap from "../src";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SIZES = [100, 1_000, 10_000, 100_000];

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

function generatePrimitiveKeys(size: number): string[] | number[] {
  return new Array(size).map((s) => (s % 2 === 0 ? s : `${s}_${s}:wavves`));
}

const KEY_CONFIGS = [
  {
    title: "objects",
    generateKeys: generateMixedKeys,
  },
  {
    title: "primitives",
    generateKeys: generatePrimitiveKeys,
  },
];

const resultsTable: string[] = [];

SIZES.forEach((size) => {
  KEY_CONFIGS.forEach(({ title, generateKeys }) => {
    console.log(
      `\nRunning benchmarks for size: ${size} entries with ${title} keys`
    );
    const suite = new Benchmark.Suite();

    const nativeMap = new Map<object, string>();
    const customMap = new DopeMap<string>();

    const generatedKeys = generateKeys(size);
    const testValue = "testValue";

    suite
      .add(`Map - Set (${size} entries)`, function () {
        generatedKeys.forEach((key) => nativeMap.set(key, testValue));
      })
      .add(`DopeMap - Set (${size} entries)`, function () {
        generatedKeys.forEach((key) => customMap.set(key, testValue));
      })
      .add(`Map - Get (${size} entries)`, function () {
        generatedKeys.forEach((key) => nativeMap.get(key));
      })
      .add(`DopeMap - Get (${size} entries)`, function () {
        generatedKeys.forEach((key) => customMap.get(key));
      })
      .add(`Map - Delete (${size} entries)`, function () {
        generatedKeys.forEach((key) => nativeMap.delete(key));
      })
      .add(`DopeMap - Delete (${size} entries)`, function () {
        generatedKeys.forEach((key) => customMap.delete(key));
      })
      .on("complete", function () {
        console.log(`Results for ${size} entries:`);

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

        resultsTable.push(
          `#### ${title} keys / ${size.toLocaleString()} entries`,
          `| Operation |  Map (ms) | DopeMap (ms) | Difference (ms) |`,
          `|-----------|-----------------|--------------|-----------------|`,
          `| Set       | ${nativeSet.toFixed(3)}      | ${dopeSet.toFixed(
            3
          )}     | ${(dopeSet - nativeSet).toFixed(3)}          |`,
          `| Get       | ${nativeGet.toFixed(3)}      | ${dopeGet.toFixed(
            3
          )}     | ${(dopeGet - nativeGet).toFixed(3)}          |`,
          `| Delete    | ${nativeDelete.toFixed(3)}      | ${dopeDelete.toFixed(
            3
          )}     | ${(dopeDelete - nativeDelete).toFixed(3)}          |`,
          ``
        );
      })
      .run({ async: false }); // Ensure benchmarks run sequentially
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.resolve(__dirname, "../README.md");
const readmeContent = fs.readFileSync(readmePath, "utf-8");

// Replace the benchmark section
const updatedReadme = readmeContent.replace(
  /<!-- BENCHMARK RESULTS START -->([\s\S]*?)<!-- BENCHMARK RESULTS END -->/,
  `<!-- BENCHMARK RESULTS START -->\n${resultsTable.join(
    "\n"
  )}\n<!-- BENCHMARK RESULTS END -->`
);

fs.writeFileSync(readmePath, updatedReadme, "utf-8");

console.log("Benchmark results updated in README.md");
