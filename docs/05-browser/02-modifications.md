---
id: browser-modifications
title: Browser Modifications
---

# Browser Modifications

This document details the specific modifications made to the Min Browser to enable WTTP (Web3 Transfer Protocol) support. These changes transform Min into a Web3-native browser capable of accessing decentralized content directly from smart contracts.

## Core Modifications

### 1. Protocol Handler Integration

**File**: `main/wttpProtocol.js`

The primary modification adds custom Electron protocol handlers for WTTP protocol:

```javascript
// Register wttp:// protocol
ses.protocol.handle('wttp', async (req) => {
  // WTTP protocol handler implementation
})
```

**Key Features**:
- **WTTP Protocol Support**: Native `wttp://` protocol support
- **Range Request Handling**: Support for partial content delivery (byte ranges)
- **Header Processing**: Proper handling of HTTP headers like `if-modified-since` and `if-none-match`
- **Error Management**: Comprehensive error handling with proper HTTP status codes

### 2. Protocol Scheme Registration

**File**: `main/wttpProtocol.js` (lines 66-97)

Custom protocol schemes are registered with specific privileges:

```javascript
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'wttp',
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
      bypassCSP: false
    }
  }
])
```

**Privileges Explained**:
- **`standard: true`**: Treats WTTP as a standard web protocol
- **`secure: true`**: Enables secure context features
- **`allowServiceWorkers: true`**: Enables service worker support for caching
- **`supportFetchAPI: true`**: Enables modern fetch API support
- **`corsEnabled: true`**: Enables cross-origin resource sharing
- **`stream: true`**: Enables streaming for large files
- **`bypassCSP: false`**: Respects content security policies

### 3. WTTP Handler Integration

**Dependency**: `@wttp/handler` (v0.2.2)

The browser integrates directly with the WTTP Handler library:

```javascript
const { WTTPHandler } = require('@wttp/handler')
const wttp = new WTTPHandler()
```

**Integration Benefits**:
- **Automatic Contract Resolution**: Handles ENS domain resolution
- **Multi-Chain Support**: Supports multiple EVM-compatible networks
- **Optimized Fetching**: Uses WTTP Gateway for efficient content delivery
- **Error Handling**: Comprehensive error management and recovery

### 4. Session Management

**File**: `main/wttpProtocol.js` (lines 99-113)

Protocol handlers are registered for all browser sessions:

```javascript
// Register for new sessions
app.on('session-created', (ses) => {
  if (ses !== session.defaultSession) {
    registerWttpProtocol(ses)
  }
})

// Register for default session
app.on('ready', function() {
  registerWttpProtocol(session.defaultSession)
})
```

**Session Features**:
- **Universal Support**: Works across all browser windows and tabs
- **Automatic Registration**: No manual configuration required
- **Isolation**: Each session maintains its own protocol handlers

### 5. Main Application Integration

**File**: `main/main.js` (line 23)

The WTTP protocol is initialized early in the application lifecycle:

```javascript
// Initialize wttp protocol handlers (defined in wttpProtocol.js)
initializeWttpProtocol()
```

**Initialization Order**:
1. Protocol schemes registered before `app.ready`
2. Session handlers registered after app initialization
3. Protocol handlers available immediately for all new sessions

## Technical Implementation Details

### URL Processing

The browser processes WTTP URLs in the following format:
```
wttp://[domain].ens(:chain)(/path)
```

**Components**:
- **`domain.ens`**: ENS domain or contract address
- **`:chain`**: Optional chain alias (defaults to Sepolia)
- **`/path`**: Optional path to specific resource

### Supported Chain Aliases

Based on the WTTP Handler configuration, the following chain aliases are supported:

| Alias | Chain ID | Network |
|-------|----------|---------|
| `localhost` | 31337 | Local development |
| `sepolia` | 11155111 | Ethereum Sepolia Testnet |
| `testnet` | 11155111 | Ethereum Sepolia Testnet |
| `ethereum` | 1 | Ethereum Mainnet |
| `mainnet` | 1 | Ethereum Mainnet |
| `eth` | 1 | Ethereum Mainnet |
| `base` | 8453 | Base Network |
| `polygon` | 137 | Polygon Network |
| `matic` | 137 | Polygon Network |
| `arbitrum` | 42161 | Arbitrum One |
| `arb` | 42161 | Arbitrum One |

### Error Handling

The browser implements comprehensive error handling:

```javascript
try {
  const response = await wttp.fetch(req.url, options)
  return response
} catch (error) {
  console.error('WTTP handler error:', error)
  return new Response(`Error: ${error.message}`, {
    status: 500,
    headers: { 'content-type': 'text/plain' }
  })
}
```

**Error Types**:
- **Network Errors**: Connection issues with blockchain networks
- **Resolution Errors**: ENS domain resolution failures
- **Contract Errors**: Smart contract interaction failures
- **Content Errors**: File retrieval or parsing issues

## Why These Modifications?

### 1. **Native Web3 Support**
- **No Extensions Required**: Built-in protocol support eliminates the need for browser extensions
- **Seamless Integration**: WTTP URLs work just like HTTP URLs
- **Performance**: Direct protocol handling is more efficient than extension-based solutions

### 2. **Privacy Preservation**
- **Min's Privacy Features**: Maintains all of Min's privacy-focused features
- **Decentralized Content**: Access content without centralized intermediaries
- **No Tracking**: WTTP content is served directly from smart contracts

### 3. **Developer Experience**
- **Familiar Interface**: Developers can use standard web development practices
- **Protocol Flexibility**: Support for WTTP protocol scheme
- **Error Transparency**: Clear error messages for debugging

### 4. **Future-Proof Architecture**
- **Extensible Design**: Easy to add support for additional decentralized protocols
- **Standards Compliance**: Follows web standards and Electron best practices
- **Community Driven**: Built on open-source foundations

## Compatibility

### Browser Compatibility
- **Electron Version**: 37.1.0
- **Node.js**: Compatible with Node.js 16+
- **Platforms**: Windows, macOS, Linux

### WTTP Compatibility
- **WTTP Handler**: v0.2.2
- **Networks**: All EVM-compatible networks
- **Content Types**: All standard web content types

## Security Considerations

### Protocol Security
- **Secure Context**: WTTP protocol runs in secure context
- **CSP Compliance**: Respects content security policies
- **CORS Support**: Proper cross-origin resource sharing

### Content Security
- **Smart Contract Verification**: Content is verified against smart contract state
- **Immutable Content**: Once deployed, content cannot be modified
- **Decentralized Storage**: No single point of failure

## Performance Optimizations

### Streaming Support
- **Large Files**: Efficient handling of large files through streaming
- **Range Requests**: Support for partial content delivery
- **Caching**: Proper cache headers for optimal performance

### Network Efficiency
- **Single Call**: WTTP Gateway reduces blockchain calls
- **Batch Operations**: Multiple requests can be batched together
- **Connection Pooling**: Reuse connections for better performance

These modifications transform Min Browser into a powerful Web3-native browser while maintaining its core privacy and performance characteristics. The integration is seamless, secure, and designed for both end-users and developers.
