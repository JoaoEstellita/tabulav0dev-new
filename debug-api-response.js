/**
 * 🧪 TESTE SIMPLES PARA DEBUG DA API
 */

async function debugSingleRequest() {
  const url = 'https://tabulav0dev-backend.vercel.app/api/astro/positions';
  
  try {
    console.log('🧪 TESTANDO UMA ÚNICA REQUISIÇÃO PARA DEBUG');
    
    const testData = {
      datetimeISO: new Date().toISOString(),
      lat: -23.5505,
      lon: -46.6333,
      timezone: "America/Sao_Paulo",
      includeHouses: true,
      debug: true
    };
    
    console.log('📤 Enviando:', testData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Status:', response.status, response.statusText);
    console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📥 Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('📥 Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message);
    }
    
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
}

debugSingleRequest();
