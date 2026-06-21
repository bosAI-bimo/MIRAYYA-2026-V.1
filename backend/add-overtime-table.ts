import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Creating overtime_requests table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS overtime_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id),
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        approved_by TEXT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        updated_by TEXT
      );
    `);
    console.log("overtime_requests table created successfully!");
  } catch (error) {
    console.error("Error creating overtime_requests table:", error);
  } finally {
    process.exit(0);
  }
}

main();
