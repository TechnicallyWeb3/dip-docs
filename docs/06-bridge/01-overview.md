---
id: bridge-overview
title: Bridge Overview
---

# Bridge Overview

The DIP Bridge provides seamless HTTPS access to decentralized resources, enabling users to access Web3 content through traditional web browsers and standard HTTP protocols. Currently available at `wttp.page`, the bridge acts as a gateway that translates HTTP requests into decentralized data retrieval, making Web3 resources accessible through familiar web infrastructure.

**Note**: While currently focused on WTTP (Web3 Transfer Protocol), our goal is to expand the bridge to support additional decentralized protocols beyond WTTP, providing a unified gateway for multiple Web3 protocols.

## Key Features

### Universal Contract Access
- **wURL Support**: Access any contract directly via wURL in the path, regardless of registration status
- **No Subscription Required**: Contract access works without premium subscriptions
- **Cross-Chain Compatibility**: Support for multiple blockchain networks

### DNS Integration
- **TXT Record Configuration**: Simple DNS setup using TXT records
- **Custom Domain Support**: Use your own domain names
- **Multiple Host Support**: Configure for @, www, dapp, and other subdomains

### Premium DNS Management
- **Full DNS Control**: Complete domain management for both Web2 and Web3 domains
- **Native Web3 Records**: Simplified Web3 record management without TXT record complexity
- **Domain Purchasing**: Buy and manage domains through our platform

## How It Works

1. **DNS Configuration**: Point your domain to our bridge servers
2. **TXT Record Setup**: Configure HOST, CA, and CHAIN parameters
3. **Request Processing**: Bridge retrieves and serves decentralized content
4. **HTTPS Delivery**: Content is delivered through standard HTTPS protocols

## Protocol Support

### Current Protocol
- **WTTP (Web3 Transfer Protocol)**: Currently supported via `wttp.page`

### Future Protocol Expansion
Our bridge is designed to be protocol-agnostic and will expand to support additional decentralized protocols:

- **IPFS Integration**: Direct access to IPFS content through HTTPS
- **Arweave Support**: Permanent storage protocol integration
- **Filecoin**: Decentralized storage network access
- **Custom Protocols**: Support for emerging Web3 protocols
- **Multi-Protocol Routing**: Intelligent routing based on content type and requirements

## Use Cases

- **dApp Hosting**: Host decentralized applications on custom domains
- **NFT Galleries**: Serve NFT collections through branded domains
- **DeFi Interfaces**: Provide user-friendly access to DeFi protocols
- **Content Distribution**: Distribute decentralized content through traditional web infrastructure
- **Multi-Protocol Access**: Unified access to various decentralized storage and transfer protocols

The bridge eliminates the complexity of Web3 infrastructure while maintaining the benefits of decentralization, making it easier for users to access and interact with decentralized resources across multiple protocols.
