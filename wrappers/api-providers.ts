import { NetworkProvider } from '@ton/blueprint';
import { TonClient4 } from '@ton/ton';
import { Address } from '@ton/core';

export interface TONProvider {
    name: string;
    endpoint: string;
    apiKey?: string;
    priority: number;
}

export class TONProviderManager {
    private providers: TONProvider[] = [];
    private currentProviderIndex = 0;
    private maxRetries = 3;
    private retryDelay = 1000; // 1 second

    constructor(isTestnet: boolean = false) {
        this.initializeProviders(isTestnet);
    }

    private initializeProviders(isTestnet: boolean) {
        if (isTestnet) {
            this.providers = [
                {
                    name: 'TonCenter Testnet',
                    endpoint: 'https://testnet.toncenter.com/api/v2/',
                    priority: 1
                },
                {
                    name: 'TON Access Testnet',
                    endpoint: 'https://testnet.tonapi.io/',
                    priority: 2
                }
            ];
        } else {
            this.providers = [
                {
                    name: 'TonCenter Mainnet',
                    endpoint: 'https://toncenter.com/api/v2/',
                    priority: 1
                },
                {
                    name: 'TON Access Mainnet',
                    endpoint: 'https://mainnet.tonapi.io/',
                    priority: 2
                },
                {
                    name: 'Orbs Network',
                    endpoint: 'https://ton.access.orbs.network/',
                    priority: 3
                }
            ];
        }
        
        // Sort by priority
        this.providers.sort((a, b) => a.priority - b.priority);
    }

    async executeWithFallback<T>(
        operation: (client: TonClient4) => Promise<T>,
        operationName: string = 'API call'
    ): Promise<T> {
        let lastError: Error | null = null;

        for (let providerIndex = 0; providerIndex < this.providers.length; providerIndex++) {
            const provider = this.providers[providerIndex];
            
            for (let retry = 0; retry < this.maxRetries; retry++) {
                try {
                    console.log(`Attempting ${operationName} with ${provider.name} (attempt ${retry + 1}/${this.maxRetries})`);
                    
                    const client = new TonClient4({
                        endpoint: provider.endpoint
                    });

                    const result = await operation(client);
                    
                    if (providerIndex !== this.currentProviderIndex) {
                        console.log(`Switched to ${provider.name} as primary provider`);
                        this.currentProviderIndex = providerIndex;
                    }
                    
                    return result;
                } catch (error) {
                    lastError = error as Error;
                    console.warn(`${operationName} failed with ${provider.name} (attempt ${retry + 1}): ${lastError.message}`);
                    
                    if (retry < this.maxRetries - 1) {
                        await this.delay(this.retryDelay * (retry + 1)); // Exponential backoff
                    }
                }
            }
            
            console.error(`All retries failed for ${provider.name}, trying next provider...`);
        }

        throw new Error(`All providers failed for ${operationName}. Last error: ${lastError?.message}`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getCurrentProvider(): TONProvider {
        return this.providers[this.currentProviderIndex];
    }

    getAllProviders(): TONProvider[] {
        return [...this.providers];
    }

    setApiKey(providerName: string, apiKey: string) {
        const provider = this.providers.find(p => p.name === providerName);
        if (provider) {
            provider.apiKey = apiKey;
        }
    }
}

// Enhanced utility functions with fallback support
export class EnhancedAPIUtils {
    private providerManager: TONProviderManager;

    constructor(isTestnet: boolean = false) {
        this.providerManager = new TONProviderManager(isTestnet);
    }

    async getLastBlock(): Promise<number> {
        return this.providerManager.executeWithFallback(
            async (client) => {
                const result = await client.getLastBlock();
                return result.last.seqno;
            },
            'getLastBlock'
        );
    }

    async getAccountLite(seqno: number, address: Address) {
        return this.providerManager.executeWithFallback(
            async (client) => {
                return await client.getAccountLite(seqno, address);
            },
            'getAccountLite'
        );
    }

    async getAccount(seqno: number, address: Address) {
        return this.providerManager.executeWithFallback(
            async (client) => {
                return await client.getAccount(seqno, address);
            },
            'getAccount'
        );
    }

    async waitForTransaction(
        address: Address, 
        currentLt: string | null, 
        maxRetry: number = 10, 
        interval: number = 1000
    ): Promise<boolean> {
        let done = false;
        let count = 0;

        do {
            try {
                const lastBlock = await this.getLastBlock();
                console.log(`Awaiting transaction completion (${++count}/${maxRetry})`);
                await this.delay(interval);
                
                const curState = await this.getAccountLite(lastBlock, address);
                if (curState.account.last !== null) {
                    done = curState.account.last.lt !== currentLt;
                }
            } catch (error) {
                console.warn(`Error while waiting for transaction: ${error}`);
                if (count >= maxRetry) {
                    throw error;
                }
            }
        } while (!done && count < maxRetry);

        return done;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getProviderManager(): TONProviderManager {
        return this.providerManager;
    }
}