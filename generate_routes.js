const fs = require('fs');
const path = require('path');

const pagesDir = './client/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

// Generate import statements
const imports = files.map(file => {
  const name = file.replace('.tsx', '');
  return `const ${name} = lazy(() => import('./pages/${name}'));`;
}).join('\n');

// Generate routes
const routes = files.map(file => {
  const name = file.replace('.tsx', '');
  const path = '/' + name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  return `<Route path="${path}" component={${name}} />`;
}).join('\n  ');

console.log(`Generated ${files.length} imports and routes`);
console.log('First 5 imports:');
console.log(imports.split('\n').slice(0, 5).join('\n'));
console.log('\nFirst 5 routes:');
console.log(routes.split('\n').slice(0, 5).join('\n'));

// Save to file
fs.writeFileSync('./routes-config.txt', `${files.length} pages\n\nIMPORTS:\n${imports}\n\nROUTES:\n${routes}`);
console.log('\nSaved to routes-config.txt');
