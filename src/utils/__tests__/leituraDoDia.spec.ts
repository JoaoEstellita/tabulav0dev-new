import { describe, it, expect } from 'vitest'
import {
  temaDoTransito,
  primeiraFrase,
  semAPrimeiraFrase,
  costurar,
  enumerar,
  janelaEmPalavras,
} from '../leituraDoDia'

/**
 * As peças de texto da leitura do dia.
 *
 * O que não pode voltar: frase montada com template genérico. "Ação prática:
 * observe sinais, registre decisões e execute um próximo passo simples em área
 * de vida" serve para qualquer pessoa em qualquer dia — o que é outra forma de
 * dizer que não serve.
 */

describe('tema do trânsito', () => {
  it('usa o título curado quando existe', () => {
    expect(temaDoTransito('Saturn', 'conjuncao', 'Sun', 'pt-BR')).toBe('Hora de assumir o próprio peso')
    expect(temaDoTransito('Saturn', 'quadratura', 'Sun', 'pt-BR')).toBe('Prova de maturidade')
  })

  it('aceita acento e caixa na chave', () => {
    expect(temaDoTransito('saturn', 'conjunção', 'sun', 'pt-BR')).toBe('Hora de assumir o próprio peso')
  })

  it('cai no título gerado quando não há curado', () => {
    // Cobertura do catálogo é parcial por design; o gerado evita que uns cards
    // tenham tema e outros não.
    const t = temaDoTransito('Mars', 'trigono', 'Moon', 'pt-BR')
    expect(t, 'sem tema nenhum o resumo volta a ser genérico').toBeTruthy()
  })

  it('devolve null fora do pt-BR, em vez de texto em português', () => {
    // O catálogo de títulos é pt-BR por design. Nos outros idiomas quem abre a
    // frase é a primeira sentença do texto curado — nunca português solto no
    // meio de uma tela em inglês.
    expect(temaDoTransito('Saturn', 'conjuncao', 'Sun', 'en-US')).toBeNull()
    expect(temaDoTransito('Saturn', 'conjuncao', 'Sun', 'es-ES')).toBeNull()
    expect(temaDoTransito('Saturn', 'conjuncao', 'Sun', 'it-IT')).toBeNull()
  })
})

describe('recorte de frases', () => {
  const texto = 'Urano desperta Júpiter. O que estava parado se move. Vale arriscar pouco.'

  it('primeira frase vem com a pontuação', () => {
    expect(primeiraFrase(texto)).toBe('Urano desperta Júpiter.')
  })

  it('o resto não repete a primeira', () => {
    // O "Ler mais" mostra o resto: repetir a abertura faz o bloco expandido
    // parecer que não acrescenta nada.
    expect(semAPrimeiraFrase(texto)).toBe('O que estava parado se move. Vale arriscar pouco.')
  })

  it('texto de uma frase só não sobra nada — melhor vazio que repetido', () => {
    expect(semAPrimeiraFrase('Só isto aqui.')).toBe('')
    expect(semAPrimeiraFrase('Sem pontuação final')).toBe('')
  })

  it('texto vazio não quebra', () => {
    expect(primeiraFrase('')).toBe('')
    expect(semAPrimeiraFrase('')).toBe('')
  })

  it('normaliza espaço sem comer pontuação', () => {
    expect(primeiraFrase('  Duas   linhas\n  juntas. Resto.')).toBe('Duas linhas juntas.')
  })
})

describe('costura do texto', () => {
  it('junta sem espaço antes da pontuação', () => {
    expect(costurar('O dia pede calma', '.')).toBe('O dia pede calma.')
  })

  it('não duplica pontuação', () => {
    expect(costurar('Fim.', '.')).toBe('Fim.')
  })

  it('ignora pedaço vazio', () => {
    expect(costurar('a', '', null, undefined, 'b')).toBe('a b')
  })
})

describe('enumerar áreas', () => {
  it('usa a conjunção do idioma', () => {
    expect(enumerar(['Amor', 'Carreira'], 'e')).toBe('Amor e Carreira')
    expect(enumerar(['Love', 'Career'], 'and')).toBe('Love and Career')
  })

  it('três itens levam vírgula e conjunção', () => {
    expect(enumerar(['a', 'b', 'c'], 'e')).toBe('a, b e c')
  })

  it('um item sai sozinho; nenhum sai vazio', () => {
    expect(enumerar(['Amor'], 'e')).toBe('Amor')
    expect(enumerar([], 'e')).toBe('')
  })
})

describe('janela em palavras', () => {
  const base = new Date('2026-10-08T12:00:00Z')
  const daqui = (ms: number) => ({ exact: new Date(base.getTime() + ms).toISOString() })
  const H = 60 * 60 * 1000
  const D = 24 * H

  it('substitui a forma compacta ilegível', () => {
    // "pico ha 6d" apareceu no meio de um parágrafo e ninguém entendeu: sem
    // acento, abreviado e sem sujeito.
    expect(janelaEmPalavras(daqui(-6 * D), 'pt-BR', base)).toBe('passou pelo ponto exato há 6 dias')
    expect(janelaEmPalavras(daqui(3 * D), 'pt-BR', base)).toBe('chega ao ponto exato em 3 dias')
  })

  it('perto demais é "agora" — não finge precisão que o trânsito não tem', () => {
    expect(janelaEmPalavras(daqui(2 * H), 'pt-BR', base)).toBe('no ponto exato agora')
    expect(janelaEmPalavras(daqui(-2 * H), 'pt-BR', base)).toBe('no ponto exato agora')
  })

  it('hoje e amanhã têm palavra própria', () => {
    expect(janelaEmPalavras(daqui(10 * H), 'pt-BR', base)).toBe('chega ao ponto exato ainda hoje')
    expect(janelaEmPalavras(daqui(-10 * H), 'pt-BR', base)).toBe('passou pelo ponto exato hoje')
    expect(janelaEmPalavras(daqui(1 * D), 'pt-BR', base)).toBe('chega ao ponto exato amanhã')
    expect(janelaEmPalavras(daqui(-1 * D), 'pt-BR', base)).toBe('passou pelo ponto exato ontem')
  })

  it('fala os 4 idiomas, com es/it sem acento', () => {
    const ACENTO = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i
    for (const idioma of ['es-ES', 'it-IT'] as const) {
      expect(ACENTO.test(janelaEmPalavras(daqui(3 * D), idioma, base))).toBe(false)
    }
    expect(janelaEmPalavras(daqui(3 * D), 'en-US', base)).toBe('reaches its exact point in 3 days')
  })

  it('sem janela não inventa texto', () => {
    expect(janelaEmPalavras(null, 'pt-BR', base)).toBe('')
    expect(janelaEmPalavras({}, 'pt-BR', base)).toBe('')
    expect(janelaEmPalavras({ exact: 'não é data' }, 'pt-BR', base)).toBe('')
  })
})

describe('chave do título: ângulos (Ascendente, Meio do Céu)', () => {
  /**
   * Bug encontrado ao auditar a cobertura: a chave canônica guarda o sublinhado
   * ("meio_do_ceu"), e quem montava a chave do título normalizava por conta
   * própria — ora removendo o "_", ora sem tirar o acento. Resultado: NENHUM
   * título curado de ângulo aparecia, e ninguém notava porque o gerador cobria
   * o buraco com um título plausível.
   */
  it('Meio do Céu casa, venha como vier', () => {
    const esperado = 'Cume da responsabilidade'
    for (const alvo of ['Midheaven', 'Meio do Céu', 'meio do ceu', 'MC']) {
      expect(temaDoTransito('Saturn', 'conjuncao', alvo, 'pt-BR'), `alvo "${alvo}"`).toBe(esperado)
    }
  })

  it('Ascendente casa, venha como vier', () => {
    const esperado = 'Nova imagem de si'
    for (const alvo of ['Ascendant', 'Ascendente', 'ascendente', 'ASC']) {
      expect(temaDoTransito('Saturn', 'conjuncao', alvo, 'pt-BR'), `alvo "${alvo}"`).toBe(esperado)
    }
  })
})
