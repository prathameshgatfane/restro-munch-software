import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider } from './services/notifications/toastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';
import { startSyncEngine, stopSyncEngine } from './services/offline/syncEngine';

function App() {
  useEffect(() => {
    // Start the offline sync engine when app boots
    startSyncEngine();
    
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((reg) => {
            console.log('SW: Registered successfully with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('SW: Registration failed:', err);
          });
      });
    }

    return () => {
      // Clean up sync interval when app shuts down
      stopSyncEngine();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
