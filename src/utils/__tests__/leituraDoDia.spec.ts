import { describe, it, expect } from 'vitest'
import {
  temaDoTransito,
  primeiraFrase,
  semAPrimeiraFrase,
  costurar,
  enumerar,
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
