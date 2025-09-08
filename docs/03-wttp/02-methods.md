---
id: wttp-methods
title: WTTP Methods
---

# WTTP Methods

WTTP implements a comprehensive set of HTTP-like methods across three main components:

- **WTTP Sites**: Handle content management (PUT, PATCH, DELETE, DEFINE) and basic retrieval
- **WTTP Gateway**: Optimize content delivery with enhanced range requests and single-call data assembly
- **WTTP Handler**: Provide simplified integration with automatic contract selection and redirect management

Each method is mapped to a smart contract function and provides familiar web semantics.

## Supported Methods

### OPTIONS
**Purpose**: Discover allowed methods and CORS policies for a resource  
**Gas Cost**: Low (read-only)  
**Returns**: `OPTIONSResponse` with allowed methods and CORS headers

```typescript
const response = await site.OPTIONS('/api/data');
console.log(response.allowedMethods); // Bitmask of allowed methods
console.log(response.corsHeaders);   // CORS configuration
```

**Use Cases**:
- Preflight requests for CORS
- API discovery
- Method validation

### HEAD
**Purpose**: Retrieve metadata without downloading content  
**Gas Cost**: Low (read-only)  
**Returns**: `HEADResponse` with headers, ETag, and status

```typescript
const request: HEADRequest = {
  path: '/index.html',
  ifNoneMatch: 'optional-etag-value'
};

const response = await site.HEAD(request);
console.log(response.status);     // 200, 304, 404, etc.
console.log(response.etag);       // Content hash for caching
console.log(response.headers);    // HTTP headers
```

**Use Cases**:
- Check if content exists
- Validate ETags for caching
- Get file metadata without downloading

### GET
**Purpose**: Retrieve content from a resource  
**Gas Cost**: Medium (depends on content size)  
**Returns**: `GETResponse` with content data and headers

```typescript
const request: GETRequest = {
  path: '/index.html',
  range: { start: 0, end: 1024 } // Optional: partial content
};

const response = await site.GET(request);
console.log(response.status);     // 200, 206, 404, etc.
console.log(response.data);       // Content bytes
console.log(response.headers);    // HTTP headers
```

**Use Cases**:
- Download files
- Serve web pages
- API responses
- Partial content delivery

### PUT
**Purpose**: Create or completely replace a resource  
**Gas Cost**: High (writes to blockchain)  
**Returns**: `ContractTransaction` for tracking

```typescript
const htmlContent = ethers.toUtf8Bytes('<h1>Hello World</h1>');
const putRequest: PUTRequest = {
  head: { path: '/index.html' },
  properties: { contentType: 'text/html', contentLength: htmlContent.length },
  data: [{
    data: htmlContent,
    publisher: signer.address
  }]
};

const tx = await site.PUT(putRequest);
await tx.wait();
```

**Use Cases**:
- Upload new files (up to 32KB per chunk)
- Replace existing content
- Initial site deployment

### PATCH
**Purpose**: Partially update a resource  
**Gas Cost**: Medium (writes to blockchain)  
**Returns**: `ContractTransaction` for tracking

```typescript
const newData = ethers.toUtf8Bytes('updated content');
const patchRequest: PATCHRequest = {
  head: { path: '/file.txt' },
  data: [{
    data: newData,
    publisher: signer.address
  }]
};

const tx = await site.PATCH(patchRequest);
await tx.wait();
```

**Use Cases**:
- Update specific chunks of files
- Incremental updates for large files
- Efficient content modification

### DELETE
**Purpose**: Remove a resource  
**Gas Cost**: Low (writes to blockchain)  
**Returns**: `ContractTransaction` for tracking

```typescript
const tx = await site.DELETE('/old-file.html');
await tx.wait();
```

**Use Cases**:
- Remove outdated content
- Clean up unused files
- Content lifecycle management

### DEFINE
**Purpose**: Set headers and metadata for a resource  
**Gas Cost**: Low (writes to blockchain)  
**Returns**: `ContractTransaction` for tracking

```typescript
const headerInfo: HeaderInfo = {
  cors: {
    methods: 0xffff, // Allow all methods
    origins: Array(9).fill(PUBLIC_ROLE) // Allow all origins
  },
  cache: {
    maxAge: 3600, // 1 hour cache
    immutableFlag: false
  },
  redirect: {
    code: 0, // No redirect
    location: ''
  }
};

const tx = await site.DEFINE('/api/data', headerInfo);
await tx.wait();
```

**Use Cases**:
- Configure CORS policies
- Set cache headers
- Define redirects
- Mark resources as immutable

## Gateway-Enhanced Methods

The WTTP Gateway provides optimized versions of read methods with enhanced functionality for off-chain applications.

### LOCATE (Gateway Enhanced)
**Purpose**: Locate resources with detailed data point information  
**Gas Cost**: Medium (reads from multiple contracts)  
**Returns**: `LOCATEResponseSecure` with data point sizes and structure

```typescript
const locateRequest: LOCATERequest = {
  head: { path: '/large-file.pdf' },
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

### GET (Gateway Enhanced)
**Purpose**: Retrieve content with optimized byte range support  
**Gas Cost**: Medium to High (depends on content size and range)  
**Returns**: `GETResponse` with assembled content

```typescript
const getRequest: GETRequest = {
  locate: {
    head: { path: '/large-file.pdf' },
    rangeChunks: { start: 0, end: 0 } // All chunks
  },
  rangeBytes: { start: 1024, end: 2047 } // Specific byte range
};

const response = await gateway.GET(siteAddress, getRequest);
console.log(response.head.status);     // 200, 206, 404, etc.
console.log(response.body.data);       // Requested byte range
console.log(response.body.sizes);      // Data point size information
```

**Key Benefits**:
- **Single Call**: One blockchain transaction instead of N+1 calls
- **Efficient Ranges**: Fetch only the bytes you need
- **Automatic Assembly**: Seamlessly combines data from multiple chunks
- **Performance**: Significantly faster than direct site access

### HEAD (Gateway Forwarded)
**Purpose**: Retrieve metadata without downloading content  
**Gas Cost**: Low (read-only)  
**Returns**: `HEADResponse` with headers and metadata

```typescript
const headRequest: HEADRequest = {
  path: '/index.html',
  ifNoneMatch: 'optional-etag-value'
};

const response = await gateway.HEAD(siteAddress, headRequest);
console.log(response.status);     // 200, 304, 404, etc.
console.log(response.etag);       // Content hash for caching
console.log(response.metadata);   // File metadata
```

### OPTIONS (Gateway Forwarded)
**Purpose**: Discover allowed methods and CORS policies  
**Gas Cost**: Low (read-only)  
**Returns**: `OPTIONSResponse` with allowed methods

```typescript
const response = await gateway.OPTIONS(siteAddress, '/api/data');
console.log(response.allowedMethods); // Bitmask of allowed methods
console.log(response.status);         // Response status
```

## Response Status Codes

WTTP Site uses standard HTTP status codes:

| Code | Status | Description |
|------|--------|-------------|
| 200  | OK | Request successful |
| 201  | Created | Resource created successfully |
| 204  | No Content | Request successful, no content returned |
| 206  | Partial Content | Range request successful |
| 304  | Not Modified | Content unchanged (ETag match) |
| 400  | Bad Request | Invalid request parameters |
| 403  | Forbidden | Access denied |
| 404  | Not Found | Resource doesn't exist |
| 405  | Method Not Allowed | Method not supported for resource |
| 410  | Gone | Resource was deleted or is immutable |
| 500  | Internal Server Error | Contract execution error |

## Request and Response Types

### Chunk Requests
For partial content delivery using chunk indices:

```typescript
interface Range {
  start: number; // Start chunk index (inclusive)
  end: number;   // End chunk index (inclusive)
}
```

### Header Information
Configure resource behavior:

```typescript
interface HeaderInfo {
  cors: {
    methods: number;        // Bitmask of allowed methods
    origins: string[];      // Array of 9 role IDs (32-byte hashes)
  };
  cache: {
    maxAge: number;         // Cache duration in seconds
    immutableFlag: boolean; // Mark as immutable
  };
  redirect: {
    code: number;           // HTTP redirect code
    location: string;       // Redirect URL
  };
}
```

## Error Handling

All methods return structured error information:

```typescript
try {
  const response = await site.GET({ path: '/nonexistent.html' });
  if (response.status === 404) {
    console.log('File not found');
  }
} catch (error) {
  console.error('Contract error:', error);
}
```

## Gas Optimization Tips

1. **Use HEAD before GET**: Check if content exists before downloading
2. **Implement ETags**: Use conditional requests to avoid re-downloading
3. **Chunk Requests**: Download only the chunks you need
4. **Batch Operations**: Group multiple operations in a single transaction when possible
5. **Chunk Large Files**: Files larger than 32KB must be chunked using PUT followed by PATCH operations

## When to Use Handler vs Gateway vs Direct Site Access

### Use WTTP Handler When (Recommended):
- **Building Applications**: Most developers should start with the handler
- **Simplified Integration**: Want automatic contract selection and redirect handling
- **Error Management**: Need comprehensive error handling and recovery
- **Rapid Development**: Want the simplest possible integration

### Use WTTP Gateway When:
- **Advanced Control**: Need fine-grained control over range requests
- **Performance Critical**: Building high-performance applications
- **Custom Logic**: Implementing custom content delivery logic
- **Large File Delivery**: Working extensively with large files

### Use Direct Site Access When:
- **Content Management**: Uploading, updating, or deleting content
- **Permission Management**: Configuring roles and access controls
- **Site Administration**: Managing site-wide settings and headers
- **Simple Retrieval**: Fetching small files that fit in a single data point

### Performance Comparison

| Operation | Direct Site | Gateway | Handler | Improvement |
|-----------|-------------|---------|---------|-------------|
| Small file (1 chunk) | 2 calls | 1 call | 1 call | 2x faster |
| Large file (10 chunks) | 11 calls | 1 call | 1 call | 11x faster |
| Range request | 11+ calls | 1 call | 1 call | 11x+ faster |
| Content verification | Manual | Automatic | Automatic | Built-in |
| Redirect handling | Manual | Manual | Automatic | Built-in |
| Contract selection | Manual | Manual | Automatic | Built-in |

## Method Permissions

Each method can be restricted by role:

- **DEFAULT_ADMIN_ROLE**: Can use all methods
- **SITE_ADMIN_ROLE**: Can manage site configuration
- **Resource Roles**: Custom roles for specific paths
- **Public**: Anyone can use the method
- **Blacklist**: Explicitly denied access

See the [Permissions Guide](/docs/wttp/wttp-permissions) for detailed information about access control.

## Related Documentation

- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
- [ESP Storage](/docs/esp/esp-storage) - Detailed storage mechanisms
