import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import macrosPlugin from 'vite-plugin-babel-macros'

export default defineConfig({
  plugins: [react(), macrosPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  },
})
