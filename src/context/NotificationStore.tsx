import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  collection,
  doc,
  getDocs,
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

const templateDocToMap = (data: any): Record<string, NotificationTemplate> => {
  if (!data) return {}
  if (data.templates && typeof data.templates === "object") {
    return data.templates as Record<string, NotificationTemplate>
  }
  return data as Record<string, NotificationTemplate>
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
        setNotifications((prev) => {
          const map = new Map<string, NotificationItem>()
          prev.forEach((item) => map.set(item.id, item))
          items.forEach((item) => map.set(item.id, item))
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

    const templateRef = doc(db, "settings", "notification_templates")
    const unsubscribeTemplates = onSnapshot(
      templateRef,
      (snapshot) => {
        const data = snapshot.data()
        setDocTemplates(templateDocToMap(data))
      },
      () => {}
    )

    const templatesCollectionRef = collection(db, "settings", "notification_templates", "templates")
    const unsubscribeTemplateCollection = onSnapshot(
      templatesCollectionRef,
      (snapshot) => {
        const map: Record<string, NotificationTemplate> = {}
        snapshot.docs.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data() as NotificationTemplate
        })
        setCollectionTemplates(map)
      },
      () => {}
    )

    return () => {
      unsubscribeNotifications()
      unsubscribeTemplates()
      unsubscribeTemplateCollection()
    }
  }, [user?.uid])

  const templates = useMemo(() => {
    return {
      ...docTemplates,
      ...collectionTemplates,
    }
  }, [docTemplates, collectionTemplates])

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item) => (!item.source || item.source === "user") && !item.isRead
    ).length
  }, [notifications])

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
        if (data?.source && data.source !== "user") return
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
      if (items.length) {
        setNotifications((prev) => {
          const map = new Map<string, NotificationItem>()
          prev.forEach((item) => map.set(item.id, item))
          items.forEach((item) => map.set(item.id, item))
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
