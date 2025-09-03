// Teste específico para validar se o Sol está na Casa 12
// Data: 10/04/1989 às 06:59 (Rio de Janeiro)

const axios = require('axios');

async function testCasa12() {
  try {
    console.log('🔍 TESTE ESPECÍFICO: Sol na Casa 12');
    console.log('📅 Data: 10/04/1989 às 06:59 (Rio de Janeiro)');
    console.log('🌍 Coordenadas: -22.9068, -43.1729');
    console.log('🎯 Expectativa: Sol na Casa 12\n');

    const requestData = {
      // Dados natais EXATOS do usuário
      natalISO: '1989-04-10T09:59:00.000Z', // UTC (06:59 Rio + 3h = 09:59 UTC)
      natalLocal: '1989-04-10T06:59:00-03:00', // Horário local do Rio
      natalTimezone: 'America/Sao_Paulo',
      natalOffsetMinutes: -180, // UTC-3
      natalLat: -22.9068,
      natalLon: -43.1729,
      
      // Dados atuais (para comparação)
      datetimeISO: new Date().toISOString(),
      lat: -22.9068,
      lon: -43.1729,
      timezone: 'America/Sao_Paulo',
      offsetMinutes: -180,
      
      // Parâmetros importantes
      includeHouses: true,
      system: 'placidus',
      bodies: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'],
      debug: true
    };

    console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post('http://localhost:3000/api/astro/positions', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      timeout: 30000
    });

    const data = response.data;
    
    console.log('\n✅ RESPOSTA RECEBIDA:');
    console.log('📊 Versão do Engine:', data.version);
    console.log('🔧 Engines Utilizados:', data.meta?.engines);
    
    // Verificar dados natais
    if (data.natal) {
      console.log('\n🎂 DADOS NATAIS ENCONTRADOS:');
      console.log('🏠 Casas Natais:', data.natal.houses ? 'SIM' : 'NÃO');
      
      if (data.natal.houses) {
        console.log('🏠 Sistema de Casas:', data.natal.houses.system);
        console.log('🌅 Ascendente Natal:', data.natal.houses.ascendant?.toFixed(2) + '°');
        console.log('🏔️ Meio do Céu Natal:', data.natal.houses.midheaven?.toFixed(2) + '°');
      }
      
      // Encontrar o Sol natal
      const solNatal = data.natal.positions?.find(p => p.body === 'Sun');
      if (solNatal) {
        console.log('\n☀️ SOL NATAL:');
        console.log('📍 Longitude:', solNatal.lon?.toFixed(2) + '°');
        console.log('🌟 Signo:', solNatal.sign);
        console.log('🏠 Casa:', solNatal.house);
        console.log('🎯 Expectativa: Casa 12');
        
        if (solNatal.house === 12) {
          console.log('✅ ✅ ✅ SUCESSO! Sol está na Casa 12 como esperado!');
        } else {
          console.log('❌ ❌ ❌ PROBLEMA! Sol está na Casa', solNatal.house, 'mas deveria estar na Casa 12');
          
          // Debugging adicional
          console.log('\n🔍 DEBUG DETALHADO:');
          if (data.natal.houses) {
            console.log('Cúspides das Casas:');
            data.natal.houses.cusps?.forEach((cusp, i) => {
              console.log(`Casa ${i + 1}: ${cusp.toFixed(2)}°`);
            });
          }
        }
      } else {
        console.log('❌ Sol natal não encontrado!');
      }
    } else {
      console.log('❌ DADOS NATAIS NÃO ENCONTRADOS!');
      console.log('🔍 Response keys:', Object.keys(data));
    }
    
    // Verificar status planetários
    if (data.planetaryStatuses) {
      console.log('\n🌟 STATUS PLANETÁRIOS:');
      data.planetaryStatuses.forEach(status => {
        if (status.planet === 'Sun') {
          console.log(`☀️ ${status.interpretation}`);
          console.log(`📊 Score: ${status.score}`);
          console.log(`📈 Breakdown:`, status.breakdown);
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    
    if (error.response) {
      console.log('📄 Status:', error.response.status);
      console.log('📄 Headers:', error.response.headers);
    }
  }
}

testCasa12();
