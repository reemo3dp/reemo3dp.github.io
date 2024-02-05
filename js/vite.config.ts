import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ compilerOptions: { customElement: true } })],
  build: {
    outDir: "../docs/assets/js",
    lib: {
      formats: ["es"],
      entry: [
        resolve(__dirname, "./src/Counter.svelte"),
        resolve(__dirname, "./src/AnotherThing.svelte")
      ],
      fileName: (_, entryName) => {
        return `${entryName}.js`;
      },
    },
  }
})
