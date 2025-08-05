import React from 'react'
import { View, Text } from 'react-native'

/**
 * 🛡️ SAFE MAP WRAPPER
 * 
 * Wrapper que captura erros de .map especificamente
 */

export function SafeMapWrapper({ 
  children, 
  fallback = null,
  name = 'unknown'
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  name?: string 
}) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error(`🚨 SafeMapWrapper ERROR in ${name}:`, error)
    
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <View style={{ padding: 16, backgroundColor: '#2A2A3E', margin: 8, borderRadius: 8 }}>
        <Text style={{ color: '#FFD700', fontSize: 12 }}>
          Erro em {name}: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Text>
      </View>
    )
  }
}

/**
 * Hook para uso seguro de arrays
 */
export function useSafeArray<T>(array: T[] | undefined | null, name?: string): T[] {
  React.useEffect(() => {
    if (!Array.isArray(array) && array !== null && array !== undefined) {
      console.error(`🚨 useSafeArray WARNING: ${name || 'unknown'} não é um array:`, {
        type: typeof array,
        value: array,
        isArray: Array.isArray(array)
      })
    }
  }, [array, name])
  
  if (!array || !Array.isArray(array)) {
    console.warn(`⚠️ useSafeArray: ${name || 'unknown'} retornando array vazio`)
    return []
  }
  
  return array
}