import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    console.log("Creating products table...");
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "code" varchar(100) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "category" varchar(100) NOT NULL,
        "hpp" numeric(12, 2) NOT NULL,
        "sell_price" numeric(12, 2) NOT NULL,
        "stock" integer NOT NULL DEFAULT 0,
        "min_stock" integer NOT NULL DEFAULT 10,
        "movement" varchar(50) DEFAULT 'slow',
        "is_deleted" boolean DEFAULT false
      );
    `));
    
    // Check if empty to seed
    const res = await db.execute(sql.raw(`SELECT count(*) FROM "products"`));
    if (res.rows && Number(res.rows[0].count) === 0) {
      console.log("Seeding products...");
      await db.execute(sql.raw(`
        INSERT INTO "products" ("code", "name", "category", "hpp", "sell_price", "stock", "min_stock", "movement") VALUES
        ('SKN-001', 'Mirayya Glow Serum', 'Skincare', 65000, 120000, 45, 20, 'slow'),
        ('SKN-002', 'Mirayya Hydrating Toner', 'Skincare', 45000, 85000, 12, 15, 'fast'),
        ('MKP-001', 'Matte Lip Cream - Rose', 'Makeup', 35000, 75000, 5, 15, 'fast'),
        ('BDY-001', 'Brightening Body Lotion', 'Bodycare', 50000, 95000, 8, 10, 'fast')
      `));
    }

    console.log("Success migrating products!");
  } catch (e: any) {
    console.error(`Error migrating products:`, e.message);
  }
  
  process.exit(0);
}

run();
