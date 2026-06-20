import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS "journal_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "entry_date" date NOT NULL,
        "description" text NOT NULL,
        "debit_account" varchar(100) NOT NULL,
        "credit_account" varchar(100) NOT NULL,
        "amount" numeric(15, 2) NOT NULL,
        "branch_id" uuid REFERENCES "branches"("id"),
        "created_by" text NOT NULL REFERENCES "users"("id"),
        "created_at" timestamp DEFAULT now(),
        "is_deleted" boolean DEFAULT false,
        "updated_by" text
      );
    `));
    console.log("journal_entries table created successfully");
  } catch (e: any) {
    console.error("Error creating table:", e.message);
  }
  process.exit(0);
}

run();
