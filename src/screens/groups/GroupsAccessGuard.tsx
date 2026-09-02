"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useSubscriptionCheck } from "../../hooks/useSubscriptionCheck"
import { useAppLanguage } from "../../hooks/useAppLanguage"
import GroupsScreen from "./GroupsScreen"

export default function GroupsAccessGuard() {
  const { t } = useAppLanguage()
  const navigation = useNavigation<any>()
  const { loading, subscription, trialActive, isAdmin } = useSubscriptionCheck()

  const hasFullAccess = !!(isAdmin || trialActive || subscription?.active)

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </LinearGradient>
    )
  }

  // Grupos agora é ABERTO (criar grupo + adicionar pessoas + sinastria de você × alguém são
  // grátis, isca viral). O que é PAGO — mapa completo do membro + a matriz de sinastria do
  // grupo — fica travado DENTRO da tela quando !hasFullAccess.
  return <GroupsScreen hasFullAccess={hasFullAccess} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaText: {
    color: "#0F0F23",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
})
