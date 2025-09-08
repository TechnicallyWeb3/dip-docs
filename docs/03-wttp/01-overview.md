---
id: wttp-overview
title: WTTP Overview
---

# WTTP Overview

## What is a WTTP Site?

A WTTP Site is a revolutionary smart contract system that transforms Ethereum into a fully-featured web server. It enables you to host dynamic and static websites directly on any EVM-compatible blockchain, eliminating dependencies on centralized hosting services like AWS S3, Vercel, or IPFS.

## Key Features

### 🌐 On-Chain Web Hosting
- **Censorship-Resistant**: Your website lives on the blockchain, making it as resilient as the underlying network
- **No Centralized Dependencies**: Eliminate single points of failure from traditional hosting providers
- **Immutable Content**: Once deployed, your content is permanently stored and verifiable

### 🔧 HTTP-Like Interface
- **Familiar Methods**: Use standard HTTP verbs (`GET`, `PUT`, `POST`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`)
- **RESTful API**: Build dynamic APIs with server-side logic directly in smart contracts
- **Content Management**: Upload, update, and manage files just like a traditional web server

### 🛡️ Advanced Security
- **Role-Based Access Control**: Fine-grained permissions for different user types
- **CORS Support**: Configure cross-origin resource sharing policies
- **Resource Protection**: Control who can read, write, or modify specific files

### ⚡ Performance Features
- **Caching Headers**: Configure cache behavior for optimal performance
- **ETags**: Support for conditional requests and efficient updates
- **Range Requests**: Partial content delivery for large files
- **Redirects**: Handle URL redirects and custom error pages

## Architecture Overview

WTTP is built on top of the **Ethereum Storage Protocol (ESP)** and consists of three main components: **WTTP Sites** for content management, **WTTP Gateway** for optimized content delivery, and **WTTP Handler** for simplified integration.

### WTTP Sites (Content Management)
```
┌────────────────────────────┐
│      WTTPSite (HTTP)       │  ← Handles HTTP requests & content management
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│   WTTPStorage (Resources)  │  ← Manages file storage & metadata
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│ ESP.DataPointRegistry (¥)  │  ← Economic incentives & royalties
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│ ESP.DataPointStorage (╬)   │  ← Raw data storage (chunked)
└────────────────────────────┘
```

### WTTP Gateway (Content Delivery)
```
┌────────────────────────────┐
│    Off-chain Application   │  ← Your dApp or website
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     WTTP Gateway           │  ← Optimized content delivery
│  • Single blockchain call  │
│  • Byte range requests     │
│  • Data point assembly     │
│  • Content verification    │
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     WTTP Sites             │  ← Multiple sites accessible
└────────────────────────────┘
```

### WTTP Handler (Simplified Integration)
```
┌────────────────────────────┐
│    Off-chain Application   │  ← Your dApp or website
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     WTTP Handler           │  ← Smart contract selection
│  • Automatic redirects     │
│  • Contract management     │
│  • Simplified API          │
│  • Error handling          │
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│  WTTP Gateway or Sites     │  ← Automatically selected
└────────────────────────────┘
```

## Key Benefits

### For Content Creators (WTTP Sites)
- **Censorship-Resistant Hosting**: Your content lives on the blockchain
- **No Centralized Dependencies**: Eliminate single points of failure
- **Immutable Content**: Once deployed, content is permanently stored
- **Role-Based Access Control**: Fine-grained permissions for different users

### For Application Developers (WTTP Gateway)
- **Optimized Performance**: Single blockchain call instead of N+1 calls
- **Efficient Range Requests**: Fetch specific byte ranges from large files
- **Content Verification**: Verify data integrity with chunk-level validation
- **Simplified Integration**: Easy-to-use interface for off-chain applications

### For All Developers (WTTP Handler)
- **Automatic Contract Selection**: Intelligently chooses between sites and gateway
- **Redirect Management**: Handles HTTP redirects automatically
- **Simplified API**: Single interface for all WTTP operations
- **Error Handling**: Comprehensive error management and recovery

## Use Cases

### Static Website Hosting
- **Personal Websites**: Host your portfolio, blog, or personal site on-chain
- **Documentation Sites**: Deploy technical documentation that can't be censored
- **Landing Pages**: Create marketing pages for your dApp or project

### Dynamic Web Applications
- **dApp Frontends**: Host your decentralized application's user interface
- **API Endpoints**: Create RESTful APIs that run entirely on-chain
- **Interactive Content**: Build dynamic web applications with smart contract logic

### Content Management
- **File Storage**: Store and serve files of any type (images, videos, documents)
- **Version Control**: Track changes to your website content over time
- **Collaborative Editing**: Multiple users can contribute to the same site

### Large File Delivery
- **Media Streaming**: Efficiently serve large video and audio files
- **Document Distribution**: Share large PDFs and documents with range requests
- **Data Archives**: Store and access large datasets with partial content delivery

## Getting Started

### For Content Creators
Deploy and manage your WTTP site:

```bash
# Deploy a new site
npx hardhat site:deploy --network localhost

# Upload your website files
npx hardhat site:upload --site <SITE_ADDRESS> --source ./public --network localhost

# Configure site permissions and headers
npx hardhat site:configure --site <SITE_ADDRESS> --network localhost
```

### For Application Developers
Use the WTTP Handler for the best developer experience:

```bash
# Install the WTTP Handler
npm install @wttp/handler

# Use the handler in your application
import { WTTPHandler } from '@wttp/handler';

const handler = new WTTPHandler({
  provider: ethers.provider,
  gateway: GATEWAY_ADDRESS, // Optional: specify gateway
  site: SITE_ADDRESS        // Optional: specify site
});

// Fetch content (handler automatically chooses best method)
const content = await handler.fetch('/index.html');

// Fetch with range request
const partialContent = await handler.fetch('/large-file.pdf', {
  range: { start: 0, end: 1023 }
});
```

Or use the WTTP Gateway directly for advanced control:

```bash
# Deploy a gateway (if not already deployed on your network)
npx hardhat deploy:simple --network localhost

# Fetch content via gateway
npx hardhat gateway:fetch \
  --site <SITE_ADDRESS> \
  --gateway <GATEWAY_ADDRESS> \
  --path /index.html \
  --network localhost

# Fetch specific byte range
npx hardhat gateway:fetch \
  --site <SITE_ADDRESS> \
  --gateway <GATEWAY_ADDRESS> \
  --path /large-file.pdf \
  --range "0-1023" \
  --network localhost
```

## Supported Networks

WTTP Site works on any EVM-compatible blockchain:

- **Ethereum Mainnet** - Production deployments
- **Polygon** - Low-cost transactions
- **Sepolia Testnet** - Free testing environment
- **Localhost** - Development and testing

## Next Steps

### For Content Creators
- [Permissions Guide](/docs/wttp/wttp-permissions) - Understand the access control system
- [Storage Details](/docs/wttp/wttp-storage) - Learn how files are stored on-chain
- [Site Management](/docs/wttp/wttp-sites) - Manage your deployed sites
- [Deployment Guide](/docs/wttp/wttp-deployment) - Complete deployment instructions

### For Application Developers
- [Handler Documentation](/docs/handler/handler-overview) - **Recommended**: Start with the WTTP Handler
- [Gateway Documentation](/docs/wttp/wttp-gateway) - Learn about optimized content delivery
- [Methods Documentation](/docs/wttp/wttp-methods) - Understand the HTTP methods and API
- [Permissions Guide](/docs/wttp/wttp-permissions) - Learn about access control and CORS

## Related Documentation

- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
- [ESP Storage](/docs/esp/esp-storage) - Detailed storage mechanisms
