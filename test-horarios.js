// Teste para encontrar horário onde Sol fica na Casa 12
const axios = require('axios');

async function testarHorarios() {
  console.log('🔍 TESTANDO DIFERENTES HORÁRIOS PARA SOL NA CASA 12\n');
  
  // Testar horários de 01:00 a 11:00
  for (let hora = 1; hora <= 11; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const horaStr = hora.toString().padStart(2, '0');
      const minutoStr = minuto.toString().padStart(2, '0');
      const timeStr = `${horaStr}:${minutoStr}:00`;
      
      try {
        const requestData = {
          natalLocal: `1989-04-10T${timeStr}-03:00`,
          natalTimezone: 'America/Sao_Paulo',
          natalOffsetMinutes: -180,
          natalLat: -22.9068,
          natalLon: -43.1729,
          datetimeISO: new Date().toISOString(),
          lat: -22.9068,
          lon: -43.1729,
          includeHouses: true,
          system: 'placidus',
          bodies: ['Sun'],
          debug: false
        };

        const response = await axios.post('http://localhost:3000/api/astro/positions', requestData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });

        const solNatal = response.data.natal?.positions?.find(p => p.body === 'Sun');
        if (solNatal && solNatal.house === 12) {
          console.log(`✅ ENCONTRADO! ${timeStr} → Sol na Casa 12`);
          console.log(`   Sol: ${solNatal.lon.toFixed(2)}°`);
          console.log(`   ASC: ${response.data.natal.houses.ascendant.toFixed(2)}°`);
          return;
        } else if (solNatal) {
          console.log(`${timeStr} → Casa ${solNatal.house} (Sol: ${solNatal.lon.toFixed(2)}°)`);
        }
        
      } catch (error) {
        console.log(`${timeStr} → ERRO`);
      }
    }
  }
  
  console.log('\n❌ Não encontrado horário onde Sol fica na Casa 12');
}

testarHorarios();
