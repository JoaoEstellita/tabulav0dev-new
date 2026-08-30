import React, { useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { APP_GUIDE, type GuideLang } from '../data/appGuide'

/**
 * Guia de uso do app — recurso a recurso, aba por aba. Abre no 1º acesso e fica
 * acessível sempre (Configurações + botão de ajuda). Reference-style: seletor de
 * aba no topo + lista de recursos com "o que é / como usar".
 */
const C = { bg: '#0F0F23', card: '#161728', card2: '#1E2038', line: 'rgba(255,255,255,0.10)', gold: '#FFD700', tx: '#EDEBF7', dim: '#9A9CB8' }

export default function AppGuideModal({ visible, onClose, initialTab }: { visible: boolean; onClose: () => void; initialTab?: string }) {
  const { language } = useAppLanguage()
  const lang = language as GuideLang
  const t = (m: Record<GuideLang, string>) => m[lang] || m['pt-BR']
  const [tabKey, setTabKey] = useState(initialTab || APP_GUIDE[0].key)
  const tab = APP_GUIDE.find((x) => x.key === tabKey) || APP_GUIDE[0]

  const heading = ({ 'pt-BR': 'Guia do app', 'en-US': 'App guide', 'es-ES': 'Guia de la app', 'it-IT': 'Guida dell\'app' } as Record<GuideLang, string>)[lang] || 'Guia do app'

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.screen}>
        <View style={s.head}>
          <Text style={s.title}>{heading}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={26} color={C.dim} /></TouchableOpacity>
        </View>

        {/* Seletor de abas */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow}>
            {APP_GUIDE.map((x) => {
              const on = x.key === tabKey
              return (
                <TouchableOpacity key={x.key} style={[s.tab, on && s.tabOn]} onPress={() => setTabKey(x.key)}>
                  <Ionicons name={x.icon as any} size={15} color={on ? '#0F0F23' : C.dim} />
                  <Text style={[s.tabTx, on && s.tabTxOn]}>{t(x.label)}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={s.intro}>{t(tab.intro)}</Text>
          {tab.entries.map((e, i) => (
            <View key={i} style={s.entry}>
              <View style={s.entryIcon}><Ionicons name={e.icon as any} size={18} color={C.gold} /></View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.entryTitle}>{t(e.title)}</Text>
                <Text style={s.entryBody}>{t(e.body)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingTop: 52 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  title: { color: C.tx, fontSize: 22, fontWeight: '900' },
  tabsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 6 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.card2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: C.line },
  tabOn: { backgroundColor: C.gold, borderColor: C.gold },
  tabTx: { color: C.dim, fontSize: 13.5, fontWeight: '700' },
  tabTxOn: { color: '#0F0F23', fontWeight: '800' },
  intro: { color: C.dim, fontSize: 14, lineHeight: 20, marginBottom: 16, fontStyle: 'italic' },
  entry: { flexDirection: 'row', gap: 12, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14, marginBottom: 10 },
  entryIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,215,0,0.12)', alignItems: 'center', justifyContent: 'center' },
  entryTitle: { color: C.tx, fontSize: 15, fontWeight: '800', marginBottom: 3 },
  entryBody: { color: C.dim, fontSize: 13.5, lineHeight: 19 },
})
