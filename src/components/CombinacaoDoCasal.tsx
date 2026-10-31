import React, { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polygon, Stop, Text as SvgText } from 'react-native-svg'
import { vinculoPorArea, AREAS_SINASTRIA, type AreaSinastria, type ScoreDeArea } from '../astro/sinastriaPorArea'
import { contatosComGrau, curvaDoVinculo, ativacaoNoInstante, paraEscalaAtivacao, DIAS_DA_CURVA } from '../astro/sinastriaAtivada'
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
 * ⚠️ O % GERAL DA DUPLA NÃO APARECE AQUI. Medido em 400 pares, ele dá 52/73/95
 * e um quarto dos pares bate no teto de 95 — porque soma 20+ aspectos por uma
 * curva calibrada para poucos. As áreas, com menos aspectos cada, ficam entre
 * 53 e 60 e não saturam. Pôr os dois lado a lado convidaria a uma comparação
 * entre escalas diferentes.
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

  const curva = useMemo(() => curvaDoVinculo(contatos), [contatos])

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

                <TeiaDoVinculo vinculo={vinculo!} largura={larguraUtil} rotulo={(a) => ROTULO[a][i]} aoTocar={setAberta} />

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

                    <CurvaDaAtivacao
                      curva={curva}
                      largura={larguraUtil}
                      rotulo={(a) => ROTULO[a][i]}
                      areasComVinculo={AREAS_SINASTRIA.filter((a) => vinculo![a])}
                    />
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
  vinculo, largura, rotulo, aoTocar,
}: {
  vinculo: Partial<Record<AreaSinastria, ScoreDeArea>>
  largura: number
  rotulo: (a: AreaSinastria) => string
  aoTocar: (a: AreaSinastria) => void
}) {
  const lado = Math.min(largura, 340)
  const cx = lado / 2
  const cy = lado / 2 + 6
  // Espaço para os rótulos sem encolher a teia a ponto de ela não se ler.
  const raio = lado * 0.32

  const areas = AREAS_SINASTRIA
  const ponto = (idx: number, valor: number) => {
    const ang = (Math.PI * 2 * idx) / areas.length - Math.PI / 2
    const r = raio * (Math.max(5, Math.min(95, valor)) / 100)
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) }
  }
  const pontoRotulo = (idx: number) => {
    const ang = (Math.PI * 2 * idx) / areas.length - Math.PI / 2
    const r = raio + 26
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
          return (
            <G key={`r-${a}`}>
              <SvgText x={p.x} y={p.y} fontSize="12" fill={TINTA} textAnchor={anchor as any}>
                {rotulo(a)}
              </SvgText>
              <SvgText x={p.x} y={p.y + 15} fontSize="13" fontWeight="700" fill={v ? COR[a][0] : TINTA_FRACA} textAnchor={anchor as any}>
                {v ? String(v.pct) : '—'}
              </SvgText>
            </G>
          )
        })}
      </Svg>

      {/* ⚠️ Os toques ficam FORA do SVG. Hit-test dentro de SVG no React Native
          já custou um toque sumido neste projeto, e aqui a área tocável tem de
          ser confortável — um vértice de 4px não é alvo. */}
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
