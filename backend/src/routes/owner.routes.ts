import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, orderItems, attendance, branches, users, pettyCashTransactions, products, revenueTargets, budgets, roles } from "../db/schema";
import { sql, eq, and, desc, gte, lte, count } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { generateStockRecommendations, generateRevenueInsights, generateSimpleForecasting } from "../lib/analytics-engine";

const router = Router();

router.use(requireAuth);
router.use(requireRole("owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);
    // Calculate 6 months ago for trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0].substring(0, 7);

    // ═══════════════════════════════════════
    // 1. KPI CARDS
    // ═══════════════════════════════════════

    // Total Omzet Bulan Ini
    const omzetResult = await db.select({ total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)` })
      .from(eodReports)
      .where(and(
        eq(eodReports.status, "APPROVED"),
        eq(eodReports.isDeleted, false),
        sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`
      ));
    const totalOmzet = Number(omzetResult[0]?.total || 0);

    // Total Petty Cash (operating cost) Bulan Ini
    const costResult = await db.select({ total: sql<number>`COALESCE(sum(${pettyCashTransactions.amount}), 0)` })
      .from(pettyCashTransactions)
      .where(and(
        eq(pettyCashTransactions.isDeleted, false),
        sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`
      ));
    const totalPettyCash = Number(costResult[0]?.total || 0);
    const estimatedCOGS = totalOmzet * 0.4;
    const totalCost = totalPettyCash + estimatedCOGS;
    const labaBersih = totalOmzet - totalCost;

    // Revenue Target
    const targetsResult = await db.select({ total: sql<number>`COALESCE(sum(${revenueTargets.targetRevenue}), 0)` })
      .from(revenueTargets)
      .where(and(
        eq(revenueTargets.isDeleted, false),
        eq(revenueTargets.month, currentMonth)
      ));
    const overallTarget = Number(targetsResult[0]?.total || 0) || 100000000;
    const targetAchievement = Math.min(Math.round((totalOmzet / overallTarget) * 100), 100);

    // Total Karyawan
    const empResult = await db.select({ count: sql<number>`count(*)` })
      .from(users).where(eq(users.isDeleted, false));
    const totalKaryawan = Number(empResult[0]?.count || 0);

    // Kehadiran Hari Ini
    const presentTodayResult = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(and(eq(attendance.attendanceDate, today), eq(attendance.isDeleted, false)));
    const hadirHariIni = Number(presentTodayResult[0]?.count || 0);
    const tingkatKehadiran = totalKaryawan > 0 ? Math.round((hadirHariIni / totalKaryawan) * 100) : 0;

    // PO Pending
    const pendingPoResult = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "PENDING"));
    const pendingPo = Number(pendingPoResult[0]?.count || 0);

    // Critical Stock
    const criticalStockResult = await db.select({
      id: products.id,
      name: products.name,
      code: products.code,
      stock: products.stock,
      minStock: products.minStock,
      category: products.category,
    })
    .from(products)
    .where(and(
      eq(products.isDeleted, false),
      sql`${products.stock} <= ${products.minStock}`
    ))
    .limit(20);

    // ═══════════════════════════════════════
    // 2. BRANCH DATA (Omzet & Profitability)
    // ═══════════════════════════════════════
    
    const branchesData = await db.select({ id: branches.id, name: branches.name })
      .from(branches)
      .where(eq(branches.isDeleted, false));

    const omzetData = [];
    const branchProfitability = [];

    // Per-branch revenue targets for this month
    const branchTargets = await db.select()
      .from(revenueTargets)
      .where(and(eq(revenueTargets.isDeleted, false), eq(revenueTargets.month, currentMonth)));
    const targetMap = new Map(branchTargets.map(t => [t.branchId, Number(t.targetRevenue)]));

    for (const b of branchesData) {
      const bOmzetRes = await db.select({ total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)` })
        .from(eodReports)
        .where(and(
          eq(eodReports.branchId, b.id), eq(eodReports.status, "APPROVED"),
          eq(eodReports.isDeleted, false),
          sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`
        ));
      const bOmzet = Number(bOmzetRes[0]?.total || 0);

      const bCostRes = await db.select({ total: sql<number>`COALESCE(sum(${pettyCashTransactions.amount}), 0)` })
        .from(pettyCashTransactions)
        .where(and(
          eq(pettyCashTransactions.branchId, b.id), eq(pettyCashTransactions.isDeleted, false),
          sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`
        ));
      const bCost = Number(bCostRes[0]?.total || 0) + (bOmzet * 0.4);
      const bProfit = bOmzet - bCost;
      const bMargin = bOmzet > 0 ? Math.round((bProfit / bOmzet) * 100) : 0;

      let status = 'Good';
      if (bMargin < 5) status = 'Critical';
      else if (bMargin < 15) status = 'Warning';

      const branchTarget = targetMap.get(b.id) || 20000000;
      omzetData.push({ name: b.name, omzet: bOmzet, target: branchTarget });
      branchProfitability.push({
        branch: b.name, revenue: bOmzet, cost: bCost, profit: bProfit, margin: bMargin, status
      });
    }
    branchProfitability.sort((a, b) => b.profit - a.profit);

    // ═══════════════════════════════════════
    // 3. PROFIT TREND (monthly, last 6 months)
    // ═══════════════════════════════════════
    
    const profitTrendRaw = await db.select({
      month: sql<string>`to_char(${eodReports.reportDate}, 'YYYY-MM')`,
      revenue: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)`,
    })
    .from(eodReports)
    .where(and(
      eq(eodReports.status, "APPROVED"), eq(eodReports.isDeleted, false),
      sql`to_char(${eodReports.reportDate}, 'YYYY-MM') >= ${sixMonthsAgoStr}`
    ))
    .groupBy(sql`to_char(${eodReports.reportDate}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${eodReports.reportDate}, 'YYYY-MM')`);

    const profitTrend = profitTrendRaw.map(r => {
      const rev = Number(r.revenue);
      const cost = rev * 0.4; // Estimated COGS
      return { month: r.month, revenue: rev, cost, profit: rev - cost };
    });

    // ═══════════════════════════════════════
    // 4. PAYMENT METHODS BREAKDOWN
    // ═══════════════════════════════════════
    
    const paymentResult = await db.select({
      totalCash: sql<number>`COALESCE(sum(${eodReports.cashAmount}), 0)`,
      totalEdc: sql<number>`COALESCE(sum(${eodReports.edcAmount}), 0)`,
      totalQris: sql<number>`COALESCE(sum(${eodReports.qrisAmount}), 0)`,
    })
    .from(eodReports)
    .where(and(
      eq(eodReports.status, "APPROVED"), eq(eodReports.isDeleted, false),
      sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`
    ));
    const pm = paymentResult[0];
    const paymentMethods = [
      { name: "Cash", value: Number(pm?.totalCash || 0), color: "#10b981" },
      { name: "EDC", value: Number(pm?.totalEdc || 0), color: "#6366f1" },
      { name: "QRIS", value: Number(pm?.totalQris || 0), color: "#f59e0b" },
    ];

    // ═══════════════════════════════════════
    // 5. PRODUCT MOVEMENT ANALYSIS
    // ═══════════════════════════════════════
    
    const allProducts = await db.select()
      .from(products)
      .where(eq(products.isDeleted, false));

    const fastMoving = allProducts.filter(p => p.movement === 'fast').slice(0, 10).map(p => ({
      name: p.name, code: p.code, stock: p.stock, category: p.category, hpp: Number(p.hpp), sellPrice: Number(p.sellPrice)
    }));
    const mediumMoving = allProducts.filter(p => p.movement === 'medium').slice(0, 10).map(p => ({
      name: p.name, code: p.code, stock: p.stock, category: p.category
    }));
    const slowMoving = allProducts.filter(p => p.movement === 'slow').slice(0, 10).map(p => ({
      name: p.name, code: p.code, stock: p.stock, category: p.category
    }));
    const deadStock = allProducts.filter(p => p.movement === 'dead' || p.stock === 0).slice(0, 10).map(p => ({
      name: p.name, code: p.code, stock: p.stock, category: p.category
    }));

    // ═══════════════════════════════════════
    // 6. ATTENDANCE DETAILS (today)
    // ═══════════════════════════════════════
    
    const attendanceDetailsRaw = await db.select({
      name: users.name,
      timeIn: attendance.timeIn,
      timeOut: attendance.timeOut,
      status: attendance.status,
      branchName: branches.name,
      roleName: roles.name,
    })
    .from(attendance)
    .innerJoin(users, eq(attendance.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(and(eq(attendance.attendanceDate, today), eq(attendance.isDeleted, false)))
    .orderBy(desc(attendance.timeIn));

    const attendanceDetails = attendanceDetailsRaw.map(a => ({
      name: a.name,
      branch: a.branchName || "Pusat",
      role: a.roleName || "Staff",
      timeIn: a.timeIn ? a.timeIn.substring(0, 5) : "-",
      timeOut: a.timeOut ? a.timeOut.substring(0, 5) : "-",
      status: a.status || (a.timeIn && a.timeIn > '09:00:00' ? 'Terlambat' : 'Tepat Waktu'),
    }));

    // ═══════════════════════════════════════
    // 7. TOP PERFORMERS (by attendance this month)
    // ═══════════════════════════════════════
    
    const topPerformersRaw = await db.select({
      name: users.name,
      branchName: branches.name,
      totalHadir: sql<number>`count(${attendance.id})`,
    })
    .from(attendance)
    .innerJoin(users, eq(attendance.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .where(and(
      eq(attendance.isDeleted, false),
      sql`to_char(${attendance.attendanceDate}, 'YYYY-MM') = ${currentMonth}`
    ))
    .groupBy(users.id, users.name, branches.name)
    .orderBy(sql`count(${attendance.id}) DESC`)
    .limit(10);

    const topPerformers = topPerformersRaw.map(p => ({
      name: p.name,
      branch: p.branchName || "Pusat",
      totalHadir: Number(p.totalHadir),
      skor: Math.min(100, Math.round((Number(p.totalHadir) / 22) * 100)),
    }));

    // ═══════════════════════════════════════
    // 8. LATE ACTION LIST (employees late >3x this month)
    // ═══════════════════════════════════════
    
    const lateListRaw = await db.select({
      name: users.name,
      branchName: branches.name,
      lateCount: sql<number>`count(${attendance.id})`,
    })
    .from(attendance)
    .innerJoin(users, eq(attendance.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .where(and(
      eq(attendance.isDeleted, false),
      sql`to_char(${attendance.attendanceDate}, 'YYYY-MM') = ${currentMonth}`,
      sql`${attendance.timeIn} > '09:00:00'`
    ))
    .groupBy(users.id, users.name, branches.name)
    .orderBy(sql`count(${attendance.id}) DESC`)
    .limit(10);

    const lateActionList = lateListRaw
      .filter(l => Number(l.lateCount) >= 3)
      .map(l => ({
        name: l.name,
        branch: l.branchName || "Pusat",
        lateCount: Number(l.lateCount),
        action: Number(l.lateCount) >= 5 ? "Surat Peringatan" : "Teguran Lisan"
      }));

    // ═══════════════════════════════════════
    // 9. COST BREAKDOWN
    // ═══════════════════════════════════════
    
    const costBreakdownRaw = await db.select({
      description: pettyCashTransactions.description,
      total: sql<number>`sum(${pettyCashTransactions.amount})`,
      count: sql<number>`count(*)`,
    })
    .from(pettyCashTransactions)
    .where(and(
      eq(pettyCashTransactions.isDeleted, false),
      sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`
    ))
    .groupBy(pettyCashTransactions.description)
    .orderBy(sql`sum(${pettyCashTransactions.amount}) DESC`)
    .limit(10);

    const costBreakdown = costBreakdownRaw.map(c => ({
      category: c.description,
      amount: Number(c.total),
      count: Number(c.count),
    }));

    // ═══════════════════════════════════════
    // 10. CASH FLOW STATUS
    // ═══════════════════════════════════════
    
    const cashFlowStatus = {
      in: totalOmzet,
      out: totalCost,
      net: labaBersih,
    };

    // ═══════════════════════════════════════
    // RESPONSE
    // ═══════════════════════════════════════

    res.json({
      totalOmzet,
      labaBersih,
      targetAchievement,
      totalTransaksi: 0, // Will be from Olsera later
      totalKaryawan,
      tingkatKehadiran,
      pendingPo,
      stokKritis: criticalStockResult.length,
      omzetData,
      profitTrend,
      cashFlowStatus,
      costBreakdown,
      paymentMethods,
      branchProfitability,
      // Product movement
      fastMoving,
      mediumMoving,
      slowMoving,
      deadStock,
      criticalStock: criticalStockResult.map(p => ({
        name: p.name, code: p.code, stock: p.stock, minStock: p.minStock, category: p.category
      })),
      // Attendance
      attendanceDetails,
      topPerformers,
      lateActionList,
      // AI (from Analytics Engine)
      aiForecasting: generateSimpleForecasting(profitTrend),
      aiRecommendations: [
        ...generateRevenueInsights(branchProfitability, overallTarget, totalOmzet),
        ...generateStockRecommendations(allProducts.map(p => ({ ...p, hpp: Number(p.hpp), sellPrice: Number(p.sellPrice) })))
      ],
      // RFM placeholders (needs Olsera data)
      rfmSegmentDistribution: [],
      rfmScatterData: [],
      rfmCustomers: [],
    });
  } catch (error) {
    console.error("Owner Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
