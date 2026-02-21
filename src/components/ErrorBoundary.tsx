import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 ERROR BOUNDARY CAUGHT:', error)
    console.error('🔥 ERROR INFO:', errorInfo)
    console.error('🔥 COMPONENT STACK:', errorInfo.componentStack)

    // Verificar se é o erro de .map
    if (error.message.includes("Cannot read property 'map' of undefined")) {
      console.error('🎯 CAUGHT MAP ERROR! Component stack:', errorInfo.componentStack)
    }

    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Ionicons name="warning" size={48} color="#EF4444" />
            <Text style={styles.title}>Oops! Algo deu errado</Text>
            <Text style={styles.message}>
              Encontramos um erro técnico. O app está sendo corrigido.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              <Text style={styles.retryText}>Tentar Novamente</Text>
            </TouchableOpacity>

            {(
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>
                  {this.state.error?.message}
                </Text>
                <Text style={styles.debugText}>
                  {this.state.errorInfo?.componentStack}
                </Text>
              </View>
            )}
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#1A1A3A',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#0F0F23',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
    maxWidth: 280,
  },
  debugTitle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 14,
  },
})