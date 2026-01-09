import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

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
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 140,
  },
})
