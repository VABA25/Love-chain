import React from 'react';
import WalletConnect from './components/WalletConnect';
import ErrorBoundary from './components/ErrorBoundary';
import { CrossmintProvider } from '@crossmint/client-sdk-react-ui';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import logo from './assets/logo.png';

const endpoint = 'https://api.devnet.solana.com';
const wallets = [
  new PhantomWalletAdapter(),      // #1 - Mejor para development y demo
  new SolflareWalletAdapter(),     // #2 - Backup confiable
];

// NOTA DE SEGURIDAD:
// - Origen autorizado para CrossmintProvider: https://www.tudominio.com
//   (agrega http://localhost:3000 si desarrollas localmente)
// - JWT habilitado: todas las solicitudes a la API requieren un JWT válido
// - Permisos (scopes) activados: wallets, transacciones, firmas, NFTs, saldo, fondos, credenciales, pagos, usuarios

// La antigua API KEY (terminada en J4un) ha sido eliminada. Solo se usa la nueva clave de producción.

function App() {
  return (
    <ErrorBoundary>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {/* Encabezado con logo y nombre */}
            <header style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              margin: '2rem 0'
            }}>
              <img
                src={logo}
                alt="Love Chain Logo"
                style={{ height: '60px', objectFit: 'contain', background: 'white', borderRadius: '12px', padding: '4px' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <h1 style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '2rem', color: '#e91e63', margin: 0 }}>
                Love Chain
              </h1>
            </header>
            <CrossmintProvider apiKey="ck_production_5eoa4PVqnVX41TvNZS86VTumcz1aC5nrWQyhCiU2Cfk6rEYzHyjKaPqbs4fFFP3SXDhZuUudt1pjxV5MWVYExGRex2CJaZJY9coZrEaUmbZepic7jEySKJu4UaZ1bjNyB1Xtn3MrFvs3ZZ4PCtKDTxNxSLF7woj8cq3EKwk2pM2HHoaPw1M5SERiqprs6DeNMqK32EGihP8x211c2nGcqZkx">
              <WalletConnect />
            </CrossmintProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
}

export default App;

