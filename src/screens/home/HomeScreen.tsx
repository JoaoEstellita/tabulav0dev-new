"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"

const { width } = Dimensions.get("window")

interface DailyHoroscope {
  sign: string
  prediction: string
  mood: string
  luckyNumber: number
}

export default function HomeScreen() {
  const { user } = useAuth()
  const [dailyHoroscope, setDailyHoroscope] = useState<DailyHoroscope | null>(null)

  useEffect(() => {
    // Simulação de dados do horóscopo diário
    setDailyHoroscope({
      sign: "Áries",
      prediction:
        "Hoje é um dia favorável para novos começos. A energia está alta e você se sentirá motivado a iniciar projetos importantes.",
      mood: "Energético",
      luckyNumber: 7,
    })
  }, [])

  const quickActions = [
    { title: "Mapa Astral", icon: "star-outline", color: "#FF6B6B" },
    { title: "Trânsitos", icon: "planet-outline", color: "#4ECDC4" },
    { title: "Compatibilidade", icon: "heart-outline", color: "#45B7D1" },
    { title: "Previsões", icon: "eye-outline", color: "#96CEB4" },
  ]

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.email?.split("@")[0]}!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Horóscopo Diário */}
        {dailyHoroscope && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.cardTitle}>Horóscopo de {dailyHoroscope.sign}</Text>
            </View>
            <Text style={styles.prediction}>{dailyHoroscope.prediction}</Text>
            <View style={styles.horoscopeDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Humor:</Text>
                <Text style={styles.detailValue}>{dailyHoroscope.mood}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Número da Sorte:</Text>
                <Text style={styles.detailValue}>{dailyHoroscope.luckyNumber}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Ações Rápidas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fases da Lua */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={24} color="#C0C0C0" />
            <Text style={styles.cardTitle}>Fase da Lua</Text>
          </View>
          <View style={styles.moonPhase}>
            <Text style={styles.moonPhaseText}>🌕 Lua Cheia</Text>
            <Text style={styles.moonDescription}>Momento ideal para manifestações e rituais de gratidão</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#8E8E93",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  prediction: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 16,
  },
  horoscopeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionItem: {
    width: (width - 80) / 2,
    alignItems: "center",
    marginBottom: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  moonPhase: {
    alignItems: "center",
  },
  moonPhaseText: {
    fontSize: 20,
    marginBottom: 8,
  },
  moonDescription: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
})
