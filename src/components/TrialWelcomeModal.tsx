import React, { useEffect, useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSubscriptionCheck } from "../hooks/useSubscriptionCheck"
import { useAppLanguage } from "../hooks/useAppLanguage"
import { useAuth } from "../hooks/useAuth"

/**
 * Boas-vindas do teste grátis — mostra UMA vez, logo após o 1º acesso (quando o
 * trial está ativo). Diz que a pessoa tem 7 dias de acesso a tudo e oferece o
 * caminho para os planos. Flag por usuário no AsyncStorage (sem backend).
 * Assinante/admin nunca vê. Montado junto do TrialBanner na Home.
 */
export default function TrialWelcomeModal() {
  const { t } = useAppLanguage()
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { loading, trialActive, subscription, isAdmin } = useSubscriptionCheck()
  const [visible, setVisible] = useState(false)

  const elegivel =
    !loading && !isAdmin && !(subscription?.active || subscription?.status === "active") && trialActive && !!user?.uid

  useEffect(() => {
    let vivo = true
    if (!elegivel || !user?.uid) return
    const chave = `trialWelcomeSeen:${user.uid}`
    AsyncStorage.getItem(chave)
      .then((v) => { if (vivo && !v) setVisible(true) })
      .catch(() => {})
    return () => { vivo = false }
  }, [elegivel, user?.uid])

  const fechar = async () => {
    setVisible(false)
    try { if (user?.uid) await AsyncStorage.setItem(`trialWelcomeSeen:${user.uid}`, "1") } catch {}
  }

  if (!visible) return null

  return (
    <Modal visible transparent animationType="fade" onRequestClose={fechar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="sparkles" size={30} color="#FFD700" />
          </View>
          <Text style={styles.title}>{t("trialWelcome.title")}</Text>
          <Text style={styles.body}>{t("trialWelcome.body")}</Text>
          <TouchableOpacity style={styles.primary} onPress={fechar} activeOpacity={0.85}>
            <Text style={styles.primaryText}>{t("trialWelcome.cta")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondary}
            onPress={async () => { await fechar(); navigation.navigate("Premium", { openTab: "features" }) }}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryText}>{t("trialWelcome.plans")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(6,6,16,0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#14142B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139,124,255,0.28)",
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,215,0,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  body: {
    color: "#C7C9DA",
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 22,
  },
  primary: {
    width: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryText: { color: "#0F0F23", fontSize: 15, fontWeight: "800" },
  secondary: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  secondaryText: { color: "#C7BCFF", fontSize: 14, fontWeight: "600" },
})
