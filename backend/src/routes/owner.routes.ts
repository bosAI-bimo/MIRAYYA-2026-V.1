import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, attendance, branches, users } from "../db/schema";
import { sql, eq, desc } from "drizzle-orm";

const router = Router();

router.get("/dashboard-stats", async (req, res) => {
  try {
    // We fetch real data, but if it's 0 or empty, we return empty arrays as intended.

    // 1. Total Omzet
    const omzetResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` })
      .from(eodReports)
      .where(eq(eodReports.status, "APPROVED"));
    const totalOmzet = omzetResult[0]?.total || 0;

    // 2. Laba Bersih Estimasi (Simplified: 15% of omzet as placeholder logic, or 0)
    const labaBersih = totalOmzet * 0.15;

    // 3. Pencapaian Target (Using 0% if no data)
    const targetAchievement = totalOmzet > 0 ? 100 : 0; 

    // 4. Total Transaksi (Empty in schema, so 0)
    const totalTransaksi = 0;

    // 5. Total Karyawan
    const empResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalKaryawan = empResult[0]?.count || 0;

    // 6. Tingkat Kehadiran
    const today = new Date().toISOString().split('T')[0];
    const presentTodayResult = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(eq(attendance.attendanceDate, today));
    const hadirHariIni = presentTodayResult[0]?.count || 0;
    const tingkatKehadiran = totalKaryawan > 0 ? Math.round((hadirHariIni / totalKaryawan) * 100) : 0;

    // 7. PO Pending
    const pendingPoResult = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "PENDING"));
    const pendingPo = pendingPoResult[0]?.count || 0;

    // Return empty arrays for lists to strip dummy data
    res.json({
      totalOmzet,
      labaBersih,
      targetAchievement,
      totalTransaksi,
      totalKaryawan,
      tingkatKehadiran,
      pendingPo,
      stokKritis: 0, // Not tracked in DB schema directly yet
      omzetData: [],
      profitTrend: [],
      cashFlowStatus: { in: 0, out: 0, net: 0 },
      costBreakdown: [],
      paymentMethods: [],
      branchProfitability: [],
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
