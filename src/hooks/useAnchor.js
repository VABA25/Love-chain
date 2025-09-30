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
    
    // Temporalmente return null para modo demo
    // TODO: Arreglar IDL mismatch
    console.log('🚧 Blockchain connection disabled temporarily - using demo mode');
    return null;
    
    /* 
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    
    return new Program(idl, programID, provider);
    */
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