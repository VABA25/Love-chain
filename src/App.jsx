import React from 'react';
import WalletConnectBalanced from './components/WalletConnectBalanced';
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

            <CrossmintProvider apiKey="ck_production_5eoa4PVqnVX41TvNZS86VTumcz1aC5nrWQyhCiU2Cfk6rEYzHyjKaPqbs4fFFP3SXDhZuUudt1pjxV5MWVYExGRex2CJaZJY9coZrEaUmbZepic7jEySKJu4UaZ1bjNyB1Xtn3MrFvs3ZZ4PCtKDTxNxSLF7woj8cq3EKwk2pM2HHoaPw1M5SERiqprs6DeNMqK32EGihP8x211c2nGcqZkx">
              <WalletConnectBalanced />
            </CrossmintProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
}

export default App;

