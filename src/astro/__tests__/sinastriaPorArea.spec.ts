import { describe, it, expect } from 'vitest'
import {
  vinculoDaArea, vinculoPorArea, aspectosDaArea,
  AREAS_SINASTRIA, PLANETAS_DA_AREA, MIN_ASPECTOS_POR_AREA,
} from '../sinastriaPorArea'

/**
 * O VÍNCULO POR ÁREA.
 *
 * ⚠️ O vínculo é FIXO: os aspectos entre dois mapas não mudam. Este número não
 * tem "hoje" — o que muda é o que o céu ativa nele, e isso vive separado de
 * propósito. Fundir os dois daria uma nota que sobe e desce sem a pessoa saber
 * se mudou o vínculo ou o céu.
 */

const asp = (mine: string, theirs: string, aspect: string, tone: string, orb = 1) =>
  ({ mine, theirs, aspect, symbol: '', tone, orb } as any)

describe('vínculo por área', () => {
  it('cada área tem planetas, e eles se sobrepõem de propósito', () => {
    expect(AREAS_SINASTRIA.length).toBe(5)
    for (const a of AREAS_SINASTRIA) {
      expect(PLANETAS_DA_AREA[a].size, `${a} sem planetas`).toBeGreaterThan(0)
    }
    // ⚠️ Vênus está em DOIS: afeto e química. Vênus–Marte é as duas coisas, e
    // forçar cada aspecto numa caixa só obrigaria a uma escolha arbitrária.
    expect(PLANETAS_DA_AREA.afeto.has('venus')).toBe(true)
    expect(PLANETAS_DA_AREA.quimica.has('venus')).toBe(true)
  })

  it('um aspecto entra em todas as áreas que ele toca', () => {
    const venusMarte = [asp('venus', 'mars', 'trigono', 'harmonioso')]
    expect(aspectosDaArea('afeto', venusMarte as any).length).toBe(1)
    expect(aspectosDaArea('quimica', venusMarte as any).length).toBe(1)
    expect(aspectosDaArea('comunicacao', venusMarte as any).length).toBe(0)
  })

  /**
   * ⚠️ UM ASPECTO SÓ NÃO FAZ NÚMERO. Produziria 5 ou 95 conforme o tom dele —
   * um extremo apoiado numa única quadratura parece certeza e não é. A área
   * devolve `null`, e a tela diz que não há contato forte ali: é informação, e
   * é verdade.
   */
  it('área com contato insuficiente não pontua', () => {
    expect(vinculoDaArea('comunicacao', [asp('mercury', 'sun', 'trigono', 'harmonioso')] as any)).toBeNull()
    expect(MIN_ASPECTOS_POR_AREA).toBeGreaterThanOrEqual(2)
    const comDois = vinculoDaArea('comunicacao', [
      asp('mercury', 'sun', 'trigono', 'harmonioso'),
      asp('mercury', 'moon', 'sextil', 'harmonioso'),
    ] as any)
    expect(comDois, 'com dois aspectos já pontua').not.toBeNull()
  })

  it('harmônico sobe e tenso desce', () => {
    const bom = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso'),
      asp('moon', 'venus', 'sextil', 'harmonioso'),
    ] as any)!
    const ruim = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'quadratura', 'tenso'),
      asp('moon', 'venus', 'oposicao', 'tenso'),
    ] as any)!
    expect(bom.pct).toBeGreaterThan(50)
    expect(ruim.pct).toBeLessThan(50)
    expect(bom.harmonicos).toBe(2)
    expect(ruim.tensos).toBe(2)
  })

  it('orbe mais exata pesa mais', () => {
    const exato = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 0),
      asp('moon', 'venus', 'trigono', 'harmonioso', 0),
    ] as any)!
    const largo = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 5.5),
      asp('moon', 'venus', 'trigono', 'harmonioso', 5.5),
    ] as any)!
    expect(exato.pct).toBeGreaterThan(largo.pct)
  })

  it('o número vem com a explicação, ordenada pelo que mais pesou', () => {
    const v = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 0),
      asp('moon', 'neptune', 'quadratura', 'tenso', 5),
    ] as any)!
    expect(v.porque.length).toBeGreaterThan(0)
    expect(Math.abs(v.porque[0].peso)).toBeGreaterThanOrEqual(Math.abs(v.porque[v.porque.length - 1].peso))
    expect(v.quantos).toBe(2)
  })

  it('sem aspectos não há vínculo a mostrar', () => {
    expect(vinculoPorArea(null)).toBeNull()
    expect(vinculoPorArea([])).toBeNull()
    // Aspectos que não tocam área nenhuma: nada a dizer, não zeros.
    expect(vinculoPorArea([asp('jupiter', 'neptune', 'trigono', 'harmonioso')] as any)).toBeNull()
  })

  /**
   * ⚠️ AS ÁREAS TÊM DE SER COMPARÁVEIS ENTRE SI — é a razão de existirem lado a
   * lado num gráfico. Remedido em 600 pares depois da troca de curva: as
   * medianas ficam entre 49 e 57 e nenhuma área satura.
   *
   * ⚠️ ESTE TESTE AFIRMAVA A SATURAÇÃO — o nome dele era "a curva é a mesma do
   * score geral, e é por isso que ela satura lá", e ele cobrava `toBe(95)`. A
   * leitura estava certa no diagnóstico e errada na conclusão: em vez de
   * consertar a curva do geral, congelou o defeito como contrato. O % geral
   * dava 52/73/95, com um quarto dos pares no teto, e isso não era uma
   * característica da escala: era a escala não medindo nada acima de dez
   * contatos bons.
   *
   * Agora é UM marcador só (`pontuarContatos`) para as áreas, para a dupla e
   * para o Match, e o que o teste cobra é justamente que o teto não volte.
   */
  it('o mesmo marcador do geral — e nenhum dos dois satura', () => {
    // ⚠️ ANTES ISTO DAVA EXATAMENTE 95, com 12 trigonos ou com 40: o número
    // parava de responder ao mapa. Hoje responde, e o teto fica inalcançável.
    const trigonos = (n: number) => Array.from({ length: n }, (_, i) =>
      asp(i % 2 ? 'venus' : 'moon', 'venus', 'trigono', 'harmonioso', 0))
    const doze = vinculoDaArea('afeto', trigonos(12) as any)!
    const quarenta = vinculoDaArea('afeto', trigonos(40) as any)!
    expect(doze.pct, `12 trigonos exatos saturaram em ${doze.pct}`).toBeLessThan(95)
    expect(doze.pct, 'tudo harmônico tem de ler alto').toBeGreaterThan(70)
    // ⚠️ O BALANÇO É NORMALIZADO: triplicar os contatos do mesmo tom não move o
    // veredito. Se este assert cair, a soma crua voltou a ser a fonte do número.
    expect(Math.abs(quarenta.pct - doze.pct), 'de 12 para 40 contatos iguais o índice se mexeu')
      .toBeLessThanOrEqual(1)
    // Com poucos (o caso comum numa ÁREA), fica no meio da escala — que é o que
    // torna as cinco comparáveis entre si.
    const poucos = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 3),
      asp('moon', 'venus', 'quadratura', 'tenso', 3),
    ] as any)!
    expect(poucos.pct).toBeGreaterThan(30)
    expect(poucos.pct).toBeLessThan(70)
  })
})
