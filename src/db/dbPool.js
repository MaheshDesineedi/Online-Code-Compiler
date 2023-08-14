import { Pool } from 'pg';

const ybPool = new Pool({
  host: 'us-east-1.b9c51c25-8a3b-44f6-9b51-eeb9afdbb612.aws.ybdb.io',
  database: 'yogabyte',
  user: 'admin',
  password: process.env.DB_PASS, //'a4McWO8F6XAZN31rw3MSvYZ0yKL5Wj'
  port: 5433, // YugabyteDB default port
  max: 10,
  connectionTimeoutMillis: 5000
});

export const query = async (text, params) => {
  const start = Date.now()
  const res = await ybPool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, rows: res.rowCount, duration })
  return ybPool.query(text, params)
}

export const getClient = () => {
  return ybPool.connect()
}
