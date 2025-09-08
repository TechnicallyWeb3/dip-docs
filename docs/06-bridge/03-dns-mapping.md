---
id: bridge-dns-mapping
title: Bridge DNS Mapping
---

# Bridge DNS Mapping

DNS mapping allows you to configure how your domain routes to different decentralized resources through TXT record configuration. This provides flexible routing without requiring complex server-side configuration.

## TXT Record Format

The bridge uses TXT records to determine how to route requests to decentralized resources. The format is:

```
HOST=<hostname> CA=<contract_address> CHAIN=<chain_identifier>
```

### Parameter Details

#### HOST Parameter
Specifies which hostname this configuration applies to:

- `@` - Root domain (e.g., `yourdomain.com`)
- `www` - www subdomain (e.g., `www.yourdomain.com`)
- `dapp` - dApp subdomain (e.g., `dapp.yourdomain.com`)
- `api` - API subdomain (e.g., `api.yourdomain.com`)
- `*` - Wildcard (matches any subdomain)

#### CA Parameter
The contract address or ENS domain to route to:

- **Contract Address**: `0x1234567890abcdef1234567890abcdef12345678`
- **ENS Domain**: `mycontract.eth`
- **Partial Address**: `1234567890abcdef1234567890abcdef12345678` (without 0x prefix)

#### CHAIN Parameter
The blockchain network identifier:

- **Chain Aliases**: `ethereum`, `polygon`, `arbitrum`, `optimism`, `base`
- **Chain IDs**: `1`, `137`, `42161`, `10`, `8453`
- **Custom Networks**: Use numeric chain ID for custom networks

## Configuration Examples

### Basic Setup

**Single Domain Configuration**
```
Type: TXT
Name: @
Value: HOST=@ CA=0x1234...5678 CHAIN=ethereum
```

**www Subdomain**
```
Type: TXT
Name: www
Value: HOST=www CA=0x1234...5678 CHAIN=ethereum
```

### Multi-Subdomain Setup

**Different Contracts per Subdomain**
```
# Main site
HOST=@ CA=0x1234...5678 CHAIN=ethereum

# dApp interface
HOST=dapp CA=0xabcd...efgh CHAIN=polygon

# API endpoint
HOST=api CA=myapi.eth CHAIN=ethereum

# Admin panel
HOST=admin CA=0x9999...8888 CHAIN=arbitrum
```

### ENS Integration

**Using ENS Domains**
```
HOST=@ CA=myproject.eth CHAIN=ethereum
HOST=dapp CA=myproject-dapp.eth CHAIN=polygon
HOST=api CA=myproject-api.eth CHAIN=ethereum
```

### Wildcard Configuration

**Dynamic Subdomains**
```
# Catch-all for any subdomain
HOST=* CA=0x1234...5678 CHAIN=ethereum

# Specific subdomain patterns
HOST=user-* CA=0xuser...contract CHAIN=ethereum
HOST=app-* CA=0xapp...contract CHAIN=polygon
```

## Advanced Routing

### Path-Based Routing

The bridge supports path-based routing within the same domain:

```
# Route /api/* to API contract
HOST=@ CA=0xapi...contract CHAIN=ethereum
# Path: /api/users -> API contract

# Route /dapp/* to dApp contract  
HOST=@ CA=0xdapp...contract CHAIN=polygon
# Path: /dapp/trade -> dApp contract
```

### Chain-Specific Routing

**Multi-Chain Support**
```
# Ethereum mainnet
HOST=@ CA=0xeth...contract CHAIN=ethereum

# Polygon
HOST=@ CA=0xpoly...contract CHAIN=polygon

# Arbitrum
HOST=@ CA=0xarb...contract CHAIN=arbitrum
```

## Validation and Testing

### TXT Record Validation

Verify your TXT record configuration:

```bash
# Check TXT record
nslookup -type=TXT yourdomain.com

# Check specific subdomain
nslookup -type=TXT dapp.yourdomain.com
```

### Expected Output

```
yourdomain.com text = "HOST=@ CA=0x1234567890abcdef1234567890abcdef12345678 CHAIN=ethereum"
```

### Common Configuration Errors

**Missing Parameters**
```
❌ HOST=@ CA=0x1234...5678
✅ HOST=@ CA=0x1234...5678 CHAIN=ethereum
```

**Invalid Chain**
```
❌ HOST=@ CA=0x1234...5678 CHAIN=invalid
✅ HOST=@ CA=0x1234...5678 CHAIN=ethereum
```

**Malformed Address**
```
❌ HOST=@ CA=0x1234...5678... CHAIN=ethereum
✅ HOST=@ CA=0x1234567890abcdef1234567890abcdef12345678 CHAIN=ethereum
```

## Troubleshooting

### DNS Propagation Issues

1. **Wait for Propagation**: DNS changes can take up to 24 hours
2. **Check TTL**: Lower TTL values for faster updates
3. **Verify Nameservers**: Ensure your domain uses the correct nameservers

### Configuration Not Working

1. **Check Format**: Ensure exact format with spaces
2. **Verify Chain**: Use supported chain aliases or IDs
3. **Test Address**: Verify contract address is valid and deployed

### Performance Optimization

1. **Use Chain Aliases**: Faster than numeric chain IDs
2. **Optimize TTL**: Balance between speed and stability
3. **Cache Configuration**: Bridge caches TXT records for performance
