import React, { useMemo, useState } from 'react'
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { aspectSymbol, aspectTone } from '../astro/aspectSymbols'
import { translatePlanet } from '../utils/astro/pt'
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
    // ⚠️ O filtro entra ANTES da síntese, não na renderização: os trânsitos
    // menores influenciariam o agrupamento por ponto, o balanço tenso×fácil e
    // a escolha da frase. Escondê-los só na tela deixaria o texto descrevendo
    // um céu que a pessoa não está vendo.
    const lista = (transitos || [])
      .filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
      // ⚠️ Os menores entram SEMPRE: eles são reais e o motor os trata como
      // tensos. Havia um filtro aqui ligado ao controle da grade; o controle
      // saiu e o filtro foi junto.
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

    /**
     * O PANORAMA do dia — o que o box mostra fechado.
     *
     * ⚠️ Fechado, o card mostrava a primeira frase e mais nada. Era leitura
     * pela metade: a pessoa lia uma de doze sem saber que havia outras onze,
     * nem de que tipo.
     *
     * O panorama responde antes de abrir: quantos trânsitos, quantos pedem
     * atenção, quantos favorecem. Dá a forma do dia numa olhada, e quem quiser
     * o detalhe abre.
     */
    const contagem = ordenados.reduce(
      (acc, t) => {
        const n = aspectNature(String(t.type))
        if (n === 'desafiador') acc.tensos += 1
        else if (n === 'harmonico') acc.faceis += 1
        else acc.neutros += 1
        return acc
      },
      { tensos: 0, faceis: 0, neutros: 0 },
    )

    return { aviso, detalhes, frases, leiturasDasFrases, contagem, total: ordenados.length }
  }, [transitos, language])

  if (!leitura) return null

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAberto((v) => !v)
  }

  const leituraDaFrase = fraseAberta != null ? leitura.leiturasDasFrases[fraseAberta] : null

  /**
   * A cor do toque diz de que lado a frase pende, antes de lê-la.
   *
   * Mesmas cores da roda, para o olho reconhecer sem aprender outra legenda:
   * vermelho onde pesa, verde onde favorece. O azul fica para o DIVIDIDO —
   * quando o ponto recebe os dois lados e não pende para nenhum.
   */
  const CORES = {
    tenso: '#f2544b',
    facil: '#4ade80',
    misto: '#7f9ac4',
  } as const

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
   * DUAS listas: o que está acontecendo, e o pano de fundo.
   *
   * ⚠️ Eram quatro — "Acontecendo agora", "Chegando", "Trânsitos lentos" e "Já
   * passou do pico". Quatro títulos sobre dez frases dão em média duas frases
   * por título: o cabeçalho ocupava quase tanto quanto o conteúdo, e a
   * diferença entre "chegando" e "acontecendo" não muda o que a pessoa faz —
   * os três estão na janela, todos valem hoje.
   *
   * O que continua separado é a ESCALA DE TEMPO, que é a distinção que importa:
   * um trânsito de Plutão é tema de meses e um aspecto da Lua dura horas. Lado
   * a lado sob o mesmo título, os dois soam igual e o de meses vira notícia do
   * dia. (Era o que o antigo bloco "O fundo" protegia.)
   */
  const GRUPOS = [
    { chave: 'ativos', titulo: tl('Acontecendo agora', 'Happening now', 'Sucediendo ahora', 'Sta accadendo ora') },
    { chave: 'lentos', titulo: tl('Trânsitos lentos', 'Slow transits', 'Transitos lentos', 'Transiti lenti') },
  ] as const

  /**
   * Mais recente no topo.
   *
   * ⚠️ Pela data de INÍCIO (`inicio`, ISO), não pelo texto do período: "03/10 a
   * 23/10" e "13/04/26 a 13/04/27" não se comparam como string, e dentro de um
   * mesmo ano a comparação até daria certo por acidente — o pior tipo de bug,
   * porque só quebra na virada.
   *
   * Sem data conhecida a frase vai para o fim: ordem instável é pior que ordem
   * previsível, e uma frase sem janela não tem como disputar o topo.
   */
  const maisRecentePrimeiro = (a: { f: typeof leitura.frases[number] }, b: { f: typeof leitura.frases[number] }) => {
    const ms = (v: string | null) => {
      if (!v) return Number.NEGATIVE_INFINITY
      const t = new Date(v).getTime()
      return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY
    }
    return ms(b.f.inicio) - ms(a.f.inicio)
  }

  /**
   * As frases de cada grupo, na ordem em que a lista aberta as mostra.
   *
   * ⚠️ Já existiu uma "capa" aqui — a frase que o card mostrava fechado — e ela
   * tinha de ser a MESMA que abre a lista, senão abrir o card trocava a frase
   * do topo e a leitura parecia saltar. A capa saiu: fechado virou uma tarja
   * de uma linha, sem frase nenhuma.
   */
  const frasesDoGrupo = (chave: typeof GRUPOS[number]['chave']) => {
    const doGrupo = leitura.frases
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => (chave === 'lentos' ? f.lento : !f.lento))
    // Só a lista de ativos reordena: nos lentos, "mais recente" não quer dizer
    // nada útil — todos começaram há meses e a ordem por peso serve melhor.
    return chave === 'ativos' ? doGrupo.sort(maisRecentePrimeiro) : doGrupo
  }

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
          {/* ⚠️ LIVRINHO e não seta. A seta diz "tem mais adiante", que é o
              que uma navegação faz; aqui o toque abre uma LEITURA, e o livro é
              o ícone que o app já usa para isso — o mesmo da grade de
              aspectos. Um ícone que significa a mesma coisa em dois lugares
              ensina; dois ícones para a mesma coisa confundem. */}
          <View style={s.livro}>
            <Ionicons name="book-outline" size={15} color={CORES[f.natureza]} />
          </View>
        </View>
        {/* ⚠️ O ASPECTO VIRA GLIFO e a linha é COMPOSTA, não extraída.
            Ela dizia "Marte em quincúncio com o seu Saturno" — vinte e tantos
            caracteres para uma relação que cabe num símbolo. Com oito grupos na
            tela, isso era metade do texto.

            A linha é montada das PARTES (`f.chaves[k]`), não recortada de
            `o.texto`: tentar tirar "em quincúncio com o seu" da prosa pronta
            exigiria casar texto em quatro idiomas, com artigo variável e
            concordância de gênero — e erraria calado no primeiro caso novo.

            Os PLANETAS seguem por nome: o glifo deles é consagrado entre quem
            estuda, não entre quem está começando, e trocar os três de uma vez
            viraria criptograma. O glifo do aspecto é o que mais encurta e o que
            menos custa — ele já aparece na grade, com legenda, então é símbolo
            que o app ensina em outro lugar.

            Sem chave, a prosa original continua valendo: a linha some de
            formato, não de conteúdo.

            ⚠️ Uma linha por trânsito, cada uma com a SUA janela.
            A frase cita até dois, e a janela era uma só — a do mais forte.
            "Mercúrio em conjunção e a Lua em conjunção com o seu Plutão ·
            10/10 a 16/10" não diz de quem é o período, e os dois têm janelas
            diferentes: a Lua passa em dois dias, Mercúrio leva uma semana.
            Um período solto embaixo de dois trânsitos parece valer para os
            dois — pior que não ter. */}
        {f.origens.length ? f.origens.map((o, k) => {
            // ⚠️ `origens` e `chaves` saem ambos de `citados` na síntese, então
            // têm o MESMO índice. É disso que o glifo depende.
            const partes = String(f.chaves?.[k] || '').split('|')
            const temPartes = partes.length === 3 && partes.every(Boolean)
            const glifo = temPartes ? aspectSymbol(partes[1]) : ''
            const cor = temPartes ? aspectTone(partes[1]) : undefined
            return (
              <Text key={`o-${k}`} style={s.fonte} numberOfLines={2}>
                {glifo ? (
                  <>
                    <Text style={[s.glifo, cor ? { color: cor } : null]}>{glifo}</Text>
                    {`  ${translatePlanet(partes[0], language as any)} `}
                    <Text style={s.alvo}>{translatePlanet(partes[2], language as any)}</Text>
                  </>
                ) : (
                  o.texto
                )}
                {o.quando ? <Text style={s.contexto}>{`  ·  ${o.quando}`}</Text> : null}
              </Text>
            )
          }) : (f.fonte ? <Text style={s.fonte}>{f.fonte}</Text> : null)}
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

  const { tensos, faceis } = leitura.contagem
  const resumoDoDia = [
    tl(`${leitura.total} trânsitos ativos`, `${leitura.total} active transits`,
       `${leitura.total} transitos activos`, `${leitura.total} transiti attivi`),
    tensos ? tl(`${tensos} pedem atenção`, `${tensos} ask for care`, `${tensos} piden cuidado`, `${tensos} chiedono cura`) : '',
    faceis ? tl(`${faceis} favorecem`, `${faceis} favour you`, `${faceis} favorecen`, `${faceis} favoriscono`) : '',
  ].filter(Boolean)

  return (
    <View style={[s.caixa, !aberto && s.caixaFechada]}>
      {/* A contagem ao LADO do rótulo, não numa linha própria: ela é a
          legenda do dia, não um parágrafo. Assim o box fechado fecha em três
          ou quatro linhas.

          ⚠️ ABERTO, o cabeçalho vira o controle de fechar. Com a lista inteira
          na tela, quem está no topo não deve precisar rolar até o fim para
          sair dela — e quem terminou de ler lá embaixo tem o botão de baixo.
          O "Ver mais" de abrir fica no rodapé do box fechado, junto do que ele
          revela. */}
      {/* ⚠️ FECHADO É UMA TARJA, não uma leitura pela metade.
          Antes o box fechado trazia a primeira frase, as origens dela e o
          período — quatro a cinco linhas de astrologia antes de qualquer
          decisão de ler ou não. Agora fecha em UMA linha: o rótulo, o balanço
          do dia e a porta.

          ⚠️ O número leva COR, mas a palavra fica. Cor sozinha não é canal de
          informação acessível — sob protanopia o vermelho e o verde encostam —
          e "25 · 11" sem rótulo exige que a pessoa adivinhe qual é qual. Duas
          palavras curtas resolvem, e a cor dá a leitura rápida por cima. */}
      <Pressable
        onPress={alternar}
        style={[s.cabecalho, aberto && s.cabecalhoAberto]}
        accessibilityRole="button"
        accessibilityLabel={aberto
          ? tl('Fechar o seu dia', 'Close your day', 'Cerrar tu dia', 'Chiudi la tua giornata')
          : tl('Abrir o seu dia', 'Open your day', 'Abrir tu dia', 'Apri la tua giornata')}
      >
        <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>

        {tensos || faceis ? (
          <View style={s.balanco}>
            {tensos ? (
              <Text style={s.balancoItem} numberOfLines={1}>
                <Text style={s.balancoTenso}>{tensos}</Text>
                {` ${tl('atenção', 'to watch', 'atencion', 'attenzione')}`}
              </Text>
            ) : null}
            {faceis ? (
              <Text style={s.balancoItem} numberOfLines={1}>
                <Text style={s.balancoFacil}>{faceis}</Text>
                {` ${tl('a favor', 'in favour', 'a favor', 'a favore')}`}
              </Text>
            ) : null}
          </View>
        ) : null}

        <Text style={s.verMais}>
          {aberto
            ? `${tl('Menos', 'Less', 'Menos', 'Meno')} ▴`
            : `${tl('Ver mais', 'See more', 'Ver mas', 'Vedi altro')} ▾`}
        </Text>
      </Pressable>

      {aberto ? (
        <View style={s.detalhe}>
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

          {/* ⚠️ Fechar também daqui. Com doze frases abertas, o único controle
              ficava no topo — a pessoa terminava de ler lá embaixo e tinha que
              rolar a tela inteira de volta para fechar. */}
          <Pressable onPress={alternar} style={s.fechar} accessibilityRole="button">
            <Text style={s.verMais}>
              {tl('Mostrar menos', 'Show less', 'Mostrar menos', 'Mostra meno')} ▴
            </Text>
          </Pressable>
        </View>
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
  // ⚠️ FECHADA, a caixa aperta: os 14 de padding foram calculados para um card
  // com frase, origens e período dentro. Com uma linha só, eles viram vão — e a
  // altura da tarja passava a ser mais respiro do que conteúdo.
  //
  // `marginBottom: 0` no cabeçalho pelo mesmo motivo: ele separava a tarja do
  // que vinha abaixo, e fechado não vem nada abaixo.
  caixaFechada: {
    paddingVertical: 9,
    marginBottom: 10,
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
  // 14 é o PISO de legibilidade do projeto (ver theme/tipografia) — não dá
  // para descer mais, e nem é preciso: a diferença para os 17 do efeito já
  // estabelece a hierarquia.
  fonte: {
    color: '#7f9ac4',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
  // Discreto de proposito: sinaliza que ha leitura por tras, sem disputar
  // atencao com o texto. Quem nao quiser aprofundar nao precisa notar.
  // O `paddingTop` alinha o livro com a PRIMEIRA linha do texto, que e onde o
  // olho esta — sem ele o icone flutua no topo da caixa.
  livro: {
    marginLeft: 8,
    paddingTop: 2,
  },
  fraseUltima: {
    marginBottom: 20,
  },
  // A casa, as áreas e a janela: o contexto, abaixo da origem. Mesmo tom da
  // origem, um pouco mais apagado — é a camada menos urgente das três.
  // O ALVO em tom mais claro: a linha é "quem chega → quem recebe", e marcar o
  // segundo evita que os dois nomes virem uma lista de dois planetas soltos.
  alvo: { color: '#aebbd4' },
  contexto: {
    color: '#6d7589',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
  },
  // A tarja fechada: rótulo à esquerda, balanço no meio, porta à direita.
  // `gap` para o balanço não encostar nas pontas quando um dos lados está
  // vazio (dia só tenso ou só fácil).
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  // Só quando há conteúdo abaixo. Ver `caixaFechada`.
  cabecalhoAberto: { marginBottom: 10 },
  balanco: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  // ⚠️ A PALAVRA FICA junto do número. Cor sozinha não é canal acessível — sob
  // protanopia o vermelho e o verde encostam — e "25 · 11" sem rótulo exige
  // adivinhar qual é qual. A cor dá a leitura rápida; a palavra garante a
  // leitura certa.
  balancoItem: { color: '#9aa3b8', fontSize: 14 },
  balancoTenso: { color: '#F87171', fontSize: 17, fontWeight: '800' },
  balancoFacil: { color: '#34D399', fontSize: 17, fontWeight: '800' },
  // O glifo um pouco maior que o texto: ele é o começo da linha e o que o olho
  // pega primeiro ao varrer a lista.
  glifo: { fontSize: 16, fontWeight: '700' },
  // Discreto: é um controle, não uma chamada. O dourado do card já é usado
  // pelo que importa (o título do aspecto no modal).
  verMais: { color: '#8d94a8', fontSize: 14, fontWeight: '600' },
  // A contagem divide a linha do rótulo: mesma altura, mesmo tom.
  fechar: { alignItems: 'center', paddingVertical: 10, marginTop: 2 },
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
  // ⚠️ Sem `marginBottom`: ele existia de quando o rótulo era título de um
  // bloco com texto embaixo. Na tarja, o rótulo divide a linha com o balanço e
  // o botão, e a margem só desalinhava os três verticalmente.
  rotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  // ⚠️ HIERARQUIA: o EFEITO é 17 e a origem astrológica é 14 (o piso de
  // legibilidade do projeto). A frase é o que a pessoa veio ler; o aspecto é a
  // nota de rodapé que prova de onde ela saiu. Com os dois no mesmo tamanho, a
  // lista virava oito parágrafos iguais e nada se destacava.
  texto: { color: '#edf0f6', fontSize: 17, lineHeight: 26 },

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
