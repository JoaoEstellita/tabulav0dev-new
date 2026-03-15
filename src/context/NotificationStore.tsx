import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore"
import { db } from "../config/firebase"
import { useAuth } from "../hooks/useAuth"

export type NotificationTemplate = {
  title?: string
  body?: string
  enabled?: boolean
  channels?: {
    inApp?: boolean
    push?: boolean
  }
}

export type NotificationItem = {
  id: string
  userId: string
  title?: string
  body?: string
  type?: string
  source?: string
  status?: string
  severity?: string
  groupId?: string
  groupName?: string
  memberId?: string
  memberName?: string
  area?: string
  percentage?: number | null
  templateKey?: string
  templateVars?: Record<string, any>
  deepLink?: any
  meta?: Record<string, any>
  isRead?: boolean
  createdAt?: any
  readAt?: any
}

type NotificationContextValue = {
  notifications: NotificationItem[]
  templates: Record<string, NotificationTemplate>
  unreadCount: number
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  loadMore: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

// Cache em nível de módulo — templates raramente mudam (só via admin)
let _templateCache: { doc: Record<string, NotificationTemplate>; col: Record<string, NotificationTemplate> } | null = null

const templateDocToMap = (data: any): Record<string, NotificationTemplate> => {
  if (!data) return {}
  if (data.templates && typeof data.templates === "object") {
    return data.templates as Record<string, NotificationTemplate>
  }
  return data as Record<string, NotificationTemplate>
}

const isVisibleForUserFeed = (item?: NotificationItem | null, includeDebug = false) => {
  if (!item) return false
  if (includeDebug) return true
  const source = String(item.source || "").toLowerCase()
  if (source === "debug" || source === "test") return false
  return true
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [docTemplates, setDocTemplates] = useState<Record<string, NotificationTemplate>>({})
  const [collectionTemplates, setCollectionTemplates] = useState<Record<string, NotificationTemplate>>({})
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const PAGE_SIZE = 200
  const includeDebugNotifications = useMemo(() => {
    try {
      if (typeof window === "undefined") return false
      const params = new URLSearchParams(window.location.search || "")
      return params.get("debug") === "1"
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([])
      setDocTemplates({})
      setCollectionTemplates({})
      setLoadingMore(false)
      setHasMore(true)
      setLastDoc(null)
      return
    }

    setLoading(true)
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    )

    const unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        })) as NotificationItem[]
        const visibleItems = items.filter((item) =>
          isVisibleForUserFeed(item, includeDebugNotifications)
        )
        setNotifications((prev) => {
          const map = new Map<string, NotificationItem>()
          prev
            .filter((item) => isVisibleForUserFeed(item, includeDebugNotifications))
            .forEach((item) => map.set(item.id, item))
          visibleItems.forEach((item) => map.set(item.id, item))
          const merged = Array.from(map.values())
          merged.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0
            const bTime = b.createdAt?.toMillis?.() || 0
            return bTime - aTime
          })
          return merged
        })
        const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null
        setLastDoc(lastVisible)
        setHasMore(snapshot.size === PAGE_SIZE)
        setLoading(false)
      },
      (err) => {
        console.error("notifications snapshot error", err)
        setLoading(false)
      }
    )

    let canceled = false
    const loadTemplates = async () => {
      try {
        if (_templateCache) {
          if (!canceled) {
            setDocTemplates(_templateCache.doc)
            setCollectionTemplates(_templateCache.col)
          }
          return
        }
        const templateRef = doc(db, "settings", "notification_templates")
        const templatesCollectionRef = collection(db, "settings", "notification_templates", "templates")
        const [templateSnap, templatesSnap] = await Promise.all([
          getDoc(templateRef),
          getDocs(templatesCollectionRef),
        ])
        if (canceled) return
        const docMap = templateDocToMap(templateSnap.exists() ? templateSnap.data() : null)
        const colMap: Record<string, NotificationTemplate> = {}
        templatesSnap.docs.forEach((docSnap) => {
          colMap[docSnap.id] = docSnap.data() as NotificationTemplate
        })
        _templateCache = { doc: docMap, col: colMap }
        setDocTemplates(docMap)
        setCollectionTemplates(colMap)
      } catch (err) {
        console.error("templates fetch error", err)
      }
    }
    loadTemplates()

    return () => {
      unsubscribeNotifications()
      canceled = true
    }
  }, [user?.uid, includeDebugNotifications])

  const templates = useMemo(() => {
    return {
      ...docTemplates,
      ...collectionTemplates,
    }
  }, [docTemplates, collectionTemplates])

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => isVisibleForUserFeed(item, includeDebugNotifications) && !item.isRead).length
  }, [notifications, includeDebugNotifications])

  const markAsRead = async (notificationId: string) => {
    if (!notificationId) return
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
      readAt: serverTimestamp(),
    })
  }

  const markAllAsRead = async () => {
    if (!user?.uid) return
    const baseQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(400)
    )
    let lastVisible: any = null
    let hasNext = true
    while (hasNext) {
      const pageQuery = lastVisible
        ? query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(400)
          )
        : baseQuery
      const snap = await getDocs(pageQuery)
      if (snap.empty) break
      const batch = writeBatch(db)
      snap.docs.forEach((docSnap) => {
        const data = docSnap.data() as any
        if (data?.isRead) return
        if (!includeDebugNotifications) {
          const source = String(data?.source || "").toLowerCase()
          if (source === "debug" || source === "test") return
        }
        batch.update(doc(db, "notifications", docSnap.id), {
          isRead: true,
          readAt: serverTimestamp(),
        })
      })
      await batch.commit()
      lastVisible = snap.docs[snap.docs.length - 1] || null
      hasNext = snap.size === 400
    }
  }

  const loadMore = async () => {
    if (!user?.uid || !hasMore || loadingMore) return
    if (!lastDoc) return
    setLoadingMore(true)
    try {
      const nextQuery = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
      const snap = await getDocs(nextQuery)
      const items = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      })) as NotificationItem[]
      const visibleItems = items.filter((item) =>
        isVisibleForUserFeed(item, includeDebugNotifications)
      )
      if (visibleItems.length) {
        setNotifications((prev) => {
          const map = new Map<string, NotificationItem>()
          prev
            .filter((item) => isVisibleForUserFeed(item, includeDebugNotifications))
            .forEach((item) => map.set(item.id, item))
          visibleItems.forEach((item) => map.set(item.id, item))
          const merged = Array.from(map.values())
          merged.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0
            const bTime = b.createdAt?.toMillis?.() || 0
            return bTime - aTime
          })
          return merged
        })
      }
      const lastVisible = snap.docs[snap.docs.length - 1] || lastDoc
      setLastDoc(lastVisible)
      setHasMore(snap.size === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }

  const value = useMemo(
    () => ({
      notifications,
      templates,
      unreadCount,
      loading,
      loadingMore,
      hasMore,
      loadMore,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, templates, unreadCount, loading, loadingMore, hasMore]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationStore() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error("useNotificationStore must be used within NotificationProvider")
  }
  return ctx
}
