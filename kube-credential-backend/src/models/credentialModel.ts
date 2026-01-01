import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Credential } from '../types/credential';

export async function createCredential(credential: Credential): Promise<number> {
  const existing = await findCredentialByFields(credential);
  if (existing) {
    throw new Error('Duplicate credential');
  }
  const [result]: any = await pool.query(
    'INSERT INTO credentials (user_id, credential, issued_by, status) VALUES (?, ?, ?, ?)',
    [credential.user_id, JSON.stringify(credential.credential), credential.issued_by, credential.status]
  );
  return result.insertId;
}


export async function getAllCredentials() {
  const [rows] = await pool.query('SELECT * FROM credentials ORDER BY issued_at DESC');
  return rows;
}

export async function findCredentialByFields(credentialData: any): Promise<RowDataPacket | null> {
  const user_id = credentialData.user_id;

  if (!user_id) {
    console.error('Missing user_id:', { user_id });
    return null;
  }

  const query = `
    SELECT * FROM credentials
    WHERE user_id = ?
    LIMIT 1;
  `;

  const [rows] = await pool.query<RowDataPacket[]>(query, [user_id]);
  return rows.length > 0 ? rows[0]! : null;
}



  



export async function getCredentialById(id: number): Promise<Credential | null> {
  const [rows]: any = await pool.query('SELECT * FROM credentials WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}
