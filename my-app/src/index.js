import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';
import { BrowserRouter } from 'react-router-dom';

// Create root once
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* BrowserRouter should wrap everything that needs routing */}
    <BrowserRouter>
      {/* StoreProvider should wrap components that need access to the store */}
      <StoreProvider>
        {/* HelmetProvider for head tag management */}
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Optional performance monitoring
reportWebVitals();