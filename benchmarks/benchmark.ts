import fs from "fs";
import path from "path";
import DopeMap from "../src/index";
import { nirvanaKey, nirvanaValue } from "../__fixtures__";

type TestValue = {
  albums: string[];
  topSongs: { [key: number]: string };
};

type ResultsValue = Array<{
  operation: string;
  dopeDuration: number;
  nativeDuration: number;
  overhead: number;
}>;

type ResultsMap = {
  [type: string]: ResultsValue;
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

const readmeFile = path.resolve(__dirname, "../README.md");

const runBenchmarkTask = (taskName: string, task: () => void) => {
  const start = performance.now();
  task();
  const end = performance.now();
  const duration = parseFloat((end - start).toFixed(2));
  return { taskName, duration };
};

const results: ResultsMap = {};

const genKeyType = (type: string, iterations: number) =>
  `${type}_${iterations}`;

const updateLogFile = () => {
  const logFile = path.resolve(__dirname, "benchmark.log");

  const dateHeader = new Date().toISOString();

  const formattedResults = Object.entries(results)
    .map(([keyType, entries]) =>
      entries
        .map(
          ({ dopeDuration, nativeDuration, overhead }) =>
            `key: ${keyType} | dope: ${dopeDuration}ms | map: ${nativeDuration}ms | overhead: ${overhead}ms`
        )
        .join("\n")
    )
    .join("\n");

  const newLogEntry = `${dateHeader}\n${formattedResults}`;

  const existingLog = fs.existsSync(logFile)
    ? fs.readFileSync(logFile, "utf8")
    : "";

  const updatedLog = `${newLogEntry}\n\n${existingLog}`.trim();

  fs.writeFileSync(logFile, updatedLog, "utf8");
};

const runBenchmark = (iterationCounts: number[]) => {
  const allResults: string[] = iterationCounts.map((iterations) => {
    const dopeMap = new DopeMap<TestValue>();
    const nativeMap = new Map<string | object, TestValue>();

    const addResult = (
      keyType: string,
      operation: string,
      dopeDuration: number,
      nativeDuration: number
    ) => {
      const key = genKeyType(keyType, iterations);

      if (!results[key]) {
        results[key] = [];
      }

      results[key].push({
        operation,
        dopeDuration,
        nativeDuration,
        overhead: parseFloat((dopeDuration - nativeDuration).toFixed(2)),
      });
    };

    const methods = ["set", "get", "has", "delete"] as const;

    const benchmarkObjectKeys = () => {
      methods.forEach((operation) => {
        addResult(
          "Object",
          operation,
          runBenchmarkTask(`DopeMap ${operation}: Object Key`, () => {
            for (let i = 0; i < iterations; i++) {
              const key = { ...nirvanaKey, index: i };
              const value = { ...nirvanaValue, id: i };
              dopeMap[operation](key, value);
            }
          }).duration,
          runBenchmarkTask(`Native Map ${operation}: Object Key`, () => {
            for (let i = 0; i < iterations; i++) {
              const key = { ...nirvanaKey, index: i };
              const value = { ...nirvanaValue, id: i };
              nativeMap[operation](key, value);
            }
          }).duration
        );
      });

      addResult(
        "Object",
        "Size",
        runBenchmarkTask("DopeMap Size: Object Key", () => {
          dopeMap.size;
        }).duration,
        runBenchmarkTask("Native Map Size: Object Key", () => {
          nativeMap.size;
        }).duration
      );

      // Clear
      addResult(
        "Object",
        "Clear",
        runBenchmarkTask("DopeMap Clear: Object Key", () => {
          dopeMap.clear();
        }).duration,
        runBenchmarkTask("Native Map Clear: Object Key", () => {
          nativeMap.clear();
        }).duration
      );
    };

    const benchmarkStringKeys = () => {
      methods.forEach((operation) => {
        addResult(
          "String",
          operation,
          runBenchmarkTask(`DopeMap ${operation}: String Key`, () => {
            for (let i = 0; i < iterations; i++) {
              const key = `nirvana${i}`;
              const value = { ...nirvanaValue, id: i };
              dopeMap[operation](key, value);
            }
          }).duration,
          runBenchmarkTask(`Native Map ${operation}: String Key`, () => {
            for (let i = 0; i < iterations; i++) {
              const key = `nirvana${i}`;
              const value = { ...nirvanaValue, id: i };
              nativeMap[operation](key, value);
            }
          }).duration
        );
      });

      addResult(
        "String",
        "Size",
        runBenchmarkTask("DopeMap Size: String Key", () => {
          dopeMap.size;
        }).duration,
        runBenchmarkTask("Native Map Size: String Key", () => {
          nativeMap.size;
        }).duration
      );

      addResult(
        "String",
        "Clear",
        runBenchmarkTask("DopeMap Clear: String Key", () => {
          dopeMap.clear();
        }).duration,
        runBenchmarkTask("Native Map Clear: String Key", () => {
          nativeMap.clear();
        }).duration
      );
    };

    benchmarkObjectKeys();
    benchmarkStringKeys();

    const generateTables = (iterations: number) => `
<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: Object</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DopeMap (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        ${results[genKeyType("Object", iterations)]
          .map(
            ({ operation, dopeDuration, nativeDuration, overhead }, index) =>
              `<tr style="background-color: ${
                index % 2 === 0 ? "#f2f2f2" : "white"
              }">
                <td style="border: 1px solid #ddd; padding: 8px;">${operation}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dopeDuration}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${nativeDuration}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${overhead}</td>
              </tr>`
          )
          .join("\n")}
      </tbody>
    </table>
  </div>
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: String (${formatNumber(iterations)} iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DopeMap (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        ${results[genKeyType("String", iterations)]
          .map(
            ({ operation, dopeDuration, nativeDuration, overhead }, index) =>
              `<tr style="background-color: ${
                index % 2 === 0 ? "#f2f2f2" : "white"
              }">
                <td style="border: 1px solid #ddd; padding: 8px;">${operation}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dopeDuration}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${nativeDuration}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${overhead}</td>
              </tr>`
          )
          .join("\n")}
      </tbody>
    </table>
  </div>
</div>
`;

    return `
#### ${formatNumber(iterations)} Iterations
${generateTables(iterations)}
    `;
  });

  const combinedResults = `
## Benchmark Results
As expected, this library comes with performance tradeoffs, so if your main goal is performance over efficiency, this likely isn't the right approach, especially when you are processing a large amount of data.

${allResults.join("\n")}
${"\n"}
${"\n"}

  `;

  const readmeContent = fs.readFileSync(readmeFile, "utf8");

  const benchmarkSectionRegex = /## Benchmark Results[\s\S]*?(?=\n\n---|$)/;
  let updatedReadme: string;

  if (benchmarkSectionRegex.test(readmeContent)) {
    updatedReadme = readmeContent.replace(
      benchmarkSectionRegex,
      combinedResults.trim()
    );
  } else {
    updatedReadme = `${readmeContent.trim()}\n\n${combinedResults.trim()}`;
  }

  fs.writeFileSync(readmeFile, updatedReadme);
  updateLogFile();
};

runBenchmark([1_000, 10_000, 100_000]);
