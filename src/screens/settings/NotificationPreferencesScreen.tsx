"use client"

import React, { useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, TextInput } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"

export default function NotificationPreferencesScreen() {
  const [saving, setSaving] = useState(false)
  const { preferences, loading, updatePreferences, defaults } = useNotificationPreferences()
  const prefs = preferences || defaults

  const savePreferences = async (updates: any) => {
    setSaving(true)
    await updatePreferences(updates)
    setSaving(false)
  }

  const pushTypes = prefs.push?.types || defaults.push.types
  const inAppTypes = prefs.inApp?.types || defaults.inApp.types
  const quietHours = prefs.quietHours || defaults.quietHours

  const quietHoursLabel = useMemo(() => {
    if (!quietHours?.enabled) return "Desativado"
    return `${quietHours.start} - ${quietHours.end}`
  }, [quietHours])

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
              {renderToggle(
                "Horario silencioso",
                `Silencia push nesse periodo. ${quietHoursLabel}`,
                quietHours?.enabled === true,
                (value) =>
                  savePreferences({
                    quietHours: {
                      ...(quietHours || {}),
                      enabled: value,
                    },
                  })
              )}
              {quietHours?.enabled === true && (
                <View style={styles.quietHoursRow}>
                  <View style={styles.quietHoursField}>
                    <Text style={styles.quietHoursLabel}>Inicio</Text>
                    <TextInput
                      style={styles.quietHoursInput}
                      value={quietHours.start}
                      placeholder="22:00"
                      onChangeText={(value) =>
                        savePreferences({
                          quietHours: {
                            ...(quietHours || {}),
                            start: value,
                          },
                        })
                      }
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.quietHoursField}>
                    <Text style={styles.quietHoursLabel}>Fim</Text>
                    <TextInput
                      style={styles.quietHoursInput}
                      value={quietHours.end}
                      placeholder="08:00"
                      onChangeText={(value) =>
                        savePreferences({
                          quietHours: {
                            ...(quietHours || {}),
                            end: value,
                          },
                        })
                      }
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
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
              {renderToggle(
                "Positivo de grupo",
                "Alertas quando um membro entra em fase positiva.",
                pushTypes.member_status_positive !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, member_status_positive: value } } })
              )}
              {renderToggle(
                "Positivo pessoal",
                "Alertas quando voce entra em fase positiva.",
                pushTypes.user_status_positive !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, user_status_positive: value } } })
              )}
              {renderToggle(
                "Resumo diario",
                "Resumo curto diario com status geral.",
                pushTypes.daily_summary !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, daily_summary: value } } })
              )}
              {renderToggle(
                "Forecast semanal",
                "Alerta semanal quando novas previsoes forem geradas.",
                pushTypes.forecast_weekly !== false,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, forecast_weekly: value } } })
              )}
              {renderToggle(
                "Eventos astrais pessoais",
                "Alertas de inicio/pico/fim de eventos pessoais.",
                pushTypes.astro_event_personal === true,
                (value) =>
                  savePreferences({ push: { types: { ...pushTypes, astro_event_personal: value } } })
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
              {renderToggle(
                "Positivo de grupo",
                "Registra fases positivas de membros no centro de notificacoes.",
                inAppTypes.member_status_positive !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, member_status_positive: value } } })
              )}
              {renderToggle(
                "Positivo pessoal",
                "Registra suas fases positivas no centro de notificacoes.",
                inAppTypes.user_status_positive !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, user_status_positive: value } } })
              )}
              {renderToggle(
                "Resumo diario",
                "Registra o resumo diario no centro de notificacoes.",
                inAppTypes.daily_summary !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, daily_summary: value } } })
              )}
              {renderToggle(
                "Forecast semanal",
                "Registra novas previsoes semanais no centro de notificacoes.",
                inAppTypes.forecast_weekly !== false,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, forecast_weekly: value } } })
              )}
              {renderToggle(
                "Eventos astrais pessoais",
                "Registra eventos pessoais no centro de notificacoes.",
                inAppTypes.astro_event_personal === true,
                (value) =>
                  savePreferences({ inApp: { types: { ...inAppTypes, astro_event_personal: value } } })
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
  quietHoursRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  quietHoursField: {
    flex: 1,
  },
  quietHoursLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 6,
  },
  quietHoursInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 215, 0, 0.25)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 13,
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
