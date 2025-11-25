import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './lib/i18n';
import './index.css';
import { NotificationService } from './lib/services/notification-service';

// Initialize service worker for PWA
if ('serviceWorker' in navigator) {
  NotificationService.initServiceWorker().then((success) => {
    if (success) {
      console.log('PWA Service Worker initialized');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
