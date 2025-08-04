/**
 * 📱 PUSH NOTIFICATION SERVICE 📱
 * 
 * Sistema de notificações push GRATUITAS usando Firebase
 * Automação diária para todos os usuários
 * 
 * FUNCIONALIDADES:
 * - Notificações diárias automáticas
 * - Baseadas em cálculos ephemeris reais
 * - 100% gratuito (Firebase FCM)
 * - Personalização por usuário
 * - Agendamento inteligente
 */

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import LocalAstrologyService, { LocalTransitData } from '../astrology/LocalAstrologyService'
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export interface NotificationPreferences {
  enabled: boolean
  dailyTime: string // HH:MM formato
  types: {
    dailyOverview: boolean
    criticalAlerts: boolean
    favorableAspects: boolean
    challenges: boolean
  }
}

export interface ScheduledNotification {
  id: string
  userId: string
  title: string
  body: string
  scheduledFor: Date
  type: 'daily' | 'critical' | 'favorable' | 'challenge'
  data?: any
}

export class PushNotificationService {
  
  /**
   * Inicializa o serviço de notificações para um usuário
   */
  static async initializeForUser(userId: string): Promise<string | null> {
    try {
      // Verificar se é um device físico
      if (!Device.isDevice) {
        console.log('📱 Push notifications não funcionam no simulador')
        return null
      }

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Permissão de notificação negada')
        return null
      }

      // Obter token do device
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })

      console.log('📱 Token de notificação obtido:', token.data)

      // Salvar token no Firebase
      await this.saveUserToken(userId, token.data)

      // Configurar canal de notificação (Android)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('astrology', {
          name: 'Astrologia',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFD700',
        })
      }

      return token.data

    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error)
      return null
    }
  }

  /**
   * Agenda notificação diária para um usuário
   */
  static async scheduleDailyNotification(userId: string, transitData: LocalTransitData): Promise<void> {
    try {
      // Buscar preferências do usuário
      const preferences = await this.getUserPreferences(userId)
      
      if (!preferences.enabled) {
        console.log(`📱 Notificações desabilitadas para usuário ${userId}`)
        return
      }

      // Gerar conteúdo da notificação baseado nos dados astrológicos
      const notification = this.generateDailyNotification(transitData, preferences)
      
      // Calcular horário da próxima notificação
      const scheduledTime = this.calculateNextNotificationTime(preferences.dailyTime)
      
      // Agendar notificação local
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            userId,
            type: 'daily',
            transitData: JSON.stringify(transitData)
          },
          sound: 'default',
        },
        trigger: {
          date: scheduledTime,
        },
      })

      console.log(`📅 Notificação diária agendada para ${scheduledTime.toLocaleString()}`)

    } catch (error) {
      console.error('❌ Erro ao agendar notificação diária:', error)
    }
  }

  /**
   * Envia notificação push para todos os usuários (execução serverless)
   */
  static async sendDailyNotificationsToAllUsers(): Promise<void> {
    try {
      console.log('🌅 Iniciando envio de notificações diárias...')

      // Buscar todos os usuários com notificações habilitadas
      const users = await this.getUsersWithNotificationsEnabled()
      console.log(`👥 Encontrados ${users.length} usuários com notificações habilitadas`)

      let successCount = 0
      let errorCount = 0

      // Processar usuários em lotes
      const batchSize = 10
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize)
        
        const promises = batch.map(async (user) => {
          try {
            // Calcular dados astrológicos para o usuário
            const transitResult = await LocalAstrologyService.getCurrentTransits(
              user.birthData,
              user.id,
              true // Force refresh para dados diários
            )

            // Gerar e enviar notificação
            await this.sendPushNotification(user.token, transitResult.data, user.preferences)
            successCount++
            
          } catch (error) {
            console.error(`❌ Erro ao enviar notificação para usuário ${user.id}:`, error)
            errorCount++
          }
        })

        await Promise.allSettled(promises)
        console.log(`📊 Processados ${Math.min(i + batchSize, users.length)}/${users.length} usuários`)
      }

      console.log(`✅ Notificações enviadas: ${successCount} sucessos, ${errorCount} erros`)

    } catch (error) {
      console.error('❌ Erro crítico no envio de notificações:', error)
    }
  }

  /**
   * Gera conteúdo personalizado da notificação baseado nos dados astrológicos
   */
  private static generateDailyNotification(
    transitData: LocalTransitData, 
    preferences: NotificationPreferences
  ): { title: string, body: string } {
    const { dailyOverview, lifeAreas } = transitData

    // Título baseado na tendência geral
    const titles = [
      '🌟 Seu Dia Astrológico',
      '✨ Energias de Hoje',
      '🔮 Previsão Diária',
      '🌙 Trânsitos Atuais'
    ]
    const title = titles[Math.floor(Math.random() * titles.length)]

    // Corpo da mensagem personalizado
    let body = dailyOverview.generalTrend

    // Adicionar área favorável se habilitado
    if (preferences.types.favorableAspects) {
      const bestAreaName = this.getLifeAreaName(dailyOverview.bestArea)
      body += ` ✨ Foco em: ${bestAreaName}.`
    }

    // Adicionar desafios se habilitado
    if (preferences.types.challenges) {
      const challengingAreaName = this.getLifeAreaName(dailyOverview.challengingArea)
      body += ` ⚠️ Atenção: ${challengingAreaName}.`
    }

    // Verificar alertas críticos
    if (preferences.types.criticalAlerts) {
      const criticalAreas = Object.entries(lifeAreas).filter(
        ([_, area]) => area.status === 'crítico'
      )
      
      if (criticalAreas.length > 0) {
        body += ` 🚨 ${criticalAreas.length} área(s) requer(em) atenção especial.`
      }
    }

    return { title, body: body.trim() }
  }

  /**
   * Envia notificação push individual
   */
  private static async sendPushNotification(
    token: string, 
    transitData: LocalTransitData, 
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      const notification = this.generateDailyNotification(transitData, preferences)
      
      const message = {
        to: token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: {
          type: 'daily_astrology',
          timestamp: new Date().toISOString()
        },
      }

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(`Push notification error: ${JSON.stringify(result.errors)}`)
      }

    } catch (error) {
      throw new Error(`Falha ao enviar push notification: ${error.message}`)
    }
  }

  /**
   * Salva token do usuário no Firebase
   */
  private static async saveUserToken(userId: string, token: string): Promise<void> {
    try {
      await setDoc(doc(db, 'userTokens', userId), {
        token,
        updatedAt: new Date(),
        platform: Platform.OS
      }, { merge: true })
    } catch (error) {
      console.error('❌ Erro ao salvar token:', error)
    }
  }

  /**
   * Busca preferências de notificação do usuário
   */
  private static async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const doc_ref = doc(db, 'notificationPreferences', userId)
      const doc_snap = await getDoc(doc_ref)
      
      if (doc_snap.exists()) {
        return doc_snap.data() as NotificationPreferences
      }
      
      // Preferências padrão
      return {
        enabled: true,
        dailyTime: '08:00',
        types: {
          dailyOverview: true,
          criticalAlerts: true,
          favorableAspects: true,
          challenges: true
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar preferências:', error)
      // Retornar padrão em caso de erro
      return {
        enabled: true,
        dailyTime: '08:00',
        types: {
          dailyOverview: true,
          criticalAlerts: true,
          favorableAspects: true,
          challenges: true
        }
      }
    }
  }

  /**
   * Busca usuários com notificações habilitadas
   */
  private static async getUsersWithNotificationsEnabled(): Promise<any[]> {
    try {
      // Buscar tokens ativos
      const tokensRef = collection(db, 'userTokens')
      const tokensSnapshot = await getDocs(tokensRef)
      
      const users = []
      
      for (const tokenDoc of tokensSnapshot.docs) {
        const userId = tokenDoc.id
        const tokenData = tokenDoc.data()
        
        // Buscar dados de nascimento
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (!userDoc.exists()) continue
        
        const userData = userDoc.data()
        if (!userData.birthDate || !userData.birthTime || !userData.birthLocation) continue
        
        // Buscar preferências
        const preferences = await this.getUserPreferences(userId)
        if (!preferences.enabled) continue
        
        users.push({
          id: userId,
          token: tokenData.token,
          birthData: {
            birthDate: userData.birthDate,
            birthTime: userData.birthTime,
            birthLocation: userData.birthLocation
          },
          preferences
        })
      }
      
      return users
      
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return []
    }
  }

  /**
   * Calcula próximo horário de notificação
   */
  private static calculateNextNotificationTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(hours, minutes, 0, 0)
    return tomorrow
  }

  /**
   * Converte nome da área da vida
   */
  private static getLifeAreaName(areaName: string): string {
    const names: { [key: string]: string } = {
      amor: 'Amor',
      carreira: 'Carreira',
      financas: 'Finanças',
      saude: 'Saúde',
      familia: 'Família',
      espiritualidade: 'Espiritualidade',
      comunicacao: 'Comunicação',
      transformacao: 'Transformação'
    }
    return names[areaName] || areaName
  }

  /**
   * Configura preferências de notificação para um usuário
   */
  static async updateUserPreferences(
    userId: string, 
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      await setDoc(doc(db, 'notificationPreferences', userId), preferences)
      console.log('✅ Preferências de notificação atualizadas')
    } catch (error) {
      console.error('❌ Erro ao atualizar preferências:', error)
    }
  }

  /**
   * Cancela todas as notificações agendadas para um usuário
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
      console.log('✅ Todas as notificações canceladas')
    } catch (error) {
      console.error('❌ Erro ao cancelar notificações:', error)
    }
  }
}

export default PushNotificationService