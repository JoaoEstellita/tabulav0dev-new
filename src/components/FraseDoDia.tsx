import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { getLifeAreaLabel } from '../constants/lifeAreas'
import { aspectNature } from '../utils/astro/pt'
import { palavraDeSentido } from '../utils/palavraDeSentido'

/**
 * A leitura do dia: o que fazer, não o que está no céu.
 *
 * Três versões ficaram pelo caminho e vale saber por quê. A primeira olhava duas
 * barras de área ("hoje o dinheiro pede cuidado") — dizia o óbvio sem explicar
 * de onde vinha. A segunda nomeava o aspecto ("Saturno com Sol") e tornava ESSE
 * nome tocável — mas quem não estuda astrologia não procura "Saturno com Sol";
 * procura o que fazer com o dia. A terceira acertou a palavra, mas tocar nela
 * ROLAVA a tela até a lista: tirava do lugar o texto que a pessoa estava lendo e
 * a largava num card que ela ainda não sabia ler.
 *
 * A quarta tentou o contrário: fazer de toda palavra-chave uma porta para o
 * trânsito dela. No aparelho ficou ruim — quatro sublinhados pontilhados num
 * parágrafo de cinco linhas leem como corretor ortográfico, não como link, e o
 * texto que devia ser a parte mais calma da tela virou a mais agitada.
 *
 * Então a frase voltou a ser só uma frase. Ela não precisa levar a lugar nenhum:
 * o caminho para a interpretação já existe e é melhor — a grade logo abaixo, e o
 * modal de cada planeta, que tem o link próprio para a lista.
 *
 * A síntese cruza duas fontes: os trânsitos (o que o céu move) e o status das
 * áreas (onde isso pega na vida). Nenhuma das duas sozinha dá um conselho — e o
 * resumo do status agora entra no texto, não só na escolha do foco.
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
}

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

function ePicoHoje(t: TransitoRico): boolean {
  const exato = t.window?.exact
  if (!exato) return false
  const d = new Date(exato)
  if (!Number.isFinite(d.getTime())) return false
  return d.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
}

export default function FraseDoDia({ transitos, areas }: Props) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const texto = useMemo<string | null>(() => {
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

    const narrativa = (t: TransitoRico) => buildUnifiedTransitNarrative(t as any, null, language)

    const ler = (t: TransitoRico) => {
      const n = narrativa(t)
      return {
        sentido: palavraDeSentido(n?.keywords || [], String(t.transitPlanet), String(t.natalPlanet), String(t.type)),
        acao: String(n?.actionText || '').trim(),
        curto: String(n?.shortText || '').trim(),
      }
    }

    const a = ler(principal)
    const b = contraponto ? ler(contraponto) : null

    // Monta a frase. `escrever` concatena; o que era âncora vira texto comum.
    let out = ''
    const escrever = (t: string) => { if (t) out += t }

    // 1) Abertura prática. O pico muda o tom porque muda o quanto se sente.
    escrever(ePicoHoje(principal)
      ? tl('Hoje chega no ponto: o dia pede ', 'It peaks today: the day asks for ', 'Hoy llega al punto: el dia pide ', 'Oggi arriva al punto: la giornata chiede ')
      : tl('O dia pede ', 'The day asks for ', 'El dia pide ', 'La giornata chiede '))
    escrever(a.sentido || tl('atenção', 'attention', 'atencion', 'attenzione'))

    // 2) Onde pega — pelas áreas do próprio trânsito.
    const doTransito = areaLabelsForTransit(principal.transitPlanet, principal.natalPlanet, principal.house)
    if (doTransito.length) {
      const foco = doTransito.slice(0, 2)
      escrever(tl(
        ` — principalmente em ${foco.join(' e ')}.`,
        ` — mostly in ${foco.join(' and ')}.`,
        ` — sobre todo en ${foco.join(' y ')}.`,
        ` — soprattutto in ${foco.join(' e ')}.`,
      ))
    } else escrever('.')

    // 3) O resumo do status, com as duas pontas tocáveis.
    //
    // O status é a outra metade da leitura: diz onde a pessoa está hoje, não só
    // o que o céu faz. Antes ele só escolhia o foco quando o trânsito não dizia
    // nada — ficava invisível para quem lê. Agora é dito.
    const porStatus = (areas || [])
      .map(([chave, v]) => ({
        chave: String(chave),
        pct: typeof v?.percentage === 'number' ? v.percentage : (typeof v?.status === 'number' ? v.status : NaN),
      }))
      .filter((x) => Number.isFinite(x.pct))
      .sort((x, y) => x.pct - y.pct)

    if (porStatus.length >= 2) {
      const pior = porStatus[0]
      const melhor = porStatus[porStatus.length - 1]
      escrever(tl(
        ' Nos seus números de hoje, quem mais pede cuidado é ',
        ' In your numbers today, the one asking for most care is ',
        ' En tus numeros de hoy, quien mas pide cuidado es ',
        ' Nei tuoi numeri di oggi, chi chiede piu cura e ',
      ))
      escrever(getLifeAreaLabel(pior.chave))
      escrever(tl(', e onde há folga é ', ', and where there is room is ', ', y donde hay holgura es ', ', e dove c e respiro e '))
      escrever(getLifeAreaLabel(melhor.chave))
      escrever('.')
    }

    // 4) O contraponto, com a própria âncora.
    if (b && contraponto) {
      escrever(natureza === 'desafiador'
        ? tl(' Em compensação, há ', ' In return, there is ', ' En compensacion, hay ', ' In compenso, c e ')
        : tl(' Fique de olho em ', ' Keep an eye on ', ' Mantente atento a ', ' Tieni d occhio '))
      escrever(b.sentido || tl('abertura', 'an opening', 'apertura', 'apertura'))
      escrever(tl(' para apoiar o que pesa.', ' to lean on.', ' para apoyar lo que pesa.', ' su cui appoggiarsi.'))
    }

    // 5) O que fazer — sem isto a frase descreve e não serve para nada.
    if (a.acao) escrever(` ${a.acao}`)
    else if (a.curto) escrever(` ${a.curto.replace(/\s+/g, ' ')}`)

    return out.trim() || null
  }, [transitos, areas, language])

  if (!texto) return null

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>
      <Text style={s.texto}>{texto}</Text>
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
})
