// For testnet, we can use a known deployed minter address
const KNOWN_TESTNET_MINTERS = [
    'kQD0gWK8Ja8qLZ8_jmhYjeDpKZ5mcDKRoqPl7dXB_ELvUgOr', // Example testnet minter
    'kQBqSpvo4S87mX9tjHaG4zhYZeORhVhMapBJpnMZ64jhrP-A', // Another example
];

console.log('🎯 Jetton Minter Helper');
console.log('');
console.log('For testing the bwController, you can use one of these known testnet minter addresses:');
console.log('');
KNOWN_TESTNET_MINTERS.forEach((addr, i) => {
    console.log(`${i + 1}. ${addr}`);
});
console.log('');
console.log('⚠️  Note: These are example addresses. For production, deploy your own minter.');
console.log('');
console.log('To deploy your own minter:');
console.log('1. Run: npx blueprint run deployJettonMinterDiscoverable');
console.log('2. Follow the prompts to connect your wallet');
console.log('3. Use the deployed address in bwController');