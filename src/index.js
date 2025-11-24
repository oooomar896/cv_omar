import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Register Service Worker for PWA and clean old cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Clean old browser cache before registering service worker
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          // Delete old caches
          if (cacheName.startsWith('cv-omar-') && 
              cacheName !== 'cv-omar-v2' && 
              cacheName !== 'cv-omar-runtime-v2') {
            console.log('Cleaning old cache:', cacheName);
            caches.delete(cacheName);
          }
        });
      });
    }

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, reload to activate
                console.log('New service worker available, reloading...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
