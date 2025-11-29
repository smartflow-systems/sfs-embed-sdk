import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Vite configuration for building the embeddable SDK
 * Creates a standalone bundle: sfs-embed.min.js
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'client/src/sdk/index.tsx'),
      name: 'SFSEmbed',
      formats: ['iife'], // Immediately Invoked Function Expression for browser
      fileName: () => 'sfs-embed.min.js',
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      // For now, we'll bundle everything for simplicity
      output: {
        // Ensure all code is in a single file
        inlineDynamicImports: true,
        // Add banner with version info
        banner: '/* SFS Embed SDK v1.0.0 | https://sfs.dev */',
        // Use named exports to avoid the warning
        exports: 'named',
      },
    },
    outDir: 'dist/sdk',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
    },
  },
  // Ensure CSS is also bundled
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
