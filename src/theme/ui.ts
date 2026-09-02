/**
 * Tokens de UI compartilhados — escala tipográfica e espaçamento canônicos, pra que
 * seções, barras e legendas leiam como UM sistema em Match e Grupos. Importe estes em
 * vez de repetir tamanhos soltos (16/15/13...) por tela.
 */
import type { TextStyle } from 'react-native'

export const UI = {
  // Títulos de seção (ex.: "Roda de sinastria", "Sinastria com você", cabeçalhos de card).
  sectionTitle: { fontSize: 15, fontWeight: '800' } as TextStyle,
  // Subtítulo / rótulo de linha.
  subtitle: { fontSize: 13, fontWeight: '700' } as TextStyle,
  // Rótulo pequeno em maiúsculas (ex.: "TZOLKIN", "SOL").
  caps: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' } as TextStyle,
  // Barras de score (label + valor) — mesmas medidas nos 3 match views.
  barLabel: { fontSize: 12, fontWeight: '600' } as TextStyle,
  barValue: { fontSize: 12, fontWeight: '800' } as TextStyle,
  // Nota/disclaimer em itálico.
  disclaimer: { fontSize: 10.5, fontStyle: 'italic', lineHeight: 15 } as TextStyle,
  // Espaçamentos base (múltiplos de 4).
  gap: 8,
  pad: 12,
  radius: 14,
} as const
