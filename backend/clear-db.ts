import { db } from "./src/db";
import {
  roles,
  branches,
  users,
  session,
  account,
  verification,
  attendance,
  payroll,
  budgets,
  orders,
  orderItems,
  eodReports,
  pettyCashTransactions,
  bankReconciliations,
  revenueTargets,
  journalEntries
} from "./src/db/schema";
import { ne, eq } from "drizzle-orm";

async function clearDatabase() {
  const superAdminEmail = "owner@mirayya.com";

  console.log("Starting database cleanup...");

  // 1. Find the super admin
  const superAdminRows = await db.select().from(users).where(eq(users.email, superAdminEmail));
  if (superAdminRows.length === 0) {
    console.error("Super Admin not found!");
    process.exit(1);
  }
  const superAdmin = superAdminRows[0];
  console.log("Found Super Admin:", superAdmin.name, "with ID:", superAdmin.id);

  // 2. Clear branch reference from super admin to allow branch deletion
  await db.update(users).set({ branchId: null }).where(eq(users.id, superAdmin.id));

  // 3. Delete from child tables that depend on branches or users
  async function safeDelete(table: any, name: string) {
    try {
      console.log(`Deleting ${name}...`);
      await db.delete(table);
    } catch (e: any) {
      if (e.code === '42P01') {
        console.log(`Table ${name} does not exist, skipping.`);
      } else {
        console.error(`Failed to delete ${name}:`, e.message);
      }
    }
  }

  // 3. Delete from child tables that depend on branches or users
  await safeDelete(journalEntries, "journalEntries");
  await safeDelete(revenueTargets, "revenueTargets");
  await safeDelete(bankReconciliations, "bankReconciliations");
  await safeDelete(pettyCashTransactions, "pettyCashTransactions");
  await safeDelete(eodReports, "eodReports");
  await safeDelete(orderItems, "orderItems");
  await safeDelete(orders, "orders");
  await safeDelete(budgets, "budgets");
  await safeDelete(payroll, "payroll");
  await safeDelete(attendance, "attendance");
  await safeDelete(verification, "verification");

  // 4. Delete sessions and accounts except for super admin
  console.log("Deleting sessions...");
  try { await db.delete(session).where(ne(session.userId, superAdmin.id)); } catch (e:any) { console.error(e.message); }

  console.log("Deleting accounts...");
  try { await db.delete(account).where(ne(account.userId, superAdmin.id)); } catch (e:any) { console.error(e.message); }

  // 5. Delete all users except super admin
  console.log("Deleting users...");
  try { await db.delete(users).where(ne(users.id, superAdmin.id)); } catch (e:any) { console.error(e.message); }

  // 6. Delete all branches
  await safeDelete(branches, "branches");

  // 7. Delete all roles except super admin's role
  console.log("Deleting roles...");
  if (superAdmin.roleId) {
    try { await db.delete(roles).where(ne(roles.id, superAdmin.roleId)); } catch (e:any) { console.error(e.message); }
  }

  console.log("Database cleanup completed successfully! Only Super Admin remains.");
  process.exit(0);
}

clearDatabase().catch(console.error);
