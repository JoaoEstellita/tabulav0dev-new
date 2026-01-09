const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app'

export async function checkUserSubscription(userId: string): Promise<{ active: boolean; status: string }> {
  try {
    const url = `${BACKEND_URL}/api/subscription`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', userId })
    })

    if (!response.ok) {
      return { active: false, status: 'error' }
    }

    const data = await response.json()
    const subscription = data?.data?.subscription || data?.subscription || {}

    return {
      active: !!subscription.isActive,
      status: subscription.status || 'none'
    }
  } catch (error) {
    console.error('Erro na requisicao de assinatura:', error)
    return { active: false, status: 'error' }
  }
}
