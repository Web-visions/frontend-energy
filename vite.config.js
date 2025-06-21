import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'assert': 'assert',
      'http': 'stream-http',
      'https': 'https-browserify',
      'os': 'os-browserify/browser',
      'url': 'url',
      'buffer': 'buffer',
      'process': 'process/browser'
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          // To exclude specific polyfills, add them to this array.
          exclude: ['fs'],
        }),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        // You can add more esbuild plugins here if needed
      ],
    },
  },
})
