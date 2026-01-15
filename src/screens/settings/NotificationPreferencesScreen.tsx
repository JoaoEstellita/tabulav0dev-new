"use client"

import React, { useEffect, useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import { db } from "../../config/firebase"

const DEFAULT_PUSH_TYPES = {
  member_status_critical: true,
  user_status_critical: true,
  group_message: false,
}

const DEFAULT_INAPP_TYPES = {
  member_status_critical: true,
  user_status_critical: true,
  group_message: true,
}

const buildMergedPreferences = (data) => {
  const existing = (data?.preferences?.notifications || {}) as any
  const push = existing.push || {}
  const inApp = existing.inApp || {}
  const pushTypes = { ...DEFAULT_PUSH_TYPES, ...(push.types || {}) }
  const inAppTypes = { ...DEFAULT_INAPP_TYPES, ...(inApp.types || {}) }

  return {
    ...existing,
    pushEnabled: existing.pushEnabled !== false,
    pushIncludeMemberName: existing.pushIncludeMemberName === true,
    push: {
      ...push,
      types: pushTypes,
    },
    inApp: {
      ...inApp,
      types: inAppTypes,
    },
  }
}

export default function NotificationPreferencesScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState<any>({
    pushEnabled: true,
    pushIncludeMemberName: false,
    push: { types: { ...DEFAULT_PUSH_TYPES } },
    inApp: { types: { ...DEFAULT_INAPP_TYPES } },
  })

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!user?.uid) return
      setLoading(true)
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        const merged = buildMergedPreferences(snap.exists() ? snap.data() : null)
        if (active) setPrefs(merged)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user?.uid])

  const savePreferences = async (updates: any) => {
    if (!user?.uid) return
    const merged = {
      ...prefs,
      ...updates,
      push: {
        ...(prefs.push || {}),
        ...(updates.push || {}),
        types: {
          ...(prefs.push?.types || {}),
          ...(updates.push?.types || {}),
        },
      },
      inApp: {
        ...(prefs.inApp || {}),
        ...(updates.inApp || {}),
        types: {
          ...(prefs.inApp?.types || {}),
          ...(updates.inApp?.types || {}),
        },
      },
    }

    setPrefs(merged)
    setSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        "preferences.notifications": merged,
        lastPreferencesUpdate: serverTimestamp(),
      })
    } finally {
      setSaving(false)
    }
  }

  const pushTypes = prefs.push?.types || DEFAULT_PUSH_TYPES
  const inAppTypes = prefs.inApp?.types || DEFAULT_INAPP_TYPES

  const renderToggle = (label: string, description: string, value: boolean, onToggle: (next: boolean) => void) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleTitle}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#3C3C3E", true: "#FFD700" }}
        thumbColor={value ? "#0a0e27" : "#f4f3f4"}
      />
    </View>
  )

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Opcoes de Notificacoes</Text>
          <Text style={styles.subtitle}>
            Push aparece na tela bloqueada. O centro interno continua registrando eventos.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Carregando preferencias...</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notificacao do celular (push)</Text>
              {renderToggle(
                "Push ativado",
                "Permite receber alertas na tela bloqueada.",
                prefs.pushEnabled !== false,
                (value) => savePreferences({ pushEnabled: value })
              )}
              {renderToggle(
                "Mostrar nome do membro",
                "Inclui o nome do membro em alertas criticos de grupo.",
                prefs.pushIncludeMemberName === true,
                (value) => savePreferences({ pushIncludeMemberName: value })
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipos de push</Text>
              {renderToggle(
                "Critico de grupo",
                "Alertas criticos de membros nos grupos.",
                pushTypes.member_status_critical !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, member_status_critical: value } } })
              )}
              {renderToggle(
                "Critico pessoal",
                "Alertas quando voce entra em estado critico.",
                pushTypes.user_status_critical !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, user_status_critical: value } } })
              )}
              {renderToggle(
                "Mensagens do grupo",
                "Alertas quando houver nova mensagem no grupo.",
                pushTypes.group_message === true,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, group_message: value } } })
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notificacoes internas (app)</Text>
              {renderToggle(
                "Critico de grupo",
                "Registra alertas criticos no centro de notificacoes.",
                inAppTypes.member_status_critical !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, member_status_critical: value } } })
              )}
              {renderToggle(
                "Critico pessoal",
                "Registra alertas pessoais no centro de notificacoes.",
                inAppTypes.user_status_critical !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, user_status_critical: value } } })
              )}
              {renderToggle(
                "Mensagens do grupo",
                "Registra mensagens do grupo no centro de notificacoes.",
                inAppTypes.group_message !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, group_message: value } } })
              )}
            </View>

            <View style={styles.sectionNote}>
              <Ionicons name="information-circle" size={18} color="#FFD700" />
              <Text style={styles.noteText}>
                Notificacoes internas aparecem na tela de Notificacoes, mesmo se o push estiver desligado.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.savingText}>Salvando...</Text>
        </View>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F23",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#B3B3B3",
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    backgroundColor: "rgba(20, 24, 48, 0.9)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.15)",
  },
  sectionTitle: {
    color: "#FFD700",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleDescription: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  sectionNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  noteText: {
    color: "#9CA3AF",
    fontSize: 12,
    flex: 1,
  },
  loading: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#9CA3AF",
  },
  savingOverlay: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(15, 15, 35, 0.9)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  savingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
})
