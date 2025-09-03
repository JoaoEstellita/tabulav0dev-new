const admin = require('firebase-admin')
// Necessário para habilitar o serviço de Storage no Admin SDK em runtime (side-effect)
require('firebase-admin/storage')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tabula-estelar-84fdc.appspot.com',
  })
}

module.exports = admin


