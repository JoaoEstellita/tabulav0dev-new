"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import ResponsiveContainer from "../../components/ResponsiveContainer"
import { FONT_SIZES, SPACING, isDesktop, isTablet } from "../../styles/responsive"

// Componente Logo
const Logo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoCircle}>
      {/* Logo SVG da Tábula Estelar */}
      <svg width={isDesktop() ? 120 : 80} height={isDesktop() ? 120 : 80} viewBox="0 0 100 100" style={styles.logoSvg}>
        {/* Roda do navio */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="3"/>
        {/* 8 raios da roda */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 30 * Math.cos(angle * Math.PI / 180)}
            y2={50 + 30 * Math.sin(angle * Math.PI / 180)}
            stroke="#FFD700"
            strokeWidth="2"
          />
        ))}
        {/* Olho central */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill="none" stroke="#FFD700" strokeWidth="2"/>
        {/* Pupila estrela */}
        <polygon
          points="50,46 52,50 50,54 48,50"
          fill="#FFFFFF"
          stroke="#FFD700"
          strokeWidth="1"
        />
        {/* Estrelas pequenas */}
        {[15, 25, 35, 65, 75, 85].map((angle, i) => (
          <circle
            key={i}
            cx={50 + 20 * Math.cos(angle * Math.PI / 180)}
            cy={50 + 20 * Math.sin(angle * Math.PI / 180)}
            r="1"
            fill="#FFFFFF"
          />
        ))}
      </svg>
    </View>
    <Text style={styles.title}>TÁBULA</Text>
    <Text style={styles.subtitle}>ESTELAR</Text>
    <Text style={styles.tagline}>Seu guia astrológico pessoal</Text>
  </View>
)

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos")
      return
    }

    // Validação de confirmação de senha no cadastro
    if (!isLogin) {
      if (!confirmPassword) {
        Alert.alert("Erro", "Confirme sua senha")
        return
      }
      if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem")
        return
      }
      if (password.length < 6) {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
        return
      }
    }

    setLoading(true)
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <ResponsiveContainer>
            <View style={styles.content}>
              <Logo />
              
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                  {isLogin ? "Entrar" : "Criar Conta"}
                </Text>
                
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmar senha"
                      placeholderTextColor="#666"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.authButton, loading && styles.disabledButton]}
                  onPress={handleAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <Text style={styles.authButtonText}>Carregando...</Text>
                  ) : (
                    <Text style={styles.authButtonText}>
                      {isLogin ? "Entrar" : "Cadastrar"}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.googleButton, googleLoading && styles.disabledButton]}
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#000" />
                  <Text style={styles.googleButtonText}>
                    {googleLoading ? "Carregando..." : "Continuar com Google"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={styles.switchText}>
                    {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ResponsiveContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isDesktop() ? 600 : 'auto',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: isDesktop() ? 120 : 80,
    height: isDesktop() ? 120 : 80,
    borderRadius: isDesktop() ? 60 : 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoSvg: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    marginTop: -SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.sm,
    color: '#A0A0A0',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: isDesktop() ? 400 : '100%',
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  formTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
  },
  authButton: {
    backgroundColor: '#FFD700',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  authButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  googleButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  switchText: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
})
