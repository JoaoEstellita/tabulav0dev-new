type ExpiryVariant = 'info' | 'warn'

export type ExpiryBannerInfo = {
  show: boolean
  message: string
  variant: ExpiryVariant
  daysLeft?: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const toDate = (value?: Date | string | number | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const startOfDayUTC = (value: Date) => {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
}

const diffDaysUtc = (from: Date, to: Date) => {
  const fromDay = startOfDayUTC(from).getTime()
  const toDay = startOfDayUTC(to).getTime()
  return Math.ceil((toDay - fromDay) / DAY_MS)
}

const formatDateShort = (value: Date) => {
  return value.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

type ExpiryBannerParams = {
  featureLabel: string
  trialActive: boolean
  trialEndsAt?: Date | string | null
  subscriptionNextBillingDate?: Date | string | null
  subscriptionExpiresAt?: Date | string | null
  isPremium: boolean
  now?: Date
}

export const getExpiryBannerInfo = ({
  featureLabel,
  trialActive,
  trialEndsAt,
  subscriptionNextBillingDate,
  subscriptionExpiresAt,
  isPremium,
  now = new Date(),
}: ExpiryBannerParams): ExpiryBannerInfo => {
  const trialEnd = toDate(trialEndsAt)
  if (trialActive && trialEnd) {
    const daysLeft = diffDaysUtc(now, trialEnd)
    if (daysLeft >= 0) {
      if (daysLeft === 0) {
        return {
          show: true,
          message: `Seu acesso gratis de ${featureLabel} termina hoje.`,
          variant: 'warn',
          daysLeft,
        }
      }
      const plural = daysLeft === 1 ? 'dia' : 'dias'
      return {
        show: true,
        message: `Faltam ${daysLeft} ${plural} para expirar seu acesso gratuito a ${featureLabel}.`,
        variant: 'info',
        daysLeft,
      }
    }
  }

  const subEnd = toDate(subscriptionNextBillingDate) || toDate(subscriptionExpiresAt)
  if (isPremium && subEnd) {
    const daysLeft = diffDaysUtc(now, subEnd)
    if (daysLeft >= 0 && daysLeft <= 30) {
      if (daysLeft <= 7) {
        const plural = daysLeft === 1 ? 'dia' : 'dias'
        return {
          show: true,
          message: `Seu plano renova em ${daysLeft} ${plural}.`,
          variant: 'warn',
          daysLeft,
        }
      }
      return {
        show: true,
        message: `Seu plano renova em ${formatDateShort(subEnd)}.`,
        variant: 'info',
        daysLeft,
      }
    }
  }

  return { show: false, message: '', variant: 'info' }
}
