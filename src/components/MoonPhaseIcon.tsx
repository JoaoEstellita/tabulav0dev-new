import React from 'react'
import { View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { getMoonSvg, MoonSvgKey } from '../assets/moon/moonSvgs'

export default function MoonPhaseIcon({
  phaseKey,
  size = 28
}: {
  phaseKey: MoonSvgKey | null
  size?: number
}) {
  return (
    <View style={{ width: size, height: size }}>
      <SvgXml xml={getMoonSvg(phaseKey)} width={size} height={size} />
    </View>
  )
}
