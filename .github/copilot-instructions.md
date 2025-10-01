# LoveChain MVP - AI Agent Instructions

## Project Overview
LoveChain is a **blockchain-based dating platform MVP** built on **Solana** using React. It combines traditional dating app UX with Web3 features like wallet authentication, NFTs, and on-chain reputation systems.

## Architecture & Key Components

### Frontend Stack
- **React 19** with Create React App + `react-app-rewired` for Solana compatibility
- **Solana Wallet Adapter** with Phantom/Solflare integration
- **Crossmint SDK** for NFT/payment functionality
- **Anchor Framework** for smart contract interaction (currently in demo mode)

### Critical File Structure
```
src/
├── App.jsx                     # Main provider setup (Solana + Crossmint)
├── components/
│   ├── WalletConnectBalanced.jsx   # Primary component - full dating app logic
│   ├── ErrorBoundary.jsx           # React error handling
│   └── Wallet*.jsx                 # Alternative wallet component variants
├── hooks/useAnchor.js              # Disabled Anchor program integration
└── idl/lovechain_anchor.json       # Smart contract interface definition
```

## Development Patterns

### Wallet Integration Pattern
```jsx
// Standard setup in App.jsx
<ConnectionProvider endpoint="https://api.devnet.solana.com">
  <WalletProvider wallets={[PhantomWalletAdapter, SolflareWalletAdapter]} autoConnect>
    <CrossmintProvider apiKey="ck_production_...">
```

### Component State Management
- **No Redux/Context** - uses React hooks exclusively
- All app state consolidated in `WalletConnectBalanced.jsx` (686 lines)
- Demo data hardcoded in component (profiles array, mock interactions)

### Build Configuration
- `config-overrides.js` handles **Solana polyfills** (crypto, stream, vm, Buffer)
- Uses `react-app-rewired` instead of standard `react-scripts`
- **Critical**: Source map loader disabled to reduce build warnings

## Development Workflow

### Local Development
```bash
npm start          # Uses react-app-rewired (not react-scripts)
npm run build      # Production build with Solana optimizations
```

### Blockchain Integration Status
- **Smart contracts**: Currently DISABLED (see `useAnchor.js`)
- **Program ID**: `42CA8hKevXBiZqKMveUriTns8SxQFRLE4tHt6bXjCoTi`
- **Network**: Solana Devnet
- **Demo mode**: All blockchain interactions are mocked

## Key Implementation Details

### Security & API Keys
- **Production Crossmint key** hardcoded in App.jsx (needs environment variable)
- **JWT authentication** mentioned but not implemented
- **Error boundary** wraps entire app with Spanish error messages

### Dating App Logic (WalletConnectBalanced.jsx)
- Hardcoded 4 demo profiles with crypto-themed bios
- Simulated matching system with popup animations
- Mock chat functionality with automated responses
- Reputation system placeholder (likes counter)

### Browser Compatibility
- Crypto polyfills in `index.js` for browsers without native crypto
- Buffer/process polyfills for Solana Web3.js compatibility

## Common Tasks

### Adding New Components
- Follow existing wallet adapter pattern
- Wrap in ErrorBoundary for stability
- Use functional components with hooks (no class components except ErrorBoundary)

### Blockchain Integration
- Currently disabled - re-enable by fixing IDL mismatch in `useAnchor.js`
- All smart contract calls should go through the Anchor program instance
- Test on Devnet before mainnet deployment

### Styling Approach
- Inline styles throughout (no CSS modules/styled-components)
- Consistent pink/purple gradient theme for Web3 dating aesthetic
- Responsive design with mobile-first approach in main component

## Critical Dependencies
- `@coral-xyz/anchor ^0.31.1` - Smart contract interaction
- `@solana/wallet-adapter-*` - Wallet connectivity
- `@crossmint/client-sdk-react-ui ^2.4.14` - NFT/payment features
- Browser polyfills: `crypto-browserify`, `stream-browserify`, `vm-browserify`

## Testing & Debugging
- No test files currently present
- Heavy console logging throughout components for debugging
- ErrorBoundary provides user-friendly error display in Spanish