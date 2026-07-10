import React, { useMemo, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useNotificationStore, NotificationItem, NotificationTemplate } from "../../context/NotificationStore"
import { useAppLanguage } from "../../hooks/useAppLanguage"

const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateLabel = (
  value: any,
  language: string,
  t: (key: string, vars?: Record<string, string | number>) => string
) => {
  if (!value?.toDate) return t("notif.noDate")
  const date = value.toDate()
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)

  const dateKey = getLocalDateKey(date)
  const todayKey = getLocalDateKey(todayStart)
  const yesterdayKey = getLocalDateKey(yesterdayStart)

  if (dateKey === todayKey) return t("notif.today")
  if (dateKey === yesterdayKey) return t("notif.yesterday")
  return date.toLocaleDateString(language)
}

const formatTimeLabel = (value: any, language: string) => {
  if (!value?.toDate) return ""
  const date = value.toDate()
  return date.toLocaleTimeString(language, { hour: "2-digit", minute: "2-digit" })
}

const renderTemplate = (template?: NotificationTemplate, vars?: Record<string, any>) => {
  const safeVars = vars || {}
  const applyVars = (input: string, pattern: RegExp) =>
    input.replace(pattern, (_, key) => {
      const value = safeVars[String(key).trim()]
      return value === undefined || value === null ? "" : String(value)
    })
  const apply = (text?: string) => {
    const raw = String(text || "")
    const withDouble = applyVars(raw, /\{\{\s*([^}]+)\s*\}\}/g)
    return applyVars(withDouble, /\{([a-zA-Z0-9_.-]+)\}/g)
  }
  return {
    title: apply(template?.title),
    body: apply(template?.body),
  }
}

const getNotificationSeverity = (item: NotificationItem) => {
  const status = (item.status || item.severity || "").toLowerCase()
  if (status === "critical" || status === "challenging") return "critical"
  if (status === "positive" || status === "excellent") return "positive"
  if ((item.type || "").includes("positive")) return "positive"
  if ((item.type || "").includes("critical")) return "critical"
  return "info"
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return { name: "alert-circle", color: "#F87171" }
    case "positive":
      return { name: "checkmark-circle", color: "#34D399" }
    default:
      return { name: "information-circle", color: "#FBBF24" }
  }
}

const formatAreaLabel = (value?: any) => {
  if (!value) return null
  const raw = String(value).replace(/_/g, " ").trim()
  if (!raw) return null
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

const buildLifeAreaTags = (item: NotificationItem, t: (key: string) => string) => {
  const rawItem = item as any
  const vars = item.templateVars || {}
  const meta = item.meta || {}
  const singleLabel =
    vars.lifeAreaLabel ||
    vars.primaryLifeAreaLabel ||
    meta.lifeAreaLabel ||
    meta.primaryLifeAreaLabel
  if (singleLabel) return [String(singleLabel)]

  const directLabel =
    rawItem.lifeAreaLabel ||
    rawItem.lifeAreaKey ||
    item.area ||
    meta.lifeAreaKey ||
    vars.lifeAreaKey
  const formattedDirect = formatAreaLabel(directLabel)
  if (formattedDirect) return [formattedDirect]

  const lifeAreas = vars.lifeAreas || meta.lifeAreas
  if (Array.isArray(lifeAreas) && lifeAreas.length > 0) {
    const labels = lifeAreas.map((entry: any) => entry?.label || entry?.key).filter(Boolean)
    if (labels.length > 2) {
      return [String(labels[0]), String(labels[1]), `+${labels.length - 2}`]
    }
    if (labels.length > 0) return labels.map((label: any) => String(label))
  }

  const listLabel = vars.lifeAreasLabel || meta.lifeAreasLabel
  if (listLabel) return [String(listLabel)]

  if (item.area) return [String(item.area)]
  return [t("notif.general")]
}

const resolvePercentageTag = (item: NotificationItem) => {
  const vars = item.templateVars || {}
  const meta = item.meta || {}
  const value =
    typeof item.percentage === "number"
      ? item.percentage
      : typeof vars.percentage === "number"
        ? vars.percentage
        : typeof vars.primaryStatus === "number"
          ? vars.primaryStatus
          : typeof vars.primaryLifeAreaStatus === "number"
            ? vars.primaryLifeAreaStatus
            : typeof vars.status === "number"
              ? vars.status
              : typeof meta.status === "number"
                ? meta.status
                : null
  return typeof value === "number" ? Math.round(value) : null
}

const resolveNotificationText = (
  item: NotificationItem,
  templates: Record<string, NotificationTemplate>,
  t: (key: string) => string
) => {
  if (item.templateKey === "member_status_critical") {
    const summaryText = item.templateVars?.summaryText
    if (summaryText) {
      return { title: item.title || "", body: summaryText }
    }
    const items = (item.meta as any)?.items
    if (Array.isArray(items) && items.length > 0) {
      const summary = items
        .map((entry: any) => {
          const name = entry.memberName || t("notif.member")
          if (entry.customMessage) return `${name}: ${entry.customMessage}`
          const areas = entry.criticalAreasText ? ` (${entry.criticalAreasText})` : ""
          return `${name}${areas} ${t("notif.inCritical")}`
        })
        .join("; ")
      if (summary) return { title: item.title || "", body: summary }
    }
  }
  if (item.templateKey && templates[item.templateKey]) {
    const template = templates[item.templateKey]
    if (template?.enabled === false) {
      return { title: item.title || "", body: item.body || "" }
    }
    const rendered = renderTemplate(template, item.templateVars || item.meta)
    return {
      title: rendered.title || item.title || "",
      body: rendered.body || item.body || "",
    }
  }
  return { title: item.title || "", body: item.body || "" }
}

const resolveCriticalAreasText = (item: NotificationItem) => {
  const vars = item.templateVars || {}
  const meta = item.meta || {}
  return (
    vars.criticalAreasText ||
    meta.criticalAreasText ||
    vars.lifeAreasLabel ||
    meta.lifeAreasLabel ||
    ""
  )
}

const resolveTransitsText = (item: NotificationItem) => {
  const vars = item.templateVars || {}
  const meta = item.meta || {}
  return vars.transitsText || meta.transitsText || ""
}

const resolveLifeAreaEntries = (item: NotificationItem, t: (key: string) => string) => {
  const vars = item.templateVars || {}
  const meta = item.meta || {}
  const entries = Array.isArray(vars.lifeAreas)
    ? vars.lifeAreas
    : Array.isArray(meta.lifeAreas)
      ? meta.lifeAreas
      : []
  return entries.map((entry: any) => {
    const label = formatAreaLabel(entry?.label || entry?.key || entry?.area)
    const rawPercent =
      typeof entry?.percentage === "number"
        ? entry.percentage
        : typeof entry?.status === "number"
          ? entry.status
          : typeof entry?.value === "number"
            ? entry.value
            : null
    return {
      label: label || t("notif.general"),
      percentage: typeof rawPercent === "number" ? Math.round(rawPercent) : null,
    }
  })
}

const isGroupNotification = (item: NotificationItem) => {
  const type = (item.type || "").toLowerCase()
  if (item.groupId) return true
  if (type.startsWith("group") || type.startsWith("member_status")) return true
  return false
}

type NotificationSectionKey = "critical" | "astro" | "group" | "digest"

const getNotificationPriority = (item: NotificationItem) => {
  const type = String(item.type || "").toLowerCase()
  const map: Record<string, number> = {
    user_status_critical: 120,
    member_status_critical: 118,
    user_status_critical_recovered: 110,
    astro_event_personal: 100,
    astro_event_collective: 96,
    daily_summary: 88,
    weekly_digest: 86,
    weekly_summary: 86,
    forecast_weekly: 86,
    critical_active_summary: 86,
    user_status_highlight: 80,
    user_status_positive: 76,
    member_status_positive: 74,
    group_status: 70,
    group_message: 40,
  }
  return map[type] ?? 50
}

const getNotificationSection = (item: NotificationItem): NotificationSectionKey => {
  if (getNotificationSeverity(item) === "critical") return "critical"
  const type = String(item.type || "").toLowerCase()
  if (type.startsWith("astro_event")) return "astro"
  if (isGroupNotification(item)) return "group"
  return "digest"
}

const matchesFilter = (item: NotificationItem, filter: string) => {
  if (filter === "all") return true
  if (filter === "critical") return getNotificationSeverity(item) === "critical"
  if (filter === "personal") return !isGroupNotification(item)
  if (filter === "group") return isGroupNotification(item)
  return true
}

const NotificationCard = React.memo(function NotificationCard({
  item,
  templates,
  language,
  t,
  onOpen,
  onNavigate,
}: {
  item: NotificationItem
  templates: Record<string, NotificationTemplate>
  language: string
  t: (key: string, vars?: Record<string, string | number>) => string
  onOpen: (item: NotificationItem) => void
  onNavigate: (item: NotificationItem) => void
}) {
  const severity = getNotificationSeverity(item)
  const icon = getSeverityIcon(severity)
  const text = resolveNotificationText(item, templates, t)
  const areaTags = buildLifeAreaTags(item, t)
  const percentValue = resolvePercentageTag(item)
  const dateLabel = formatDateLabel(item.createdAt, language, t)
  const timeLabel = formatTimeLabel(item.createdAt, language)
  const handleOpen = React.useCallback(() => onOpen(item), [item, onOpen])
  const handleNavigate = React.useCallback(() => onNavigate(item), [item, onNavigate])

  return (
    <View style={[styles.card, !item.isRead && styles.cardUnread]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon.name as any} size={20} color={icon.color} />
      </View>
      <TouchableOpacity style={styles.cardMain} onPress={handleOpen}>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>{text.title}</Text>
          <Text style={styles.cardBody}>{text.body}</Text>
          {item.createdAt?.toDate ? (
            <Text style={styles.cardTime}>{`${dateLabel} · ${timeLabel}`}</Text>
          ) : null}
          <View style={styles.tags}>
            {item.groupName ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.groupName}</Text>
              </View>
            ) : null}
            {areaTags.map((areaLabel, index) => (
              <View key={`${item.id}_area_${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{areaLabel}</Text>
              </View>
            ))}
            {typeof percentValue === "number" ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{percentValue}%</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardActionButton} onPress={handleNavigate}>
        <Ionicons name="arrow-redo-outline" size={18} color="#FFD700" />
      </TouchableOpacity>
      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
  )
})

export default function NotificationsScreen() {
  const { t, language } = useAppLanguage()
  const navigation = useNavigation<any>()
  const [filter, setFilter] = useState("all")
  const [activeItem, setActiveItem] = useState<NotificationItem | null>(null)
  const {
    notifications,
    templates,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    loadingMore,
    hasMore,
    loadMore,
  } = useNotificationStore()

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => matchesFilter(item, filter))
  }, [notifications, filter])

  const sectioned = useMemo(() => {
    const sectionOrder: NotificationSectionKey[] = ["critical", "astro", "group", "digest"]
    const result: Record<NotificationSectionKey, NotificationItem[]> = {
      critical: [],
      astro: [],
      group: [],
      digest: [],
    }
    const ordered = [...filteredNotifications].sort((a, b) => {
      const p = getNotificationPriority(b) - getNotificationPriority(a)
      if (p !== 0) return p
      const ta = a.createdAt?.toMillis?.() || 0
      const tb = b.createdAt?.toMillis?.() || 0
      return tb - ta
    })
    ordered.forEach((item) => result[getNotificationSection(item)].push(item))
    return sectionOrder
      .map((key) => ({ key, items: result[key] }))
      .filter((entry) => entry.items.length > 0)
  }, [filteredNotifications])

  const sectionTitle = React.useCallback((key: NotificationSectionKey) => {
    if (key === "critical") return t("notif.section.critical")
    if (key === "astro") return t("notif.section.astro")
    if (key === "group") return t("notif.section.group")
    return t("notif.section.digest")
  }, [t])

  const openNotificationTarget = React.useCallback(async (item: NotificationItem) => {
    if (!item.isRead) await markAsRead(item.id)
    const link: any =
      (item.deepLink as any) ||
      ((item.templateVars as any)?.deepLink as any) ||
      ((item.meta as any)?.deepLink as any) ||
      null
    if (link?.screen) {
      navigation.navigate(link.screen, link.params || {})
      return
    }
    const type = String(item.type || "").toLowerCase()
    if (isGroupNotification(item)) {
      navigation.navigate("Groups", item.groupId ? { groupId: item.groupId } : undefined)
      return
    }
    if (
      type.includes("forecast") ||
      type.includes("daily") ||
      type.includes("weekly") ||
      type.startsWith("astro_event")
    ) {
      navigation.navigate("Forecast")
      return
    }
    navigation.navigate("Home")
  }, [markAsRead, navigation])

  const handleOpenNotification = React.useCallback(async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id)
    }
    setActiveItem(item)
  }, [markAsRead])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t("notif.title")}</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? t("notif.unreadCount", { count: unreadCount })
              : t("notif.allCaughtUp")}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.markAllButton, unreadCount === 0 && styles.markAllButtonDisabled]}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Ionicons name="checkmark-done" size={16} color="#0F0F23" />
          <Text style={styles.markAllButtonText}>{t("notif.markAll")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {[
          { key: "all", label: t("notif.filter.all") },
          { key: "critical", label: t("notif.filter.critical") },
          { key: "personal", label: t("notif.filter.personal") },
          { key: "group", label: t("notif.filter.group") },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.filterChip, filter === option.key && styles.filterChipActive]}
            onPress={() => setFilter(option.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === option.key && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.emptyText}>{t("notif.loading")}</Text>
        ) : filteredNotifications.length === 0 ? (
          <Text style={styles.emptyText}>{t("notif.empty")}</Text>
        ) : (
          sectioned.map((section) => (
            <View key={section.key} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{sectionTitle(section.key)}</Text>
              <Text style={styles.groupSubtitle}>{section.items.length}</Text>

              {section.items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  templates={templates}
                  language={language}
                  t={t}
                  onOpen={handleOpenNotification}
                  onNavigate={openNotificationTarget}
                />
              ))}
            </View>
          ))
        )}

        {hasMore && !loading && (
          <TouchableOpacity
            style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
            onPress={loadMore}
            disabled={loadingMore}
          >
            <Text style={styles.loadMoreText}>
              {loadingMore ? t("notif.loadingMore") : t("notif.loadMore")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={!!activeItem}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveItem(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setActiveItem(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {activeItem ? (
              <>
                <Text style={styles.modalTitle}>
                  {resolveNotificationText(activeItem, templates, t).title}
                </Text>
                <Text style={styles.modalBody}>
                  {resolveNotificationText(activeItem, templates, t).body}
                </Text>
                {activeItem.createdAt?.toDate ? (
                  <Text style={styles.modalTime}>{formatTimeLabel(activeItem.createdAt, language)}</Text>
                ) : null}

                {resolveCriticalAreasText(activeItem) ? (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{t("notif.criticalAreas")}</Text>
                    <Text style={styles.modalSectionText}>{resolveCriticalAreasText(activeItem)}</Text>
                  </View>
                ) : null}

                {resolveTransitsText(activeItem) ? (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{t("notif.relatedTransits")}</Text>
                    <Text style={styles.modalSectionText}>{resolveTransitsText(activeItem)}</Text>
                  </View>
                ) : null}

                {resolveLifeAreaEntries(activeItem, t).length > 0 ? (
                  <View style={styles.modalTags}>
                    {resolveLifeAreaEntries(activeItem, t).map((entry, index) => (
                      <View key={`modal_area_${index}`} style={styles.tag}>
                        <Text style={styles.tagText}>
                          {entry.label}
                          {typeof entry.percentage === "number" ? ` ${entry.percentage}%` : ""}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => openNotificationTarget(activeItem)}
                >
                  <Ionicons name="open-outline" size={16} color="#0F0F23" />
                  <Text style={styles.modalActionButtonText}>{t("notif.action.open")}</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F23",
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterChip: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: "#FFD700",
  },
  filterChipText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#0F0F23",
  },
  loadMoreButton: {
    marginVertical: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  loadMoreButtonDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#9CA3AF",
    marginTop: 4,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  markAllButtonDisabled: {
    opacity: 0.4,
  },
  markAllButtonText: {
    color: "#0F0F23",
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 24,
  },
  groupSection: {
    marginBottom: 20,
  },
  groupTitle: {
    color: "#FFD700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  groupSubtitle: {
    color: "#9CA3AF",
    fontSize: 11,
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1B1B33",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardUnread: {
    borderColor: "rgba(255,215,0,0.4)",
  },
  cardMain: {
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 4,
  },
  cardBody: {
    color: "#CBD5F5",
    fontSize: 13,
    lineHeight: 18,
  },
  cardTime: {
    marginTop: 6,
    fontSize: 12,
    color: "#9CA3AF",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tagText: {
    color: "#E5E7EB",
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    alignSelf: "center",
    marginLeft: 8,
  },
  cardActionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 15, 35, 0.8)",
    padding: 24,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#1B1B33",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalBody: {
    color: "#CBD5F5",
    fontSize: 13,
    lineHeight: 18,
  },
  modalTime: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
  modalSection: {
    marginTop: 12,
  },
  modalSectionTitle: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalSectionText: {
    color: "#E5E7EB",
    fontSize: 12,
  },
  modalTags: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  modalActionButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: "#FFD700",
  },
  modalActionButtonText: {
    color: "#0F0F23",
    fontWeight: "700",
  },
})
