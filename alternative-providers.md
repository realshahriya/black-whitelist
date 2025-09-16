# TON API Provider Alternatives

## Issue Summary

The current project uses `@orbs-network/ton-access` which provides access to `ton.access.orbs.network`. This provider is currently returning a **500 Internal Server Error**, confirmed through direct cURL testing.

## Current Configuration

- **Provider**: `@orbs-network/ton-access` (version 2.3.3)
- **Usage**: Found in `tests/JettonWallet.spec.ts` (commented out)
- **Error**: 500 Internal Server Error from `ton.access.orbs.network`

## Alternative TON API Providers

### 1. TON Center API (Recommended)

```typescript
import { TonClient } from '@ton/ton';

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'your-api-key-here' // Get from https://toncenter.com
});
```

### 2. TON API (ton-api.io)

```typescript
import { TonClient4 } from '@ton/ton';

const client = new TonClient4({
    endpoint: 'https://mainnet-v4.tonhubapi.com'
});
```

### 3. GetGems API

```typescript
import { TonClient4 } from '@ton/ton';

const client = new TonClient4({
    endpoint: 'https://ton-api-v4.getgems.io'
});
```

### 4. TON Whales API

```typescript
import { TonClient4 } from '@ton/ton';

const client = new TonClient4({
    endpoint: 'https://ton.whales-api.com/v4'
});
```

## Implementation Steps

### Step 1: Add Alternative Provider Configuration

Create a configuration file to easily switch between providers:

```typescript
// config/ton-providers.ts
export const TON_PROVIDERS = {
    orbs: 'https://ton.access.orbs.network',
    toncenter: 'https://toncenter.com/api/v2/jsonRPC',
    tonhub: 'https://mainnet-v4.tonhubapi.com',
    getgems: 'https://ton-api-v4.getgems.io',
    whales: 'https://ton.whales-api.com/v4'
};
```

### Step 2: Implement Fallback Logic

```typescript
async function createTonClient(): Promise<TonClient4> {
    const providers = [
        TON_PROVIDERS.tonhub,
        TON_PROVIDERS.getgems,
        TON_PROVIDERS.whales,
        TON_PROVIDERS.orbs // Keep as fallback
    ];

    for (const endpoint of providers) {
        try {
            const client = new TonClient4({ endpoint });
            // Test the connection
            await client.getLastBlock();
            console.log(`Successfully connected to: ${endpoint}`);
            return client;
        } catch (error) {
            console.warn(`Failed to connect to ${endpoint}:`, error);
        }
    }
    
    throw new Error('All TON API providers are unavailable');
}
```

### Step 3: Update Test Configuration

Modify `tests/JettonWallet.spec.ts` to use the fallback logic:

```typescript
// Replace the commented RemoteBlockchainStorage section with:
const tonClient = await createTonClient();
blockchain = await Blockchain.create({
    storage: new RemoteBlockchainStorage(
        wrapTonClient4ForRemote(tonClient)
    ),
});
```

## Quick Fix for Current Issue

### Option 1: Use TON Hub (No API Key Required)

Replace the orbs-network import in your test file:

```typescript
// Remove or comment out:
// import { getHttpV4Endpoint } from '@orbs-network/ton-access';

// Add:
const endpoint = 'https://mainnet-v4.tonhubapi.com';
```

### Option 2: Use Environment Variable

Create a `.env` file:

```env
TON_API_ENDPOINT=https://mainnet-v4.tonhubapi.com
```

Then use it in your code:

```typescript
const endpoint = process.env.TON_API_ENDPOINT || 'https://mainnet-v4.tonhubapi.com';
```

## Testing the Fix

Run this command to test connectivity to alternative providers:

```bash
curl -X GET "https://mainnet-v4.tonhubapi.com/block/latest" -H "Accept: application/json"
```

## Notes

- **TON Center**: Requires API key but very reliable
- **TON Hub**: Free, no API key required, good performance
- **GetGems**: Good for NFT-related queries
- **TON Whales**: Reliable alternative with good uptime

Choose based on your specific needs and reliability requirements.
