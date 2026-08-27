"use client"

import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createPixPayment } from "../services/payment/PixService"
import { MercadoPagoService } from "../services/payment/MercadoPagoService"
import InviteService from "../services/InviteService"
import { useAppLanguage } from "../hooks/useAppLanguage"

/**
 * PIX dentro do app (avulso, 1 mês) — menos toques: sem sair pro checkout hosted.
 * Gera o copia-e-cola + QR, e libera o plano sozinho (poll no sync que já busca o
 * pagamento aprovado do usuário no MP).
 */
type PlanLite = { id: string; name: string; price: number; months?: number }
type Props = {
  visible: boolean
  onClose: () => void
  plan: PlanLite | null
  userId: string
  email: string
  name?: string
  onActivated?: () => void
}

const L: Record<string, Record<string, string>> = {
  "pt-BR": { title: "Pague com PIX", copy: "Copiar código PIX", copied: "Código PIX copiado!", instr: "Abra o app do banco → PIX → Copia e cola. Seu plano libera automático após o pagamento.", check: "Já paguei", checking: "Verificando…", waiting: "Aguardando pagamento…", ok: "Pagamento confirmado! Plano liberado.", fail: "Não foi possível gerar o PIX. Tente novamente.", close: "Fechar" },
  "en-US": { title: "Pay with PIX", copy: "Copy PIX code", copied: "PIX code copied!", instr: "Open your bank app → PIX → Paste code. Your plan unlocks automatically after payment.", check: "I paid", checking: "Checking…", waiting: "Waiting for payment…", ok: "Payment confirmed! Plan unlocked.", fail: "Could not generate PIX. Try again.", close: "Close" },
  "es-ES": { title: "Paga con PIX", copy: "Copiar codigo PIX", copied: "Codigo PIX copiado!", instr: "Abre la app del banco → PIX → Pega el codigo. Tu plan se activa solo tras el pago.", check: "Ya pague", checking: "Verificando…", waiting: "Esperando el pago…", ok: "Pago confirmado! Plan activado.", fail: "No se pudo generar el PIX. Intenta de nuevo.", close: "Cerrar" },
  "it-IT": { title: "Paga con PIX", copy: "Copia codice PIX", copied: "Codice PIX copiato!", instr: "Apri l app della banca → PIX → Incolla il codice. Il piano si attiva da solo dopo il pagamento.", check: "Ho pagato", checking: "Verifica…", waiting: "In attesa del pagamento…", ok: "Pagamento confermato! Piano attivo.", fail: "Impossibile generare il PIX. Riprova.", close: "Chiudi" },
}

export default function PixCheckoutModal({ visible, onClose, plan, userId, email, name, onActivated }: Props) {
  const { language } = useAppLanguage()
  const t = L[language] || L["pt-BR"]
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState<string | null>(null)
  const [qrB64, setQrB64] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [status, setStatus] = useState<"waiting" | "checking" | "ok">("waiting")
  const pollRef = useRef<any>(null)
  const startedAt = useRef(0)

  useEffect(() => {
    if (!visible || !plan) return
    let active = true
    setLoading(true); setError(false); setCode(null); setQrB64(null); setStatus("waiting")
    ;(async () => {
      try {
        const r = await createPixPayment({
          userId, planId: plan.id, months: plan.months || 1, amount: plan.price,
          payerEmail: email, payerName: name, description: plan.name,
        })
        if (!active) return
        setCode(r.qrCode || null)
        setQrB64(r.qrCodeBase64 || null)
        if (!r.qrCode && !r.qrCodeBase64) setError(true)
      } catch { if (active) setError(true) } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [visible, plan?.id])

  // Poll: a cada 6s pergunta ao backend se o pagamento aprovou (sync ativa na hora).
  useEffect(() => {
    if (!visible || loading || error) return
    startedAt.current = Date.now()
    const tick = async () => {
      if (Date.now() - startedAt.current > 3 * 60 * 1000) { clearInterval(pollRef.current); return } // para após 3min
      try {
        const r = await MercadoPagoService.syncMercadoPago(userId)
        if (r.activated || r.status === "active") {
          clearInterval(pollRef.current)
          setStatus("ok")
          onActivated?.()
          setTimeout(() => onClose(), 1800)
        }
      } catch { /* ignora */ }
    }
    pollRef.current = setInterval(tick, 6000)
    return () => clearInterval(pollRef.current)
  }, [visible, loading, error, userId])

  const verificarAgora = async () => {
    setStatus("checking")
    try {
      const r = await MercadoPagoService.syncMercadoPago(userId)
      if (r.activated || r.status === "active") { setStatus("ok"); onActivated?.(); setTimeout(() => onClose(), 1500) }
      else setStatus("waiting")
    } catch { setStatus("waiting") }
  }

  const copiar = () => { if (code) InviteService.copyToClipboard(code, t.copied) }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.title}{plan ? ` · R$ ${plan.price.toFixed(2)}` : ""}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#B0B0B0" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {loading ? (
              <ActivityIndicator color="#FFD700" style={{ marginVertical: 30 }} />
            ) : error ? (
              <Text style={styles.err}>{t.fail}</Text>
            ) : status === "ok" ? (
              <View style={styles.okBox}>
                <Ionicons name="checkmark-circle" size={44} color="#4ADE80" />
                <Text style={styles.okText}>{t.ok}</Text>
              </View>
            ) : (
              <>
                {qrB64 ? (
                  <Image source={{ uri: `data:image/png;base64,${qrB64}` }} style={styles.qr} resizeMode="contain" />
                ) : null}
                <TouchableOpacity style={styles.copyBtn} onPress={copiar} activeOpacity={0.85}>
                  <Ionicons name="copy" size={18} color="#0F0F23" />
                  <Text style={styles.copyText}>{t.copy}</Text>
                </TouchableOpacity>
                {code ? <Text style={styles.code} numberOfLines={2} selectable>{code}</Text> : null}
                <Text style={styles.instr}>{t.instr}</Text>
                <TouchableOpacity style={styles.checkBtn} onPress={verificarAgora} activeOpacity={0.85} disabled={status === "checking"}>
                  <Text style={styles.checkText}>{status === "checking" ? t.checking : t.check}</Text>
                </TouchableOpacity>
                <Text style={styles.waiting}>{t.waiting}</Text>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  card: { backgroundColor: "#14142B", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 28, maxHeight: "88%" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  title: { color: "#FFD700", fontSize: 17, fontWeight: "700", flex: 1 },
  body: { alignItems: "center", padding: 20, gap: 12 },
  qr: { width: 200, height: 200, backgroundColor: "#fff", borderRadius: 10 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFD700", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  copyText: { color: "#0F0F23", fontWeight: "700", fontSize: 15 },
  code: { color: "#8A8A9A", fontSize: 11, textAlign: "center", paddingHorizontal: 10 },
  instr: { color: "#B0B0B0", fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 8 },
  checkBtn: { borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  checkText: { color: "#E0E0E0", fontWeight: "600", fontSize: 14 },
  waiting: { color: "#6A6A7A", fontSize: 12 },
  err: { color: "#ff8a80", fontSize: 14, textAlign: "center", marginVertical: 24 },
  okBox: { alignItems: "center", gap: 12, marginVertical: 24 },
  okText: { color: "#4ADE80", fontSize: 15, fontWeight: "600", textAlign: "center" },
})
