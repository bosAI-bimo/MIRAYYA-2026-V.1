import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) UNIQUE;`);
    console.log("Column employee_id added successfully!");
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    process.exit(0);
  }
}

run();
