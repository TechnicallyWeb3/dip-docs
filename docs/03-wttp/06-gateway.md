---
id: wttp-gateway
title: WTTP Gateway
---

# WTTP Gateway - Optimized Content Delivery

The WTTP Gateway is a specialized smart contract designed to optimize content delivery from WTTP sites for off-chain applications. It provides a single-call interface that eliminates the need for multiple blockchain transactions when fetching content, especially large files stored across multiple data points.

> **💡 For Most Developers**: Consider using the [WTTP Handler](/docs/handler/handler-overview) instead, which provides automatic contract selection, redirect handling, and a simplified API. The handler intelligently chooses between sites and gateway based on your needs.

## What is WTTP Gateway?

The WTTP Gateway acts as an intermediary layer between off-chain applications and WTTP sites, providing:

- **Single Call Efficiency**: Fetch content with one blockchain call instead of N+1 calls
- **Advanced Range Requests**: Support for both chunk ranges and byte ranges
- **Content Verification**: Built-in data integrity checking at the chunk level
- **Automatic Assembly**: Seamlessly combines data from multiple ESP data points

## Architecture Overview

```
┌────────────────────────────┐
│    Off-chain Application   │  ← Your dApp, website, or API
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     WTTP Gateway           │  ← Optimized content delivery
│  • Single blockchain call  │
│  • Byte range processing   │
│  • Data point assembly     │
│  • Content verification    │
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     WTTP Sites             │  ← Multiple sites accessible
│  • Content management      │
│  • Permission control      │
│  • Metadata storage        │
└──────────────┬─────────────┘
               │
┌──────────────┴─────────────┐
│     ESP DataPointStorage   │  ← Raw content storage
└────────────────────────────┘
```

## Key Benefits

### Performance Optimization
- **N+1 Call Reduction**: Instead of calling the site (1 call) + each data point (N calls), the gateway does everything in a single call
- **Efficient Range Requests**: Fetch only the specific bytes you need from large files
- **Automatic Chunk Assembly**: Seamlessly combines data from multiple chunks

### Content Verification
- **Chunk-Level Validation**: Get exact sizes for each data point to verify content integrity
- **Hash Verification**: Calculate and verify content hashes at the chunk level
- **Tamper Detection**: Ensure data hasn't been modified since upload

### Developer Experience
- **Simplified Integration**: Easy-to-use interface for off-chain applications
- **Familiar HTTP Semantics**: Standard HTTP methods with blockchain benefits
- **Comprehensive Error Handling**: Clear error messages and status codes

## Gateway Methods

### OPTIONS
**Purpose**: Discover allowed methods and CORS policies  
**Gas Cost**: Low (read-only)  
**Returns**: `OPTIONSResponse` with allowed methods

```typescript
const response = await gateway.OPTIONS(siteAddress, '/api/data');
console.log(response.allow); // Bitmask of allowed methods
console.log(response.status); // Response status
```

### HEAD
**Purpose**: Retrieve metadata without downloading content  
**Gas Cost**: Low (read-only)  
**Returns**: `HEADResponse` with headers and metadata

```typescript
const headRequest: HEADRequest = {
  path: '/index.html',
  ifModifiedSince: 0,
  ifNoneMatch: ethers.ZeroHash
};

const response = await gateway.HEAD(siteAddress, headRequest);
console.log(response.status);     // 200, 304, 404, etc.
console.log(response.etag);       // Content hash for caching
console.log(response.metadata);   // File metadata
```

### LOCATE (Enhanced)
**Purpose**: Locate resources with detailed data point information  
**Gas Cost**: Medium (reads from multiple contracts)  
**Returns**: `LOCATEResponseSecure` with data point sizes and structure

```typescript
const locateRequest: LOCATERequest = {
  head: { 
    path: '/large-file.pdf',
    ifModifiedSince: 0,
    ifNoneMatch: ethers.ZeroHash
  },
  rangeChunks: { start: 0, end: 0 } // All chunks
};

const response = await gateway.LOCATE(siteAddress, locateRequest);
console.log(response.locate.resource.dataPoints); // Data point addresses
console.log(response.structure.sizes);            // Individual chunk sizes
console.log(response.structure.totalSize);        // Total file size
```

**Key Benefits**:
- **Content Verification**: Get exact chunk sizes for hash verification
- **Range Planning**: Understand file structure before making byte range requests
- **Data Integrity**: Verify each chunk hasn't been tampered with

### GET (Enhanced)
**Purpose**: Retrieve content with optimized byte range support  
**Gas Cost**: Medium to High (depends on content size and range)  
**Returns**: `GETResponse` with assembled content

```typescript
const getRequest: GETRequest = {
  locate: {
    head: { 
      path: '/large-file.pdf',
      ifModifiedSince: 0,
      ifNoneMatch: ethers.ZeroHash
    },
    rangeChunks: { start: 0, end: 0 } // All chunks
  },
  rangeBytes: { start: 1024, end: 2047 } // Specific byte range
};

const response = await gateway.GET(siteAddress, getRequest);
console.log(response.head.status);     // 200, 206, 404, etc.
console.log(response.body.data);       // Requested byte range
console.log(response.body.sizes);      // Data point size information
```

## Range Request System

The gateway supports two types of ranges for maximum flexibility:

### Chunk Ranges
Select which data points to fetch:

```typescript
// Fetch chunks 2-4 (zero-indexed)
const chunkRange = { start: 2, end: 4 };

// Fetch all chunks
const allChunks = { start: 0, end: 0 };

// Fetch last 3 chunks (if you know total count)
const lastChunks = { start: -3, end: -1 };
```

### Byte Ranges
Select specific bytes within the content:

```typescript
// Fetch bytes 1024-2047
const byteRange = { start: 1024, end: 2047 };

// Fetch first 1KB
const firstKB = { start: 0, end: 1023 };

// Fetch last 512 bytes
const lastBytes = { start: -512, end: -1 };

// Fetch single byte
const singleByte = { start: 100, end: 100 };
```

### Combined Ranges
Use both chunk and byte ranges for maximum efficiency:

```typescript
const getRequest: GETRequest = {
  locate: {
    head: { path: '/large-file.pdf' },
    rangeChunks: { start: 1, end: 3 } // Only chunks 1-3
  },
  rangeBytes: { start: 500, end: 1500 } // Bytes 500-1500 within those chunks
};
```

## Content Verification

The gateway provides built-in content verification capabilities:

### Chunk Size Verification
```typescript
const response = await gateway.LOCATE(siteAddress, locateRequest);
const expectedSizes = [1024, 1024, 512]; // Expected chunk sizes
const actualSizes = response.structure.sizes;

// Verify each chunk size
for (let i = 0; i < expectedSizes.length; i++) {
  if (actualSizes[i] !== expectedSizes[i]) {
    throw new Error(`Chunk ${i} size mismatch`);
  }
}
```

### Content Hash Verification
```typescript
// Get content and verify hash
const response = await gateway.GET(siteAddress, getRequest);
const content = response.body.data;
const actualHash = ethers.keccak256(content);
const expectedHash = response.head.etag;

if (actualHash !== expectedHash) {
  throw new Error('Content hash mismatch');
}
```

## Integration Examples

### Using WTTP Handler (Recommended)
```typescript
import { WTTPHandler } from '@wttp/handler';

// Initialize handler (automatically selects best contract)
const handler = new WTTPHandler({
  provider: ethers.provider,
  gateway: GATEWAY_ADDRESS, // Optional
  site: SITE_ADDRESS        // Optional
});

// Fetch content (handler manages everything)
const content = await handler.fetch('/index.html');
console.log(content);

// Fetch with range request
const partialContent = await handler.fetch('/large-file.pdf', {
  range: { start: 0, end: 1023 }
});
```

### Using WTTP Gateway Directly
```typescript
import { WTTPGateway } from '@wttp/gateway';

// Connect to gateway
const gateway = new ethers.Contract(
  GATEWAY_ADDRESS,
  WTTPGateway.abi,
  provider
);

// Fetch entire file
const response = await gateway.GET(siteAddress, {
  locate: {
    head: { path: '/index.html' },
    rangeChunks: { start: 0, end: 0 }
  },
  rangeBytes: { start: 0, end: 0 }
});

const content = ethers.toUtf8String(response.body.data);
console.log(content);
```

### Streaming Large Files
```typescript
async function streamLargeFile(siteAddress: string, path: string, chunkSize: number = 1024) {
  // First, get file info
  const locateResponse = await gateway.LOCATE(siteAddress, {
    head: { path },
    rangeChunks: { start: 0, end: 0 }
  });
  
  const totalSize = Number(locateResponse.structure.totalSize);
  const chunks = [];
  
  // Stream in chunks
  for (let offset = 0; offset < totalSize; offset += chunkSize) {
    const end = Math.min(offset + chunkSize - 1, totalSize - 1);
    
    const response = await gateway.GET(siteAddress, {
      locate: {
        head: { path },
        rangeChunks: { start: 0, end: 0 }
      },
      rangeBytes: { start: offset, end }
    });
    
    chunks.push(response.body.data);
  }
  
  return Buffer.concat(chunks);
}
```

### Media Streaming
```typescript
async function streamVideo(siteAddress: string, videoPath: string, startTime: number) {
  // Calculate byte offset based on time (assuming 1MB per second)
  const bytesPerSecond = 1024 * 1024;
  const startByte = startTime * bytesPerSecond;
  const endByte = startByte + (10 * bytesPerSecond); // 10 seconds
  
  const response = await gateway.GET(siteAddress, {
    locate: {
      head: { path: videoPath },
      rangeChunks: { start: 0, end: 0 }
    },
    rangeBytes: { start: startByte, end: endByte }
  });
  
  return response.body.data;
}
```

## Error Handling

The gateway provides comprehensive error handling:

```typescript
try {
  const response = await gateway.GET(siteAddress, getRequest);
  
  switch (response.head.status) {
    case 200:
      console.log('Success - full content');
      break;
    case 206:
      console.log('Success - partial content');
      break;
    case 404:
      console.log('Resource not found');
      break;
    case 403:
      console.log('Access denied');
      break;
    case 405:
      console.log('Method not allowed');
      break;
    default:
      console.log('Unexpected status:', response.head.status);
  }
} catch (error) {
  if (error.message.includes('Method Not Allowed')) {
    console.log('LOCATE method not allowed for this resource');
  } else if (error.message.includes('Out of Bounds')) {
    console.log('Range request exceeds file bounds');
  } else {
    console.error('Gateway error:', error);
  }
}
```

## Performance Optimization

### Caching Strategies
```typescript
// Use HEAD requests to check for updates
const headResponse = await gateway.HEAD(siteAddress, {
  path: '/api/data',
  ifNoneMatch: cachedETag
});

if (headResponse.status === 304) {
  // Use cached content
  return cachedContent;
} else {
  // Fetch updated content
  const response = await gateway.GET(siteAddress, getRequest);
  return response.body.data;
}
```

### Batch Operations
```typescript
// Fetch multiple resources efficiently
async function fetchMultipleResources(siteAddress: string, paths: string[]) {
  const promises = paths.map(path => 
    gateway.GET(siteAddress, {
      locate: { head: { path }, rangeChunks: { start: 0, end: 0 } },
      rangeBytes: { start: 0, end: 0 }
    })
  );
  
  return Promise.all(promises);
}
```

## Deployment and Configuration

### Using Public Gateways
Most networks have public gateways deployed:

```typescript
// Sepolia testnet
const SEPOLIA_GATEWAY = "0x1234...";

// Polygon mainnet
const POLYGON_GATEWAY = "0x5678...";

// Connect to public gateway
const gateway = new ethers.Contract(
  SEPOLIA_GATEWAY,
  WTTPGateway.abi,
  provider
);
```

### Deploying Custom Gateways
For advanced use cases, deploy your own gateway:

```bash
# Deploy simple gateway
npx hardhat deploy:simple --network sepolia

# Deploy with vanity address
npx hardhat deploy:vanity --network sepolia

# Deploy with ignition
npx hardhat deploy:ignition --network sepolia
```

### Gateway Configuration
Custom gateways can be configured for specific use cases:

```typescript
// Deploy gateway with custom access controls
const customGateway = await CustomGateway.deploy(
  owner.address,
  allowedSites, // Whitelist of allowed sites
  maxFileSize,  // Maximum file size limit
  rateLimits    // Rate limiting configuration
);
```

## Best Practices

### 1. Use Appropriate Ranges
```typescript
// Good: Use byte ranges for large files
const response = await gateway.GET(siteAddress, {
  locate: { head: { path: '/large-file.pdf' }, rangeChunks: { start: 0, end: 0 } },
  rangeBytes: { start: 0, end: 1023 } // First 1KB
});

// Avoid: Fetching entire large file when you only need a small portion
```

### 2. Implement Proper Error Handling
```typescript
try {
  const response = await gateway.GET(siteAddress, getRequest);
  // Process response
} catch (error) {
  // Handle specific error types
  if (error.message.includes('Method Not Allowed')) {
    // Handle permission errors
  } else if (error.message.includes('Out of Bounds')) {
    // Handle range errors
  }
}
```

### 3. Use HEAD Requests for Metadata
```typescript
// Check if content exists and get metadata
const headResponse = await gateway.HEAD(siteAddress, { path: '/api/data' });
if (headResponse.status === 200) {
  // Content exists, proceed with GET
  const response = await gateway.GET(siteAddress, getRequest);
}
```

### 4. Implement Content Verification
```typescript
// Verify content integrity
const response = await gateway.GET(siteAddress, getRequest);
const expectedHash = response.head.etag;
const actualHash = ethers.keccak256(response.body.data);

if (expectedHash !== actualHash) {
  throw new Error('Content verification failed');
}
```

## Troubleshooting

### Common Issues

1. **Method Not Allowed**: The site doesn't allow LOCATE method for the resource
   - Check site permissions and CORS configuration
   - Use OPTIONS to discover allowed methods

2. **Out of Bounds**: Range request exceeds file bounds
   - Use LOCATE to get file size before making range requests
   - Validate range parameters before calling GET

3. **Gas Limit Exceeded**: Requesting too much data in one call
   - Use smaller byte ranges
   - Implement chunked fetching for very large files

4. **Content Verification Failed**: Hash mismatch
   - Check if content was modified after upload
   - Verify you're using the correct hash algorithm

### Debugging Tools

```typescript
// Enable debug logging
const DEBUG = true;

if (DEBUG) {
  console.log('Gateway address:', gateway.address);
  console.log('Site address:', siteAddress);
  console.log('Request:', getRequest);
  console.log('Response status:', response.head.status);
  console.log('Data length:', response.body.data.length);
}
```

## Related Documentation

- [Handler Documentation](/docs/handler/handler-overview) - **Recommended**: Start with the WTTP Handler
- [Methods Documentation](/docs/wttp/wttp-methods) - Complete HTTP methods reference
- [Permissions Guide](/docs/wttp/wttp-permissions) - Understanding access control
- [Site Management](/docs/wttp/wttp-sites) - Managing WTTP sites
- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
