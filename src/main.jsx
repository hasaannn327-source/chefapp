import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Eğer css dosyanın adı farklıysa (örn: App.css) burayı düzelt

// virtual:pwa-register SATIRINI SİLDİK. ARTIK GEREK YOK.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
