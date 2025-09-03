// Autorização por header Bearer; tolera execução agendada do Vercel (x-vercel-cron)
function assertAuth(req, res, opts = {}) {
  const SECRET = process.env.BACKEND_SECRET || process.env.API_TOKEN || '';
  const auth = req.headers?.authorization || '';
  // Permitir cron do Vercel quando solicitado explicitamente
  if (opts?.allowVercelCron && req.headers['x-vercel-cron']) return true;
  if (!SECRET) {
    res.status(500).json({ error: 'Server misconfig: BACKEND_SECRET not set' });
    return false;
  }
  if (auth !== `Bearer ${SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

module.exports = { assertAuth };
