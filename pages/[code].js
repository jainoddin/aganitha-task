const { pool } = require('../lib/db');

export async function getServerSideProps(context) {
  const { code } = context.params;

  try {
    const result = await pool.query('SELECT url FROM links WHERE code = $1', [code]);

    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    const url = result.rows[0].url;

    // Update click count and last clicked time
    await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = $1',
      [code]
    );

    // Perform 302 redirect
    return {
      redirect: {
        destination: url,
        permanent: false, // 302 redirect
      },
    };
  } catch (error) {
    console.error('Error redirecting:', error);
    return {
      notFound: true,
    };
  }
}

export default function Redirect() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}

