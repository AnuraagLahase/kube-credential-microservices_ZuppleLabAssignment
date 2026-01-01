import pool from '../config/db';
import { VerificationLog } from '../types/verificationLog';

export async function createVerificationLog(log: VerificationLog): Promise<number> {
  const [result]: any = await pool.query(
    'INSERT INTO verification_log (credential_id, verified_by, is_valid, details) VALUES (?, ?, ?, ?)',
    [log.credential_id, log.verified_by, log.is_valid, JSON.stringify(log.details)]
  );
  return result.insertId;
}

export async function getVerificationLogById(id: number): Promise<VerificationLog | null> {
  const [rows]: any = await pool.query('SELECT * FROM verification_log WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}
