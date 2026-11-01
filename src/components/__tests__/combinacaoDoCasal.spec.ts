import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { curvaDoVinculo, contatosComGrau, PASSO_DIAS, DIAS_DA_CURVA } from '../../astro/sinastriaAtivada'

const FONTE = readFileSync(join(__dirname, '..', 'CombinacaoDoCasal.tsx'), 'utf8')
const GRUPOS = readFileSync(join(__dirname, '..', '..', 'screens', 'groups', 'GroupsScreen.tsx'), 'utf8')

/** ⚠️ Tira comentários antes de qualquer grep: já aconteceu duas vezes neste
 *  projeto um teste acusar o comentário que documenta a própria regra. */
const semComentario = (txt: string) => txt
  .split('\n')
  .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
  .join('\n')

describe('a combinação do casal', () => {
  /**
   * ⚠️ UMA SÉRIE SÓ, e esta é a propriedade que mais importa nesta tela.
   *
   * O gráfico lê melhor amostrado de 3 em 3 e a lista precisa de todos os
   * dias. Se cada um chamar `curvaDoVinculo` por conta própria, os dois
   * discordam na MESMA data — por instante de cálculo e arredondamento
   * diferentes — e a tela mostra dois números para o mesmo dia sem que nada
   * acuse.
   */
  it('o gráfico amostra da série diária, não calcula a sua própria', () => {
    const fonte = semComentario(FONTE)
    const chamadas = fonte.match(/curvaDoVinculo\(/g) || []
    expect(chamadas.length, 'há mais de uma chamada a curvaDoVinculo — gráfico e lista podem divergir')
      .toBe(1)
    expect(fonte, 'a série da tela tem de ser diária (passo 1)').toMatch(/passo:\s*1/)
    expect(fonte, 'o gráfico tem de amostrar da série diária').toMatch(/curvaDiaria\.filter/)
  })

  it('amostrar de 3 em 3 devolve os mesmos valores dos dias correspondentes', () => {
    const PL = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
    const A: Record<string, number> = {}
    const B: Record<string, number> = {}
    PL.forEach((p, k) => { A[p] = k * 36; B[p] = (k * 47) % 360 })
    const ANG: Record<string, number> = { conjuncao: 0, sextil: 60, quadratura: 90, trigono: 120, oposicao: 180 }
    const asp: any[] = []
    for (const m of PL) {
      for (const t of PL) {
        let d = Math.abs(A[m] - B[t]) % 360
        if (d > 180) d = 360 - d
        for (const [n, ang] of Object.entries(ANG)) {
          const orb = Math.abs(d - ang)
          if (orb <= 6) {
            asp.push({
              mine: m, theirs: t, aspect: n, orb,
              tone: n === 'conjuncao' ? 'neutro' : (n === 'sextil' || n === 'trigono') ? 'harmonioso' : 'tenso',
            })
            break
          }
        }
      }
    }
    const contatos = contatosComGrau(asp as never, A, B)
    const de = new Date('2026-06-01T12:00:00Z')
    const diaria = curvaDoVinculo(contatos, { dias: DIAS_DA_CURVA, passo: 1, de })
    const amostrada = diaria.filter((_, k) => k % PASSO_DIAS === 0)
    const direta = curvaDoVinculo(contatos, { dias: DIAS_DA_CURVA, passo: PASSO_DIAS, de })

    expect(amostrada.length, 'a amostragem mudou de tamanho').toBe(direta.length)
    for (let k = 0; k < direta.length; k++) {
      expect(amostrada[k].dia, `ponto ${k}: data divergiu`).toBe(direta[k].dia)
      expect(amostrada[k].areas, `ponto ${k} (${direta[k].dia}): valores divergiram`)
        .toEqual(direta[k].areas)
    }
  })

  /**
   * ⚠️ O SVG NÃO AVISA QUANDO O TEXTO VAZA — ele corta em silêncio. A tela
   * mostrava "ensidade" e "Comunic" porque os rótulos ficavam a `raio + 24` do
   * centro sem nenhum limite, e onze caracteres a 12px não cabem na sobra.
   * Encolher a teia não resolve sozinho: o rótulo cresce com o idioma.
   */
  it('o rótulo da teia fica preso dentro da caixa do SVG', () => {
    const fonte = semComentario(FONTE)
    expect(fonte, 'a função que prende o rótulo sumiu').toMatch(/presoNaCaixa/)
    // Os DOIS textos de cada ponta (rótulo e número) têm de passar por ela —
    // prender só um deixaria o outro vazando. São 2 CHAMADAS: a definição é
    // `const presoNaCaixa = (` e não casa com este padrão.
    const usos = fonte.match(/presoNaCaixa\(/g) || []
    expect(usos.length, 'rótulo ou número da ponta ficou sem o limite').toBe(2)
    expect(fonte, 'o SvgText do rótulo voltou a usar a coordenada crua')
      .not.toMatch(/<SvgText x=\{p\.x\}/)
  })

  /**
   * ⚠️ O CHIP ABRE O "DE ONDE VEM". Sem o valor e sem a seta ele lê como
   * legenda da teia: ninguém toca, e a lista de aspectos que produziu a
   * pontuação fica inalcançável atrás de um gesto que a tela não sugere.
   */
  it('o chip da área parece botão e diz o seu número', () => {
    const fonte = semComentario(FONTE)
    expect(fonte, 'o chip perdeu o valor da área').toMatch(/chipValor/)
    expect(fonte, 'o chip perdeu a seta que o faz parecer botão').toMatch(/chipSeta/)
    expect(fonte, 'sumiu a dica de que a área é tocável').toMatch(/dicaDeToque/)
    expect(fonte, 'o chip deixou de abrir o detalhe').toMatch(/onPress=\{\(\) => v && aoTocar\(a\)\}/)
  })

  it('o detalhe da área lista os aspectos que produziram a pontuação', () => {
    const fonte = semComentario(FONTE)
    expect(fonte, 'o "de onde vem" sumiu do detalhe').toMatch(/score\.porque\.map/)
    expect(fonte, 'o detalhe parou de mostrar a orbe de cada aspecto').toMatch(/p\.orb\.toFixed/)
  })

  /**
   * ⚠️ O NÚMERO DA LISTA É ATIVAÇÃO, NÃO VÍNCULO. 50 é "o céu não mexe nisto".
   * Se a lista passasse a mostrar o vínculo, a pessoa leria a relação mudando
   * de um dia para o outro — e o vínculo não muda nunca.
   */
  it('a lista por dia existe e vem da curva, não do vínculo', () => {
    const fonte = semComentario(FONTE)
    expect(fonte, 'a lista por dia sumiu').toMatch(/function ListaPorDia/)
    expect(fonte, 'a lista tem de receber a curva diária').toMatch(/curva=\{curvaDiaria\}/)
    expect(fonte, 'o alternador gráfico/por dia sumiu').toMatch(/setVista\(/)
    // ⚠️ `new Date('AAAA-MM-DD')` é lido como UTC e, à noite no Brasil, devolve
    // o dia seguinte. O meio-dia afasta o instante de qualquer borda de fuso.
    expect(fonte, 'a data do dia voltou a ser construída sem hora (vira UTC)')
      .toMatch(/T12:00:00/)
  })
})

describe('o botão da combinação, nos Grupos', () => {
  /**
   * ⚠️ ELE ABRE OUTRA TELA, então mora na linha das ações do membro — junto de
   * "Ver mapa completo" e "Sinastria" —, não dentro do card de afinidade, que
   * é leitura e não navegação.
   */
  it('mora na linha de ações, e não dentro do corpo da sinastria', () => {
    const fonte = semComentario(GRUPOS)
    expect(fonte, 'a função única que abre a combinação sumiu').toMatch(/const abrirCombinacao =/)
    // Uma função só para os dois pontos de entrada: duas cópias do mesmo
    // `setCombinacao` divergiriam no primeiro ajuste, em silêncio.
    const diretos = fonte.match(/setCombinacao\(\{/g) || []
    expect(diretos.length, 'há setCombinacao fora de abrirCombinacao — duas montagens do mesmo dado')
      .toBe(1)
    expect(fonte, 'o botão voltou para dentro do corpo da sinastria')
      .not.toMatch(/styles\.combinacaoBtn/)
  })

  it('vale para qualquer par do grupo, não só para os que envolvem você', () => {
    const fonte = semComentario(GRUPOS)
    // DOIS pontos de entrada: o card do membro e a matriz de duplas. A
    // definição é `const abrirCombinacao = (` e não casa com este padrão.
    const aberturas = fonte.match(/abrirCombinacao\(/g) || []
    expect(aberturas.length, 'a matriz de duplas do grupo ficou sem o botão').toBe(2)
    expect(fonte, 'o par da matriz deixou de passar os dois mapas')
      .toMatch(/chartByMember\[pair\.aId\], chartByMember\[pair\.bId\]/)
  })

  /** Sem os dois mapas a tela abriria vazia; o botão não deve nem aparecer. */
  it('só aparece quando há os dois mapas e aspecto entre eles', () => {
    const fonte = semComentario(GRUPOS)
    expect(fonte, 'a guarda do botão sumiu').toMatch(/const temCombinacao =/)
    expect(fonte, 'a guarda parou de exigir aspecto').toMatch(/synastryByMember\[uid\] \|\| \[\]\)\.length > 0/)
  })

  /**
   * ⚠️ Regra do projeto: toda string exibida existe nos 4 idiomas. Estas duas
   * viviam só no fallback em pt-BR dentro do componente — en/es/it mostravam
   * português.
   */
  it('os rótulos existem nos 4 idiomas', () => {
    const i18n = readFileSync(join(__dirname, '..', '..', 'i18n', 'appI18n.ts'), 'utf8')
    for (const chave of ['groups.synastry.combination', 'groups.synastry.combinationShort']) {
      const n = (i18n.match(new RegExp(`'${chave.replace(/\./g, '\\.')}':`, 'g')) || []).length
      expect(n, `${chave}: esperava 4 idiomas, achei ${n}`).toBe(4)
    }
  })
})
