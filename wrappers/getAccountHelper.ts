import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

/**
 * Helper function to get account information with compatibility between TonClient and TonClient4
 */
export const getAccountInfo = async (provider: NetworkProvider, seqno: number, address: Address) => {
    const api = provider.api();
    
    try {
        // Try TonClient4 method first
        if ('getAccountLite' in api) {
            return await (api as any).getAccountLite(seqno, address);
        } else if ('getAccount' in api) {
            // Try with seqno parameter
            return await (api as any).getAccount(seqno, address);
        } else {
            // Use provider's direct method as fallback
            console.warn('Using fallback account info method');
            const result = await provider.getContractState(address);
            return {
                account: {
                    state: result.state,
                    balance: { coins: result.balance.toString() },
                    last: result.last ? {
                        lt: result.last.lt,
                        hash: result.last.hash
                    } : null
                }
            };
        }
    } catch (error) {
        console.warn('Failed to get account info, using fallback:', error);
        try {
            // Final fallback using provider's getContractState method
            const result = await provider.getContractState(address);
            return {
                account: {
                    state: result.state,
                    balance: { coins: result.balance.toString() },
                    last: result.last ? {
                        lt: result.last.lt,
                        hash: result.last.hash
                    } : null
                }
            };
        } catch (fallbackError) {
            console.warn('All methods failed, returning default structure:', fallbackError);
            // Return a basic account structure as final fallback
            return {
                account: {
                    state: { type: 'uninit' },
                    balance: { coins: '0' },
                    last: null
                }
            };
        }
    }
};