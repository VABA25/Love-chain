# LoveChain Testing Framework

## Overview

Comprehensive testing strategy for LoveChain's Web3 dating platform, covering unit tests, integration tests, and end-to-end testing.

## Testing Stack

### Core Testing Libraries
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API mocking
- **@solana/web3.js**: Blockchain testing utilities

### Installation
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

## Test Configuration

### jest.config.js
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.stories.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### setupTests.js
```javascript
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock Solana wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    connected: false,
    connecting: false,
    publicKey: null,
    wallet: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendTransaction: jest.fn()
  }),
  useConnection: () => ({
    connection: {
      getBalance: jest.fn().mockResolvedValue(1000000000),
      getAccountInfo: jest.fn().mockResolvedValue(null)
    }
  })
}));

// Mock Web3 crypto functions
Object.assign(global, {
  crypto: {
    getRandomValues: (arr) => crypto.getRandomValues(arr)
  }
});

// Establish API mocking before all tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Component Tests

### WalletConnect Component Test
```javascript
// src/components/__tests__/WalletConnect.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletConnect from '../WalletConnect';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock the wallet hook
jest.mock('@solana/wallet-adapter-react');

describe('WalletConnect Component', () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    useWallet.mockReturnValue({
      connected: false,
      connecting: false,
      publicKey: null,
      wallet: null,
      connect: mockConnect,
      disconnect: mockDisconnect
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders connect button when wallet not connected', () => {
    render(<WalletConnect />);
    
    expect(screen.getByText(/conectar wallet/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  test('calls connect function when connect button clicked', async () => {
    const user = userEvent.setup();
    render(<WalletConnect />);
    
    const connectButton = screen.getByText(/conectar wallet/i);
    await user.click(connectButton);
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  test('shows connecting state', () => {
    useWallet.mockReturnValue({
      connected: false,
      connecting: true,
      publicKey: null,
      wallet: null,
      connect: mockConnect,
      disconnect: mockDisconnect
    });

    render(<WalletConnect />);
    
    expect(screen.getByText(/conectando/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('shows connected state with wallet address', () => {
    const mockPublicKey = {
      toString: () => 'GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr'
    };

    useWallet.mockReturnValue({
      connected: true,
      connecting: false,
      publicKey: mockPublicKey,
      wallet: { adapter: { name: 'Phantom' } },
      connect: mockConnect,
      disconnect: mockDisconnect
    });

    render(<WalletConnect />);
    
    expect(screen.getByText(/GQBMbcYJ/)).toBeInTheDocument();
    expect(screen.getByText(/desconectar/i)).toBeInTheDocument();
  });

  test('calls disconnect when disconnect button clicked', async () => {
    const user = userEvent.setup();
    const mockPublicKey = {
      toString: () => 'GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr'
    };

    useWallet.mockReturnValue({
      connected: true,
      connecting: false,
      publicKey: mockPublicKey,
      wallet: { adapter: { name: 'Phantom' } },
      connect: mockConnect,
      disconnect: mockDisconnect
    });

    render(<WalletConnect />);
    
    const disconnectButton = screen.getByText(/desconectar/i);
    await user.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
```

### Profile Card Component Test
```javascript
// src/components/__tests__/ProfileCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileCard from '../ProfileCard';

const mockUser = {
  id: 'user123',
  displayName: 'Alice',
  age: 25,
  bio: 'Love blockchain and long walks',
  interests: ['crypto', 'travel', 'music'],
  profileImage: 'https://example.com/avatar.jpg',
  location: '5km away'
};

describe('ProfileCard Component', () => {
  const mockOnLike = jest.fn();
  const mockOnPass = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information correctly', () => {
    render(
      <ProfileCard 
        user={mockUser} 
        onLike={mockOnLike} 
        onPass={mockOnPass} 
      />
    );

    expect(screen.getByText('Alice, 25')).toBeInTheDocument();
    expect(screen.getByText('Love blockchain and long walks')).toBeInTheDocument();
    expect(screen.getByText('📍 5km away')).toBeInTheDocument();
  });

  test('displays user interests', () => {
    render(
      <ProfileCard 
        user={mockUser} 
        onLike={mockOnLike} 
        onPass={mockOnPass} 
      />
    );

    expect(screen.getByText('crypto')).toBeInTheDocument();
    expect(screen.getByText('travel')).toBeInTheDocument();
    expect(screen.getByText('music')).toBeInTheDocument();
  });

  test('calls onLike when like button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProfileCard 
        user={mockUser} 
        onLike={mockOnLike} 
        onPass={mockOnPass} 
      />
    );

    const likeButton = screen.getByRole('button', { name: /💖/ });
    await user.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith('user123');
  });

  test('calls onPass when pass button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProfileCard 
        user={mockUser} 
        onLike={mockOnLike} 
        onPass={mockOnPass} 
      />
    );

    const passButton = screen.getByRole('button', { name: /❌/ });
    await user.click(passButton);

    expect(mockOnPass).toHaveBeenCalledWith('user123');
  });

  test('handles missing optional fields gracefully', () => {
    const minimalUser = {
      id: 'user456',
      displayName: 'Bob',
      age: 30,
      bio: 'Simple bio'
    };

    render(
      <ProfileCard 
        user={minimalUser} 
        onLike={mockOnLike} 
        onPass={mockOnPass} 
      />
    );

    expect(screen.getByText('Bob, 30')).toBeInTheDocument();
    expect(screen.getByText('Simple bio')).toBeInTheDocument();
  });
});
```

## Hook Tests

### useAnchor Hook Test
```javascript
// src/hooks/__tests__/useAnchor.test.js
import { renderHook, act } from '@testing-library/react';
import { useAnchor } from '../useAnchor';
import * as anchor from '@coral-xyz/anchor';

// Mock Anchor framework
jest.mock('@coral-xyz/anchor', () => ({
  AnchorProvider: {
    env: jest.fn()
  },
  Program: jest.fn(),
  web3: {
    clusterApiUrl: jest.fn(() => 'https://api.devnet.solana.com'),
    Connection: jest.fn(),
    Keypair: {
      generate: jest.fn()
    }
  }
}));

describe('useAnchor Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useAnchor());

    expect(result.current.program).toBeNull();
    expect(result.current.provider).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test('handles initialization error gracefully', async () => {
    // Mock Anchor to throw an error
    anchor.AnchorProvider.env.mockImplementation(() => {
      throw new Error('Failed to connect to Solana');
    });

    const { result } = renderHook(() => useAnchor());

    await act(async () => {
      // Wait for effect to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to connect to Solana');
    expect(result.current.program).toBeNull();
  });

  test('sets up program successfully', async () => {
    const mockProgram = { programId: 'test-id' };
    const mockProvider = { connection: {} };

    anchor.AnchorProvider.env.mockReturnValue(mockProvider);
    anchor.Program.mockReturnValue(mockProgram);

    const { result } = renderHook(() => useAnchor());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.program).toBe(mockProgram);
    expect(result.current.provider).toBe(mockProvider);
  });
});
```

## Integration Tests

### User Registration Flow Test
```javascript
// src/integration/__tests__/userRegistration.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { server } from '../../mocks/server';
import { rest } from 'msw';

describe('User Registration Integration', () => {
  test('complete user registration flow', async () => {
    const user = userEvent.setup();

    // Mock successful API responses
    server.use(
      rest.post('/api/users/register', (req, res, ctx) => {
        return res(ctx.json({
          id: 'user123',
          displayName: 'Test User',
          walletAddress: 'GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr'
        }));
      })
    );

    render(<App />);

    // Connect wallet first
    const connectButton = screen.getByText(/conectar wallet/i);
    await user.click(connectButton);

    // Fill registration form
    await waitFor(() => {
      expect(screen.getByText(/crear perfil/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre/i);
    const ageInput = screen.getByLabelText(/edad/i);
    const bioInput = screen.getByLabelText(/biografía/i);

    await user.type(nameInput, 'Test User');
    await user.type(ageInput, '25');
    await user.type(bioInput, 'Love testing and blockchain');

    const submitButton = screen.getByText(/crear perfil/i);
    await user.click(submitButton);

    // Verify successful registration
    await waitFor(() => {
      expect(screen.getByText(/perfil creado exitosamente/i)).toBeInTheDocument();
    });
  });

  test('handles registration errors', async () => {
    const user = userEvent.setup();

    // Mock API error
    server.use(
      rest.post('/api/users/register', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ error: 'User already exists' })
        );
      })
    );

    render(<App />);

    const connectButton = screen.getByText(/conectar wallet/i);
    await user.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText(/crear perfil/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre/i);
    await user.type(nameInput, 'Existing User');

    const submitButton = screen.getByText(/crear perfil/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });
});
```

## Mock Service Worker Setup

### API Mocks
```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // User endpoints
  rest.get('/api/users/profile', (req, res, ctx) => {
    return res(ctx.json({
      id: 'user123',
      displayName: 'Test User',
      age: 25,
      bio: 'Test bio',
      interests: ['crypto', 'testing'],
      walletAddress: 'GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr'
    }));
  }),

  rest.post('/api/users/register', (req, res, ctx) => {
    return res(ctx.json({
      id: 'new-user',
      displayName: req.body.displayName,
      walletAddress: req.body.walletAddress
    }));
  }),

  // Matching endpoints
  rest.get('/api/matches/potential', (req, res, ctx) => {
    return res(ctx.json({
      matches: [
        {
          id: 'user456',
          displayName: 'Match User',
          age: 28,
          bio: 'Potential match',
          compatibility: 85
        }
      ]
    }));
  }),

  rest.post('/api/matches/like', (req, res, ctx) => {
    return res(ctx.json({
      isMatch: true,
      matchId: 'match123'
    }));
  }),

  // Blockchain endpoints
  rest.get('/api/blockchain/balance', (req, res, ctx) => {
    return res(ctx.json({
      balance: '1000.50',
      symbol: 'LOVE'
    }));
  })
];
```

### Server Setup
```javascript
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## End-to-End Tests

### Playwright Configuration
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example
```javascript
// e2e/userFlow.spec.js
import { test, expect } from '@playwright/test';

test('complete user journey', async ({ page }) => {
  await page.goto('/');

  // Connect wallet
  await page.click('text=Conectar Wallet');
  await expect(page.locator('text=Phantom')).toBeVisible();
  
  // Mock wallet connection
  await page.evaluate(() => {
    window.solana = {
      isPhantom: true,
      connect: () => Promise.resolve({
        publicKey: { toString: () => 'GQBMbcYJpNmMSAxgYE5HdNz3X97ZNYeRZDfNu26L7JSr' }
      })
    };
  });

  await page.click('text=Phantom');
  await expect(page.locator('text=Conectado')).toBeVisible();

  // Navigate through app
  await page.click('text=Explorar Perfiles');
  await expect(page.locator('[data-testid="profile-card"]')).toBeVisible();

  // Like a profile
  await page.click('[data-testid="like-button"]');
  await expect(page.locator('text=¡Es un Match!')).toBeVisible();

  // Open chat
  await page.click('text=Enviar mensaje');
  await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();

  // Send message
  await page.fill('[data-testid="message-input"]', 'Hello!');
  await page.click('[data-testid="send-button"]');
  await expect(page.locator('text=Hello!')).toBeVisible();
});
```

## Performance Testing

### Load Testing with Jest
```javascript
// src/performance/__tests__/componentPerformance.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { performance } from 'perf_hooks';
import WalletConnectBalanced from '../components/WalletConnectBalanced';

describe('Component Performance', () => {
  test('WalletConnectBalanced renders within performance budget', () => {
    const startTime = performance.now();
    
    render(<WalletConnectBalanced />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Component should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('handles large profile lists efficiently', () => {
    const largeProfileList = Array.from({ length: 1000 }, (_, i) => ({
      id: `user${i}`,
      displayName: `User ${i}`,
      age: 20 + (i % 20),
      bio: `Bio for user ${i}`
    }));

    const startTime = performance.now();
    
    render(<WalletConnectBalanced profiles={largeProfileList} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should handle large lists within 500ms
    expect(renderTime).toBeLessThan(500);
  });
});
```

## Test Scripts

### package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "jest --testPathPattern=performance"
  }
}
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Testing Best Practices

### Guidelines
1. **Test Behavior, Not Implementation**: Focus on what users experience
2. **Use Descriptive Test Names**: Clear test names serve as documentation
3. **Arrange-Act-Assert Pattern**: Structure tests consistently
4. **Mock External Dependencies**: Keep tests isolated and fast
5. **Test Edge Cases**: Include error scenarios and boundary conditions

### Common Patterns
```javascript
// Good: Testing user behavior
test('shows error message when wallet connection fails', async () => {
  // Arrange
  mockWallet.mockRejectedValue(new Error('Connection failed'));
  
  // Act
  render(<WalletConnect />);
  await user.click(screen.getByText('Connect'));
  
  // Assert
  expect(screen.getByText('Connection failed')).toBeInTheDocument();
});

// Avoid: Testing implementation details
test('calls setConnected with true when connection succeeds', () => {
  // This tests internal state management, not user-facing behavior
});
```

## Code Coverage Goals

- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 85%+
- **Lines**: 85%+

Critical components (wallet, matching, blockchain) should have 95%+ coverage.