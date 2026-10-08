import { describe, it, expect } from 'vitest'
import {
  GLOSSARIO,
  TERMOS_ORDENADOS,
  simplificarTermo,
  type IdiomaGlossario,
} from '../../data/glossarioAstrologico'

const IDIOMAS: IdiomaGlossario[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

/**
 * O modo Explicado troca o termo técnico pela palavra comum. A troca só vale se
 * ela for de fato mais simples que o original — trocar "sextil" por outro termo
 * de ramo não ajuda ninguém, e trocar por algo vago engana.
 *
 * E há um caso em que nenhuma troca vale: ver abaixo, nome de aspecto.
 */
describe('modo explicado — qualidade das trocas', () => {
  it('NOME DE ASPECTO nunca é trocado', () => {
    // Visto no aparelho: a linha virava "Sol (trânsito) Atrito □ Netuno". O
    // símbolo do aspecto está ali do lado, a grade usa o nome, a lista usa o
    // nome — trocar só este texto por uma palavra de sentido desalinha a tela
    // de si mesma e fica ilegível. O nome fica; a explicação continua a um toque.
    for (const t of ['quadratura', 'sextil', 'trigono', 'conjuncao', 'oposicao', 'quincuncio']) {
      expect(
        simplificarTermo(t, 'pt-BR'),
        `"${t}" é nome de aspecto: tem de aparecer como ele mesmo`,
      ).toBeNull()
    }
  })

  it('o aspecto continua explicável ao toque, mesmo sem troca', () => {
    // Não trocar nunca pode virar não ensinar.
    for (const t of ['quadratura', 'sextil', 'trigono', 'conjuncao', 'oposicao', 'quincuncio']) {
      expect(GLOSSARIO[t]?.explicacao['pt-BR'], `"${t}" precisa de explicação`).toBeTruthy()
      expect(TERMOS_ORDENADOS, `"${t}" precisa continuar tocável`).toContain(t)
    }
  })

  it('"natal" aparece como "natal", e sem virar link', () => {
    // Aparece em quase toda linha da lista ("Netuno (natal)"). Com realce, cada
    // card ganhava um sublinhado dourado e a linha ainda crescia para
    // "(de nascimento)" — ruído, não ajuda.
    expect(simplificarTermo('natal', 'pt-BR'), 'natal não troca de palavra').toBeNull()
    expect(GLOSSARIO.natal?.semRealce, 'natal não pode virar link no texto').toBe(true)
    expect(TERMOS_ORDENADOS).not.toContain('natal')
  })

  it('quem tem semRealce sai da lista de realçáveis, mas segue no glossário', () => {
    const marcados = Object.keys(GLOSSARIO).filter((k) => GLOSSARIO[k].semRealce)
    expect(marcados.length, 'a marca precisa estar em uso').toBeGreaterThan(0)
    for (const k of marcados) {
      expect(TERMOS_ORDENADOS).not.toContain(k)
      expect(GLOSSARIO[k].explicacao['pt-BR'], `${k} perdeu a explicação`).toBeTruthy()
    }
  })

  it('a troca existe para os termos que a merecem', () => {
    // Estes não têm símbolo ao lado nem nome usado em tabela: a palavra comum
    // ajuda sem desalinhar nada.
    for (const t of ['orbe', 'casa', 'stellium']) {
      expect(simplificarTermo(t, 'pt-BR'), `"${t}" precisa de versão em linguagem comum`).toBeTruthy()
    }
  })

  it('não troca termo que não tem equivalente honesto', () => {
    // "Ascendente" e "retrógrado" são nomes próprios do campo: inventar sinônimo
    // seria pior que ensinar o termo com uma explicação ao toque.
    expect(simplificarTermo('ascendente', 'pt-BR')).toBeNull()
    expect(simplificarTermo('retrogrado', 'pt-BR')).toBeNull()
  })

  it('a palavra comum nunca é outro termo do glossário', () => {
    const ofensores: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      if (!entrada.simples) continue
      for (const idioma of IDIOMAS) {
        const chave = entrada.simples[idioma]
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
        if (GLOSSARIO[chave]) ofensores.push(`${termo}/${idioma} → "${chave}" ainda é jargão`)
      }
    }
    expect(ofensores).toEqual([])
  })

  it('a palavra comum é curta o bastante para caber no lugar do termo', () => {
    // Substituir inline não pode rebentar o layout: mais de 3 palavras vira frase.
    const longos: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      if (!entrada.simples) continue
      for (const idioma of IDIOMAS) {
        if (entrada.simples[idioma].split(/\s+/).length > 3) longos.push(`${termo}/${idioma}`)
      }
    }
    expect(longos).toEqual([])
  })
})
