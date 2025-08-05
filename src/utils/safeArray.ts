/**
 * 🛡️ SAFE ARRAY UTILITIES
 * 
 * Utilities para evitar erros de "Cannot read property 'map' of undefined"
 */

export function safeMap<T, R>(
  array: T[] | undefined | null, 
  callback: (item: T, index: number) => R
): R[] {
  if (!array || !Array.isArray(array)) {
    console.warn('⚠️ safeMap: Tentativa de mapear array undefined/null:', array)
    return []
  }
  
  return array.map(callback)
}

export function safeEntries<T>(
  object: Record<string, T> | undefined | null
): [string, T][] {
  if (!object || typeof object !== 'object') {
    console.warn('⚠️ safeEntries: Tentativa de obter entries de objeto undefined/null:', object)
    return []
  }
  
  return Object.entries(object)
}

export function safeFilter<T>(
  array: T[] | undefined | null, 
  callback: (item: T, index: number) => boolean
): T[] {
  if (!array || !Array.isArray(array)) {
    console.warn('⚠️ safeFilter: Tentativa de filtrar array undefined/null:', array)
    return []
  }
  
  return array.filter(callback)
}