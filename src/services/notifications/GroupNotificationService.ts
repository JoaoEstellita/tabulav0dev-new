/**
 *  GROUP NOTIFICATION SERVICE 
 * 
 * Servico para envio de notificacoes de grupos
 * Conecta com backend FCM v1 para notificacoes em massa
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
   * Envia notificacao para todos os membros de um grupo
   */
  static async sendGroupNotification(data: GroupNotificationData): Promise<void> {
    try {
      console.log('Enviando notificacao de grupo:', data.notificationType)

      const base = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
      const response = await fetch(`${base}/api/group/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: data.groupId,
          title: data.notificationType === 'custom_message' ? 'Mensagem do grupo' : 'Tabula Estelar',
          body: data.customMessage || 'Alerta do grupo',
          data: (() => {
            const eventData = data.eventData || {}
            const area = eventData.area || eventData.lifeArea || eventData.life_area
            const payload = { type: data.notificationType, senderId: data.senderId, ...eventData }
            if (area && !payload.area) payload.area = area
            return payload
          })(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao enviar notificacao de grupo')
      }
      console.log('Notificacao de grupo enviada:', result.sent)
    } catch (error) {
      console.error('Erro ao enviar notificacao de grupo:', error)
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
   * Envia alerta critico para o grupo
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
   * Envia notificacao de evento favoravel
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
   * Notifica sobre atualizacao de compatibilidade
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
   * Envia energia diaria do grupo
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
   * Envia notificacao baseada em evento astrologico critico automaticamente
   */
  static async sendAutomaticCriticalAlert(groupId: string, criticalData: {
    area: string
    percentage: number
    description: string
  }): Promise<void> {
    // Usar um ID de sistema para alertas automaticos
    const systemSenderId = 'system_astrology_alert'
    
    const message = `Alerta automatico: ${criticalData.area} em ${criticalData.percentage}%. ${criticalData.description}`

    await this.sendGroupNotification({
      groupId,
      senderId: systemSenderId,
      notificationType: 'critical_alert',
      customMessage: message,
      eventData: criticalData
    })
  }

  /**
   * Envia notificacao baseada em evento astrologico favoravel automaticamente
   */
  static async sendAutomaticFavorableAlert(groupId: string, favorableData: {
    area: string
    percentage: number
    description: string
  }): Promise<void> {
    // Usar um ID de sistema para alertas automaticos
    const systemSenderId = 'system_astrology_alert'
    
    const message = `Energia favoravel: ${favorableData.area} em ${favorableData.percentage}%. ${favorableData.description}`

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
