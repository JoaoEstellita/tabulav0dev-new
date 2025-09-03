const fetch = require('node-fetch')

// Teste específico para debug do ASC/MC
const testData = {
  natalISO: "1989-04-10T06:59:00.000Z",
  natalLocal: "1989-04-10T06:59:00-03:00", 
  natalTimezone: "America/Sao_Paulo",
  natalOffsetMinutes: -180,
  natalLat: -22.9068,
  natalLon: -43.1729,
  datetimeISO: new Date().toISOString(),
  lat: -22.9068,
  lon: -43.1729,
  timezone: "America/Sao_Paulo",
  offsetMinutes: -180,
  includeHouses: true,
  system: "placidus",
  bodies: ["Sun"],
  debug: true
}

async function testDebugAsc() {
  console.log('🔍 TESTE DEBUG ASC/MC\n')
  
  try {
    const response = await fetch('http://localhost:3001/api/astro/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const data = await response.json()
    
    console.log('📊 RESPOSTA COMPLETA:')
    console.log(JSON.stringify(data, null, 2))
    
    if (data.natal?.houses) {
      console.log('\n🏠 CASAS NATAIS:')
      console.log(`ASC: ${data.natal.houses.ascendant}°`)
      console.log(`MC: ${data.natal.houses.midheaven}°`)
      console.log(`Cúspides: ${data.natal.houses.cusps}`)
    } else {
      console.log('\n❌ CASAS NATAIS NÃO ENCONTRADAS')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testDebugAsc()
