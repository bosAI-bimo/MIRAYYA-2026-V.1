import { db } from "./src/db";
import { branches } from "./src/db/schema";
import { sql } from "drizzle-orm";

async function run() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(branches);
  console.log("Branches count:", result[0].count);
  process.exit(0);
}
run();
