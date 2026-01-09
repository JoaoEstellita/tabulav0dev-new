"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useSubscriptionCheck } from "../../hooks/useSubscriptionCheck"
import SubscriptionModal from "../auth/SubscriptionModal"
import SubscriptionPlansModal from "../../components/SubscriptionPlansModal"
import GroupsScreen from "./GroupsScreen"

export default function GroupsAccessGuard() {
  const { loading, showModal, setShowModal, subscription, trialActive, isAdmin } = useSubscriptionCheck()
  const [showPlans, setShowPlans] = useState(false)

  const hasAccess = !!(isAdmin || trialActive || subscription?.active)

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </LinearGradient>
    )
  }

  if (hasAccess) {
    return <GroupsScreen />
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={48} color="#FFD700" />
        <Text style={styles.title}>Grupos Premium</Text>
        <Text style={styles.subtitle}>
          Seu acesso aos grupos esta bloqueado. Assine para liberar o recurso.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => setShowPlans(true)}>
          <Text style={styles.ctaText}>Ver planos</Text>
        </TouchableOpacity>
      </View>

      <SubscriptionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubscribe={() => {
          setShowModal(false)
          setShowPlans(true)
        }}
      />

      <SubscriptionPlansModal
        visible={showPlans}
        onClose={() => setShowPlans(false)}
      />
    </LinearGradient>
  )
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
