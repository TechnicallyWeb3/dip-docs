---
id: datapoints
title: DataPoints
---

# DataPoints

Data points are the fundamental unit of storage in the Ethereum Storage Protocol (ESP). They provide immutable, content-addressed storage with unique identifiers based on the data content itself.

## What are Data Points?

A data point is any piece of data that can be stored in the ESP system. It can be:
- Text content (articles, documentation, configuration)
- Binary data (images, videos, files)
- Structured data (JSON, XML, CSV)
- Smart contract data (ABIs, bytecode)
- Any arbitrary bytes

## Key Characteristics

### Content Addressing
Data points are identified by their content, not by a location or ID assigned by the system. This means:
- Same data always produces the same address
- Different data produces different addresses
- Data integrity is cryptographically guaranteed

### Data Size Limits
ESP has practical limits on data point size:
- **Recommended maximum**: 32KB per data point
- **Absolute maximum**: ~42KB (tested limit)
- For larger data, build custom smart contracts that chunk data into ESP-compatible sizes

### Immutability
Once stored, data points cannot be:
- Modified
- Deleted
- Corrupted (without detection)
- Replaced with different data

### Uniqueness
Each unique piece of data gets a unique address:
- Duplicate data shares the same address
- No two different data pieces can have the same address
- Collision-resistant through cryptographic hashing

## How Data Point Addresses Work

### Address Calculation
Data point addresses are calculated using:
```solidity
function calculateDataPointAddress(
    bytes memory _data,
    uint8 _version
) pure returns (bytes32) {
    return keccak256(abi.encodePacked(_data, _version));
}
```

### Version System
ESP uses a version system to handle protocol updates:
- Current version: 2
- Version is included in address calculation
- Allows for protocol evolution while maintaining backward compatibility

### Example Address Calculation
```typescript
import { ethers } from 'ethers';

// Calculate address for text data
const data = ethers.toUtf8Bytes("Hello, ESP!");
const version = 2;
const address = ethers.keccak256(ethers.solidityPacked(["bytes", "uint8"], [data, version]));

console.log("Data Point Address:", address);
// Output: 0x1234... (unique hash based on content and version)
```

## Data Point Lifecycle

### 1. Creation
```typescript
// Prepare data
const data = ethers.toUtf8Bytes("My important data");

// Calculate address (optional, for verification)
const address = await dataPointStorage.calculateAddress(data);
console.log("Will be stored at:", address);
```

### 2. Storage
```typescript
// Store data point
const tx = await dataPointStorage.writeDataPoint(data);
await tx.wait();

// Get the actual address where it was stored
const storedAddress = await tx.getAddress();
```

### 3. Registration (with royalties)
```typescript
// Register with publisher for royalty collection
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
await tx.wait();
```

### 4. Retrieval
```typescript
// Read data point
const retrievedData = await dataPointStorage.readDataPoint(address);
console.log("Retrieved data:", ethers.toUtf8String(retrievedData));
```

## Data Point Operations

### Storing Data
```typescript
// Basic storage
const data = ethers.toUtf8Bytes("Hello, World!");
const tx = await dataPointStorage.writeDataPoint(data);
await tx.wait();

// With royalty registration
const tx2 = await dataPointRegistry.registerDataPoint(data, signer.address);
await tx2.wait();
```

### Reading Data
```typescript
// Read by address
const data = await dataPointStorage.readDataPoint(address);

// Check if data exists
const size = await dataPointStorage.dataPointSize(address);
if (size > 0) {
    console.log("Data exists, size:", size);
}
```

### Address Verification
```typescript
// Calculate expected address
const expectedAddress = await dataPointStorage.calculateAddress(data);

// Verify data integrity
const storedData = await dataPointStorage.readDataPoint(expectedAddress);
const isIntact = ethers.keccak256(storedData) === ethers.keccak256(data);
console.log("Data integrity:", isIntact);
```

## Data Types and Examples

### Text Data
```typescript
// Store text content
const article = "This is a sample article about ESP...";
const data = ethers.toUtf8Bytes(article);
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
```

### JSON Data
```typescript
// Store structured data
const config = {
    name: "My App",
    version: "1.0.0",
    settings: { theme: "dark" }
};
const data = ethers.toUtf8Bytes(JSON.stringify(config));
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
```

### Binary Data
```typescript
// Store binary data (e.g., image)
const imageData = "0x89504e470d0a1a0a..."; // PNG file bytes
const data = ethers.getBytes(imageData);
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
```

### Smart Contract Data
```typescript
// Store contract ABI
const abi = [
    {
        "inputs": [{"name": "value", "type": "uint256"}],
        "name": "setValue",
        "outputs": [],
        "type": "function"
    }
];
const data = ethers.toUtf8Bytes(JSON.stringify(abi));
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
```

## Best Practices

### Data Preparation
- Ensure data is in the correct format before storage
- Consider data compression for large files
- Validate data integrity before storing

### Error Handling
```typescript
try {
    const tx = await dataPointStorage.writeDataPoint(data);
    await tx.wait();
    console.log("Data stored successfully");
} catch (error) {
    if (error.message.includes("DataExists")) {
        console.log("Data already exists at this address");
    } else if (error.message.includes("InvalidData")) {
        console.log("Invalid data provided");
    } else {
        console.error("Storage failed:", error);
    }
}
```

### Gas Optimization
- Batch multiple data points in a single transaction when possible
- Consider data size impact on gas costs
- Use appropriate gas limits for large data

### Data Validation
```typescript
// Validate data before storage
function validateData(data: Uint8Array): boolean {
    if (data.length === 0) {
        throw new Error("Data cannot be empty");
    }
    if (data.length > 32768) { // 32KB recommended limit
        throw new Error("Data exceeds recommended 32KB limit");
    }
    if (data.length > 43008) { // ~42KB absolute limit
        throw new Error("Data exceeds absolute 42KB limit");
    }
    return true;
}

// Use validation
validateData(data);
const tx = await dataPointStorage.writeDataPoint(data);
```

## Common Use Cases

### Content Publishing
```typescript
// Publish an article
const article = {
    title: "Understanding ESP",
    content: "ESP is a decentralized storage protocol...",
    author: "0x1234...",
    timestamp: Date.now()
};
const data = ethers.toUtf8Bytes(JSON.stringify(article));
const tx = await dataPointRegistry.registerDataPoint(data, authorAddress);
```

### Configuration Storage
```typescript
// Store application configuration
const config = {
    network: "mainnet",
    rpcUrl: "https://eth-mainnet.alchemyapi.io/v2/...",
    contractAddresses: {
        token: "0x1234...",
        nft: "0x5678..."
    }
};
const data = ethers.toUtf8Bytes(JSON.stringify(config));
const tx = await dataPointRegistry.registerDataPoint(data, deployerAddress);
```

### Data References
```typescript
// Create reference to external data
const reference = {
    type: "ipfs",
    hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    metadata: {
        name: "document.pdf",
        size: 1024000,
        mimeType: "application/pdf"
    }
};
const data = ethers.toUtf8Bytes(JSON.stringify(reference));
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
```

### Handling Large Data
For data larger than 32KB, you'll need to build custom smart contracts that work with ESP. Here are some patterns to consider:

#### 1. Bytes32 Array Pattern
```solidity
// Custom contract for storing large files as chunks
contract LargeFileStorage {
    IDataPointRegistry public registry;
    
    struct LargeFile {
        bytes32[] chunks;  // Array of ESP data point addresses
        uint256 totalSize;
        string metadata;
    }
    
    mapping(bytes32 => LargeFile) public files;
    
    function storeLargeFile(
        bytes[] memory dataChunks,
        string memory metadata
    ) external returns (bytes32 fileId) {
        bytes32[] memory chunkAddresses = new bytes32[](dataChunks.length);
        uint256 totalSize = 0;
        
        // Store each chunk in ESP
        for (uint i = 0; i < dataChunks.length; i++) {
            require(dataChunks[i].length <= 32768, "Chunk too large");
            
            bytes32 chunkAddress = registry.registerDataPoint(dataChunks[i], msg.sender);
            chunkAddresses[i] = chunkAddress;
            totalSize += dataChunks[i].length;
        }
        
        fileId = keccak256(abi.encodePacked(chunkAddresses, block.timestamp));
        
        files[fileId] = LargeFile({
            chunks: chunkAddresses,
            totalSize: totalSize,
            metadata: metadata
        });
    }
    
    function retrieveLargeFile(bytes32 fileId) external view returns (bytes memory) {
        LargeFile memory file = files[fileId];
        bytes memory fullData = new bytes(file.totalSize);
        uint256 offset = 0;
        
        for (uint i = 0; i < file.chunks.length; i++) {
            bytes memory chunk = registry.DPS().readDataPoint(file.chunks[i]);
            for (uint j = 0; j < chunk.length; j++) {
                fullData[offset + j] = chunk[j];
            }
            offset += chunk.length;
        }
        
        return fullData;
    }
}
```

#### 2. Client-Side Chunking
```typescript
// Split large data into ESP-compatible chunks
function chunkData(data: Uint8Array, chunkSize: number = 30000): Uint8Array[] {
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
}

// Store chunks and create metadata
async function storeLargeFile(data: Uint8Array, publisherAddress: string) {
    const chunks = chunkData(data);
    const chunkAddresses = [];
    
    // Store each chunk in ESP
    for (const chunk of chunks) {
        const tx = await dataPointRegistry.registerDataPoint(chunk, publisherAddress);
        await tx.wait();
        const address = await dataPointStorage.calculateAddress(chunk);
        chunkAddresses.push(address);
    }
    
    // Create metadata with chunk references
    const metadata = {
        type: "chunked-file",
        chunks: chunkAddresses,
        totalSize: data.length,
        chunkCount: chunks.length,
        checksum: ethers.keccak256(data)
    };
    
    const metadataData = ethers.toUtf8Bytes(JSON.stringify(metadata));
    const metadataTx = await dataPointRegistry.registerDataPoint(metadataData, publisherAddress);
    await metadataTx.wait();
    
    return await dataPointStorage.calculateAddress(metadataData);
}
```

#### 3. Example Implementation
For reference: [WTTP Storage](/docs/wttp/wttp-storage) uses an array-based chunking strategy that you can adapt for your needs. [WTTP Gateway](/docs/wttp/wttp-storage) reads from the array using memory access for reading large files. 

## Troubleshooting

### Common Issues

#### Data Already Exists
```typescript
// Check if data exists before storing
const address = await dataPointStorage.calculateAddress(data);
const size = await dataPointStorage.dataPointSize(address);

if (size > 0) {
    console.log("Data already exists at:", address);
    // Use existing data or handle accordingly
} else {
    // Safe to store
    const tx = await dataPointStorage.writeDataPoint(data);
}
```

#### Invalid Data
```typescript
// Validate data before storage
if (data.length === 0) {
    throw new Error("Cannot store empty data");
}
```

#### Gas Estimation
```typescript
// Estimate gas before transaction
const gasEstimate = await dataPointStorage.writeDataPoint.estimateGas(data);
console.log("Estimated gas:", gasEstimate.toString());

// Use gas estimate with buffer
const tx = await dataPointStorage.writeDataPoint(data, {
    gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
});
```

## Next Steps

- [Learn about Storage Layer](/docs/esp/esp-storage)
- [Explore Registry Operations](/docs/esp/registry)
- [Understand Royalty System](/docs/esp/royalties)
- [Back to Overview](/docs/esp/esp-overview)
