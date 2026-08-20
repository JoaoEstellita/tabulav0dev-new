"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useSubscriptionCheck } from "../hooks/useSubscriptionCheck"
import { useAppLanguage } from "../hooks/useAppLanguage"

/**
 * O aviso de que o teste está acabando.
 *
 * ── POR QUE NO 5º DIA, E NÃO NO 7º ─────────────────────────────────────────
 *
 * Travar sem avisar é o que faz a pessoa achar que o app quebrou. Ela abriu seis
 * dias seguidos, viu o dia dela, e no sétimo encontra um cadeado que nunca foi
 * anunciado. A reação não é assinar, é desinstalar.
 *
 * `trialEndsAt` já era calculado em `useSubscriptionCheck` e devolvido pelo
 * hook, e nenhuma tela usava. Só faltava mostrar.
 *
 * Aparece os 7 dias TODOS: desde o cadastro a pessoa sabe que está no período
 * grátis e tem sempre o botão para assinar. Nos primeiros dias é uma pílula
 * sutil (indigo, informativa); nos 2 últimos vira aviso urgente (dourado).
 */
const DIAS_URGENTE = 2 // últimos 2 dias = aviso urgente (dourado); antes = pílula sutil "grátis"

export default function TrialBanner() {
  const { t } = useAppLanguage()
  const navigation = useNavigation<any>()
  const { loading, trialActive, trialEndsAt, subscription, isAdmin } = useSubscriptionCheck()

  // quem já assina ou é admin nunca vê; fora do trial quem manda é o AccessGuard
  if (loading || isAdmin || subscription?.active || !trialActive || !trialEndsAt) return null

  const restam = Math.ceil((trialEndsAt.getTime() - Date.now()) / 86_400_000)
  if (restam < 0) return null // trial acabou → quem manda é o AccessGuard/paywall

  // Aparece os 7 dias TODOS (não só no fim): assim a pessoa sabe desde o cadastro
  // que está no período grátis e tem sempre o botão para assinar. Sutil (indigo)
  // nos primeiros dias; urgente (dourado) nos 2 últimos.
  const urgente = restam <= DIAS_URGENTE
  const texto = restam <= 1
    ? t("trialBanner.hoje") // "Termina hoje" — Math.ceil dá 1 tanto p/ 20h quanto p/ 1h
    : urgente
      ? t("trialBanner.dias").replace("{n}", String(restam))
      : t("trialBanner.gratis").replace("{n}", String(restam))

  return (
    <TouchableOpacity
      style={[styles.faixa, !urgente && styles.faixaChill]}
      onPress={() => navigation.navigate("Premium", { openTab: "features" })}
      activeOpacity={0.85}
    >
      <Ionicons name={urgente ? "time-outline" : "sparkles-outline"} size={16} color={urgente ? "#0F0F23" : "#C7BCFF"} />
      <Text style={[styles.texto, !urgente && styles.textoChill]}>{texto}</Text>
      <Text style={[styles.cta, !urgente && styles.ctaChill]}>{t("trialBanner.cta")}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  faixa: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFD700",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  texto: { flex: 1, color: "#0F0F23", fontSize: 13, fontWeight: "600" },
  cta: {
    color: "#0F0F23",
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // Variante sutil (dias 7→3): indigo translúcido em vez do dourado urgente.
  faixaChill: {
    backgroundColor: "rgba(99,102,241,0.16)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139,124,255,0.30)",
  },
  textoChill: { color: "#E8E4FF" },
  ctaChill: { color: "#C7BCFF" },
})
