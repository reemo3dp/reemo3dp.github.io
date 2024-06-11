import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { globSync } from "glob";
import path, { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ compilerOptions: { customElement: true } })],
  base: "/assets/js/",
  build: {
    outDir: "../docs/assets/js",
    lib: {
      formats: ["es"],
      entry: globSync(resolve(__dirname, "src", "*.svelte")),
    }
  }
})
