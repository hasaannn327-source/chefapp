import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      includeAssets: ['icon-192x192.png', 'icon-512x512.png'],
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
            // BURAYI DİKKATLİCE KONTROL ET:
            // Senin dosyanın adı 'icon-192x192.png' ise burası da aynısı olmalı.
            src: 'icon-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})


