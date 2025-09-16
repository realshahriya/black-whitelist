// Manual deployment workaround for Blueprint CLI issues
const { NetworkProvider } = require('@ton/blueprint');
const path = require('path');

console.log('\n=== Manual Deployment Workaround ===');
console.log('This script bypasses Blueprint CLI script detection issues.\n');

console.log('Available deployment scripts:');
console.log('1. deployJettonMinterDiscoverable.ts - Deploy the main jetton minter contract');
console.log('2. deployJettonWallet.ts - Deploy jetton wallet contracts');
console.log('3. bwController.ts - Blacklist/Whitelist management interface\n');

console.log('To run a specific script manually:');
console.log('1. Set up your .env file with network configuration');
console.log('2. Use: npx ts-node -r dotenv/config scripts/[script-name].ts');
console.log('3. Or modify this file to import and run the specific deployment function\n');

console.log('Note: The Blueprint CLI has a known issue with script detection.');
console.log('This workaround allows you to deploy contracts without the CLI.');

// Example of how to run a deployment manually:
// const { run } = require('./scripts/deployJettonMinterDiscoverable.ts');
// run(provider).catch(console.error);