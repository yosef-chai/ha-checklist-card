import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// Read the version at build time so the console banner (see src/index.ts)
// always matches package.json without a second place to bump.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default defineConfig({
  define: {
    __CARD_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'Checklist Card',
      formats: ['es'],
      fileName: () => 'checklist-card.js'
    },
    rollupOptions: {
      output: {
        // The visual editor is pulled in via a dynamic import() in
        // getConfigElement(); disable code-splitting so it is inlined and the
        // whole card ships as a single checklist-card.js (what HACS expects).
        codeSplitting: false,
      },
    }
  }
});
