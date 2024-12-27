import Benchmark, { Target } from "benchmark";
import DopeMap from "../src/v1";
import DopeMapV2 from "../src/dopeMap";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SIZES = [100];

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
  return Array.from({ length: size }, (_, s) =>
    s % 2 === 0 ? s : `${s}_${s}:wavves`
  );
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

// 🛠️ Define Map Implementations
const MAP_IMPLEMENTATIONS = [
  { name: "Map", instance: () => new Map<object, string>() },
  { name: "DopeMap", instance: () => new DopeMap<string>() },
  {
    name: "V2",
    instance: () => new DopeMapV2<string>(),
  },
  {
    name: "V2 - sortKeys",
    instance: () => new DopeMapV2<string>({ hashConfig: { sortKeys: true } }),
  },
  {
    name: "V2 - handleCycles",
    instance: () =>
      new DopeMapV2<string>({ hashConfig: { handleCycles: true } }),
  },
];

// 📝 Results table
const resultsTable: string[] = [];

SIZES.forEach((size) => {
  KEY_CONFIGS.forEach(({ title, generateKeys }) => {
    console.log(
      `\nRunning benchmarks for size: ${size} entries with ${title} keys`
    );

    const suite = new Benchmark.Suite();
    const generatedKeys = generateKeys(size);
    const testValue = "testValue";

    const operationResults: Record<string, Record<string, number>> = {
      Set: {},
      Get: {},
      Delete: {},
    };

    MAP_IMPLEMENTATIONS.forEach(({ name, instance }) => {
      const mapInstance = instance();

      // Separate benchmark for Set operation
      suite.add(`${name} - Set`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.set(key, testValue);
        });
      });

      // Separate benchmark for Get operation
      suite.add(`${name} - Get`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.get(key);
        });
      });

      // Separate benchmark for Delete operation
      suite.add(`${name} - Delete`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.delete(key);
        });
      });
    });

    suite
      .on("complete", function () {
        console.log(`Results for ${size} entries:`);

        const baselineResults: Record<string, number> = {};

        this.forEach((bench: Target) => {
          if (bench.hz && bench.name) {
            const [name, operation] = bench.name.split(" - ");
            const avgTimeMs = (1 / bench.hz) * 1000;

            if (!operationResults[operation]) {
              operationResults[operation] = {};
            }

            operationResults[operation][name] = avgTimeMs;

            console.log(
              `${bench.name}: ${bench.hz.toFixed(
                2
              )} ops/sec (${avgTimeMs.toFixed(4)} ms per operation)`
            );

            if (name === "Map") {
              baselineResults[operation] = avgTimeMs;
            }
          }
        });

        resultsTable.push(
          `#### ${title} keys / ${size.toLocaleString()} entries`
        );
        resultsTable.push(
          `| Operation | ${MAP_IMPLEMENTATIONS.map(
            ({ name }) => `${name} (ms)`
          ).join(" | ")} |`
        );
        resultsTable.push(
          `|-----------|${MAP_IMPLEMENTATIONS.map(() => "-----------").join(
            "|"
          )}|`
        );

        ["Set", "Get", "Delete"].forEach((operation) => {
          const row = [`| ${operation}`];
          MAP_IMPLEMENTATIONS.forEach(({ name }) => {
            const current =
              operationResults[operation][name]?.toFixed(3) || "N/A";
            const baseline = baselineResults[operation] || 0;
            const difference =
              baseline && operationResults[operation][name]
                ? operationResults[operation][name] - baseline
                : 0;
            const diffString = ` (${
              difference > 0 ? "+" : "-"
            }${difference.toFixed(3)})`;
            row.push(`${current}${name === "Map" ? "" : diffString}`);
          });
          row.push("|");
          resultsTable.push(row.join(" | "));
        });

        resultsTable.push("");
      })
      .run({ async: false });
  });
});

// 📝 Update README
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.resolve(__dirname, "../README.md");
const readmeContent = fs.readFileSync(readmePath, "utf-8");

const updatedReadme = readmeContent.replace(
  /<!-- BENCHMARK RESULTS START -->([\s\S]*?)<!-- BENCHMARK RESULTS END -->/,
  `<!-- BENCHMARK RESULTS START -->\n${resultsTable.join(
    "\n"
  )}\n<!-- BENCHMARK RESULTS END -->`
);

fs.writeFileSync(readmePath, updatedReadme, "utf-8");

console.log("Benchmark results updated in README.md");
