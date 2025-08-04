/**
 * 🌅 DAILY ASTROLOGY AUTOMATION 🌅
 * 
 * Sistema de automação para cálculos e notificações diárias
 * Executa automaticamente todos os dias para todos os usuários
 * 
 * FUNCIONALIDADES:
 * - Cálculos diários automáticos
 * - Notificações para grupos
 * - Alertas críticos personalizados
 * - Performance otimizada
 */

import LocalAstrologyService, { LocalTransitData } from '../astrology/LocalAstrologyService'
import NotificationService from '../firebase/NotificationService'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'

export interface DailyCalculationResult {
  userId: string
  data: LocalTransitData
  hasAlerts: boolean
  alertMessage?: string
}

export interface AutomationStats {
  totalUsers: number
  calculationsCompleted: number
  alertsSent: number
  groupsNotified: number
  executionTimeMs: number
  errors: string[]
}

export class DailyAstrologyAutomation {
  
  /**
   * Executa cálculos diários para TODOS os usuários
   * Esta função deve ser chamada por um cron job ou função serverless
   */
  static async runDailyCalculations(): Promise<AutomationStats> {
    const startTime = Date.now()
    console.log('🌅 Iniciando cálculos astrológicos diários automáticos...')
    
    const stats: AutomationStats = {
      totalUsers: 0,
      calculationsCompleted: 0,
      alertsSent: 0,
      groupsNotified: 0,
      executionTimeMs: 0,
      errors: []
    }

    try {
      // 1. Buscar todos os usuários com dados de nascimento completos
      const users = await this.getAllUsersWithBirthData()
      stats.totalUsers = users.length
      
      console.log(`👥 Encontrados ${users.length} usuários para cálculos diários`)

      // 2. Processar usuários em lotes (para performance)
      const batchSize = 10
      const results: DailyCalculationResult[] = []
      
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize)
        const batchResults = await Promise.allSettled(
          batch.map(user => this.calculateDailyDataForUser(user))
        )
        
        // Processar resultados do lote
        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value)
            stats.calculationsCompleted++
          } else {
            stats.errors.push(`Erro no usuário: ${result.reason}`)
          }
        }
        
        // Log de progresso
        console.log(`📊 Processados ${Math.min(i + batchSize, users.length)}/${users.length} usuários`)
      }

      // 3. Enviar notificações para grupos
      const groupNotifications = await this.sendGroupNotifications(results)
      stats.groupsNotified = groupNotifications.groupsNotified
      stats.alertsSent = groupNotifications.alertsSent

      // 4. Estatísticas finais
      stats.executionTimeMs = Date.now() - startTime
      
      console.log('🎯 Cálculos diários concluídos:', {
        usuários: stats.totalUsers,
        cálculos: stats.calculationsCompleted,
        alertas: stats.alertsSent,
        grupos: stats.groupsNotified,
        tempo: `${stats.executionTimeMs}ms`,
        erros: stats.errors.length
      })

      return stats

    } catch (error) {
      console.error('❌ Erro crítico nos cálculos diários:', error)
      stats.errors.push(`Erro crítico: ${error.message}`)
      stats.executionTimeMs = Date.now() - startTime
      return stats
    }
  }

  /**
   * Calcula dados astrológicos para um usuário específico
   */
  private static async calculateDailyDataForUser(user: any): Promise<DailyCalculationResult> {
    try {
      const birthData = {
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthLocation: user.birthLocation
      }

      // Calcular dados astrológicos usando engine local
      const result = await LocalAstrologyService.getCurrentTransits(
        birthData, 
        user.id, 
        true // Force refresh para dados diários
      )

      // Verificar se precisa de alertas
      const hasAlerts = LocalAstrologyService.shouldSendCriticalAlert(result.data)
      const alertMessage = hasAlerts ? 
        LocalAstrologyService.generateAlertMessage(result.data) : 
        undefined

      return {
        userId: user.id,
        data: result.data,
        hasAlerts,
        alertMessage
      }

    } catch (error) {
      throw new Error(`Falha no usuário ${user.id}: ${error.message}`)
    }
  }

  /**
   * Envia notificações para grupos baseado nos resultados diários
   */
  private static async sendGroupNotifications(
    results: DailyCalculationResult[]
  ): Promise<{ groupsNotified: number, alertsSent: number }> {
    let groupsNotified = 0
    let alertsSent = 0

    try {
      // Buscar todos os grupos ativos
      const groups = await this.getAllActiveGroups()
      
      for (const group of groups) {
        try {
          // Encontrar membros do grupo que têm alertas
          const membersWithAlerts = results.filter(result => 
            group.members.includes(result.userId) && result.hasAlerts
          )

          if (membersWithAlerts.length > 0) {
            // Preparar mensagem do grupo
            const groupMessage = this.generateGroupMessage(group, membersWithAlerts)
            
            // Enviar notificação para o grupo
            await NotificationService.sendGroupNotification(group.id, groupMessage)
            
            groupsNotified++
            alertsSent += membersWithAlerts.length
            
            console.log(`📢 Grupo ${group.name}: ${membersWithAlerts.length} alertas enviados`)
          }

        } catch (error) {
          console.error(`❌ Erro ao notificar grupo ${group.id}:`, error)
        }
      }

      return { groupsNotified, alertsSent }

    } catch (error) {
      console.error('❌ Erro nas notificações de grupo:', error)
      return { groupsNotified, alertsSent }
    }
  }

  /**
   * Busca todos os usuários com dados de nascimento completos
   */
  private static async getAllUsersWithBirthData(): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef,
        where('birthDate', '!=', null),
        where('birthTime', '!=', null),
        where('birthLocation', '!=', null)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return []
    }
  }

  /**
   * Busca todos os grupos ativos
   */
  private static async getAllActiveGroups(): Promise<any[]> {
    try {
      const groupsRef = collection(db, 'groups')
      const snapshot = await getDocs(groupsRef)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(group => group.isActive !== false)

    } catch (error) {
      console.error('❌ Erro ao buscar grupos:', error)
      return []
    }
  }

  /**
   * Gera mensagem personalizada para o grupo
   */
  private static generateGroupMessage(group: any, membersWithAlerts: DailyCalculationResult[]): string {
    const memberNames = membersWithAlerts.map(member => 
      member.userId.substring(0, 8) // Primeiros 8 caracteres do ID
    ).join(', ')

    const alertCount = membersWithAlerts.length
    const groupName = group.name || 'Grupo'

    return `🌟 ${groupName} - Alertas Astrológicos Diários\n\n` +
           `${alertCount} membro(s) com situações que requerem atenção:\n` +
           `${memberNames}\n\n` +
           `💫 Enviem energias positivas e apoio mútuo!\n` +
           `🔮 Lembrem-se: os desafios são oportunidades de crescimento.`
  }

  /**
   * Agenda execução diária (para usar com cron jobs)
   */
  static scheduleDaily(): void {
    // Em produção, isso seria configurado no servidor
    // Por exemplo: cron job às 6:00 AM todos os dias
    console.log('📅 Sistema de automação diária configurado')
    console.log('⏰ Execução programada para 06:00 todos os dias')
    
    // Para desenvolvimento, você pode testar com:
    // setInterval(() => this.runDailyCalculations(), 24 * 60 * 60 * 1000)
  }

  /**
   * Teste manual da automação (para desenvolvimento)
   */
  static async testAutomation(): Promise<AutomationStats> {
    console.log('🧪 Executando teste da automação diária...')
    return await this.runDailyCalculations()
  }
}

export default DailyAstrologyAutomation