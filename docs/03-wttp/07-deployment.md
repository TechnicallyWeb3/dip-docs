---
id: wttp-deployment
title: WTTP Deployment
---

# WTTP Deployment Guide

This comprehensive guide covers all aspects of deploying WTTP Site contracts, from initial setup to production deployment and ongoing maintenance.

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For cloning the repository
- **Hardhat**: Will be installed as a dependency

### Required Accounts
- **Ethereum Wallet**: MetaMask, WalletConnect, or similar
- **RPC Provider**: Infura, Alchemy, or local node
- **Block Explorer API**: Etherscan, PolygonScan, etc. (for verification)

### Network Requirements
- **Testnet ETH**: For testing deployments
- **Mainnet ETH/MATIC**: For production deployments
- **Gas Estimation**: Understanding of gas costs

## Installation Methods

### Method 1: Clone Repository (Recommended)
```bash
# Clone the repository
git clone https://github.com/TechnicallyWeb3/wttp-site.git
cd wttp-site

# Install dependencies
npm install

# Compile contracts
npm run compile
```

### Method 2: NPM Package
```bash
# Install as npm package
npm install @wttp/site

# Configure Hardhat
# Add to hardhat.config.ts
import "@wttp/site";
```

## Environment Configuration

### 1. Create Environment File
```bash
# Create .env file
cp .env.template .env
```

### 2. Configure Environment Variables
```bash
# .env file contents
OWNER_MNEMONIC="your twelve word mnemonic phrase here"
ETHERSCAN_API_KEY="your_etherscan_api_key_here"
POLYGONSCAN_API_KEY="your_polygonscan_api_key_here"
```

### 3. Network Configuration
```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@wttp/site";

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      chainId: 11155111,
      accounts: process.env.OWNER_MNEMONIC ? [process.env.OWNER_MNEMONIC] : [],
    },
    polygon: {
      url: "https://polygon.publicnode.com",
      chainId: 137,
      accounts: process.env.OWNER_MNEMONIC ? [process.env.OWNER_MNEMONIC] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
    },
  },
};

export default config;
```

## Deployment Options

### 1. Quick Deployment (Zero Parameters)
Deploy with intelligent defaults:

```bash
# Deploy to localhost
npx hardhat site:deploy --network localhost

# Deploy to Sepolia testnet
npx hardhat site:deploy --network sepolia

# Deploy to Polygon mainnet
npx hardhat site:deploy --network polygon
```

### 2. Custom Configuration Deployment
Deploy with specific settings:

```bash
# Deploy with custom presets
npx hardhat site:deploy \
  --header-preset dynamic-api \
  --cors-preset allow-wttp \
  --cache-preset standard \
  --network sepolia
```

### 3. Advanced Deployment
Deploy with custom parameters:

```bash
# Deploy with custom owner
npx hardhat site:deploy \
  --owner 0x1234... \
  --network sepolia
```

## Deployment Presets

### Header Presets
Configure site behavior:

| Preset | Description | Use Case |
|--------|-------------|----------|
| `static-website` | Standard caching, same-origin CORS | Static websites, blogs |
| `dynamic-api` | No caching, flexible CORS | APIs, dynamic content |
| `immutable` | Long-term caching, immutable flag | Static assets, documentation |

### CORS Presets
Configure cross-origin access:

| Preset | Description | Use Case |
|--------|-------------|----------|
| `allow-all` | Allow all origins | Public websites |
| `same-origin` | Strict same-origin policy | Private applications |
| `allow-wttp` | Allow WTTP-powered sites | Federated applications |

### Cache Presets
Configure caching behavior:

| Preset | Description | Use Case |
|--------|-------------|----------|
| `aggressive` | 1 year cache | Static assets |
| `standard` | 1 hour cache | Dynamic content |
| `none` | No caching | Real-time data |

## Network-Specific Deployment

### Localhost Development
```bash
# Start local Hardhat node
npx hardhat node

# Deploy to localhost (in another terminal)
npx hardhat site:deploy --network localhost
```

### Sepolia Testnet
```bash
# Get test ETH from faucet
# https://sepoliafaucet.com

# Deploy to Sepolia
npx hardhat site:deploy --network sepolia

# Verify contract
npx hardhat verify --network sepolia <SITE_ADDRESS>
```

### Polygon Mainnet
```bash
# Ensure you have MATIC for gas
# Deploy to Polygon
npx hardhat site:deploy --network polygon

# Verify contract
npx hardhat verify --network polygon <SITE_ADDRESS>
```

## Post-Deployment Setup

### 1. Verify Deployment
```bash
# Test site functionality
npx hardhat site:fetch --site <SITE_ADDRESS> --network sepolia
```

### 2. Upload Initial Content
```bash
# Upload website files
npx hardhat site:upload \
  --site <SITE_ADDRESS> \
  --source ./public \
  --network sepolia
```

### 3. Configure Permissions
```typescript
// Configure site permissions
const site = new ethers.Contract(siteAddress, siteABI, signer);

// Create admin role
const adminRole = ethers.keccak256(ethers.toUtf8Bytes('/admin/*'));
await site.createResourceRole(adminRole);

// Grant admin access
await site.grantRole(adminRole, adminAddress);
```

## Production Deployment Checklist

### Pre-Deployment
- [ ] Test on localhost and testnet
- [ ] Verify all functionality works
- [ ] Check gas costs and optimization
- [ ] Review security settings
- [ ] Prepare backup and recovery plan

### Deployment
- [ ] Deploy to production network
- [ ] Verify contract deployment
- [ ] Upload initial content
- [ ] Configure permissions
- [ ] Test all functionality

### Post-Deployment
- [ ] Monitor site performance
- [ ] Set up monitoring and alerts
- [ ] Document deployment details
- [ ] Train team on site management
- [ ] Plan maintenance schedule

## Deployment Monitoring

### 1. Transaction Monitoring
```bash
# Monitor deployment transaction using block explorer
# Check transaction on Etherscan/PolygonScan
```

### 2. Site Health Checks
```typescript
// Check site health by testing basic functionality
const healthCheck = await site.HEAD({ path: '/' });
console.log('Site health status:', healthCheck.status);

// Monitor site performance by monitoring events
// Note: You'll need to implement event monitoring or use a service like The Graph
let resourceCount = 0;
site.on('PUTSuccess', () => {
  resourceCount++;
  console.log('Total resources:', resourceCount);
});
```

### 3. Error Monitoring
```typescript
// Set up error monitoring
const errorHandler = (error) => {
  console.error('Site error:', error);
  // Send to monitoring service
};

site.on('error', errorHandler);
```

## Troubleshooting Deployment Issues

### Common Problems

#### 1. Gas Estimation Failures
```bash
# Increase gas limit
npx hardhat site:deploy \
  --gas-limit 5000000 \
  --network sepolia
```

#### 2. Network Connection Issues
```bash
# Check network connectivity
npx hardhat node --network sepolia

# Verify RPC endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://ethereum-sepolia.publicnode.com
```

#### 3. Contract Verification Failures
```bash
# Verify with specific constructor arguments
npx hardhat verify \
  --network sepolia \
  --constructor-args <ARGS_FILE> \
  <SITE_ADDRESS>
```

### Debugging Tools

#### 1. Deployment Logs
```bash
# Enable verbose logging
DEBUG=hardhat:site npx hardhat site:deploy --network sepolia
```

#### 2. Contract Inspection
```bash
# Inspect deployed contract using block explorer
# Check contract on Etherscan/PolygonScan
```

#### 3. Gas Analysis
```bash
# Analyze gas usage using block explorer
# Check gas usage on transaction details
```

## Security Considerations

### 1. Private Key Management
- Use hardware wallets for production
- Never commit private keys to version control
- Use environment variables for sensitive data
- Implement key rotation policies

### 2. Access Control
- Implement least-privilege access
- Use multi-signature wallets for critical operations
- Regular security audits
- Monitor for unauthorized access

### 3. Contract Security
- Verify all contracts on block explorers
- Use audited dependencies
- Implement emergency pause mechanisms
- Regular security updates

## Maintenance and Updates

### 1. Regular Maintenance
```bash
# Check site health by testing functionality
npx hardhat site:fetch --site <SITE_ADDRESS> --network sepolia

# Update dependencies
npm update

# Recompile contracts
npm run compile
```

### 2. Content Updates
```bash
# Update site content
npx hardhat site:upload \
  --site <SITE_ADDRESS> \
  --source ./updated-content \
  --network sepolia
```

### 3. Contract Upgrades
```typescript
// Deploy new version
// Note: Contract upgrades require careful planning and migration
// You'll need to implement migration logic based on your specific needs

// Example: Deploy new site and migrate content
// This is a simplified example - actual migration would be more complex
const newSite = await deployNewSite();

// Migrate content by monitoring old site events and uploading to new site
// Note: You'll need to implement event monitoring or use a service like The Graph
```

## Cost Optimization

### 1. Gas Optimization
- Use appropriate chunk sizes
- Batch operations when possible
- Optimize contract code
- Use gas-efficient networks

### 2. Storage Optimization
- Compress content before uploading
- Remove unused content
- Use content deduplication
- Implement efficient caching

### 3. Network Selection
- Use testnets for development
- Choose cost-effective networks for production
- Monitor gas prices
- Implement gas price optimization

## Backup and Recovery

### 1. Site Backup
```typescript
// Export site data by monitoring contract events
// Note: You'll need to implement event monitoring or use a service like The Graph

const siteData = {
  siteAddress: site.address,
  resources: [],
  timestamp: Date.now()
};

// Monitor events to build backup
site.on('PUTSuccess', (sender, response) => {
  siteData.resources.push({
    path: response.head.metadata.properties.path,
    contentLength: response.head.metadata.properties.contentLength,
    contentType: response.head.metadata.properties.contentType,
    dataPoints: response.resource.dataPoints
  });
});

fs.writeFileSync('site-backup.json', JSON.stringify(siteData, null, 2));
```

### 2. Recovery Procedures
```typescript
// Restore from backup
const siteData = JSON.parse(fs.readFileSync('site-backup.json', 'utf8'));

for (const resource of siteData.resources) {
  const putRequest = {
    head: { path: resource.path },
    properties: {
      contentType: resource.contentType,
      contentLength: resource.contentLength
    },
    data: [] // Would need to reconstruct from dataPoints
  };
  await site.PUT(putRequest);
}
```

### 3. Disaster Recovery
- Maintain multiple backups
- Test recovery procedures
- Document recovery steps
- Train team on recovery processes

## Best Practices

### 1. Deployment Strategy
- Use blue-green deployments
- Implement rollback procedures
- Test thoroughly before production
- Monitor deployments closely

### 2. Security
- Follow security best practices
- Regular security audits
- Implement access controls
- Monitor for threats

### 3. Performance
- Optimize for your use case
- Monitor performance metrics
- Implement caching strategies
- Regular performance reviews

### 4. Documentation
- Document all deployments
- Maintain change logs
- Keep configuration up to date
- Train team members

## Related Documentation

- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
- [ESP Storage](/docs/esp/esp-storage) - Detailed storage mechanisms
