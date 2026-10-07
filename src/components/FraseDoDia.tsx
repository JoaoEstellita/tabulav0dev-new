import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { aspectNature, translatePlanetPT } from '../utils/astro/pt'

/**
 * A leitura do dia — a primeira coisa que a pessoa lê depois de ver a roda.
 *
 * A versão anterior olhava só duas barras de área ("hoje o dinheiro pede
 * cuidado") e dizia o óbvio sem explicar de onde vinha. Esta parte do céu real:
 * ordena TODOS os trânsitos do dia por força, escolhe o que manda, busca um
 * contraponto de natureza oposta e fecha com o que fazer a respeito.
 *
 * Os nomes dos trânsitos são tocáveis e levam ao mesmo lugar que a grade logo
 * abaixo — a frase deixa de ser um resumo paralelo e vira a porta de entrada
 * para o detalhe, que é o que justifica ela estar no topo.
 *
 * Fica em silêncio sem dado suficiente. Frase vaga ("hoje é um dia de
 * possibilidades") é pior que frase nenhuma: ocupa o lugar mais nobre da tela
 * sem dizer nada que a pessoa não soubesse antes de abrir o app.
 */

type TransitoRico = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  strength?: number
  house?: number | null
  window?: { start?: string; exact?: string; end?: string } | null
}

interface Props {
  /** `transitData.dailyOverview.personalTodayRich` — os trânsitos de hoje. */
  transitos?: TransitoRico[] | null
  /** Pares [chave, área] da Home, para nomear o que está a favor. */
  areas?: ReadonlyArray<readonly [string, any]>
  /** Recebe o id do trânsito tocado (mesmo formato da grade: `txr-...`). */
  onSelectTransit?: (cellId: string) => void
}

/** Mesma chave da grade de aspectos, para o toque cair no mesmo lugar. */
const norm = (s: string) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '')
const cellId = (t: TransitoRico) =>
  `txr-${norm(t.transitPlanet || '')}-${norm(t.type || '')}-${norm(t.natalPlanet || '')}`

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

/** Trânsito cujo pico cai HOJE — vale dizer, porque é quando mais se sente. */
function ePicoHoje(t: TransitoRico): boolean {
  const exato = t.window?.exact
  if (!exato) return false
  const d = new Date(exato)
  if (!Number.isFinite(d.getTime())) return false
  const hoje = new Date()
  return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10)
}

type Pedaco = { texto: string; transito?: TransitoRico }

export default function FraseDoDia({ transitos, areas, onSelectTransit }: Props) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const pedacos = useMemo<Pedaco[] | null>(() => {
    const lista = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
    if (!lista.length) return null

    const ordenados = [...lista].sort((a, b) => forca(b) - forca(a))
    const principal = ordenados[0]

    // O contraponto é de natureza OPOSTA à do principal. Um dia de pressão com um
    // apoio em algum lugar é mais verdadeiro — e mais útil — que uma lista dos
    // dois trânsitos mais fortes, que muitas vezes dizem a mesma coisa.
    const natPrincipal = aspectNature(String(principal.type))
    const oposta = natPrincipal === 'desafiador' ? 'harmonico' : 'desafiador'
    const contraponto = ordenados.slice(1).find((t) => aspectNature(String(t.type)) === oposta) || null

    const nomeTransito = (t: TransitoRico) => {
      const p = translatePlanetPT(String(t.transitPlanet))
      const n = translatePlanetPT(String(t.natalPlanet))
      const asp = buildUnifiedTransitNarrative(t as any, null, language)
      // `metaText` traz o aspecto já traduzido; o nome fica curto de propósito,
      // porque ele é o trecho tocável e precisa ser reconhecível de relance.
      return { titulo: `${p} com ${n}`, narrativa: asp }
    }

    const alvo = nomeTransito(principal)
    const areasTocadas = areaLabelsForTransit(principal.transitPlanet, principal.natalPlanet, principal.house)
      .slice(0, 2)

    const out: Pedaco[] = []

    // 1) O que manda hoje — e, se for o pico, isso vem junto porque muda o peso.
    out.push({ texto: ePicoHoje(principal)
      ? tl('Hoje o céu fecha em ', 'Today the sky closes on ', 'Hoy el cielo cierra en ', 'Oggi il cielo si chiude su ')
      : tl('Quem conduz o dia é ', 'Leading the day is ', 'Quien conduce el dia es ', 'A guidare la giornata e ') })
    out.push({ texto: alvo.titulo, transito: principal })

    // 2) A leitura curada — é o que explica, e vem do catálogo, não de template.
    const leitura = (alvo.narrativa?.shortText || '').trim()
    if (leitura) out.push({ texto: `: ${leitura.replace(/\s+/g, ' ')}` })
    else out.push({ texto: '.' })

    // 3) Onde isso pega. Duas áreas no máximo: a terceira já vira lista.
    if (areasTocadas.length) {
      out.push({ texto: tl(
        ` Pega mais em ${areasTocadas.join(' e ')}.`,
        ` It lands hardest on ${areasTocadas.join(' and ')}.`,
        ` Pega mas en ${areasTocadas.join(' y ')}.`,
        ` Tocca soprattutto ${areasTocadas.join(' e ')}.`,
      ) })
    }

    // 4) O contraponto — o que equilibra, também tocável.
    if (contraponto) {
      const c = nomeTransito(contraponto)
      out.push({ texto: natPrincipal === 'desafiador'
        ? tl(' Do outro lado, ', ' On the other side, ', ' Del otro lado, ', ' Dall altro lato, ')
        : tl(' Mas atenção a ', ' But watch ', ' Pero atencion a ', ' Ma attenzione a ') })
      out.push({ texto: c.titulo, transito: contraponto })
      const leituraC = (c.narrativa?.shortText || '').trim()
      out.push({ texto: leituraC ? `: ${leituraC.replace(/\s+/g, ' ')}` : '.' })
    }

    // 5) O que fazer. Sem isto a frase descreve e não serve para nada.
    const acao = (alvo.narrativa?.actionText || '').trim()
    if (acao) out.push({ texto: ` ${acao}` })

    return out
  }, [transitos, areas, language])

  if (!pedacos?.length) return null

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>
        {tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}
      </Text>
      <Text style={s.texto}>
        {pedacos.map((p, i) =>
          p.transito && onSelectTransit ? (
            <Text
              key={i}
              style={s.link}
              onPress={() => onSelectTransit(cellId(p.transito!))}
              suppressHighlighting
            >
              {p.texto}
            </Text>
          ) : (
            <Text key={i}>{p.texto}</Text>
          ),
        )}
      </Text>
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
  // Rótulo discreto: a frase é o conteúdo, não um card que precisa se anunciar.
  rotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  texto: { color: '#e6e9f0', fontSize: 15, lineHeight: 23 },
  // Mesmo dourado pontilhado do glossário: a pessoa já aprendeu que isso abre algo.
  link: {
    color: '#FFD700',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
})
