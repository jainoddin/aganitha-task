const startTime = Date.now();

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uptime = Math.floor((Date.now() - startTime) / 1000); // seconds

  return res.status(200).json({
    ok: true,
    version: '1.0',
    uptime,
  });
}

