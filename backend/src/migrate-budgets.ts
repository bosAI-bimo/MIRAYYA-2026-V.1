import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({ 
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    const client = await pool.connect();
    
    // Attempt to add columns
    await client.query(`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS petty_cash_budget numeric(15, 2) DEFAULT 0 NOT NULL;`);
    await client.query(`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS shopping_budget numeric(15, 2) DEFAULT 0 NOT NULL;`);
    await client.query(`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS target_achievement numeric(15, 2) DEFAULT 0 NOT NULL;`);
    
    // Drop 'amount' if it exists
    try {
      await client.query(`ALTER TABLE budgets DROP COLUMN IF EXISTS amount;`);
      console.log('Dropped amount column');
    } catch(e: any) {
      console.log('amount column might not exist or already dropped', e.message);
    }

    console.log('Migration successful');
    client.release();
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

migrate();
