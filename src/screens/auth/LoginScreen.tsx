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
      {/* Logo da Tábula Estelar - Versão React Native */}
      <View style={styles.logoInner}>
        {/* Roda do navio */}
        <View style={styles.wheel}>
          {/* Olho central */}
          <View style={styles.eye}>
            {/* Pupila estrela */}
            <View style={styles.pupil} />
          </View>
        </View>
        {/* Estrelas pequenas */}
        <View style={styles.star1} />
        <View style={styles.star2} />
        <View style={styles.star3} />
      </View>
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
  logoInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    position: 'absolute',
    width: isDesktop() ? 60 : 40,
    height: isDesktop() ? 60 : 40,
    borderRadius: isDesktop() ? 30 : 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelRay: {
    position: 'absolute',
    width: 2,
    height: isDesktop() ? 30 : 20,
    backgroundColor: '#FFD700',
  },
  eye: {
    position: 'absolute',
    width: isDesktop() ? 20 : 15,
    height: isDesktop() ? 15 : 12,
    borderRadius: isDesktop() ? 10 : 7.5,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: isDesktop() ? 8 : 6,
    height: isDesktop() ? 8 : 6,
    borderRadius: isDesktop() ? 4 : 3,
    backgroundColor: '#FFFFFF',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  star1: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    top: 10,
    right: 15,
  },
  star2: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    bottom: 15,
    left: 10,
  },
  star3: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    top: 15,
    left: 15,
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
