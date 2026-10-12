import React, { useMemo, useState } from 'react'
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { aspectNature } from '../utils/astro/pt'
import { buildTransitTitle } from '../utils/transitPresentation'
import TextoComGlossario from './TextoComGlossario'
import { sintetizarODia } from '../utils/sinteseDoDia'
import { janelaEmPalavras, type IdiomaLeitura } from '../utils/leituraDoDia'
import ReadingDetailModal from './ReadingDetailModal'

/**
 * A leitura do dia: um aviso curto, e o resto a um toque.
 *
 * Histórico curto das versões que não deram certo, porque cada uma marca um
 * limite: dizer o óbvio ("hoje o dinheiro pede cuidado"), nomear o aspecto
 * como se fosse conselho, tornar palavras tocáveis (duas tentativas — rolar a
 * tela e abrir modal; no aparelho os sublinhados leram como corretor
 * ortográfico), e por fim um resumo correto mas comprido demais, com template
 * genérico no fim.
 *
 * O formato agora é: UMA frase no topo e o detalhe dentro do "Ler mais". O
 * bloco mais nobre da Home não comporta cinco linhas — quem quer a passada
 * geral lê uma linha e segue; quem quer entender abre.
 *
 * No detalhe, cada trânsito traz o ASPECTO e o texto curado dele. Sem ação
 * prática: `buildActionHint` é um template de quatro variações e, repetido em
 * quatro cards, deixa claro que é molde — "observe sinais, registre decisões e
 * execute um próximo passo simples" não é conselho, é preenchimento.
 *
 * Fica em silêncio sem dado. Frase vaga ocupa o lugar mais nobre da tela sem
 * dizer nada que a pessoa não soubesse antes de abrir o app.
 */

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type TransitoRico = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  strength?: number
  house?: number | null
  window?: { start?: string; exact?: string; end?: string } | null
}

interface Props {
  transitos?: TransitoRico[] | null
  /** Pares [chave, área] — mantido para compatibilidade; o status tem cards próprios. */
  areas?: ReadonlyArray<readonly [string, any]>
}

/** Quantos trânsitos o "Ler mais" detalha. Além disso vira lista, não leitura. */
const MAX_DETALHES = 4

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

export default function FraseDoDia({ transitos }: Props) {
  const { language } = useAppLanguage()
  const [aberto, setAberto] = useState(false)
  // Qual frase está com a leitura completa aberta (índice), ou null.
  const [fraseAberta, setFraseAberta] = useState<number | null>(null)
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const leitura = useMemo(() => {
    const lista = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
    if (!lista.length) return null

    const ordenados = [...lista].sort((a, b) => forca(b) - forca(a))
    const principal = ordenados[0]
    const idioma = (language as IdiomaLeitura) || 'pt-BR'

    const areasDe = (t: TransitoRico) => areaLabelsForTransit(t.transitPlanet, t.natalPlanet, t.house)

    /**
     * A narrativa do catálogo, com a ÁREA REAL.
     *
     * Passar null aqui fazia o catálogo cair no ramo genérico e escrever
     * literalmente "em área de vida".
     */
    const narrar = (t: TransitoRico) =>
      buildUnifiedTransitNarrative(t as any, areasDe(t)[0] || null, language)

    // ── A SÍNTESE: todos os trânsitos ativos, em camadas ───────────────────
    //
    // Antes isto usava UM trânsito — o de maior força — e ignorava os outros
    // seis, misturando escalas de tempo: "Urano sobre Júpiter" é tema de meses
    // e "Lua em trígono a Netuno" dura horas, mas os dois entravam como "hoje".
    // Era o que fazia o texto soar solto por mais correto que estivesse.
    //
    // `sintetizarODia` separa período de dia, acha convergência (mesma casa,
    // mesmo ponto focal), lê a fase pela janela e fecha com o balanço ponderado.
    const sintese = sintetizarODia(ordenados, language as any)
    const aviso = sintese?.resumo || ''
    if (!aviso) return null

    // As leituras do dia: EFEITO em destaque, origem astrologica discreta.
    // A primeira fica visivel; as outras entram no "Ver mais".
    const frases = sintese?.frases || []

    // ── A LEITURA COMPLETA, atrás de um toque ──────────────────────────────
    //
    // Antes isto era uma LISTA na tela, abaixo das frases: cada trânsito com
    // quatro a cinco linhas do catálogo. Era o que fazia o card crescer — e
    // repetia, porque a frase logo acima já tinha dito o que aquele trânsito
    // faz.
    //
    // O texto curado é o ativo mais caro do projeto e não podia sumir. Então
    // ele saiu da tela e foi para o toque: cada frase abre a leitura completa
    // do trânsito que a originou. A tela fica limpa, o catálogo continua a um
    // toque, e nada aparece duas vezes.
    //
    // Indexado por chave para a frase achar o seu: a frase sabe quais
    // trânsitos citou (`f.chaves`), e é por aí que o modal é montado.
    const porChaveDoTransito = new Map<string, TransitoRico>()
    for (const t of ordenados) porChaveDoTransito.set(`${t.transitPlanet}|${t.type}|${t.natalPlanet}`, t)

    const detalhes = ordenados
      .slice(0, MAX_DETALHES)
      .map((t) => {
      const n = narrar(t)
      const corpo = String(n?.modalBody || n?.shortText || '').trim()
      return {
        chave: `${t.transitPlanet}|${t.type}|${t.natalPlanet}`,
        // O ASPECTO em si — é o que identifica o trânsito sem rodeio.
        aspecto: buildTransitTitle(
          { transitPlanet: t.transitPlanet, aspectLabel: t.type, targetLabel: t.natalPlanet },
          language as any,
        ),
        quando: janelaEmPalavras(t.window, idioma),
        casa: typeof t.house === 'number' && t.house > 0 ? t.house : null,
        corpo,
        natureza: aspectNature(String(t.type)),
      }
    }).filter((d) => d.corpo)

    // O bloco "hoje" ja esta no topo: repeti-lo logo abaixo faria o expandido
    // parecer que nao acrescenta nada.
    // A leitura completa de cada frase, pronta para o modal.
    /**
     * A leitura completa de CADA aspecto que originou a frase.
     *
     * ⚠️ Antes isto pegava só o primeiro (`.find(Boolean)`), e a frase cita
     * até dois: "Mercúrio em conjunção e a Lua em conjunção com o seu Plutão"
     * abria o modal de Mercúrio e o da Lua não existia em lugar nenhum. A
     * linha prometia dois trânsitos e o toque entregava um.
     *
     * Os dois num modal só, em sequência, em vez de uma lista intermediária:
     * a frase acima já disse o que eles fazem juntos, e obrigar a escolher
     * entre dois nomes antes de ler seria um passo a mais para a mesma coisa.
     */
    const leiturasDasFrases = frases.map((f) => {
      const partes = f.chaves
        .map((c) => porChaveDoTransito.get(c))
        .filter(Boolean)
        .map((t: any) => {
          const n = narrar(t)
          const corpo = String(n?.modalBody || n?.shortText || '').trim()
          if (!corpo) return null
          return {
            titulo: buildTransitTitle(
              { transitPlanet: t.transitPlanet, aspectLabel: t.type, targetLabel: t.natalPlanet },
              language as any,
            ),
            quando: janelaEmPalavras(t.window, idioma),
            casa: typeof t.house === 'number' && t.house > 0 ? t.house : null,
            corpo,
          }
        })
        .filter(Boolean) as Array<{ titulo: string; quando: string; casa: number | null; corpo: string }>

      if (!partes.length) return null
      const primeiro = f.chaves.map((c) => porChaveDoTransito.get(c)).find(Boolean)
      return {
        titulo: partes[0].titulo,
        quando: partes[0].quando,
        casa: partes[0].casa,
        // Um corpo só, com o título de cada aspecto separando os textos quando
        // há mais de um — senão os dois viram um parágrafo sem dono.
        corpo: partes.length === 1
          ? partes[0].corpo
          : partes.map((p) => `${p.titulo}\n${p.corpo}`).join('\n\n'),
        natureza: aspectNature(String((primeiro as any)?.type || '')),
        // Com dois, o título do modal não pode ser o do primeiro: ele diria
        // menos do que a linha que a pessoa tocou.
        varios: partes.length > 1,
      }
    })

    return { aviso, detalhes, frases, leiturasDasFrases }
  }, [transitos, language])

  if (!leitura) return null

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAberto((v) => !v)
  }

  const leituraDaFrase = fraseAberta != null ? leitura.leiturasDasFrases[fraseAberta] : null

  /**
   * "chega ao ponto exato em 3 dias"
   *
   * ⚠️ Sobrou só a JANELA. A casa saiu primeiro, as áreas depois: com efeito,
   * origem, casa, áreas e janela, cada frase virava cinco informações — e
   * multiplicado por doze, a tela deixava de ser leitura.
   *
   * O que ficou é o que a frase não diz sozinha. O ponto atingido já está na
   * linha da origem ("o seu Netuno"); a casa e as áreas continuam no modal,
   * junto da leitura completa.
   */
  const contextoDaFrase = (f: typeof leitura.frases[number]) => f.quando || ''

  /**
   * As frases em três tempos: o que é agora, o que vem, o que ficou.
   *
   * Doze frases ordenadas só por força são doze blocos iguais, e a pessoa não
   * tem como achar o que é de HOJE. Separadas por fase, viram uma narrativa —
   * e a pergunta da manhã é respondida primeiro.
   */
  const GRUPOS = [
    { chave: 'agora', titulo: tl('Acontecendo agora', 'Happening now', 'Sucediendo ahora', 'Sta accadendo ora') },
    { chave: 'antes', titulo: tl('Chegando', 'Coming up', 'Llegando', 'In arrivo') },
    // ⚠️ Os LENTOS em grupo próprio, não misturados aos tempos.
    //
    // Era o que o bloco "O fundo" protegia: um trânsito de Plutão é tema de
    // meses e um aspecto da Lua dura horas — postos lado a lado sob
    // "Acontecendo agora", os dois soam igual, e o de meses vira notícia do
    // dia. Com o fundo removido, a distinção ganhou grupo em vez de sumir.
    { chave: 'lentos', titulo: tl('Trânsitos lentos', 'Slow transits', 'Transitos lentos', 'Transiti lenti') },
    // Por último: o que já passou é a informação menos acionável das quatro.
    { chave: 'depois', titulo: tl('Já passou do pico', 'Past the peak', 'Ya paso el pico', 'Oltre il picco') },
  ] as const

  const frasesDoGrupo = (chave: typeof GRUPOS[number]['chave']) =>
    leitura.frases
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => (chave === 'lentos' ? f.lento : !f.lento && f.fase === chave))

  /**
   * Uma leitura do dia: efeito em destaque, origem discreta, e a leitura
   * completa a um toque.
   *
   * Tocável só quando HÁ texto curado por trás — um bloco que parece clicável
   * e não abre nada é pior que um bloco que não parece.
   */
  const renderFrase = (f: typeof leitura.frases[number], i: number, ultima: boolean) => {
    const conteudo = (
      <>
        <View style={s.fraseTopo}>
          <TextoComGlossario style={[s.texto, s.fraseTexto]}>{f.efeito}</TextoComGlossario>
          {/* ⚠️ Em TODAS. Antes o chevron só aparecia quando havia texto
              curado por trás, e a lista ficava visualmente irregular — umas
              tocáveis, outras não, sem nada na tela explicando a diferença.
              Sem catálogo o modal mostra o aspecto e a janela, que é menos,
              mas é coerente. */}
          <Text style={s.chevron}>›</Text>
        </View>
        {f.fonte ? <Text style={s.fonte}>{f.fonte}</Text> : null}
        {/* Onde pega e quando: a casa dá o setor do mapa, as áreas dizem o
            que isso é na vida, e a janela só aparece fora do grupo "agora"
            (ali é hoje, e o cabeçalho já disse). */}
        {contextoDaFrase(f) ? <Text style={s.contexto}>{contextoDaFrase(f)}</Text> : null}
      </>
    )
    return (
      <Pressable
        key={`frase-${i}`}
        style={[i > 0 ? s.fraseExtra : null, ultima ? s.fraseUltima : null]}
        onPress={() => setFraseAberta(i)}
        accessibilityRole="button"
        accessibilityLabel={f.efeito}
      >
        {conteudo}
      </Pressable>
    )
  }

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>

      {/* O EFEITO primeiro, a origem depois e em segundo plano.
          A ordem inversa — "Hoje a Lua e Vênus pressionam a sua presença" antes
          do que isso significa — punha na frente o que menos importa para quem
          lê. O aspecto é a FONTE da informação, não a informação. */}
      {/* ⚠️ Fechado, so a primeira frase. Aberto, ela aparece DENTRO do seu
          grupo — antes ficava acima do cabecalho "Acontecendo agora" mesmo
          pertencendo a ele, e a tela sugeria que era outra coisa. */}
      {!aberto ? (
        leitura.frases[0] ? renderFrase(leitura.frases[0], 0, false) : (
          <TextoComGlossario style={s.texto}>{leitura.aviso}</TextoComGlossario>
        )
      ) : null}

      {aberto ? (
        <View style={s.detalhe}>
          {/* TODAS as leituras do dia, agrupadas por tempo.
              O teto de quatro existia para a tela não crescer — mas o que a
              fazia crescer era a lista de aspectos abaixo, que repetia cada
              trânsito com o texto do catálogo. Sem ela, o céu inteiro cabe. */}
          {GRUPOS.map((g) => {
            const doGrupo = frasesDoGrupo(g.chave)
            if (!doGrupo.length) return null
            return (
              <View key={g.chave} style={s.grupo}>
                <Text style={s.grupoTitulo}>{g.titulo}</Text>
                {doGrupo.map(({ f, i }, pos) =>
                  renderFrase(f, i, pos === doGrupo.length - 1),
                )}
              </View>
            )
          })}

        </View>
      ) : null}

      {/* O botão depende de haver o que expandir: outras frases, ou os blocos
          do momento. Antes dependia da lista de aspectos, que não existe mais. */}
      {leitura.frases.length > 1 ? (
        <Pressable onPress={alternar} style={s.botao} accessibilityRole="button">
          <Text style={s.botaoTexto}>
            {aberto
              ? tl('Mostrar menos', 'Show less', 'Mostrar menos', 'Mostra meno')
              : tl('Ler mais', 'Read more', 'Leer mas', 'Leggi di piu')}
            {aberto ? '  ▲' : '  ▼'}
          </Text>
        </Pressable>
      ) : null}

      {/* A leitura completa do trânsito que originou a frase — o texto curado
          do catálogo, que saiu da tela para caber atrás de um toque. */}
      <ReadingDetailModal
        visible={fraseAberta != null}
        onClose={() => setFraseAberta(null)}
        // Sem catálogo, o título é a própria origem — "o Sol em quadratura ao
        // seu Netuno" já identifica o trânsito sem depender de texto curado.
        title={
          (leituraDaFrase?.varios || !leituraDaFrase?.titulo)
            // Com mais de um aspecto, o título é a linha de origem inteira —
            // é ela que a pessoa tocou, e nomear só o primeiro esconderia o
            // segundo antes mesmo de abrir.
            ? ((fraseAberta != null ? leitura.frases[fraseAberta]?.fonte : '') || '')
            : leituraDaFrase.titulo
        }
        timingLabel={[
          leituraDaFrase?.quando || (fraseAberta != null ? leitura.frases[fraseAberta]?.quando : ''),
          leituraDaFrase?.casa ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${leituraDaFrase.casa}` : '',
        ].filter(Boolean).join('  ·  ')}
        // O efeito da frase vira a abertura do modal: quem tocou veio dali, e
        // reencontrar a mesma frase no topo confirma que abriu o que queria.
        directText={fraseAberta != null ? (leitura.frases[fraseAberta]?.efeito || '') : ''}
        // Sem leitura curada o modal não fica vazio: mostra a janela, que é
        // a informação que a tela não cabia.
        fullText={leituraDaFrase?.corpo
          || (fraseAberta != null ? leitura.frases[fraseAberta]?.quando : '')
          || ''}
        statusColor={
          leituraDaFrase?.natureza === 'desafiador' ? '#f2544b'
            : leituraDaFrase?.natureza === 'harmonico' ? '#4ade80'
              : '#8d94a8'
        }
      />
    </View>
  )
}

const s = StyleSheet.create({
  caixa: {
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,215,0,0.05)',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  // A origem é referência, não leitura — mas precisa se distinguir de DUAS
  // coisas ao mesmo tempo: do texto do efeito (quase branco) e dos rótulos de
  // seção.
  //
  // ⚠️ Ela nasceu #8b93a7 enquanto os rótulos são #8d94a8 — a mesma cor, na
  // prática. Na tela, "O FUNDO" e "Lua em oposição ao Ascendente" ficavam
  // indistinguíveis, e a fronteira entre SEÇÃO e CONTEÚDO sumia.
  //
  // A saída é mudar a origem, não os rótulos: eles são uma FAMÍLIA ("O SEU
  // DIA", "O FUNDO", "VEM AÍ", "NO SALDO") e só funcionam sendo iguais entre
  // si. Destacar alguns quebraria a hierarquia para resolver um detalhe.
  //
  // O azul frio separa por MATIZ, não por brilho: continua discreto ao lado do
  // efeito e deixa de competir com o cinza neutro do rótulo. Segue em 14px,
  // que é o piso de legibilidade do app — o recuo vem da cor, não do tamanho.
  fonte: {
    color: '#7f9ac4',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 3,
  },
  fraseExtra: {
    marginTop: 14,
  },
  // O efeito e o chevron na mesma linha: a seta precisa ficar ao lado do
  // texto, nao abaixo dele, senao deixa de parecer um controle.
  fraseTopo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fraseTexto: { flex: 1 },
  // Discreto de proposito: sinaliza que ha mais, sem disputar atencao com o
  // texto. Quem nao quiser aprofundar nao precisa notar.
  chevron: {
    color: '#5f6b84',
    fontSize: 22,
    lineHeight: 25,
    marginLeft: 8,
  },
  fraseUltima: {
    marginBottom: 20,
  },
  // A casa, as áreas e a janela: o contexto, abaixo da origem. Mesmo tom da
  // origem, um pouco mais apagado — é a camada menos urgente das três.
  contexto: {
    color: '#6d7589',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
  },
  grupo: {
    marginBottom: 6,
  },
  // Subdivisão de "O seu dia", não seção irmã de "O FUNDO": por isso sem
  // caixa alta e sem o espaçamento de letra dos rótulos de seção.
  grupoTitulo: {
    color: '#9aa3b8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
  },
  rotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  texto: { color: '#edf0f6', fontSize: 16, lineHeight: 25 },

  detalhe: { marginTop: 14 },
  bloco: { marginBottom: 14 },
  blocoRotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  blocoTexto: { color: '#e4e8f2', fontSize: 15.5, lineHeight: 23 },
  item: {
    marginBottom: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  itemTopo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  // Um ponto colorido diz a natureza sem gastar uma palavra com isso.
  pino: { width: 8, height: 8, borderRadius: 4 },
  pinoTenso: { backgroundColor: '#f87171' },
  pinoBom: { backgroundColor: '#4ade80' },
  pinoNeutro: { backgroundColor: '#fbbf24' },
  itemTitulo: { color: '#FFD700', fontSize: 15.5, fontWeight: '700', flex: 1 },
  itemMeta: { color: '#8d94a8', fontSize: 14, marginBottom: 7 },
  itemTexto: { color: '#dde2ee', fontSize: 15, lineHeight: 23 },

  botao: { marginTop: 4, paddingVertical: 10, alignItems: 'center' },
  botaoTexto: { color: '#FFD700', fontSize: 14.5, fontWeight: '700' },
})
