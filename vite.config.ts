import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'Checklist Card',
      formats: ['es'],
      fileName: () => 'checklist-card.js'
    },
    rollupOptions: {
    }
  }
});