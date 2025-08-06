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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"

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
      Alert.alert("Erro", "Falha no login com Google: " + error.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tábula Estelar</Text>
          <Text style={styles.subtitle}>Seu guia astrológico pessoal</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                placeholderTextColor="#8E8E93"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, googleLoading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>{googleLoading ? "Conectando..." : "Continuar com Google"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => {
                setIsLogin(!isLogin)
                setPassword("")
                setConfirmPassword("")
              }}
            >
              <Text style={styles.switchText}>{isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 48,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 320,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  switchButton: {
    alignItems: "center",
  },
  switchText: {
    color: "#FFD700",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3A3A3C",
  },
  dividerText: {
    color: "#8E8E93",
    fontSize: 14,
    marginHorizontal: 16,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E1E1E1",
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F1F1F",
  },
})
