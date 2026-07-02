import fs from 'fs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = fs.readFileSync('./server/schema.sql', 'utf8');

async function migrate() {
  try {
    console.log('Running migrations...');
    await pool.query(schema);
    console.log('✅ Migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

migrate();
