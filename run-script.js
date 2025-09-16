const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get all TypeScript files in scripts directory
const scriptsDir = path.join(__dirname, 'scripts');
const scriptFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('.ts'))
  .map(file => path.parse(file).name);

console.log('Available scripts:');
scriptFiles.forEach((script, index) => {
  console.log(`${index + 1}. ${script}`);
});

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Auto-select bwController if available
const bwControllerIndex = scriptFiles.findIndex(script => script === 'bwController');
if (bwControllerIndex !== -1) {
  console.log('\nAuto-selecting bwController script...');
  runScript('bwController');
  rl.close();
} else {
  rl.question('Select a script to run (enter number): ', (answer) => {
    const scriptIndex = parseInt(answer) - 1;
    if (scriptIndex >= 0 && scriptIndex < scriptFiles.length) {
      const scriptName = scriptFiles[scriptIndex];
      runScript(scriptName);
    } else {
      console.log('Invalid selection');
    }
    rl.close();
  });
}

function runScript(scriptName) {
  console.log(`Running ${scriptName}...`);
  
  if (scriptName === 'bwController') {
    console.log('\nNote: bwController requires Blueprint NetworkProvider to function properly.');
    console.log('If Blueprint fails, the script cannot run in standalone mode.\n');
  }
  
  try {
    // Try to run with blueprint first
    try {
      execSync(`npx blueprint run scripts/${scriptName}.ts`, { stdio: 'inherit' });
    } catch (blueprintError) {
      console.log('Blueprint failed.');
      
      if (scriptName === 'bwController') {
        console.log('\nThe bwController script requires Blueprint\'s NetworkProvider.');
        console.log('It cannot run with direct ts-node execution.');
        console.log('\nTo fix this issue:');
        console.log('1. Try: npm install @ton/blueprint@latest --force');
        console.log('2. Check Blueprint documentation for proper setup');
        console.log('3. Ensure your project structure matches Blueprint requirements');
        return;
      }
      
      console.log('Trying direct execution...');
      execSync(`npx ts-node scripts/${scriptName}.ts`, { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(`Error running script: ${error.message}`);
  }
}