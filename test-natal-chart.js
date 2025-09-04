/**
 * 🧪 TESTE ESPECÍFICO PARA VALIDAR MAPA NATAL REAL
 */

async function testNatalChart() {
  const url = 'https://tabulav0dev-backend.vercel.app/api/astro/positions';
  
  try {
    console.log('🧪 TESTANDO MAPA NATAL REAL COM DADOS EXATOS');
    
    const natalData = {
      // Dados natais reais
      datetimeISO: "1989-04-10T06:59:00",
      lat: -22.9068,
      lon: -43.1729,
      timezone: "America/Sao_Paulo",
      includeHouses: true,
      // Dados atuais para comparação
      natalISO: "1989-04-10T06:59:00", 
      natalLat: -22.9068,
      natalLon: -43.1729,
      natalTimezone: "America/Sao_Paulo"
    };
    
    console.log('📤 Enviando dados natais:', natalData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(natalData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📥 Resposta recebida');
    console.log('🔍 Estrutura completa da resposta:', JSON.stringify(data, null, 2));
    
    // Validar casas natais
    if (data.natal && data.natal.houses) {
      const natalHouses = data.natal.houses;
      const natalPlanets = data.natal.positions; // Corrigido: usar positions ao invés de planets
      
      console.log('\n🏠 CASAS NATAIS:');
      console.log(`   Sistema: ${natalHouses.system} → ${natalHouses.systemEffective}`);
      console.log(`   ASC: ${natalHouses.ascendant.toFixed(2)}°`);
      console.log(`   MC: ${natalHouses.midheaven.toFixed(2)}°`);
      
      console.log('\n📍 CÚSPIDES NATAIS:');
      natalHouses.cusps.forEach((cusp, i) => {
        console.log(`   Casa ${i + 1}: ${cusp.toFixed(2)}°`);
      });
      
      console.log('\n🪐 PLANETAS NAS CASAS NATAIS:');
      natalPlanets.forEach(planet => {
        console.log(`   ${planet.body}: ${planet.lon.toFixed(2)}° → Casa ${planet.house}`);
      });
      
      // Validar se corresponde ao mapa real
      const expectedPlanetHouses = {
        'Sun': 12,    // Sol Áries 20°30' → Casa 12
        'Moon': 2,    // Lua Gêmeos 19°11' → Casa 2  
        'Mercury': 12, // Mercúrio Áries 26°55' → Casa 12
        'Venus': 12,  // Vênus Áries 21°54' → Casa 12
        'Mars': 2,    // Marte Gêmeos 18°24' → Casa 2
        'Jupiter': 2, // Júpiter Gêmeos 5°15' → Casa 2
        'Saturn': 9,  // Saturno Capricórnio 13°47' → Casa 9
        'Uranus': 9,  // Urano Capricórnio 5°20' → Casa 9
        'Neptune': 9, // Netuno Capricórnio 12°22' → Casa 9
        'Pluto': 7    // Plutão Escorpião 14°26' → Casa 7
      };
      
      console.log('\n✅ VALIDAÇÃO MAPA NATAL:');
      let correctCount = 0;
      let totalCount = 0;
      
      natalPlanets.forEach(planet => {
        const expected = expectedPlanetHouses[planet.body];
        const actual = planet.house;
        const isCorrect = expected === actual;
        
        console.log(`   ${planet.body}: Casa ${actual} ${isCorrect ? '✅' : '❌'} (esperado: Casa ${expected})`);
        
        if (isCorrect) correctCount++;
        totalCount++;
      });
      
      const accuracy = (correctCount / totalCount * 100).toFixed(1);
      console.log(`\n📊 PRECISÃO: ${correctCount}/${totalCount} (${accuracy}%)`);
      
      if (accuracy === '100.0') {
        console.log('🎉 MAPA NATAL PERFEITO! Todas as casas correspondem aos dados reais!');
      } else {
        console.log('⚠️ Ajustes necessários nas cúspides natais');
      }
      
    } else {
      console.log('❌ Dados natais não encontrados na resposta');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

testNatalChart();
