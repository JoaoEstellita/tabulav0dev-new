import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * TEXTO QUE PROMETE AÇÃO TEM DE SER BOTÃO.
 *
 * ⚠️ RELATADO NA TELA: "não consigo fechar quando clico em 'Toque para fechar',
 * só fecha quando clico fora da janela."
 *
 * A causa é sempre a mesma e é estrutural: o rodapé vive dentro do
 * `<Pressable>` da caixa, que existe justamente para ENGOLIR o toque e impedir
 * que tocar no conteúdo feche pelo fundo. Um `<Text>` ali parece botão, promete
 * uma ação e não faz nada — e isso é pior do que não ter o texto, porque a
 * pessoa toca, nada acontece, e ela conclui que o app travou.
 *
 * Escrevi esse mesmo erro em dois componentes no mesmo dia. Daí o teste: ele
 * varre os modais do app e exige que todo rodapé de "fechar"/"voltar" esteja
 * dentro de um `Pressable` com `onPress`.
 */

const COMPONENTES = [
  'ClimaEmocional.tsx',
  'StatusNatalDoMapa.tsx',
]

const raiz = join(__dirname, '..')

/** Acha o `Pressable` que envolve a posição dada, se houver, logo acima dela. */
function envoltoEmPressableComOnPress(fonte: string, pos: number): boolean {
  // Olha para trás numa janela curta: o wrapper tem de estar imediatamente
  // acima do texto, não em qualquer lugar do arquivo.
  const janela = fonte.slice(Math.max(0, pos - 420), pos)
  const ultimoAbre = janela.lastIndexOf('<Pressable')
  if (ultimoAbre === -1) return false
  const depois = janela.slice(ultimoAbre)
  // O Pressable da CAIXA tem `onPress={() => {}}` — ele engole, não fecha.
  if (/onPress=\{\(\)\s*=>\s*\{\s*\}\}/.test(depois)) return false
  return /onPress=\{/.test(depois)
}

describe('o rodapé de fechar é um botão de verdade', () => {
  for (const arquivo of COMPONENTES) {
    it(`${arquivo}: todo "fechar/voltar" responde ao toque`, () => {
      const fonte = readFileSync(join(raiz, arquivo), 'utf-8')
      const mortos: string[] = []
      const re = /<Text style=\{s\.fechar\}>/g
      let m: RegExpExecArray | null
      let achou = 0
      while ((m = re.exec(fonte))) {
        achou++
        if (!envoltoEmPressableComOnPress(fonte, m.index)) {
          const linha = fonte.slice(0, m.index).split('\n').length
          mortos.push(`${arquivo}:${linha} — texto de fechar sem Pressable que feche`)
        }
      }
      expect(achou, `nenhum rodapé de fechar encontrado em ${arquivo} — o teste perdeu o alvo`).toBeGreaterThan(0)
      expect(
        mortos,
        mortos.length
          ? `${mortos.join('\n')}\n\nO <Text> fica dentro do <Pressable> da caixa, que engole o toque: ` +
            `ele parece botão e não faz nada. Envolva num Pressable com onPress.`
          : '',
      ).toEqual([])
    })
  }

  /**
   * ⚠️ E NADA DE DOIS <Modal> VISÍVEIS AO MESMO TEMPO.
   *
   * Relatado junto: a interpretação do aspecto abria ATRÁS do modal do humor, e
   * o do humor não fechava. Dois `<Modal>` visíveis no Android são dois diálogos
   * nativos, e alternar `visible` num que já está montado não o traz para a
   * frente. Irmãos são melhores que aninhados, mas não resolvem — a solução é
   * uma CAMADA dentro do mesmo modal.
   */
  it('ClimaEmocional tem um único Modal', () => {
    const fonte = readFileSync(join(raiz, 'ClimaEmocional.tsx'), 'utf-8')
    // ⚠️ Sem tirar os comentários, as menções a `<Modal>` na EXPLICAÇÃO deste
    // mesmo defeito contavam como ocorrências — e o teste acusava um problema
    // que o próprio comentário dizia estar resolvido.
    const semComentarios = fonte
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join('\n')
    const modais = (semComentarios.match(/<Modal\b/g) || []).length
    expect(
      modais,
      'dois Modais no mesmo componente: no Android viram dois diálogos nativos e ' +
      'o segundo pode abrir ATRÁS do primeiro. Use uma camada dentro do modal.',
    ).toBe(1)
    // E a camada tem de existir — é ela que substituiu o segundo modal.
    expect(fonte, 'a camada que substituiu o segundo modal sumiu').toMatch(/camada:\s*\{/)
  })
})
