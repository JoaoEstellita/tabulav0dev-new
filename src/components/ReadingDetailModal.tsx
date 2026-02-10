import React from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type ReadingDetailModalProps = {
  visible: boolean
  onClose: () => void
  statusLabel?: string
  statusColor?: string
  title: string
  timingLabel?: string | null
  subtitle?: string | null
  directText: string
  fullText: string
  actionText?: string | null
  metaText?: string | null
}

export default function ReadingDetailModal({
  visible,
  onClose,
  statusLabel = 'Neutro',
  statusColor = '#64748B',
  title,
  timingLabel,
  subtitle,
  directText,
  fullText,
  actionText,
  metaText,
}: ReadingDetailModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              {timingLabel ? <Text style={styles.timing}>{timingLabel}</Text> : null}
            </View>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Frase-chave</Text>
            <Text style={styles.direct}>{directText}</Text>
            <Text style={styles.sectionTitle}>Interpretação completa</Text>
            <Text style={styles.full}>{fullText}</Text>
            {actionText ? <Text style={styles.action}>Ação sugerida: {actionText}</Text> : null}
            {metaText ? <Text style={styles.meta}>{metaText}</Text> : null}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Fechar leitura</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  card: {
    width: '100%',
    maxWidth: 860,
    maxHeight: '88%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9C07A',
    backgroundColor: '#ECE9E1',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  closeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF3FA',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A85A12',
    marginTop: 4,
  },
  timing: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  scroll: {
    borderTopWidth: 1,
    borderTopColor: '#D9C07A',
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#A85A12',
    marginBottom: 8,
    marginTop: 6,
  },
  direct: {
    fontSize: 17,
    lineHeight: 25,
    color: '#0F172A',
    marginBottom: 10,
  },
  full: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F334F',
    marginBottom: 10,
  },
  action: {
    fontSize: 14,
    lineHeight: 21,
    color: '#B45309',
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 4,
  },
  doneButton: {
    margin: 16,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#081A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
})

