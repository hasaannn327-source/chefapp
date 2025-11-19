import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// PWA Kaydını Buradan Çağırıyoruz
import { registerSW } from 'virtual:pwa-register'

// Service Worker'ı Kaydet
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Yeni içerik mevcut. Yenilemek ister misiniz?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Uygulama çevrimdışı kullanıma hazır!");
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


