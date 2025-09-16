import { TonClient4 } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

// Test different TON API providers
const providers = {
    orbs: 'https://ton.access.orbs.network/55033c0ff5Bd3F8B62C092Ab4D238bEE463E5503/1/mainnet/ton-api-v4',
    tonhub: 'https://mainnet-v4.tonhubapi.com',
    getgems: 'https://ton-api-v4.getgems.io',
    whales: 'https://ton.whales-api.com/v4'
};

async function testProvider(name: string, endpoint: string): Promise<{ name: string, working: boolean, error?: string }> {
    try {
        console.log(`Testing ${name} (${endpoint})...`);
        const client = new TonClient4({ endpoint });
        
        // Try to get the latest block
        const block = await client.getLastBlock();
        console.log(`✅ ${name}: Working - Block ${block.last.seqno}`);
        return { name, working: true };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`❌ ${name}: Failed - ${errorMsg}`);
        return { name, working: false, error: errorMsg };
    }
}

export async function run(provider: NetworkProvider) {
    console.log('🔍 Testing TON API Providers...');
    console.log('================================');
    
    const results = [];
    
    for (const [name, endpoint] of Object.entries(providers)) {
        const result = await testProvider(name, endpoint);
        results.push(result);
        console.log(''); // Empty line for readability
    }
    
    console.log('📊 Summary:');
    console.log('===========');
    
    const working = results.filter(r => r.working);
    const failed = results.filter(r => !r.working);
    
    console.log(`✅ Working providers: ${working.length}`);
    working.forEach(r => console.log(`   - ${r.name}`));
    
    console.log(`❌ Failed providers: ${failed.length}`);
    failed.forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    
    if (working.length > 0) {
        console.log(`\n🎯 Recommended alternative: ${working[0].name}`);
        console.log(`   Endpoint: ${providers[working[0].name as keyof typeof providers]}`);
    }
}