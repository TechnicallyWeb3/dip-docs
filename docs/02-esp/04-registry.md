---
id: registry
title: Registry
---

# ESP Registry Layer

The DataPointRegistry is the economic layer of ESP that manages data point publishing, royalty payments, and re-registration control. It extends the basic storage functionality with economic incentives and publisher management.

## Overview

The DataPointRegistry provides:
- **Economic Incentives**: Publishers earn royalties when developers re-register the same data
- **Publisher Management**: Track and manage data point publishers
- **Royalty Distribution**: Automatic royalty calculation and payment
- **Re-registration Control**: Owner-controlled protocol parameters
- **Integration Layer**: Seamless integration with DataPointStorage

## Core Functions

### `registerDataPoint(bytes memory _dataPoint, address _publisher)`
Registers a data point with royalty tracking.

```typescript
// Register data with publisher
const data = ethers.toUtf8Bytes("My published content");
const publisherAddress = signer.address;
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
await tx.wait();
```

**Parameters:**
- `_dataPoint`: The data to store
- `_publisher`: Publisher address (use `address(0)` to waive royalties)

**Returns:**
- `bytes32` - The data point address

**Events:**
- `DataPointRegistered(bytes32 indexed dataPointAddress, address indexed publisher)`

### `getDataPointRoyalty(bytes32 _dataPointAddress)`
Gets the royalty cost for re-registering a data point.

```typescript
// Get royalty cost
const address = await dataPointStorage.calculateAddress(data);
const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
console.log("Royalty cost:", ethers.formatEther(royaltyCost), "ETH");
```

**Returns:**
- `uint256` - Royalty cost in wei

### `collectRoyalties(uint256 _amount, address _withdrawTo)`
Allows publishers to withdraw their earned royalties.

```typescript
// Withdraw royalties
const amount = ethers.parseEther("0.1"); // 0.1 ETH
const tx = await dataPointRegistry.collectRoyalties(amount, signer.address);
await tx.wait();
```

**Parameters:**
- `_amount`: Amount to withdraw in wei
- `_withdrawTo`: Address to send royalties to

**Events:**
- `RoyaltiesCollected(address indexed publisher, uint256 amount, address indexed withdrawTo)`

### `royaltyBalance(address _publisher)`
Checks the royalty balance of a publisher.

```typescript
// Check royalty balance
const balance = await dataPointRegistry.royaltyBalance(publisherAddress);
console.log("Royalty balance:", ethers.formatEther(balance), "ETH");
```

**Returns:**
- `uint256` - Current balance in wei

## Publisher Management

### Updating Publisher Address
```typescript
// Update publisher address
const newPublisherAddress = "0x1234...";
const tx = await dataPointRegistry.updatePublisherAddress(
    dataPointAddress, 
    newPublisherAddress
);
await tx.wait();
```

**Requirements:**
- Only the current publisher can update the address
- New address cannot be zero address

### Publisher Verification
```typescript
// Check if address is publisher of data point
async function isPublisher(dataPointAddress: string, address: string): Promise<boolean> {
    const royaltyInfo = await dataPointRegistry.getDataPointRoyalty(dataPointAddress);
    // This is a simplified check - you'd need to implement proper royalty info retrieval
    return true; // Implement based on your needs
}
```

## Royalty System Integration

### How Royalties Work

1. **Data Registration**: When data is first registered, gas usage is tracked
2. **Royalty Calculation**: Royalty = gas_used × royalty_rate
3. **Re-registration Payment**: Developers pay royalties when re-registering existing data
4. **Publisher Rewards**: Publishers earn royalties minus a small protocol fee

### Royalty Flow
```typescript
// First registration (publisher pays gas, earns royalties)
const data = ethers.toUtf8Bytes("New content");
const tx1 = await dataPointRegistry.registerDataPoint(data, publisherAddress);
await tx1.wait();

// Subsequent re-registration (developer pays royalties)
const address = await dataPointStorage.calculateAddress(data);
const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
const tx2 = await dataPointRegistry.registerDataPoint(data, address(0), {
    value: royaltyCost
});
await tx2.wait();
```

## Advanced Operations

### Batch Registration
```typescript
// Register multiple data points
const dataPoints = [
    { data: ethers.toUtf8Bytes("Content 1"), publisher: publisher1 },
    { data: ethers.toUtf8Bytes("Content 2"), publisher: publisher2 },
    { data: ethers.toUtf8Bytes("Content 3"), publisher: publisher3 }
];

const addresses = [];
for (const { data, publisher } of dataPoints) {
    const tx = await dataPointRegistry.registerDataPoint(data, publisher);
    await tx.wait();
    const address = await dataPointStorage.calculateAddress(data);
    addresses.push(address);
}
```

### Royalty-Free Data
```typescript
// Register data without royalties
const data = ethers.toUtf8Bytes("Free content");
const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress);
await tx.wait();
```

### Conditional Registration
```typescript
// Check if data exists before registering
async function registerIfNew(data: Uint8Array, publisher: string) {
    const address = await dataPointStorage.calculateAddress(data);
    const size = await dataPointStorage.dataPointSize(address);
    
    if (size > 0) {
        console.log("Data already exists, paying royalties to re-register...");
        const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
        const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress, {
            value: royaltyCost
        });
        await tx.wait();
    } else {
        console.log("New data, registering...");
        const tx = await dataPointRegistry.registerDataPoint(data, publisher);
        await tx.wait();
    }
}
```

## Error Handling

### Common Errors

#### `InsufficientRoyaltyPayment(uint256 royaltyCost)`
Thrown when not enough ETH is sent for royalty payment.

```typescript
try {
    const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress, {
        value: ethers.parseEther("0.001") // Too little
    });
} catch (error) {
    if (error.message.includes("InsufficientRoyaltyPayment")) {
        console.log("Not enough ETH for royalty payment");
    }
}
```

#### `InvalidPublisher(address publisher)`
Thrown when trying to update publisher address without permission.

```typescript
try {
    const tx = await dataPointRegistry.updatePublisherAddress(
        dataPointAddress, 
        newPublisherAddress
    );
} catch (error) {
    if (error.message.includes("InvalidPublisher")) {
        console.log("Not authorized to update publisher");
    }
}
```

### Error Prevention
```typescript
// Check royalty cost before payment
async function payRoyaltiesSafely(dataPointAddress: string) {
    const royaltyCost = await dataPointRegistry.getDataPointRoyalty(dataPointAddress);
    
    if (royaltyCost > 0) {
        const balance = await provider.getBalance(signer.address);
        if (balance < royaltyCost) {
            throw new Error("Insufficient balance for royalty payment");
        }
        
        const tx = await dataPointRegistry.registerDataPoint(
            data, 
            ethers.ZeroAddress, 
            { value: royaltyCost }
        );
        await tx.wait();
    }
}
```

## Integration Examples

### With Web Applications
```typescript
// React hook for data registration
import { useState } from 'react';
import { useContract } from './hooks/useContract';

function useDataRegistration() {
    const [loading, setLoading] = useState(false);
    const { dataPointRegistry } = useContract();
    
    const registerData = async (data: string, publisher: string) => {
        setLoading(true);
        try {
            const dataBytes = ethers.toUtf8Bytes(data);
            const tx = await dataPointRegistry.registerDataPoint(dataBytes, publisher);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    return { registerData, loading };
}
```

### With Smart Contracts
```solidity
// Solidity contract using ESP registry
contract MyApp {
    IDataPointRegistry public registry;
    
    constructor(address _registry) {
        registry = IDataPointRegistry(_registry);
    }
    
    function publishData(bytes memory data) external {
        registry.registerDataPoint(data, msg.sender);
    }
    
    function reRegisterData(bytes memory data) external payable {
        registry.registerDataPoint{value: msg.value}(data, address(0));
    }
}
```

### With Backend Services
```typescript
// Node.js service for data management
class DataService {
    constructor(registry: DataPointRegistry) {
        this.registry = registry;
    }
    
    async publishContent(content: string, publisher: string) {
        const data = ethers.toUtf8Bytes(content);
        const tx = await this.registry.registerDataPoint(data, publisher);
        await tx.wait();
        
        const address = await this.registry.DPS().calculateAddress(data);
        return {
            address,
            txHash: tx.hash,
            publisher
        };
    }
    
    async reRegisterContent(data: Uint8Array) {
        const address = await this.registry.DPS().calculateAddress(data);
        const royaltyCost = await this.registry.getDataPointRoyalty(address);
        
        if (royaltyCost > 0) {
            const tx = await this.registry.registerDataPoint(data, ethers.ZeroAddress, {
                value: royaltyCost
            });
            await tx.wait();
        }
        
        return address;
    }
}
```

## Monitoring and Analytics

### Event Monitoring
```typescript
// Monitor registration events
const filter = dataPointRegistry.filters.DataPointRegistered();
dataPointRegistry.on(filter, (dataPointAddress, publisher) => {
    console.log("New data registered:", {
        address: dataPointAddress,
        publisher: publisher
    });
});

// Monitor royalty payments
const royaltyFilter = dataPointRegistry.filters.RoyaltiesPaid();
dataPointRegistry.on(royaltyFilter, (dataPointAddress, payer, amount) => {
    console.log("Royalty paid:", {
        address: dataPointAddress,
        payer: payer,
        amount: ethers.formatEther(amount)
    });
});
```

### Analytics Functions
```typescript
// Get publisher statistics
async function getPublisherStats(publisher: string) {
    const balance = await dataPointRegistry.royaltyBalance(publisher);
    return {
        royaltyBalance: ethers.formatEther(balance),
        balanceWei: balance.toString()
    };
}

// Check data point status
async function getDataPointStatus(dataPointAddress: string) {
    const royaltyCost = await dataPointRegistry.getDataPointRoyalty(dataPointAddress);
    const size = await dataPointRegistry.DPS().dataPointSize(dataPointAddress);
    
    return {
        exists: size > 0,
        royaltyCost: ethers.formatEther(royaltyCost),
        size: size.toString()
    };
}
```

## Best Practices

### Gas Optimization
```typescript
// Batch operations when possible
const dataPoints = [/* multiple data points */];
const tx = await dataPointRegistry.multicall(
    dataPoints.map(dp => 
        dataPointRegistry.interface.encodeFunctionData(
            "registerDataPoint", 
            [dp.data, dp.publisher]
        )
    )
);
```

### Error Recovery
```typescript
// Implement retry logic for failed transactions
async function registerWithRetry(data: Uint8Array, publisher: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const tx = await dataPointRegistry.registerDataPoint(data, publisher);
            await tx.wait();
            return tx;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### Security Considerations
```typescript
// Validate inputs before registration
function validateRegistration(data: Uint8Array, publisher: string): boolean {
    if (data.length === 0) {
        throw new Error("Data cannot be empty");
    }
    if (publisher === ethers.ZeroAddress) {
        console.log("Warning: Registering without royalties");
    }
    return true;
}
```

## Next Steps

- [Learn about Royalty System](/docs/esp/royalties)
- [Explore Storage Layer](/docs/esp/esp-storage)
- [Understand Data Points](/docs/esp/datapoints)
- [Back to Overview](/docs/esp/esp-overview)
