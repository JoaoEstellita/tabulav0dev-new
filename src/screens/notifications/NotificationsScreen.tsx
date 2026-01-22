import React, { useMemo, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNotificationStore, NotificationItem, NotificationTemplate } from "../../context/NotificationStore"

const formatDateLabel = (value?: any) => {
  if (!value?.toDate) return "Sem data"
  const date = value.toDate()
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const dateKey = date.toISOString().slice(0, 10)
  const todayKey = today.toISOString().slice(0, 10)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)

  if (dateKey === todayKey) return "Hoje"
  if (dateKey === yesterdayKey) return "Ontem"
  return date.toLocaleDateString("pt-BR")
}

const renderTemplate = (template?: NotificationTemplate, vars?: Record<string, any>) => {
  const safeVars = vars || {}
  const apply = (text?: string) =>
    (text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
      const value = safeVars[key.trim()]
      return value === undefined || value === null ? "" : String(value)
    })
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

const resolveNotificationText = (
  item: NotificationItem,
  templates: Record<string, NotificationTemplate>
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
          const name = entry.memberName || "Membro"
          if (entry.customMessage) return `${name}: ${entry.customMessage}`
          const areas = entry.criticalAreasText ? ` (${entry.criticalAreasText})` : ""
          return `${name}${areas} em crítico`
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

const isGroupNotification = (item: NotificationItem) => {
  const type = (item.type || "").toLowerCase()
  if (item.groupId) return true
  if (type.startsWith("group") || type.startsWith("member_status")) return true
  return false
}

const matchesFilter = (item: NotificationItem, filter: string) => {
  if (filter === "all") return true
  if (filter === "critical") return getNotificationSeverity(item) === "critical"
  if (filter === "personal") return !isGroupNotification(item)
  if (filter === "group") return isGroupNotification(item)
  return true
}

export default function NotificationsScreen() {
  const [filter, setFilter] = useState("all")
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

  const grouped = useMemo(() => {
    const groups = new Map<string, NotificationItem[]>()
    filteredNotifications.forEach((item) => {
      const label = formatDateLabel(item.createdAt)
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label)?.push(item)
    })
    return Array.from(groups.entries())
  }, [filteredNotifications])

  const handleOpenNotification = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificacoes</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} nao lida${unreadCount === 1 ? "" : "s"}`
              : "Tudo em dia"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.markAllButton, unreadCount === 0 && styles.markAllButtonDisabled]}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Ionicons name="checkmark-done" size={16} color="#0F0F23" />
          <Text style={styles.markAllButtonText}>Marcar tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {[
          { key: "all", label: "Todos" },
          { key: "critical", label: "Criticos" },
          { key: "personal", label: "Pessoais" },
          { key: "group", label: "Grupos" },
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
          <Text style={styles.emptyText}>Carregando notificacoes...</Text>
        ) : filteredNotifications.length === 0 ? (
          <Text style={styles.emptyText}>Sem notificacoes no momento</Text>
        ) : (
          grouped.map(([label, items]) => (
            <View key={label} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{label}</Text>
              {items.map((item) => {
                const severity = getNotificationSeverity(item)
                const icon = getSeverityIcon(severity)
                const text = resolveNotificationText(item, templates)
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.card, !item.isRead && styles.cardUnread]}
                    onPress={() => handleOpenNotification(item)}
                  >
                    <View style={styles.iconWrap}>
                      <Ionicons name={icon.name as any} size={20} color={icon.color} />
                    </View>
                    <View style={styles.content}>
                      <Text style={styles.cardTitle}>{text.title}</Text>
                      <Text style={styles.cardBody}>{text.body}</Text>
                      <View style={styles.tags}>
                        {item.groupName ? (
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.groupName}</Text>
                          </View>
                        ) : null}
                        {item.area ? (
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.area}</Text>
                          </View>
                        ) : null}
                        {typeof item.percentage === "number" ? (
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>{Math.round(item.percentage)}%</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                )
              })}
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
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
})
