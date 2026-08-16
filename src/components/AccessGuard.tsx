"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useSubscriptionCheck } from "../hooks/useSubscriptionCheck"
import { useAppLanguage } from "../hooks/useAppLanguage"
import { registrar } from "../services/eventos"

/**
 * O portão de assinatura, em um lugar só.
 *
 * ── POR QUE EXISTE ─────────────────────────────────────────────────────────
 *
 * O trial de sete dias já existia em `useSubscriptionCheck`, mas só mordia nos
 * Grupos e nas Previsões. O que a pessoa abre TODO DIA — o status do dia e as
 * oito áreas, na aba inicial — ficava aberto para sempre. O João resumiu o
 * efeito: "só estamos cobrando pelo uso do agente do whatsapp".
 *
 * `GroupsAccessGuard` já resolvia o problema inteiro (loading, admin, trial,
 * assinatura ativa) e estava preso a uma tela. Aqui ele vira componente
 * genérico, para o portão não ser copiado em cada tela que passar a travar —
 * cópia é como uma delas fica para trás quando a regra mudar.
 *
 * ── O QUE NUNCA TRAVA ──────────────────────────────────────────────────────
 *
 * A carta natal e o perfil astrológico. As peças de marketing prometem "mapa
 * completo e gratuito no link da bio", e trancar isso invalidaria o funil
 * inteiro. O que vira assinatura é o que se repete: o dia, as previsões, os
 * trânsitos, os grupos.
 */
type Props = {
  children: React.ReactNode
  /** Chave i18n do título. Cada tela diz o que ela é. */
  tituloKey?: string
  /** Chave i18n do texto que explica o que se ganha assinando. */
  textoKey?: string
}

export default function AccessGuard({
  children,
  tituloKey = "accessGuard.title",
  textoKey = "accessGuard.subtitle",
}: Props) {
  const { t } = useAppLanguage()
  const navigation = useNavigation<any>()
  const { loading, subscription, trialActive, isAdmin } = useSubscriptionCheck()

  // admin passa por tudo; o trial vale enquanto durar; depois, só assinatura
  const hasAccess = !!(isAdmin || trialActive || subscription?.active)

  /**
   * Quantas pessoas batem no portão, e quantas assinam depois.
   *
   * É a taxa que decide se o paywall está no lugar certo. Sem ela, mexer no
   * que trava seria chute — e foi exatamente o buraco que apareceu quando o
   * João perguntou como fazer o melhor conteúdo possível.
   *
   * Depois de `loading` para não contar quem só passou pela tela de carregando.
   */
  React.useEffect(() => {
    if (!loading && !hasAccess) registrar("paywall_visto", { tela: tituloKey })
  }, [loading, hasAccess, tituloKey])

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      </LinearGradient>
    )
  }

  if (hasAccess) return <>{children}</>

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={48} color="#FFD700" />
        <Text style={styles.title}>{t(tituloKey)}</Text>
        <Text style={styles.subtitle}>{t(textoKey)}</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Premium", { openTab: "features" })}
        >
          <Text style={styles.ctaText}>{t("accessGuard.cta")}</Text>
        </TouchableOpacity>
        {/**
         * A saída para o mapa fica À VISTA.
         *
         * Sem ela o bloqueio lê como "o app acabou", e a pessoa fecha. O mapa
         * continua sendo dela, de graça e para sempre; dizer isso na tela do
         * portão é o que separa um limite de uma porta na cara.
         */}
        <TouchableOpacity
          style={styles.linkLivre}
          onPress={() => navigation.navigate("AstroProfile")}
        >
          <Text style={styles.linkLivreTexto}>{t("accessGuard.free")}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  ctaText: { color: "#0F0F23", fontWeight: "bold", fontSize: 14 },
  linkLivre: { marginTop: 20, paddingVertical: 8 },
  linkLivreTexto: {
    color: "#B0B0B0",
    fontSize: 13,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  loadingText: { color: "#FFFFFF", fontSize: 14, textAlign: "center" },
})
