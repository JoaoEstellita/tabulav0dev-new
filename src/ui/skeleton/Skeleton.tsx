import React from 'react'
import { Platform, View } from 'react-native'

export function Skeleton({ height = 16, width = '100%', radius = 8, style }: { height?: number; width?: number | string; radius?: number; style?: any }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{
        height,
        width,
        borderRadius: radius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)',
        backgroundSize: '400% 100%',
        animation: 'skeletonShimmer 900ms ease-in-out infinite',
        ...style,
      }} />
    )
  }
  return (
    <View style={{ height, width, borderRadius: radius, backgroundColor: 'rgba(255,255,255,0.08)', ...style }} />
  )
}


