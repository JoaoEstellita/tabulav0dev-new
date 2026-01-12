import React from 'react'
import { Image, StyleSheet, View, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const LOADING_SIZE = Math.min(220, Math.round(width * 0.55))

export default function LoadingScreen() {
  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <View style={styles.center}>
        <Image source={require('../../assets/loading.gif')} style={styles.image} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    width: LOADING_SIZE,
    height: LOADING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: LOADING_SIZE,
    height: LOADING_SIZE,
  },
})
