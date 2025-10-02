import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import idl from '../idl/lovechain_anchor.json';

const programID = new web3.PublicKey('42CA8hKevXBiZqKMveUriTns8SxQFRLE4tHt6bXjCoTi');

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) {
      return null;
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
      return null;
    }
  }, [connection, wallet]);

  return { program, wallet, connection };
}

// Función helper para generar keypairs únicos para cuentas
export function generateKeypair() {
  return web3.Keypair.generate();
}

// Función helper para convertir string a PublicKey
export function toPublicKey(address) {
  return new web3.PublicKey(address);
}