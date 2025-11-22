const { pool } = require('../../../lib/db');
const fs = require('fs');
const path = require('path');

// Generate random code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Validate code format [A-Za-z0-9]{6,8}
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export default async function handler(req, res) {
  // Check database connection
  console.log('API Handler - DATABASE_URL check:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('API Handler - All env vars starting with DATABASE:', Object.keys(process.env).filter(k => k.startsWith('DATABASE')));
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment');
    console.error('Current working directory:', process.cwd());
    console.error('NODE_ENV:', process.env.NODE_ENV);
    return res.status(500).json({ 
      error: 'Database not configured. Please set DATABASE_URL environment variable.',
      hint: 'Make sure .env.local exists and restart the dev server',
      debug: {
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV,
        hasEnvFile: fs.existsSync(path.join(process.cwd(), '.env.local'))
      }
    });
  }

  if (req.method === 'POST') {
    // Create link
    try {
      const { url, code: customCode } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      let code = customCode;
      if (code) {
        if (!isValidCode(code)) {
          return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
        }
      } else {
        // Generate random code
        let attempts = 0;
        do {
          code = generateCode();
          attempts++;
          if (attempts > 10) {
            return res.status(500).json({ error: 'Failed to generate unique code' });
          }
        } while (false); // Will check uniqueness in DB
      }

      // Check if code exists
      const existing = await pool.query('SELECT id FROM links WHERE code = $1', [code]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }

      // Insert new link
      const result = await pool.query(
        'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
        [code, url]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating link:', error);
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Code already exists' });
      }
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'Database not configured. Please set DATABASE_URL environment variable.' });
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // List all links
    try {
      const result = await pool.query(
        'SELECT code, url, clicks, created_at, last_clicked_at FROM links ORDER BY created_at DESC'
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching links:', error);
      if (error.message && error.message.includes('connect')) {
        return res.status(500).json({ 
          error: 'Database connection failed. Check your DATABASE_URL and ensure the database is accessible.',
          details: error.message 
        });
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

