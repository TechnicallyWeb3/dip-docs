---
id: esp-storage
title: ESP Storage
---

# ESP Storage Layer

The DataPointStorage contract is the core storage layer of ESP, providing immutable, content-addressed storage for data points. It handles the fundamental operations of storing and retrieving data with cryptographic integrity guarantees.

## Overview

The DataPointStorage contract is designed to be:
- **Immutable**: Once stored, data cannot be modified
- **Content-addressed**: Data is identified by its content hash
- **Collision-resistant**: Different data produces different addresses
- **Gas-efficient**: Optimized for cost-effective storage operations

## Data Size Limits

ESP has practical limits on data point size:
- **Recommended maximum**: 32KB per data point
- **Absolute maximum**: ~42KB (tested limit)
- For larger data, build custom smart contracts that chunk data into ESP-compatible sizes

## Core Functions

### `writeDataPoint(bytes memory _data)`
Stores a new data point and returns its address.

```typescript
// Store data
const data = ethers.toUtf8Bytes("Hello, ESP!");
const tx = await dataPointStorage.writeDataPoint(data);
await tx.wait();

// Get the address where data was stored
const address = await dataPointStorage.calculateAddress(data);
console.log("Data stored at:", address);
```

**Requirements:**
- Data cannot be empty
- Address must not already be occupied
- Returns the storage address

**Events:**
- `DataPointWritten(bytes32 indexed dataPointAddress)`

### `readDataPoint(bytes32 _dataPointAddress)`
Retrieves stored data by its address.

```typescript
// Read data
const data = await dataPointStorage.readDataPoint(address);
console.log("Retrieved data:", ethers.toUtf8String(data));
```

**Returns:**
- `bytes memory` - The stored data

### `calculateAddress(bytes memory _data)`
Calculates the storage address for given data.

```typescript
// Calculate address before storing
const data = ethers.toUtf8Bytes("My data");
const address = await dataPointStorage.calculateAddress(data);
console.log("Will be stored at:", address);
```

**Returns:**
- `bytes32` - The calculated address

### `dataPointSize(bytes32 _dataPointAddress)`
Returns the size of stored data.

```typescript
// Check data size
const size = await dataPointStorage.dataPointSize(address);
console.log("Data size:", size, "bytes");
```

**Returns:**
- `uint256` - Size in bytes (0 if data doesn't exist)

## Storage Architecture

### Content Addressing
Data is stored using content-addressed addressing:

```solidity
function calculateDataPointAddress(
    bytes memory _data,
    uint8 _version
) pure returns (bytes32) {
    return keccak256(abi.encodePacked(_data, _version));
}
```

### Version System
ESP uses versioning to handle protocol updates:
- Current version: 2
- Version is included in address calculation
- Enables protocol evolution while maintaining compatibility

### Storage Mapping
```solidity
mapping(bytes32 => bytes) private dataPointData;
```

Data is stored in a simple mapping from address to data bytes.

## Usage Patterns

### Basic Storage and Retrieval
```typescript
import { DataPointStorage__factory } from 'ethereum-storage';

// Connect to contract
const dataPointStorage = DataPointStorage__factory.connect(
    contractAddress, 
    signer
);

// Store data
const data = ethers.toUtf8Bytes("Important information");
const tx = await dataPointStorage.writeDataPoint(data);
await tx.wait();

// Retrieve data
const address = await dataPointStorage.calculateAddress(data);
const retrievedData = await dataPointStorage.readDataPoint(address);
console.log("Data:", ethers.toUtf8String(retrievedData));
```

### Data Existence Checking
```typescript
// Check if data exists
const address = await dataPointStorage.calculateAddress(data);
const size = await dataPointStorage.dataPointSize(address);

if (size > 0) {
    console.log("Data exists, size:", size.toString());
    const data = await dataPointStorage.readDataPoint(address);
} else {
    console.log("Data does not exist");
}
```

### Batch Operations
```typescript
// Store multiple data points
const dataPoints = [
    ethers.toUtf8Bytes("Data 1"),
    ethers.toUtf8Bytes("Data 2"),
    ethers.toUtf8Bytes("Data 3")
];

const addresses = [];
for (const data of dataPoints) {
    const tx = await dataPointStorage.writeDataPoint(data);
    await tx.wait();
    const address = await dataPointStorage.calculateAddress(data);
    addresses.push(address);
}

console.log("Stored addresses:", addresses);
```

## Error Handling

### Common Errors

#### `InvalidData()`
Thrown when trying to store empty data.

```typescript
try {
    const tx = await dataPointStorage.writeDataPoint(ethers.toUtf8Bytes(""));
} catch (error) {
    if (error.message.includes("InvalidData")) {
        console.log("Cannot store empty data");
    }
}
```

#### `DataExists(bytes32 dataPointAddress)`
Thrown when trying to store data at an already occupied address.

```typescript
try {
    const tx = await dataPointStorage.writeDataPoint(data);
} catch (error) {
    if (error.message.includes("DataExists")) {
        console.log("Data already exists at this address");
        // Handle duplicate data
    }
}
```

### Error Prevention
```typescript
// Check data validity before storing
function validateData(data: Uint8Array): boolean {
    if (data.length === 0) {
        throw new Error("Data cannot be empty");
    }
    return true;
}

// Check if data already exists
async function safeStoreData(data: Uint8Array) {
    validateData(data);
    
    const address = await dataPointStorage.calculateAddress(data);
    const size = await dataPointStorage.dataPointSize(address);
    
    if (size > 0) {
        console.log("Data already exists at:", address);
        return address;
    }
    
    const tx = await dataPointStorage.writeDataPoint(data);
    await tx.wait();
    return address;
}
```

## Gas Optimization

### Gas Estimation
```typescript
// Estimate gas before transaction
const data = ethers.toUtf8Bytes("My data");
const gasEstimate = await dataPointStorage.writeDataPoint.estimateGas(data);
console.log("Estimated gas:", gasEstimate.toString());

// Use gas estimate with buffer
const tx = await dataPointStorage.writeDataPoint(data, {
    gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
});
```

### Gas Optimization Tips
- Use appropriate gas limits
- Batch operations when possible
- Consider data size impact on gas costs
- Use gas estimation for accurate pricing

## Integration Examples

### With DataPointRegistry
```typescript
// Storage is typically used through the registry
const data = ethers.toUtf8Bytes("My data");
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
await tx.wait();

// Registry handles storage internally
// You can still access storage directly if needed
const address = await dataPointStorage.calculateAddress(data);
const storedData = await dataPointStorage.readDataPoint(address);
```

### With Frontend Applications
```typescript
// React component example
import { useState, useEffect } from 'react';
import { DataPointStorage__factory } from 'ethereum-storage';

function DataViewer({ contractAddress, dataAddress }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const storage = DataPointStorage__factory.connect(
                    contractAddress, 
                    provider
                );
                const data = await storage.readDataPoint(dataAddress);
                setData(ethers.toUtf8String(data));
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [contractAddress, dataAddress]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Data not found</div>;
    
    return <div>{data}</div>;
}
```

### With Smart Contracts
```solidity
// Solidity contract using ESP storage
contract MyContract {
    IDataPointStorage public storage;
    
    constructor(address _storage) {
        storage = IDataPointStorage(_storage);
    }
    
    function storeData(bytes memory data) external {
        storage.writeDataPoint(data);
    }
    
    function getData(bytes32 address) external view returns (bytes memory) {
        return storage.readDataPoint(address);
    }
}
```

## Security Considerations

### Immutability
- Data cannot be modified once stored
- Content addressing prevents tampering
- Cryptographic integrity is guaranteed

### Access Control
- Storage contract has no access restrictions
- All functions are public
- Access control is handled at the registry level

### Data Integrity
- Content addressing ensures data integrity
- Hash collisions are computationally infeasible
- Version system prevents address conflicts

## Performance Characteristics

### Storage Efficiency
- Direct mapping storage (O(1) access)
- No complex data structures
- Minimal overhead per data point

### Gas Costs
- Storage operations are gas-efficient
- Cost scales with data size
- No recurring costs for data access

### Scalability
- Limited by Ethereum block size
- Large data should be stored off-chain
- Use for metadata and references

## Best Practices

### Data Size Considerations
```typescript
// Consider data size limits
const MAX_DATA_SIZE = 1000000; // 1MB

function validateDataSize(data: Uint8Array): boolean {
    if (data.length > MAX_DATA_SIZE) {
        throw new Error("Data too large for on-chain storage");
    }
    return true;
}
```

### Error Handling
```typescript
// Comprehensive error handling
async function storeDataSafely(data: Uint8Array) {
    try {
        // Validate data
        if (data.length === 0) {
            throw new Error("Data cannot be empty");
        }
        
        // Check if already exists
        const address = await dataPointStorage.calculateAddress(data);
        const size = await dataPointStorage.dataPointSize(address);
        
        if (size > 0) {
            console.log("Data already exists");
            return address;
        }
        
        // Store data
        const tx = await dataPointStorage.writeDataPoint(data);
        await tx.wait();
        
        return address;
    } catch (error) {
        console.error("Storage failed:", error);
        throw error;
    }
}
```

### Monitoring
```typescript
// Monitor storage events
const filter = dataPointStorage.filters.DataPointWritten();
dataPointStorage.on(filter, (dataPointAddress) => {
    console.log("New data point stored:", dataPointAddress);
});
```

## Next Steps

- [Learn about Registry Operations](/docs/esp/registry)
- [Understand Royalty System](/docs/esp/royalties)
- [Explore Data Points](/docs/esp/datapoints)
- [Back to Overview](/docs/esp/esp-overview)
