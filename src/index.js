import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Register Service Worker for PWA and clean old cache
// Disable Service Worker and Clean Cache to ensure fresh updates
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Unregistered Service Worker:', registration.scope);
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => {
            console.log('Deleting cache:', name);
            return caches.delete(name);
          })
        );
      }
      console.log('Cleanup complete. Service Worker disabled.');
    } catch (error) {
      console.error('Error cleaning up Service Worker:', error);
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
