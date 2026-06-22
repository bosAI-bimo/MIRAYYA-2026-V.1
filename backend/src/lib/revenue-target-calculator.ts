import { db } from "../db";
import { eodReports, revenueTargets, branches } from "../db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * Calculates and inserts revenue targets for the NEXT month
 * based on the historical average of the last 3 months.
 */
export async function calculateNextMonthTargets() {
  try {
    const today = new Date();
    const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthStr = nextMonthDate.toISOString().substring(0, 7);

    // Get past 3 months
    const pastMonths = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      pastMonths.push(d.toISOString().substring(0, 7));
    }
    const [month1, month2, month3] = pastMonths;

    console.log(`Calculating targets for ${nextMonthStr} based on: ${pastMonths.join(', ')}`);

    const allBranches = await db.select().from(branches).where(eq(branches.isDeleted, false));
    const results = [];

    for (const b of allBranches) {
      // Get historical EOD for this branch over the last 3 months
      const historicalData = await db.select({
        total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)`,
      })
      .from(eodReports)
      .where(and(
        eq(eodReports.branchId, b.id),
        eq(eodReports.status, "APPROVED"),
        eq(eodReports.isDeleted, false),
        sql`to_char(${eodReports.reportDate}, 'YYYY-MM') IN (${month1}, ${month2}, ${month3})`
      ));

      const totalHistorical = Number(historicalData[0]?.total || 0);
      
      // Average per month + 10% growth expectation
      let avgRevenue = totalHistorical / 3;
      if (avgRevenue === 0) avgRevenue = 50000000; // default baseline if no data

      const targetRevenue = Math.round(avgRevenue * 1.1); // 10% growth target

      // Check if target already exists for next month
      const existing = await db.select().from(revenueTargets).where(and(
        eq(revenueTargets.branchId, b.id),
        eq(revenueTargets.month, nextMonthStr)
      )).limit(1);

      if (existing.length > 0) {
        // Update
        const updated = await db.update(revenueTargets)
          .set({
            targetRevenue: targetRevenue.toString(),
            avgPeriodStart: `${month3}-01`,
            avgPeriodEnd: `${month1}-31`,
            updatedBy: "system_cron",
          })
          .where(eq(revenueTargets.id, existing[0].id))
          .returning();
        results.push(updated[0]);
      } else {
        // Insert
        const inserted = await db.insert(revenueTargets)
          .values({
            branchId: b.id,
            month: nextMonthStr,
            targetRevenue: targetRevenue.toString(),
            avgPeriodStart: `${month3}-01`,
            avgPeriodEnd: `${month1}-31`,
          })
          .returning();
        results.push(inserted[0]);
      }
    }

    return results;
  } catch (error) {
    console.error("Target calculation error:", error);
    throw error;
  }
}
