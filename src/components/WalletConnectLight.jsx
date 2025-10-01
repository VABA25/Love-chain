import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletConnectLight = () => {
  const { publicKey, connect, select, wallets } = useWallet();
  const [nickname, setNickname] = useState('');
  const [userRegistered, setUserRegistered] = useState(false);
  const [likesReceived, setLikesReceived] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  // Solo 3 perfiles para reducir memoria
  const profiles = [
    { id: 1, name: "Ana", age: 25, emoji: "👩‍💻" },
    { id: 2, name: "Carlos", age: 28, emoji: "👨‍💻" },
    { id: 3, name: "Sofia", age: 23, emoji: "👩‍🎨" }
  ];

  const handleRegisterUser = async () => {
    if (!nickname.trim() || !publicKey) {
      alert('Conecta wallet y escribe nickname');
      return;
    }
    
    setIsRegistering(true);
    
    // Timeout más corto
    setTimeout(() => {
      setUserRegistered(true);
      setIsRegistering(false);
      alert(`🎉 ¡Bienvenido ${nickname}!`);
    }, 1000);
  };

  const handleLike = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
      
      // Probabilidad simple de match
      if (Math.random() > 0.5) {
        setMatches(prev => prev + 1);
        alert('¡MATCH! 💕');
      }
      
      setLikesReceived(prev => prev + 1);
    } else {
      alert('¡Has visto todos los perfiles!');
    }
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh',
      padding: '1rem',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        ❤️⛓️ LoveChain
      </h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        Blockchain Dating - Versión Light
      </p>

      {!publicKey ? (
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          margin: '0 auto',
          color: '#333'
        }}>
          <h3>🔗 Conectar Wallet</h3>
          <button
            onClick={async () => {
              try {
                const phantomWallet = wallets.find(w => 
                  w.adapter.name.includes('Phantom')
                );
                if (phantomWallet) {
                  await select(phantomWallet.adapter.name);
                  setTimeout(() => connect(), 500);
                } else {
                  alert('Instala Phantom Wallet');
                }
              } catch (error) {
                alert('Error: ' + error.message);
              }
            }}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            👻 Conectar Phantom
          </button>
        </div>
      ) : !userRegistered ? (
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          margin: '0 auto',
          color: '#333'
        }}>
          <h3>📝 Crear Perfil</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Wallet: {publicKey.toString().slice(0, 8)}...
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
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleRegisterUser}
            disabled={isRegistering}
            style={{
              background: isRegistering ? '#ccc' : '#e91e63',
              color: 'white',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: isRegistering ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {isRegistering ? '⏳ Creando...' : '🚀 Crear Perfil'}
          </button>
        </div>
      ) : (
        <div>
          {/* Stats simples */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '10px',
              minWidth: '80px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{likesReceived}</div>
              <div style={{ fontSize: '0.8rem' }}>Likes</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '10px',
              minWidth: '80px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{matches}</div>
              <div style={{ fontSize: '0.8rem' }}>Matches</div>
            </div>
          </div>

          {/* Perfil actual */}
          {currentProfile && (
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '2rem',
              borderRadius: '15px',
              maxWidth: '350px',
              margin: '0 auto',
              color: '#333'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {currentProfile.emoji}
              </div>
              <h3>{currentProfile.name}, {currentProfile.age}</h3>
              <button
                onClick={handleLike}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                💖 Like
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectLight;