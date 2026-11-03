import React, { useEffect } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BlocoDoEstudo from '../../components/estudo/BlocoDoEstudo'
import { porId, type IdiomaEstudo, type Unidade } from '../../data/estudo'

/**
 * Uma unidade do Estudo em tela cheia — lição ou verbete.
 *
 * ⚠️ MARCA COMO LIDA AO ABRIR, não ao rolar até o fim. Detectar o fim da
 * rolagem erra para texto curto (que cabe na tela e nunca dispara o evento) e
 * para quem lê em duas sentadas. Abrir já é a intenção; cobrar a rolagem
 * transformaria a marca num troféu, e a trilha não é um jogo de completar.
 */
export default function LicaoScreen({
  unidade, idioma, aoFechar, aoAbrirOutra, marcarLido, tl,
}: {
  unidade: Unidade
  idioma: IdiomaEstudo
  aoFechar: () => void
  aoAbrirOutra: (id: string) => void
  marcarLido: (id: string) => void
  tl: (pt: string, en: string, es: string, it: string) => string
}) {
  useEffect(() => { marcarLido(unidade.id) }, [unidade.id, marcarLido])

  const ligados = unidade.verTambem.map(porId).filter((u): u is Unidade => !!u)

  return (
    <Modal visible transparent animationType="slide" onRequestClose={aoFechar}>
      <View style={s.fundo}>
        <View style={s.folha}>
          <View style={s.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={s.titulo}>{unidade.titulo[idioma]}</Text>
              <Text style={s.minutos}>
                {`${unidade.minutos} ${tl('min de leitura', 'min read', 'min de lectura', 'min di lettura')}`}
              </Text>
            </View>
            <Pressable
              onPress={aoFechar}
              accessibilityRole="button"
              hitSlop={12}
              style={({ pressed }) => [s.fechar, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close" size={22} color="#C7D2E8" />
            </Pressable>
          </View>

          {/* ⚠️ `flex: 1` no ScrollView: sem ele não rola no web. Regra
              conhecida deste projeto. */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.corpo} showsVerticalScrollIndicator={false}>
            {unidade.blocos.map((b, i) => (
              <BlocoDoEstudo key={`${unidade.id}-b${i}`} bloco={b} idioma={idioma} />
            ))}

            {ligados.length ? (
              <View style={s.ligados}>
                <Text style={s.ligadosTitulo}>
                  {tl('Continue por aqui', 'Continue here', 'Sigue por aqui', 'Continua qui')}
                </Text>
                {ligados.map((u) => (
                  <Pressable
                    key={u.id}
                    onPress={() => aoAbrirOutra(u.id)}
                    accessibilityRole="button"
                    style={({ pressed }) => [s.ligado, pressed && { opacity: 0.6 }]}
                  >
                    <Text style={s.ligadoTexto} numberOfLines={1}>{u.titulo[idioma]}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#8D96AC" />
                  </Pressable>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.80)', justifyContent: 'flex-end' },
  folha: {
    maxHeight: '92%',
    backgroundColor: '#0F1426',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 18,
    // `minHeight: 0` na cadeia flex: sem ele a rolagem trava no PWA.
    minHeight: 0,
  },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  titulo: { color: '#F2F5FA', fontSize: 20, fontWeight: '800', lineHeight: 27 },
  minutos: { color: '#6B7490', fontSize: 12, marginTop: 4 },
  fechar: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  corpo: { paddingBottom: 36 },
  ligados: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 14 },
  ligadosTitulo: { color: '#8D96AC', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  ligado: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 11, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 11, marginBottom: 8,
  },
  ligadoTexto: { flex: 1, color: '#D7DCE8', fontSize: 14 },
})
