/**
 * Normalização de texto para COMPARAÇÃO — nunca para exibição.
 *
 * Existe porque os guards de qualidade do catálogo (listas de linguagem
 * determinística, mojibake, boilerplate) foram escritos quando o corpus curado
 * estava todo sem acento. Ao acentuar o corpus, um guard que compara
 * `texto.includes('inevitavel')` para de casar com "inevitável" e fica verde
 * para sempre sem pegar nada — falha silenciosa, o pior tipo.
 *
 * A solução é deixar as listas de token como estão (sem acento) e tornar a
 * COMPARAÇÃO insensível a acento. Assim os guards não apodrecem de novo quando
 * mais texto for acentuado.
 */
export function deaccentLower(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Assinatura de mojibake, não a mera presença de "Ã"/"Â".
 *
 * UTF-8 lido como latin-1 produz um byte C3/C2 seguido de um byte da faixa de
 * continuação (0x80–0xBF): "ã" vira "Ã£", "ç" vira "Ã§", o espaço fino vira "Â ".
 * Testar só o "Ã" ou o "Â" isolado gera falso positivo em português correto —
 * "Ângulo", "Âncora", "Ânimo" começam com Â, e caixa alta produz "IRMÃS".
 * O guard antigo derrubava esses textos como se fossem corrompidos.
 */
export function hasMojibake(value: string): boolean {
  const text = String(value || '')
  if (text.includes('�')) return true
  return /[\u00C2\u00C3][\u0080-\u00BF]/.test(text)
}
