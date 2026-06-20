import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    await db.execute(sql.raw(`ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false`));
    await db.execute(sql.raw(`ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "updated_by" text`));
    console.log("Columns added successfully");
  } catch (e: any) {
    console.error("Error altering branches table:", e.message);
  }
  process.exit(0);
}

run();
