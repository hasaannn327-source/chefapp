import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service Worker'ı otomatik kaydet
      registerType: 'autoUpdate',
      // HTML içine gerekli scriptleri otomatik ekle
      injectRegister: 'auto',
      // Geliştirme modunda da PWA'yı test edebilmek için (Normalde sadece build'de çalışır)
      devOptions: {
        enabled: true
      },
      // Önbelleğe alınacak dosyalar
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Al Bunu Pişir',
        short_name: 'AlBunuPisir',
        description: 'Yapay zeka destekli mutfak asistanınız',
        theme_color: '#ea580c',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Dosya adlarına dikkat!
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})




