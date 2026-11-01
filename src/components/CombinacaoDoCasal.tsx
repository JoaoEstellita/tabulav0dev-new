import React, { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polygon, Stop, Text as SvgText } from 'react-native-svg'
import { vinculoPorArea, AREAS_SINASTRIA, type AreaSinastria, type ScoreDeArea } from '../astro/sinastriaPorArea'
import {
  contatosComGrau, curvaDoVinculo, ativacaoNoInstante, paraEscalaAtivacao,
  DIAS_DA_CURVA, PASSO_DIAS, type PontoDaCurva,
} from '../astro/sinastriaAtivada'
import type { SynastryAspect } from '../astro/synastry'
import { translatePlanet } from '../utils/astro/pt'

/**
 * A COMBINAÇÃO DE DUAS PESSOAS — o vínculo e o que o céu faz com ele.
 *
 * ⚠️ DOIS GRÁFICOS, e não um, porque são DUAS MEDIDAS. O vínculo é FIXO: os
 * aspectos entre dois mapas não mudam nunca. O que varia é o que o céu ativa
 * neles. Um número só subiria e desceria sem a pessoa saber se mudou a relação
 * ou o céu — e é justamente essa confusão que a tela existe para desfazer.
 *
 * ⚠️ AS ÁREAS E O % GERAL SÃO A MESMA ESCALA — hoje. Esta nota dizia o
 * contrário ("pôr os dois lado a lado convidaria a uma comparação entre
 * escalas diferentes"), e estava certa enquanto o geral saturava: ele somava
 * 20+ aspectos por uma curva calibrada para poucos e um quarto dos pares batia
 * no teto de 95. Desde que os dois passaram a usar `pontuarContatos`, "Afeto
 * 67" e "a dupla 71" medem a mesma coisa e podem ser lidos juntos.
 *
 * ⚠️ NÃO É PREVISÃO DE RELACIONAMENTO. A curva diz quanto do vínculo está
 * sendo tocado — "o céu está mexendo no que vocês têm de afeto" —, nunca "hoje
 * é um bom dia para vocês".
 */

type Props = {
  aspectos: ReadonlyArray<SynastryAspect> | null | undefined
  /** Longitudes natais de cada lado, por planeta em minúscula. */
  grausMeus?: Record<string, number> | null
  grausDoOutro?: Record<string, number> | null
  nomeA?: string
  nomeB?: string
  idioma?: string
  aoFechar: () => void
}

const ROTULO: Record<AreaSinastria, [string, string, string, string]> = {
  afeto: ['Afeto', 'Affection', 'Afecto', 'Affetto'],
  comunicacao: ['Comunicação', 'Communication', 'Comunicacion', 'Comunicazione'],
  quimica: ['Química', 'Chemistry', 'Quimica', 'Chimica'],
  sustentacao: ['Sustentação', 'Grounding', 'Sustento', 'Sostegno'],
  intensidade: ['Intensidade', 'Intensity', 'Intensidad', 'Intensita'],
}

/** O que cada área mede — uma linha, para o número não ser um oráculo. */
const VERBETE: Record<AreaSinastria, [string, string, string, string]> = {
  afeto: [
    'O quanto vocês se aconchegam: carinho, gosto pela companhia, cuidado.',
    'How much you nest together: warmth, enjoying each other, care.',
    'Cuanto se acogen: carino, gusto por la compania, cuidado.',
    'Quanto vi accogliete: affetto, piacere della compagnia, cura.',
  ],
  comunicacao: [
    'O quanto vocês se entendem: conversa, raciocínio, o que é dito e ouvido.',
    'How much you follow each other: talking, thinking, what is said and heard.',
    'Cuanto se entienden: conversacion, razonamiento, lo dicho y lo oido.',
    'Quanto vi capite: conversazione, ragionamento, cio che si dice e si ascolta.',
  ],
  quimica: [
    'A atração e o impulso: o que acende, o que provoca, o que move os dois.',
    'Attraction and drive: what sparks, what provokes, what moves you both.',
    'La atraccion y el impulso: lo que enciende, lo que provoca, lo que mueve.',
    'L attrazione e la spinta: cio che accende, provoca e muove entrambi.',
  ],
  sustentacao: [
    'O que segura: compromisso, estrutura, o peso que a relação aguenta.',
    'What holds: commitment, structure, the weight the bond can carry.',
    'Lo que sostiene: compromiso, estructura, el peso que la relacion aguanta.',
    'Cio che regge: impegno, struttura, il peso che il legame sostiene.',
  ],
  intensidade: [
    'O quanto mexe fundo: transformação, obsessão, o que desacomoda.',
    'How deep it goes: transformation, obsession, what unsettles.',
    'Cuanto remueve: transformacion, obsesion, lo que desacomoda.',
    'Quanto smuove: trasformazione, ossessione, cio che destabilizza.',
  ],
}

const COR: Record<AreaSinastria, [string, string]> = {
  afeto: ['#F472B6', '#FBCFE8'],
  comunicacao: ['#60A5FA', '#BFDBFE'],
  quimica: ['#FB923C', '#FED7AA'],
  sustentacao: ['#34D399', '#A7F3D0'],
  intensidade: ['#A78BFA', '#DDD6FE'],
}

const TINTA = '#C7D2E8'
const TINTA_FRACA = '#8D96AC'
const TRILHO = 'rgba(255,255,255,0.10)'

export default function CombinacaoDoCasal({
  aspectos, grausMeus, grausDoOutro, nomeA, nomeB, idioma, aoFechar,
}: Props) {
  const { width } = useWindowDimensions()
  const [aberta, setAberta] = useState<AreaSinastria | null>(null)
  // ⚠️ GRÁFICO E LISTA SÃO A MESMA SÉRIE, vistas de dois jeitos. O gráfico
  // mostra a FORMA (quando sobe, quando cai); a lista mostra o DIA (que número,
  // e puxado por qual trânsito). Uma pergunta não responde a outra.
  const [vista, setVista] = useState<'grafico' | 'dias'>('grafico')
  const [todosOsDias, setTodosOsDias] = useState(false)
  const l = String(idioma || 'pt-BR')
  const i = l.startsWith('en') ? 1 : l.startsWith('es') ? 2 : l.startsWith('it') ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]

  const vinculo = useMemo(() => vinculoPorArea(aspectos), [aspectos])

  const contatos = useMemo(
    () => contatosComGrau(aspectos, grausMeus, grausDoOutro),
    [aspectos, grausMeus, grausDoOutro],
  )

  const hoje = useMemo(() => {
    if (!contatos.length) return null
    const r = ativacaoNoInstante(contatos, new Date())
    const out: Partial<Record<AreaSinastria, number>> = {}
    for (const a of AREAS_SINASTRIA) out[a] = paraEscalaAtivacao(r.areas[a] || 0)
    return { valores: out, principal: r.principal }
  }, [contatos])

  /**
   * ⚠️ UMA SÉRIE SÓ, calculada DIA A DIA — o gráfico amostra dela.
   *
   * O gráfico lia melhor amostrado de três em três (diário vira serrilha,
   * porque os planetas rápidos entram e saem de orbe), mas a lista por dia
   * precisa de todos os dias. Calcular as duas séries em chamadas separadas
   * faria o gráfico e a lista discordarem no mesmo dia — por arredondamento e
   * por instante de cálculo diferentes —, e seriam dois números distintos para
   * a mesma data na mesma tela.
   *
   * O custo não justifica duas chamadas: medido, 46 pontos levam 12ms contra
   * 10ms dos 16 pontos. É CPU pura, sem rede e sem leitura de banco.
   */
  const curvaDiaria = useMemo(
    () => curvaDoVinculo(contatos, { dias: DIAS_DA_CURVA, passo: 1 }),
    [contatos],
  )
  const curva = useMemo(
    () => curvaDiaria.filter((_, k) => k % PASSO_DIAS === 0),
    [curvaDiaria],
  )

  // ⚠️ `null` quando não há material: cinco barras em zero afirmariam que o
  // vínculo não tem nada, que é diferente de não haver dado para ler.
  const temVinculo = !!vinculo && Object.keys(vinculo).length > 0

  const larguraUtil = Math.min(width - 40, 420)

  return (
    <Modal visible transparent animationType="slide" onRequestClose={aoFechar}>
      <View style={s.fundo}>
        <View style={s.folha}>
          <View style={s.puxador} />

          <View style={s.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={s.titulo}>
                {nomeA && nomeB ? `${nomeA} × ${nomeB}` : tl('A combinação', 'The combination', 'La combinacion', 'La combinazione')}
              </Text>
              <Text style={s.subtitulo}>
                {tl('o vínculo, e o que o céu faz com ele', 'the bond, and what the sky does with it',
                  'el vinculo, y lo que el cielo hace con el', 'il legame, e cosa il cielo ne fa')}
              </Text>
            </View>
            <Pressable onPress={aoFechar} accessibilityRole="button" hitSlop={12} style={({ pressed }) => [s.fechar, pressed && { opacity: 0.6 }]}>
              <Text style={s.fecharX}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
            {!temVinculo ? (
              <Text style={s.vazio}>
                {tl(
                  'Os dois mapas não têm contato forte o bastante para uma leitura por área.',
                  'The two charts do not have strong enough contact for a per-area reading.',
                  'Las dos cartas no tienen contacto suficiente para una lectura por area.',
                  'Le due carte non hanno contatto sufficiente per una lettura per area.',
                )}
              </Text>
            ) : (
              <>
                {/* ── 1. O VÍNCULO (fixo) ───────────────────────────────── */}
                <Text style={s.secao}>{tl('O vínculo de vocês', 'Your bond', 'El vinculo de ustedes', 'Il vostro legame')}</Text>
                <Text style={s.secaoNota}>
                  {tl('Isto não muda — são os dois mapas entre si.', 'This does not change — it is the two charts together.',
                    'Esto no cambia: son las dos cartas entre si.', 'Questo non cambia: sono le due carte tra loro.')}
                </Text>

                <TeiaDoVinculo
                  vinculo={vinculo!}
                  largura={larguraUtil}
                  rotulo={(a) => ROTULO[a][i]}
                  aoTocar={setAberta}
                  dicaDeToque={tl(
                    'Toque numa área para ver de onde vem a pontuação',
                    'Tap an area to see where its score comes from',
                    'Toca un area para ver de donde viene su puntaje',
                    'Tocca un\'area per vedere da dove viene il punteggio',
                  )}
                />

                {/* ── 2. O QUE O CÉU ATIVA (varia) ──────────────────────── */}
                {hoje ? (
                  <>
                    <Text style={[s.secao, { marginTop: 26 }]}>
                      {tl('O que o céu está ativando', 'What the sky is activating',
                        'Lo que el cielo esta activando', 'Cosa il cielo sta attivando')}
                    </Text>
                    <Text style={s.secaoNota}>
                      {tl(
                        `Hoje e nos próximos ${DIAS_DA_CURVA} dias. Acima do meio, o céu acende o que há de bom; abaixo, o que pesa.`,
                        `Today and the next ${DIAS_DA_CURVA} days. Above the middle, the sky lights up what is good; below, what weighs.`,
                        `Hoy y los proximos ${DIAS_DA_CURVA} dias. Sobre el medio, el cielo enciende lo bueno; debajo, lo que pesa.`,
                        `Oggi e nei prossimi ${DIAS_DA_CURVA} giorni. Sopra la meta, il cielo accende cio che e buono; sotto, cio che pesa.`,
                      )}
                    </Text>

                    <View style={s.alternador}>
                      {([
                        ['grafico', tl('Gráfico', 'Chart', 'Grafico', 'Grafico')],
                        ['dias', tl('Por dia', 'By day', 'Por dia', 'Per giorno')],
                      ] as const).map(([v, texto]) => (
                        <Pressable
                          key={v}
                          onPress={() => setVista(v)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: vista === v }}
                          style={({ pressed }) => [s.alternadorBtn, vista === v && s.alternadorAtivo, pressed && { opacity: 0.6 }]}
                        >
                          <Text style={[s.alternadorTexto, vista === v && s.alternadorTextoAtivo]}>{texto}</Text>
                        </Pressable>
                      ))}
                    </View>

                    {vista === 'grafico' ? (
                      <CurvaDaAtivacao
                        curva={curva}
                        largura={larguraUtil}
                        rotulo={(a) => ROTULO[a][i]}
                        areasComVinculo={AREAS_SINASTRIA.filter((a) => vinculo![a])}
                      />
                    ) : (
                      <ListaPorDia
                        curva={curvaDiaria}
                        areas={AREAS_SINASTRIA.filter((a) => vinculo![a])}
                        rotulo={(a) => ROTULO[a][i]}
                        idioma={l}
                        tl={tl}
                        todos={todosOsDias}
                        verTodos={() => setTodosOsDias(true)}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}
          </ScrollView>

          {/* ⚠️ A ressalva fica na folha, não só no detalhe: é o enquadramento
              da tela inteira, e quem fecha antes de tocar numa área também
              precisa tê-la lido. */}
          <Text style={s.aviso}>
            {tl(
              'Leitura dos dois mapas, não previsão do relacionamento.',
              'A reading of the two charts, not a forecast of the relationship.',
              'Lectura de las dos cartas, no prediccion de la relacion.',
              'Lettura delle due carte, non previsione della relazione.',
            )}
          </Text>
        </View>
      </View>

      {aberta && vinculo?.[aberta] ? (
        <DetalheDaArea
          area={aberta}
          score={vinculo[aberta]!}
          hoje={hoje?.valores?.[aberta] ?? null}
          rotulo={ROTULO[aberta][i]}
          verbete={VERBETE[aberta][i]}
          idioma={l}
          tl={tl}
          aoFechar={() => setAberta(null)}
        />
      ) : null}
    </Modal>
  )
}

/**
 * A TEIA do vínculo — cinco eixos, um por área.
 *
 * ⚠️ Teia e não barras: as cinco áreas formam uma FORMA, e a forma é a leitura.
 * Um casal forte em afeto e fraco em comunicação desenha um polígono torto, e
 * o torto se lê de relance — cinco barras exigiriam comparar números.
 */
function TeiaDoVinculo({
  vinculo, largura, rotulo, aoTocar, dicaDeToque,
}: {
  dicaDeToque: string
  vinculo: Partial<Record<AreaSinastria, ScoreDeArea>>
  largura: number
  rotulo: (a: AreaSinastria) => string
  aoTocar: (a: AreaSinastria) => void
}) {
  const lado = Math.min(largura, 340)
  const cx = lado / 2
  const cy = lado / 2 + 6
  // Espaço para os rótulos sem encolher a teia a ponto de ela não se ler.
  const raio = lado * 0.30

  /**
   * ⚠️ O RÓTULO NÃO PODE VAZAR DO SVG, e o SVG não avisa quando vaza — ele
   * simplesmente corta. "Intensidade" e "Comunicação" têm onze caracteres e,
   * soltos a `raio + 24` do centro, saíam pela borda: a tela mostrava
   * "ensidade" e "Comunic". Encolher a teia sozinho não resolve (o rótulo
   * cresce com o idioma, e em it-IT/es-ES é maior ainda) — o que resolve é
   * prender o texto dentro da caixa.
   *
   * A largura é ESTIMADA porque o react-native-svg não mede texto. 6,2px por
   * caractere é o pior caso de uma fonte de 12px com maiúsculas; superestimar
   * só aproxima o rótulo da teia, enquanto subestimar volta a cortar.
   */
  const LARGURA_POR_CARACTERE = 6.2
  const presoNaCaixa = (x: number, texto: string, ancora: string) => {
    const w = texto.length * LARGURA_POR_CARACTERE
    const folgaEsq = ancora === 'end' ? w : ancora === 'middle' ? w / 2 : 0
    const folgaDir = ancora === 'start' ? w : ancora === 'middle' ? w / 2 : 0
    return Math.max(2 + folgaEsq, Math.min(lado - 2 - folgaDir, x))
  }

  const areas = AREAS_SINASTRIA
  const ponto = (idx: number, valor: number) => {
    const ang = (Math.PI * 2 * idx) / areas.length - Math.PI / 2
    const r = raio * (Math.max(5, Math.min(95, valor)) / 100)
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) }
  }
  const pontoRotulo = (idx: number) => {
    const ang = (Math.PI * 2 * idx) / areas.length - Math.PI / 2
    const r = raio + 24
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), ang }
  }

  const poligono = areas
    .map((a, idx) => (vinculo[a] ? ponto(idx, vinculo[a]!.pct) : ponto(idx, 50)))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={lado} height={lado + 10}>
        <Defs>
          <LinearGradient id="teia" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#F472B6" stopOpacity="0.30" />
          </LinearGradient>
        </Defs>

        {/* Anéis de referência: 25 / 50 / 75. O do meio é o "nem um nem outro". */}
        {[0.25, 0.5, 0.75, 1].map((f, k) => (
          <Circle
            key={`anel-${k}`}
            cx={cx} cy={cy} r={raio * f}
            stroke={f === 0.5 ? 'rgba(255,255,255,0.22)' : TRILHO}
            strokeDasharray={f === 0.5 ? undefined : '3 5'}
            strokeWidth={f === 0.5 ? 1 : 0.8}
            fill="none"
          />
        ))}

        {/* Raios */}
        {areas.map((a, idx) => {
          const p = ponto(idx, 100)
          return <Line key={`raio-${a}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={TRILHO} strokeWidth={0.8} />
        })}

        <Polygon points={poligono} fill="url(#teia)" stroke="#C4B5FD" strokeWidth={1.6} strokeLinejoin="round" />

        {/* Os vértices, com a cor da área — e tocáveis pelo rótulo abaixo. */}
        {areas.map((a, idx) => {
          const v = vinculo[a]
          if (!v) return null
          const p = ponto(idx, v.pct)
          return <Circle key={`v-${a}`} cx={p.x} cy={p.y} r={4.5} fill={COR[a][0]} stroke="#0F1426" strokeWidth={1.2} />
        })}

        {/* Rótulo + número em cada ponta */}
        {areas.map((a, idx) => {
          const p = pontoRotulo(idx)
          const v = vinculo[a]
          const anchor = Math.abs(Math.cos(p.ang)) < 0.3 ? 'middle' : (Math.cos(p.ang) > 0 ? 'start' : 'end')
          const texto = rotulo(a)
          const xTexto = presoNaCaixa(p.x, texto, anchor)
          const xNumero = presoNaCaixa(p.x, '00', anchor)
          return (
            <G key={`r-${a}`}>
              <SvgText x={xTexto} y={p.y} fontSize="12" fill={TINTA} textAnchor={anchor as any}>
                {texto}
              </SvgText>
              <SvgText x={xNumero} y={p.y + 15} fontSize="13" fontWeight="700" fill={v ? COR[a][0] : TINTA_FRACA} textAnchor={anchor as any}>
                {v ? String(v.pct) : '—'}
              </SvgText>
            </G>
          )
        })}
      </Svg>

      {/* ⚠️ O CHIP PRECISA PARECER BOTÃO. Ele ABRE o "de onde vem" — a lista
          dos aspectos que produziram aquele número — e, sem o valor e sem a
          seta, lia-se como legenda da teia: ninguém tocava, e a explicação
          ficava inalcançável atrás de um gesto que a tela não sugeria. */}
      <Text style={s.chipsDica}>{dicaDeToque}</Text>
      <View style={s.chips}>
        {areas.map((a) => {
          const v = vinculo[a]
          return (
            <Pressable
              key={`chip-${a}`}
              onPress={() => v && aoTocar(a)}
              disabled={!v}
              accessibilityRole="button"
              accessibilityLabel={`${rotulo(a)}: ${v ? v.pct : '—'}`}
              style={({ pressed }) => [
                s.chip,
                { borderColor: `${COR[a][0]}66` },
                !v && { opacity: 0.4 },
                pressed && { opacity: 0.6 },
              ]}
            >
              <View style={[s.chipPonto, { backgroundColor: COR[a][0] }]} />
              <Text style={s.chipTexto}>{rotulo(a)}</Text>
              <Text style={[s.chipValor, { color: v ? COR[a][0] : TINTA_FRACA }]}>{v ? v.pct : '—'}</Text>
              <Text style={s.chipSeta}>›</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

/**
 * A CURVA da ativação — uma linha por área, 45 dias.
 *
 * ⚠️ A linha do MEIO (50) é o "nada acontecendo", e ela é desenhada cheia
 * enquanto as outras são tracejadas: sem essa âncora, subir e descer não
 * significa nada, porque não há de onde subir.
 */
function CurvaDaAtivacao({
  curva, largura, rotulo, areasComVinculo,
}: {
  curva: Array<{ dia: string; areas: Partial<Record<AreaSinastria, number>> }>
  largura: number
  rotulo: (a: AreaSinastria) => string
  areasComVinculo: AreaSinastria[]
}) {
  const [so, setSo] = useState<AreaSinastria | null>(null)
  if (!curva.length || !areasComVinculo.length) return null

  const alt = 180
  const padL = 26
  const padR = 10
  const padT = 10
  const padB = 22
  const w = largura
  const plotW = w - padL - padR
  const plotH = alt - padT - padB

  const x = (idx: number) => padL + (plotW * idx) / Math.max(1, curva.length - 1)
  const y = (v: number) => padT + plotH * (1 - Math.max(0, Math.min(100, v)) / 100)

  const caminho = (a: AreaSinastria) => {
    const pts = curva.map((p, idx) => ({ idx, v: p.areas[a] })).filter((p) => p.v != null)
    if (!pts.length) return ''
    return pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.idx).toFixed(1)},${y(p.v!).toFixed(1)}`).join(' ')
  }

  const mostrar = so ? [so] : areasComVinculo
  const primeiro = curva[0]?.dia?.slice(8, 10) + '/' + curva[0]?.dia?.slice(5, 7)
  const ultimo = curva[curva.length - 1]?.dia?.slice(8, 10) + '/' + curva[curva.length - 1]?.dia?.slice(5, 7)

  return (
    <View>
      <Svg width={w} height={alt}>
        {/* Grade leve: 25 / 50 / 75 */}
        {[25, 50, 75].map((g) => (
          <G key={`g-${g}`}>
            <Line
              x1={padL} y1={y(g)} x2={w - padR} y2={y(g)}
              stroke={g === 50 ? 'rgba(255,255,255,0.22)' : TRILHO}
              strokeWidth={g === 50 ? 1 : 0.8}
              strokeDasharray={g === 50 ? undefined : '3 6'}
            />
            <SvgText x={4} y={y(g) + 4} fontSize="9" fill={TINTA_FRACA}>{String(g)}</SvgText>
          </G>
        ))}

        {mostrar.map((a) => {
          const d = caminho(a)
          if (!d) return null
          return (
            <Path
              key={`c-${a}`}
              d={d}
              stroke={COR[a][0]}
              strokeWidth={so ? 2.6 : 1.8}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={so ? 1 : 0.9}
            />
          )
        })}

        {/* O ponto de HOJE, marcado — é onde a pessoa está. */}
        {mostrar.map((a) => {
          const v = curva[0]?.areas[a]
          if (v == null) return null
          return <Circle key={`h-${a}`} cx={x(0)} cy={y(v)} r={3.5} fill={COR[a][0]} stroke="#0F1426" strokeWidth={1} />
        })}

        <SvgText x={padL} y={alt - 6} fontSize="10" fill={TINTA_FRACA}>{primeiro}</SvgText>
        <SvgText x={w - padR} y={alt - 6} fontSize="10" fill={TINTA_FRACA} textAnchor="end">{ultimo}</SvgText>
      </Svg>

      <View style={s.legenda}>
        {areasComVinculo.map((a) => (
          <Pressable
            key={`l-${a}`}
            onPress={() => setSo(so === a ? null : a)}
            accessibilityRole="button"
            accessibilityLabel={rotulo(a)}
            style={({ pressed }) => [s.legItem, pressed && { opacity: 0.6 }, so === a && s.legItemAtivo]}
          >
            <View style={[s.legTraco, { backgroundColor: COR[a][0], opacity: so && so !== a ? 0.35 : 1 }]} />
            <Text style={[s.legTexto, so && so !== a && { opacity: 0.45 }]}>{rotulo(a)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

/**
 * A PREVISÃO DIA A DIA — a mesma série da curva, lida data por data.
 *
 * ⚠️ O GRÁFICO NÃO RESPONDE "E NA TERÇA?". Ele mostra a forma — quando sobe,
 * quando cai — e isso é o que serve para enxergar um período. Mas quem quer
 * saber de um dia específico tem de ler um pixel numa linha, e não dá. Aqui
 * cada dia é uma linha com o número de cada área e o trânsito que puxa.
 *
 * ⚠️ O NÚMERO AQUI É ATIVAÇÃO, NÃO O VÍNCULO. 50 é "o céu não está mexendo
 * nisto"; acima, está acendendo o que há de bom; abaixo, o que pesa. O vínculo
 * — quanto os dois têm em cada área — é o da teia, e não muda de um dia para
 * o outro. Misturar os dois faria a pessoa achar que a relação mudou quando
 * mudou só o céu.
 */
function ListaPorDia({
  curva, areas, rotulo, idioma, tl, todos, verTodos,
}: {
  curva: ReadonlyArray<PontoDaCurva>
  areas: ReadonlyArray<AreaSinastria>
  rotulo: (a: AreaSinastria) => string
  idioma: string
  tl: (pt: string, en: string, es: string, it: string) => string
  todos: boolean
  verTodos: () => void
}) {
  // ⚠️ CATORZE DIAS DE ENTRADA. Quarenta e seis linhas de cara viram parede —
  // a pessoa rola sem ler. Duas semanas é o horizonte em que um "e na terça?"
  // ainda faz sentido; o resto fica a um toque.
  const PRIMEIROS = 14
  const visiveis = todos ? curva : curva.slice(0, PRIMEIROS)
  const restantes = curva.length - visiveis.length

  const diaCurto = (iso: string) => {
    const [, m, d] = iso.split('-')
    return `${d}/${m}`
  }
  const nomeDoDia = (iso: string) => {
    // ⚠️ `new Date('AAAA-MM-DD')` é lido como UTC; às 21h em Brasília isso
    // devolve o dia seguinte. O `T12:00` põe o instante no meio do dia, longe
    // de qualquer borda de fuso.
    const d = new Date(`${iso}T12:00:00`)
    const curtos = {
      'pt-BR': ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      es: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
      it: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
    }
    const k = idioma.startsWith('en') ? 'en' : idioma.startsWith('es') ? 'es' : idioma.startsWith('it') ? 'it' : 'pt-BR'
    return curtos[k as keyof typeof curtos][d.getDay()]
  }
  const hojeISO = new Date().toISOString().slice(0, 10)

  return (
    <View style={{ marginTop: 10 }}>
      <View style={s.diaCabecalho}>
        <Text style={s.diaCabData}>{tl('Dia', 'Day', 'Dia', 'Giorno')}</Text>
        {areas.map((a) => (
          <Text key={`cab-${a}`} style={[s.diaCabArea, { color: COR[a][0] }]} numberOfLines={1}>
            {/* Só a inicial: cinco rótulos inteiros não cabem na linha, e a
                cor já diz qual é — a mesma da teia e da curva. */}
            {rotulo(a).slice(0, 3)}
          </Text>
        ))}
      </View>

      {visiveis.map((ponto) => {
        const eHoje = ponto.dia === hojeISO
        return (
          <View key={ponto.dia} style={[s.diaLinha, eHoje && s.diaLinhaHoje]}>
            <View style={s.diaData}>
              <Text style={[s.diaDataTexto, eHoje && s.diaDataHoje]}>{diaCurto(ponto.dia)}</Text>
              <Text style={s.diaSemana}>{eHoje ? tl('hoje', 'today', 'hoy', 'oggi') : nomeDoDia(ponto.dia)}</Text>
            </View>

            {areas.map((a) => {
              const v = ponto.areas[a]
              // ⚠️ 50 É O NEUTRO, e ele não deve chamar atenção: o dia em que
              // o céu não mexe em nada é a maioria dos dias. Só o que foge do
              // meio ganha cor, senão a lista inteira pisca e nada se destaca.
              const cor = v == null ? TINTA_FRACA : v >= 60 ? '#34D399' : v <= 40 ? '#F87171' : TINTA_FRACA
              return (
                <Text key={`${ponto.dia}-${a}`} style={[s.diaValor, { color: cor }]}>
                  {v == null ? '—' : v}
                </Text>
              )
            })}
          </View>
        )
      })}

      {/* O que puxa o dia de hoje fica nomeado embaixo: na linha não cabe, e
          repetir o trânsito em todas as linhas viraria ruído. */}
      {visiveis[0]?.principal ? (
        <Text style={s.diaPrincipal}>
          {tl('Hoje quem puxa é ', 'Today it is driven by ', 'Hoy lo mueve ', 'Oggi lo muove ')}
          <Text style={s.diaPrincipalForte}>
            {`${translatePlanet(visiveis[0].principal!.planeta, idioma as any)} ${visiveis[0].principal!.aspecto}`}
          </Text>
        </Text>
      ) : null}

      {restantes > 0 ? (
        <Pressable onPress={verTodos} accessibilityRole="button" style={({ pressed }) => [s.verTodos, pressed && { opacity: 0.6 }]}>
          <Text style={s.verTodosTexto}>
            {tl(
              `Ver os ${curva.length} dias`,
              `See all ${curva.length} days`,
              `Ver los ${curva.length} dias`,
              `Vedi tutti i ${curva.length} giorni`,
            )}
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

/** O detalhe de uma área: o que ela mede, e de quais aspectos ela vem. */
function DetalheDaArea({
  area, score, hoje, rotulo, verbete, idioma, tl, aoFechar,
}: {
  area: AreaSinastria
  score: ScoreDeArea
  hoje: number | null
  rotulo: string
  verbete: string
  idioma: string
  tl: (pt: string, en: string, es: string, it: string) => string
  aoFechar: () => void
}) {
  const [escuro] = COR[area]
  return (
    <Modal visible transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={s.modalFundo} onPress={aoFechar}>
        <Pressable style={s.caixa} onPress={() => {}}>
          <View style={s.caixaTopo}>
            <Text style={[s.caixaTitulo, { color: escuro }]}>{rotulo}</Text>
            <Text style={[s.caixaValor, { color: escuro }]}>{score.pct}</Text>
          </View>

          <Text style={s.verbete}>{verbete}</Text>

          {/* ⚠️ O número de HOJE é OUTRA medida — o vínculo é fixo, a ativação
              varia. Por isso ele vem rotulado, e não encostado no de cima. */}
          {hoje != null ? (
            <View style={s.hojeLinha}>
              <Text style={s.hojeRotulo}>
                {tl('O céu hoje, aqui', 'The sky today, here', 'El cielo hoy, aqui', 'Il cielo oggi, qui')}
              </Text>
              <Text style={[s.hojeValor, { color: hoje >= 55 ? '#34D399' : hoje <= 45 ? '#F87171' : TINTA }]}>
                {hoje}
              </Text>
            </View>
          ) : null}

          <Text style={s.secaoDetalhe}>
            {tl('De onde vem', 'Where it comes from', 'De donde viene', 'Da dove viene')}
            <Text style={s.contagem}>
              {`   ${score.harmonicos} ${tl('fluem', 'flow', 'fluyen', 'scorrono')} · ${score.tensos} ${tl('atritam', 'grind', 'rozan', 'attritano')}`}
            </Text>
          </Text>

          <ScrollView style={{ maxHeight: 220 }}>
            {score.porque.map((p, k) => (
              <View key={`${p.mine}-${p.theirs}-${k}`} style={s.aspLinha}>
                <View style={[s.aspPonto, {
                  backgroundColor: p.tone === 'harmonioso' ? '#4ECDC4' : p.tone === 'tenso' ? '#FF6B6B' : '#B39DDB',
                }]} />
                <Text style={s.aspTexto} numberOfLines={1}>
                  {`${translatePlanet(p.mine, idioma as any)} · ${p.aspect} · ${translatePlanet(p.theirs, idioma as any)}`}
                </Text>
                <Text style={s.aspOrbe}>{`${p.orb.toFixed(1)}°`}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable onPress={aoFechar} accessibilityRole="button" hitSlop={10} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={s.fecharTexto}>{tl('Tocar para fechar', 'Tap to close', 'Toca para cerrar', 'Tocca per chiudere')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.72)', justifyContent: 'flex-end' },
  folha: {
    backgroundColor: '#11162A', borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, maxHeight: '92%',
  },
  puxador: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', marginBottom: 12 },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  titulo: { color: '#F2F5FF', fontSize: 21, fontWeight: '800' },
  subtitulo: { color: TINTA_FRACA, fontSize: 14, marginTop: 2 },
  fechar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.07)' },
  fecharX: { color: TINTA, fontSize: 16, fontWeight: '700' },

  secao: { color: '#E8ECF7', fontSize: 16, fontWeight: '700' },
  secaoNota: { color: TINTA_FRACA, fontSize: 14, marginTop: 3, marginBottom: 12, lineHeight: 20 },
  vazio: { color: TINTA, fontSize: 15, lineHeight: 22, paddingVertical: 24, textAlign: 'center' },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 11, borderRadius: 14, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipPonto: { width: 7, height: 7, borderRadius: 4 },
  chipTexto: { color: TINTA, fontSize: 14 },
  chipValor: { fontSize: 14, fontWeight: '700' },
  chipSeta: { color: TINTA_FRACA, fontSize: 15, marginLeft: -1 },
  chipsDica: { color: TINTA_FRACA, fontSize: 12, textAlign: 'center', marginTop: 12 },

  alternador: { flexDirection: 'row', alignSelf: 'center', gap: 4, marginTop: 14, marginBottom: 4, padding: 3, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.06)' },
  alternadorBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 9 },
  alternadorAtivo: { backgroundColor: 'rgba(167,139,250,0.22)' },
  alternadorTexto: { color: TINTA_FRACA, fontSize: 13, fontWeight: '600' },
  alternadorTextoAtivo: { color: '#DDD6FE' },

  diaCabecalho: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingBottom: 6 },
  diaCabData: { width: 58, color: TINTA_FRACA, fontSize: 11 },
  diaCabArea: { flex: 1, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  diaLinha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 4, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  diaLinhaHoje: { backgroundColor: 'rgba(167,139,250,0.10)', borderRadius: 8 },
  diaData: { width: 58 },
  diaDataTexto: { color: TINTA, fontSize: 13, fontWeight: '600' },
  diaDataHoje: { color: '#DDD6FE' },
  diaSemana: { color: TINTA_FRACA, fontSize: 10 },
  diaValor: { flex: 1, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  diaPrincipal: { color: TINTA_FRACA, fontSize: 12, marginTop: 10, textAlign: 'center' },
  diaPrincipalForte: { color: TINTA, fontWeight: '600' },
  verTodos: { alignSelf: 'center', marginTop: 12, paddingVertical: 9, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(167,139,250,0.35)' },
  verTodosTexto: { color: '#DDD6FE', fontSize: 13, fontWeight: '600' },

  legenda: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, justifyContent: 'center' },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3, paddingHorizontal: 6, borderRadius: 10 },
  legItemAtivo: { backgroundColor: 'rgba(255,255,255,0.07)' },
  legTraco: { width: 14, height: 2.5, borderRadius: 2 },
  legTexto: { color: TINTA, fontSize: 14 },

  aviso: { color: TINTA_FRACA, fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18 },

  modalFundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.86)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  caixa: { width: '100%', maxWidth: 420, backgroundColor: '#161D33', borderRadius: 18, padding: 18 },
  caixaTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  caixaTitulo: { fontSize: 20, fontWeight: '800' },
  caixaValor: { fontSize: 26, fontWeight: '800' },
  verbete: { color: '#D7DEEF', fontSize: 15, lineHeight: 22, marginTop: 8 },
  hojeLinha: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 14, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2a3148',
  },
  hojeRotulo: { color: TINTA, fontSize: 14 },
  hojeValor: { fontSize: 18, fontWeight: '700' },
  secaoDetalhe: { color: TINTA_FRACA, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 16, marginBottom: 4 },
  contagem: { textTransform: 'none', letterSpacing: 0 },
  aspLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#232a40' },
  aspPonto: { width: 7, height: 7, borderRadius: 4 },
  aspTexto: { color: '#E8ECF7', fontSize: 14, flex: 1 },
  aspOrbe: { color: TINTA_FRACA, fontSize: 13 },
  fecharTexto: { color: '#6E7691', fontSize: 14, textAlign: 'center', marginTop: 14 },
})
