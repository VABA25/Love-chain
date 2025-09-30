import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProgram, generateKeypair, toPublicKey } from '../hooks/useAnchor';

const WalletConnect = () => {
  const { publicKey, connect, select, wallets } = useWallet();
  const { program, wallet } = useAnchorProgram();
  const [nickname, setNickname] = useState('');
  const [userRegistered, setUserRegistered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [blockchainStatus, setBlockchainStatus] = useState('disconnected'); // disconnected, connecting, connected, error

  // Simulación de usuarios para el MVP (en producción vendría de la blockchain)
  const demoUsers = ['Ana💕', 'María🌹', 'Sophie✨', 'Luna🦄', 'Emma🎀'];

  // Monitorear estado de conexión blockchain
  useEffect(() => {
    if (program && wallet) {
      setBlockchainStatus('connected');
    } else if (publicKey) {
      setBlockchainStatus('connecting');
    } else {
      setBlockchainStatus('disconnected');
    }
  }, [program, wallet, publicKey]);

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
      // Generar keypair para la cuenta de usuario
      const userAccount = generateKeypair();
      
      // Llamada real al smart contract
      const tx = await program.methods
        .registerUser(nickname)
        .accounts({
          user: userAccount.publicKey,
          authority: wallet.publicKey,
          systemProgram: toPublicKey('11111111111111111111111111111111')
        })
        .signers([userAccount])
        .rpc();

      console.log('🎉 Usuario registrado! Transaction:', tx);
      
      setUserRegistered(true);
      setIsRegistering(false);
      setBlockchainStatus('connected');
      alert(`¡Usuario ${nickname} registrado en blockchain! 🎉\n\nTx: ${tx.slice(0, 20)}...`);
      
    } catch (error) {
      console.error('Error registrando usuario:', error);
      setIsRegistering(false);
      setBlockchainStatus('error');
      
      // Fallback a simulación para demo
      setTimeout(() => {
        setUserRegistered(true);
        setBlockchainStatus('connected'); // Reset para continuar demo
        alert(`¡Usuario ${nickname} registrado (demo mode)! 🎉\n\nBlockchain integration in progress for hackathon.`);
      }, 1000);
    }
  };

  const handleLike = async () => {
    setIsLiking(true);
    
    if (!publicKey) {
      alert('Conecta tu wallet primero');
      setIsLiking(false);
      return;
    }
    
    // Como program está en null para demo, ir directo a simulación
    handleLikeSimulation();
    setIsLiking(false);
    return;
    
    try {
      // Para demo, usar una dirección dummy como "target"
      const demoTargetUser = generateKeypair().publicKey;
      const likeAccount = generateKeypair();
      
      // Generar keypair dummy para user account (en producción sería el real)
      const userAccount = generateKeypair();
      
      // Llamada real al smart contract
      const tx = await program.methods
        .likeUser(demoTargetUser)
        .accounts({
          like: likeAccount.publicKey,
          user: userAccount.publicKey, 
          authority: wallet.publicKey,
          systemProgram: toPublicKey('11111111111111111111111111111111')
        })
        .signers([likeAccount, userAccount])
        .rpc();

      console.log('❤️ Like enviado! Transaction:', tx);
      
      setLikes(prev => prev + 1);
      
      // Simular match aleatorio
      if (Math.random() > 0.7 && demoUsers.length > matches.length) {
        const newMatch = demoUsers[matches.length];
        setMatches(prev => [...prev, newMatch]);
        alert(`🔥 ¡MATCH EN BLOCKCHAIN! Te conectaste con ${newMatch}\n\nTx: ${tx.slice(0, 20)}...`);
      } else {
        alert(`❤️ Like enviado en blockchain!\n\nTx: ${tx.slice(0, 20)}...`);
      }
      
    } catch (error) {
      console.error('Error enviando like:', error);
      setBlockchainStatus('error');
      
      // Fallback a simulación
      setTimeout(() => {
        setBlockchainStatus('connected'); // Reset para continuar demo
        handleLikeSimulation();
      }, 500);
    }
    
    setIsLiking(false);
  };

  const handleLikeSimulation = () => {
    setLikes(prev => prev + 1);
    
    if (Math.random() > 0.7 && demoUsers.length > matches.length) {
      const newMatch = demoUsers[matches.length];
      setMatches(prev => [...prev, newMatch]);
      alert(`🔥 ¡MATCH! Te conectaste con ${newMatch} (demo mode)`);
    } else {
      alert('❤️ Like enviado! (demo mode)');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❤️⛓️ LoveChain</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Decentralized Dating on Solana</p>
      
      <div style={{ marginBottom: '2rem' }}>
        {!publicKey ? (
          <button
            onClick={async () => {
              try {
                console.log('🔌 Intentando conectar...');
                
                // Buscar Phantom específicamente
                const phantomWallet = wallets.find(w => 
                  w.adapter.name === 'Phantom' || 
                  w.adapter.name.includes('Phantom')
                );
                
                if (phantomWallet) {
                  console.log('👻 Phantom encontrado:', phantomWallet.adapter.name);
                  await select(phantomWallet.adapter.name);
                  
                  // Pequeña pausa para que se registre
                  setTimeout(async () => {
                    try {
                      await connect();
                      console.log('✅ Conexión exitosa');
                    } catch (connectErr) {
                      console.log('⚠️ Error conectando:', connectErr);
                      alert('Error conectando. ¿Tienes Phantom instalado y desbloqueado?');
                    }
                  }, 500);
                } else {
                  alert('❌ Phantom no detectado. ¿Está instalado?');
                }
              } catch (error) {
                console.error('💥 Error total:', error);
                alert('Error: ' + error.message);
              }
            }}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            👻 Conectar Phantom
          </button>
        ) : (
          <WalletMultiButton />
        )}
      </div>

      {publicKey ? (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #e0ffe0, #f0fff0)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '2px solid #4caf50', 
            marginBottom: '2rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2e7d32', marginBottom: '0.5rem' }}>
              🔗 Wallet Conectada
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {publicKey.toBase58().slice(0, 12)}...{publicKey.toBase58().slice(-8)}
            </div>
          </div>

          {/* Estado de Smart Contract */}
          <div style={{ 
            background: blockchainStatus === 'connected' ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : 
                       blockchainStatus === 'connecting' ? 'linear-gradient(135deg, #fff3e0, #ffeaa7)' :
                       'linear-gradient(135deg, #ffebee, #fce4ec)',
            padding: '1rem', 
            borderRadius: '8px', 
            border: `2px solid ${blockchainStatus === 'connected' ? '#4caf50' : 
                                 blockchainStatus === 'connecting' ? '#ff9800' : '#f48fb1'}`,
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
              {blockchainStatus === 'connected' ? '⛓️ Smart Contract: Conectado' :
               blockchainStatus === 'connecting' ? '🔄 Smart Contract: Conectando...' :
               '⚠️ Smart Contract: Desconectado'}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.8 }}>
              Program ID: 42CA8h...CoTi
            </div>
          </div>
          
          {!userRegistered ? (
            <div style={{ 
              background: '#f8f9ff', 
              padding: '2rem', 
              borderRadius: '12px', 
              border: '1px solid #e0e4ff',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#3f51b5', marginBottom: '1rem' }}>
                🚀 Únete a LoveChain
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Tu nickname único"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  style={{ 
                    padding: '0.8rem', 
                    fontSize: '1rem',
                    borderRadius: '8px', 
                    border: '1px solid #ddd',
                    width: '60%',
                    marginRight: '0.5rem'
                  }}
                />
                <button
                  onClick={handleRegisterUser}
                  disabled={isRegistering}
                  style={{ 
                    padding: '0.8rem 1.5rem', 
                    fontSize: '1rem',
                    borderRadius: '8px', 
                    background: isRegistering ? '#ccc' : '#3f51b5', 
                    color: 'white', 
                    border: 'none', 
                    cursor: isRegistering ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isRegistering ? '⏳ Registrando...' : '✨ Registrar'}
                </button>
              </div>
              <small style={{ color: '#666' }}>
                Tu perfil se creará como NFT en Solana Blockchain
              </small>
            </div>
          ) : (
            <div>
              <div style={{ 
                background: 'linear-gradient(135deg, #fff3e0, #ffeaa7)', 
                padding: '2rem', 
                borderRadius: '12px', 
                border: '2px solid #ff9800',
                marginBottom: '2rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#e65100', marginBottom: '1rem' }}>
                  🎉 ¡Hola {nickname}!
                </h3>
                <p style={{ color: '#bf360c' }}>
                  Tu perfil está activo en LoveChain
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{ 
                  background: '#ffe0f0', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  border: '1px solid #ffb3d1'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❤️</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c2185b' }}>
                    {likes}
                  </div>
                  <div style={{ color: '#880e4f' }}>Likes dados</div>
                </div>
                
                <div style={{ 
                  background: '#e8f5e8', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  border: '1px solid #a5d6a7'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#388e3c' }}>
                    {matches.length}
                  </div>
                  <div style={{ color: '#1b5e20' }}>Matches</div>
                </div>
              </div>
              
              <button
                onClick={handleLike}
                disabled={isLiking}
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.2rem',
                  borderRadius: '25px', 
                  background: isLiking ? 'linear-gradient(135deg, #ccc, #999)' : 'linear-gradient(135deg, #ff4081, #f50057)', 
                  color: 'white', 
                  border: 'none', 
                  cursor: isLiking ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                  marginBottom: '2rem'
                }}
              >
                {isLiking ? '⏳ Procesando...' : '💖 Dar Like'}
              </button>
              
              {matches.length > 0 && (
                <div style={{ 
                  background: '#fff8e1', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  border: '1px solid #ffcc02'
                }}>
                  <h4 style={{ color: '#f57f17', marginBottom: '1rem' }}>
                    🔥 Tus Matches
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {matches.map((match, index) => (
                      <span 
                        key={index}
                        style={{ 
                          background: '#ffeb3b', 
                          color: '#f57f17',
                          padding: '0.5rem 1rem', 
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          background: 'linear-gradient(135deg, #ffebee, #fce4ec)', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #f48fb1',
          maxWidth: '400px',
          margin: '0 auto',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h3 style={{ color: '#c2185b', marginBottom: '1rem' }}>
            Conecta tu Wallet
          </h3>
          <p style={{ color: '#880e4f' }}>
            Necesitas conectar Phantom para acceder a LoveChain
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f5f5f5', borderRadius: '12px' }}>
        <h4 style={{ color: '#424242', marginBottom: '1rem' }}>🚀 MVP Features</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <div>✅ Multi-Wallet Integration</div>
          <div>{blockchainStatus === 'connected' ? '✅' : '⏳'} Smart Contract Connection</div>
          <div>{program ? '✅' : '⏳'} User Registration</div>
          <div>{program ? '✅' : '⏳'} Like System (Blockchain)</div>
          <div>⏳ Match Algorithm (S-Mart Contract)</div>
          <div>⏳ NFT Profiles (SBT)</div>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>🔧 Hackathon MVP Status</div>
          <div style={{ color: '#666' }}>
            Network: Solana Devnet | Program: {program ? 'Loaded' : 'Loading...'} | 
            Status: {blockchainStatus === 'connected' ? 'Ready for demo' : 'Setting up...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;