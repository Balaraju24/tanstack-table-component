import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TanstackTableComponent",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"], // make sure both get built
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-table"],
    },
  },
});
