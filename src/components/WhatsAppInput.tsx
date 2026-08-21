import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native"
import { splitWhatsapp, toE164 } from "../utils/phoneWhatsapp"

export { splitWhatsapp } from "../utils/phoneWhatsapp"

/**
 * Campo de WhatsApp com código do país (DDI) editável — começa em +55 (Brasil),
 * mas aceita qualquer país (ex.: +1 EUA). Emite o número em E.164 com "+"
 * (`+<ddi><local>`), que o backend guarda e confia (não força 55). Assim números
 * estrangeiros não viram "55...".
 */

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

  const emit = (nextDdi: string, nextLocal: string) => onChange(toE164(nextDdi, nextLocal))

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
