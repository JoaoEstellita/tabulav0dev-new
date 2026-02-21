const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const DOCS_DIR = path.join(ROOT, 'docs');

const FILES = {
  base: path.join(DATA_DIR, 'transitCatalogPtBR.ts'),
  curatedPt: path.join(DATA_DIR, 'transitCatalogOverridesPtBR.ts'),
  curatedI18n: path.join(DATA_DIR, 'transitCatalogOverridesI18n.ts'),
};

const LOCALES = ['en-US', 'es-ES', 'it-IT'];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractAllTransitKeys(text) {
  const out = new Set();
  const rx = /['"`](transit:[^'"`\n]+)['"`]\s*:/g;
  let match;
  while ((match = rx.exec(text))) out.add(match[1]);
  return out;
}

function extractLocaleScopedKeys(text, locale) {
  const localeBlock = text.match(
    new RegExp(`['"]${locale}['"]\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm')
  );
  if (!localeBlock) return new Set();
  return extractAllTransitKeys(localeBlock[1]);
}

function keyPriority(key) {
  const p1Aspect = /\|(conjuncao|oposicao|quadratura|trigono|sextil)\|/.test(key);
  const p1Target = /\|(sun|moon|mercury|venus|mars|jupiter|saturn|ascendente|descendente|meio_do_ceu|fundo_do_ceu)$/.test(key);
  const ingress = /\|ingress\|house_(?:[1-9]|1[0-2])$/.test(key);
  if ((p1Aspect && p1Target) || ingress) return 'p1';
  if (/\|house_(?:[1-9]|1[0-2])$/.test(key)) return 'p2';
  return 'p3';
}

const ASPECT_KEYS = new Set(['conjuncao', 'oposicao', 'quadratura', 'trigono', 'sextil']);
const MAJOR_TARGETS = new Set([
  'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn',
  'uranus', 'neptune', 'pluto', 'ascendente', 'descendente', 'meio_do_ceu', 'fundo_do_ceu',
]);
const HOUSE_TARGET_RX = /^house_([1-9]|1[0-2])$/;

function isAutoP1Key(key) {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z_]+)$/);
  if (!match) return false;
  const aspect = match[2];
  const target = match[3];
  return ASPECT_KEYS.has(aspect) && MAJOR_TARGETS.has(target);
}

function isAutoIngressKey(key) {
  return /^transit:[a-z_]+\|ingress\|house_([1-9]|1[0-2])$/.test(key);
}

function isAutoAspectHouseKey(key) {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z0-9_]+)$/);
  if (!match) return false;
  const aspect = match[2];
  const target = match[3];
  return ASPECT_KEYS.has(aspect) && HOUSE_TARGET_RX.test(target);
}

function isAutoCoveredKey(key) {
  return isAutoP1Key(key) || isAutoIngressKey(key) || isAutoAspectHouseKey(key);
}

function buildCoverage() {
  const baseText = read(FILES.base);
  const curatedPtText = read(FILES.curatedPt);
  const curatedI18nText = read(FILES.curatedI18n);

  const base = extractAllTransitKeys(baseText);
  const curatedPt = extractAllTransitKeys(curatedPtText);
  const localeKeys = Object.fromEntries(
    LOCALES.map((locale) => [locale, extractLocaleScopedKeys(curatedI18nText, locale)])
  );

  const fallbackOnly = [];
  const autoOnly = [];
  const curated = [];

  base.forEach((key) => {
    const inCuratedPt = curatedPt.has(key);
    const inAutoPt = isAutoCoveredKey(key);
    if (inCuratedPt) curated.push(key);
    else if (inAutoPt) autoOnly.push(key);
    else fallbackOnly.push(key);
  });

  const byPriority = {
    p1: fallbackOnly.filter((k) => keyPriority(k) === 'p1'),
    p2: fallbackOnly.filter((k) => keyPriority(k) === 'p2'),
    p3: fallbackOnly.filter((k) => keyPriority(k) === 'p3'),
  };

  const i18nParity = {};
  LOCALES.forEach((locale) => {
    const missing = Array.from(curatedPt).filter((k) => !localeKeys[locale].has(k));
    const extra = Array.from(localeKeys[locale]).filter((k) => !curatedPt.has(k));
    i18nParity[locale] = { missing, extra };
  });

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      base: base.size,
      curatedPt: curated.length,
      autoOnly: autoOnly.length,
      fallbackOnly: fallbackOnly.length,
    },
    fallbackByPriority: {
      p1: byPriority.p1.length,
      p2: byPriority.p2.length,
      p3: byPriority.p3.length,
    },
    topFallbackKeys: [...byPriority.p1, ...byPriority.p2, ...byPriority.p3].slice(0, 120),
    i18nParity,
  };
}

function writeReport(report) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  const jsonPath = path.join(DOCS_DIR, 'transit-catalog-runtime-coverage.json');
  const mdPath = path.join(DOCS_DIR, 'transit-catalog-runtime-coverage.md');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

  const lines = [];
  lines.push('# Transit Catalog Runtime Coverage');
  lines.push('');
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Totals');
  lines.push(`- Base keys: ${report.totals.base}`);
  lines.push(`- Curated pt-BR keys: ${report.totals.curatedPt}`);
  lines.push(`- Auto-only keys: ${report.totals.autoOnly}`);
  lines.push(`- Fallback-only keys: ${report.totals.fallbackOnly}`);
  lines.push('');
  lines.push('## Fallback-only by priority');
  lines.push(`- P1: ${report.fallbackByPriority.p1}`);
  lines.push(`- P2: ${report.fallbackByPriority.p2}`);
  lines.push(`- P3: ${report.fallbackByPriority.p3}`);
  lines.push('');
  lines.push('## i18n parity against curated pt-BR');
  Object.entries(report.i18nParity).forEach(([locale, diff]) => {
    lines.push(`- ${locale}: missing=${diff.missing.length}, extra=${diff.extra.length}`);
  });
  lines.push('');
  lines.push('## Top fallback keys (next curation candidates)');
  report.topFallbackKeys.forEach((key, idx) => {
    lines.push(`${idx + 1}. \`${key}\``);
  });
  lines.push('');

  fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
  return { jsonPath, mdPath };
}

function main() {
  const report = buildCoverage();
  const out = writeReport(report);
  console.log(JSON.stringify({
    generatedAt: report.generatedAt,
    ...report.totals,
    fallbackByPriority: report.fallbackByPriority,
    out,
  }, null, 2));
}

main();
