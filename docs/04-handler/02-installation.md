---
id: handler-installation
title: Handler Installation
---

# DIP Handler Installation

This guide covers installing and setting up the DIP Handler for your project. The handler supports both Node.js and browser environments with full TypeScript support and CommonJS compatibility.

## Installation

### NPM Installation
```bash
npm install @wttp/handler
```

### Yarn Installation
```bash
yarn add @wttp/handler
```

### PNPM Installation
```bash
pnpm add @wttp/handler
```

## Dependencies

The handler has the following peer dependencies:

### Required Dependencies
- **ethers**: `^6.14.4` - For blockchain interactions and cryptographic operations
- **@wttp/core**: `^0.5.3` - Core WTTP protocol definitions and types

### Optional Dependencies
- **mime-types**: `^3.0.1` - For MIME type detection (included but can be overridden)

## Environment Setup

### Node.js Environment

#### Basic Setup
```typescript
import { WTTPHandler } from '@wttp/handler';

// Create handler instance
const handler = new WTTPHandler();
```

#### With Custom Provider
```typescript
import { ethers } from 'ethers';
import { WTTPHandler } from '@wttp/handler';

// Create custom provider
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create handler with custom signer
const handler = new WTTPHandler(signer, 'sepolia');
```

### Browser Environment

#### ES Modules
```html
<script type="module">
  import { WTTPHandler } from 'https://unpkg.com/@wttp/handler@latest/dist/esm/src/index.js';
  
  const handler = new WTTPHandler();
</script>
```

#### UMD Build
```html
<script src="https://unpkg.com/@wttp/handler@latest/dist/umd/index.js"></script>
<script>
  const handler = new WTTPHandler();
</script>
```

#### With Bundlers (Webpack, Vite, etc.)
```typescript
import { WTTPHandler } from '@wttp/handler';

const handler = new WTTPHandler();
```

## Configuration Options

### Constructor Parameters

```typescript
const handler = new WTTPHandler(signer?, defaultChain?);
```

#### Parameters
- **signer** (optional): `ethers.Signer` - Custom signer for authenticated operations
- **defaultChain** (optional): `string | number` - Default chain ID or alias (fallback when no chain specified in URL)

#### Chain Aliases
The handler supports convenient chain aliases:

```typescript
// String aliases
const handler1 = new WTTPHandler(undefined, 'sepolia');    // Sepolia testnet
const handler2 = new WTTPHandler(undefined, 'mainnet');    // Ethereum mainnet
const handler3 = new WTTPHandler(undefined, 'polygon');    // Polygon
const handler4 = new WTTPHandler(undefined, 'base');       // Base
const handler5 = new WTTPHandler(undefined, 'localhost');  // Local development

// Numeric chain IDs
const handler6 = new WTTPHandler(undefined, 11155111);     // Sepolia
const handler7 = new WTTPHandler(undefined, 1);            // Mainnet
const handler8 = new WTTPHandler(undefined, 137);          // Polygon
```

### Advanced Configuration

#### Custom RPC Endpoints
```typescript
import { ethers } from 'ethers';

// Create custom provider with specific RPC
const customProvider = new ethers.JsonRpcProvider('https://your-custom-rpc.com');
const signer = new ethers.Wallet('private-key', customProvider);

const handler = new WTTPHandler(signer, 'sepolia');
```

#### Multiple Network Support
```typescript
// Create handlers for different default networks
const handlers = {
  sepolia: new WTTPHandler(undefined, 'sepolia'),
  mainnet: new WTTPHandler(undefined, 'mainnet'),
  polygon: new WTTPHandler(undefined, 'polygon'),
  localhost: new WTTPHandler(undefined, 'localhost')
};

// Chain selection happens in the URL, not the handler
// These will all work with any handler:
const response1 = await handlers.sepolia.fetch('wttp://site.eth:sepolia/page.html');
const response2 = await handlers.sepolia.fetch('wttp://site.eth:mainnet/page.html');
const response3 = await handlers.sepolia.fetch('wttp://site.eth:polygon/page.html');

// Default chain is only used when no chain is specified in URL
const response4 = await handlers.sepolia.fetch('wttp://site.eth/page.html'); // Uses sepolia as default
```

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  }
}
```

### Type Definitions
The handler provides full TypeScript support:

```typescript
import { 
  WTTPHandler, 
  wURL, 
  Method, 
  WTTPFetchOptions, 
  SimpleResponse 
} from '@wttp/handler';

// Type-safe usage
const handler: WTTPHandler = new WTTPHandler();
const options: WTTPFetchOptions = {
  method: Method.GET,
  redirect: "follow"
};
const response: SimpleResponse = await handler.fetch(url, options);
```

## Environment-Specific Setup

### Development Environment

#### Local Development
```typescript
// For local development with Hardhat
const handler = new WTTPHandler(undefined, 'localhost');

// Connect to local node
const localProvider = new ethers.JsonRpcProvider('http://localhost:8545');
const localSigner = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', localProvider);
const localHandler = new WTTPHandler(localSigner, 'localhost');
```

#### Testing Environment
```typescript
// For testing with Sepolia
const testHandler = new WTTPHandler(undefined, 'sepolia');

// Mock handler for unit tests
const mockHandler = {
  fetch: jest.fn().mockResolvedValue({
    status: 200,
    headers: {},
    body: 'mock content'
  })
};
```

### Production Environment

#### Mainnet Configuration
```typescript
// Production setup with secure key management
const productionHandler = new WTTPHandler(undefined, 'mainnet');

// With environment variables
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
const productionHandler = new WTTPHandler(signer, 'mainnet');
```

#### Error Handling
```typescript
const handler = new WTTPHandler();

try {
  const response = await handler.fetch('wttp://site.eth:sepolia/page.html');
  if (response.status === 200) {
    console.log('Success:', await response.text());
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

## Browser Compatibility

### Modern Browsers
The handler works in all modern browsers that support:
- ES2020 features
- Fetch API
- Web Crypto API (for cryptographic operations)

### Module Support
The handler supports both ES modules and CommonJS:
- **ES Modules**: `import { WTTPHandler } from '@wttp/handler'`
- **CommonJS**: `const { WTTPHandler } = require('@wttp/handler')`
- **Browser**: Works in Electron, Node.js, and modern browsers

## Troubleshooting

### Common Installation Issues

#### 1. Peer Dependency Warnings
```bash
# If you see peer dependency warnings
npm install ethers@^6.14.4 @wttp/core@^0.5.3
```

#### 2. TypeScript Errors
```bash
# Install type definitions
npm install --save-dev @types/node
```

#### 3. Module Resolution Issues
```typescript
// Use explicit imports if needed
import { WTTPHandler } from '@wttp/handler/dist/esm/src/index.js';

// Or use CommonJS
const { WTTPHandler } = require('@wttp/handler/dist/cjs/src/index.js');
```

### Network Configuration

#### RPC Endpoint Issues
```typescript
// The handler automatically uses the appropriate RPC for each chain
// You can test connectivity by checking the chain configuration
import { config } from '@wttp/core';

console.log('Available chains:', Object.keys(config.chains));
console.log('Sepolia RPCs:', config.chains[11155111].rpcsList);
```

#### Chain ID Mismatches
```typescript
// Verify chain ID
const handler = new WTTPHandler(undefined, 'sepolia');
const url = new wURL('wttp://site.eth:sepolia/page.html');
console.log('Expected chain ID:', 11155111);
console.log('URL chain ID:', url.alias);
```

## Next Steps

After installation, you can:

1. **Read the Overview**: Understand the handler's capabilities
2. **Check Examples**: See practical usage patterns
3. **Explore WTTP**: Learn about the underlying protocol
4. **Build Applications**: Start developing with the handler

## Related Documentation

- [Handler Overview](/docs/handler/handler-overview) - Understanding the handler
- [Examples](/docs/handler/handler-examples) - Usage examples and patterns
- [Roadmap](/docs/handler/handler-roadmap) - Development timeline and future plans
- [WTTP Methods](/docs/wttp/wttp-methods) - Understanding WTTP protocol methods
