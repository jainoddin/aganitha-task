const { Pool } = require('pg');

// Debug: Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please create a .env.local file with: DATABASE_URL=your_connection_string');
  console.error('Current working directory:', process.cwd());
  console.error('NODE_ENV:', process.env.NODE_ENV);
} else {
  console.log('✓ DATABASE_URL is set (length:', process.env.DATABASE_URL.length, 'characters)');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database schema
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_clicked_at TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_code ON links(code);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize on module load
if (process.env.NODE_ENV !== 'test') {
  initDb().catch(console.error);
}

module.exports = { pool, initDb };

