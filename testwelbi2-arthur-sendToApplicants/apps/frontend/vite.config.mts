import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-vite-plugin'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false,
      routeFileModule: resolve(__dirname, 'src/routeTree.gen.ts'),
    }),
    react(),
    viteStaticCopy({
      targets: {
        'dist/assets': 'src/assets',
      },
    }),
  ],
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Define global constants
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
}) 