// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry'],
  },

  build: {
    rollupOptions: {
      external: ['pdfjs-dist'],
    },
  },

  server: {
    host: 'localhost',   // use 'localhost' on your machine
    port: 5173,          // number, not string
    strictPort: true,
  },
  preview: {
    host: 'localhost',
    port: 5173,
  }
})
