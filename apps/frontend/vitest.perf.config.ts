import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.perf.test.{ts,tsx}', '**/*.perf.spec.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/setup.*'
      ]
    },
    testTimeout: 30000, // 30 seconds for performance tests
    hookTimeout: 10000, // 10 seconds for hooks
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/performance-test-results.json'
    }
  },
  define: {
    __DEV__: false, // Disable dev mode for performance testing
    __TEST__: true
  },
  build: {
    target: 'esnext',
    minify: true,
    sourcemap: false
  }
}); 