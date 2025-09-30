

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@solana/wallet-adapter-react-ui/styles.css';

// Polyfill robusto para window.crypto usando crypto-browserify si no existe
if (typeof window !== 'undefined' && typeof window.crypto === 'undefined') {
  try {
    // Intenta requerir crypto-browserify dinámicamente
    // Solo funcionará si crypto-browserify está instalado
    // npm install crypto-browserify
    window.crypto = require('crypto-browserify');
  } catch (e) {
    window.crypto = {};
    // Opcional: muestra advertencia en consola
    console.warn('window.crypto no está disponible y crypto-browserify no está instalado. Algunas funciones pueden fallar.');
  }
}

// Polyfill para window.crypto en entornos donde no existe (previene error Crossmint)
if (typeof window !== 'undefined' && typeof window.crypto === 'undefined') {
  window.crypto = window.msCrypto || {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
