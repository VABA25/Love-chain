import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { useMemo, useState, useEffect } from 'react';
import idl from '../idl/lovechain_anchor.json';

const programID = new web3.PublicKey('42CA8hKevXBiZqKMveUriTns8SxQFRLE4tHt6bXjCoTi');

// 🎭 DEMO MODE: Simulated SOL balances and transactions
const DEMO_MODE = true; // Always true for safe development
const DEMO_SOL_BALANCE = 2.5; // Simulated SOL balance
const DEMO_LOVE_BALANCE = 1000; // Simulated LOVE token balance

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [loveBalance, setLoveBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const program = useMemo(() => {
    if (!wallet) {
      return null;
    }
    
    if (DEMO_MODE) {
      console.log('🎭 Running in DEMO MODE - Using simulated blockchain');
      console.log('💰 Simulated SOL balance:', DEMO_SOL_BALANCE);
      console.log('💖 Simulated LOVE balance:', DEMO_LOVE_BALANCE);
      
      setSolBalance(DEMO_SOL_BALANCE);
      setLoveBalance(DEMO_LOVE_BALANCE);
      
      return null; // No real program in demo mode
    }
    
    try {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      
      console.log('🚀 Connecting to Solana blockchain...');
      const program = new Program(idl, programID, provider);
      console.log('✅ Blockchain connection successful!');
      return program;
    } catch (error) {
      console.log('⚠️ Blockchain connection failed, falling back to demo mode:', error);
      
      // Fallback to demo mode
      setSolBalance(DEMO_SOL_BALANCE);
      setLoveBalance(DEMO_LOVE_BALANCE);
      
      return null;
    }
  }, [connection, wallet]);

  // Simulate SOL balance checking
  const checkBalance = async () => {
    if (!wallet?.publicKey) return;
    
    setIsLoading(true);
    
    if (DEMO_MODE) {
      // Simulate network delay
      setTimeout(() => {
        setSolBalance(DEMO_SOL_BALANCE + (Math.random() * 0.1)); // Small random variation
        setLoveBalance(DEMO_LOVE_BALANCE + Math.floor(Math.random() * 100));
        setIsLoading(false);
        console.log('🎭 Demo balance updated:', { sol: solBalance, love: loveBalance });
      }, 1000);
    } else {
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        setSolBalance(balance / web3.LAMPORTS_PER_SOL);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to get balance:', error);
        setSolBalance(DEMO_SOL_BALANCE); // Fallback
        setIsLoading(false);
      }
    }
  };

  // Simulate sending LOVE tokens
  const sendLoveTokens = async (recipient, amount) => {
    if (!wallet?.publicKey) return false;
    
    setIsLoading(true);
    
    if (DEMO_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const transaction = {
            id: `demo_tx_${Date.now()}`,
            from: wallet.publicKey.toString(),
            to: recipient,
            amount: amount,
            type: 'LOVE_TRANSFER',
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            signature: `demo_sig_${Math.random().toString(36).substr(2, 9)}`
          };
          
          setTransactions(prev => [transaction, ...prev]);
          setLoveBalance(prev => prev - amount);
          setIsLoading(false);
          
          console.log('💖 Demo LOVE transfer successful:', transaction);
          resolve(transaction);
        }, 2000);
      });
    }
    
    // Real blockchain logic would go here
    return false;
  };

  // Simulate creating user profile on-chain
  const createUserProfile = async (profileData) => {
    if (!wallet?.publicKey) return false;
    
    setIsLoading(true);
    
    if (DEMO_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const transaction = {
            id: `profile_tx_${Date.now()}`,
            user: wallet.publicKey.toString(),
            type: 'CREATE_PROFILE',
            data: profileData,
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            signature: `profile_sig_${Math.random().toString(36).substr(2, 9)}`
          };
          
          setTransactions(prev => [transaction, ...prev]);
          setIsLoading(false);
          
          console.log('👤 Demo profile created:', transaction);
          resolve(transaction);
        }, 1500);
      });
    }
    
    // Real blockchain logic would go here
    return false;
  };

  // Simulate like/match on-chain
  const recordLike = async (targetUser) => {
    if (!wallet?.publicKey) return false;
    
    setIsLoading(true);
    
    if (DEMO_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isMatch = Math.random() > 0.7; // 30% chance of match
          
          const transaction = {
            id: `like_tx_${Date.now()}`,
            liker: wallet.publicKey.toString(),
            target: targetUser,
            type: 'LIKE',
            isMatch: isMatch,
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            signature: `like_sig_${Math.random().toString(36).substr(2, 9)}`
          };
          
          setTransactions(prev => [transaction, ...prev]);
          
          if (isMatch) {
            // Award LOVE tokens for matches
            setLoveBalance(prev => prev + 10);
            console.log('💖 Demo match! +10 LOVE tokens awarded');
          }
          
          setIsLoading(false);
          console.log('👍 Demo like recorded:', transaction);
          resolve(transaction);
        }, 1000);
      });
    }
    
    // Real blockchain logic would go here
    return false;
  };

  return { 
    program, 
    wallet, 
    connection,
    solBalance,
    loveBalance,
    isLoading,
    transactions,
    checkBalance,
    sendLoveTokens,
    createUserProfile,
    recordLike,
    isDemoMode: DEMO_MODE
  };
}

// Función helper para generar keypairs únicos para cuentas
export function generateKeypair() {
  return web3.Keypair.generate();
}

// Función helper para convertir string a PublicKey
export function toPublicKey(address) {
  return new web3.PublicKey(address);
}