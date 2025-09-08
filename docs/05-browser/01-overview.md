---
id: browser-overview
title: Browser Overview
---

# Browser Overview

The WTTP Browser is a specialized fork of the [Min Browser](https://minbrowser.org/) that has been enhanced with Web3 Transfer Protocol (WTTP) support, enabling direct access to decentralized websites and applications hosted on Ethereum and other EVM-compatible blockchains.

## About Min Browser

This browser is built upon the excellent foundation of [Min Browser](https://github.com/minbrowser/min) by [PalmerAL](https://github.com/PalmerAL). Min is a fast, minimal browser that protects your privacy and includes features such as:

- Full-text search for visited pages
- Ad and tracker blocking
- Automatic reader view
- Tasks (tab groups)
- Bookmark tagging
- Password manager integration
- Dark theme

We extend our sincere gratitude to the Min Browser team for creating such a robust and privacy-focused browser that serves as the perfect foundation for Web3 integration.

## WTTP Integration

The WTTP Browser adds native support for the Web3 Transfer Protocol, allowing users to:

- **Access Decentralized Websites**: Browse websites hosted directly on smart contracts
- **ENS Domain Resolution**: Navigate using human-readable Ethereum Name Service domains
- **Contract Address Access**: Direct access to websites using contract addresses
- **Cross-Chain Support**: Access content across multiple EVM-compatible networks
- **Seamless Web3 Experience**: No additional extensions or plugins required

## Key Features

### 🌐 Native WTTP Support
- **Protocol Integration**: Built-in support for `wttp://` protocol
- **Automatic Resolution**: Seamless conversion between ENS domains and contract addresses
- **Range Request Support**: Efficient loading of large files with partial content delivery
- **Caching Headers**: Optimized performance with proper cache management

### 🔗 Multi-Protocol Support
- **WTTP Protocol**: Primary protocol for decentralized content (`wttp://`)
- **Standard Web**: Full support for traditional HTTP/HTTPS websites
- **IPFS Integration**: Support for IPFS content (v1.1+)

### ⚡ Performance Optimizations
- **Streaming Support**: Real-time content delivery for large files
- **CORS Enabled**: Proper cross-origin resource sharing support
- **Service Worker Support**: Advanced caching and offline capabilities
- **Fetch API Integration**: Modern web standards compliance

## Architecture

The WTTP Browser extends Min's architecture with:

1. **Protocol Handler**: Custom Electron protocol handlers for WTTP and Web3 schemes
2. **WTTP Handler Integration**: Direct integration with the `@wttp/handler` library
3. **Session Management**: Protocol registration across all browser sessions
4. **Error Handling**: Comprehensive error management for Web3 operations

## Use Cases

- **Decentralized Applications**: Access dApp frontends hosted on-chain
- **Censorship-Resistant Content**: Browse websites that can't be taken down
- **Web3 Development**: Test and deploy decentralized websites
- **Educational Content**: Access blockchain-hosted documentation and tutorials
- **Gaming**: Play Web3 games with on-chain assets and logic

## Next Steps

Ready to get started? Check out our [Installation Guide](/docs/browser/browser-installation) to download and set up the WTTP Browser, or explore [Usage Examples](/docs/browser/browser-usage) to see the browser in action.
