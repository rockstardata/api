const { execSync } = require('child_process');

function runScript(script) {
  try {
    console.log(`\n==============================\nEjecutando: ${script}\n==============================`);
    execSync(`node scripts/${script}`, { stdio: 'inherit' });
    console.log(`\n✅ ${script} ejecutado correctamente.`);
  } catch (error) {
    console.error(`\n❌ Error ejecutando ${script}:`, error.message);
    process.exit(1);
  }
}

const scripts = [
  'sync-organization.js',
  'sync-companies.js',
  'sync-venue.js',
  'sync-business.js',
  'sync-sales.js',
];

for (const script of scripts) {
  runScript(script);
}

console.log('\n🎉 Sincronización completa en orden (organization -> companies -> venue -> business -> sales)'); 