import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
export { sql }

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS case_studies (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      slug        TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL,
      industry    TEXT NOT NULL,
      cover_image TEXT,
      content     TEXT,
      results     TEXT,
      images      TEXT[]  DEFAULT '{}',
      published   BOOLEAN DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
}
