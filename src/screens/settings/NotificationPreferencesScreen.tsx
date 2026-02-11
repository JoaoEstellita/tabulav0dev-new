"use client"

import React, { useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, TextInput, Platform, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"

export default function NotificationPreferencesScreen() {
  const [saving, setSaving] = useState(false)
  const [showPushTypes, setShowPushTypes] = useState(false)
  const [showInAppTypes, setShowInAppTypes] = useState(false)
  const { preferences, loading, updatePreferences, defaults } = useNotificationPreferences()
  const prefs = preferences || defaults
  const isWeb = Platform.OS === "web"

  const savePreferences = async (updates: any) => {
    setSaving(true)
    await updatePreferences(updates)
    setSaving(false)
  }

  const applyPreset = async (preset: "essential" | "balanced" | "silent") => {
    const basePushTypes = { ...(prefs.push?.types || defaults.push.types) }
    const baseInAppTypes = { ...(prefs.inApp?.types || defaults.inApp.types) }
    if (preset === "essential") {
      await savePreferences({
        pushEnabled: true,
        astroEventsPersonalEnabled: true,
        astroEventsCollectiveEnabled: false,
        groupFilters: {
          critical: true,
          positive: false,
          messages: true,
        },
        forecastFilters: {
          weekly: false,
        },
        push: {
          frequencyProfile: "focus",
          types: {
            ...basePushTypes,
            user_status_critical: true,
            member_status_critical: true,
            user_status_positive: true,
            user_status_highlight: false,
            astro_event_personal: true,
            astro_event_collective: false,
            group_message: true,
            weekly_digest: false,
          },
        },
        inApp: {
          types: {
            ...baseInAppTypes,
            user_status_critical: true,
            member_status_critical: true,
            user_status_positive: true,
            user_status_highlight: true,
            astro_event_personal: true,
            astro_event_collective: false,
            group_message: true,
          },
        },
      })
      return
    }
    if (preset === "balanced") {
      await savePreferences({
        pushEnabled: true,
        astroEventsPersonalEnabled: true,
        astroEventsCollectiveEnabled: true,
        groupFilters: {
          critical: true,
          positive: true,
          messages: true,
        },
        forecastFilters: {
          weekly: true,
        },
        push: {
          frequencyProfile: "balanced",
          types: {
            ...basePushTypes,
            user_status_critical: true,
            member_status_critical: true,
            user_status_positive: true,
            user_status_highlight: true,
            astro_event_personal: true,
            astro_event_collective: true,
            group_message: true,
            weekly_digest: true,
          },
        },
        inApp: {
          types: {
            ...baseInAppTypes,
            user_status_critical: true,
            member_status_critical: true,
            user_status_positive: true,
            user_status_highlight: true,
            astro_event_personal: true,
            astro_event_collective: true,
            group_message: true,
            weekly_digest: true,
          },
        },
      })
      return
    }
    await savePreferences({
      pushEnabled: false,
      push: {
        frequencyProfile: "quiet",
        types: Object.keys(basePushTypes).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      },
    })
  }

  const pushTypes = prefs.push?.types || defaults.push.types
  const inAppTypes = prefs.inApp?.types || defaults.inApp.types
  const quietHours = prefs.quietHours || defaults.quietHours
  const astroPersonalFilters = prefs.astroEventsPersonalFilters || defaults.astroEventsPersonalFilters || {
    aspects: true,
    transits: true,
    combos: true,
  }
  const astroCollectiveFilters = prefs.astroEventsCollectiveFilters || defaults.astroEventsCollectiveFilters || {
    aspects: true,
    transits: true,
    combos: true,
  }
  const groupFilters = prefs.groupFilters || defaults.groupFilters || {
    critical: true,
    positive: true,
    messages: true,
  }
  const forecastFilters = prefs.forecastFilters || defaults.forecastFilters || {
    weekly: true,
  }

  const quietHoursLabel = useMemo(() => {
    if (!quietHours?.enabled) return "Desativado"
    return `${quietHours.start} - ${quietHours.end}`
  }, [quietHours])
  const frequencyProfile = prefs.push?.frequencyProfile || "balanced"
  const enabledPushTypeCount = useMemo(
    () => Object.values(pushTypes).filter((value) => value !== false).length,
    [pushTypes]
  )
  const enabledInAppTypeCount = useMemo(
    () => Object.values(inAppTypes).filter((value) => value !== false).length,
    [inAppTypes]
  )
  const estimatedVolumeLabel = useMemo(() => {
    if (prefs.pushEnabled === false) return "Baixo"
    const base = enabledPushTypeCount + Math.round(enabledInAppTypeCount * 0.35)
    if (frequencyProfile === "quiet") return base > 6 ? "Médio" : "Baixo"
    if (frequencyProfile === "focus") return base > 6 ? "Alto" : "Médio"
    return base > 10 ? "Alto" : base > 5 ? "Médio" : "Baixo"
  }, [enabledInAppTypeCount, enabledPushTypeCount, frequencyProfile, prefs.pushEnabled])

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
    { key: "member_status_critical", label: "Cr\u00EDtico de grupo", description: "Alertas cr\u00EDticos de membros nos grupos." },
    { key: "user_status_critical", label: "Cr\u00EDtico pessoal", description: "Alertas quando voc\u00EA entra em estado cr\u00EDtico." },
    { key: "user_status_critical_recovered", label: "Recupera\u00E7\u00E3o do cr\u00EDtico", description: "Alerta quando voc\u00EA sai do estado cr\u00EDtico." },
    { key: "member_status_positive", label: "Positivo de grupo", description: "Alertas quando membro entra em fase positiva." },
    { key: "user_status_positive", label: "Positivo pessoal", description: "Alertas quando voc\u00EA entra em fase positiva." },
    { key: "user_status_highlight", label: "Destaque de status", description: "Alertas de destaque quando houver mudan\u00E7a relevante." },
    { key: "astro_event_personal", label: "Eventos astrais pessoais", description: "In\u00EDcio, pico e encerramento dos seus tr\u00E2nsitos (inclui ingresso em casa)." },
    { key: "astro_event_collective", label: "Eventos astrais coletivos", description: "Alertas de eventos coletivos quando habilitados no backend." },
    { key: "daily_summary", label: "Resumo di\u00E1rio", description: "Resumo curto di\u00E1rio com status geral." },
    { key: "weekly_digest", label: "Resumo semanal", description: "Digest semanal unificado (status e previs\u00F5es)." },
    { key: "group_message", label: "Mensagens do grupo", description: "Alertas quando houver nova mensagem no grupo." },
  ]

  const inAppTypeItems: Array<{ key: string; label: string; description: string }> = [
    { key: "user_status", label: "Seu status agora", description: "Atualiza\u00E7\u00F5es simples de status (pode gerar ru\u00EDdo se ligado)." },
    { key: "user_status_critical", label: "Cr\u00EDtico pessoal", description: "Registra alertas pessoais cr\u00EDticos no centro de notifica\u00E7\u00F5es." },
    { key: "user_status_critical_recovered", label: "Recupera\u00E7\u00E3o do cr\u00EDtico", description: "Registra quando voc\u00EA sai do estado cr\u00EDtico." },
    { key: "user_status_positive", label: "Positivo pessoal", description: "Registra suas fases positivas no centro de notifica\u00E7\u00F5es." },
    { key: "user_status_highlight", label: "Destaque de status", description: "Registra destaques de status com maior relev\u00E2ncia." },
    { key: "group_status", label: "Status coletivo", description: "Registra atualiza\u00E7\u00F5es gerais do grupo." },
    { key: "member_status_critical", label: "Cr\u00EDtico de grupo", description: "Registra alertas cr\u00EDticos de membros no grupo." },
    { key: "member_status_positive", label: "Positivo de grupo", description: "Registra fases positivas de membros no grupo." },
    { key: "astro_event_personal", label: "Eventos astrais pessoais", description: "Registra in\u00EDcio/pico/fim dos seus tr\u00E2nsitos (inclui ingresso em casa)." },
    { key: "astro_event_collective", label: "Eventos astrais coletivos", description: "Registra eventos astrais coletivos no app." },
    { key: "daily_summary", label: "Resumo di\u00E1rio", description: "Registra resumo di\u00E1rio no centro de notifica\u00E7\u00F5es." },
    { key: "weekly_digest", label: "Resumo semanal", description: "Registra digest semanal unificado no app." },
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
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={[styles.container, isWeb && styles.containerWeb]}>
      <ScrollView
        style={[styles.scrollView, isWeb && styles.scrollViewWeb]}
        contentContainerStyle={[styles.scrollContent, isWeb && styles.scrollContentWeb]}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        scrollEnabled
      >
        <View style={styles.header}>
          <Text style={styles.title}>Op\u00E7\u00F5es de Notifica\u00E7\u00F5es</Text>
          <Text style={styles.subtitle}>
            Push aparece na tela bloqueada. O centro interno continua registrando eventos.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Carregando preferências...</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifica\u00E7\u00E3o do celular (push)</Text>
              <View style={styles.presetRow}>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("essential")}>
                  <Text style={styles.presetBtnText}>Essencial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("balanced")}>
                  <Text style={styles.presetBtnText}>Equilibrado</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("silent")}>
                  <Text style={styles.presetBtnText}>Silencioso</Text>
                </TouchableOpacity>
              </View>
              {renderToggle(
                "Push ativado",
                "Permite receber alertas na tela bloqueada.",
                prefs.pushEnabled !== false,
                (value) => savePreferences({ pushEnabled: value })
              )}
              <View style={styles.nestedSection}>
                <Text style={styles.nestedTitle}>Frequência de envio</Text>
                <View style={styles.presetRow}>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "focus" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "focus" } })}
                  >
                    <Text style={styles.presetBtnText}>Foco</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "balanced" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "balanced" } })}
                  >
                    <Text style={styles.presetBtnText}>Equilibrado</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "quiet" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "quiet" } })}
                  >
                    <Text style={styles.presetBtnText}>Silencioso</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.previewText}>
                  Prévia: push ativos {enabledPushTypeCount}, internos ativos {enabledInAppTypeCount}, volume estimado {estimatedVolumeLabel}.
                </Text>
              </View>
              {renderToggle(
                "Eventos astrais pessoais",
                "Liga/desliga notificações de eventos astrais pessoais (início, pico e encerramento).",
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
                    "Novos trânsitos",
                    "Notifica ingressos de planeta em casa (mudança de casa).",
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
                    "Notifica convergências de múltiplos fatores (combo).",
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
                "Liga/desliga notificações coletivas no app e push (se habilitados nos tipos).",
                prefs.astroEventsCollectiveEnabled === true,
                (value) => savePreferences({ astroEventsCollectiveEnabled: value })
              )}
              {prefs.astroEventsCollectiveEnabled === true && (
                <View style={styles.nestedSection}>
                  <Text style={styles.nestedTitle}>Filtros dos eventos coletivos</Text>
                  {renderToggle(
                    "Novos aspectos coletivos",
                    "Notifica aspectos coletivos entre planetas lentos/impacto global.",
                    astroCollectiveFilters.aspects !== false,
                    (value) =>
                      savePreferences({
                        astroEventsCollectiveFilters: {
                          ...astroCollectiveFilters,
                          aspects: value,
                        },
                      })
                  )}
                  {renderToggle(
                    "Novos trânsitos coletivos",
                    "Notifica ingressos coletivos e ativações gerais.",
                    astroCollectiveFilters.transits !== false,
                    (value) =>
                      savePreferences({
                        astroEventsCollectiveFilters: {
                          ...astroCollectiveFilters,
                          transits: value,
                        },
                      })
                  )}
                  {renderToggle(
                    "Eventos combinados coletivos",
                    "Notifica convergências coletivas relevantes.",
                    astroCollectiveFilters.combos !== false,
                    (value) =>
                      savePreferences({
                        astroEventsCollectiveFilters: {
                          ...astroCollectiveFilters,
                          combos: value,
                        },
                      })
                  )}
                </View>
              )}
              <View style={styles.nestedSection}>
                <Text style={styles.nestedTitle}>Filtros de grupos</Text>
                {renderToggle(
                  "Alertas críticos de grupo",
                  "Permite alertas quando membros entram em estado crítico.",
                  groupFilters.critical !== false,
                  (value) =>
                    savePreferences({
                      groupFilters: {
                        ...groupFilters,
                        critical: value,
                      },
                    })
                )}
                {renderToggle(
                  "Alertas positivos de grupo",
                  "Permite alertas de boa energia de membros no grupo.",
                  groupFilters.positive !== false,
                  (value) =>
                    savePreferences({
                      groupFilters: {
                        ...groupFilters,
                        positive: value,
                      },
                    })
                )}
                {renderToggle(
                  "Mensagens de grupo",
                  "Permite notificações de novas mensagens dos grupos.",
                  groupFilters.messages !== false,
                  (value) =>
                    savePreferences({
                      groupFilters: {
                        ...groupFilters,
                        messages: value,
                      },
                    })
                )}
              </View>
              <View style={styles.nestedSection}>
                <Text style={styles.nestedTitle}>Filtros de previsões</Text>
                {renderToggle(
                  "Forecast semanal",
                  "Permite a notificação quando a previsão semanal for gerada.",
                  forecastFilters.weekly !== false,
                  (value) =>
                    savePreferences({
                      forecastFilters: {
                        ...forecastFilters,
                        weekly: value,
                      },
                    })
                )}
              </View>
              {renderToggle(
                "Mostrar nome do membro",
                "Inclui o nome do membro em alertas críticos de grupo.",
                prefs.pushIncludeMemberName === true,
                (value) => savePreferences({ pushIncludeMemberName: value })
              )}
              {renderToggle(
                "Horário silencioso",
                `Silencia push nesse período. ${quietHoursLabel}`,
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
                    <Text style={styles.quietHoursLabel}>Início</Text>
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
              <TouchableOpacity
                style={styles.sectionToggle}
                onPress={() => setShowPushTypes((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionTitle}>Tipos de push</Text>
                <View style={styles.sectionToggleRight}>
                  <Text style={styles.sectionToggleCount}>{pushTypeItems.length}</Text>
                  <Ionicons
                    name={showPushTypes ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#FFD700"
                  />
                </View>
              </TouchableOpacity>
              {showPushTypes && pushTypeItems.map((item) => (
                <View key={`push_${item.key}`}>
                  {renderTypeToggle("push", item.key, item.label, item.description)}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionToggle}
                onPress={() => setShowInAppTypes((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionTitle}>Notificações internas (app)</Text>
                <View style={styles.sectionToggleRight}>
                  <Text style={styles.sectionToggleCount}>{inAppTypeItems.length}</Text>
                  <Ionicons
                    name={showInAppTypes ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#FFD700"
                  />
                </View>
              </TouchableOpacity>
              {showInAppTypes && inAppTypeItems.map((item) => (
                <View key={`inapp_${item.key}`}>
                  {renderTypeToggle("inApp", item.key, item.label, item.description)}
                </View>
              ))}
            </View>

            <View style={styles.sectionNote}>
              <Ionicons name="information-circle" size={18} color="#FFD700" />
              <Text style={styles.noteText}>
                Notificações internas aparecem na tela de Notificações, mesmo se o push estiver desligado.
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
  containerWeb: {
    height: "100vh",
    maxHeight: "100vh",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewWeb: {
    overflow: "scroll",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  scrollContentWeb: {
    paddingBottom: 120,
    minHeight: "100%",
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
  sectionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sectionToggleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionToggleCount: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.35)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  presetBtn: {
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.35)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 215, 0, 0.08)",
  },
  presetBtnActive: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  presetBtnText: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "700",
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
  previewText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
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




