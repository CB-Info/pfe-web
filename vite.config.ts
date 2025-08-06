import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import macrosPlugin from 'vite-plugin-babel-macros'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), macrosPlugin(), visualizer({ open: true, filename: 'bundle-stats.html' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  },
})
