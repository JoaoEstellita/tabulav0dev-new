export function cleanUndefined<T extends Record<string, any>>(obj: T | null): T {
  if (!obj) return {} as T
  const isPlainObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v)
  const out: any = Array.isArray(obj) ? [] : {}
  Object.entries(obj as any).forEach(([k, v]) => {
    if (v === undefined || Number.isNaN(v)) return
    if (isPlainObject(v)) {
      const nested = cleanUndefined(v)
      if (Object.keys(nested).length > 0) out[k] = nested
    } else {
      out[k] = v
    }
  })
  return out
}


