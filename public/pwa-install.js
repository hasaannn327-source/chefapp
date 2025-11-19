// PWA Installation Handler for Next.js
let deferredPrompt;
let installButton;

console.log('PWA Install script loaded');

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }
}

function initPWA() {
  console.log('Initializing PWA...');

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }

  // Create install button
  createInstallButton();
  installButton = document.getElementById('pwaInstallButton');

  // Hide initially
  if (installButton) {
    installButton.style.display = 'none';
  }

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired!');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  // Listen for successful install
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    hideInstallButton();
    deferredPrompt = null;
  });

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App running in standalone mode');
  }
}

function createInstallButton() {
  if (document.getElementById('pwaInstallButton')) {
    console.log('Install button already exists');
    return;
  }

  const button = document.createElement('button');
  button.id = 'pwaInstallButton';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Uygulamayı Yükle</span>
  `;

  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: none;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
    z-index: 999999;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-4px) scale(1.05)';
    button.style.boxShadow = '0 12px 32px rgba(255, 107, 107, 0.5)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.4)';
  });

  button.addEventListener('click', installApp);

  document.body.appendChild(button);
  console.log('Install button created');
}

function showInstallButton() {
  if (installButton) {
    installButton.style.display = 'flex';
    console.log('✅ Install button shown');
  }
}

function hideInstallButton() {
  if (installButton) {
    installButton.style.display = 'none';
    console.log('Install button hidden');
  }
}

async function installApp() {
  console.log('Install button clicked');
  
  if (!deferredPrompt) {
    console.log('No deferred prompt available');
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);

  deferredPrompt = null;
  hideInstallButton();
}
