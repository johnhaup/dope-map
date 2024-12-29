import Benchmark, { Target } from "benchmark";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { KEY_CONFIGS, MAP_IMPLEMENTATIONS, METHODS, SIZES } from "./constants";
import { formatMs, roundMs } from "./utils";

const resultsTable: string[] = [];

KEY_CONFIGS.forEach(({ title, generateKeys }) => {
  resultsTable.push(`### ${title.toLocaleUpperCase()} keys`);
  SIZES.forEach((size) => {
    console.log(
      `\nRunning benchmarks for size: ${size} entries with ${title} keys`
    );

    const suite = new Benchmark.Suite();
    const generatedKeys = generateKeys(size);
    const testValue = "testValue";

    const operationResults: Record<string, Record<string, number>> = {
      Set: {},
      Get: {},
      Has: {},
      Delete: {},
    };

    MAP_IMPLEMENTATIONS.forEach(({ name, instance }) => {
      const mapInstance = instance();

      suite.add(`${name} - Set`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.set(key, testValue);
        });
      });

      suite.add(`${name} - Get`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.get(key);
        });
      });

      suite.add(`${name} - Has`, function () {
        generatedKeys.forEach((key) => {
          mapInstance.has(key);
        });
      });

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

        resultsTable.push(`#### ${size.toLocaleString()} iterations`);
        resultsTable.push(`| Map | ${METHODS.join(" | ")} | Size |`);
        resultsTable.push(
          `|-----------|${METHODS.map(() => "-----------").join(
            "|"
          )}|-----------|`
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

          const finalRow = row.join(" | ") + ` | ${size} |`;
          resultsTable.push(finalRow);
        });

        resultsTable.push("");
      })
      .run({ async: false });
  });
});

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
