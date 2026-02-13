export interface StripeCheckoutPayload {
  userId: string
  planId: string
  email: string
  name?: string
  amount?: number
  currency?: string
}

export interface StripeCheckoutResponse {
  ok: boolean
  id?: string
  url?: string
  provider?: 'stripe'
  planId?: string
  error?: { code?: string; message?: string; details?: unknown }
}

export interface StripePortalResponse {
  ok: boolean
  id?: string
  url?: string
  provider?: 'stripe'
  error?: { code?: string; message?: string; details?: unknown }
}

export interface StripeSyncResponse {
  ok: boolean
  sessionId?: string
  paymentStatus?: string
  subscriptionStatus?: string
  mappedStatus?: string
  persisted?: {
    ok?: boolean
    userId?: string
    planId?: string
    status?: string
    isActive?: boolean
  } | null
  error?: { code?: string; message?: string; details?: unknown }
}

export class StripeService {
  private static readonly BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api'
  private static readonly FRONTEND_URL = (process.env.EXPO_PUBLIC_FRONTEND_URL || process.env.EXPO_PUBLIC_SITE_URL || 'https://tabulaestelar.com.br').replace(/\/$/, '')

  static async createCheckoutSession(payload: StripeCheckoutPayload): Promise<StripeCheckoutResponse> {
    const body = {
      ...payload,
      successUrl: `${this.FRONTEND_URL}/payment/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${this.FRONTEND_URL}/payment/failure?provider=stripe`,
    }
    const response = await fetch(`${this.BACKEND_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok || !data?.ok) {
      const detailMessage =
        data?.error?.details?.message
        || data?.error?.message
        || 'Falha ao criar checkout Stripe'
      throw new Error(String(detailMessage))
    }
    return data
  }

  static async createPortalSession(userId: string): Promise<StripePortalResponse> {
    const response = await fetch(`${this.BACKEND_URL}/stripe/create-portal-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        userId,
        returnUrl: `${this.FRONTEND_URL}/premium`,
      }),
    })
    const data = await response.json()
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error?.message || 'Falha ao abrir portal Stripe')
    }
    return data
  }

  static async syncCheckoutSession(sessionId: string, userId: string): Promise<StripeSyncResponse> {
    const response = await fetch(`${this.BACKEND_URL}/stripe/sync-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ sessionId, userId }),
    })
    const data = await response.json()
    if (!response.ok || !data?.ok) {
      throw new Error(data?.error?.message || 'Falha ao sincronizar checkout Stripe')
    }
    return data
  }
}

export default StripeService
