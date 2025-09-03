// Debug da atribuição de casas
const sol = 20.52
const asc = 43.54
const cusps = [43.54, 133.39, 223.23, 313.07, 43.23, 133.39, 223.54, 313.39, 43.23, 133.07, 223.23, 313.39]

console.log('🔍 DEBUG: POR QUE SOL NÃO ESTÁ NA CASA 12?')
console.log('')
console.log(`Sol: ${sol}°`)
console.log(`ASC: ${asc}°`)
console.log('')

// Lógica atual de casas (CCW do ASC)
function ccwDelta(from, to) {
  const norm = (d) => (d % 360 + 360) % 360
  const a = norm(from), b = norm(to)
  return a <= b ? (b - a) : (b + 360 - a)
}

const solRelativo = ccwDelta(asc, sol)
console.log(`Sol relativo ao ASC (CCW): ${solRelativo.toFixed(2)}°`)
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

console.log('📐 Intervalos das casas (CCW do ASC):')
for (let i = 0; i < 12; i++) {
  const start = edges[i]
  const end = edges[i + 1]
  const isInside = solRelativo >= start && solRelativo < end
  console.log(`Casa ${i + 1}: ${start.toFixed(2)}° - ${end.toFixed(2)}° ${isInside ? '✅ SOL AQUI' : ''}`)
}

console.log('')
console.log('🎯 ANÁLISE:')
console.log(`Sol está a ${solRelativo.toFixed(2)}° do ASC no sentido CCW`)

// Para Sol estar na Casa 12, deve estar entre edges[11] e edges[12]
const casa12Start = edges[11]
const casa12End = edges[12]
console.log(`Casa 12 vai de ${casa12Start.toFixed(2)}° a ${casa12End.toFixed(2)}°`)

if (solRelativo >= casa12Start && solRelativo < casa12End) {
  console.log('✅ Sol DEVERIA estar na Casa 12')
} else {
  console.log(`❌ Sol está fora da Casa 12`)
  console.log(`Diferença: ${Math.min(Math.abs(solRelativo - casa12Start), Math.abs(solRelativo - casa12End)).toFixed(2)}°`)
}

// Para forçar Sol na Casa 12, qual ASC precisamos?
console.log('')
console.log('🧮 CALCULANDO ASC CORRETO PARA SOL NA CASA 12:')

// Se queremos Sol na Casa 12, e Casa 12 vai de ~330° a 0° (30° antes do ASC)
// Então ASC deve estar 30° após o Sol
const ascCorreto = (sol + 30) % 360
console.log(`ASC correto seria: ${ascCorreto.toFixed(2)}°`)

// Qual LST daria esse ASC?
console.log('Para calcular qual LST dar esse ASC, seria necessário resolver a equação do ASC')
