import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const rules = [
  { id: 'pem-private-key', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { id: 'aws-access-key-id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { id: 'slack-token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
];

const skipPrefixes = ['node_modules/', 'dist/', '.git/'];
const skipNames = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']);
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const findings = [];
for (const file of files) {
  if (skipPrefixes.some((prefix) => file.startsWith(prefix)) || skipNames.has(file)) continue;
  let buffer;
  try {
    buffer = readFileSync(file);
  } catch {
    continue;
  }
  if (buffer.includes(0)) continue;
  const text = buffer.toString('utf8');
  for (const rule of rules) {
    if (rule.re.test(text)) findings.push({ rule: rule.id, path: file });
  }
}

if (findings.length) {
  console.error(`Credential-pattern scan found ${findings.length} high-confidence match(es).`);
  for (const finding of findings) console.error(`${finding.rule}\t${finding.path}`);
  console.error('Matched secret text is intentionally not printed. Rotate/revoke any confirmed credential and remove it from tracked content/history as appropriate.');
  process.exit(1);
}

console.log(`Credential-pattern scan passed across ${files.length} tracked paths (current tree only).`);
console.log('Scope excludes Git history, entropy-based discovery, provider-side revocation state, and production secret-management verification.');
