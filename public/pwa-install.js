// PWA Installation Handler
let deferredPrompt;
let installButton;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

function initPWA() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }

  // Create install button dynamically if it doesn't exist
  createInstallButton();

  // Get reference to install button
  installButton = document.getElementById('installButton');

  // Hide button initially
  if (installButton) {
    installButton.style.display = 'none';
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button
    showInstallButton();
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    hideInstallButton();
    deferredPrompt = null;
  });

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App is running in standalone mode');
    hideInstallButton();
  }
}

function createInstallButton() {
  // Check if button already exists
  if (document.getElementById('installButton')) {
    return;
  }

  // Create button element
  const button = document.createElement('button');
  button.id = 'installButton';
  button.className = 'pwa-install-button';
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
    padding: 12px 24px;
    background: #FF6B6B;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: none;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    z-index: 9999;
    transition: all 0.3s ease;
  `;

  button.onmouseover = () => {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.4)';
  };

  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
  };

  button.onclick = installApp;

  document.body.appendChild(button);
}

function showInstallButton() {
  if (installButton) {
    installButton.style.display = 'flex';
    console.log('Install button shown');
  }
}

function hideInstallButton() {
  if (installButton) {
    installButton.style.display = 'none';
    console.log('Install button hidden');
  }
}

async function installApp() {
  if (!deferredPrompt) {
    console.log('No deferred prompt available');
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }

  // Clear the deferred prompt
  deferredPrompt = null;
  hideInstallButton();
}

// iOS specific handling
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

// Show iOS install instructions
if (isIOS() && !isInStandaloneMode()) {
  console.log('iOS detected, showing custom install prompt');
  // You can create a custom modal here for iOS users
  // explaining how to add to home screen
}
