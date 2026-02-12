const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'screens');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const files = walk(root);
const offenders = [];

for (const file of files) {
  const rel = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
  const source = fs.readFileSync(file, 'utf8');
  const hasI18nHook = /useAppLanguage\s*\(/.test(source);
  if (hasI18nHook) continue;

  const hasLikelyUiText =
    /Alert\.alert\(\s*['"][^'"]*[A-Za-z][^'"]*['"]/.test(source) ||
    /placeholder\s*=\s*['"][^'"]*[A-Za-z][^'"]*['"]/.test(source) ||
    />\s*[^<{\n]*[A-Za-z][^<{\n]*\s*</.test(source);

  if (hasLikelyUiText) offenders.push(rel);
}

if (offenders.length) {
  console.log('Files without useAppLanguage and with likely hardcoded UI text:');
  offenders.forEach((f) => console.log(`- ${f}`));
  process.exitCode = 1;
} else {
  console.log('OK: no obvious hardcoded UI text in files without useAppLanguage.');
}
