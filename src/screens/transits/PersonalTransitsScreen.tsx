import React, { useMemo, useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useRoute, useNavigation } from '@react-navigation/native'
import { LocalAstrologyService, type LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { getTransitState, formatPeakETA, aspectNature, windowsIntersect } from '../../utils/astro/pt'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { buildTransitTitle } from '../../utils/transitPresentation'
import { buildUnifiedTransitNarrative } from '../../utils/astroInterpretation'
import TransitInsightCard from '../../components/TransitInsightCard'
import { groupTransits } from '../../utils/transitGrouping'
import { TRANSIT_TITLES_PTBR, buildFallbackTransitTitle } from '../../data/transitTitlesPtBR'
import { areaLabelsForTransit } from '../../utils/transitLifeAreas'
import { PROGRESSION_ASPECTS_PTBR, buildProgressionText } from '../../data/progressionAspectsPtBR'
import ScrollTopButton, { SCROLL_TOP_THRESHOLD } from '../../components/ScrollTopButton'
import { computeProgressedPositions, computeProgressedAspects, computeProgressedMoonWindows, type ProgressedAspect, type ProgressedWindow } from '../../astro/progressions'
import { translatePlanet } from '../../utils/astro/pt'
import { useAuth } from '../../hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export default function PersonalTransitsScreen({ embedded = false, highlightId = null }: { embedded?: boolean; highlightId?: string | null } = {}) {
  const { t, language } = useAppLanguage()
  const route = useRoute()
  const navigation = useNavigation()
  // Trânsitos de OUTRA pessoa (amigo no grupo): vem por route.params.member. Sem
  // isso, é o próprio usuário (useLifeAreas).
  const member = (route.params as any)?.member as
    | { displayName?: string; birthData?: { datetime?: string; coordinates?: { latitude: number; longitude: number } } }
    | undefined
  const { transitData: ownTransit } = useLifeAreas()
  const [friendTransit, setFriendTransit] = useState<LocalTransitData | null>(null)
  useEffect(() => {
    if (!member?.birthData) { setFriendTransit(null); return }
    let cancel = false
    const bd = LocalAstrologyService.birthDataFromShared(member.birthData)
    if (bd) LocalAstrologyService.computeChartNoCache(bd).then((d) => { if (!cancel) setFriendTransit(d) }).catch(() => {})
    return () => { cancel = true }
  }, [member?.birthData?.datetime])
  const transitData = member ? friendTransit : ownTransit
  // Título com o nome do amigo quando é a carta de outra pessoa.
  useEffect(() => {
    if (embedded) return // embutido em outra tela (ex.: Mapa do membro) — não mexe no header
    const first = member?.displayName ? String(member.displayName).split(' ')[0] : ''
    if (!first) return
    const byLang: Record<string, string> = {
      'en-US': `${first}'s transits`, 'es-ES': `Tránsitos de ${first}`, 'it-IT': `Transiti di ${first}`,
    }
    ;(navigation as any).setOptions?.({ title: byLang[language] || `Trânsitos de ${first}` })
  }, [member?.displayName, language])
  // Cada tarja controla o próprio toggle — numa lista de leitura, limitar a um
  // card aberto por vez atrapalharia comparar trânsitos.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  // Formata a janela de uma progressão: "Ativo dd/mm → dd/mm/aaaa · ~N meses · fase".
  const dm = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  }
  const dmy = (iso: string) => `${dm(iso)}/${new Date(iso).getUTCFullYear()}`
  const faseLabel = (ph: ProgressedWindow['phase']) =>
    ph === 'aplicando' ? tl('aplicando', 'applying', 'aplicando', 'in avvicinamento')
      : ph === 'exato' ? tl('exato', 'exact', 'exacto', 'esatto')
        : tl('separando', 'separating', 'separando', 'in separazione')
  const janelaLabel = (w: ProgressedWindow) =>
    `${tl('Ativo', 'Active', 'Activo', 'Attivo')} ${dm(w.start)} → ${dmy(w.end)} · ~${Math.max(1, Math.round(w.months))} ${tl('meses', 'months', 'meses', 'mesi')} · ${faseLabel(w.phase)}`

  const personalRaw = transitData?.dailyOverview?.personalTodayRich || []
  const collective = useMemo(
    () => (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2),
    [transitData?.dailyOverview?.collectiveKeyAspectsRich],
  )

  const list = useMemo(() => {
    const seen = new Set<string>()
    const deduped = personalRaw.filter((item: any) => {
      const key = `${item.natalPlanet}|${item.type}|${item.transitPlanet}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    // Ordena por importância (força do trânsito) desc; desempate pela data do pico.
    return deduped.slice().sort((a: any, b: any) => {
      const as = typeof a?.strength === 'number' ? a.strength : 0
      const bs = typeof b?.strength === 'number' ? b.strength : 0
      if (bs !== as) return bs - as
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })
  }, [personalRaw])

  // Chaves do catálogo são minúsculas e sem acento.
  const norm = (v: any) => String(v || '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')

  const grupos = useMemo(() => groupTransits(list), [list])

  // Navegação por seção + voltar ao topo (mesma abordagem do Cosmos: measureLayout
  // contra o ScrollView, que funciona no nativo também).
  const scrollRef = React.useRef<ScrollView>(null)
  const ancoras = React.useRef<Record<string, any>>({})
  const [showTop, setShowTop] = useState(false)
  const irPara = (chave: string) => {
    const node = ancoras.current[chave]
    const scroll = scrollRef.current as any
    if (!node || !scroll) return
    try {
      const alvo = scroll.getScrollableNode ? scroll.getScrollableNode() : scroll
      node.measureLayout(alvo, (_x: number, y: number) => scroll.scrollTo({ y: Math.max(0, y - 12), animated: true }), () => { })
    } catch { }
  }

  // Progressões secundárias ("um dia por ano"): mapa simbólico do amadurecimento
  // interno, diferente do trânsito (que é o céu real de hoje). Precisa dos dados
  // de nascimento, que não vêm no transitData.
  const { user } = useAuth()
  const [progressoes, setProgressoes] = useState<ProgressedAspect[]>([])
  const [janelas, setJanelas] = useState<Record<number, ProgressedWindow>>({})
  useEffect(() => {
    let cancelado = false
    const rodar = async () => {
      const natais = transitData?.currentTransits?.natalPlanets
      if (!Array.isArray(natais) || natais.length === 0) return
      try {
        // Dados de nascimento: do amigo (route.params.member) ou do usuário logado.
        let birthData: { datetime: string; coordinates: { latitude: number; longitude: number } } | null = null
        if (member?.birthData?.datetime && member?.birthData?.coordinates) {
          birthData = { datetime: member.birthData.datetime, coordinates: member.birthData.coordinates }
        } else if (user?.uid) {
          const snap = await getDoc(doc(db, 'users', user.uid))
          const u: any = snap.data() || {}
          const lat = u?.birthLocation?.latitude
          const lon = u?.birthLocation?.longitude
          if (!u.birthDate || !Number.isFinite(lat) || !Number.isFinite(lon)) return
          birthData = {
            datetime: `${u.birthDate}T${u.birthTime || '12:00'}:00`,
            coordinates: { latitude: lat, longitude: lon },
          }
        }
        if (!birthData) return
        const prog = await computeProgressedPositions(birthData)
        if (cancelado || !prog) return
        const aspects = computeProgressedAspects(prog, natais)
        setProgressoes(aspects)
        // Janela real (início/exato/fim/fase) de cada progressão da Lua.
        const w = await computeProgressedMoonWindows(birthData, prog, natais, aspects)
        if (!cancelado) setJanelas(w)
      } catch { /* sem progressões, a seção some */ }
    }
    rodar()
    return () => { cancelado = true }
  }, [user?.uid, transitData?.currentTransits?.natalPlanets, member?.birthData?.datetime])

  const natureVisual = (nature: string) =>
    nature === 'harmonico'
      ? { color: '#16A34A', label: tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico') }
      : nature === 'desafiador'
        ? { color: '#DC2626', label: tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo') }
        : { color: '#D97706', label: tl('Neutro', 'Neutral', 'Neutro', 'Neutro') }

  // Um card por trânsito. Extraído para poder ser reusado nas 4 seções.
  const renderCard = (item: any, i: number, destaque = false) => {
    const key = `${item.transitPlanet}|${item.type}|${item.natalPlanet}|${i}`

    // transitPlanet PRIMEIRO: convenção do resto do app e da astrologia
    // ("Saturno quadratura Sol natal"). Esta tela vinha invertida.
    const title = buildTransitTitle(
      { transitPlanet: item.transitPlanet, aspectLabel: item.type, targetLabel: item.natalPlanet },
      language as any,
    )

    // Título temático ("Momento de ousadia") quando existe no catálogo; senão o
    // card segue mostrando o nome técnico, como antes. Cobertura parcial por design.
    const chave = `transit:${norm(item.transitPlanet)}|${norm(item.type)}|${norm(item.natalPlanet)}`
    // Curado primeiro; sem curadoria, o gerado — assim TODO card tem a mesma
    // anatomia (tema em cima, nome técnico no "Tipo:") e a lista para de alternar
    // entre título temático e nome cru.
    const tema =
      language === 'pt-BR'
        ? TRANSIT_TITLES_PTBR[chave] || buildFallbackTransitTitle(item.transitPlanet, item.natalPlanet, item.type) || undefined
        : undefined

    // Mesmo mapa que o motor usa para pontuar as áreas: o que o card anuncia é
    // o que de fato mexe no número da Home.
    const areas = language === 'pt-BR' ? areaLabelsForTransit(item.transitPlanet, item.natalPlanet, item.house) : []

    const narrative = buildUnifiedTransitNarrative(item, undefined, language)
    const nature = natureVisual(aspectNature(item.type))
    const timing = [getTransitState(item.window), formatPeakETA(item.window)].filter(Boolean).join(' · ')

    const hasSynergy = collective.some(
      (c: any) =>
        (c.planet1 === item.natalPlanet ||
          c.planet2 === item.natalPlanet ||
          c.planet1 === item.transitPlanet ||
          c.planet2 === item.transitPlanet) &&
        windowsIntersect(item.window as any, c.window as any),
    )

    // id estável (casa com o transitCellId da grade de aspectos) → âncora de scroll
    // e alvo do destaque quando o usuário toca a célula lá em cima.
    const cardId = `txr-${norm(item.transitPlanet)}-${norm(item.type)}-${norm(item.natalPlanet)}`
    const destacado = !!highlightId && highlightId === cardId

    return (
      <View key={key} nativeID={embedded ? cardId : undefined} style={[styles.cardWrap, destacado && styles.cardWrapHighlight]}>
        <TransitInsightCard
          statusLabel={nature.label}
          statusColor={nature.color}
          title={tema ? (hasSynergy ? `${tema}  ✦` : tema) : (hasSynergy ? `${title}  ✦` : title)}
          dense
          technicalTypeLabel={tema ? title : null}
          houseLabel={item.house ? String(item.house) : null}
          houseLabelPrefix={tl('Casa', 'House', 'Casa', 'Casa')}
          timingLabel={timing || null}
          // O impacto volta, mas como número na linha de meta — a barra custava
          // duas linhas para dizer o que a ordenação da lista já diz.
          impactValue01={Number.isFinite(Number(item.strength)) ? Number(item.strength) / 100 : null}
          areasLabel={areas.length ? areas.join(' · ') : null}
          areasLabelPrefix={tl('Afeta', 'Affects', 'Afecta', 'Tocca')}
          // Sem barra de impacto aqui: numa lista de leitura ela ocupa duas
          // linhas para dizer o que a ordenação já diz.
          // buildUnifiedTransitNarrative devolve shortText === modalBody (o mesmo
          // texto), então passar os dois duplicava a leitura no card.
          directText=""
          fullText={narrative.modalBody}
          fullTitle={tl('Leitura completa', 'Full reading', 'Lectura completa', 'Lettura completa')}
          actionText={narrative.actionText || null}
          metaText={narrative.metaText || null}
          fullExpanded={!!expanded[key]}
          onToggleFull={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
          detailMode="inline"
          tapWholeCard
          featured={destaque}
        />
      </View>
    )
  }

  const secao = (titulo: string, subtitulo: string, itens: any[], offset: number, chave?: string) =>
    itens.length ? (
      <View style={styles.section} ref={(n) => { if (chave) ancoras.current[chave] = n }}>
        <Text style={styles.sectionTitle}>{titulo}</Text>
        <Text style={styles.sectionSubtitle}>{subtitulo}</Text>
        {itens.map((item, i) => renderCard(item, offset + i))}
      </View>
    ) : null

  const conteudo = (
    <>
        {!embedded ? <Text style={styles.title}>{t('transits.personal.title')}</Text> : null}

        {!embedded && list.length ? (
          <View style={styles.navChips}>
            {[
              grupos.recent.length ? { k: 'recent', r: tl('Recentes', 'Recent', 'Recientes', 'Recenti') } : null,
              grupos.active.length ? { k: 'active', r: tl('Ativas', 'Active', 'Activas', 'Attive') } : null,
              grupos.longTerm.length ? { k: 'longTerm', r: tl('Longo prazo', 'Long-term', 'Largo plazo', 'Lungo periodo') } : null,
              progressoes.length ? { k: 'prog', r: tl('Progressões', 'Progressions', 'Progresiones', 'Progressioni') } : null,
            ].filter(Boolean).map((c: any) => (
              <TouchableOpacity key={c.k} style={styles.navChip} activeOpacity={0.8} onPress={() => irPara(c.k)}>
                <Text style={styles.navChipText}>{c.r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {list.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('transits.personal.empty')}</Text>
          </View>
        ) : (
          <>
            {grupos.highlight ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {tl('✦ O que mais pesa hoje', '✦ What weighs most today', '✦ Lo que mas pesa hoy', '✦ Cio che pesa di piu oggi')}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {tl('O trânsito mais forte do seu momento.', 'The strongest transit right now.', 'El transito mas fuerte de tu momento.', 'Il transito piu forte del tuo momento.')}
                </Text>
                {renderCard(grupos.highlight, 0, true)}
              </View>
            ) : null}

            {secao(
              tl('Mudanças recentes na vida', 'Recent changes', 'Cambios recientes', 'Cambiamenti recenti'),
              tl('Trânsitos que começaram nos últimos dias.', 'Transits that started in the last few days.', 'Transitos iniciados en los ultimos dias.', 'Transiti iniziati negli ultimi giorni.'),
              grupos.recent, 100, 'recent',
            )}

            {secao(
              tl('Tendências ainda ativas', 'Trends still active', 'Tendencias aun activas', 'Tendenze ancora attive'),
              tl('Você ainda pode usar essas tendências a seu favor.', 'You can still use these trends in your favor.', 'Aun puedes usar estas tendencias a tu favor.', 'Puoi ancora usare queste tendenze a tuo favore.'),
              grupos.active, 200, 'active',
            )}

            {secao(
              tl('Tendências de longo prazo', 'Long-term trends', 'Tendencias de largo plazo', 'Tendenze di lungo periodo'),
              tl('Mudanças que pedem mais tempo para serem vividas e assimiladas.', 'Changes that take longer to live through and absorb.', 'Cambios que piden mas tiempo para vivirse.', 'Cambiamenti che richiedono piu tempo.'),
              grupos.longTerm, 300, 'longTerm',
            )}

            {progressoes.length ? (
              <View style={styles.section} ref={(n) => { ancoras.current.prog = n }}>
                <Text style={styles.sectionTitle}>
                  {tl('Como você está vendo a vida', 'How you are seeing life', 'Como estas viendo la vida', 'Come stai vedendo la vita')}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {tl(
                    'A progressão funciona como um filtro que colore sua percepção de tudo o mais.',
                    'Progressions work as a filter coloring how you perceive everything else.',
                    'La progresion funciona como un filtro que colorea tu percepcion.',
                    'La progressione funziona come un filtro che colora la tua percezione.',
                  )}
                </Text>
                {progressoes.map((a, i) => {
                  const chaveProg = `prog:${norm(a.progressedPlanet)}|${norm(a.aspect)}|${norm(a.natalPlanet)}`
                  // Lua = catálogo curado; pessoais (Sol/Mercúrio/Vênus/Marte) = composer.
                  const texto = language === 'pt-BR'
                    ? (PROGRESSION_ASPECTS_PTBR[chaveProg] || buildProgressionText(a.progressedPlanet, a.aspect, a.natalPlanet) || undefined)
                    : undefined
                  return (
                  <View key={`prog-${i}`} style={styles.progItem}>
                  <View style={styles.progRow}>
                    <View style={[styles.progDot, {
                      backgroundColor: a.tone === 'harmonioso' ? '#4ECDC4' : a.tone === 'tenso' ? '#FF6B6B' : '#B39DDB',
                    }]} />
                    <Text style={styles.progText}>
                      {tl('Progredida', 'Progressed', 'Progresada', 'Progredita')} {translatePlanet(a.progressedPlanet, language)}
                      {' '}{a.symbol}{' '}
                      {translatePlanet(a.natalPlanet, language)} {tl('natal', 'natal', 'natal', 'natale')}
                    </Text>
                    <Text style={styles.progOrb}>{a.orb.toFixed(1)}°</Text>
                  </View>
                  {janelas[i] ? <Text style={styles.progWindow}>{janelaLabel(janelas[i])}</Text> : null}
                  {texto ? <Text style={styles.progText2}>{texto}</Text> : null}
                  </View>
                  )
                })}
              </View>
            ) : null}
          </>
        )}
    </>
  )

  if (embedded) return <View style={styles.embeddedWrap}>{conteudo}</View>

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={(e) => setShowTop(e.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD)}
      >
        {conteudo}
      </ScrollView>
      <ScrollTopButton
        visible={showTop}
        onPress={() => (scrollRef.current as any)?.scrollTo({ y: 0, animated: true })}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  embeddedWrap: { width: '100%' },
  scroll: { flex: 1, minHeight: 0 },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  cardWrap: { marginBottom: 12 },
  cardWrapHighlight: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#67E8F9',
    shadowColor: '#67E8F9',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  section: { marginBottom: 18 },
  progRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
  },
  progItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 8,
  },
  progText2: {
    color: '#C8CDE8',
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 16,
    marginTop: 2,
  },
  progWindow: {
    color: '#8890B5',
    fontSize: 11,
    marginLeft: 16,
    marginTop: 3,
  },
  navChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  navChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  navChipText: { color: '#FFD700', fontSize: 12, fontWeight: '600' },
  progDot: { width: 8, height: 8, borderRadius: 4 },
  progText: { color: '#E2E8F0', fontSize: 13, flex: 1 },
  progOrb: { color: '#8890B5', fontSize: 11 },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: '#8890B5',
    fontSize: 12,
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
})
