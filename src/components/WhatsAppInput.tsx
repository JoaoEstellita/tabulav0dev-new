import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native"

/**
 * Campo de WhatsApp com código do país (DDI) editável — começa em +55 (Brasil),
 * mas aceita qualquer país (ex.: +1 EUA). Emite o número em E.164 com "+"
 * (`+<ddi><local>`), que o backend guarda e confia (não força 55). Assim números
 * estrangeiros não viram "55...".
 */

// Códigos comuns só para DETECTAR o DDI de um número já salvo (prefixo mais longo
// que casa, com ao menos 8 dígitos locais sobrando). A digitação é livre.
const COMMON_DDI = [
  "1", "7", "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41", "43", "44", "45",
  "46", "47", "48", "49", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63",
  "64", "65", "66", "81", "82", "84", "86", "90", "91", "92", "93", "94", "95", "98", "212", "213",
  "216", "218", "220", "233", "234", "244", "248", "249", "251", "254", "255", "256", "260", "261",
  "263", "264", "297", "298", "350", "351", "352", "353", "354", "355", "356", "357", "358", "359",
  "370", "371", "372", "373", "374", "375", "376", "377", "378", "380", "381", "382", "385", "386",
  "387", "389", "420", "421", "423", "501", "502", "503", "504", "505", "506", "507", "509", "591",
  "592", "593", "595", "598", "852", "853", "855", "856", "880", "886", "960", "961", "962", "963",
  "964", "965", "966", "967", "968", "971", "972", "973", "974", "975", "976", "977", "992", "993",
  "994", "995", "996", "998",
]

export function splitWhatsapp(stored: string, fallbackDdi = "55"): { ddi: string; local: string } {
  const d = String(stored || "").replace(/\D/g, "")
  if (!d) return { ddi: fallbackDdi, local: "" }
  const sorted = COMMON_DDI.slice().sort((a, b) => b.length - a.length)
  for (const c of sorted) {
    if (d.startsWith(c) && d.length - c.length >= 8) return { ddi: c, local: d.slice(c.length) }
  }
  return { ddi: fallbackDdi, local: d }
}

type Props = {
  /** Número guardado (dígitos com código, "+..." ou vazio) — usado só na 1ª montagem. */
  value?: string
  /** Emite o número em E.164 com "+": `+<ddi><local>` (ou "" se vazio). */
  onChange: (e164: string) => void
  defaultDdi?: string
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  placeholder?: string
  placeholderTextColor?: string
  autoFocus?: boolean
}

export default function WhatsAppInput({
  value, onChange, defaultDdi = "55", style, inputStyle, placeholder, placeholderTextColor = "#666", autoFocus,
}: Props) {
  const [init] = useState(() => splitWhatsapp(value || "", defaultDdi))
  const [ddi, setDdi] = useState(init.ddi)
  const [local, setLocal] = useState(init.local)

  const emit = (nextDdi: string, nextLocal: string) => {
    const dd = String(nextDdi || "").replace(/\D/g, "")
    const ll = String(nextLocal || "").replace(/\D/g, "")
    onChange(ll ? `+${dd}${ll}` : "")
  }

  return (
    <View style={[styles.row, style]}>
      <View style={styles.ddiBox}>
        <Text style={styles.plus}>+</Text>
        <TextInput
          style={styles.ddiInput}
          value={ddi}
          onChangeText={(t) => { const v = t.replace(/\D/g, "").slice(0, 4); setDdi(v); emit(v, local) }}
          keyboardType="phone-pad"
          maxLength={4}
        />
      </View>
      <TextInput
        style={[styles.numInput, inputStyle]}
        value={local}
        onChangeText={(t) => { const v = t.replace(/[^\d\s()-]/g, ""); setLocal(v); emit(ddi, v) }}
        keyboardType="phone-pad"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoFocus={autoFocus}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  ddiBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 62,
  },
  plus: { color: "#888", fontSize: 14, marginRight: 1 },
  ddiInput: { color: "#FFFFFF", fontSize: 14, minWidth: 26, padding: 0 },
  numInput: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 14,
  },
})
