import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Register Service Worker for PWA and clean old cache
if ('serviceWorker' in navigator) {
  // Clean all old caches and service workers immediately
  const cleanOldCache = async () => {
    try {
      // Unregister all service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        console.log('Unregistering old service worker:', registration.scope);
        await registration.unregister();
      }

      // Delete all old caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('Found caches:', cacheNames);
        
        const deletePromises = cacheNames.map((cacheName) => {
          // Delete all old caches (keep only v3)
          if (cacheName !== 'cv-omar-v3' && cacheName !== 'cv-omar-runtime-v3') {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        });
        
        await Promise.all(deletePromises);
        console.log('Old caches cleaned successfully');
      }
    } catch (error) {
      console.error('Error cleaning old cache:', error);
    }
  };

  window.addEventListener('load', async () => {
    // Clean old cache first
    await cleanOldCache();

    // Register new service worker with cache busting
    try {
      const registration = await navigator.serviceWorker.register('/sw.js?' + Date.now(), {
        updateViaCache: 'none'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Force update check
      await registration.update();
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New service worker available, reload to activate
                console.log('New service worker available, reloading...');
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else {
                console.log('Service worker installed for the first time');
              }
            }
          });
        }
      });

      // Listen for controller change (when new SW takes control)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed, reloading...');
        window.location.reload();
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
