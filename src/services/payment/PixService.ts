export interface PixPaymentPayload {
  userId: string
  planId: string
  months: number
  amount: number
  payerEmail?: string
  payerName?: string
  description?: string
  externalReference?: string
}

export interface PixPaymentResponse {
  id: number
  status: string
  statusDetail?: string
  externalReference?: string
  qrCode?: string
  qrCodeBase64?: string
  ticketUrl?: string
}

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api'

export async function createPixPayment(payload: PixPaymentPayload): Promise<PixPaymentResponse> {
  const response = await fetch(`${BACKEND_URL}/mercado-pago/pix-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: payload.userId,
      planId: payload.planId,
      months: payload.months,
      amount: payload.amount,
      payer: {
        email: payload.payerEmail || '',
        name: payload.payerName || undefined
      },
      description: payload.description,
      external_reference: payload.externalReference
    })
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel criar o pagamento PIX')
  }

  const data = await response.json()
  return {
    id: data.id,
    status: data.status,
    statusDetail: data.status_detail,
    externalReference: data.external_reference,
    qrCode: data.qr_code,
    qrCodeBase64: data.qr_code_base64,
    ticketUrl: data.ticket_url
  }
}
