//vite.config.ts

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
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@tanstack/react-table",
        "clsx",
        "@radix-ui/react-select",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "lucide-react",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@tanstack/react-table": "TanstackReactTable",
          clsx: "clsx",
          "@radix-ui/react-select": "RadixSelect",
          "@radix-ui/react-slot": "RadixSlot",
          "class-variance-authority": "ClassVarianceAuthority",
          "lucide-react": "LucideReact",
          "tailwind-merge": "TailwindMerge",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
