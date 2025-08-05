/**
 * 🔍 DEBUG UTILITIES
 * 
 * Para capturar erros de .map mais precisamente
 */

// Interceptador global de erros
export function setupErrorInterceptor() {
  const originalConsoleError = console.error
  
  console.error = (...args) => {
    const errorMessage = args.join(' ')
    
    if (errorMessage.includes("Cannot read property 'map' of undefined")) {
      console.log('🔍 INTERCEPTED MAP ERROR:', {
        timestamp: new Date().toISOString(),
        stack: new Error().stack,
        args: args
      })
    }
    
    // Chamar console.error original
    originalConsoleError.apply(console, args)
  }
}

// Wrapper de array seguro com logging
export function debugSafeMap<T, R>(
  array: T[] | undefined | null,
  callback: (item: T, index: number) => R,
  context: string = 'unknown'
): R[] {
  console.log(`🔍 DEBUG MAP ${context}:`, {
    isArray: Array.isArray(array),
    length: array?.length,
    type: typeof array,
    value: array
  })
  
  if (!array || !Array.isArray(array)) {
    console.warn(`⚠️ ${context}: array is undefined/null:`, array)
    return []
  }
  
  return array.map(callback)
}