import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

const basePlugins = (tsOptions = {}) => [
  resolve({
    extensions: [".ts", ".js"],
    preferBuiltins: false, // Include dependencies in the bundle
  }),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    ...tsOptions,
  }),
  terser(),
];

export default [
  // ESM Build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js", // Pure ESM build
      format: "esm",
      sourcemap: true,
    },
    plugins: basePlugins({
      declaration: true,
      emitDeclarationOnly: false,
      rootDir: "./src",
      outDir: "./dist",
    }),
    external: [], // Bundle everything into one file
    treeshake: {
      moduleSideEffects: false,
    },
  },

  // React ESM Build
  {
    input: "src/react/index.ts",
    output: {
      file: "dist/react/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: basePlugins({
      declaration: false,
    }),
    external: ["react"],
    treeshake: {
      moduleSideEffects: false,
    },
  },

  // Type Declarations
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
  },

  // React Type Declarations
  {
    input: "src/react/index.ts",
    output: {
      file: "dist/react/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
  },
];
