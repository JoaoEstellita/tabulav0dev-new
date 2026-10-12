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
    const blocos = (sintese?.blocos || []).filter((b) => b.chave !== 'hoje')

    // A leitura completa de cada frase, pronta para o modal.
    const leiturasDasFrases = frases.map((f) => {
      const t = f.chaves.map((c) => porChaveDoTransito.get(c)).find(Boolean)
      if (!t) return null
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
        natureza: aspectNature(String(t.type)),
      }
    })

    return { aviso, blocos, detalhes, frases, leiturasDasFrases }
  }, [transitos, language])

  if (!leitura) return null

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAberto((v) => !v)
  }

  const leituraDaFrase = fraseAberta != null ? leitura.leiturasDasFrases[fraseAberta] : null

  /**
   * Uma leitura do dia: efeito em destaque, origem discreta, e a leitura
   * completa a um toque.
   *
   * Tocável só quando HÁ texto curado por trás — um bloco que parece clicável
   * e não abre nada é pior que um bloco que não parece.
   */
  const renderFrase = (f: typeof leitura.frases[number], i: number, ultima: boolean) => {
    const temLeitura = !!leitura.leiturasDasFrases[i]
    const conteudo = (
      <>
        <View style={s.fraseTopo}>
          <TextoComGlossario style={[s.texto, s.fraseTexto]}>{f.efeito}</TextoComGlossario>
          {temLeitura ? <Text style={s.chevron}>›</Text> : null}
        </View>
        {f.fonte ? <Text style={s.fonte}>{f.fonte}</Text> : null}
      </>
    )
    const estilo = [i > 0 ? s.fraseExtra : null, ultima ? s.fraseUltima : null]
    return temLeitura ? (
      <Pressable
        key={`frase-${i}`}
        style={estilo}
        onPress={() => setFraseAberta(i)}
        accessibilityRole="button"
        accessibilityLabel={f.efeito}
      >
        {conteudo}
      </Pressable>
    ) : (
      <View key={`frase-${i}`} style={estilo}>{conteudo}</View>
    )
  }

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>

      {/* O EFEITO primeiro, a origem depois e em segundo plano.
          A ordem inversa — "Hoje a Lua e Vênus pressionam a sua presença" antes
          do que isso significa — punha na frente o que menos importa para quem
          lê. O aspecto é a FONTE da informação, não a informação. */}
      {leitura.frases[0] ? renderFrase(leitura.frases[0], 0, false) : (
        <TextoComGlossario style={s.texto}>{leitura.aviso}</TextoComGlossario>
      )}

      {aberto ? (
        <View style={s.detalhe}>
          {/* TODAS as leituras do dia, não só as mais fortes.
              O teto de quatro existia para a tela não crescer — mas o que a
              fazia crescer era a lista de aspectos abaixo, que repetia cada
              trânsito com o texto do catálogo. Sem ela, o céu inteiro cabe. */}
          {leitura.frases.slice(1).map((f, i, arr) =>
            renderFrase(f, i + 1, i === arr.length - 1),
          )}

          {/* A leitura do momento, em camadas: o fundo (planetas lentos), o que
              vem aí e o saldo. */}
          {leitura.blocos.map((b) => (
            <View key={b.chave} style={s.bloco}>
              <Text style={s.blocoRotulo}>{b.rotulo}</Text>
              <TextoComGlossario style={s.blocoTexto}>{b.texto}</TextoComGlossario>
            </View>
          ))}
        </View>
      ) : null}

      {/* O botão depende de haver o que expandir: outras frases, ou os blocos
          do momento. Antes dependia da lista de aspectos, que não existe mais. */}
      {leitura.frases.length > 1 || leitura.blocos.length ? (
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
        visible={!!leituraDaFrase}
        onClose={() => setFraseAberta(null)}
        title={leituraDaFrase?.titulo || ''}
        timingLabel={[leituraDaFrase?.quando, leituraDaFrase?.casa ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${leituraDaFrase.casa}` : '']
          .filter(Boolean)
          .join('  ·  ')}
        // O efeito da frase vira a abertura do modal: quem tocou veio dali, e
        // reencontrar a mesma frase no topo confirma que abriu o que queria.
        directText={fraseAberta != null ? (leitura.frases[fraseAberta]?.efeito || '') : ''}
        fullText={leituraDaFrase?.corpo || ''}
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
