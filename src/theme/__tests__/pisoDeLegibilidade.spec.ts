import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { estilosDeTextoMiudo } from '../auditoriaDeFonte'
import { PISO_CORPO } from '../tipografia'

/**
 * O piso de legibilidade, com trava de catraca.
 *
 * Medido antes desta mudança: 1491 declarações de `fontSize` no app, em 41
 * valores distintos, 568 delas (38%) em 12px ou menos — e 11px e 12px eram os
 * dois tamanhos mais usados de todos.
 *
 * `theme/ui.ts` já havia tentado resolver isso, dizendo exatamente a coisa certa
 * ("importe estes em vez de repetir tamanhos soltos"), e terminou adotado em
 * dois arquivos. Então aqui não há só um token: há um LIMITE por arquivo que
 * **só pode diminuir**.
 *
 * Catraca em vez de proibição por dois motivos. Migrar 1491 ocorrências de uma
 * vez seria um diff impossível de revisar, e o parser do auditor é simples de
 * propósito — uma proibição absoluta travaria o trabalho de todos num falso
 * positivo. Com a catraca, o número caminha para zero e nunca volta.
 *
 * Quando você baixar um tamanho, baixe também o número aqui. Se ele subir, o
 * teste falha e diz exatamente qual estilo entrou.
 */

const raiz = join(__dirname, '..', '..')

/**
 * Teto de estilos de leitura abaixo do piso, por arquivo.
 *
 * São as telas que quem chega agora vê primeiro — é onde a letra miúda custa
 * mais. CAPS curto de categoria não entra na conta (ver `auditoriaDeFonte`).
 */
const TETO: Record<string, number> = {
  'screens/home/HomeScreen.tsx': 0,
  'screens/cosmos/NatalChartWheelScreen.tsx': 0,
  'components/FraseDoDia.tsx': 0,
  'screens/transits/PersonalTransitsScreen.tsx': 0,
  // Os 4 que faltam sao chips e badges curtos (10-12px) num card denso de
  // dados. Subi-los ao piso aumenta a largura em ~40% e quebra linha em tela
  // estreita — vale um passo proprio, com o layout na mao. Ficam travados aqui
  // para nao crescerem enquanto isso.
  'components/TransitComparisonCard.tsx': 4,
}

describe(`piso de legibilidade (${PISO_CORPO}px no corpo)`, () => {
  for (const [relativo, teto] of Object.entries(TETO)) {
    it(`${relativo} não passa de ${teto} estilo(s) de leitura abaixo do piso`, () => {
      const fonte = readFileSync(join(raiz, relativo), 'utf-8')
      const miudos = estilosDeTextoMiudo(fonte, PISO_CORPO)
      const detalhe = miudos.map((m) => `L${m.linha} ${m.tamanho}px ${m.nome}`).join('\n  ')
      expect(
        miudos.length,
        miudos.length > teto
          ? `texto miúdo AUMENTOU neste arquivo. Use os degraus de theme/tipografia.ts ` +
            `(corpo 16 / corpoMenor ${PISO_CORPO}), ou marque como etiqueta CAPS se não for ` +
            `para ler.\n  ${detalhe}`
          : `o teto pode ser baixado para ${miudos.length}:\n  ${detalhe}`,
      ).toBeLessThanOrEqual(teto)
    })
  }

  it('a escala não admite corpo abaixo do piso', () => {
    // Se alguém "resolver" o teste baixando o próprio piso, isto acusa.
    expect(PISO_CORPO).toBeGreaterThanOrEqual(14)
  })
})
