import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    console.log("Adding columns to branches...");
    await db.execute(sql.raw(`ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8)`));
    await db.execute(sql.raw(`ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8)`));

    console.log("Adding columns to attendance...");
    await db.execute(sql.raw(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "latitude" numeric(10, 8)`));
    await db.execute(sql.raw(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "longitude" numeric(11, 8)`));
    await db.execute(sql.raw(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "status" varchar(50)`));
    await db.execute(sql.raw(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "notes" text`));
    
    console.log("Success phase 2 migrations!");
  } catch (e: any) {
    console.error(`Error migrating:`, e.message);
  }
  
  process.exit(0);
}

run();
