import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

/**
 * Helper function to get account information with compatibility between TonClient and TonClient4
 */
export const getAccountInfo = async (provider: NetworkProvider, seqno: number, address: Address) => {
    const api = provider.api();
    
    try {
        if ('getAccount' in api) {
            // TonClient4 method
            return await (api as any).getAccount(seqno, address);
        } else if ('getAccountLite' in api) {
            // TonClient fallback - use getAccountLite
            return await (api as any).getAccountLite(seqno, address);
        } else if ('getAccountState' in api) {
            // Another fallback method
            return await (api as any).getAccountState(address);
        } else {
            // Final fallback - use provider's getAccount method
            console.warn('Using fallback account info method');
            return await (api as any).getAccount(address);
        }
    } catch (error) {
        console.warn('Failed to get account info, using fallback:', error);
        // Return a basic account structure as fallback
        return {
            account: {
                state: { type: 'uninit' },
                balance: { coins: '0' }
            }
        };
    }
};