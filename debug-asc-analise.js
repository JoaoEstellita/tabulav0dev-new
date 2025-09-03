// Verificação do ASC correto usando dados de referência

// DADOS DO USUÁRIO:
// Nascimento: 10/04/1989 às 06:59 (Rio de Janeiro)
// Lat: -22.9068, Lon: -43.1729
// Expectativa: ASC ~2° (Touro), Sol na Casa 12

console.log('🔍 VERIFICAÇÃO DO ASCENDENTE CORRETO')
console.log('')
console.log('📋 DADOS DE NASCIMENTO:')
console.log('Data: 10/04/1989 às 06:59')
console.log('Local: Rio de Janeiro (-22.9068, -43.1729)')
console.log('')
console.log('🎯 EXPECTATIVAS (baseadas em outras plataformas):')
console.log('ASC: ~2° (Touro)')
console.log('MC: ~303° (Aquário)')
console.log('Sol: Casa 12')
console.log('')
console.log('📊 NOSSO RESULTADO ATUAL:')
console.log('ASC: 166.80° (Virgem)')
console.log('MC: 261.61° (Sagitário)')
console.log('Sol: Casa 3')
console.log('')
console.log('🔍 ANÁLISE:')
console.log('❌ Diferença de ~165° no ASC')
console.log('❌ Diferença de ~41° no MC')
console.log('❌ Sol em casa errada')
console.log('')
console.log('🚨 CONCLUSÃO: Ainda há erro nos cálculos')
console.log('')
console.log('💡 POSSÍVEIS CAUSAS:')
console.log('1. Erro na conversão de timezone')
console.log('2. Erro na data/hora UTC')
console.log('3. Erro na fórmula de LST')
console.log('4. Erro nas coordenadas')
console.log('')

// Vamos testar diferentes horários para encontrar o correto
const testHours = [
  { time: '06:59', desc: 'Horário original (local)' },
  { time: '09:59', desc: 'UTC (+3h)' },  
  { time: '03:59', desc: 'UTC (-3h)' },
  { time: '10:59', desc: 'UTC (+4h)' },
  { time: '02:59', desc: 'UTC (-4h)' }
]

console.log('⏰ TESTES DE HORÁRIO:')
for (const test of testHours) {
  console.log(`${test.time} - ${test.desc}`)
}
