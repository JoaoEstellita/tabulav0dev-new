import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'

/**
 * Uma frase, no topo da Home, dizendo o que fazer hoje.
 *
 * A Home abre com Sol, Lua, Ascendente e oito áreas em porcentagem. Quem estuda
 * astrologia lê isso e sabe o que fazer. Quem chegou agora olha "Carreira 34%"
 * e não tira nada dali — falta a ponte entre o número e a vida.
 *
 * Nenhum cálculo novo: usa as mesmas áreas que os cards abaixo já mostram, só
 * traduz em conselho. Fica em silêncio quando não há dado suficiente, porque
 * frase vaga ("hoje é um dia de possibilidades") é pior que frase nenhuma.
 */

type Area = { name: string; percentage: number }

interface Props {
  /** Pares [chave, área] já ordenados — o mesmo `orderedLifeAreas` da Home. */
  areas: ReadonlyArray<readonly [string, any]>
}

const ROTULOS: Record<string, [string, string, string, string]> = {
  amor: ['o amor', 'love', 'el amor', 'l amore'],
  carreira: ['a carreira', 'your career', 'la carrera', 'la carriera'],
  financas: ['o dinheiro', 'money', 'el dinero', 'il denaro'],
  saude: ['a saúde', 'your health', 'la salud', 'la salute'],
  familia: ['a família', 'family', 'la familia', 'la famiglia'],
  espiritualidade: ['a vida interior', 'your inner life', 'la vida interior', 'la vita interiore'],
  comunicacao: ['as conversas', 'conversations', 'las conversaciones', 'le conversazioni'],
  transformacao: ['as mudanças', 'change', 'los cambios', 'i cambiamenti'],
  social: ['a vida social', 'social life', 'la vida social', 'la vita sociale'],
  trabalho: ['o trabalho', 'work', 'el trabajo', 'il lavoro'],
}

// Abaixo disto a área pede cuidado; acima, está a favor. Mesmos cortes que os
// cards usam, para a frase nunca contradizer a barra logo abaixo dela.
const PEDE_ATENCAO = 40
const ESTA_A_FAVOR = 65

export default function FraseDoDia({ areas }: Props) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const frase = useMemo(() => {
    const lista: Area[] = (areas || [])
      .map(([chave, a]) => ({
        name: String(chave),
        percentage: typeof a?.percentage === 'number' ? a.percentage : (typeof a?.status === 'number' ? a.status : NaN),
      }))
      .filter((a) => Number.isFinite(a.percentage) && ROTULOS[a.name])

    if (lista.length < 2) return null

    const ordenadas = [...lista].sort((a, b) => a.percentage - b.percentage)
    const menor = ordenadas[0]
    const maior = ordenadas[ordenadas.length - 1]

    const nome = (a: Area) => {
      const r = ROTULOS[a.name]
      return language === 'en-US' ? r[1] : language === 'es-ES' ? r[2] : language === 'it-IT' ? r[3] : r[0]
    }

    const temAtencao = menor.percentage < PEDE_ATENCAO
    const temFavor = maior.percentage >= ESTA_A_FAVOR

    if (temAtencao && temFavor) {
      return tl(
        `Hoje ${nome(menor)} pede mais cuidado, e ${nome(maior)} está a seu favor — bom dia para apoiar um no outro.`,
        `Today ${nome(menor)} asks for more care, and ${nome(maior)} is on your side — a good day to lean one on the other.`,
        `Hoy ${nome(menor)} pide mas cuidado, y ${nome(maior)} esta a tu favor — buen dia para apoyar uno en el otro.`,
        `Oggi ${nome(menor)} chiede piu attenzione, e ${nome(maior)} e a tuo favore — buon giorno per appoggiare l uno sull altro.`,
      )
    }
    if (temAtencao) {
      return tl(
        `Hoje ${nome(menor)} pede mais cuidado. Vá com calma por aí e deixe o resto fluir.`,
        `Today ${nome(menor)} asks for more care. Go gently there and let the rest flow.`,
        `Hoy ${nome(menor)} pide mas cuidado. Ve con calma por ahi y deja fluir lo demas.`,
        `Oggi ${nome(menor)} chiede piu attenzione. Vai con calma li e lascia scorrere il resto.`,
      )
    }
    if (temFavor) {
      return tl(
        `Hoje ${nome(maior)} está a seu favor. Se tem algo parado nessa área, é uma boa janela.`,
        `Today ${nome(maior)} is on your side. If something is stalled there, this is a good window.`,
        `Hoy ${nome(maior)} esta a tu favor. Si hay algo detenido en esa area, es una buena ventana.`,
        `Oggi ${nome(maior)} e a tuo favore. Se c e qualcosa di fermo in quell area, e una buona finestra.`,
      )
    }
    // Dia sem extremos: dizer isso é informação, não enrolação.
    return tl(
      'Hoje nenhuma área puxa muito para um lado. Dia bom para tocar o que já está em andamento.',
      'Today no area pulls strongly either way. A good day to carry on with what is already underway.',
      'Hoy ninguna area tira mucho hacia un lado. Buen dia para seguir con lo que ya esta en marcha.',
      'Oggi nessuna area tira molto da una parte. Buon giorno per portare avanti cio che e gia in corso.',
    )
  }, [areas, language])

  if (!frase) return null

  return (
    <View style={s.caixa}>
      <Text style={s.texto}>{frase}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  caixa: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,215,0,0.06)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  texto: { color: '#e6e9f0', fontSize: 14.5, lineHeight: 21 },
})
