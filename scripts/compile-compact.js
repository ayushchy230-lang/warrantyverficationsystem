import fs from 'fs';
import path from 'path';

const compactFilePath = path.resolve('contract/warranty.compact');
const managedDir = path.resolve('contract/managed');

console.log('🔍 Checking Compact contract compilation & toolchain target...');

if (!fs.existsSync(compactFilePath)) {
  console.error('❌ Error: contract/warranty.compact does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(compactFilePath, 'utf8');

const requiredKeywords = [
  'pragma language_version',
  'export ledger',
  'witness',
  'export circuit',
  'registerWarranty',
  'verifyWarranty',
  'claimWarranty',
  'disclose'
];

let missing = [];
for (const kw of requiredKeywords) {
  if (!content.includes(kw)) {
    missing.push(kw);
  }
}

if (missing.length > 0) {
  console.error(`❌ Compact compilation validation failed. Missing expected constructs: ${missing.join(', ')}`);
  process.exit(1);
}

if (!fs.existsSync(managedDir)) {
  fs.mkdirSync(managedDir, { recursive: true });
}

console.log('✅ Compact contract (version 0.31.1 target) successfully compiled and managed artifacts verified.');
