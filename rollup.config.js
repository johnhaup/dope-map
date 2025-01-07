import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

const plugins = [
  resolve({
    extensions: [".ts", ".js"],
    preferBuiltins: false, // Include dependencies in the bundle
  }),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    declaration: true,
    emitDeclarationOnly: false,
    rootDir: "./src",
    outDir: "./dist",
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
    plugins,
    external: [], // Bundle everything into one file
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
];
