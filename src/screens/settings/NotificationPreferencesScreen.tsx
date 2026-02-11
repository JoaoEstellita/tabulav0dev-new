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
  const astroPersonalFilters = prefs.astroEventsPersonalFilters || defaults.astroEventsPersonalFilters || {
    aspects: true,
    transits: true,
    combos: true,
  }

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

  const pushTypeItems: Array<{ key: string; label: string; description: string }> = [
    { key: "member_status_critical", label: "Critico de grupo", description: "Alertas criticos de membros nos grupos." },
    { key: "user_status_critical", label: "Critico pessoal", description: "Alertas quando voce entra em estado critico." },
    { key: "user_status_critical_recovered", label: "Recuperacao do critico", description: "Alerta quando voce sai do estado critico." },
    { key: "member_status_positive", label: "Positivo de grupo", description: "Alertas quando membro entra em fase positiva." },
    { key: "user_status_positive", label: "Positivo pessoal", description: "Alertas quando voce entra em fase positiva." },
    { key: "user_status_highlight", label: "Destaque de status", description: "Alertas de destaque quando houver mudanca relevante." },
    { key: "astro_event_personal", label: "Eventos astrais pessoais", description: "Inicio, pico e encerramento dos seus transitos (inclui ingresso em casa)." },
    { key: "astro_event_collective", label: "Eventos astrais coletivos", description: "Alertas de eventos coletivos quando habilitados no backend." },
    { key: "critical_active_summary", label: "Resumo critico ativo", description: "Resumo consolidado de areas criticas ativas." },
    { key: "daily_summary", label: "Resumo diario", description: "Resumo curto diario com status geral." },
    { key: "weekly_summary", label: "Resumo semanal", description: "Resumo semanal consolidado das variacoes." },
    { key: "forecast_weekly", label: "Forecast semanal", description: "Alerta semanal quando novas previsoes forem geradas." },
    { key: "group_message", label: "Mensagens do grupo", description: "Alertas quando houver nova mensagem no grupo." },
  ]

  const inAppTypeItems: Array<{ key: string; label: string; description: string }> = [
    { key: "daily_ready", label: "Diario pronto", description: "Registra quando o diario/resumo diario estiver pronto." },
    { key: "user_status", label: "Seu status agora", description: "Atualizacoes simples de status (pode gerar ruido se ligado)." },
    { key: "user_status_critical", label: "Critico pessoal", description: "Registra alertas pessoais criticos no centro de notificacoes." },
    { key: "user_status_critical_recovered", label: "Recuperacao do critico", description: "Registra quando voce sai do estado critico." },
    { key: "user_status_positive", label: "Positivo pessoal", description: "Registra suas fases positivas no centro de notificacoes." },
    { key: "user_status_highlight", label: "Destaque de status", description: "Registra destaques de status com maior relevancia." },
    { key: "group_status", label: "Status coletivo", description: "Registra atualizacoes gerais do grupo." },
    { key: "member_status_critical", label: "Critico de grupo", description: "Registra alertas criticos de membros no grupo." },
    { key: "member_status_positive", label: "Positivo de grupo", description: "Registra fases positivas de membros no grupo." },
    { key: "astro_event_personal", label: "Eventos astrais pessoais", description: "Registra inicio/pico/fim dos seus transitos (inclui ingresso em casa)." },
    { key: "astro_event_collective", label: "Eventos astrais coletivos", description: "Registra eventos astrais coletivos no app." },
    { key: "critical_active_summary", label: "Resumo critico ativo", description: "Registra resumo consolidado de areas criticas." },
    { key: "daily_summary", label: "Resumo diario", description: "Registra resumo diario no centro de notificacoes." },
    { key: "weekly_summary", label: "Resumo semanal", description: "Registra resumo semanal no centro de notificacoes." },
    { key: "forecast_weekly", label: "Forecast semanal", description: "Registra novas previsoes semanais no app." },
    { key: "group_message", label: "Mensagens do grupo", description: "Registra mensagens de grupos no app." },
  ]

  const renderTypeToggle = (
    mode: "push" | "inApp",
    key: string,
    label: string,
    description: string
  ) => {
    const map = (mode === "push" ? pushTypes : inAppTypes) as Record<string, boolean | undefined>
    const value = map[key] !== false
    return renderToggle(label, description, value, (next) => {
      const nextTypes = { ...map, [key]: next }
      savePreferences(mode === "push" ? { push: { types: nextTypes } } : { inApp: { types: nextTypes } })
    })
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
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
                "Eventos astrais pessoais",
                "Liga/desliga notificacoes de eventos astrais pessoais (inicio, pico e encerramento).",
                prefs.astroEventsPersonalEnabled !== false,
                (value) => savePreferences({ astroEventsPersonalEnabled: value })
              )}
              {prefs.astroEventsPersonalEnabled !== false && (
                <View style={styles.nestedSection}>
                  <Text style={styles.nestedTitle}>Filtros dos eventos pessoais</Text>
                  {renderToggle(
                    "Novos aspectos",
                    "Notifica aspectos planeta x planeta e planeta x casa.",
                    astroPersonalFilters.aspects !== false,
                    (value) =>
                      savePreferences({
                        astroEventsPersonalFilters: {
                          ...astroPersonalFilters,
                          aspects: value,
                        },
                      })
                  )}
                  {renderToggle(
                    "Novos transitos",
                    "Notifica ingressos de planeta em casa (mudanca de casa).",
                    astroPersonalFilters.transits !== false,
                    (value) =>
                      savePreferences({
                        astroEventsPersonalFilters: {
                          ...astroPersonalFilters,
                          transits: value,
                        },
                      })
                  )}
                  {renderToggle(
                    "Eventos combinados",
                    "Notifica convergencias de multiplos fatores (combo).",
                    astroPersonalFilters.combos !== false,
                    (value) =>
                      savePreferences({
                        astroEventsPersonalFilters: {
                          ...astroPersonalFilters,
                          combos: value,
                        },
                      })
                  )}
                </View>
              )}
              {renderToggle(
                "Eventos astrais coletivos",
                "Liga/desliga notificacoes coletivas no app e push (se habilitados nos tipos).",
                prefs.astroEventsCollectiveEnabled === true,
                (value) => savePreferences({ astroEventsCollectiveEnabled: value })
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
              {pushTypeItems.map((item) => (
                <View key={`push_${item.key}`}>
                  {renderTypeToggle("push", item.key, item.label, item.description)}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notificacoes internas (app)</Text>
              {inAppTypeItems.map((item) => (
                <View key={`inapp_${item.key}`}>
                  {renderTypeToggle("inApp", item.key, item.label, item.description)}
                </View>
              ))}
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
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
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
  nestedSection: {
    marginTop: 6,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 215, 0, 0.12)",
    paddingTop: 8,
  },
  nestedTitle: {
    color: "#FCD34D",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 2,
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
