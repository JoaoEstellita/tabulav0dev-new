// Script para testar e corrigir o problema das casas natais com dados reais
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testNatalHousesReal() {
  console.log('🔍 Testando cálculo de casas natais com dados reais...')
  
  // Dados reais do usuário (do Firebase)
  const realData = {
    birthDate: '1989-04-10',
    birthTime: '06:59',
    latitude: -22.9068,
    longitude: -43.1729,
    currentDate: '2025-09-03T18:30:00Z'
  }
  
  console.log('📅 Dados reais do usuário:', realData)
  
  // Teste 1: Cálculo natal com timezone correto
  console.log('\n🔬 Teste 1: Cálculo natal com timezone America/Sao_Paulo')
  try {
    const natalLocal = `${realData.birthDate}T${realData.birthTime}:00`
    const requestBody = {
      datetimeISO: realData.currentDate,
      lat: realData.latitude,
      lon: realData.longitude,
      includeHouses: true,
      natalLocal: natalLocal,
      natalTimezone: 'America/Sao_Paulo',
      natalLat: realData.latitude,
      natalLon: realData.longitude,
      debug: true // Forçar bypass do cache
    }
    
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))
    
    const response1 = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, requestBody)
    
    console.log('✅ Resposta completa:', JSON.stringify(response1.data, null, 2))
    
    if (response1.data.natal && response1.data.natal.houses) {
      console.log('\n🏠 Casas Natais Calculadas:')
      console.log('Ascendente:', response1.data.natal.houses.ascendant?.toFixed(2))
      console.log('Meio do Céu:', response1.data.natal.houses.midheaven?.toFixed(2))
      console.log('Cúspides:', response1.data.natal.houses.cusps?.map((c, i) => ({ casa: i+1, cusp: c.toFixed(2) })))
      
      if (response1.data.natal.positions) {
        console.log('\n🌞 Posições Natais dos Planetas:')
        response1.data.natal.positions.forEach(p => {
          console.log(`${p.body}: ${p.lon.toFixed(2)}° em ${p.sign} - Casa ${p.house}`)
        })
      }
    } else {
      console.log('❌ Casas natais não foram calculadas!')
      console.log('natal.houses:', response1.data.natal?.houses)
    }
  } catch (error) {
    console.error('❌ Erro no teste 1:', error.response?.data || error.message)
  }
  
  // Teste 2: Verificação de timezone histórico
  console.log('\n🔬 Teste 2: Verificação de timezone histórico')
  try {
    const timestamp = Math.floor(new Date(`${realData.birthDate}T12:00:00Z`).getTime() / 1000)
    const response2 = await axios.get(`${BACKEND_URL}/api/timezone?lat=${realData.latitude}&lon=${realData.longitude}&ts=${timestamp}`)
    
    console.log('✅ Dados de timezone histórico:', response2.data)
  } catch (error) {
    console.error('❌ Erro no teste 2:', error.response?.data || error.message)
  }
  
  // Teste 3: Cálculo manual para verificação
  console.log('\n🔬 Teste 3: Verificação manual dos dados')
  console.log('Data de nascimento:', realData.birthDate)
  console.log('Horário de nascimento:', realData.birthTime)
  console.log('Timezone esperado:', 'America/Sao_Paulo')
  console.log('Offset esperado:', '-3 horas (horário de Brasília)')
  
  // Converter para UTC
  const birthDate = new Date(`${realData.birthDate}T${realData.birthTime}:00`)
  const utcDate = new Date(birthDate.getTime() - (3 * 60 * 60 * 1000)) // -3 horas
  console.log('Data UTC calculada:', utcDate.toISOString())
}

// Executar testes
testNatalHousesReal().then(() => {
  console.log('\n✅ Testes concluídos!')
}).catch(error => {
  console.error('❌ Erro geral:', error)
})
