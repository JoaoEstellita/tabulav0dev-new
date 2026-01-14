import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([])
      setDocTemplates({})
      setCollectionTemplates({})
      return
    }

    setLoading(true)
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        })) as NotificationItem[]
        setNotifications(items)
        setLoading(false)
      },
      () => setLoading(false)
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
    const unread = notifications.filter(
      (item) => (!item.source || item.source === "user") && !item.isRead
    )
    if (!unread.length) return
    const batch = writeBatch(db)
    unread.forEach((item) => {
      batch.update(doc(db, "notifications", item.id), {
        isRead: true,
        readAt: serverTimestamp(),
      })
    })
    await batch.commit()
  }

  const value = useMemo(
    () => ({
      notifications,
      templates,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, templates, unreadCount, loading]
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
