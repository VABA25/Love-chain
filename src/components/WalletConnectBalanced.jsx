import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletConnectBalanced = () => {
  console.log('🔍 WalletConnectBalanced se está renderizando');
  const { publicKey, connect, select, wallets } = useWallet();
  const [nickname, setNickname] = useState('');
  const [userRegistered, setUserRegistered] = useState(false);
  const [likesReceived, setLikesReceived] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showMatchPopup, setShowMatchPopup] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Solo un ref para chat - optimizado
  const chatTimeoutRef = useRef(null);

  // Perfiles optimizados - solo 4 en lugar de 5
  const profiles = [
    {
      id: 1,
      name: "Ana",
      age: 25,
      bio: "Crypto enthusiast 💰 | NFT artist 🎨 | Looking for blockchain romance ⛓️💕",
      emoji: "👩‍💻",
      location: "San Francisco"
    },
    {
      id: 2,
      name: "Carlos",
      age: 28,
      bio: "Solana developer 🚀 | Building Web3 💻 | Swipe right for smart contracts 📝",
      emoji: "👨‍💻",
      location: "Miami"
    },
    {
      id: 3,
      name: "Sofia",
      age: 23,
      bio: "Metaverse explorer 🌐 | NFT collector 🖼️ | Let's build love on-chain 💖",
      emoji: "👩‍🎨",
      location: "Barcelona"
    },
    {
      id: 4,
      name: "Diego",
      age: 30,
      bio: "DeFi whale 🐋 | Yield farming expert 🌾 | Seeking my hodling partner 💎🙌",
      emoji: "👨‍💼",
      location: "Mexico City"
    }
  ];

  // Cleanup optimizado
  useEffect(() => {
    return () => {
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    };
  }, []);

  const handleRegisterUser = async () => {
    if (!nickname.trim()) {
      alert('Por favor ingresa un nickname');
      return;
    }
    
    if (!publicKey) {
      alert('Conecta tu wallet primero');
      return;
    }
    
    setIsRegistering(true);
    
    // Timeout rápido
    setTimeout(() => {
      setUserRegistered(true);
      setIsRegistering(false);
      alert(`🎉 ¡Bienvenido ${nickname}! Tu perfil SBT ha sido creado en Solana.`);
    }, 1200);
  };

  const startChat = (profile) => {
    setChatPartner(profile);
    setShowChat(true);
    setShowMatchPopup(null);
    setMessages([
      { sender: 'system', text: `🎉 ¡Conectado con ${profile.name}! Dile hola` },
      { sender: profile.name, text: `¡Hola ${nickname}! 😊 Me encanta que hayamos hecho match` }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'me', text: newMessage }]);
    setNewMessage('');
    
    // Respuesta automática optimizada
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    chatTimeoutRef.current = setTimeout(() => {
      const responses = [
        "¡Me encanta tu perfil! 😍",
        "¿Qué tal si nos tomamos un café? ☕",
        "También me encanta el mundo crypto 💰",
        "¿Cuál es tu proyecto DeFi favorito?",
        "Me parece súper interesante tu trabajo con NFTs 🎨"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { sender: chatPartner.name, text: randomResponse }]);
    }, 800);
  };

  const closeChat = () => {
    setShowChat(false);
    setChatPartner(null);
    setMessages([]);
  };

  const handleSwipe = (direction) => {
    const currentProfile = profiles[currentProfileIndex];
    
    if (direction === 'right') {
      // Incrementar likes recibidos
      setLikesReceived(prev => prev + 1);
      
      // 65% probabilidad de match
      if (Math.random() > 0.35) {
        setMatches(prev => [...prev, currentProfile]);
        setShowMatchPopup(currentProfile);
      }
    }
    
    // Avanzar perfil
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Reiniciar si llegamos al final
      setCurrentProfileIndex(0);
      alert('🎉 ¡Has visto todos los perfiles! Empezando de nuevo...');
    }
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh',
      padding: '1rem',
      background: `
        linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)),
        linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)
      `,
      backgroundSize: '400% 400%',
      animation: 'gradientMove 12s ease infinite',
      color: 'white',
      position: 'relative'
    }}>
      {/* Match Popup - Optimizado */}
      {showMatchPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            padding: '2.5rem',
            borderRadius: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥💕🔥</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>¡IT'S A MATCH!</h2>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{showMatchPopup.emoji}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{showMatchPopup.name}</h3>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>¡Se gustaron mutuamente!</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => startChat(showMatchPopup)}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💬 Chatear
              </button>
              <button 
                onClick={() => setShowMatchPopup(null)}
                style={{
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                ⏰ Más tarde
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header con logo integrado */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <img
          src={require('../assets/logo.png')}
          alt="LoveChain Logo"
          style={{
            height: '60px',
            width: '60px',
            objectFit: 'contain',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            padding: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          onError={e => { 
            e.target.style.display = 'none';
          }}
        />
        <h1 style={{ fontSize: '2.5rem', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          ❤️⛓️ LoveChain
        </h1>
      </div>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        Swipe to Find Your Blockchain Soulmate
      </p>

      {!publicKey ? (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          margin: '0 auto',
          color: '#333',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>🔗 Conectar Wallet</h3>
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
                  alert('⚠️ Phantom Wallet no detectado. Instálalo desde phantom.app');
                }
              } catch (error) {
                alert('Error: ' + error.message);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            👻 Conectar Phantom
          </button>
        </div>
      ) : !userRegistered ? (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          margin: '0 auto',
          color: '#333',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>📝 Crear Perfil SBT</h3>
          <div style={{ 
            background: '#e8f5e8', 
            padding: '0.8rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            🔗 <strong>Wallet:</strong> {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </div>
          <input
            type="text"
            placeholder="Tu nickname único"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '2px solid #e1bee7',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleRegisterUser()}
          />
          <button
            onClick={handleRegisterUser}
            disabled={isRegistering || !nickname.trim()}
            style={{
              background: isRegistering ? '#ccc' : 'linear-gradient(135deg, #e91e63, #ad1457)',
              color: 'white',
              border: 'none',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: isRegistering ? 'not-allowed' : 'pointer',
              width: '100%',
              fontWeight: 'bold'
            }}
          >
            {isRegistering ? '⏳ Creando perfil...' : '🚀 Crear Perfil SBT'}
          </button>
        </div>
      ) : (
        <div>
          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '12px',
              minWidth: '100px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{likesReceived}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Likes Received</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '12px',
              minWidth: '100px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{matches.length}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Matches</div>
            </div>
          </div>

          {/* Perfil actual */}
          <div 
            className="fade-in-up"
            style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '350px',
              margin: '0 auto 2rem auto',
              color: '#333',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {currentProfile.emoji}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>
              {currentProfile.name}, {currentProfile.age}
            </h3>
            <p style={{ 
              fontSize: '0.9rem', 
              lineHeight: 1.4,
              marginBottom: '1rem',
              color: '#666'
            }}>
              {currentProfile.bio}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>
              📍 {currentProfile.location}
            </div>
            
            {/* Botones de acción */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <button
                onClick={() => handleSwipe('left')}
                style={{
                  background: 'linear-gradient(135deg, #ff5722, #d32f2f)',
                  border: 'none',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
                }}
              >
                ❌
              </button>
              <button
                onClick={() => handleSwipe('right')}
                style={{
                  background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                  border: 'none',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                }}
              >
                💖
              </button>
            </div>
          </div>

          {/* Matches */}
          {matches.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '1.5rem',
              borderRadius: '15px',
              maxWidth: '400px',
              margin: '0 auto',
              color: '#333'
            }}>
              <h4 style={{ marginBottom: '1rem' }}>💕 Tus Matches ({matches.length})</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '1rem' 
              }}>
                {matches.map((match, index) => (
                  <div 
                    key={index}
                    onClick={() => startChat(match)}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      padding: '0.8rem',
                      borderRadius: '10px',
                      background: '#f8f8f8',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {match.emoji}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      color: '#e91e63'
                    }}>
                      {match.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Interface */}
      {showChat && chatPartner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'white',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{chatPartner.emoji}</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{chatPartner.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{chatPartner.location}</div>
              </div>
            </div>
            <button 
              onClick={closeChat}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              ✕ Cerrar
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            background: '#f5f5f5'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  background: msg.sender === 'me' ? '#ff6b6b' : msg.sender === 'system' ? '#4CAF50' : 'white',
                  color: msg.sender === 'me' || msg.sender === 'system' ? 'white' : '#333',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  fontSize: '0.9rem'
                }}>
                  {msg.sender !== 'me' && msg.sender !== 'system' && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                      {msg.sender}
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{
            padding: '1rem',
            background: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Escribe a ${chatPartner.name}...`}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '25px',
                border: '2px solid #eee',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              📤
            </button>
          </div>
        </div>
      )}

      {/* Rectángulo de información inferior - EL QUE SE PERDIÓ */}
      {userRegistered && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.95)',
          padding: '1rem 2rem',
          borderRadius: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          color: '#333',
          fontSize: '0.9rem',
          maxWidth: '90%',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>👤</span>
              <span><strong>{nickname}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🔗</span>
              <span>{publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>📊</span>
              <span>{likesReceived} likes • {matches.length} matches</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⛓️</span>
              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Solana Devnet</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WalletConnectBalanced;