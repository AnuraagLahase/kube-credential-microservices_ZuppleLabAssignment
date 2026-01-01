import pool from './config/db';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('DB Connection Successful:', rows);
  } catch (error) {
    console.error('DB Connection Failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
