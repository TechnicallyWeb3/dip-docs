---
id: wttp-storage
title: WTTP Storage
---

# WTTP Storage Contract Guide

The `BaseWTTPStorage` contract is the core storage layer of the WTTP protocol, providing a sophisticated resource management system built on top of the Ethereum Storage Protocol (ESP). This contract manages file metadata, headers, content organization, and chunked storage for efficient blockchain-based web content.

## ⚠️ Security Warning

**CRITICAL**: The security of your WTTP site depends entirely on proper permission management. The `BaseWTTPStorage` contract exposes internal functions that can be called by any contract that inherits from it. When implementing custom site contracts:

- **Never expose internal storage functions publicly** without proper access controls
- **Always implement proper authorization checks** before calling internal functions
- **Use the `onlyAuthorized` modifier** or similar access controls in your public functions
- **Review all public functions** to ensure they don't allow unauthorized access to storage operations
- **Test permission boundaries thoroughly** before deploying to mainnet

## Contract Architecture

```
┌────────────────────────────────────────────────────────────┐
│                BaseWTTPSite (Public Interface)             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   HTTP      │  │  Security   │  │   Business Logic    │ │
│  │  Methods    │  │  Controls   │  │   & Validation      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬──────────────────────────────────────┘
                      │
┌─────────────────────┴──────────────────────────────────────┐
│              BaseWTTPStorage (Internal Layer)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Headers   │  │  Metadata   │  │     Resources       │ │
│  │ Management  │  │ Management  │  │   Management        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬──────────────────────────────────────┘
                      │
┌─────────────────────┴──────────────────────────────────────┐
│                ESP DataPointRegistry                       │
│              (Economic Incentives & Royalties)             │
└─────────────────────┬──────────────────────────────────────┘
                      │
┌─────────────────────┴──────────────────────────────────────┐
│                ESP DataPointStorage                        │
│              (Raw Content Storage)                         │
└────────────────────────────────────────────────────────────┘
```

## Core Storage Components

### 1. Header Management
Headers contain HTTP-like metadata and access control settings:

```solidity
struct HeaderInfo {
    CORSInfo cors;           // CORS settings and method permissions
    CacheInfo cache;         // Caching and immutability settings
    RedirectInfo redirect;   // Redirect configuration
}
```

**Key Functions:**
- `_createHeader(HeaderInfo memory _header)` - Creates new headers
- `_readHeader(string memory _path)` - Retrieves header for a resource
- `_updateHeader(bytes32 _headerAddress, HeaderInfo memory _header)` - Updates existing headers
- `_setDefaultHeader(HeaderInfo memory _header)` - Sets site-wide default headers

### 2. Metadata Management
Resource metadata tracks file information and state:

```solidity
struct ResourceMetadata {
    ResourceProperties properties;  // Content type, length, etc.
    uint256 size;                   // Total content size in bytes
    uint256 version;                // Version number for updates
    uint256 lastModified;           // Timestamp of last modification
    bytes32 header;                 // Reference to header
}
```

**Key Functions:**
- `_readMetadata(string memory _path)` - Gets resource metadata
- `_updateMetadata(string memory _path, ResourceMetadata memory _metadata)` - Updates metadata
- `_updateMetadataStats(string memory _path)` - Updates timestamps and version
- `_deleteMetadata(string memory _path)` - Removes metadata (sets to zero)

### 3. Resource Management
Resources are stored as arrays of data point chunks:

```solidity
mapping(string path => bytes32[]) private resource;  // Data point addresses
mapping(string path => ResourceMetadata) private metadata;  // Resource info
mapping(bytes32 header => HeaderInfo) private header;  // Header storage
```

**Key Functions:**
- `_createResource(string memory _path, DataRegistration memory _dataRegistration)` - Creates new data points
- `_readResource(string memory _path, Range memory _range)` - Retrieves resource chunks
- `_updateResource(string memory _path, bytes32 _dataPointAddress, uint256 _chunkIndex)` - Updates specific chunks
- `_uploadResource(string memory _path, DataRegistration[] memory _dataRegistration)` - Bulk upload
- `_deleteResource(string memory _path)` - Removes resource and metadata

## Data Registration Structure

Content is registered using the `DataRegistration` struct:

```solidity
struct DataRegistration {
    bytes data;        // Raw content bytes
    address publisher; // Content publisher address
    uint256 chunkIndex; // Position in resource array
}
```

## Implementing Custom Site Contracts

### Basic Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseWTTPStorage.sol";

contract MyCustomSite is BaseWTTPStorage {
    constructor(
        address _owner,
        address _dpr,
        HeaderInfo memory _defaultHeader
    ) BaseWTTPStorage(_owner, _dpr) {
        _setDefaultHeader(_defaultHeader);
    }

    // ⚠️ SECURITY: Always implement proper access controls
    function uploadContent(
        string memory _path,
        bytes memory _data,
        address _publisher
    ) external onlyRole(SITE_ADMIN_ROLE) {
        // Create data registration
        DataRegistration memory registration = DataRegistration({
            data: _data,
            publisher: _publisher,
            chunkIndex: 0
        });

        // Upload content using internal function
        _createResource(_path, registration);
        
        // Update metadata
        ResourceMetadata memory metadata = ResourceMetadata({
            properties: ResourceProperties({
                contentType: "application/octet-stream",
                contentLength: _data.length
            }),
            size: 0, // Will be calculated by _updateMetadata
            version: 0, // Will be calculated by _updateMetadata
            lastModified: 0, // Will be calculated by _updateMetadata
            header: bytes32(0) // Use default header
        });
        
        _updateMetadata(_path, metadata);
    }

    function getContent(string memory _path) external view returns (bytes32[] memory) {
        ResourceResponse memory response = _readResource(_path, Range(0, 0));
        return response.dataPoints;
    }
}
```

### Advanced Implementation with Custom Headers

```solidity
contract AdvancedSite is BaseWTTPStorage {
    constructor(
        address _owner,
        address _dpr,
        HeaderInfo memory _defaultHeader
    ) BaseWTTPStorage(_owner, _dpr) {
        _setDefaultHeader(_defaultHeader);
    }

    function createResourceWithCustomHeader(
        string memory _path,
        bytes memory _data,
        address _publisher,
        HeaderInfo memory _customHeader
    ) external onlyRole(SITE_ADMIN_ROLE) {
        // Create custom header
        bytes32 headerAddress = _createHeader(_customHeader);
        
        // Upload content
        DataRegistration memory registration = DataRegistration({
            data: _data,
            publisher: _publisher,
            chunkIndex: 0
        });
        _createResource(_path, registration);
        
        // Set metadata with custom header
        ResourceMetadata memory metadata = ResourceMetadata({
            properties: ResourceProperties({
                contentType: "text/html",
                contentLength: _data.length
            }),
            size: 0,
            version: 0,
            lastModified: 0,
            header: headerAddress // Use custom header
        });
        
        _updateMetadata(_path, metadata);
    }

    function updateResourceHeader(
        string memory _path,
        HeaderInfo memory _newHeader
    ) external onlyRole(SITE_ADMIN_ROLE) {
        // Create new header
        bytes32 headerAddress = _createHeader(_newHeader);
        
        // Update metadata with new header
        ResourceMetadata memory currentMetadata = _readMetadata(_path);
        currentMetadata.header = headerAddress;
        _updateMetadata(_path, currentMetadata);
    }
}
```

## Chunked Storage Implementation

For large files, implement chunked storage:

```solidity
function uploadLargeFile(
    string memory _path,
    bytes[] memory _chunks,
    address _publisher
) external onlyRole(SITE_ADMIN_ROLE) {
    // Prepare data registrations for all chunks
    DataRegistration[] memory registrations = new DataRegistration[](_chunks.length);
    
    for (uint256 i = 0; i < _chunks.length; i++) {
        registrations[i] = DataRegistration({
            data: _chunks[i],
            publisher: _publisher,
            chunkIndex: i
        });
    }
    
    // Upload all chunks at once
    _uploadResource(_path, registrations);
    
    // Calculate total size
    uint256 totalSize = 0;
    for (uint256 i = 0; i < _chunks.length; i++) {
        totalSize += _chunks[i].length;
    }
    
    // Set metadata
    ResourceMetadata memory metadata = ResourceMetadata({
        properties: ResourceProperties({
            contentType: "application/octet-stream",
            contentLength: totalSize
        }),
        size: 0, // Will be calculated
        version: 0,
        lastModified: 0,
        header: bytes32(0)
    });
    
    _updateMetadata(_path, metadata);
}

function getChunkRange(
    string memory _path,
    uint256 _startChunk,
    uint256 _endChunk
) external view returns (bytes32[] memory) {
    Range memory range = Range({
        start: int256(_startChunk),
        end: int256(_endChunk)
    });
    
    ResourceResponse memory response = _readResource(_path, range);
    return response.dataPoints;
}
```

## Content Addressing and Deduplication

The contract uses ESP's content addressing system:

```solidity
// Content addresses are calculated by ESP
bytes32 dataPointAddress = DPS().calculateAddress(data);

// Identical content gets the same address (automatic deduplication)
// Different content gets different addresses
```

## Storage Lifecycle Management

### Creating Resources
1. **Prepare Data**: Create `DataRegistration` with content and publisher
2. **Upload Content**: Call `_createResource()` to register with ESP
3. **Set Metadata**: Call `_updateMetadata()` with resource information
4. **Configure Headers**: Use `_createHeader()` for custom access controls

### Updating Resources
1. **Check Permissions**: Ensure caller has appropriate role
2. **Update Content**: Use `_updateResource()` for chunk updates
3. **Refresh Metadata**: Call `_updateMetadataStats()` to update timestamps
4. **Preserve Headers**: Keep existing header references unless changing

### Deleting Resources
1. **Remove Content**: Call `_deleteResource()` to clear all data
2. **Clean Metadata**: Metadata is automatically reset to zero values
3. **Preserve ESP Data**: Actual content remains in ESP (immutable)

## Error Handling and Validation

The contract includes several error types:

```solidity
// Range validation
revert _416("Out of Bounds", Range(0, currentLength), requestedIndex);

// Header validation
revert InvalidHeader(headerInfo);

// Resource state validation
// (Handled by calling contract's access controls)
```

## Gas Optimization Strategies

### 1. Batch Operations
```solidity
// Use _uploadResource() for multiple chunks instead of individual _createResource() calls
DataRegistration[] memory batch = new DataRegistration[](chunkCount);
// ... populate batch array
_uploadResource(path, batch);
```

### 2. Metadata Efficiency
```solidity
// Only update metadata when necessary
if (needsMetadataUpdate) {
    _updateMetadataStats(path);
}
```

### 3. Header Reuse
```solidity
// Reuse existing headers when possible
bytes32 existingHeader = _readMetadata(path).header;
if (existingHeader != bytes32(0)) {
    // Use existing header instead of creating new one
}
```

## Integration with BaseWTTPSite

The `BaseWTTPSite` contract extends `BaseWTTPStorage` and provides HTTP-like methods:

```solidity
// BaseWTTPSite uses internal storage functions with proper access controls
function PUT(PUTRequest memory putRequest) external payable {
    // Access control check
    _OPTIONS(putRequest.head.path, Method.PUT);
    
    // Use internal storage functions
    if (putRequest.data.length > 0) {
        _uploadResource(putRequest.head.path, putRequest.data);
    }
    
    // Update metadata
    _updateMetadata(putRequest.head.path, /* metadata */);
}
```

## Best Practices for Custom Implementations

### 1. Security First
- Always implement proper access controls
- Never expose internal functions publicly
- Use role-based permissions consistently
- Test all permission boundaries

### 2. Error Handling
- Implement comprehensive error checking
- Provide meaningful error messages
- Handle edge cases gracefully
- Validate all inputs

### 3. Gas Optimization
- Batch operations when possible
- Reuse headers and metadata
- Implement efficient chunking strategies
- Monitor gas usage patterns

### 4. Resource Management
- Implement proper cleanup procedures
- Monitor resource usage
- Implement backup and recovery
- Handle resource conflicts

## Common Pitfalls to Avoid

1. **Exposing Internal Functions**: Never make internal storage functions public
2. **Missing Access Controls**: Always check permissions before storage operations
3. **Incomplete Metadata**: Ensure all required metadata fields are set
4. **Header Mismatches**: Verify header origins array length matches methods
5. **Chunk Index Errors**: Ensure chunk indices are within bounds
6. **Gas Limit Issues**: Test with realistic data sizes

## Testing Your Implementation

```solidity
// Test access controls
function testAccessControl() public {
    // Should revert for unauthorized users
    vm.expectRevert();
    mySite.uploadContent("/test", data, publisher);
    
    // Should succeed for authorized users
    vm.prank(authorizedUser);
    mySite.uploadContent("/test", data, publisher);
}

// Test chunking
function testChunking() public {
    bytes[] memory chunks = createTestChunks(1024 * 1024); // 1MB
    mySite.uploadLargeFile("/large", chunks, publisher);
    
    // Verify all chunks are stored
    bytes32[] memory storedChunks = mySite.getContent("/large");
    assertEq(storedChunks.length, chunks.length);
}
```

## Related Documentation

- [BaseWTTPSite Implementation](/docs/wttp/wttp-sites) - How BaseWTTPSite uses BaseWTTPStorage
- [Permission Management](/docs/wttp/wttp-permissions) - Understanding WTTP access controls
- [ESP Integration](/docs/esp/esp-overview) - Working with the Ethereum Storage Protocol
