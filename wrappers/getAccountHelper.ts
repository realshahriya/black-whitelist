import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

/**
 * Helper function to get account information with compatibility between TonClient and TonClient4
 */
export const getAccountInfo = async (provider: NetworkProvider, seqno: number, address: Address) => {
    const api = provider.api();
    
    if ('getAccount' in api) {
        // TonClient4 method
        return await (api as any).getAccount(seqno, address);
    } else {
        // TonClient fallback - use getAccountLite or similar method
        if ('getAccountLite' in api) {
            return await (api as any).getAccountLite(seqno, address);
        } else {
            throw new Error('No compatible getAccount method found in the API client');
        }
    }
};