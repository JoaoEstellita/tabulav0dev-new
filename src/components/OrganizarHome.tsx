import React from 'react'
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ORDEM_PADRAO, type BlocoDaHome } from '../hooks/useOrdemDaHome'

/**
 * A caixa de ORGANIZAR A HOME: subir e descer os blocos da tela.
 *
 * ⚠️ Setas, e não arrastar. Arrastar é mais bonito e exige uma biblioteca de
 * gesto que briga com o ScrollView da Home — o gesto de arrastar e o de rolar
 * são o mesmo movimento, e desambiguar os dois é uma fonte conhecida de tela
 * travada. Com três itens, duas setas resolvem em um toque o que o arrasto
 * resolveria em um arrasto.
 *
 * ⚠️ A seta da ponta fica DESABILITADA e visível, não escondida. Sumir com o
 * botão faz a lista "pular" a cada movimento e tira a referência de onde o
 * dedo estava.
 */

type Props = {
  visivel: boolean
  ordem: readonly BlocoDaHome[]
  aoMover: (bloco: BlocoDaHome, passo: -1 | 1) => void
  aoRestaurar: () => void
  aoFechar: () => void
  idioma?: string
}

/** [pt-BR, en-US, es-ES, it-IT] — nome e o que o bloco mostra. */
const NOMES: Record<BlocoDaHome, [string, string, string, string]> = {
  ceu: ['O céu de hoje', "Today's sky", 'El cielo de hoy', 'Il cielo di oggi'],
  status: ['As suas áreas', 'Your areas', 'Tus areas', 'Le tue aree'],
  emocoes: ['Tendência emocional', 'Emotional tendency', 'Tendencia emocional', 'Tendenza emotiva'],
}

const DETALHE: Record<BlocoDaHome, [string, string, string, string]> = {
  ceu: [
    'A roda natal e a grade de aspectos',
    'The natal wheel and the aspect grid',
    'La rueda natal y la rejilla de aspectos',
    'La ruota natale e la griglia degli aspetti',
  ],
  status: [
    'As oito áreas da vida, em roda ou em fichas',
    'The eight life areas, as a wheel or as cards',
    'Las ocho areas de la vida, en rueda o en fichas',
    'Le otto aree della vita, a ruota o a schede',
  ],
  emocoes: [
    'Os oito anéis de tendência do dia',
    "The day's eight tendency rings",
    'Los ocho anillos de tendencia del dia',
    'Gli otto anelli di tendenza del giorno',
  ],
}

export default function OrganizarHome({ visivel, ordem, aoMover, aoRestaurar, aoFechar, idioma }: Props) {
  const l = String(idioma || 'pt-BR')
  const tl = (pt: string, en: string, es: string, it: string) =>
    l.startsWith('en') ? en : l.startsWith('es') ? es : l.startsWith('it') ? it : pt

  const padrao =
    ordem.length === ORDEM_PADRAO.length && ordem.every((b, i) => b === ORDEM_PADRAO[i])

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={s.fundo} onPress={aoFechar}>
        <Pressable style={s.caixa} onPress={() => {}}>
          <Text style={s.titulo}>
            {tl('Organizar a tela', 'Arrange the screen', 'Organizar la pantalla', 'Organizza lo schermo')}
          </Text>
          <Text style={s.subtitulo}>
            {tl(
              '"O seu dia" fica sempre no topo — é a parte que responde sozinha.',
              '"Your day" always stays on top — it is the part that answers on its own.',
              '"Tu dia" queda siempre arriba: es la parte que responde sola.',
              '"Il tuo giorno" resta sempre in alto: e la parte che risponde da sola.',
            )}
          </Text>

          <View style={s.lista}>
            {ordem.map((bloco, i) => (
              <View key={bloco} style={s.linha}>
                <Text style={s.posicao}>{i + 1}</Text>
                <View style={s.textos}>
                  <Text style={s.nome}>{tl(...NOMES[bloco])}</Text>
                  <Text style={s.detalhe}>{tl(...DETALHE[bloco])}</Text>
                </View>
                <View style={s.setas}>
                  <Seta
                    nome="chevron-up"
                    desabilitada={i === 0}
                    aoTocar={() => aoMover(bloco, -1)}
                    rotulo={tl('Subir', 'Move up', 'Subir', 'Su')}
                  />
                  <Seta
                    nome="chevron-down"
                    desabilitada={i === ordem.length - 1}
                    aoTocar={() => aoMover(bloco, 1)}
                    rotulo={tl('Descer', 'Move down', 'Bajar', 'Giu')}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={s.rodape}>
            {/* Só aparece quando há o que restaurar: um botão permanentemente
                inerte vira ruído e ensina a ignorar aquele canto da caixa. */}
            {padrao ? (
              <View />
            ) : (
              <Pressable onPress={aoRestaurar} hitSlop={10}>
                <Text style={s.restaurar}>
                  {tl('Voltar ao padrão', 'Reset to default', 'Volver al estandar', 'Torna al predefinito')}
                </Text>
              </Pressable>
            )}
            <Pressable onPress={aoFechar} hitSlop={10} style={s.pronto}>
              <Text style={s.prontoTexto}>{tl('Pronto', 'Done', 'Listo', 'Fatto')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function Seta({
  nome,
  desabilitada,
  aoTocar,
  rotulo,
}: {
  nome: 'chevron-up' | 'chevron-down'
  desabilitada: boolean
  aoTocar: () => void
  rotulo: string
}) {
  return (
    <Pressable
      onPress={desabilitada ? undefined : aoTocar}
      disabled={desabilitada}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: desabilitada }}
      hitSlop={6}
      style={({ pressed }) => [
        s.seta,
        desabilitada && { opacity: 0.25 },
        pressed && !desabilitada && { backgroundColor: 'rgba(155,180,232,0.22)' },
      ]}
    >
      <Ionicons name={nome} size={18} color="#C7D2E8" />
    </Pressable>
  )
}

const s = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(5,7,18,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#13162B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242B40',
    padding: 18,
  },
  titulo: { fontSize: 17, fontWeight: '700', color: '#E8ECF5' },
  subtitulo: { fontSize: 14, color: '#8892a4', marginTop: 6, lineHeight: 19 },
  lista: { marginTop: 16, gap: 8 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#191D33',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#242B40',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  posicao: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5c6477',
    width: 16,
    textAlign: 'center',
  },
  textos: { flex: 1 },
  nome: { fontSize: 15, fontWeight: '600', color: '#E8ECF5' },
  detalhe: { fontSize: 14, color: '#8892a4', marginTop: 2, lineHeight: 18 },
  setas: { flexDirection: 'row', gap: 4 },
  // 36x36 mais hitSlop de 6 passa dos 44pt, que é o mínimo tocável.
  seta: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18,22,44,0.9)',
    borderWidth: 1,
    borderColor: '#2C3651',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  restaurar: { fontSize: 14, color: '#8892a4' },
  pronto: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(155,180,232,0.16)',
    borderWidth: 1,
    borderColor: '#2C3651',
  },
  prontoTexto: { fontSize: 15, fontWeight: '600', color: '#C7D2E8' },
})
