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
  Image,
  Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import ResponsiveContainer from "../../components/ResponsiveContainer"
import { FONT_SIZES, SPACING, isDesktop, isTablet, isMobile } from "../../styles/responsive"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Componente Logo com imagem real
const Logo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoImageContainer}>
      <Image 
        source={require('../../../assets/icon.png')} 
        style={styles.logoImage}
        resizeMode="contain"
      />
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
    minHeight: screenHeight,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: isDesktop() ? 40 : 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: isDesktop() ? SPACING.xl * 2 : SPACING.xl,
  },
  logoImageContainer: {
    width: isDesktop() ? 150 : isTablet() ? 120 : 100,
    height: isDesktop() ? 150 : isTablet() ? 120 : 100,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: isDesktop() ? 36 : isTablet() ? 32 : 28,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isDesktop() ? 24 : isTablet() ? 20 : 18,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    marginTop: -SPACING.xs,
    textAlign: 'center',
  },
  tagline: {
    fontSize: isDesktop() ? 16 : 14,
    color: '#A0A0A0',
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: isDesktop() ? 450 : isTablet() ? 400 : 350,
    backgroundColor: 'rgba(44, 44, 46, 0.9)',
    borderRadius: 16,
    padding: isDesktop() ? SPACING.xl : SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  formTitle: {
    fontSize: isDesktop() ? 24 : isTablet() ? 20 : 18,
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
    minHeight: isDesktop() ? 56 : 48,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: isDesktop() ? 16 : 14,
    paddingVertical: SPACING.md,
  },
  authButton: {
    backgroundColor: '#FFD700',
    paddingVertical: isDesktop() ? SPACING.lg : SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
    minHeight: isDesktop() ? 56 : 48,
  },
  authButtonText: {
    color: '#000',
    fontSize: isDesktop() ? 18 : 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: isDesktop() ? SPACING.lg : SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    minHeight: isDesktop() ? 56 : 48,
  },
  googleButtonText: {
    color: '#000',
    fontSize: isDesktop() ? 16 : 14,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  switchText: {
    color: '#FFD700',
    fontSize: isDesktop() ? 16 : 14,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
})
