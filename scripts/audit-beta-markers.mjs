import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const markerNames = [
  ['TO', 'DO'].join(''),
  ['FIX', 'ME'].join(''),
  ['HA', 'CK'].join(''),
  ['X', 'XX'].join(''),
  ['MO', 'CK:'].join(''),
  ['PLACE', 'HOLDER:'].join(''),
];
const markerRe = new RegExp(`\\b(${markerNames.map((name) => name.replace(':', '\\:')).join('|')})\\b`, 'g');
const highRiskRe = /(^|\/)(auth|session|mfa|permission|security|secret|privacy|consent|audit|policy|payment|billing|ledger|accounting|treasury|database|db|migration|storage|workflow|ci)(\/|\.|-|_)/i;
const acceptedRe = /(^|\/)(test|tests|__tests__|fixtures?|examples?|demo|demos)(\/|\.|-|_)/i;
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
  const lines = buffer.toString('utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    markerRe.lastIndex = 0;
    for (const match of line.matchAll(markerRe)) {
      const classification = highRiskRe.test(file)
        ? 'blocker'
        : acceptedRe.test(file)
          ? 'accepted-beta'
          : 'cleanup';
      findings.push({ path: file, line: index + 1, marker: match[1], classification });
    }
  });
}

const counts = { blocker: 0, 'accepted-beta': 0, cleanup: 0 };
for (const finding of findings) {
  counts[finding.classification] += 1;
  console.log(`${finding.classification}\t${finding.marker}\t${finding.path}:${finding.line}`);
}
console.log(`Marker audit summary: blocker=${counts.blocker}, accepted-beta=${counts['accepted-beta']}, cleanup=${counts.cleanup}, total=${findings.length}.`);
console.log('Only explicit debt tags are classified; ordinary UI placeholder/mock terminology is intentionally not treated as debt without an explicit marker tag.');

if (counts.blocker > 0) {
  console.error('High-risk debt markers are release blockers until removed or replaced with a documented, tested implementation path.');
  process.exit(1);
}
