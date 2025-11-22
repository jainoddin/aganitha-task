const { pool } = require('../../../lib/db');

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    // Get stats for a code
    try {
      const result = await pool.query(
        'SELECT code, url, clicks, created_at, last_clicked_at FROM links WHERE code = $1',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching link:', error);
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'Database not configured. Please set DATABASE_URL environment variable.' });
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // Delete link
    try {
      const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      return res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'Database not configured. Please set DATABASE_URL environment variable.' });
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

