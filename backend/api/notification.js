// Unified notification endpoint: send, webpush, cron-daily
const admin = require('./_lib/admin')
const webpush = require('web-push')
const requireAuth = require('./_lib/auth')

webpush.setVapidDetails(
  'mailto:contato@tabulaestelar.com.br',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

function setCors(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim())
  const origin = req.headers.origin || ''
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

module.exports = async (req, res) => {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const action = req.query.action || req.body?.action

  // --- SEND INDIVIDUAL PUSH ---
  if (action === 'send') {
    await new Promise(resolve => requireAuth(req, res, resolve))
    if (res.headersSent) return
    try {
      const { token, title, body, data } = req.body || {}
      if (!token || !title || !body) {
        return res.status(400).json({ error: 'Missing required fields: token, title, body' })
      }
      await admin.messaging().send({
        token,
        notification: { title, body },
        data: data || {},
        android: { notification: { channel_id: 'astrology', priority: 'high', sound: 'default' } },
      })
      res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      res.status(500).json({ ok: false, error: error.message })
    }
    return
  }

  // --- WEBPUSH ---
  if (action === 'webpush') {
    await new Promise(resolve => requireAuth(req, res, resolve))
    if (res.headersSent) return
    try {
      const { userId, title = 'Tábula Estelar', body = 'Notificação Web Push' } = req.body || {}
      if (!userId) return res.status(400).json({ error: 'Missing userId' })
      const snap = await admin.firestore().collection(`users/${userId}/webPushSubscriptions`).limit(1).get()
      if (snap.empty) return res.status(404).json({ error: 'No subscription' })
      const { endpoint, keys } = snap.docs[0].data()
      await webpush.sendNotification({ endpoint, keys }, JSON.stringify({ title, body }))
      res.json({ ok: true })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'internal' })
    }
    return
  }

  // --- CRON DAILY NOTIFICATIONS ---
  if (action === 'cron-daily') {
    const cronToken = req.headers['authorization'] || req.query.token
    if (cronToken !== process.env.CRON_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized cron access' })
    }
    try {
      const db = admin.firestore()
      const usersSnapshot = await db.collection('users').get()
      let successCount = 0
      for (const userDoc of usersSnapshot.docs) {
        // ... lógica de envio ...
        successCount++
      }
      res.status(200).json({ ok: true, sent: successCount })
    } catch (error) {
      console.error('Erro no cron de notificações:', error)
      res.status(500).json({ ok: false, error: error.message })
    }
    return
  }

  // --- DEFAULT: ACTION NOT FOUND ---
  res.status(400).json({ error: 'Invalid or missing action' })
}
