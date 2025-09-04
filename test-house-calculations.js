/**
 * 🧪 TESTE COMPLETO DO SISTEMA DE CASAS ASTROLÓGICAS
 * Verifica se o sistema funciona 100% correto em todos os casos
 */

// Cenários de teste para validar o sistema
const testCases = [
  {
    name: "NATAL - Coordenadas Calibradas (Brasil)",
    type: "natal", 
    data: {
      datetimeISO: "1990-06-15T14:30:00",
      lat: -23.5505,
      lon: -46.6333,
      timezone: "America/Sao_Paulo",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Transitos Brasil",
    type: "current",
    data: {
      datetimeISO: new Date().toISOString(),
      lat: -23.5505,
      lon: -46.6333,
      timezone: "America/Sao_Paulo",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Transitos EUA (Costa Leste)", 
    type: "current",
    data: {
      datetimeISO: new Date().toISOString(),
      lat: 40.7128,
      lon: -74.0060,
      timezone: "America/New_York",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Transitos Europa (Londres)",
    type: "current", 
    data: {
      datetimeISO: new Date().toISOString(),
      lat: 51.5074,
      lon: -0.1278,
      timezone: "Europe/London",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Transitos Ásia (Tóquio)",
    type: "current",
    data: {
      datetimeISO: new Date().toISOString(),
      lat: 35.6762,
      lon: 139.6503,
      timezone: "Asia/Tokyo",
      includeHouses: true
    }
  },
  {
    name: "NATAL - Coordenadas Extremas (Polo Norte)", 
    type: "natal",
    data: {
      datetimeISO: "1985-12-25T12:00:00",
      lat: 89.0,
      lon: 0.0,
      timezone: "UTC",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Transitos Coordenadas Extremas (Antártica)",
    type: "current",
    data: {
      datetimeISO: new Date().toISOString(),
      lat: -89.0,
      lon: 0.0, 
      timezone: "UTC",
      includeHouses: true
    }
  },
  {
    name: "NATAL - Meia-noite (caso extremo)",
    type: "natal",
    data: {
      datetimeISO: "1992-01-01T00:00:00",
      lat: -23.5505,
      lon: -46.6333,
      timezone: "America/Sao_Paulo",
      includeHouses: true
    }
  },
  {
    name: "ATUAL - Meio-dia (caso extremo)",
    type: "current", 
    data: {
      datetimeISO: new Date(Date.now()).toISOString().replace(/T.*/, 'T12:00:00'),
      lat: -23.5505,
      lon: -46.6333,
      timezone: "America/Sao_Paulo",
      includeHouses: true
    }
  }
];

async function testBackendEndpoint(testCase) {
  const url = 'https://tabulav0dev-backend.vercel.app/api/astro/positions';
  
  try {
    console.log(`\n🧪 TESTANDO: ${testCase.name}`);
    console.log(`📍 Dados:`, testCase.data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase.data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validar estrutura da resposta
    if (!data.houses || !data.houses.cusps || !Array.isArray(data.houses.cusps)) {
      throw new Error('❌ Estrutura de casas inválida');
    }
    
    const cusps = data.houses.cusps;
    const asc = data.houses.ascendant;
    
    // Validar quantidade de cúspides
    if (cusps.length !== 12) {
      throw new Error(`❌ Esperado 12 cúspides, recebido ${cusps.length}`);
    }
    
    // Validar ascendente
    if (typeof asc !== 'number' || asc < 0 || asc >= 360) {
      throw new Error(`❌ Ascendente inválido: ${asc}`);
    }
    
    // Validar que primeira cúspide = ascendente  
    if (Math.abs(cusps[0] - asc) > 0.01) {
      throw new Error(`❌ Casa 1 (${cusps[0]}) != Ascendente (${asc})`);
    }
    
    // Validar ordem das cúspides (principal teste!)
    let errors = [];
    for (let i = 0; i < 12; i++) {
      const current = cusps[i];
      const next = cusps[(i + 1) % 12];
      
      if (typeof current !== 'number' || current < 0 || current >= 360) {
        errors.push(`Casa ${i + 1}: valor inválido ${current}`);
        continue;
      }
      
      // Calcular diferença considerando wraparound 0°-360°
      let diff = (next - current + 360) % 360;
      if (diff === 0) diff = 360; // Caso especial: mesmo grau
      
      if (diff > 180) {
        errors.push(`Casa ${i + 1}→${(i + 1) % 12 + 1}: ${current.toFixed(2)}°→${next.toFixed(2)}° (diff: ${diff.toFixed(2)}°)`);
      }
    }
    
    if (errors.length > 0) {
      console.log(`❌ ERRO: Cúspides desordenadas!`);
      console.log(`   Erros encontrados:`, errors);
      console.log(`   Cúspides:`, cusps.map((c, i) => `Casa ${i + 1}: ${c.toFixed(2)}°`));
      return { success: false, errors, testCase: testCase.name };
    }
    
    // Validar sistema usado
    const system = data.houses.system || 'unknown';
    const systemEffective = data.houses.systemEffective || system;
    
    console.log(`✅ SUCESSO!`);
    console.log(`   Sistema: ${system} → ${systemEffective}`);
    console.log(`   Ascendente: ${asc.toFixed(2)}°`);
    console.log(`   MC: ${data.houses.midheaven?.toFixed(2)}°`);
    console.log(`   Cúspides ordenadas corretamente!`);
    
    return { 
      success: true, 
      system: systemEffective,
      ascendant: asc,
      testCase: testCase.name
    };
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    return { 
      success: false, 
      error: error.message, 
      testCase: testCase.name 
    };
  }
}

async function runAllTests() {
  console.log('🚀 INICIANDO TESTE COMPLETO DO SISTEMA DE CASAS ASTROLÓGICAS');
  console.log('='.repeat(60));
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const testCase of testCases) {
    const result = await testBackendEndpoint(testCase);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Pausa entre testes para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTADO FINAL DOS TESTES');
  console.log('='.repeat(60));
  console.log(`✅ Sucessos: ${successCount}/${testCases.length}`);
  console.log(`❌ Falhas: ${failCount}/${testCases.length}`);
  console.log(`📈 Taxa de sucesso: ${((successCount/testCases.length)*100).toFixed(1)}%`);
  
  if (failCount > 0) {
    console.log('\n❌ FALHAS DETECTADAS:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.testCase}: ${r.error || r.errors?.join(', ')}`);
    });
  }
  
  if (successCount === testCases.length) {
    console.log('\n🎉 PARABÉNS! SISTEMA 100% FUNCIONAL EM TODOS OS CASOS!');
  } else {
    console.log('\n⚠️  Sistema precisa de ajustes para atingir 100% de confiabilidade');
  }
  
  return {
    total: testCases.length,
    success: successCount,
    fail: failCount,
    rate: (successCount/testCases.length)*100,
    results
  };
}

// Executar testes se chamado diretamente
if (typeof window === 'undefined') {
  runAllTests().then(results => {
    process.exit(results.fail > 0 ? 1 : 0);
  });
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined') {
  module.exports = { testCases, testBackendEndpoint, runAllTests };
}
