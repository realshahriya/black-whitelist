const { NetworkProvider } = require('@ton/blueprint');
const { run } = require('./scripts/deployJettonMinterDiscoverable.ts');

async function main() {
    console.log('Starting deployment test...');
    // This is a workaround for Blueprint script detection issues
    console.log('Please use: npx blueprint run deployJettonMinterDiscoverable');
    console.log('Or manually run the deployment script with proper NetworkProvider setup');
}

main().catch(console.error);