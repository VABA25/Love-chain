# LoveChain API Documentation

## Overview

LoveChain provides a RESTful API for integrating with our Web3 dating platform. The API supports user management, matching services, and blockchain interactions.

## Base URL
```
Production: https://api.lovechain.app/v1
Development: https://dev-api.lovechain.app/v1
```

## Authentication

### Wallet Authentication
All API requests require wallet signature authentication:

```javascript
// Example authentication header
headers: {
  'Authorization': 'Wallet signature-here',
  'Content-Type': 'application/json',
  'X-Wallet-Address': 'user-wallet-address'
}
```

### API Key Authentication (for partners)
```javascript
headers: {
  'X-API-Key': 'your-api-key',
  'Content-Type': 'application/json'
}
```

## Endpoints

### User Management

#### GET /users/profile
Get current user profile information.

**Response:**
```json
{
  "id": "user123",
  "walletAddress": "GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr",
  "displayName": "Alice",
  "age": 25,
  "bio": "Love blockchain and long walks on the beach",
  "interests": ["crypto", "travel", "music"],
  "profileImage": "https://ipfs.io/ipfs/QmHash...",
  "reputation": 85,
  "verified": true,
  "createdAt": "2024-10-01T00:00:00Z"
}
```

#### PUT /users/profile
Update user profile information.

**Request Body:**
```json
{
  "displayName": "Alice Cooper",
  "bio": "Updated bio text",
  "interests": ["crypto", "travel", "music", "art"]
}
```

#### POST /users/register
Register a new user with wallet signature.

**Request Body:**
```json
{
  "walletAddress": "GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr",
  "displayName": "Alice",
  "age": 25,
  "signature": "signature-proof"
}
```

### Matching System

#### GET /matches/potential
Get potential matches for the current user.

**Query Parameters:**
- `limit`: Number of matches to return (default: 10, max: 50)
- `minAge`: Minimum age filter
- `maxAge`: Maximum age filter
- `interests`: Comma-separated interests filter

**Response:**
```json
{
  "matches": [
    {
      "id": "user456",
      "displayName": "Bob",
      "age": 28,
      "bio": "Short bio...",
      "profileImage": "https://ipfs.io/ipfs/QmHash...",
      "compatibility": 92,
      "commonInterests": ["crypto", "travel"],
      "distance": "5 km"
    }
  ],
  "hasMore": true,
  "nextPage": "cursor-token"
}
```

#### POST /matches/like
Express interest in another user.

**Request Body:**
```json
{
  "targetUserId": "user456",
  "message": "Optional intro message"
}
```

#### POST /matches/pass
Pass on a potential match.

**Request Body:**
```json
{
  "targetUserId": "user456"
}
```

#### GET /matches/mutual
Get mutual matches (both users liked each other).

**Response:**
```json
{
  "matches": [
    {
      "id": "match123",
      "user": {
        "id": "user456",
        "displayName": "Bob",
        "profileImage": "https://ipfs.io/ipfs/QmHash..."
      },
      "matchedAt": "2024-10-01T12:00:00Z",
      "lastMessage": {
        "text": "Hey there!",
        "timestamp": "2024-10-01T12:30:00Z",
        "sender": "user456"
      }
    }
  ]
}
```

### Messaging

#### GET /messages/:matchId
Get conversation messages for a specific match.

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `before`: Cursor for pagination

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "matchId": "match123",
      "sender": "user456",
      "text": "Hey there!",
      "timestamp": "2024-10-01T12:30:00Z",
      "encrypted": true
    }
  ],
  "hasMore": false
}
```

#### POST /messages/:matchId
Send a new message.

**Request Body:**
```json
{
  "text": "Hello! How's your day?",
  "encrypted": true
}
```

### Blockchain Operations

#### GET /blockchain/balance
Get user's LOVE token balance.

**Response:**
```json
{
  "balance": "1000.50",
  "symbol": "LOVE",
  "decimals": 9,
  "usdValue": "50.25"
}
```

#### POST /blockchain/transfer
Transfer LOVE tokens to another user.

**Request Body:**
```json
{
  "recipient": "target-wallet-address",
  "amount": "100.0",
  "message": "Gift for you!"
}
```

#### GET /blockchain/transactions
Get transaction history.

**Response:**
```json
{
  "transactions": [
    {
      "id": "tx123",
      "type": "transfer",
      "amount": "100.0",
      "recipient": "wallet-address",
      "timestamp": "2024-10-01T12:00:00Z",
      "status": "confirmed",
      "txHash": "solana-transaction-hash"
    }
  ]
}
```

### NFT Integration

#### GET /nfts/profile-pictures
Get available profile picture NFTs.

**Response:**
```json
{
  "nfts": [
    {
      "mint": "nft-mint-address",
      "name": "Cool Avatar #123",
      "image": "https://ipfs.io/ipfs/QmHash...",
      "rarity": "rare",
      "price": "50.0"
    }
  ]
}
```

#### POST /nfts/mint-profile
Mint a new profile picture NFT.

**Request Body:**
```json
{
  "name": "My Avatar",
  "description": "Custom profile picture",
  "imageUrl": "https://ipfs.io/ipfs/QmHash..."
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "The wallet signature is invalid",
    "details": "Additional error details"
  }
}
```

### Common Error Codes
- `INVALID_SIGNATURE`: Wallet signature verification failed
- `USER_NOT_FOUND`: User does not exist
- `INSUFFICIENT_BALANCE`: Not enough LOVE tokens
- `RATE_LIMITED`: Too many requests
- `VALIDATION_ERROR`: Request data validation failed

## Rate Limits

- Authentication: 100 requests per minute
- User operations: 1000 requests per hour
- Messaging: 500 messages per hour
- Blockchain operations: 100 transactions per hour

## Webhooks

Register webhook endpoints to receive real-time updates:

### Events
- `match.created`: New mutual match
- `message.received`: New message received
- `transaction.confirmed`: Blockchain transaction confirmed

### Webhook Payload Example
```json
{
  "event": "match.created",
  "data": {
    "matchId": "match123",
    "users": ["user123", "user456"],
    "timestamp": "2024-10-01T12:00:00Z"
  },
  "signature": "webhook-signature"
}
```

## SDK Integration

### JavaScript SDK
```bash
npm install @lovechain/sdk
```

```javascript
import { LoveChainSDK } from '@lovechain/sdk';

const sdk = new LoveChainSDK({
  apiKey: 'your-api-key',
  network: 'mainnet' // or 'devnet'
});

// Get user profile
const profile = await sdk.users.getProfile();

// Find matches
const matches = await sdk.matches.findPotential({
  limit: 10,
  interests: ['crypto', 'travel']
});
```

### React Hooks
```javascript
import { useLoveChain } from '@lovechain/react-hooks';

function MatchesComponent() {
  const { matches, loading, error } = useLoveChain.useMatches();
  
  if (loading) return <div>Loading matches...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
```

## Testing

Use our test environment for development:

- **Base URL**: `https://dev-api.lovechain.app/v1`
- **Test Wallet**: Use Solana devnet wallets
- **Test Tokens**: Request test LOVE tokens from faucet

## Support

- **Documentation**: https://docs.lovechain.app
- **Discord**: #api-support channel
- **Email**: api-support@lovechain.app
- **Status Page**: https://status.lovechain.app