---
id: browser-usage
title: Browser Usage
---

# Browser Usage

This guide shows you how to use the WTTP Browser to access decentralized websites and applications. Learn about URL formats, explore live examples, and discover the full potential of Web3 browsing.

## URL Formats

The WTTP Browser supports multiple URL formats for accessing decentralized content:

### Basic WTTP URLs

```
wttp://[domain].ens(:chain)(/path)
```

**Components**:
- **`domain.ens`**: ENS domain name or contract address
- **`:chain`**: Optional chain alias (defaults to Sepolia)
- **`/path`**: Optional path to specific resource

### Supported Protocols

| Protocol | Description | Example |
|----------|-------------|---------|
| `wttp://` | WTTP protocol for decentralized content | `wttp://etherdoom.eth` |

### Chain Aliases

The browser supports these chain aliases (defaults to Sepolia if not specified):

| Alias | Chain ID | Network | Example Format |
|-------|----------|---------|----------------|
| `sepolia` | 11155111 | Ethereum Sepolia | `wttp://[domain].eth:sepolia` |
| `ethereum` | 1 | Ethereum Mainnet | `wttp://[domain].eth:ethereum` |
| `polygon` | 137 | Polygon | `wttp://[domain].eth:polygon` |
| `base` | 8453 | Base Network | `wttp://[domain].eth:base` |
| `arbitrum` | 42161 | Arbitrum One | `wttp://[domain].eth:arbitrum` |

**Note**: The examples above show the URL format for different chains. Individual sites may not be deployed on all networks - developers can choose which chains to deploy their WTTP sites on.

## Live Examples

Try these live Web3 sites hosted on Sepolia testnet:

### 🎮 Games

#### EtherDoom
```
wttp://etherdoom.eth
```
A classic Doom-style game with Web3 integration, featuring on-chain assets and decentralized gameplay mechanics.

#### Hex2048
```
wttp://hex2048.eth
```
A Web3 version of the popular 2048 puzzle game, with blockchain-based scoring and achievements.

#### Minesweep
```
wttp://minesweep.eth
```
The classic minesweeper game reimagined for Web3, with decentralized leaderboards and rewards.

#### HexGL
```
wttp://hexgl.eth
```
A futuristic racing game built with Three.js, featuring Web3 integration for car customization and racing rewards.

#### Sokoban
```
wttp://sokoban.eth
```
A puzzle game where you push boxes to their destinations, with Web3 features for level sharing and achievements.

### 🚀 Coming Soon

Additional Web3 applications are being developed and will be available soon:

- **Web3 Development Tools**: A collection of Web3 development utilities and debugging tools
- **Decentralized Calculator**: A simple calculator application demonstrating basic Web3 functionality
- **Interactive Documentation**: Interactive documentation and tutorials for the WTTP protocol
- **Web3 Tutorials**: Step-by-step guides for building decentralized applications

## URL Examples

### ENS Domain Examples

```bash
# Basic ENS domain (uses default Sepolia chain)
wttp://etherdoom.eth

# ENS domain with specific chain
wttp://etherdoom.eth:ethereum

# ENS domain with path
wttp://etherdoom.eth/game

# ENS domain with chain and path
wttp://etherdoom.eth:ethereum/game/level1
```

### Contract Address Examples

```bash
# Contract address (temporary workaround format)
wttp://0x1234567890abcdef1234567890abcdef12345678.0xcontractaddress

# Contract address with chain
wttp://0x1234567890abcdef1234567890abcdef12345678.0xcontractaddress:sepolia

# Contract address with path
wttp://0x1234567890abcdef1234567890abcdef12345678.0xcontractaddress/index.html
```


## Navigation Tips

### Address Bar Usage

1. **Type WTTP URLs**: Simply type `wttp://` URLs in the address bar
2. **Auto-completion**: The browser will suggest previously visited WTTP sites
3. **Bookmarks**: Save your favorite Web3 sites for quick access
4. **History**: WTTP sites appear in your browsing history

### Tab Management

- **New Tabs**: Open new tabs with `Ctrl+T` (or `Cmd+T` on Mac)
- **Tab Groups**: Organize Web3 sites using Min's task feature
- **Multiple Sites**: Open multiple WTTP sites simultaneously

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Focus address bar |
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab |
| `Ctrl+Shift+T` | Reopen closed tab |
| `F5` | Refresh page |
| `Ctrl+R` | Reload page |

## Advanced Usage

### Custom RPC Endpoints

For development or custom networks, you can configure RPC endpoints:

```bash
# Custom RPC endpoint
wttp://etherdoom.eth:custom

# With specific RPC URL
wttp://etherdoom.eth:custom?rpc=https://your-rpc-endpoint.com
```

### Debug Mode

Enable debug mode to see detailed information about WTTP requests:

1. **Open Developer Tools**: Press `F12`
2. **Console Tab**: View WTTP protocol logs
3. **Network Tab**: Monitor blockchain requests

### Performance Optimization

- **Caching**: WTTP content is cached for better performance
- **Streaming**: Large files are streamed for faster loading
- **Range Requests**: Partial content loading for media files

## Troubleshooting

### Common Issues

#### Site Not Loading
- **Check Network**: Ensure you have internet connection
- **Verify URL**: Make sure the ENS domain or contract address is correct
- **Chain Issues**: Try specifying a different chain alias
- **RPC Problems**: The RPC endpoint might be down

#### Slow Loading
- **Network Congestion**: Blockchain networks can be slow during high usage
- **Large Files**: Some content may take time to load
- **Cache Issues**: Try refreshing the page

#### Protocol Errors
- **Invalid URL**: Check URL format and syntax
- **Unsupported Chain**: Verify the chain alias is supported
- **Contract Issues**: The smart contract might not be deployed

### Getting Help

- **Error Messages**: Check the browser console for detailed error messages
- **Documentation**: Refer to the [WTTP Documentation](/docs/wttp/wttp-overview)
- **Community**: Join our Discord for support
- **GitHub**: Report issues on our [GitHub repository](https://github.com/TechnicallyWeb3/min-web3)

## Best Practices

### Security
- **Verify URLs**: Always double-check WTTP URLs before visiting
- **Trust Sources**: Only visit sites from trusted sources
- **Update Browser**: Keep your browser updated for security patches

### Performance
- **Use Bookmarks**: Save frequently visited sites
- **Close Unused Tabs**: Free up memory by closing unused tabs
- **Clear Cache**: Periodically clear browser cache

### Development
- **Test Locally**: Use localhost for development
- **Debug Mode**: Enable debug mode for troubleshooting
- **Monitor Console**: Check browser console for errors

## Next Steps

Now that you know how to use the WTTP Browser:

1. **Explore Examples**: Try the live examples above
2. **Deploy Your Own**: Learn how to [deploy WTTP sites](/docs/wttp/wttp-deployment)
3. **Build Applications**: Use the [WTTP Handler](/docs/handler/handler-overview) in your projects
4. **Join Community**: Connect with other Web3 developers

The WTTP Browser opens up a new world of decentralized web browsing. Start exploring and building the future of the internet!
