---
id: handler-overview
title: Handler Overview
---

# DIP Handler Overview

The DIP (Decentralized Internet Project) Handler is a comprehensive client library that provides a unified interface for accessing decentralized content across multiple protocols. While currently focused on WTTP (Web Three Transfer Protocol), it's evolving into a complete DIP handler that supports IPFS, Bitcoin Ordinals, Arweave, ESP, and other decentralized storage solutions.

## What is the DIP Handler?

The DIP Handler is a TypeScript/JavaScript library that brings the familiar `fetch()` API to decentralized storage protocols. It acts as a bridge between traditional web applications and the decentralized web, providing:

- **Unified Interface**: Single API for multiple decentralized protocols
- **Protocol Abstraction**: Hide complexity of different storage systems
- **WTTP Integration**: Native support for WTTP sites and gateways
- **Multi-Protocol Support**: IPFS, Ordinals, Arweave, ESP, and more (roadmap)
- **Standard Compliance**: Returns standard `Response` objects

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Browser   │  │   dApp      │  │   Node.js App       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                  DIP Handler                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   wURL      │  │  Protocol   │  │   Response          │  │
│  │  Parser     │  │  Router     │  │   Normalizer        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                Protocol Handlers                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   WTTP      │  │    IPFS     │  │    Ordinals         │  │
│  │  Handler    │  │  Handler    │  │   Handler           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Arweave   │  │     ESP     │  │   Future Protocols  │  │
│  │  Handler    │  │  Handler    │  │   Handler           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 🌐 Multi-Protocol Support
- **WTTP**: Native blockchain-based web hosting
- **IPFS**: InterPlanetary File System (roadmap)
- **Bitcoin Ordinals**: Bitcoin-based content storage (roadmap)
- **Arweave**: Permanent data storage (roadmap)
- **ESP**: Ethereum Storage Protocol for direct data point access (roadmap)
- **HTTP/HTTPS**: Traditional web content fallback

### 🔗 Unified URL System
- **wURL Class**: Extended URL supporting protocol-specific schemes
- **Chain ID Support**: Blockchain networks in port position
- **Protocol Detection**: Automatic routing based on URL scheme
- **Relative Resolution**: Standard URL resolution with protocol inheritance

### ⚡ Performance Optimizations
- **Range Requests**: Partial content delivery for large files
- **Streaming Support**: Efficient handling of large resources
- **Multi-Call Assembly**: Automatic stitching of chunked content
- **Caching Integration**: Browser-compatible caching headers

### 🛡️ Security & Authentication
- **Wallet Integration**: Signer support for authenticated protocols
- **Public Access**: Automatic handling of public protocols
- **Error Normalization**: Unified error handling across protocols
- **Content Verification**: Cryptographic integrity checks

## Current Implementation Status

### ✅ Fully Implemented
- **WTTP Protocol**: Complete support for WTTP sites and gateways
- **wURL Class**: Extended URL with chain ID support
- **Response Normalization**: Standard `Response` objects
- **Redirect Handling**: Automatic redirect following
- **Error Management**: Comprehensive error handling

### 🚧 In Development (Q3 2025)
- **Multi-Chain Name Services**: Unstoppable Domains integration
- **IPFS Support**: `fetchIPFS()` method and protocol detection

### 🔮 Future Development (Q4 2025 - Q4 2026)
- **Q4 2025**: ENS integration, Bitcoin Ordinals support
- **Q1 2026**: Base Name Service, Arweave integration
- **Q2 2026**: Arweave Name Service, ESP protocol support
- **Q3 2026**: Arbitrum Name Service, HTTP/HTTPS fallback
- **Q4 2026**: Avalanche Name Service, Storj support

### 🔮 Future Enhancements (2026)
- **Intelligent Protocol Detection**: Automatic protocol selection based on content
- **Advanced Caching**: Protocol-aware caching strategies
- **Performance Monitoring**: Built-in performance metrics
- **Multi-Platform Support**: cURL, Python, Go, Rust implementations
- **Protocol Extensions**: Plugin system for new protocols

## Use Cases

### Decentralized Web Applications
```typescript
import { WTTPHandler } from '@wttp/handler';

const handler = new WTTPHandler();

// Fetch from WTTP site
const wttpContent = await handler.fetch('wttp://mysite.eth:sepolia/index.html');

// Fetch from IPFS (future)
const ipfsContent = await handler.fetch('ipfs://QmHash/path/to/file');

// Fetch from Bitcoin Ordinals (future)
const ordinalContent = await handler.fetch('ord:inscription-id');

// Fetch from ESP (future)
const espContent = await handler.fetch('esp://datapoint-address:sepolia');
```

### Content Aggregation
```typescript
// Aggregate content from multiple protocols
const sources = [
  'wttp://primary.eth:mainnet/content',
  'ipfs://QmBackupHash/content',
  'ord:inscription-id',
  'ar://transaction-id/content',
  'esp://datapoint-address:mainnet',
  'sj://my-bucket/my-object'
];

const content = await Promise.all(
  sources.map(url => handler.fetch(url))
);
```

### Protocol-Agnostic Development
```typescript
// Same API regardless of underlying protocol
const fetchContent = async (url: string) => {
  const response = await handler.fetch(url);
  return response.body;
};

// Works with any supported protocol
const content1 = await fetchContent('wttp://site.eth:sepolia/page.html');
const content2 = await fetchContent('ipfs://QmHash/document.pdf');
const content3 = await fetchContent('ord:inscription-id');
const content4 = await fetchContent('esp://datapoint-address:sepolia');
```

## Integration with WTTP Ecosystem

The handler is designed to complement the broader WTTP ecosystem:

### WTTP Sites
- **Content Management**: Upload and manage content on WTTP sites
- **Protocol Bridging**: Reference external content from other protocols
- **Redundancy**: Store content across multiple protocols for resilience

### WTTP Gateway
- **Optimized Delivery**: Use gateways for enhanced performance
- **Range Requests**: Efficient partial content delivery
- **Content Assembly**: Automatic chunking and reassembly

### ESP Integration
- **Economic Incentives**: Leverage ESP's royalty system
- **Content Addressing**: Use ESP's content-addressed storage
- **Data Integrity**: Cryptographic verification of content

## Getting Started

### Basic Usage
```typescript
import { WTTPHandler } from '@wttp/handler';

// Create handler instance
const handler = new WTTPHandler();

// Fetch content (protocol auto-detected)
const response = await handler.fetch('wttp://example.eth:sepolia/index.html');
console.log('Status:', response.status);
console.log('Content:', await response.text());
```

### Advanced Configuration
```typescript
import { ethers } from 'ethers';

// Create handler with custom signer
const signer = new ethers.Wallet('private-key');
const handler = new WTTPHandler(signer, 'sepolia');

// Fetch with custom options
const response = await handler.fetch('wttp://site.eth:sepolia/api/data', {
  method: 'GET',
  headers: {
    'Range': 'bytes=0-1023'
  }
});
```

## Roadmap & Future Development

### Q3 2025: Current Development
- Unstoppable Domains integration
- IPFS fetching support with `fetchIPFS()` method

### Q4 2025: Protocol Expansion
- ENS integration with `.eth` domain resolution
- Bitcoin Ordinals support with `fetchOrdinals()` method

### 2026: Continued Development
- **Q1**: Base Name Service, Arweave integration
- **Q2**: Arweave Name Service, ESP protocol support
- **Q3**: Arbitrum Name Service, HTTP/HTTPS fallback
- **Q4**: Avalanche Name Service, Storj support

### 2026: Advanced Features
- Intelligent protocol detection
- Performance optimization
- Multi-platform support (cURL, Python, Go, Rust)
- Advanced caching strategies
- Plugin system for new protocols

## Related Documentation

- [Installation Guide](/docs/handler/handler-installation) - Setup and configuration
- [Examples](/docs/handler/handler-examples) - Usage examples and patterns
- [Roadmap](/docs/handler/handler-roadmap) - Development timeline and future plans
- [WTTP Overview](/docs/wttp/wttp-overview) - Understanding WTTP protocol
- [ESP Overview](/docs/esp/esp-overview) - Ethereum Storage Protocol
