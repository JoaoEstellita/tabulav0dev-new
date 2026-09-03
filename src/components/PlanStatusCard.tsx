"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"
import { useAuth } from "../hooks/useAuth"
import { useSubscriptionCheck } from "../hooks/useSubscriptionCheck"
import { useAppLanguage } from "../hooks/useAppLanguage"
import {
  getPlanById, getProfileLimit, getGroupLimit, getMonthlyMsgCap,
  PLAN_DEFINITIONS, PROFILE_EXTRA_PRICE, MONTHLY_MSG_CAP_BY_TIER, FREE_WEEKLY_MSG,
} from "../constants/plans"

// Paleta cósmica (mesma do app dark).
const C = { card: "#16162b", card2: "#1e1e3a", line: "rgba(255,255,255,.10)", ink: "#ece9f7", dim: "#9c96c6", faint: "#6b6690", gold: "#FFD700", green: "#46d39a", vedic: "#6c8cff" }

type Status = {
  planLabel: string
  isPremium: boolean
  isAdmin: boolean
  trial: boolean
  msgUsed: number; msgCap: number
  profilesUsed: number; profileLimit: number; profileExtra: number
  groupsUsed: number; groupLimit: number
  msgCredits: number
}

function liveMsgCredits(lots: any[]): number {
  const t = Date.now()
  return (Array.isArray(lots) ? lots : [])
    .filter((l) => l && Number(l.remaining) > 0 && Date.parse(l.expiresAt) > t)
    .reduce((s, l) => s + Number(l.remaining || 0), 0)
}

export default function PlanStatusCard() {
  const { t } = useAppLanguage()
  const tr = (key: string, fallback: string) => { const v = t(key); return v === key ? fallback : v }
  const { user } = useAuth()
  const { subscription, isAdmin, trialActive } = useSubscriptionCheck()
  const navigation = useNavigation<any>()
  const [st, setSt] = useState<Status | null>(null)
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!user?.uid) return
      const planId = (subscription as any)?.planId || null
      const active = !!subscription?.active
      const isPremium = active || !!isAdmin
      try {
        // Cada leitura é tolerante: se a regra do Firestore bloquear waAgentContext/
        // waMsgCredits (sem regra própria hoje), o card ainda mostra o resto.
        const [uSnap, ctxSnap, credSnap, grpSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)).catch(() => null),
          getDoc(doc(db, "waAgentContext", user.uid)).catch(() => null),
          getDoc(doc(db, "waMsgCredits", user.uid)).catch(() => null),
          getDocs(query(collection(db, "groups"), where("createdBy", "==", user.uid))).catch(() => null),
        ])
        if (!alive) return
        const u: any = uSnap?.exists?.() ? uSnap.data() : {}
        const ctx: any = ctxSnap?.exists?.() ? ctxSnap.data() : {}
        const monthIso = new Date().toISOString().slice(0, 7)
        const msgUsed = ctx?.monthCountKey === monthIso ? (ctx?.monthCount || 0) : 0
        const plan = getPlanById(planId)
        const planLabel = isAdmin ? "Admin" : active ? (plan?.name || "Premium") : trialActive ? tr("settings.plan.trial", "Teste grátis") : tr("settings.plan.free", "Grátis")
        setSt({
          planLabel,
          isPremium, isAdmin: !!isAdmin, trial: !!trialActive && !active,
          msgUsed, msgCap: getMonthlyMsgCap({ planId, isPremium, isAdmin }),
          profilesUsed: Number(u?.monitoringProfilesCreated) || 0,
          profileLimit: getProfileLimit({ planId, isPremium, isAdmin }),
          profileExtra: Number(u?.profileCreditsExtra) || 0,
          groupsUsed: grpSnap?.size || 0,
          groupLimit: getGroupLimit({ planId, isPremium, isAdmin }),
          msgCredits: liveMsgCredits(credSnap?.exists?.() ? (credSnap.data() as any)?.lots : []),
        })
      } catch { /* silencioso — o card só não aparece */ }
    })()
    return () => { alive = false }
  }, [user?.uid, subscription, isAdmin, trialActive, t])

  if (!st) return null
  const goPremium = () => navigation.navigate("Premium", { openTab: "features" })
  const cap = (n: number) => (Number.isFinite(n) ? String(n) : "∞")

  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <Text style={s.title}>{tr("settings.plan.title", "Meu plano")}</Text>
        <View style={s.badge}><Text style={s.badgeTxt}>{st.planLabel}</Text></View>
      </View>

      {/* Uso e limites */}
      <View style={s.rows}>
        <Meter label={tr("settings.plan.waMsgs", "Conversas de IA (mês)")} used={st.msgUsed} total={st.msgCap} color={C.vedic} />
        <Meter label={tr("settings.plan.profiles", "Perfis de monitoramento")} used={st.profilesUsed} total={st.profileLimit + st.profileExtra} color={C.green} />
        <Meter label={tr("settings.plan.groups", "Grupos criados")} used={st.groupsUsed} total={st.groupLimit} color={C.gold} />
      </View>

      {/* Créditos avulsos */}
      {(st.msgCredits > 0 || st.profileExtra > 0) && (
        <View style={s.credits}>
          {st.msgCredits > 0 && <Text style={s.creditTxt}>💬 {st.msgCredits} {tr("settings.plan.extraMsgs", "mensagens extra")}</Text>}
          {st.profileExtra > 0 && <Text style={s.creditTxt}>👤 {st.profileExtra} {tr("settings.plan.extraProfiles", "perfis extra")}</Text>}
        </View>
      )}

      {/* Ações */}
      <View style={s.actions}>
        <TouchableOpacity style={[s.btn, s.btnGold]} onPress={goPremium}>
          <Ionicons name="rocket-outline" size={16} color="#2b230a" />
          <Text style={s.btnGoldTxt}>{st.isPremium ? tr("settings.plan.upgrade", "Trocar / renovar plano") : tr("settings.plan.subscribe", "Assinar")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={goPremium}>
          <Ionicons name="add-circle-outline" size={16} color={C.gold} />
          <Text style={s.btnGhostTxt}>{tr("settings.plan.buyMore", "Comprar mais")}</Text>
        </TouchableOpacity>
      </View>

      {/* Tabela completa de planos */}
      <TouchableOpacity style={s.tableToggle} onPress={() => setShowTable((v) => !v)}>
        <Text style={s.tableToggleTxt}>{tr("settings.plan.compare", "Comparar planos e benefícios")}</Text>
        <Ionicons name={showTable ? "chevron-up" : "chevron-down"} size={16} color={C.dim} />
      </TouchableOpacity>
      {showTable && <PlanComparison tr={tr} />}
    </View>
  )
}

function Meter({ label, used, total, color }: { label: string; used: number; total: number; color: string }) {
  const unlimited = !Number.isFinite(total)
  const pct = unlimited || total <= 0 ? 0 : Math.min(100, Math.round((used / total) * 100))
  return (
    <View style={s.meter}>
      <View style={s.meterTop}>
        <Text style={s.meterLabel}>{label}</Text>
        <Text style={s.meterVal}>{used}{unlimited ? "" : ` / ${total}`}</Text>
      </View>
      <View style={s.track}><View style={[s.fill, { width: `${unlimited ? 6 : pct}%`, backgroundColor: color }]} /></View>
    </View>
  )
}

// Tabela comparativa compacta (grátis + 3 planos). Dados de PLAN_DEFINITIONS + limites.
function PlanComparison({ tr }: { tr: (k: string, f: string) => string }) {
  const monthly = PLAN_DEFINITIONS.filter((p) => p.billingPeriod === "monthly")
  const dot = (on: boolean, color: string) => on ? <View style={[s.cdot, { backgroundColor: color }]} /> : <Text style={s.cno}>–</Text>
  const cols = [
    { key: "free", name: tr("settings.plan.free", "Grátis"), color: C.green },
    { key: "essential", name: "Essential", color: C.dim },
    { key: "pro", name: "Pro", color: C.vedic },
    { key: "premium", name: "Premium", color: C.gold },
  ]
  const rows: { label: string; vals: (string | boolean)[] }[] = [
    { label: tr("settings.plan.row.map", "Mapa completo (4 sistemas)"), vals: [true, true, true, true] },
    { label: tr("settings.plan.row.transits", "Trânsitos + 8 áreas"), vals: [true, true, true, true] },
    { label: tr("settings.plan.row.match", "Match + sinastria"), vals: [true, true, true, true] },
    { label: tr("settings.plan.row.profiles", "Perfis de monitoramento"), vals: ["1", "1", "2", "5"] },
    { label: tr("settings.plan.row.groups", "Grupos que cria"), vals: ["1", "1", "2", "3"] },
    { label: tr("settings.plan.row.wa", "IA no WhatsApp"), vals: [`${FREE_WEEKLY_MSG}/sem`, `${MONTHLY_MSG_CAP_BY_TIER.essential}/mês`, `${MONTHLY_MSG_CAP_BY_TIER.pro}/mês`, `${MONTHLY_MSG_CAP_BY_TIER.premium}/mês`] },
    { label: tr("settings.plan.row.forecast", "Previsões"), vals: [false, "30d", "90d", "360d"] },
    { label: tr("settings.plan.row.returns", "Retorno Solar/Lunar"), vals: [false, true, true, true] },
    { label: tr("settings.plan.row.moment", "Momento Certo"), vals: [false, false, true, true] },
    { label: tr("settings.plan.row.astromap", "Astrocartografia"), vals: [false, false, true, true] },
  ]
  return (
    <View style={s.cmpWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={s.cmpHead}>
            <View style={s.cmpLabelCell} />
            {cols.map((c, i) => (
              <View key={i} style={s.cmpCell}>
                <Text style={[s.cmpColName, { color: c.color }]}>{c.name}</Text>
                <Text style={s.cmpColPrice}>{i === 0 ? "—" : i === 1 ? "19,90" : i === 2 ? "47,90" : "79,90"}</Text>
              </View>
            ))}
          </View>
          {rows.map((r, ri) => (
            <View key={ri} style={[s.cmpRow, ri % 2 === 0 && s.cmpRowAlt]}>
              <View style={s.cmpLabelCell}><Text style={s.cmpLabel}>{r.label}</Text></View>
              {r.vals.map((v, ci) => (
                <View key={ci} style={s.cmpCell}>
                  {typeof v === "boolean" ? dot(v, cols[ci].color) : <Text style={s.cmpVal}>{v}</Text>}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <Text style={s.cmpFoot}>{tr("settings.plan.avulsos", `Avulsos (assinante): perfil extra R$ ${PROFILE_EXTRA_PRICE.toFixed(2).replace(".", ",")} · mensagens 10/R$9,90 · 30/R$27,90 · 60/R$44,90`)}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 16, marginHorizontal: 16, marginTop: 12, marginBottom: 4 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: C.ink, fontSize: 16, fontWeight: "800" },
  badge: { backgroundColor: "rgba(255,215,0,.14)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  badgeTxt: { color: C.gold, fontWeight: "800", fontSize: 12.5 },
  rows: { marginTop: 14, gap: 12 },
  meter: {},
  meterTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  meterLabel: { color: C.dim, fontSize: 13.5 },
  meterVal: { color: C.ink, fontSize: 13.5, fontWeight: "700" },
  track: { height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,.08)", overflow: "hidden" },
  fill: { height: 7, borderRadius: 4 },
  credits: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  creditTxt: { color: C.ink, fontSize: 13, backgroundColor: C.card2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  btn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: 10 },
  btnGold: { backgroundColor: C.gold },
  btnGoldTxt: { color: "#2b230a", fontWeight: "800", fontSize: 14 },
  btnGhost: { borderWidth: 1, borderColor: "rgba(255,215,0,.5)" },
  btnGhostTxt: { color: C.gold, fontWeight: "700", fontSize: 14 },
  tableToggle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.line },
  tableToggleTxt: { color: C.dim, fontSize: 14, fontWeight: "600" },
  cmpWrap: { marginTop: 12 },
  cmpHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line, paddingBottom: 8 },
  cmpRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9 },
  cmpRowAlt: { backgroundColor: "rgba(255,255,255,.02)" },
  cmpLabelCell: { width: 150, paddingRight: 8, justifyContent: "center" },
  cmpLabel: { color: C.ink, fontSize: 12.5 },
  cmpCell: { width: 62, alignItems: "center", justifyContent: "center" },
  cmpColName: { fontSize: 13, fontWeight: "800" },
  cmpColPrice: { color: C.faint, fontSize: 10.5, marginTop: 2 },
  cmpVal: { color: C.ink, fontSize: 12, fontWeight: "700" },
  cdot: { width: 9, height: 9, borderRadius: 5 },
  cno: { color: C.faint, fontSize: 14 },
  cmpFoot: { color: C.faint, fontSize: 11.5, marginTop: 10, lineHeight: 16 },
})
