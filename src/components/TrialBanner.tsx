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
 * Aparece nos dois últimos dias. Antes disso seria cobrança cedo demais, e a
 * pessoa ainda está descobrindo o produto.
 */
const DIAS_PARA_AVISAR = 2

export default function TrialBanner() {
  const { t } = useAppLanguage()
  const navigation = useNavigation<any>()
  const { loading, trialActive, trialEndsAt, subscription, isAdmin } = useSubscriptionCheck()

  // quem já assina ou é admin nunca vê; fora do trial quem manda é o AccessGuard
  if (loading || isAdmin || subscription?.active || !trialActive || !trialEndsAt) return null

  const restam = Math.ceil((trialEndsAt.getTime() - Date.now()) / 86_400_000)
  if (restam > DIAS_PARA_AVISAR || restam < 0) return null

  /**
   * "Termina hoje" quando falta menos de um dia.
   *
   * `Math.ceil` devolve 1 tanto para vinte horas quanto para uma, e "falta 1
   * dia" às onze da noite é falso. Zero e um viram a mesma frase.
   */
  const texto = restam <= 1
    ? t("trialBanner.hoje")
    : t("trialBanner.dias").replace("{n}", String(restam))

  return (
    <TouchableOpacity
      style={styles.faixa}
      onPress={() => navigation.navigate("Premium", { openTab: "features" })}
      activeOpacity={0.85}
    >
      <Ionicons name="time-outline" size={16} color="#0F0F23" />
      <Text style={styles.texto}>{texto}</Text>
      <Text style={styles.cta}>{t("trialBanner.cta")}</Text>
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
})
