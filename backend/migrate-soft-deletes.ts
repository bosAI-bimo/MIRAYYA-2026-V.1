import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  const tables = [
    "users",
    "attendance",
    "payroll",
    "eod_reports",
    "petty_cash_transactions",
    "journal_entries",
  ];

  for (const table of tables) {
    try {
      console.log(`Adding columns to ${table}...`);
      await db.execute(sql.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false`));
      await db.execute(sql.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "updated_by" text`));
      console.log(`Success for ${table}`);
    } catch (e: any) {
      console.error(`Error for ${table}:`, e.message);
    }
  }
  
  process.exit(0);
}

run();
