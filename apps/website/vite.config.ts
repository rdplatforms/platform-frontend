import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Only needed for a GitHub Pages *project page* (served under
  // /<repo-name>/, e.g. rdplatforms.github.io/printforge-3d-site/) — a
  // custom domain or a root-page deployment serves from '/' as normal.
  // Unset on Netlify/Vercel, where it's always '/'. See docs/deployment.md.
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
});
