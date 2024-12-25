import init, { hash_string } from "../rust_hash/pkg/rust_hash.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Ensure the WASM module is initialized before calling any function
 */
export async function ensureInitialized() {
  if (isInitialized) return;

  if (!initPromise) {
    const wasmPath = path.resolve(
      __dirname,
      "../rust_hash/pkg/rust_hash_bg.wasm"
    );
    const wasmBuffer = fs.readFileSync(wasmPath);

    initPromise = init(wasmBuffer)
      .then(() => {
        isInitialized = true;
        console.log("[DOPE-MAP] WASM Module Initialized");
      })
      .catch((err) => {
        console.error("[DOPE-MAP] WASM Initialization Failed:", err);
        throw err;
      });
  }

  await initPromise;
}

/**
 * Safe Hashing Function (Ensures Initialization First)
 */
export async function safeHashString(input: string): Promise<string> {
  await ensureInitialized(); // Guarantee WASM is ready
  return hash_string(input);
}
