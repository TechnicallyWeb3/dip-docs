---
id: royalties
title: Royalties
---

# ESP Royalty System

The ESP royalty system provides economic incentives for data publishers by allowing them to earn royalties when developers re-register the same data on-chain. This creates a self-sustaining economic model that rewards data creators for preventing duplicate uploads and ensures the protocol's long-term viability.

## Overview

The royalty system works through a two-phase process:
1. **Registration Phase**: Publishers register data and pay gas costs, earning the right to collect royalties
2. **Re-registration Phase**: Developers pay royalties when they want to re-register the same data on-chain, with publishers receiving the majority of the payment

## How Royalties Work

### Royalty Calculation
Royalties are calculated based on gas usage during the initial data storage:

```solidity
royalty_amount = gas_used × royalty_rate
```

Where:
- `gas_used`: Gas consumed during `writeDataPoint` operation
- `royalty_rate`: Configurable rate set by the protocol owner

### Royalty Distribution
When royalties are paid:
- **Publisher**: Receives `royalty_amount - protocol_fee`
- **Protocol**: Receives `royalty_amount / 10` (10% fee)
- **Publisher**: Receives `royalty_amount * 9 / 10` (90% of royalties)

## Core Functions

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

## Royalty Lifecycle

### 1. Data Registration
```typescript
// Publisher registers data and pays gas
const data = ethers.toUtf8Bytes("My valuable content");
const publisherAddress = signer.address;

// This will track gas usage and set up royalty collection
const tx = await dataPointRegistry.registerDataPoint(data, publisherAddress);
await tx.wait();

// Gas usage is automatically tracked and stored
console.log("Data registered with royalty tracking");
```

### 2. Data Re-registration
```typescript
// Developer wants to re-register the same data and pays royalties
const address = await dataPointStorage.calculateAddress(data);
const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);

if (royaltyCost > 0) {
    // Pay royalties to re-register the same data
    const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress, {
        value: royaltyCost
    });
    await tx.wait();
    
    // Publisher earns royalties (minus protocol fee)
    console.log("Royalties paid:", ethers.formatEther(royaltyCost));
}
```

### 3. Royalty Collection
```typescript
// Publisher withdraws earned royalties
const balance = await dataPointRegistry.royaltyBalance(publisherAddress);
if (balance > 0) {
    const tx = await dataPointRegistry.collectRoyalties(balance, publisherAddress);
    await tx.wait();
    console.log("Royalties collected:", ethers.formatEther(balance));
}
```

## Royalty-Free Data

### Waiving Royalties
Publishers can waive royalties by using `address(0)` as the publisher:

```typescript
// Register data without royalties
const data = ethers.toUtf8Bytes("Free content");
const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress);
await tx.wait();

// This data can be re-registered without paying royalties
console.log("Data registered without royalties");
```

### Use Cases for Royalty-Free Data
- Public domain content
- Open source documentation
- Community resources
- Educational materials
- Protocol metadata

## Advanced Royalty Management

### Batch Royalty Collection
```typescript
// Collect royalties for multiple publishers
async function collectAllRoyalties(publishers: string[]) {
    for (const publisher of publishers) {
        const balance = await dataPointRegistry.royaltyBalance(publisher);
        if (balance > 0) {
            const tx = await dataPointRegistry.collectRoyalties(balance, publisher);
            await tx.wait();
            console.log(`Collected ${ethers.formatEther(balance)} for ${publisher}`);
        }
    }
}
```

### Royalty Analytics
```typescript
// Track royalty earnings over time
class RoyaltyTracker {
    private registry: DataPointRegistry;
    
    constructor(registry: DataPointRegistry) {
        this.registry = registry;
    }
    
    async getPublisherStats(publisher: string) {
        const balance = await this.registry.royaltyBalance(publisher);
        return {
            currentBalance: ethers.formatEther(balance),
            balanceWei: balance.toString()
        };
    }
    
    async getTotalRoyaltiesPaid(dataPointAddress: string) {
        // This would require additional tracking - simplified example
        const royaltyCost = await this.registry.getDataPointRoyalty(dataPointAddress);
        return ethers.formatEther(royaltyCost);
    }
}
```

### Conditional Royalty Payment
```typescript
// Pay royalties only if data exists and has royalties
async function accessDataWithRoyalties(data: Uint8Array) {
    const address = await dataPointStorage.calculateAddress(data);
    const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
    
    if (royaltyCost > 0) {
        // Data exists and has royalties
        const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress, {
            value: royaltyCost
        });
        await tx.wait();
        console.log("Royalties paid:", ethers.formatEther(royaltyCost));
    } else {
        // Data doesn't exist or has no royalties
        const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress);
        await tx.wait();
        console.log("No royalties required");
    }
}
```

## Economic Model

### Incentive Structure
The royalty system creates several incentives:

1. **Data Quality**: Publishers are incentivized to create valuable content
2. **Data Availability**: Publishers maintain access to their data
3. **Protocol Sustainability**: Protocol fees support ongoing development
4. **Fair Compensation**: Publishers receive 90% of royalty payments

### Economic Parameters
```typescript
// Protocol parameters
const PROTOCOL_FEE_RATE = 0.1; // 10%
const PUBLISHER_SHARE = 0.9;   // 90%

// Royalty calculation
function calculateRoyaltyDistribution(royaltyAmount: bigint) {
    const protocolFee = royaltyAmount / 10n;
    const publisherShare = royaltyAmount - protocolFee;
    
    return {
        protocolFee,
        publisherShare,
        total: royaltyAmount
    };
}
```

### Gas-Based Royalty Calculation
```typescript
// Royalty is based on gas usage during storage
async function estimateRoyaltyCost(data: Uint8Array, royaltyRate: bigint) {
    // Estimate gas for writeDataPoint
    const gasEstimate = await dataPointStorage.writeDataPoint.estimateGas(data);
    
    // Calculate royalty cost
    const royaltyCost = gasEstimate * royaltyRate;
    
    return {
        gasEstimate: gasEstimate.toString(),
        royaltyCost: ethers.formatEther(royaltyCost),
        royaltyCostWei: royaltyCost.toString()
    };
}
```

## Integration Examples

### With DApps
```typescript
// DApp integration for content monetization
class ContentDApp {
    private registry: DataPointRegistry;
    private storage: DataPointStorage;
    
    constructor(registry: DataPointRegistry, storage: DataPointStorage) {
        this.registry = registry;
        this.storage = storage;
    }
    
    async publishContent(content: string, publisher: string) {
        const data = ethers.toUtf8Bytes(content);
        const tx = await this.registry.registerDataPoint(data, publisher);
        await tx.wait();
        
        const address = await this.storage.calculateAddress(data);
        return {
            address,
            txHash: tx.hash,
            publisher
        };
    }
    
    async reRegisterContent(data: Uint8Array, developerAddress: string) {
        const address = await this.storage.calculateAddress(data);
        const royaltyCost = await this.registry.getDataPointRoyalty(address);
        
        if (royaltyCost > 0) {
            // Developer pays royalties to re-register
            const tx = await this.registry.registerDataPoint(
                data,
                ethers.ZeroAddress,
                { value: royaltyCost }
            );
            await tx.wait();
        }
        
        return address;
    }
}
```

### With Smart Contracts
```solidity
// Solidity contract for royalty management
contract RoyaltyManager {
    IDataPointRegistry public registry;
    
    constructor(address _registry) {
        registry = IDataPointRegistry(_registry);
    }
    
    function publishWithRoyalties(bytes memory data, address publisher) external {
        registry.registerDataPoint(data, publisher);
    }
    
    function reRegisterWithRoyalties(bytes memory data) external payable {
        registry.registerDataPoint{value: msg.value}(data, address(0));
    }
    
    function collectRoyalties(uint256 amount) external {
        registry.collectRoyalties(amount, msg.sender);
    }
}
```

### With Frontend Applications
```typescript
// React component for royalty management
import { useState, useEffect } from 'react';

function RoyaltyDashboard({ registry, publisherAddress }) {
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadBalance();
    }, [publisherAddress]);
    
    const loadBalance = async () => {
        const balance = await registry.royaltyBalance(publisherAddress);
        setBalance(ethers.formatEther(balance));
    };
    
    const collectRoyalties = async () => {
        setLoading(true);
        try {
            const balance = await registry.royaltyBalance(publisherAddress);
            if (balance > 0) {
                const tx = await registry.collectRoyalties(balance, publisherAddress);
                await tx.wait();
                await loadBalance();
            }
        } catch (error) {
            console.error("Failed to collect royalties:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <h3>Royalty Balance: {balance} ETH</h3>
            <button 
                onClick={collectRoyalties} 
                disabled={loading || balance === '0.0'}
            >
                {loading ? 'Collecting...' : 'Collect Royalties'}
            </button>
        </div>
    );
}
```

## Monitoring and Analytics

### Event Monitoring
```typescript
// Monitor royalty events
const royaltyPaidFilter = dataPointRegistry.filters.RoyaltiesPaid();
dataPointRegistry.on(royaltyPaidFilter, (dataPointAddress, payer, amount) => {
    console.log("Royalty paid:", {
        dataPoint: dataPointAddress,
        payer: payer,
        amount: ethers.formatEther(amount)
    });
});

const royaltyCollectedFilter = dataPointRegistry.filters.RoyaltiesCollected();
dataPointRegistry.on(royaltyCollectedFilter, (publisher, amount, withdrawTo) => {
    console.log("Royalty collected:", {
        publisher: publisher,
        amount: ethers.formatEther(amount),
        withdrawTo: withdrawTo
    });
});
```

### Royalty Analytics
```typescript
// Track royalty performance
class RoyaltyAnalytics {
    private registry: DataPointRegistry;
    
    constructor(registry: DataPointRegistry) {
        this.registry = registry;
    }
    
    async getPublisherPerformance(publisher: string) {
        const balance = await this.registry.royaltyBalance(publisher);
        return {
            currentBalance: ethers.formatEther(balance),
            balanceWei: balance.toString()
        };
    }
    
    async getDataPointRoyaltyInfo(dataPointAddress: string) {
        const royaltyCost = await this.registry.getDataPointRoyalty(dataPointAddress);
        return {
            royaltyCost: ethers.formatEther(royaltyCost),
            royaltyCostWei: royaltyCost.toString()
        };
    }
}
```

## Best Practices

### Gas Optimization
```typescript
// Optimize gas usage for royalty calculations
async function registerDataOptimally(data: Uint8Array, publisher: string) {
    // Use appropriate gas limits
    const gasEstimate = await dataPointRegistry.registerDataPoint.estimateGas(data, publisher);
    const tx = await dataPointRegistry.registerDataPoint(data, publisher, {
        gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
    });
    await tx.wait();
}
```

### Error Handling
```typescript
// Comprehensive error handling for royalty operations
async function handleRoyaltyPayment(data: Uint8Array) {
    try {
        const address = await dataPointStorage.calculateAddress(data);
        const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
        
        if (royaltyCost > 0) {
            const balance = await provider.getBalance(signer.address);
            if (balance < royaltyCost) {
                throw new Error("Insufficient balance for royalty payment");
            }
            
            const tx = await dataPointRegistry.registerDataPoint(data, ethers.ZeroAddress, {
                value: royaltyCost
            });
            await tx.wait();
        }
    } catch (error) {
        console.error("Royalty payment failed:", error);
        throw error;
    }
}
```

### Security Considerations
```typescript
// Validate royalty payments
function validateRoyaltyPayment(amount: bigint, expectedCost: bigint): boolean {
    if (amount < expectedCost) {
        throw new Error("Insufficient royalty payment");
    }
    if (amount > expectedCost * 2n) {
        console.warn("Royalty payment significantly higher than expected");
    }
    return true;
}
```

## Troubleshooting

### Common Issues

#### Insufficient Royalty Payment
```typescript
// Check royalty cost before payment
const royaltyCost = await dataPointRegistry.getDataPointRoyalty(address);
const balance = await provider.getBalance(signer.address);

if (balance < royaltyCost) {
    throw new Error(`Insufficient balance. Need ${ethers.formatEther(royaltyCost)} ETH`);
}
```

#### Royalty Collection Failures
```typescript
// Check balance before collection
const balance = await dataPointRegistry.royaltyBalance(publisherAddress);
if (balance === 0n) {
    console.log("No royalties to collect");
    return;
}

// Collect with proper error handling
try {
    const tx = await dataPointRegistry.collectRoyalties(balance, publisherAddress);
    await tx.wait();
} catch (error) {
    console.error("Royalty collection failed:", error);
}
```

## Next Steps

- [Back to Overview](/docs/esp/esp-overview)
- [Learn about Registry Operations](/docs/esp/registry)
- [Explore Storage Layer](/docs/esp/esp-storage)
- [Understand Data Points](/docs/esp/datapoints)
