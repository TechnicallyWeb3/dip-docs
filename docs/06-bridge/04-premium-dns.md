---
id: bridge-premium-dns
title: Premium DNS Management
---

# Premium DNS Management

Premium DNS Management provides full control over your domain's DNS configuration, eliminating the need for manual TXT record management. This service offers native Web3 record management and comprehensive domain services.

## Features

### Full DNS Control
- **Complete DNS Management**: Manage all DNS records through our platform
- **Real-time Updates**: Instant DNS changes without propagation delays
- **Advanced Routing**: Complex routing rules and load balancing
- **Health Monitoring**: Automatic failover and health checks

### Web3 Native Records
- **No TXT Records**: Direct Web3 record management without TXT record complexity
- **Visual Interface**: User-friendly dashboard for record management
- **Bulk Operations**: Manage multiple records simultaneously
- **Version Control**: Track and revert DNS changes

### Domain Services
- **Domain Purchasing**: Buy both Web2 and Web3 domains
- **Domain Transfers**: Seamless domain migration
- **Renewal Management**: Automatic renewal and notifications
- **Multi-Domain Support**: Manage multiple domains from one dashboard

## Getting Started

### 1. Activate Premium DNS

Enable premium DNS management for your domain:

1. Navigate to your domain settings
2. Click "Upgrade to Premium DNS"
3. Complete the subscription process
4. Verify domain ownership

### 2. Configure Web3 Records

**Add Contract Record**
```
Type: Web3 Contract
Name: @
Contract: 0x1234...5678
Chain: Ethereum
Status: Active
```

**Add ENS Record**
```
Type: Web3 ENS
Name: dapp
ENS Domain: myproject.eth
Chain: Ethereum
Status: Active
```

### 3. Advanced Routing

**Path-Based Routing**
```
Pattern: /api/*
Target: 0xapi...contract
Chain: Ethereum
Priority: 1
```

**Subdomain Routing**
```
Pattern: *.api
Target: 0xapi...contract
Chain: Polygon
Priority: 2
```

## Web3 Record Types

### Contract Records
Direct contract address routing:

```
Type: Contract
Name: @
Address: 0x1234567890abcdef1234567890abcdef12345678
Chain: ethereum
```

### ENS Records
ENS domain resolution:

```
Type: ENS
Name: dapp
Domain: myproject.eth
Chain: ethereum
```

### Multi-Chain Records
Cross-chain contract routing:

```
Type: Multi-Chain
Name: @
Contracts:
  - Chain: ethereum, Address: 0x1234...5678
  - Chain: polygon, Address: 0xabcd...efgh
  - Chain: arbitrum, Address: 0x9999...8888
```

## Domain Management

### Domain Purchasing

**Web2 Domains**
- Traditional TLD support (.com, .org, .net, etc.)
- Country code TLDs (.us, .uk, .de, etc.)
- New gTLDs (.app, .dev, .crypto, etc.)

**Web3 Domains**
- ENS domains (.eth)
- Unstoppable Domains (.crypto, .nft, .dao, etc.)
- Handshake domains (.hns)

### Domain Transfers

**Incoming Transfers**
1. Obtain transfer authorization code
2. Initiate transfer through our platform
3. Approve transfer with current registrar
4. Complete transfer process

**Outgoing Transfers**
1. Generate transfer authorization code
2. Provide code to new registrar
3. Approve transfer request
4. Complete transfer process

## Advanced Features

### Load Balancing

**Round Robin**
```
Target 1: 0xcontract1... CHAIN=ethereum Weight=50
Target 2: 0xcontract2... CHAIN=polygon Weight=50
```

**Geographic Routing**
```
US: 0xus...contract CHAIN=ethereum
EU: 0xeu...contract CHAIN=polygon
AS: 0xas...contract CHAIN=arbitrum
```

### Health Monitoring

**Health Checks**
- Contract availability monitoring
- Response time tracking
- Automatic failover
- Alert notifications

**Failover Configuration**
```
Primary: 0xprimary...contract CHAIN=ethereum
Backup: 0xbackup...contract CHAIN=polygon
Threshold: 5 failures
Timeout: 30 seconds
```

### Analytics and Monitoring

**Traffic Analytics**
- Request volume and patterns
- Geographic distribution
- Performance metrics
- Error rates and types

**Real-time Monitoring**
- Live traffic monitoring
- Performance dashboards
- Alert management
- Historical data

## API Management

### REST API

**List Records**
```bash
GET /api/v1/domains/{domain}/records
Authorization: Bearer {token}
```

**Create Record**
```bash
POST /api/v1/domains/{domain}/records
Content-Type: application/json

{
  "type": "contract",
  "name": "@",
  "address": "0x1234...5678",
  "chain": "ethereum"
}
```

**Update Record**
```bash
PUT /api/v1/domains/{domain}/records/{id}
Content-Type: application/json

{
  "address": "0xabcd...efgh",
  "chain": "polygon"
}
```

### Webhook Integration

**Record Change Notifications**
```json
{
  "event": "record.updated",
  "domain": "example.com",
  "record_id": "12345",
  "changes": {
    "address": "0x1234...5678",
    "chain": "ethereum"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Pricing and Plans

### Basic Plan
- Up to 5 domains
- 100 DNS records
- Basic analytics
- Email support

### Professional Plan
- Up to 25 domains
- 500 DNS records
- Advanced analytics
- Priority support
- API access

### Enterprise Plan
- Unlimited domains
- Unlimited records
- Custom analytics
- Dedicated support
- SLA guarantees

## Migration from TXT Records

### Automatic Migration

1. **Scan Existing Records**: Automatically detect TXT records
2. **Convert to Native**: Transform TXT records to Web3 records
3. **Validate Configuration**: Ensure all records work correctly
4. **Remove TXT Records**: Clean up old TXT records

### Manual Migration

**Step 1: Export TXT Records**
```bash
# Export current TXT records
dig TXT yourdomain.com +short
```

**Step 2: Create Web3 Records**
- Use the dashboard to create equivalent Web3 records
- Test each record individually
- Verify functionality

**Step 3: Remove TXT Records**
- Delete old TXT records
- Monitor for any issues
- Complete migration

## Support and Documentation

### Getting Help
- **Documentation**: Comprehensive guides and tutorials
- **Community**: Discord server for user support
- **Support Tickets**: Direct support for premium users
- **Status Page**: Real-time service status

### Resources
- [API Documentation](./05-api-reference.md)
- [Migration Guide](./06-migration.md)
- [Best Practices](./07-best-practices.md)
- [Troubleshooting](./08-troubleshooting.md)
