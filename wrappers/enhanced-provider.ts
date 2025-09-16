import { NetworkProvider } from '@ton/blueprint';
import { TonClient4 } from '@ton/ton';
import { Address, Contract, OpenedContract } from '@ton/core';
import { EnhancedAPIUtils, TONProviderManager } from './api-providers';

/**
 * Enhanced NetworkProvider wrapper that provides automatic fallback
 * when the primary provider fails with 500 errors or other issues
 */
export class EnhancedNetworkProvider {
    private originalProvider: NetworkProvider;
    private enhancedAPI: EnhancedAPIUtils;
    private providerManager: TONProviderManager;
    private isTestnet: boolean;

    constructor(originalProvider: NetworkProvider) {
        this.originalProvider = originalProvider;
        this.isTestnet = originalProvider.network() !== 'mainnet';
        this.enhancedAPI = new EnhancedAPIUtils(this.isTestnet);
        this.providerManager = this.enhancedAPI.getProviderManager();
    }

    // Delegate all original methods
    network() {
        return this.originalProvider.network();
    }

    sender() {
        return this.originalProvider.sender();
    }

    ui() {
        return this.originalProvider.ui();
    }

    open<T extends Contract>(contract: T): OpenedContract<T> {
        return this.originalProvider.open(contract);
    }

    // Enhanced API methods with fallback
    async api(): Promise<TonClient4> {
        try {
            return this.originalProvider.api() as TonClient4;
        } catch (error) {
            console.warn('Primary API failed, using fallback provider...');
            const currentProvider = this.providerManager.getCurrentProvider();
            return new TonClient4({
                endpoint: currentProvider.endpoint
            });
        }
    }

    async getLastBlock(): Promise<number> {
        return this.enhancedAPI.getLastBlock();
    }

    async getAccountLite(seqno: number, address: Address) {
        return this.enhancedAPI.getAccountLite(seqno, address);
    }

    async getAccount(seqno: number, address: Address) {
        return this.enhancedAPI.getAccount(seqno, address);
    }

    async waitForTransaction(
        address: Address, 
        currentLt: string | null, 
        maxRetry: number = 10, 
        interval: number = 1000
    ): Promise<boolean> {
        return this.enhancedAPI.waitForTransaction(address, currentLt, maxRetry, interval);
    }

    // Provider management methods
    getCurrentProviderInfo() {
        return this.providerManager.getCurrentProvider();
    }

    getAllProviders() {
        return this.providerManager.getAllProviders();
    }

    setApiKey(providerName: string, apiKey: string) {
        this.providerManager.setApiKey(providerName, apiKey);
    }

    // Execute any operation with automatic fallback
    async executeWithFallback<T>(
        operation: (client: TonClient4) => Promise<T>,
        operationName: string = 'API operation'
    ): Promise<T> {
        return this.providerManager.executeWithFallback(operation, operationName);
    }
}

/**
 * Factory function to create an enhanced provider
 */
export function createEnhancedProvider(originalProvider: NetworkProvider): EnhancedNetworkProvider {
    return new EnhancedNetworkProvider(originalProvider);
}

/**
 * Utility function to wrap existing provider usage
 */
export function withFallback<T>(
    provider: NetworkProvider,
    operation: (enhancedProvider: EnhancedNetworkProvider) => Promise<T>
): Promise<T> {
    const enhanced = createEnhancedProvider(provider);
    return operation(enhanced);
}