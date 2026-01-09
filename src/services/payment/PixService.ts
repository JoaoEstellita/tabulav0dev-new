export interface PixRequestPayload {
  userId: string
  planId: string
  months: number
  amount: number
  payerEmail?: string
  payerName?: string
}

export interface PixRequestResponse {
  requestId: string
}

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api'

export async function createPixRequest(payload: PixRequestPayload): Promise<PixRequestResponse> {
  const response = await fetch(`${BACKEND_URL}/pix/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel criar a solicitacao PIX')
  }

  const data = await response.json()
  return { requestId: data?.data?.requestId || data?.requestId }
}
