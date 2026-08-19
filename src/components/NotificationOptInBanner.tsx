"use client"

import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import * as Notifications from "expo-notifications"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../hooks/useAuth"
import { useAppLanguage } from "../hooks/useAppLanguage"
import { registerDeviceToken } from "../services/notifications/registerDeviceToken"
import { subscribeWebPush } from "../webpush/subscribe"

/**
 * Banner para ligar as notificações.
 *
 * O passo de permissão saiu do onboarding (travava), então quem cadastrou depois
 * fica sem token de push e não recebe nada. Este banner aparece na Home quando a
 * permissão NÃO foi concedida e puxa o registro (registerDeviceToken) num toque.
 * Native only — web/PWA usa outro caminho (web-push). Não insiste: ao dispensar,
 * some por RE_ASK_DAYS dias.
 */
const DISMISS_KEY = "notif_optin_dismissed_until"
const RE_ASK_DAYS = 7

const L: Record<string, { msg: string; cta: string }> = {
  "pt-BR": { msg: "Ative as notificações para receber seu céu do dia e avisos.", cta: "Ativar" },
  "en-US": { msg: "Turn on notifications to get your daily sky and alerts.", cta: "Turn on" },
  "es-ES": { msg: "Activa las notificaciones para recibir tu cielo del dia y avisos.", cta: "Activar" },
  "it-IT": { msg: "Attiva le notifiche per ricevere il tuo cielo del giorno e avvisi.", cta: "Attiva" },
}

export default function NotificationOptInBanner() {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = L[language] || L["pt-BR"]

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!user?.uid) return
      const dismissed = async () => {
        const raw = await AsyncStorage.getItem(DISMISS_KEY)
        return !!(raw && Date.now() < Number(raw))
      }
      try {
        if (Platform.OS === "web") {
          // Web-push: precisa de SW + PushManager + permissão ainda não concedida.
          const w: any = typeof window !== "undefined" ? window : null
          if (!w || !("Notification" in w) || !("serviceWorker" in navigator) || !("PushManager" in w)) return
          if (w.Notification.permission !== "default") return // granted ou denied → não insiste
          if (await dismissed()) return
          if (active) setVisible(true)
          return
        }
        if (Platform.OS !== "android" && Platform.OS !== "ios") return
        const perm = await Notifications.getPermissionsAsync()
        if (perm.status === "granted") return
        if (await dismissed()) return
        if (active) setVisible(true)
      } catch { /* silencioso */ }
    })()
    return () => {
      active = false
    }
  }, [user?.uid])

  const dismiss = async () => {
    await AsyncStorage.setItem(DISMISS_KEY, String(Date.now() + RE_ASK_DAYS * 86_400_000)).catch(() => {})
    setVisible(false)
  }

  const ativar = async () => {
    if (!user?.uid || loading) return
    setLoading(true)
    try {
      if (Platform.OS === "web") {
        // subscribeWebPush pede a permissão (PushManager) e registra no backend.
        await subscribeWebPush(user.uid)
        setVisible(false)
      } else {
        const r = await registerDeviceToken(user.uid)
        if (r?.token) setVisible(false)
        else await dismiss()
      }
    } catch {
      await dismiss() // negou/falhou (ou VAPID ausente) → não insiste agora
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <View style={styles.wrap}>
      <Ionicons name="notifications" size={18} color="#FFD700" />
      <Text style={styles.txt}>{t.msg}</Text>
      <TouchableOpacity onPress={ativar} style={styles.btn} activeOpacity={0.85}>
        <Text style={styles.btnTxt}>{loading ? "…" : t.cta}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={dismiss} style={styles.x} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color="#888" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,215,0,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  txt: { flex: 1, color: "#E0E0E0", fontSize: 13, lineHeight: 18 },
  btn: { backgroundColor: "#FFD700", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  btnTxt: { color: "#0F0F23", fontWeight: "700", fontSize: 13 },
  x: { padding: 2 },
})
