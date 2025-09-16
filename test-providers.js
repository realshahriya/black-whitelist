const { TonClient4 } = require('@ton/ton');
const { Address } = require('@ton/core');

// Simple test of the provider fallback logic
async function testProviders() {
    console.log('🧪 Testing TON API Providers...\n');

    // Test providers (similar to what we implemented)
    const providers = [
        {
            name: 'Orbs Network (Primary)',
            endpoint: 'https://ton.access.orbs.network/mainnet/ton-api-v4',
            priority: 1
        },
        {
            name: 'TonCenter Mainnet (Fallback)',
            endpoint: 'https://toncenter.com/api/v3',
            priority: 2
        }
    ];

    console.log('Available providers:');
    providers.forEach((p, index) => {
        console.log(`  ${index + 1}. ${p.name} - ${p.endpoint} (Priority: ${p.priority})`);
    });
    console.log('');

    // Test each provider
    for (const provider of providers) {
        console.log(`Testing ${provider.name}...`);
        
        try {
            const client = new TonClient4({
                endpoint: provider.endpoint
            });
            
            // Try to get the last block
            const block = await client.getLastBlock();
            console.log(`✅ ${provider.name}: Success! Block ${block.last.seqno}`);
            
            // If this is the primary provider that was failing, test the specific scenario
            if (provider.name.includes('Orbs')) {
                try {
                    const testAddress = Address.parse("EQApT0V-qcfa3MOFKSyZ4M4NeUgZRriWqbWG9bAYp1a4cYCf");
                    const account = await client.getAccount(block.last.seqno, testAddress);
                    console.log(`✅ ${provider.name}: Account lookup successful - ${account.account.state.type}`);
                } catch (accountError) {
                    console.log(`⚠️  ${provider.name}: Block works but account lookup failed - ${accountError.message}`);
                    console.log('   This might be the 500 error you encountered!');
                }
            }
            
        } catch (error) {
            console.log(`❌ ${provider.name}: Failed - ${error.message}`);
            if (error.message.includes('500')) {
                console.log('   ^ This is the 500 Internal Server Error you reported!');
            }
        }
        console.log('');
    }

    console.log('=== Test Summary ===');
    console.log('✅ Green checkmarks = Provider is working');
    console.log('❌ Red X marks = Provider has issues');
    console.log('⚠️  Yellow warnings = Partial functionality');
    console.log('');
    console.log('💡 Solution implemented:');
    console.log('   - Enhanced provider wrapper with automatic fallback');
    console.log('   - Retry logic for transient errors');
    console.log('   - Multiple TON API providers configured');
    console.log('   - Updated ui-utils.ts with fallback support');
    console.log('');
    console.log('🚀 To use in your code:');
    console.log('   import { createEnhancedProvider } from "./wrappers/enhanced-provider";');
    console.log('   const enhanced = createEnhancedProvider(provider);');
    console.log('   await enhanced.getLastBlock(); // Automatically handles fallbacks!');
}

// Run the test
testProviders().catch(console.error);