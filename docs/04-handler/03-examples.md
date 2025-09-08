---
id: handler-examples
title: Handler Examples
---

# DIP Handler Examples

This guide provides practical examples of using the DIP Handler in various scenarios. These examples demonstrate real-world usage patterns and best practices.

## Basic Usage Examples

### Simple Content Fetching

```typescript
import { WTTPHandler } from '@wttp/handler';

const handler = new WTTPHandler();

// Fetch a webpage
const response = await handler.fetch('wttp://mysite.eth:sepolia/index.html');
console.log('Status:', response.status);
console.log('Content:', await response.text());
```

### Working with Different File Types

```typescript
// Text content
const textResponse = await handler.fetch('wttp://site.eth:sepolia/readme.txt');
const textContent = await textResponse.text();

// JSON data
const jsonResponse = await handler.fetch('wttp://api.eth:sepolia/data.json');
const jsonData = await jsonResponse.json();

// Binary content (images, PDFs, etc.)
const imageResponse = await handler.fetch('wttp://site.eth:sepolia/logo.png');
const imageBuffer = await imageResponse.arrayBuffer();
```

### Error Handling

```typescript
try {
  const response = await handler.fetch('wttp://site.eth:sepolia/missing.html');
  
  if (response.status === 404) {
    console.log('File not found');
  } else if (response.status === 200) {
    console.log('Success:', await response.text());
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Advanced Usage Examples

### Custom Headers and Options

```typescript
// Fetch with custom headers
const response = await handler.fetch('wttp://site.eth:sepolia/api/data', {
  method: 'GET',
  headers: {
    'Range': 'bytes=0-1023',  // First 1KB
    'If-Modified-Since': '1640995200'
  }
});

// Check if content was modified
if (response.status === 304) {
  console.log('Content not modified, use cached version');
} else {
  console.log('New content:', await response.text());
}
```

### Range Requests for Large Files

```typescript
// Fetch first 1KB of a large file
const partialResponse = await handler.fetch('wttp://site.eth:sepolia/large-file.pdf', {
  headers: {
    'Range': 'bytes=0-1023'
  }
});

console.log('Partial content size:', partialResponse.headers['Content-Length']);
console.log('Content-Range:', partialResponse.headers['Content-Range']);

// Fetch specific byte range
const rangeResponse = await handler.fetch('wttp://site.eth:sepolia/video.mp4', {
  headers: {
    'Range': 'bytes=1024-2047'  // Second 1KB
  }
});
```

### Working with Different HTTP Methods

```typescript
// HEAD request - get metadata without content
const headResponse = await handler.fetch('wttp://site.eth:sepolia/file.pdf', {
  method: 'HEAD'
});

console.log('Content-Length:', headResponse.headers['Content-Length']);
console.log('Content-Type:', headResponse.headers['Content-Type']);
console.log('ETag:', headResponse.headers['ETag']);

// OPTIONS request - discover allowed methods
const optionsResponse = await handler.fetch('wttp://site.eth:sepolia/api/', {
  method: 'OPTIONS'
});

console.log('Allowed methods:', optionsResponse.headers['Allowed-Methods']);
```

## Multi-Chain Examples

### Working with Different Networks

```typescript
// Create handlers for different networks
const handlers = {
  sepolia: new WTTPHandler(undefined, 'sepolia'),
  mainnet: new WTTPHandler(undefined, 'mainnet'),
  polygon: new WTTPHandler(undefined, 'polygon'),
  localhost: new WTTPHandler(undefined, 'localhost')
};

// Fetch from different networks
const sepoliaContent = await handlers.sepolia.fetch('wttp://site.eth:sepolia/page.html');
const mainnetContent = await handlers.mainnet.fetch('wttp://site.eth:mainnet/page.html');
const polygonContent = await handlers.polygon.fetch('wttp://site.eth:polygon/page.html');
```

### Environment-Specific Configuration

```typescript
// Development environment
const devHandler = new WTTPHandler(undefined, 'localhost');

// Staging environment
const stagingHandler = new WTTPHandler(undefined, 'sepolia');

// Production environment
const prodHandler = new WTTPHandler(undefined, 'mainnet');

// Use appropriate handler based on environment
const handler = process.env.NODE_ENV === 'production' ? prodHandler : 
                process.env.NODE_ENV === 'staging' ? stagingHandler : devHandler;
```

## Authentication Examples

### Using Custom Signers

```typescript
import { ethers } from 'ethers';

// Create custom signer
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create handler with custom signer
const handler = new WTTPHandler(signer, 'sepolia');

// Fetch with authentication
const response = await handler.fetch('wttp://private-site.eth:sepolia/admin/data');
```

### Wallet Integration

```typescript
// Browser wallet integration (MetaMask, etc.)
const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new WTTPHandler(signer, 'sepolia');
  }
  throw new Error('No wallet found');
};

// Use connected wallet
const handler = await connectWallet();
const response = await handler.fetch('wttp://site.eth:sepolia/user-data');
```

## Content Management Examples

### Building a Simple Website

```typescript
// Fetch multiple pages for a website
const pages = [
  'wttp://mysite.eth:sepolia/index.html',
  'wttp://mysite.eth:sepolia/about.html',
  'wttp://mysite.eth:sepolia/contact.html'
];

const websiteContent = await Promise.all(
  pages.map(async (url) => {
    const response = await handler.fetch(url);
    return {
      url,
      content: await response.text(),
      status: response.status
    };
  })
);

console.log('Website loaded:', websiteContent);
```

### Content Aggregation

```typescript
// Aggregate content from multiple sources
const sources = [
  'wttp://news.eth:sepolia/latest.json',
  'wttp://blog.eth:sepolia/posts.json',
  'wttp://api.eth:sepolia/status.json'
];

const aggregatedData = await Promise.allSettled(
  sources.map(async (url) => {
    const response = await handler.fetch(url);
    return {
      source: url,
      data: await response.json(),
      timestamp: Date.now()
    };
  })
);

// Handle successful and failed requests
aggregatedData.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.error('Failed:', sources[index], result.reason);
  }
});
```

## Performance Optimization Examples

### Caching Strategy

```typescript
// Simple in-memory cache
const cache = new Map();

const fetchWithCache = async (url: string) => {
  // Check cache first
  if (cache.has(url)) {
    const cached = cache.get(url);
    if (Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.response;
    }
  }

  // Fetch from network
  const response = await handler.fetch(url);
  const content = await response.text();

  // Cache the response
  cache.set(url, {
    response: { ...response, body: content },
    timestamp: Date.now()
  });

  return { ...response, body: content };
};
```

### Streaming Large Files

```typescript
// Stream large files in chunks
const streamLargeFile = async (url: string, chunkSize: number = 1024 * 1024) => {
  const chunks: Uint8Array[] = [];
  let offset = 0;

  while (true) {
    const response = await handler.fetch(url, {
      headers: {
        'Range': `bytes=${offset}-${offset + chunkSize - 1}`
      }
    });

    if (response.status === 206) { // Partial content
      const chunk = new Uint8Array(await response.arrayBuffer());
      chunks.push(chunk);
      offset += chunk.length;

      if (chunk.length < chunkSize) {
        break; // Last chunk
      }
    } else {
      break; // No more content
    }
  }

  // Combine chunks
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let position = 0;

  for (const chunk of chunks) {
    result.set(chunk, position);
    position += chunk.length;
  }

  return result;
};
```

## Error Handling and Resilience

### Retry Logic

```typescript
const fetchWithRetry = async (url: string, maxRetries: number = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await handler.fetch(url);
      return response;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};
```

### Fallback Strategies

```typescript
const fetchWithFallback = async (primaryUrl: string, fallbackUrl: string) => {
  try {
    const response = await handler.fetch(primaryUrl);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.log('Primary failed, trying fallback:', error);
  }

  // Try fallback
  try {
    return await handler.fetch(fallbackUrl);
  } catch (error) {
    throw new Error(`Both primary and fallback failed: ${error}`);
  }
};
```

## Future Protocol Examples (Roadmap)

### IPFS Integration (Planned)

```typescript
// Future IPFS support
const ipfsResponse = await handler.fetch('ipfs://QmHash/path/to/file');
const ipfsContent = await ipfsResponse.text();
```

### Bitcoin Ordinals (Planned)

```typescript
// Future Ordinals support
const ordinalResponse = await handler.fetch('ord://inscription-id');
const ordinalContent = await ordinalResponse.arrayBuffer();
```

### Arweave Integration (Planned)

```typescript
// Future Arweave support
const arweaveResponse = await handler.fetch('ar://transaction-id');
const arweaveContent = await arweaveResponse.text();
```

### ESP Protocol Support (Planned)

```typescript
// Future ESP support
const espResponse = await handler.fetch('esp://datapoint-address');
const espContent = await espResponse.text();
```

## Testing Examples

### Unit Testing

```typescript
import { jest } from '@jest/globals';

// Mock handler for testing
const mockHandler = {
  fetch: jest.fn().mockResolvedValue({
    status: 200,
    headers: { 'Content-Type': 'text/html' },
    text: () => Promise.resolve('<h1>Test Content</h1>')
  })
};

// Test your application logic
test('should fetch and process content', async () => {
  const content = await mockHandler.fetch('wttp://test.eth:sepolia/page.html');
  expect(content.status).toBe(200);
  expect(await content.text()).toBe('<h1>Test Content</h1>');
});
```

### Integration Testing

```typescript
// Test against real WTTP sites
describe('WTTP Handler Integration', () => {
  const handler = new WTTPHandler(undefined, 'sepolia');

  test('should fetch from real WTTP site', async () => {
    const response = await handler.fetch('wttp://test-site.eth:sepolia/index.html');
    expect(response.status).toBe(200);
    expect(response.headers['Content-Type']).toContain('text/html');
  });
});
```

## Best Practices

### 1. Always Handle Errors

```typescript
const safeFetch = async (url: string) => {
  try {
    const response = await handler.fetch(url);
    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};
```

### 2. Use Appropriate Timeouts

```typescript
const fetchWithTimeout = async (url: string, timeout: number = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await handler.fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
```

### 3. Validate Responses

```typescript
const validateResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('Content-Type');
  if (!contentType) {
    console.warn('No Content-Type header found');
  }
  
  return response;
};
```

## Related Documentation

- [Handler Overview](/docs/handler/handler-overview) - Understanding the handler
- [Installation Guide](/docs/handler/handler-installation) - Setup and configuration
- [Roadmap](/docs/handler/handler-roadmap) - Development timeline and future plans
- [WTTP Methods](/docs/wttp/wttp-methods) - Understanding WTTP protocol methods