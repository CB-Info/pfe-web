import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './applications/css/index.css'
import { BrowserRouter } from 'react-router-dom';
import { DishFilterProvider } from './contexts/dishFilters.context.tsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DishFilterProvider>
        <App/>
      </DishFilterProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
