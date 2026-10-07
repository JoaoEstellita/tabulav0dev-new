import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { aspectNature } from '../utils/astro/pt'
import { transitCellId } from '../astro/transitCellId'
import { palavraDeSentido } from '../utils/palavraDeSentido'

/**
 * A leitura do dia: o que fazer, não o que está no céu.
 *
 * Duas versões ficaram pelo caminho e vale saber por quê. A primeira olhava duas
 * barras de área ("hoje o dinheiro pede cuidado") — dizia o óbvio sem explicar
 * de onde vinha. A segunda nomeava o aspecto ("Saturno com Sol") e tornava ESSE
 * nome tocável — mas quem não estuda astrologia não procura "Saturno com Sol";
 * procura o que fazer com o dia.
 *
 * Agora as âncoras tocáveis são palavras de SENTIDO — firmeza, abertura, revisão
 * — tiradas do arquétipo de cada trânsito. A pessoa lê um conselho em português
 * comum; quem quiser saber de onde ele saiu toca na palavra e cai no trânsito
 * que a gerou. O nome técnico fica disponível, nunca imposto.
 *
 * A síntese cruza duas fontes: os trânsitos (o que o céu move) e o status das
 * áreas (onde isso pega na vida). Nenhuma das duas sozinha dá um conselho.
 *
 * Fica em silêncio sem dado. Frase vaga ocupa o lugar mais nobre da tela sem
 * dizer nada que a pessoa não soubesse antes de abrir o app.
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
  transitos?: TransitoRico[] | null
  /** Pares [chave, área] — o status de hoje, que diz ONDE o trânsito pega. */
  areas?: ReadonlyArray<readonly [string, any]>
  onSelectTransit?: (cellId: string) => void
}

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

const idDe = (t: TransitoRico) =>
  transitCellId(String(t.transitPlanet || ''), String(t.type || ''), String(t.natalPlanet || ''))

function ePicoHoje(t: TransitoRico): boolean {
  const exato = t.window?.exact
  if (!exato) return false
  const d = new Date(exato)
  if (!Number.isFinite(d.getTime())) return false
  return d.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
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

    // Contraponto de natureza OPOSTA: um dia de pressão com um apoio em algum
    // lugar é mais verdadeiro — e mais útil — que os dois trânsitos mais fortes,
    // que em geral dizem a mesma coisa.
    const natureza = aspectNature(String(principal.type))
    const oposta = natureza === 'desafiador' ? 'harmonico' : 'desafiador'
    const contraponto = ordenados.slice(1).find((t) => aspectNature(String(t.type)) === oposta) || null

    const ler = (t: TransitoRico) => {
      const n = buildUnifiedTransitNarrative(t as any, null, language)
      return {
        sentido: palavraDeSentido(n?.keywords || [], String(t.transitPlanet), String(t.natalPlanet), String(t.type)),
        acao: String(n?.actionText || '').trim(),
        curto: String(n?.shortText || '').trim(),
      }
    }

    const a = ler(principal)
    const b = contraponto ? ler(contraponto) : null

    // Onde isso pega: as áreas do trânsito; se ele não disser nada, a área que o
    // status marca como mais mexida hoje. Cruzar as duas fontes é o que torna o
    // conselho específico em vez de genérico.
    const doTransito = areaLabelsForTransit(principal.transitPlanet, principal.natalPlanet, principal.house)
    const porStatus = (areas || [])
      .map(([chave, v]) => ({
        nome: String(chave),
        pct: typeof v?.percentage === 'number' ? v.percentage : (typeof v?.status === 'number' ? v.status : NaN),
      }))
      .filter((x) => Number.isFinite(x.pct))
      .sort((x, y) => x.pct - y.pct)
    const foco = doTransito.length ? doTransito.slice(0, 2) : (porStatus[0] ? [porStatus[0].nome] : [])

    const out: Pedaco[] = []
    const push = (texto: string, t?: TransitoRico) => { if (texto) out.push({ texto, transito: t }) }

    // 1) Abertura prática. O pico muda o tom porque muda o quanto se sente.
    push(ePicoHoje(principal)
      ? tl('Hoje chega no ponto: o dia pede ', 'It peaks today: the day asks for ', 'Hoy llega al punto: el dia pide ', 'Oggi arriva al punto: la giornata chiede ')
      : tl('O dia pede ', 'The day asks for ', 'El dia pide ', 'La giornata chiede '))
    push(a.sentido || tl('atenção', 'attention', 'atencion', 'attenzione'), principal)

    // 2) Onde pega.
    if (foco.length) {
      push(tl(
        ` — principalmente em ${foco.join(' e ')}.`,
        ` — mostly in ${foco.join(' and ')}.`,
        ` — sobre todo en ${foco.join(' y ')}.`,
        ` — soprattutto in ${foco.join(' e ')}.`,
      ))
    } else push('.')

    // 3) O contraponto, com a própria âncora.
    if (b && contraponto) {
      push(natureza === 'desafiador'
        ? tl(' Em compensação, há ', ' In return, there is ', ' En compensacion, hay ', ' In compenso, c e ')
        : tl(' Fique de olho em ', ' Keep an eye on ', ' Mantente atento a ', ' Tieni d occhio '))
      push(b.sentido || tl('abertura', 'an opening', 'apertura', 'apertura'), contraponto)
      push(tl(' para apoiar o que pesa.', ' to lean on.', ' para apoyar lo que pesa.', ' su cui appoggiarsi.'))
    }

    // 4) O que fazer — sem isto a frase descreve e não serve para nada.
    if (a.acao) push(` ${a.acao}`)
    else if (a.curto) push(` ${a.curto.replace(/\s+/g, ' ')}`)

    return out
  }, [transitos, areas, language])

  if (!pedacos?.length) return null

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>
      <Text style={s.texto}>
        {pedacos.map((p, i) =>
          p.transito && onSelectTransit ? (
            <Text key={i} style={s.link} onPress={() => onSelectTransit(idDe(p.transito!))} suppressHighlighting>
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
  rotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  texto: { color: '#edf0f6', fontSize: 16, lineHeight: 25 },
  // Mesmo dourado pontilhado do glossário: a pessoa já aprendeu que isso abre algo.
  link: {
    color: '#FFD700',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
})
