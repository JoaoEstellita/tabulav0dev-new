import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'

/**
 * "Parte do conteúdo não carregou" — dito, em vez de deixado em branco.
 *
 * O defeito que isto fecha: quando o motor local falha mas o backend
 * respondeu, a tela NÃO quebra e NÃO mostra erro. O que o usuário vê é a
 * grade de aspectos, as interpretações e a tabela de trânsitos simplesmente
 * ausentes — seções mudas que parecem defeito aleatório, ou pior, parecem que
 * o mapa dele não tem nada.
 *
 * O hook já marcava `engineFailed` e já mandava para o Sentry com contexto.
 * Faltava a outra metade: ninguém mostrava. O diagnóstico melhorou e a
 * experiência continuou a mesma.
 *
 * Discreto de propósito. Não é erro fatal — o resto da tela está correto e é
 * utilizável. É um aviso honesto com um caminho de saída, não um alarme.
 */

interface Props {
  /** Só aparece quando true. */
  visivel: boolean
  /** Tenta carregar de novo. */
  onTentarNovamente?: () => void
  /** Desabilita o botão enquanto recarrega. */
  carregando?: boolean
}

export default function AvisoConteudoIncompleto({ visivel, onTentarNovamente, carregando }: Props) {
  const { language } = useAppLanguage()
  if (!visivel) return null

  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  return (
    <View style={s.caixa}>
      <Ionicons name="cloud-offline-outline" size={18} color="#fbbf24" />
      <View style={s.texto}>
        <Text style={s.titulo}>
          {tl(
            'Parte do conteúdo não carregou',
            'Some content did not load',
            'Parte del contenido no cargo',
            'Parte del contenuto non si e caricata',
          )}
        </Text>
        {/* Diz o QUE falta, para a ausência deixar de parecer defeito do mapa. */}
        <Text style={s.corpo}>
          {tl(
            'A grade de aspectos e as interpretações dependem de um cálculo que falhou agora. O resto da tela está correto.',
            'The aspect grid and the readings depend on a calculation that just failed. The rest of the screen is correct.',
            'La cuadricula de aspectos y las lecturas dependen de un calculo que fallo ahora. El resto de la pantalla esta correcto.',
            'La griglia degli aspetti e le letture dipendono da un calcolo che e fallito ora. Il resto della schermata e corretto.',
          )}
        </Text>
      </View>

      {onTentarNovamente ? (
        <Pressable onPress={onTentarNovamente} disabled={carregando} style={s.botao} accessibilityRole="button">
          {carregando ? (
            <ActivityIndicator size="small" color="#fbbf24" />
          ) : (
            <Text style={s.botaoTexto}>{tl('Tentar', 'Retry', 'Reintentar', 'Riprova')}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    backgroundColor: 'rgba(251,191,36,0.07)',
  },
  texto: { flex: 1 },
  titulo: { color: '#fbbf24', fontSize: 14.5, fontWeight: '700' },
  corpo: { color: '#c9cfe2', fontSize: 14, lineHeight: 20, marginTop: 2 },
  botao: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.4)',
    minWidth: 62,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fbbf24', fontSize: 14, fontWeight: '700' },
})
