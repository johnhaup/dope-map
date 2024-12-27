import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const plugins = [
  resolve({
    extensions: [".ts", ".js"],
    preferBuiltins: true,
  }),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    emitDeclarationOnly: false,
    rootDir: "./src",
  }),
  terser(),
];

export default [
  // ESM Build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins,
    treeshake: {
      moduleSideEffects: false, // Ensure tree-shaking doesn't remove modules with side effects
    },
  },

  // CommonJS Build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins,
    treeshake: {
      moduleSideEffects: false, // Ensure tree-shaking doesn't remove modules with side effects
    },
  },
];
