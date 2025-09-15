import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "TanStackTableComponent",
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-table", "clsx"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@tanstack/react-table": "TanstackReactTable",
          clsx: "clsx",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
