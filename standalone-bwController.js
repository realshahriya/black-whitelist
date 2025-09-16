const { execSync } = require('child_process');
const readline = require('readline');

console.log('🚀 Jetton Black & White List Controller - Fixed Version\n');

// Known working testnet minter addresses
const TESTNET_MINTERS = [
    'kQD0gWK8Ja8qLZ8_jmhYjeDpKZ5mcDKRoqPl7dXB_ELvUgOr',
    'kQBqSpvo4S87mX9tjHaG4zhYZeORhVhMapBJpnMZ64jhrP-A'
];

console.log('⚠️  CRITICAL: You MUST use EXACTLY one of these addresses:');
console.log('');
TESTNET_MINTERS.forEach((addr, i) => {
    console.log(`   ${i + 1}. ${addr}`);
});
console.log('');
console.log('❌ DO NOT use any other address!');
console.log('❌ DO NOT use your wallet address!');
console.log('❌ DO NOT make up or modify these addresses!');
console.log('');
console.log('✅ Copy and paste EXACTLY one of the addresses above when prompted.');
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📋 Step-by-step instructions:');
console.log('1. Type "y" below to start');
console.log('2. Select TESTNET when asked for network');
console.log('3. Connect your wallet');
console.log('4. COPY-PASTE one of the addresses shown above (do NOT type manually)');
console.log('');

rl.question('Ready to run with EXACT addresses above? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting bwController...');
    console.log('🔥 REMEMBER: Copy-paste one of these EXACT addresses:');
    TESTNET_MINTERS.forEach((addr, i) => {
        console.log(`   ${i + 1}. ${addr}`);
    });
    console.log('');
    try {
      execSync('npx blueprint run bwController', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n❌ Error occurred. Common mistakes:');
      console.log('1. Used wrong minter address (must be EXACTLY from the list above)');
      console.log('2. Typed address manually instead of copy-pasting');
      console.log('3. Selected mainnet instead of testnet');
      console.log('');
      console.log('🔄 Try again and copy-paste the EXACT address!');
    }
  } else {
    console.log('\n📝 Remember:');
    console.log('- Use TESTNET network');
    console.log('- Copy-paste EXACTLY one of the minter addresses shown above');
    console.log('- Do NOT use your wallet address or any other address');
    console.log('\nRun this script again when ready!');
  }
  rl.close();
});