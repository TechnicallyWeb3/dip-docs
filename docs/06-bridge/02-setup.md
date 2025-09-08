---
id: bridge-setup
title: Bridge Setup
---

# Bridge Setup

This guide walks you through setting up the DIP Bridge for your domain, enabling HTTPS access to decentralized resources.

## Prerequisites

- A domain name you control
- Access to your domain's DNS management panel
- Basic understanding of DNS records

## Step 1: DNS Configuration

### Point Your Domain to Bridge Servers

Configure your domain's A record to point to our bridge servers:

```
Type: A
Name: @ (or your subdomain)
Value: [Bridge Server IP]
TTL: 300 (5 minutes)
```

For subdomains like `dapp.yourdomain.com`:

```
Type: A
Name: dapp
Value: [Bridge Server IP]
TTL: 300
```

## Step 2: TXT Record Configuration

Create a TXT record with the following format:

```
Type: TXT
Name: @ (or your subdomain)
Value: HOST=@ CA=0x1234...5678 CHAIN=ethereum
TTL: 300
```

### TXT Record Parameters

| Parameter | Description | Examples |
|-----------|-------------|----------|
| `HOST` | The hostname being configured | `@`, `www`, `dapp`, `api` |
| `CA` | Contract address or ENS domain | `0x1234...5678`, `mycontract.eth` |
| `CHAIN` | Blockchain network | `ethereum`, `polygon`, `1`, `137` |

### Chain Aliases

| Alias | Chain ID | Network |
|-------|----------|---------|
| `ethereum` | 1 | Ethereum Mainnet |
| `polygon` | 137 | Polygon |
| `arbitrum` | 42161 | Arbitrum One |
| `optimism` | 10 | Optimism |
| `base` | 8453 | Base |

## Step 3: Verify Configuration

### Test Your Setup

1. **DNS Propagation**: Wait 5-10 minutes for DNS changes to propagate
2. **TXT Record Check**: Verify your TXT record is visible:
   ```bash
   nslookup -type=TXT yourdomain.com
   ```
3. **HTTPS Access**: Visit `https://yourdomain.com` to test

### Common Issues

**TXT Record Not Found**
- Ensure the TXT record name matches your domain/subdomain
- Check that the record has propagated (can take up to 24 hours)

**Invalid Format**
- Verify the TXT record format: `HOST=@ CA=0x... CHAIN=ethereum`
- Ensure no extra spaces or characters

**Wrong Chain**
- Double-check the CHAIN parameter matches your contract's network
- Use chain aliases or numeric chain IDs

## Step 4: Advanced Configuration

### Multiple Subdomains

Configure different subdomains for different contracts:

```
# Main domain
HOST=@ CA=0x1234...5678 CHAIN=ethereum

# dApp subdomain
HOST=dapp CA=0xabcd...efgh CHAIN=polygon

# API subdomain
HOST=api CA=mycontract.eth CHAIN=ethereum
```

### Wildcard Subdomains

For dynamic subdomains, use wildcard configuration:

```
Type: A
Name: *
Value: [Bridge Server IP]

Type: TXT
Name: *
Value: HOST=* CA=0x1234...5678 CHAIN=ethereum
```

## Next Steps

Once your basic setup is complete, you can:

- [Configure DNS Mapping](./03-dns-mapping.md) for advanced routing
- Set up [Premium DNS Management](./04-premium-dns.md) for full control
- Learn about [wURL Contract Access](./05-wurl-access.md) for direct contract access
