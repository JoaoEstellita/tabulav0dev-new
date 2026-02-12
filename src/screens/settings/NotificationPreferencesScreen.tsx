"use client"

import React, { useMemo, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, TextInput, Platform, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"
import { useAppLanguage } from "../../hooks/useAppLanguage"

export default function NotificationPreferencesScreen() {
  const { t } = useAppLanguage()
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
    if (!quietHours?.enabled) return t("nprefs.quietHours.disabled")
    return `${quietHours.start} - ${quietHours.end}`
  }, [quietHours, t])
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
    if (prefs.pushEnabled === false) return t("nprefs.volume.low")
    const base = enabledPushTypeCount + Math.round(enabledInAppTypeCount * 0.35)
    if (frequencyProfile === "quiet") return base > 6 ? t("nprefs.volume.medium") : t("nprefs.volume.low")
    if (frequencyProfile === "focus") return base > 6 ? t("nprefs.volume.high") : t("nprefs.volume.medium")
    return base > 10 ? t("nprefs.volume.high") : base > 5 ? t("nprefs.volume.medium") : t("nprefs.volume.low")
  }, [enabledInAppTypeCount, enabledPushTypeCount, frequencyProfile, prefs.pushEnabled, t])

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

  const pushTypeItems: Array<{ key: string; labelKey: string; descriptionKey: string }> = [
    { key: "member_status_critical", labelKey: "nprefs.type.member_status_critical.label", descriptionKey: "nprefs.type.member_status_critical.desc" },
    { key: "user_status_critical", labelKey: "nprefs.type.user_status_critical.label", descriptionKey: "nprefs.type.user_status_critical.desc" },
    { key: "user_status_critical_recovered", labelKey: "nprefs.type.user_status_critical_recovered.label", descriptionKey: "nprefs.type.user_status_critical_recovered.desc" },
    { key: "member_status_positive", labelKey: "nprefs.type.member_status_positive.label", descriptionKey: "nprefs.type.member_status_positive.desc" },
    { key: "user_status_positive", labelKey: "nprefs.type.user_status_positive.label", descriptionKey: "nprefs.type.user_status_positive.desc" },
    { key: "user_status_highlight", labelKey: "nprefs.type.user_status_highlight.label", descriptionKey: "nprefs.type.user_status_highlight.desc" },
    { key: "astro_event_personal", labelKey: "nprefs.type.astro_event_personal.label", descriptionKey: "nprefs.type.astro_event_personal.desc" },
    { key: "astro_event_collective", labelKey: "nprefs.type.astro_event_collective.label", descriptionKey: "nprefs.type.astro_event_collective.desc" },
    { key: "daily_summary", labelKey: "nprefs.type.daily_summary.label", descriptionKey: "nprefs.type.daily_summary.desc" },
    { key: "weekly_digest", labelKey: "nprefs.type.weekly_digest.label", descriptionKey: "nprefs.type.weekly_digest.desc" },
    { key: "group_message", labelKey: "nprefs.type.group_message.label", descriptionKey: "nprefs.type.group_message.desc" },
  ]

  const inAppTypeItems: Array<{ key: string; labelKey: string; descriptionKey: string }> = [
    { key: "user_status", labelKey: "nprefs.inapp.user_status.label", descriptionKey: "nprefs.inapp.user_status.desc" },
    { key: "user_status_critical", labelKey: "nprefs.inapp.user_status_critical.label", descriptionKey: "nprefs.inapp.user_status_critical.desc" },
    { key: "user_status_critical_recovered", labelKey: "nprefs.inapp.user_status_critical_recovered.label", descriptionKey: "nprefs.inapp.user_status_critical_recovered.desc" },
    { key: "user_status_positive", labelKey: "nprefs.inapp.user_status_positive.label", descriptionKey: "nprefs.inapp.user_status_positive.desc" },
    { key: "user_status_highlight", labelKey: "nprefs.inapp.user_status_highlight.label", descriptionKey: "nprefs.inapp.user_status_highlight.desc" },
    { key: "group_status", labelKey: "nprefs.inapp.group_status.label", descriptionKey: "nprefs.inapp.group_status.desc" },
    { key: "member_status_critical", labelKey: "nprefs.inapp.member_status_critical.label", descriptionKey: "nprefs.inapp.member_status_critical.desc" },
    { key: "member_status_positive", labelKey: "nprefs.inapp.member_status_positive.label", descriptionKey: "nprefs.inapp.member_status_positive.desc" },
    { key: "astro_event_personal", labelKey: "nprefs.inapp.astro_event_personal.label", descriptionKey: "nprefs.inapp.astro_event_personal.desc" },
    { key: "astro_event_collective", labelKey: "nprefs.inapp.astro_event_collective.label", descriptionKey: "nprefs.inapp.astro_event_collective.desc" },
    { key: "daily_summary", labelKey: "nprefs.inapp.daily_summary.label", descriptionKey: "nprefs.inapp.daily_summary.desc" },
    { key: "weekly_digest", labelKey: "nprefs.inapp.weekly_digest.label", descriptionKey: "nprefs.inapp.weekly_digest.desc" },
    { key: "group_message", labelKey: "nprefs.inapp.group_message.label", descriptionKey: "nprefs.inapp.group_message.desc" },
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
          <Text style={styles.title}>{t("nprefs.title")}</Text>
          <Text style={styles.subtitle}>
            {t("nprefs.subtitle")}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>{t("nprefs.loading")}</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("nprefs.push.section")}</Text>
              <View style={styles.presetRow}>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("essential")}>
                  <Text style={styles.presetBtnText}>{t("nprefs.preset.essential")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("balanced")}>
                  <Text style={styles.presetBtnText}>{t("nprefs.preset.balanced")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset("silent")}>
                  <Text style={styles.presetBtnText}>{t("nprefs.preset.silent")}</Text>
                </TouchableOpacity>
              </View>
              {renderToggle(
                t("nprefs.push.enabled.title"),
                t("nprefs.push.enabled.desc"),
                prefs.pushEnabled !== false,
                (value) => savePreferences({ pushEnabled: value })
              )}
              <View style={styles.nestedSection}>
                <Text style={styles.nestedTitle}>{t("nprefs.push.frequency")}</Text>
                <View style={styles.presetRow}>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "focus" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "focus" } })}
                  >
                    <Text style={styles.presetBtnText}>{t("nprefs.freq.focus")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "balanced" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "balanced" } })}
                  >
                    <Text style={styles.presetBtnText}>{t("nprefs.freq.balanced")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetBtn, frequencyProfile === "quiet" && styles.presetBtnActive]}
                    onPress={() => savePreferences({ push: { frequencyProfile: "quiet" } })}
                  >
                    <Text style={styles.presetBtnText}>{t("nprefs.freq.quiet")}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.previewText}>
                  {t("nprefs.preview", {
                    push: enabledPushTypeCount,
                    inapp: enabledInAppTypeCount,
                    volume: estimatedVolumeLabel,
                  })}
                </Text>
              </View>
              {renderToggle(
                t("nprefs.personalEvents.title"),
                t("nprefs.personalEvents.desc"),
                prefs.astroEventsPersonalEnabled !== false,
                (value) => savePreferences({ astroEventsPersonalEnabled: value })
              )}
              {prefs.astroEventsPersonalEnabled !== false && (
                <View style={styles.nestedSection}>
                  <Text style={styles.nestedTitle}>{t("nprefs.personalFilters.title")}</Text>
                  {renderToggle(
                    t("nprefs.personalFilters.aspects.title"),
                    t("nprefs.personalFilters.aspects.desc"),
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
                    t("nprefs.personalFilters.transits.title"),
                    t("nprefs.personalFilters.transits.desc"),
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
                    t("nprefs.personalFilters.combos.title"),
                    t("nprefs.personalFilters.combos.desc"),
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
                t("nprefs.collectiveEvents.title"),
                t("nprefs.collectiveEvents.desc"),
                prefs.astroEventsCollectiveEnabled === true,
                (value) => savePreferences({ astroEventsCollectiveEnabled: value })
              )}
              {prefs.astroEventsCollectiveEnabled === true && (
                <View style={styles.nestedSection}>
                  <Text style={styles.nestedTitle}>{t("nprefs.collectiveFilters.title")}</Text>
                  {renderToggle(
                    t("nprefs.collectiveFilters.aspects.title"),
                    t("nprefs.collectiveFilters.aspects.desc"),
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
                    t("nprefs.collectiveFilters.transits.title"),
                    t("nprefs.collectiveFilters.transits.desc"),
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
                    t("nprefs.collectiveFilters.combos.title"),
                    t("nprefs.collectiveFilters.combos.desc"),
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
                <Text style={styles.nestedTitle}>{t("nprefs.groups.filters")}</Text>
                {renderToggle(
                  t("nprefs.groupFilters.critical.title"),
                  t("nprefs.groupFilters.critical.desc"),
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
                  t("nprefs.groupFilters.positive.title"),
                  t("nprefs.groupFilters.positive.desc"),
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
                  t("nprefs.groupFilters.messages.title"),
                  t("nprefs.groupFilters.messages.desc"),
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
                <Text style={styles.nestedTitle}>{t("nprefs.forecast.filters")}</Text>
                {renderToggle(
                  t("nprefs.forecastFilters.weekly.title"),
                  t("nprefs.forecastFilters.weekly.desc"),
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
                t("nprefs.memberName.title"),
                t("nprefs.memberName.desc"),
                prefs.pushIncludeMemberName === true,
                (value) => savePreferences({ pushIncludeMemberName: value })
              )}
              {renderToggle(
                t("nprefs.quietHours.title"),
                t("nprefs.quietHours.desc", { range: quietHoursLabel }),
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
                    <Text style={styles.quietHoursLabel}>{t("nprefs.quietHours.start")}</Text>
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
                    <Text style={styles.quietHoursLabel}>{t("nprefs.quietHours.end")}</Text>
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
                <Text style={styles.sectionTitle}>{t("nprefs.push.types")}</Text>
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
                  {renderTypeToggle("push", item.key, t(item.labelKey), t(item.descriptionKey))}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionToggle}
                onPress={() => setShowInAppTypes((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionTitle}>{t("nprefs.inapp.section")}</Text>
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
                  {renderTypeToggle("inApp", item.key, t(item.labelKey), t(item.descriptionKey))}
                </View>
              ))}
            </View>

            <View style={styles.sectionNote}>
              <Ionicons name="information-circle" size={18} color="#FFD700" />
              <Text style={styles.noteText}>
                {t("nprefs.note")}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.savingText}>{t("common.saving")}</Text>
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




