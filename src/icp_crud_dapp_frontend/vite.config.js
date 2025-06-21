import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

// Load environment variables from the root `.env` file
dotenv.config({ path: '../../.env' });

export default defineConfig({
  root: '.',
  base: './', // ✅ Important for correct asset paths when deployed on IC
  build: {
    outDir: 'dist', // ✅ Vite default; ensures `dfx.json` picks up the right folder
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // ✅ Needed for @dfinity/agent
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943', // ✅ Proxy IC local replica calls
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }), // ✅ Load CANISTER_ID env vars
    environment('all', { prefix: 'DFX_' }),       // ✅ Load DFX_ env vars
  ],
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(
          new URL('../declarations', import.meta.url) // ✅ Adjust path to declarations
        ),
      },
    ],
    dedupe: ['@dfinity/agent'], // ✅ Avoid bundling multiple copies
  },
});
