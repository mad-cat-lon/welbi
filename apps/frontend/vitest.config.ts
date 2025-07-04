import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
    reporter: ['text', 'lcov'],
    reportsDirectory: './coverage',
    },
  },
})