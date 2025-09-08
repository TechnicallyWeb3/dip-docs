---
id: bridge-wurl-access
title: wURL Contract Access
---

# wURL Contract Access

wURL (Web3 URL) provides direct access to smart contracts through the bridge without requiring domain registration or subscription. This universal access method allows anyone to interact with decentralized resources using a simple URL format.

## What is wURL?

wURL is a standardized way to access smart contracts through HTTPS using a URL path format. It provides universal access to any deployed contract regardless of registration status or subscription level.

### URL Format

```
https://wttp.page/w/{chain_id}/{contract_address}/{path}
```

**Parameters:**
- `chain_id`: Blockchain network identifier (1, 137, 42161, etc.)
- `contract_address`: Smart contract address (with or without 0x prefix)
- `path`: Optional path for specific contract methods or data

## Supported Networks

### Mainnet Networks

| Network | Chain ID | Alias | Example |
|---------|----------|-------|---------|
| Ethereum | 1 | `eth` | `w/1/0x1234...5678` |
| Polygon | 137 | `polygon` | `w/137/0x1234...5678` |
| Arbitrum | 42161 | `arbitrum` | `w/42161/0x1234...5678` |
| Optimism | 10 | `optimism` | `w/10/0x1234...5678` |
| Base | 8453 | `base` | `w/8453/0x1234...5678` |
| BSC | 56 | `bsc` | `w/56/0x1234...5678` |

### Testnet Networks

| Network | Chain ID | Alias | Example |
|---------|----------|-------|---------|
| Goerli | 5 | `goerli` | `w/5/0x1234...5678` |
| Sepolia | 11155111 | `sepolia` | `w/11155111/0x1234...5678` |
| Mumbai | 80001 | `mumbai` | `w/80001/0x1234...5678` |

## Usage Examples

### Basic Contract Access

**Ethereum Contract**
```
https://wttp.page/w/1/0x1234567890abcdef1234567890abcdef12345678
```

**Polygon Contract**
```
https://wttp.page/w/137/0x1234567890abcdef1234567890abcdef12345678
```

**With 0x Prefix**
```
https://wttp.page/w/1/0x1234567890abcdef1234567890abcdef12345678
```

**Without 0x Prefix**
```
https://wttp.page/w/1/1234567890abcdef1234567890abcdef12345678
```

### Path-Based Access

**Specific Contract Method**
```
https://wttp.page/w/1/0x1234...5678/balance/0xabcd...efgh
```

**Contract Data Retrieval**
```
https://wttp.page/w/1/0x1234...5678/data/metadata
```

**API Endpoints**
```
https://wttp.page/w/1/0x1234...5678/api/users
https://wttp.page/w/1/0x1234...5678/api/transactions
```

### ENS Integration

**ENS Domain Resolution**
```
https://wttp.page/w/1/ens/mycontract.eth
https://wttp.page/w/1/ens/mycontract.eth/api/data
```

## Contract Interaction

### Reading Contract Data

**View Function Calls**
```javascript
// Get contract balance
fetch('https://wttp.page/w/1/0x1234...5678/balance')
  .then(response => response.json())
  .then(data => console.log(data));

// Get token metadata
fetch('https://wttp.page/w/1/0x1234...5678/metadata')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Contract State Queries**
```javascript
// Query specific function
const result = await fetch('https://wttp.page/w/1/0x1234...5678/name');
const contractName = await result.text();
```

### Writing to Contracts

**Transaction Submission**
```javascript
// Submit transaction
const txData = {
  to: '0x1234...5678',
  data: '0x...',
  value: '0x0'
};

const response = await fetch('https://wttp.page/w/1/0x1234...5678/transact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(txData)
});
```

## Advanced Features

### Caching and Performance

**Cache Headers**
```
Cache-Control: public, max-age=300
ETag: "contract-version-123"
Last-Modified: Wed, 01 Jan 2024 00:00:00 GMT
```

**Conditional Requests**
```javascript
// Use ETag for conditional requests
const response = await fetch('https://wttp.page/w/1/0x1234...5678/data', {
  headers: {
    'If-None-Match': '"contract-version-123"'
  }
});
```

### Error Handling

**HTTP Status Codes**
- `200 OK`: Successful request
- `400 Bad Request`: Invalid contract address or chain ID
- `404 Not Found`: Contract not found or not accessible
- `500 Internal Server Error`: Bridge server error
- `503 Service Unavailable`: Network temporarily unavailable

**Error Response Format**
```json
{
  "error": "Contract not found",
  "code": "CONTRACT_NOT_FOUND",
  "details": {
    "chain_id": "1",
    "contract_address": "0x1234...5678"
  }
}
```

### Rate Limiting

**Rate Limits**
- **Free Tier**: 100 requests per minute
- **Premium Tier**: 1000 requests per minute
- **Enterprise**: Custom limits

**Rate Limit Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Integration Examples

### React Component

```jsx
import React, { useState, useEffect } from 'react';

function ContractData({ contractAddress, chainId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://bridge.dip.network/w/${chainId}/${contractAddress}/data`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractAddress, chainId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h3>Contract Data</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Node.js Integration

```javascript
const axios = require('axios');

class DIPBridgeClient {
  constructor(baseUrl = 'https://wttp.page') {
    this.baseUrl = baseUrl;
  }

  async getContractData(chainId, contractAddress, path = '') {
    const url = `${this.baseUrl}/w/${chainId}/${contractAddress}/${path}`;
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch contract data: ${error.message}`);
    }
  }

  async submitTransaction(chainId, contractAddress, txData) {
    const url = `${this.baseUrl}/w/${chainId}/${contractAddress}/transact`;
    
    try {
      const response = await axios.post(url, txData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit transaction: ${error.message}`);
    }
  }
}

// Usage
const client = new DIPBridgeClient();
const data = await client.getContractData(1, '0x1234...5678', 'balance');
```

### Python Integration

```python
import requests
import json

class DIPBridgeClient:
    def __init__(self, base_url='https://wttp.page'):
        self.base_url = base_url
    
    def get_contract_data(self, chain_id, contract_address, path=''):
        url = f"{self.base_url}/w/{chain_id}/{contract_address}/{path}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch contract data: {e}")
    
    def submit_transaction(self, chain_id, contract_address, tx_data):
        url = f"{self.base_url}/w/{chain_id}/{contract_address}/transact"
        
        try:
            response = requests.post(url, json=tx_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to submit transaction: {e}")

# Usage
client = DIPBridgeClient()
data = client.get_contract_data(1, '0x1234...5678', 'balance')
```

## Security Considerations

### Contract Validation
- All contract addresses are validated before processing
- Invalid addresses return 400 Bad Request
- Malformed requests are rejected

### Rate Limiting
- Implemented to prevent abuse
- IP-based rate limiting
- Graceful degradation under load

### Data Integrity
- Contract data is fetched directly from blockchain
- No data modification or caching of sensitive information
- HTTPS encryption for all communications

## Troubleshooting

### Common Issues

**Contract Not Found**
- Verify contract address is correct
- Check if contract is deployed on specified chain
- Ensure contract is not a proxy without implementation

**Network Issues**
- Check chain ID is supported
- Verify network connectivity
- Try different network endpoints

**Rate Limiting**
- Implement exponential backoff
- Use caching to reduce requests
- Consider upgrading to premium tier

### Debug Information

**Enable Debug Headers**
```javascript
const response = await fetch('https://wttp.page/w/1/0x1234...5678/data', {
  headers: {
    'X-Debug': 'true'
  }
});

// Response includes debug information
console.log(response.headers.get('X-Debug-Info'));
```
