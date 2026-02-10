const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'src', 'screens', 'forecast', 'ForecastScreen.tsx')
const content = fs.readFileSync(file, 'utf8')

const forbiddenTokens = [
  'setShowAllDayEvents(',
  'setLastStatusUpdatedAt(',
]

const found = forbiddenTokens.filter((token) => content.includes(token))

if (found.length) {
  console.error('[guard:forecast] Forbidden orphan setters found:')
  found.forEach((token) => console.error(` - ${token}`))
  process.exit(1)
}

console.log('[guard:forecast] OK')
