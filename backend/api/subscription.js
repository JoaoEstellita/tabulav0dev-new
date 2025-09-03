// Utilitário CORS universal
const { serialize } = require('./_lib/serialize');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
// TESTE: alteração feita por GitHub Copilot em 02/09/2025
const mercadopago = require('mercadopago');
const { db } = require('../../src/config/firebase');
function setCors(req, res, methods = 'POST, GET, OPTIONS') {
  const origins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const origin = req.headers.origin
  const allowOrigin = origin && origins.includes(origin) ? origin : (origins[0] || '*')
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control')
  res.setHeader('Access-Control-Max-Age', '600')
}

module.exports = async (req, res) => {
  try {
    console.log('🔵 Subscription endpoint hit:', req.method)
    setCors(req, res)
    if (req.method === 'OPTIONS') {
      console.log('🟢 OPTIONS preflight handled')
      return res.status(204).end()
    }
  } catch (err) {
    console.error('❌ Erro logo no início do handler:', err)
    return res.status(500).json({ error: 'Erro interno no início do handler', message: err?.message })
  }
  try {
    // Suporte a múltiplas ações: assinatura, create-preference, webhook
    const action = req.query.action || req.body?.action

      // --- CREATE PREFERENCE ---
      if (action === 'create-preference' && req.method === 'POST') {
        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
          options: { timeout: 5000 }
        })
        const preference = new Preference(client)
        const { userId, planId, payer, items, external_reference, notification_url, success_url, failure_url, pending_url } = req.body
        if (!userId || !planId || !payer || !items || items.length === 0) {
          return res.status(400).json(serialize({ error: 'Dados obrigatórios faltando', required: ['userId', 'planId', 'payer', 'items'] }))
        }
        if (!payer.email || !payer.name) {
          return res.status(400).json(serialize({ error: 'Dados do pagador incompletos', required: ['email', 'name'] }))
        }
        const totalAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
        if (totalAmount < 0.5) {
          return res.status(400).json(serialize({ error: 'Valor mínimo de pagamento é R$ 0,50' }))
        }
        const preferenceData = {
          items: items.map(item => ({
            id: planId,
            title: item.title,
            description: `Assinatura Premium - ${item.title}`,
            quantity: item.quantity,
            unit_price: item.unit_price,
            currency_id: item.currency_id || 'BRL',
          })),
          payer: { email: payer.email, name: payer.name },
          external_reference,
          notification_url,
          back_urls: { success: success_url, failure: failure_url, pending: pending_url },
          auto_return: 'approved',
          payment_methods: { excluded_payment_methods: [], excluded_payment_types: [], installments: 12 },
          statement_descriptor: 'TÁBULA ESTELAR',
          expires: true,
          expiration_date_from: new Date().toISOString(),
          expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metadata: { user_id: userId, plan_id: planId, app_name: 'tabula_estelar', created_at: new Date().toISOString() }
        }
        const result = await preference.create({ body: preferenceData })
  return res.status(200).json(serialize({
          id: result.id,
          init_point: result.init_point,
          sandbox_init_point: result.sandbox_init_point,
          checkout_url: result.init_point,
          external_reference,
          expires_at: preferenceData.expiration_date_to,
        }));
      }

      // --- WEBHOOK ---
      if (action === 'webhook' && req.method === 'POST') {
        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
          options: { timeout: 5000 }
        })
        const payment = new Payment(client)
        const { id, topic, type } = req.body
        if (topic !== 'payment' && type !== 'payment') {
      return res.status(200).json(serialize({ message: 'Webhook processado' }))
        }
        if (!id) {
      return res.status(400).json(serialize({ error: 'ID do pagamento obrigatório' }))
        }
        const paymentData = await payment.get({ id: parseInt(id) })
        // Processamento simplificado: ativar assinatura se aprovado
        if (paymentData.status === 'approved') {
          await db.collection('subscriptions').doc(paymentData.external_reference).set({
            status: 'active',
            paymentId: paymentData.id,
            updatedAt: new Date(),
          }, { merge: true })
        }
  return res.status(200).json(serialize({ message: 'Webhook processado com sucesso', payment_id: id, status: paymentData.status }))
      }

      // --- ASSINATURA: status, start-trial, cancel, reactivate ---
      if (['status','start-trial','cancel','reactivate'].includes(action)) {
        const { userId } = req.query
        if (!userId) {
      return res.status(400).json(serialize({ success: false, error: 'userId é obrigatório' }))
        }
        switch (action) {
          case 'status':
            return await handleStatus(req, res, userId)
          case 'start-trial':
            return await handleStartTrial(req, res, userId)
          case 'cancel':
            return await handleCancel(req, res, userId)
          case 'reactivate':
            return await handleReactivate(req, res, userId)
        }
      }

      // --- DEFAULT: ACTION NOT FOUND ---
  return res.status(400).json(serialize({ error: 'Invalid or missing action' }))
    } catch (error) {
      console.error('❌ Erro no endpoint de assinatura:', error)
  return res.status(500).json(serialize({ error: 'Erro interno do servidor', message: error?.message }))
    }
  }

/**
 * Cancela assinatura
 */


async function handleCancel(req, res, userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get()
    
    if (!userDoc.exists) {
  return res.status(404).json(serialize({ 
        success: false, 
        error: 'Usuário não encontrado' 
      }))
    }

    const userData = userDoc.data()
    const subscription = userData.subscription || {}

    if (subscription.status === 'cancelled') {
  return res.status(400).json(serialize({ 
        success: false, 
        error: 'Assinatura já está cancelada' 
      }))
    }

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    })

    // Cancelar no Mercado Pago se houver subscription_id
    if (subscription.mercadopago_subscription_id) {
      try {
        await mercadopago.preapproval.cancel({
          id: subscription.mercadopago_subscription_id
        })
        console.log('✅ Assinatura cancelada no Mercado Pago')
      } catch (mpError) {
        console.warn('⚠️ Erro ao cancelar no Mercado Pago:', mpError)
      }
    }

    // Atualizar no Firestore
    const updatedSubscription = {
      ...subscription,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    }

    await db.collection('users').doc(userId).update({
      subscription: updatedSubscription
    })

    console.log('✅ Assinatura cancelada:', updatedSubscription)
    return res.json(serialize({ 
      success: true, 
      subscription: updatedSubscription 
    }))

  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error)
  return res.status(500).json(serialize({ 
      success: false, 
      error: 'Erro ao cancelar assinatura' 
    }))
  }
}

/**
 * Reativa assinatura
 */
async function handleReactivate(req, res, userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get()
    
    if (!userDoc.exists) {
  return res.status(404).json(serialize({ 
        success: false, 
        error: 'Usuário não encontrado' 
      }))
    }

    const userData = userDoc.data()
    const subscription = userData.subscription || {}

    if (subscription.status !== 'cancelled') {
  return res.status(400).json(serialize({ 
        success: false, 
        error: 'Assinatura não está cancelada' 
      }))
    }

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    })

    // Reativar no Mercado Pago se houver subscription_id
    if (subscription.mercadopago_subscription_id) {
      try {
        await mercadopago.preapproval.update({
          id: subscription.mercadopago_subscription_id,
          status: 'authorized'
        })
        console.log('✅ Assinatura reativada no Mercado Pago')
      } catch (mpError) {
        console.warn('⚠️ Erro ao reativar no Mercado Pago:', mpError)
      }
    }

    // Atualizar no Firestore
    const updatedSubscription = {
      ...subscription,
      status: 'active',
      reactivatedAt: new Date().toISOString()
    }

    await db.collection('users').doc(userId).update({
      subscription: updatedSubscription
    })

    console.log('✅ Assinatura reativada:', updatedSubscription)
    return res.json(serialize({ 
      success: true, 
      subscription: updatedSubscription 
    }))

  } catch (error) {
    console.error('❌ Erro ao reativar assinatura:', error)
  return res.status(500).json(serialize({ 
      success: false, 
      error: 'Erro ao reativar assinatura' 
    }))
  }
} 