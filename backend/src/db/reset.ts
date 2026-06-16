import { db } from './index';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🗑️ Dropping schema...');
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  await db.execute(sql`CREATE SCHEMA public;`);
  console.log('✅ Schema dropped and recreated.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
