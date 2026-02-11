import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type ReadingOpenIconProps = {
  size?: number
  color?: string
  style?: any
}

export default function ReadingOpenIcon({
  size = 16,
  color = '#CBD5E1',
  style,
}: ReadingOpenIconProps) {
  return <Ionicons name="book-outline" size={size} color={color} style={style} />
}

