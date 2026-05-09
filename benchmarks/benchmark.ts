import Benchmark, { Target } from "benchmark";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  KEY_CONFIGS,
  MAP_IMPLEMENTATIONS,
  METHODS,
  SIZES,
  REAL_WORLD_PATTERNS,
  MapInstance,
} from "./constants";
import { formatMs, roundMs, formatBytes, measureMemory } from "./utils";

const resultsTable: string[] = [];

// --- Per-Operation Benchmarks ---

KEY_CONFIGS.forEach(({ title, generateKeys }) => {
  resultsTable.push(`### ${title.toLocaleUpperCase()} keys`);
  SIZES.forEach((size) => {
    console.log(
      `\nRunning benchmarks for size: ${size} entries with ${title} keys`
    );

    const suite = new Benchmark.Suite();
    const generatedKeys = generateKeys(size);
    const testValue = "testValue";

    const operationResults: Record<string, Record<string, number>> = {};
    METHODS.forEach((m) => (operationResults[m] = {}));

    MAP_IMPLEMENTATIONS.forEach(({ name, instance }) => {
      // Set: fresh map each iteration
      suite.add(`${name} - Set`, function () {
        const m = instance();
        generatedKeys.forEach((key) => {
          m.set(key, testValue);
        });
      });

      // Get: pre-populated map, created once per cycle
      suite.add(`${name} - Get`, {
        fn() {
          generatedKeys.forEach((key) => {
            (this as unknown as { map: MapInstance }).map.get(key);
          });
        },
        onStart() {
          const m = instance();
          generatedKeys.forEach((key) => m.set(key, testValue));
          (this as unknown as { map: MapInstance }).map = m;
        },
      });

      // Has: pre-populated map
      suite.add(`${name} - Has`, {
        fn() {
          generatedKeys.forEach((key) => {
            (this as unknown as { map: MapInstance }).map.has(key);
          });
        },
        onStart() {
          const m = instance();
          generatedKeys.forEach((key) => m.set(key, testValue));
          (this as unknown as { map: MapInstance }).map = m;
        },
      });

      // Delete: fresh populated map each iteration
      suite.add(`${name} - Delete`, function () {
        const m = instance();
        generatedKeys.forEach((key) => m.set(key, testValue));
        generatedKeys.forEach((key) => {
          m.delete(key);
        });
      });

      // Clear: fresh populated map each iteration
      suite.add(`${name} - Clear`, function () {
        const m = instance();
        generatedKeys.forEach((key) => m.set(key, testValue));
        m.clear();
      });
    });

    suite
      .on("complete", function () {
        console.log(`Results for ${size} entries:`);

        const baselineResults: Record<string, number> = {};

        this.forEach((bench: Target) => {
          if (bench.hz && bench.name) {
            const [mapName, operation] = bench.name.split(" - ");
            const avgTimeMs = (1 / bench.hz) * 1000;

            operationResults[operation][mapName] = avgTimeMs;

            console.log(
              `${bench.name}: ${bench.hz.toFixed(
                2
              )} ops/sec (${avgTimeMs.toFixed(4)} ms per operation)`
            );

            if (mapName === "Map") {
              baselineResults[operation] = avgTimeMs;
            }
          }
        });

        resultsTable.push(`#### ${size.toLocaleString()} entries`);
        resultsTable.push(`| Map | ${METHODS.join(" | ")} |`);
        resultsTable.push(
          `|-----------|${METHODS.map(() => "-----------").join("|")} |`
        );

        MAP_IMPLEMENTATIONS.forEach(({ name }) => {
          const row = [`| **${name}**`];

          METHODS.forEach((method) => {
            const current = operationResults[method][name];
            const baseline = baselineResults[method] || 0;

            const difference = roundMs(
              baseline && operationResults[method][name]
                ? operationResults[method][name] - baseline
                : 0
            );
            const diffString = ` (${difference > 0 ? "+" : ""}${formatMs(
              difference
            )})`;
            const showDiffString = name !== "Map" && difference !== 0;

            row.push(
              `${formatMs(roundMs(current))}${showDiffString ? diffString : ""}`
            );
          });

          const finalRow = row.join(" | ") + ` |`;
          resultsTable.push(finalRow);
        });

        resultsTable.push("");
      })
      .run({ async: false });
  });
});

// --- Real-World Pattern Benchmarks ---

resultsTable.push(`### Real-World Patterns`);
resultsTable.push("");

KEY_CONFIGS.forEach(({ title, generateKeys }) => {
  const size = 10_000;
  const generatedKeys = generateKeys(size);
  const testValue = "testValue";

  REAL_WORLD_PATTERNS.forEach((pattern) => {
    console.log(
      `\nRunning ${pattern.name} pattern (${title} keys, ${size} entries)`
    );

    const suite = new Benchmark.Suite();
    const patternResults: Record<string, number> = {};

    MAP_IMPLEMENTATIONS.forEach(({ name, instance }) => {
      suite.add(`${name}`, {
        fn() {
          pattern.operations(
            (this as unknown as { map: MapInstance }).map,
            generatedKeys,
            testValue
          );
        },
        onStart() {
          const m = instance();
          generatedKeys.forEach((key) => m.set(key, testValue));
          (this as unknown as { map: MapInstance }).map = m;
        },
      });
    });

    suite
      .on("complete", function () {
        let baselineMs = 0;

        this.forEach((bench: Target) => {
          if (bench.hz && bench.name) {
            const avgTimeMs = (1 / bench.hz) * 1000;
            patternResults[bench.name] = avgTimeMs;
            if (bench.name === "Map") baselineMs = avgTimeMs;

            console.log(
              `${bench.name}: ${bench.hz.toFixed(
                2
              )} ops/sec (${avgTimeMs.toFixed(4)} ms)`
            );
          }
        });

        resultsTable.push(
          `#### ${pattern.name} (${pattern.description}) - ${title} keys, ${size.toLocaleString()} entries`
        );
        resultsTable.push(`| Map | Avg Time (ms) |`);
        resultsTable.push(`|-----------|-----------|`);

        MAP_IMPLEMENTATIONS.forEach(({ name }) => {
          const current = roundMs(patternResults[name]);
          const diff = roundMs(patternResults[name] - baselineMs);
          const diffString =
            name !== "Map" && diff !== 0
              ? ` (${diff > 0 ? "+" : ""}${formatMs(diff)})`
              : "";
          resultsTable.push(`| **${name}** | ${formatMs(current)}${diffString} |`);
        });

        resultsTable.push("");
      })
      .run({ async: false });
  });
});

// --- Memory Benchmarks ---

resultsTable.push(`### Memory Usage`);
resultsTable.push("");

console.log("\nRunning memory benchmarks...");

KEY_CONFIGS.forEach(({ title, generateKeys }) => {
  [1_000, 10_000, 100_000].forEach((size) => {
    console.log(`\nMemory benchmark: ${size} entries with ${title} keys`);
    const generatedKeys = generateKeys(size);
    const testValue = "testValue";

    resultsTable.push(
      `#### ${size.toLocaleString()} entries - ${title} keys`
    );
    resultsTable.push(
      `| Map | Populated | After Clear | Freed |`
    );
    resultsTable.push(`|-----------|-----------|-----------|-----------|`);

    MAP_IMPLEMENTATIONS.forEach(({ name, instance }) => {
      const { populated, afterClear, freed } = measureMemory(
        () => instance(),
        generatedKeys,
        testValue
      );

      console.log(
        `${name}: populated=${formatBytes(populated)}, afterClear=${formatBytes(
          afterClear
        )}, freed=${formatBytes(freed)}`
      );

      resultsTable.push(
        `| **${name}** | ${formatBytes(populated)} | ${formatBytes(
          afterClear
        )} | ${formatBytes(freed)} |`
      );
    });

    resultsTable.push("");
  });
});

// --- Write results to README ---

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

console.log("\nBenchmark results updated in README.md");
