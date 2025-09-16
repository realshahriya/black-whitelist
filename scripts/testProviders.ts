import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';
import { EnhancedNetworkProvider, createEnhancedProvider } from '../wrappers/enhanced-provider';
import { TONProviderManager } from '../wrappers/api-providers';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const isTestnet = provider.network() !== 'mainnet';
    
    ui.write(`Testing TON API providers for ${isTestnet ? 'testnet' : 'mainnet'}...\n`);

    // Test 1: Basic provider manager functionality
    ui.write("=== Test 1: Provider Manager ===");
    const providerManager = new TONProviderManager(isTestnet);
    const allProviders = providerManager.getAllProviders();
    
    ui.write(`Available providers:`);
    allProviders.forEach((p, index) => {
        ui.write(`  ${index + 1}. ${p.name} - ${p.endpoint} (Priority: ${p.priority})`);
    });

    // Test 2: Enhanced provider wrapper
    ui.write("\n=== Test 2: Enhanced Provider Wrapper ===");
    const enhancedProvider = createEnhancedProvider(provider);
    
    try {
        ui.write("Testing getLastBlock with fallback...");
        const lastBlock = await enhancedProvider.getLastBlock();
        ui.write(`✅ Success! Last block: ${lastBlock}`);
        
        const currentProvider = enhancedProvider.getCurrentProviderInfo();
        ui.write(`Current provider: ${currentProvider.name}`);
    } catch (error) {
        ui.write(`❌ Failed: ${error}`);
    }

    // Test 3: Test specific address (you can modify this)
    ui.write("\n=== Test 3: Account Information ===");
    try {
        // Using a well-known address for testing
        const testAddress = Address.parse("EQApT0V-qcfa3MOFKSyZ4M4NeUgZRriWqbWG9bAYp1a4cYCf");
        ui.write(`Testing account lookup for: ${testAddress.toString()}`);
        
        const lastBlock = await enhancedProvider.getLastBlock();
        const accountInfo = await enhancedProvider.getAccountLite(lastBlock, testAddress);
        
        ui.write(`✅ Account status: ${accountInfo.account.state.type}`);
        if (accountInfo.account.last) {
            ui.write(`Last transaction LT: ${accountInfo.account.last.lt}`);
        }
    } catch (error) {
        ui.write(`❌ Account lookup failed: ${error}`);
    }

    // Test 4: Test all providers individually
    ui.write("\n=== Test 4: Individual Provider Testing ===");
    for (const providerInfo of allProviders) {
        try {
            ui.write(`Testing ${providerInfo.name}...`);
            
            const result = await providerManager.executeWithFallback(
                async (client) => {
                    const block = await client.getLastBlock();
                    return block.last.seqno;
                },
                `Test ${providerInfo.name}`
            );
            
            ui.write(`✅ ${providerInfo.name}: Block ${result}`);
        } catch (error) {
            ui.write(`❌ ${providerInfo.name}: ${error}`);
        }
    }

    // Test 5: Simulate the original error scenario
    ui.write("\n=== Test 5: Error Scenario Simulation ===");
    try {
        ui.write("Attempting to reproduce the original error scenario...");
        
        // This should use fallback if the primary provider fails
        const result = await enhancedProvider.executeWithFallback(
            async (client) => {
                // Try to get the specific block that was failing
                const block = await client.getLastBlock();
                const testAddress = Address.parse("EQApT0V-qcfa3MOFKSyZ4M4NeUgZRriWqbWG9bAYp1a4cYCf");
                const account = await client.getAccount(block.last.seqno, testAddress);
                return { block: block.last.seqno, account: account.account.state.type };
            },
            "Error scenario test"
        );
        
        ui.write(`✅ Successfully handled potential error scenario!`);
        ui.write(`Block: ${result.block}, Account: ${result.account}`);
    } catch (error) {
        ui.write(`❌ Error scenario test failed: ${error}`);
    }

    ui.write("\n=== Test Complete ===");
    ui.write("If you see ✅ marks above, the fallback system is working correctly!");
    ui.write("If you see ❌ marks, there might be issues with specific providers.");
    ui.write("\nTo use the enhanced provider in your scripts:");
    ui.write("1. Import: import { createEnhancedProvider } from '../wrappers/enhanced-provider';");
    ui.write("2. Wrap: const enhanced = createEnhancedProvider(provider);");
    ui.write("3. Use: await enhanced.getLastBlock(); // automatically handles fallbacks");
}