import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletConnectEnhanced = () => {
  const { publicKey, connect, select, wallets } = useWallet();
  const [nickname, setNickname] = useState('');
  const [userRegistered, setUserRegistered] = useState(false);
  const [likesReceived, setLikesReceived] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [blockchainStatus, setBlockchainStatus] = useState('disconnected');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showMatchPopup, setShowMatchPopup] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Refs para limpiar timeouts
  const chatResponseTimeoutRef = useRef(null);
  const swipeTimeoutRef = useRef(null);
  const registrationTimeoutRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  // Perfiles demo memoizados para mejor rendimiento
  const demoProfiles = useMemo(() => [
    {
      id: 1,
      name: "Ana",
      age: 25,
      bio: "Crypto enthusiast 💰 | NFT artist 🎨 | Looking for blockchain romance ⛓️💕",
      image: "👩‍💻",
      location: "San Francisco",
      interests: ["DeFi", "Art", "Travel"]
    },
    {
      id: 2,
      name: "Carlos",
      age: 28,
      bio: "Solana developer 🚀 | Building the future of Web3 💻 | Swipe right for smart contracts 📝",
      image: "👨‍💻",
      location: "Miami",
      interests: ["Blockchain", "Gaming", "Music"]
    },
    {
      id: 3,
      name: "Sofia",
      age: 23,
      bio: "Metaverse explorer 🌐 | Collecting NFTs since 2021 🖼️ | Let's build love on-chain 💖",
      image: "👩‍🎨",
      location: "Barcelona",
      interests: ["Metaverse", "Fashion", "Photography"]
    },
    {
      id: 4,
      name: "Diego",
      age: 30,
      bio: "DeFi whale 🐋 | Yield farming expert 🌾 | Seeking my hodling partner 💎🙌",
      image: "👨‍💼",
      location: "Mexico City",
      interests: ["Trading", "Fitness", "Cooking"]
    },
    {
      id: 5,
      name: "Luna",
      age: 26,
      bio: "DAO governance queen 👑 | Community builder 🏗️ | Ready to vote YES on love 💕",
      image: "👩‍💼",
      location: "Austin",
      interests: ["Governance", "Cooking", "Fitness"]
    }
  ], []);

  // Monitorear estado de conexión blockchain
  useEffect(() => {
    if (publicKey) {
      setBlockchainStatus('connected');
    } else {
      setBlockchainStatus('disconnected');
    }
  }, [publicKey]);

  // Cleanup timeouts al desmontar componente
  useEffect(() => {
    return () => {
      if (chatResponseTimeoutRef.current) clearTimeout(chatResponseTimeoutRef.current);
      if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
      if (registrationTimeoutRef.current) clearTimeout(registrationTimeoutRef.current);
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
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
    
    try {
      // Simulación mejorada para demo
      registrationTimeoutRef.current = setTimeout(() => {
        setUserRegistered(true);
        setIsRegistering(false);
        setBlockchainStatus('connected');
        alert(`🎉 ¡Bienvenido ${nickname}! Tu perfil SBT ha sido creado en Solana.\\n\\n✨ Ahora puedes empezar a hacer swipe y encontrar matches!`);
      }, 1500);
      
    } catch (error) {
      console.error('Error registrando usuario:', error);
      setIsRegistering(false);
    }
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
    
    // Respuesta automática para demo
    if (chatResponseTimeoutRef.current) clearTimeout(chatResponseTimeoutRef.current);
    chatResponseTimeoutRef.current = setTimeout(() => {
      const responses = [
        "¡Me encanta tu perfil! 😍",
        "¿Qué tal si nos tomamos un café? ☕",
        "También me encanta el mundo crypto 💰",
        "¿Cuál es tu proyecto DeFi favorito?",
        "Me parece súper interesante tu trabajo con NFTs 🎨"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { sender: chatPartner.name, text: randomResponse }]);
    }, 1000);
  };

  const closeChat = () => {
    setShowChat(false);
    setChatPartner(null);
    setMessages([]);
  };

  const handleSwipe = async (direction) => {
    if (currentProfileIndex >= demoProfiles.length) {
      alert('🎉 ¡Has visto todos los perfiles disponibles! Vuelve más tarde para más matches.');
      return;
    }

    setSwipeDirection(direction);
    
    // Animación de swipe
    if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
    swipeTimeoutRef.current = setTimeout(() => {
      const currentProfile = demoProfiles[currentProfileIndex];
      
      if (direction === 'right') {
        // Simular que también recibes likes de otras personas
        const receiveLike = Math.random() > 0.3; // 70% probabilidad de recibir like
        if (receiveLike) {
          setLikesReceived(prev => prev + 1);
        }
        
        // Probabilidad de match más alta para hacer demo más interesante
        const matchChance = Math.random();
        if (matchChance > 0.4) { // 60% de probabilidad
          // ¡MATCH!
          setMatches(prev => [...prev, currentProfile]);
          setShowMatchPopup(currentProfile);
          
          // No ocultar automáticamente, que el usuario elija qué hacer
        }
      }
      
      // Avanzar al siguiente perfil
      setCurrentProfileIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const currentProfile = demoProfiles[currentProfileIndex];

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh',
      padding: '1rem', 
      position: 'relative',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Overlay optimizado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '0.5rem',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          fontWeight: 'bold'
        }}>❤️⛓️ LoveChain</h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.9)', 
          marginBottom: '2rem',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          fontSize: '1.2rem'
        }}>Swipe to Find Your Blockchain Soulmate</p>
      
      {/* Match Popup */}
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
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            padding: '3rem',
            borderRadius: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transform: 'scale(1.1)',
            animation: 'bounce 0.6s ease-out'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔥💕🔥</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡IT'S A MATCH!</h2>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{showMatchPopup.image}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{showMatchPopup.name}</h3>
            <p style={{ opacity: 0.9 }}>¡Se gustaron mutuamente!</p>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Match registrado en blockchain ⛓️
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => startChat(showMatchPopup)}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
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
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ⏰ Más tarde
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '2rem' }}>
        {!publicKey ? (
          <button
            onClick={async () => {
              try {
                console.log('🔌 Intentando conectar...');
                
                const phantomWallet = wallets.find(w => 
                  w.adapter.name === 'Phantom' || 
                  w.adapter.name.includes('Phantom')
                );
                
                if (phantomWallet) {
                  console.log('👻 Phantom encontrado:', phantomWallet.adapter.name);
                  await select(phantomWallet.adapter.name);
                  
                  connectionTimeoutRef.current = setTimeout(async () => {
                    try {
                      await connect();
                      console.log('✅ Conexión exitosa');
                    } catch (connectErr) {
                      console.error('❌ Error conectando:', connectErr);
                      alert('Error conectando con Phantom. ¿Tienes la extension instalada?');
                    }
                  }, 500);
                } else {
                  console.log('❌ Phantom no encontrado');
                  alert('⚠️ Phantom Wallet no detectado. Por favor instálalo desde phantom.app');
                }
              } catch (error) {
                console.error('💥 Error en conexión:', error);
                alert('Error: ' + error.message);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            👻 Conectar Phantom Wallet
          </button>
        ) : (
          <div style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
            <p style={{ fontSize: '1rem', margin: '0.5rem 0' }}>
              🔗 <strong>Wallet conectada:</strong> {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </p>
            <div style={{ 
              background: `${blockchainStatus === 'connected' ? '#4caf50' : blockchainStatus === 'connecting' ? '#ff9800' : '#f44336'}`,
              color: 'white',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              margin: '0.5rem auto',
              display: 'inline-block',
              textShadow: 'none'
            }}>
              {blockchainStatus === 'connected' && '✅ Blockchain conectado'}
              {blockchainStatus === 'connecting' && '⏳ Conectando...'}
              {blockchainStatus === 'disconnected' && '❌ Desconectado'}
            </div>
          </div>
        )}
      </div>

      {publicKey && !userRegistered && (
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          padding: '2rem', 
          borderRadius: '15px', 
          maxWidth: '400px', 
          margin: '0 auto 2rem auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>📝 Crea tu Perfil SBT</h3>
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
      )}

      {userRegistered && (
        <div>
          {/* Panel de estadísticas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem', 
            marginBottom: '2rem',
            maxWidth: '400px',
            margin: '0 auto 2rem auto'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              padding: '1rem', 
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', color: '#e91e63', fontWeight: 'bold', margin: 0 }}>
                {likesReceived}
              </div>
              <div style={{ color: '#880e4f', fontSize: '0.8rem' }}>Likes Received</div>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              padding: '1rem', 
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', color: '#4caf50', fontWeight: 'bold', margin: 0 }}>
                {matches.length}
              </div>
              <div style={{ color: '#2e7d32', fontSize: '0.8rem' }}>Matches</div>
            </div>
          </div>

          {/* Área de perfiles */}
          {currentProfileIndex < demoProfiles.length ? (
            <div style={{ 
              maxWidth: '350px', 
              margin: '0 auto',
              position: 'relative'
            }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transform: swipeDirection === 'left' ? 'translateX(-100px) rotate(-10deg)' : 
                            swipeDirection === 'right' ? 'translateX(100px) rotate(10deg)' : 'none',
                  transition: 'all 0.3s ease',
                  opacity: swipeDirection ? 0.5 : 1
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{currentProfile.image}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  {currentProfile.name}, {currentProfile.age}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem', 
                  lineHeight: 1.4,
                  marginBottom: '1rem'
                }}>
                  {currentProfile.bio}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
                  📍 {currentProfile.location}
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {currentProfile.interests.map((interest, index) => (
                    <span key={index} style={{
                      background: '#f0f0f0',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.7rem',
                      color: '#555'
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Botones de acción */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '2rem', 
                marginTop: '1.5rem' 
              }}>
                <button
                  onClick={() => handleSwipe('left')}
                  disabled={swipeDirection !== null}
                  style={{
                    background: 'linear-gradient(135deg, #ff5722, #d32f2f)',
                    border: 'none',
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '1.5rem',
                    cursor: swipeDirection ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => !swipeDirection && (e.target.style.transform = 'scale(1.1)')}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ❌
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  disabled={swipeDirection !== null}
                  style={{
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                    border: 'none',
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '1.5rem',
                    cursor: swipeDirection ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => !swipeDirection && (e.target.style.transform = 'scale(1.1)')}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  💖
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              padding: '2rem', 
              borderRadius: '15px', 
              maxWidth: '400px', 
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>¡Perfiles completados!</h3>
              <p style={{ color: '#666' }}>
                Has visto todos los perfiles disponibles. ¡Vuelve más tarde para más matches!
              </p>
            </div>
          )}

          {/* Sección de matches */}
          {matches.length > 0 && (
            <div style={{ 
              marginTop: '2rem',
              background: 'rgba(255,255,255,0.9)',
              padding: '1.5rem',
              borderRadius: '15px',
              maxWidth: '400px',
              margin: '2rem auto 0 auto'
            }}>
              <h4 style={{ color: '#333', marginBottom: '1rem' }}>💕 Tus Matches</h4>
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
                      padding: '0.5rem',
                      borderRadius: '10px',
                      transition: 'background 0.2s',
                      ':hover': { background: '#f0f0f0' }
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {match.image}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      color: '#f57f17'
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
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{chatPartner.image}</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{chatPartner.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Conectado • {chatPartner.location}</div>
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

          {/* Messages Area */}
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
              placeholder={`Escribe un mensaje a ${chatPartner.name}...`}
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
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              📤
            </button>
          </div>
        </div>
      )}
      </div> {/* Cierre del contenido principal */}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1.1);
          }
          40% {
            transform: translateY(-10px) scale(1.15);
          }
          60% {
            transform: translateY(-5px) scale(1.12);
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default WalletConnectEnhanced;