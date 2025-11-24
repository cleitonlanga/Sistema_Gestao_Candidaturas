import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

console.log("Database URL:", process.env.DATABASE_PUBLIC_URL);
// Railway fornece DATABASE_URL automaticamente
export const client = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  keepAlive: true
});

client.on('error', (err) => {
  console.error('Erro no pool PostgreSQL:', err);
});

client.on('connect', () => {
  console.log('✓ Conectado ao PostgreSQL Railway');
});

export const testarConexao = async () => {
  try {
    const result = await client.query('SELECT NOW(), current_database()');
    console.log('✓ Banco conectado:', result.rows[0].current_database);
    console.log('✓ Timestamp:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('✗ Erro na conexão:', error.message);
    return false;
  }
};