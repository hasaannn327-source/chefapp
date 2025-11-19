import { defineConfig } from 'vite'

export default defineConfig({
  // Build ayarları
  build: {
    outDir: 'dist',
  },
  // Sunucu ayarları
  server: {
    host: true
  }
})
