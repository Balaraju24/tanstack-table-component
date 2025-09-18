import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "TanStackTableComponent",
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@tanstack/react-table",
        "@radix-ui/react-select",
        "@radix-ui/react-slot",
        "clsx",
        "class-variance-authority",
        "lucide-react",
        "tailwind-merge",
        "tslib",
        // Externalize ShadCN components
        "@/components/ui/skeleton",
        "@/components/ui/table",
        "@/components/ui/input",
        "@/components/ui/select",
        "@/components/ui/pagination",
        "@/lib/utils",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@tanstack/react-table": "TanStackReactTable",
          "@radix-ui/react-select": "RadixReactSelect",
          "@radix-ui/react-slot": "RadixReactSlot",
          clsx: "clsx",
          "class-variance-authority": "cva",
          "lucide-react": "LucideReact",
          "tailwind-merge": "TailwindMerge",
          tslib: "tslib",
          "@/components/ui/skeleton": "Skeleton",
          "@/components/ui/table": "Table",
          "@/components/ui/input": "Input",
          "@/components/ui/select": "Select",
          "@/components/ui/pagination": "Pagination",
          "@/lib/utils": "utils",
        },
      },
    },
    sourcemap: true,
  },
});
