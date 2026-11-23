import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const lib = (p: string) => fileURLToPath(new URL(`../src/${p}`, import.meta.url));

// The demo runs on the library source in this repo, so it always shows the
// current DopeMap rather than whatever version was last published.
export default defineConfig({
  base: "/dope-map/",
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@johnhaup\/dope-map\/react$/, replacement: lib("react/index.ts") },
      { find: /^@johnhaup\/dope-map\/hash$/, replacement: lib("dopeHash.ts") },
      { find: /^@johnhaup\/dope-map$/, replacement: lib("index.ts") },
    ],
    // ../src imports react too; resolve it from here so there is one copy.
    dedupe: ["react", "react-dom"],
  },
  server: { port: 3456 },
});
