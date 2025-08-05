/**
 * 👥 GROUP NOTIFICATION SERVICE 👥
 * 
 * Serviço para envio de notificações de grupos
 * Conecta com backend FCM v1 para notificações em massa
 */

export interface GroupNotificationData {
  groupId: string
  senderId: string
  notificationType: 'custom_message' | 'critical_alert' | 'favorable_event' | 'compatibility_update' | 'member_joined' | 'daily_group_energy'
  customMessage?: string
  eventData?: any
}

export class GroupNotificationService {
  
  /**
   * Envia notificação para todos os membros de um grupo
   */
  static async sendGroupNotification(data: GroupNotificationData): Promise<void> {
    try {
      console.log('📢 Enviando notificação de grupo:', data.notificationType)

      const response = await fetch('https://tabula-estelar-backend.vercel.app/api/group-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao enviar notificação de grupo')
      }

      console.log('✅ Notificação de grupo enviada:', result.stats)

    } catch (error) {
      console.error('❌ Erro ao enviar notificação de grupo:', error)
      throw error
    }
  }

  /**
   * Envia mensagem personalizada para o grupo
   */
  static async sendCustomMessage(groupId: string, senderId: string, message: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId,
      notificationType: 'custom_message',
      customMessage: message
    })
  }

  /**
   * Envia alerta crítico para o grupo
   */
  static async sendCriticalAlert(groupId: string, senderId: string, alertMessage?: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId,
      notificationType: 'critical_alert',
      customMessage: alertMessage
    })
  }

  /**
   * Envia notificação de evento favorável
   */
  static async sendFavorableEvent(groupId: string, senderId: string, eventMessage?: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId,
      notificationType: 'favorable_event',
      customMessage: eventMessage
    })
  }

  /**
   * Notifica sobre atualização de compatibilidade
   */
  static async sendCompatibilityUpdate(groupId: string, senderId: string, updateInfo?: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId,
      notificationType: 'compatibility_update',
      customMessage: updateInfo
    })
  }

  /**
   * Notifica quando um novo membro entra no grupo
   */
  static async sendMemberJoined(groupId: string, newMemberId: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId: newMemberId,
      notificationType: 'member_joined'
    })
  }

  /**
   * Envia energia diária do grupo
   */
  static async sendDailyGroupEnergy(groupId: string, senderId: string, groupEnergy: string, message?: string): Promise<void> {
    await this.sendGroupNotification({
      groupId,
      senderId,
      notificationType: 'daily_group_energy',
      customMessage: message,
      eventData: { groupEnergy }
    })
  }

  /**
   * Envia notificação baseada em evento astrológico crítico automaticamente
   */
  static async sendAutomaticCriticalAlert(groupId: string, criticalData: {
    area: string
    percentage: number
    description: string
  }): Promise<void> {
    // Usar um ID de sistema para alertas automáticos
    const systemSenderId = 'system_astrology_alert'
    
    const message = `⚠️ Alerta automático: ${criticalData.area} em ${criticalData.percentage}%. ${criticalData.description}`

    await this.sendGroupNotification({
      groupId,
      senderId: systemSenderId,
      notificationType: 'critical_alert',
      customMessage: message,
      eventData: criticalData
    })
  }

  /**
   * Envia notificação baseada em evento astrológico favorável automaticamente
   */
  static async sendAutomaticFavorableAlert(groupId: string, favorableData: {
    area: string
    percentage: number
    description: string
  }): Promise<void> {
    // Usar um ID de sistema para alertas automáticos
    const systemSenderId = 'system_astrology_alert'
    
    const message = `✨ Energia favorável: ${favorableData.area} em ${favorableData.percentage}%. ${favorableData.description}`

    await this.sendGroupNotification({
      groupId,
      senderId: systemSenderId,
      notificationType: 'favorable_event',
      customMessage: message,
      eventData: favorableData
    })
  }
}

export default GroupNotificationService