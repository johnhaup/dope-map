import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
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
