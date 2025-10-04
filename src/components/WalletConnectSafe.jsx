import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletConnectSafe = () => {
  const { publicKey, connect, select, wallets } = useWallet();
  const [nickname, setNickname] = useState('');

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      background: '#f0f0f0',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ color: '#333' }}>🛡️ LoveChain - Modo Seguro</h1>
      
      {!publicKey ? (
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '10px',
          maxWidth: '400px',
          margin: '2rem auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Conectar Wallet</h3>
          <button
            onClick={async () => {
              try {
                const phantomWallet = wallets.find(w => 
                  w.adapter.name.includes('Phantom')
                );
                if (phantomWallet) {
                  await select(phantomWallet.adapter.name);
                  setTimeout(() => connect(), 300);
                }
              } catch (error) {
                console.error('Error:', error);
              }
            }}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            👻 Conectar Phantom
          </button>
        </div>
      ) : (
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          maxWidth: '400px',
          margin: '2rem auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>✅ Wallet Conectada</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </p>
          
          <input
            type="text"
            placeholder="Tu nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
          
          <div style={{ marginTop: '2rem' }}>
            <h4>✨ Estado del Proyecto:</h4>
            <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
              <li>✅ Wallet funciona</li>
              <li>✅ React carga</li>
              <li>✅ Sin memory leaks</li>
              <li>🔧 Listo para desarrollo</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectSafe;