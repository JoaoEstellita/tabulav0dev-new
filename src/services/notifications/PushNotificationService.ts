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

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

export class PushNotificationService {
  private static getBadgeAndColor(data?: any): { prefix: string, color?: string } {
    const type = data?.type
    // Emojis e cores: 🧭 Pessoal, 🌐 Coletivo, 🧭🌐 misto
    if (type === 'personal_alert') return { prefix: '🧭 ', color: '#10B981' }
    if (type === 'weekly_digest' || type === 'monthly_digest') return { prefix: '🌐 ', color: '#F59E0B' }
    if (type === 'daily_overview') return { prefix: '🧭🌐 ', color: '#8B5CF6' }
    if (type === 'group') return { prefix: '👥 ' }
    if (type === 'critical_alert') return { prefix: '⚠️ ', color: '#EF4444' }
    if (type === 'favorable_event') return { prefix: '✨ ', color: '#10B981' }
    return { prefix: '' }
  }

  private static buildContent(title: string, body: string, data?: any) {
    const meta = this.getBadgeAndColor(data)
    const content: Notifications.NotificationContentInput = {
      title: `${meta.prefix}${title}`,
      body,
      data,
    } as any
    if (Platform.OS === 'android' && meta.color) {
      ;(content as any).color = meta.color
    }
    return content
  }
  static async scheduleNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: any
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: this.buildContent(title, body, data),
        trigger,
      });
      console.log('✅ Notificação agendada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao agendar notificação:', error);
      throw error;
    }
  }

  static async sendImmediateNotification(
    title: string,
    body: string,
    data?: any
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: this.buildContent(title, body, data),
        trigger: null, // Envio imediato
      });
      console.log('✅ Notificação enviada imediatamente');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
      throw error;
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Todas as notificações canceladas');
    } catch (error) {
      console.error('❌ Erro ao cancelar notificações:', error);
      throw error;
    }
  }

  static async cancelNotification(identifier: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('✅ Notificação cancelada:', identifier);
    } catch (error) {
      console.error('❌ Erro ao cancelar notificação:', error);
      throw error;
    }
  }

  static async getPendingNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('❌ Erro ao buscar notificações pendentes:', error);
      throw error;
    }
  }

  static async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('❌ Erro ao solicitar permissões:', error);
      return false;
    }
  }

  static async getPermissionsStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('❌ Erro ao verificar permissões:', error);
      return 'denied';
    }
  }

  static async scheduleDailyNotification(
    title: string,
    body: string,
    hour: number,
    minute: number,
    data?: any
  ) {
    try {
      const trigger = {
        hour,
        minute,
        repeats: true,
      };

      await this.scheduleNotification(title, body, trigger, data);
      console.log(`✅ Notificação diária agendada para ${hour}:${minute}`);
    } catch (error) {
      console.error('❌ Erro ao agendar notificação diária:', error);
      throw error;
    }
  }

  static async scheduleWeeklyNotification(
    title: string,
    body: string,
    weekday: number, // 1 = domingo, 2 = segunda, etc.
    hour: number,
    minute: number,
    data?: any
  ) {
    try {
      const trigger = {
        weekday,
        hour,
        minute,
        repeats: true,
      };

      await this.scheduleNotification(title, body, trigger, data);
      console.log(`✅ Notificação semanal agendada para ${weekday} às ${hour}:${minute}`);
    } catch (error) {
      console.error('❌ Erro ao agendar notificação semanal:', error);
      throw error;
    }
  }

  static async scheduleCustomNotification(
    title: string,
    body: string,
    date: Date,
    data?: any
  ) {
    try {
      const trigger = {
        date,
        type: 'date' as const,
      };

      await this.scheduleNotification(title, body, trigger, data);
      console.log('✅ Notificação customizada agendada para:', date);
    } catch (error) {
      console.error('❌ Erro ao agendar notificação customizada:', error);
      throw error;
    }
  }

  static async sendAstrologyNotification(
    title: string,
    body: string,
    transitData?: any
  ) {
    try {
      const data = {
        type: 'astrology',
        transitData,
        timestamp: new Date().toISOString(),
      };

      await this.sendImmediateNotification(title, body, data);
      console.log('✅ Notificação astrológica enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação astrológica:', error);
      throw error;
    }
  }

  static async sendGroupNotification(
    title: string,
    body: string,
    groupId: string,
    groupName: string
  ) {
    try {
      const data = {
        type: 'group',
        groupId,
        groupName,
        timestamp: new Date().toISOString(),
      };

      await this.sendImmediateNotification(title, body, data);
      console.log('✅ Notificação de grupo enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de grupo:', error);
      throw error;
    }
  }

  static async sendCriticalAlert(
    title: string,
    body: string,
    alertType: 'aspect' | 'transit' | 'opportunity'
  ) {
    try {
      const data = {
        type: 'critical_alert',
        alertType,
        timestamp: new Date().toISOString(),
      };

      await this.sendImmediateNotification(title, body, data);
      console.log('✅ Alerta crítico enviado');
    } catch (error) {
      console.error('❌ Erro ao enviar alerta crítico:', error);
      throw error;
    }
  }
}