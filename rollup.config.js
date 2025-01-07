import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

const plugins = [
  resolve({
    extensions: [".ts", ".js"],
    preferBuiltins: true,
  }),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    declaration: true,
    emitDeclarationOnly: false, // Ensure runtime + types are emitted
    rootDir: "./src",
    outDir: "./dist",
  }),
];

// 👉 **ESM Build (Minified)**
export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [...plugins, terser()],
    external: [],
    treeshake: {
      moduleSideEffects: false,
    },
  },
  // 👉 **Type Declarations Build (Unminified)**
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
