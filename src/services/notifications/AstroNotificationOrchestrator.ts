import AsyncStorage from '@react-native-async-storage/async-storage'
import LocalAstrologyService from '../astrology/LocalAstrologyService'
import { PushNotificationService } from './PushNotificationService'
import type { BirthData } from '../../types/astrology'

type ScheduleOpts = {
  dailyTime?: string // 'HH:MM' local
  enableDaily?: boolean
  enableWeekly?: boolean
  enableMonthly?: boolean
  enablePersonalAlerts?: boolean
}

const DEDUPE_KEY = '@tabula_estelar:last_sent_alerts'

function parseTime(t?: string): { hour: number, minute: number } {
  if (!t) return { hour: 8, minute: 0 }
  const [hh, mm] = t.split(':').map(Number)
  return { hour: Number.isFinite(hh) ? hh : 8, minute: Number.isFinite(mm) ? mm : 0 }
}

function nextMondayAt(hour: number, minute: number): Date {
  const now = new Date()
  const d = new Date(now)
  const day = d.getDay() // 0=Sun..6=Sat
  const delta = (8 - day) % 7 || 7 // next Monday
  d.setDate(d.getDate() + delta)
  d.setHours(hour, minute, 0, 0)
  return d
}

function firstDayNextMonthAt(hour: number, minute: number): Date {
  const now = new Date()
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, hour, minute, 0))
  return new Date(d.getTime() - (now.getTimezoneOffset() * 60000))
}

function translatePlanet(p: string): string {
  const m: Record<string,string> = { Sun:'Sol', Moon:'Lua', Mercury:'Mercúrio', Venus:'Vênus', Mars:'Marte', Jupiter:'Júpiter', Saturn:'Saturno', Uranus:'Urano', Neptune:'Netuno', Pluto:'Plutão' }
  return m[p] || p
}

export class AstroNotificationOrchestrator {
  static async scheduleAll(userId: string, birthData: BirthData, opts: ScheduleOpts = {}): Promise<void> {
    const {
      dailyTime = '08:00',
      enableDaily = true,
      enableWeekly = true,
      enableMonthly = true,
      enablePersonalAlerts = true,
    } = opts

    const { hour, minute } = parseTime(dailyTime)

    // 1) Resumo diário (genérico, repetitivo)
    if (enableDaily) {
      await PushNotificationService.scheduleDailyNotification(
        'Resumo diário – Pessoal e Coletivo',
        'Abra para ver seus destaques Pessoais de hoje e os principais movimentos Coletivos.',
        hour,
        minute,
        { type: 'daily_overview', navTarget: 'home-daily' }
      )
    }

    // 2) Digest semanal (próxima segunda, one-off)
    if (enableWeekly) {
      const date = nextMondayAt(hour, minute)
      await PushNotificationService.scheduleCustomNotification(
        'Panorama semanal – Coletivo',
        'Principais aspectos Coletivos da semana. Abra para detalhes.',
        date,
        { type: 'weekly_digest', navTarget: 'home-collective' }
      )
    }

    // 3) Digest mensal (1º dia do próximo mês, one-off)
    if (enableMonthly) {
      const date = firstDayNextMonthAt(hour, minute)
      await PushNotificationService.scheduleCustomNotification(
        'Panorama mensal – Coletivo',
        'Movimentos Coletivos do mês em destaque. Abra para detalhes.',
        date,
        { type: 'monthly_digest', navTarget: 'home-collective' }
      )
    }

    // 4) Alertas pessoais imediatos (master aplicantes com pico ≤ 3 dias)
    if (enablePersonalAlerts) {
      try {
        const res = await LocalAstrologyService.getCurrentTransits(birthData, userId, true)
        const realData = res.data.currentTransits
        const planets = realData.planets
        const personal = realData.transits?.personal || []
        const sent = new Set<string>(JSON.parse((await AsyncStorage.getItem(DEDUPE_KEY)) || '[]'))

        const norm = (x: number) => Math.max(0.02, x)
        const candidates = personal.filter(t => t.isMaster && t.isApplying)
          .map(t => {
            const spd = Math.abs(planets.find(p=>p.name===t.transitPlanet)?.speed || 0)
            const days = t.orb / norm(spd)
            return { t, daysToPeak: Math.round(days) }
          })
          .filter(x => x.daysToPeak <= 3)

        for (const c of candidates) {
          const key = `${c.t.seriesId}|${c.t.contactIndex}`
          if (sent.has(key)) continue
          const title = 'Alerta Pessoal – ápice próximo'
          const body = `${translatePlanet(c.t.transitPlanet)} ${c.t.type} ${translatePlanet(c.t.natalPlanet)} • orbe ${c.t.orb.toFixed(1)}° • ${c.t.contactIndex}º contato • pico ~${c.daysToPeak}d`
          await PushNotificationService.sendImmediateNotification(title, body, { type: 'personal_alert', navTarget: 'home-personal', seriesId: c.t.seriesId, contactIndex: c.t.contactIndex })
          sent.add(key)
        }

        await AsyncStorage.setItem(DEDUPE_KEY, JSON.stringify(Array.from(sent)))
      } catch (e) {
        console.log('⚠️ Falha ao enviar alertas pessoais:', e)
      }
    }
  }
}

export default AstroNotificationOrchestrator


