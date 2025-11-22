// Debug endpoint to check environment variables
export default function handler(req, res) {
  // Security: Only allow in development or if explicitly enabled
  const isDev = process.env.NODE_ENV === 'development';
  const allowDebug = process.env.ALLOW_DEBUG === 'true' || isDev;
  
  if (!allowDebug) {
    return res.status(403).json({ 
      error: 'Debug endpoint disabled in production',
      hint: 'Set ALLOW_DEBUG=true in environment variables to enable'
    });
  }

  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
    databaseUrlPreview: process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.substring(0, 30) + '...' 
      : 'NOT SET',
    allDatabaseVars: Object.keys(process.env).filter(k => k.startsWith('DATABASE')),
    allEnvVars: Object.keys(process.env).sort(),
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json(envInfo);
}

