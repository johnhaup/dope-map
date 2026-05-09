import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      ["__tests__/useDopeMap.test.ts", "jsdom"],
    ],
    pool: "forks",
    poolOptions: {
      forks: {
        execArgv: ["--expose-gc"],
      },
    },
    testTransformMode: {
      web: [".js"],
    },
    deps: {
      inline: ["rust-hash"],
    },
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
  },
});
