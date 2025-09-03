const admin = require('./_lib/admin')
const webpush = require('web-push')
const { serialize } = require('./_lib/serialize')

// Utilitário CORS
function setCors(req, res, methods = 'POST, GET, OPTIONS') {
  const origins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const origin = req.headers.origin
  const allowOrigin = origin && origins.includes(origin) ? origin : (origins[0] || '*')
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control')
  res.setHeader('Access-Control-Max-Age', '600')
}

webpush.setVapidDetails('mailto:contato@tabulaestelar.com.br', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

module.exports = async (req, res) => {
  // Roteamento por action
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const action = req.query.action || req.body?.action

  // --- GROUP NOTIFY ---
  if (action === 'group-notify' && req.method === 'POST') {
    try {
      const { groupId, title, body, data = {} } = req.body || {}
  if (!groupId || !title || !body) return res.status(400).json(serialize({ error: 'Missing fields' }))
      const alertId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await admin.firestore().doc(`groupAlerts/${groupId}/${alertId}`).set({
        title, body, type: data?.type || 'generic', createdAt: admin.firestore.FieldValue.serverTimestamp(), senderId: data?.senderId || null, targets: data?.targets || []
      })
      const groupDoc = await admin.firestore().doc(`groups/${groupId}`).get()
  if (!groupDoc.exists) return res.status(404).json(serialize({ error: 'Group not found' }))
      const group = groupDoc.data()
      const memberIds = Array.isArray(group.members) ? group.members : []
      let sentAndroid = 0, sentWeb = 0
      await Promise.all(memberIds.map(async (uid) => {
        const fcmSnap = await admin.firestore().collection(`users/${uid}/fcmTokens`).get()
        await Promise.all(fcmSnap.docs.map(async (d) => {
          const token = d.data().token
          try { await admin.messaging().send({ token, notification: { title, body }, data: { ...data, groupId } }); sentAndroid++ } catch {}
        }))
        const subSnap = await admin.firestore().collection(`users/${uid}/webPushSubscriptions`).get()
        await Promise.all(subSnap.docs.map(async (d) => {
          const { endpoint, keys } = d.data()
          try { await webpush.sendNotification({ endpoint, keys }, JSON.stringify({ title, body, groupId })); sentWeb++ } catch {}
        }))
      }))
  return res.json(serialize({ ok: true, sentAndroid, sentWeb }))
    } catch (e) {
      return res.status(500).json(serialize({ error: 'notify-fail', message: e?.message }))
    }
  }

  // --- UPLOAD PROFILE PHOTO ---
  if (action === 'upload-profile-photo' && req.method === 'POST') {
    try {
      const { userId, dataUrl } = req.body || {}
      if (!userId || !dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        return res.status(400).json(serialize({ error: 'Missing userId/dataUrl' }))
      }
      const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
      if (!match) return res.status(400).json(serialize({ error: 'Invalid dataUrl' }))
      const mimeType = match[1]
      const buffer = Buffer.from(match[2], 'base64')
      const bucket = admin.storage().bucket()
      if (!bucket || !bucket.name) throw new Error('Storage bucket não configurado')
      const filename = `users/${userId}/profile-${Date.now()}.jpg`
      const file = bucket.file(filename)
      const token = (Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/\./g, '')
      await file.save(buffer, { resumable: false, metadata: { contentType: mimeType || 'image/jpeg', cacheControl: 'public, max-age=31536000', metadata: { firebaseStorageDownloadTokens: token } } })
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`
  return res.json(serialize({ url }))
    } catch (err) {
      return res.status(500).json(serialize({ error: 'Upload failed', message: err?.message }))
    }
  }

  // --- ASTRO POSITIONS ---
  if (action === 'astro-positions' && req.method === 'POST') {
    // (simplificado, sem cache/rate limit)
    try {
      const { datetimeISO, datetimeLocal, timezone, offsetMinutes, lat, lon, bodies, includeHouses, system, natalISO, natalLocal, natalTimezone, natalOffsetMinutes, natalLat, natalLon, ascOverrideDeg, natalAscOverrideDeg } = req.body || {}
      if ((!datetimeISO && !datetimeLocal) || typeof lat !== 'number' || typeof lon !== 'number') {
        return res.status(400).json(serialize({ error: 'Missing datetimeISO and/or lat/lon' }))
      }
      // Aqui você chamaria sua engine de cálculo astrológico
      // Exemplo de resposta mock:
  return res.json(serialize({ ok: true, positions: [], houses: [], debug: true }))
    } catch (e) {
      return res.status(500).json(serialize({ error: 'astro-fail', message: e?.message }))
    }
  }

  // --- TIMEZONE PROXY ---
  if (action === 'timezone' && req.method === 'GET') {
    try {
      const lat = parseFloat(String(req.query.lat))
      const lon = parseFloat(String(req.query.lon))
      const ts = parseInt(String(req.query.ts), 10)
      if (!isFinite(lat) || !isFinite(lon) || !isFinite(ts)) {
        return res.status(400).json(serialize({ error: 'invalid params', hint: 'lat, lon, ts (UTC seconds) são obrigatórios' }))
      }
      const key = process.env.GOOGLE_TZ_KEY
  if (!key) return res.status(500).json(serialize({ error: 'missing key' }))
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${ts}&key=${key}`
      const upstream = await fetch(url)
  if (!upstream.ok) return res.status(502).json(serialize({ error: 'upstream', status: upstream.status }))
      const data = await upstream.json()
  if (data.status !== 'OK') return res.status(400).json(serialize({ error: 'bad-response', status: data.status, message: data.errorMessage || null }))
      const raw = Number(data.rawOffset)
      const dst = Number(data.dstOffset)
  if (!Number.isFinite(raw) || !Number.isFinite(dst)) return res.status(400).json(serialize({ error: 'bad-response', raw: data }))
      const offsetSec = raw + dst
  return res.status(200).json(serialize({ offsetSec, timeZoneId: data.timeZoneId }))
    } catch (e) {
      return res.status(500).json(serialize({ error: 'fail', message: e?.message || String(e) }))
    }
  }

  // --- DEFAULT ---
  return res.status(400).json(serialize({ error: 'Invalid or missing action' }))
}
