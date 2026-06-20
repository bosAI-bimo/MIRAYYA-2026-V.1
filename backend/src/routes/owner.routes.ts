import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, attendance, branches, users, pettyCashTransactions } from "../db/schema";
import { sql, eq, and, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    // 1. Total Omzet Bulan Ini
    const omzetResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` })
      .from(eodReports)
      .where(and(
        eq(eodReports.status, "APPROVED"),
        eq(eodReports.isDeleted, false),
        sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`
      ));
    const totalOmzet = Number(omzetResult[0]?.total || 0);

    // Total Cost (Petty Cash + Journal approx)
    const costResult = await db.select({ total: sql<number>`sum(${pettyCashTransactions.amount})` })
      .from(pettyCashTransactions)
      .where(and(
        eq(pettyCashTransactions.isDeleted, false),
        sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`
      ));
    const totalCost = Number(costResult[0]?.total || 0) + (totalOmzet * 0.4); // Add COGS approx

    // 2. Laba Bersih
    const labaBersih = totalOmzet - totalCost;

    // 3. Pencapaian Target (Using 1M as dummy overall target)
    const overallTarget = 100000000;
    const targetAchievement = Math.min(Math.round((totalOmzet / overallTarget) * 100), 100);

    // 4. Total Karyawan
    const empResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isDeleted, false));
    const totalKaryawan = Number(empResult[0]?.count || 0);

    // 5. Tingkat Kehadiran Hari Ini
    const presentTodayResult = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(and(eq(attendance.attendanceDate, today), eq(attendance.isDeleted, false)));
    const hadirHariIni = Number(presentTodayResult[0]?.count || 0);
    const tingkatKehadiran = totalKaryawan > 0 ? Math.round((hadirHariIni / totalKaryawan) * 100) : 0;

    // 6. PO Pending
    const pendingPoResult = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "PENDING"));
    const pendingPo = Number(pendingPoResult[0]?.count || 0);

    // --- AGGREGATIONS ---

    // Omzet Data per Cabang
    const branchesData = await db.select({
      id: branches.id,
      name: branches.name
    }).from(branches);

    const omzetData = [];
    const branchProfitability = [];

    for (const b of branchesData) {
      // Omzet branch
      const bOmzetRes = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` })
        .from(eodReports)
        .where(and(
          eq(eodReports.branchId, b.id),
          eq(eodReports.status, "APPROVED"),
          eq(eodReports.isDeleted, false),
          sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`
        ));
      const bOmzet = Number(bOmzetRes[0]?.total || 0);

      // Cost branch
      const bCostRes = await db.select({ total: sql<number>`sum(${pettyCashTransactions.amount})` })
        .from(pettyCashTransactions)
        .where(and(
          eq(pettyCashTransactions.branchId, b.id),
          eq(pettyCashTransactions.isDeleted, false),
          sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`
        ));
      const bCost = Number(bCostRes[0]?.total || 0) + (bOmzet * 0.4);

      const bProfit = bOmzet - bCost;
      const bMargin = bOmzet > 0 ? Math.round((bProfit / bOmzet) * 100) : 0;
      
      let status = 'Good';
      if (bMargin < 5) status = 'Critical';
      else if (bMargin < 15) status = 'Warning';

      omzetData.push({
        name: b.name,
        omzet: bOmzet,
        target: 20000000 // Dummy branch target
      });

      branchProfitability.push({
        branch: b.name,
        revenue: bOmzet,
        cost: bCost,
        profit: bProfit,
        margin: bMargin,
        status
      });
    }

    // Sort profitability descending
    branchProfitability.sort((a, b) => b.profit - a.profit);

    // Dummy arrays for UI features not yet implemented
    res.json({
      totalOmzet,
      labaBersih,
      targetAchievement,
      totalTransaksi: 0,
      totalKaryawan,
      tingkatKehadiran,
      pendingPo,
      stokKritis: 0, 
      omzetData,
      profitTrend: [], // Pending historical query implementation
      cashFlowStatus: { in: totalOmzet, out: totalCost, net: labaBersih },
      costBreakdown: [],
      paymentMethods: [],
      branchProfitability,
      rfmSegmentDistribution: [],
      rfmScatterData: [],
      rfmCustomers: [],
      fastMoving: [],
      mediumMoving: [],
      slowMoving: [],
      deadStock: [],
      criticalStock: [],
      attendanceDetails: [],
      topPerformers: [],
      lateActionList: [],
      aiForecasting: [],
      aiRecommendations: []
    });
  } catch (error) {
    console.error("Owner Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
