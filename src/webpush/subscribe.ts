export async function subscribeWebPush(userId: string) {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Web Push não suportado')
  }

  const registration = await navigator.serviceWorker.ready

  const base64ToUint8Array = (base64: string) => {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64Safe)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const applicationServerKey = base64ToUint8Array(process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY as string)

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  })

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL
  if (!backendUrl) throw new Error('EXPO_PUBLIC_BACKEND_URL ausente')

  const res = await fetch(`${backendUrl}/api/webpush/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, subscription }),
  })

  if (!res.ok) throw new Error('Falha ao registrar assinatura')
  return await res.json()
}


