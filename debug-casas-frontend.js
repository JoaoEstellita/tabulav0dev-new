// Debug da lógica de casas do frontend

function ccwDelta(from, to) {
  const norm = (d) => (d % 360 + 360) % 360
  const a = norm(from), b = norm(to)
  return a <= b ? (b - a) : (b + 360 - a)
}

// Dados do teste
const asc = 166.80
const sol = 20.39
const cusps = [166.80, 258.41, 350.01, 81.61, 170.01, 258.41, 346.80, 78.41, 170.01, 261.61, 350.01, 78.41]

console.log('🔍 DEBUG DA LÓGICA DE CASAS DO FRONTEND')
console.log(`ASC: ${asc}°`)
console.log(`Sol: ${sol}°`)
console.log('')

// Calcular edges como no frontend
const edges = new Array(13)
edges[0] = 0
for (let i = 1; i < 12; i++) {
  const prev = (i === 1) ? asc : cusps[i - 1]
  const curr = cusps[i]
  edges[i] = edges[i - 1] + ccwDelta(prev, curr)
}
edges[12] = edges[11] + ccwDelta(cusps[11], asc)

console.log('📐 EDGES (distâncias acumuladas):')
for (let i = 0; i < 13; i++) {
  console.log(`Edge ${i}: ${edges[i].toFixed(2)}°`)
}

// Testar onde o Sol fica
const Lrel = ccwDelta(asc, sol)
console.log(`\n🌞 Sol relativo ao ASC: ${Lrel.toFixed(2)}°`)

const eps = 0.2
for (let i = 0; i < 12; i++) {
  const a = edges[i]
  const b = edges[i + 1]
  console.log(`Casa ${i + 1}: ${a.toFixed(2)}° - ${b.toFixed(2)}° | Sol: ${Lrel >= a && Lrel < b ? '✅' : '❌'}`)
  
  if (Lrel >= a && Lrel < b) {
    if ((b - Lrel) <= eps) {
      const nextHouse = ((i + 1) % 12) + 1
      console.log(`  🎯 Sol está na Casa ${nextHouse} (epsilon adjustment)`)
    } else {
      console.log(`  🎯 Sol está na Casa ${i + 1}`)
    }
    break
  }
}
