import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, orderItems, pettyCashTransactions, attendance, branches, users, products, revenueTargets, budgets } from "../db/schema";
import { sql, eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { storeSchema, accountingSchema } from "../validators/schema";

const router = Router();

router.use(requireAuth);
router.use(requireRole("store_leader", "owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    const branchId = (req as any).user?.branchId;
    if (!branchId && (req as any).user?.role !== "owner") {
      return res.status(403).json({ error: "No branch ID assigned to this user" });
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const currentMonth = todayDate.substring(0, 7);

    // Omzet Hari Ini
    let eodCond = [eq(eodReports.isDeleted, false), sql`to_char(${eodReports.reportDate}, 'YYYY-MM-DD') = ${todayDate}`];
    if (branchId) eodCond.push(eq(eodReports.branchId, branchId));
    const eodResult = await db.select({ total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)` }).from(eodReports).where(and(...eodCond));
    const omzetHariIni = Number(eodResult[0]?.total || 0);

    // Monthly omzet
    let monthEodCond = [eq(eodReports.isDeleted, false), eq(eodReports.status, "APPROVED"), sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${currentMonth}`];
    if (branchId) monthEodCond.push(eq(eodReports.branchId, branchId));
    const monthOmzetResult = await db.select({ total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)` }).from(eodReports).where(and(...monthEodCond));
    const omzetBulanan = Number(monthOmzetResult[0]?.total || 0);

    // Revenue Target for this branch
    let targetBulanan = 100000000;
    if (branchId) {
      const targetRes = await db.select().from(revenueTargets)
        .where(and(eq(revenueTargets.branchId, branchId), eq(revenueTargets.month, currentMonth)))
        .limit(1);
      if (targetRes.length > 0) targetBulanan = Number(targetRes[0].targetRevenue);
    }
    const pencapaianOmzet = targetBulanan > 0 ? Math.round((omzetBulanan / targetBulanan) * 100) : 0;

    // Karyawan
    let userCond = [eq(users.isDeleted, false)];
    if (branchId) userCond.push(eq(users.branchId, branchId));
    const totalKaryawanResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(and(...userCond));
    const totalKaryawanCabang = Number(totalKaryawanResult[0]?.count || 0);

    // Kehadiran Hari Ini  
    let hadirCond = [eq(attendance.isDeleted, false), sql`to_char(${attendance.attendanceDate}, 'YYYY-MM-DD') = ${todayDate}`];
    const hadirQuery = db.select({ count: sql<number>`count(*)`, lateCount: sql<number>`sum(CASE WHEN ${attendance.timeIn} > '09:00:00' THEN 1 ELSE 0 END)` })
      .from(attendance)
      .innerJoin(users, eq(attendance.userId, users.id));
    if (branchId) hadirCond.push(eq(users.branchId, branchId));
    const hadirResult = await hadirQuery.where(and(...hadirCond));
    const karyawanHadir = Number(hadirResult[0]?.count || 0);
    const peringatanKeterlambatan = Number(hadirResult[0]?.lateCount || 0);

    // PO Menunggu
    let poCond = [eq(orders.status, 'PENDING')];
    if (branchId) poCond.push(eq(orders.branchId, branchId));
    const poResult = await db.select({ count: sql<number>`count(*)` }).from(orders).where(and(...poCond));
    const poMenunggu = Number(poResult[0]?.count || 0);

    // Petty Cash Sisa (budget - used)
    let pettyCashSisa = 0;
    if (branchId) {
      const budgetRes = await db.select().from(budgets)
        .where(and(eq(budgets.branchId, branchId), eq(budgets.month, currentMonth), eq(budgets.isDeleted, false)))
        .limit(1);
      const budgetAmount = budgetRes.length > 0 ? Number(budgetRes[0].pettyCashBudget) : 0;
      
      const usedRes = await db.select({ total: sql<number>`COALESCE(sum(${pettyCashTransactions.amount}), 0)` })
        .from(pettyCashTransactions)
        .where(and(eq(pettyCashTransactions.branchId, branchId), eq(pettyCashTransactions.isDeleted, false), sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${currentMonth}`));
      pettyCashSisa = budgetAmount - Number(usedRes[0]?.total || 0);
    }

    // Sales Trend (last 7 days)
    const salesTrendRaw = await db.select({
      date: eodReports.reportDate,
      total: sql<number>`COALESCE(sum(${eodReports.totalOmzet}), 0)`,
    })
    .from(eodReports)
    .where(and(
      eq(eodReports.isDeleted, false),
      ...(branchId ? [eq(eodReports.branchId, branchId)] : []),
      sql`${eodReports.reportDate} >= current_date - interval '7 days'`
    ))
    .groupBy(eodReports.reportDate)
    .orderBy(eodReports.reportDate);
    const salesTrend = salesTrendRaw.map(s => ({ date: s.date, omzet: Number(s.total) }));

    // Low Stock Items
    const lowStockItems = await db.select({ name: products.name, code: products.code, stock: products.stock, minStock: products.minStock })
      .from(products)
      .where(and(eq(products.isDeleted, false), sql`${products.stock} <= ${products.minStock}`))
      .limit(10);

    // Attendance List Today
    let attListCond = [eq(attendance.isDeleted, false), sql`to_char(${attendance.attendanceDate}, 'YYYY-MM-DD') = ${todayDate}`];
    if (branchId) attListCond.push(eq(users.branchId, branchId));
    const attendanceListRaw = await db.select({ name: users.name, timeIn: attendance.timeIn, timeOut: attendance.timeOut, status: attendance.status })
      .from(attendance)
      .innerJoin(users, eq(attendance.userId, users.id))
      .where(and(...attListCond))
      .orderBy(attendance.timeIn);
    const attendanceList = attendanceListRaw.map(a => ({
      name: a.name,
      timeIn: a.timeIn ? a.timeIn.substring(0, 5) : "-",
      timeOut: a.timeOut ? a.timeOut.substring(0, 5) : "-",
      status: a.status || (a.timeIn && a.timeIn > '09:00:00' ? 'Terlambat' : 'Tepat Waktu'),
    }));

    res.json({
      omzetHariIni,
      targetBulanan,
      pencapaianOmzet,
      transaksiHariIni: 0, // Olsera later
      stokKritis: lowStockItems.length,
      karyawanHadir,
      totalKaryawanCabang,
      peringatanKeterlambatan,
      poMenunggu,
      pettyCashSisa,
      salesTrend,
      hourlyTraffic: [], // Olsera later
      topPerformers: [],
      lowStockItems,
      attendanceList,
      pendingEOD: []
    });
  } catch (error) {
    console.error("Store Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- INVENTORY ---

router.get("/inventory", async (req, res) => {
  try {
    const inventoryData = await db.select().from(products).where(eq(products.isDeleted, false));
    res.json(inventoryData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ORDERS & ORDER ITEMS CRUD ---

router.get("/orders", async (req, res) => {
  try {
    const branchId = (req as any).user?.branchId;
    const role = (req as any).user?.role;
    
    const conditions = [];
    
    if (branchId && role !== "owner" && role !== "accounting") {
      conditions.push(eq(orders.branchId, branchId));
    }
    
    const allOrders = await db.select().from(orders).where(and(...conditions));
    res.json(allOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Transactional endpoint for creating Order with Order Items
router.post("/orders", validateRequest(storeSchema.createOrder), async (req, res) => {
  try {
    const { totalAmount, budgetId, items } = req.body;
    let branchId = (req as any).user?.branchId || req.body.branchId;
    const createdBy = (req as any).user?.id;

    if (!branchId) {
      const firstBranch = await db.select().from(branches).limit(1);
      if (firstBranch.length > 0) branchId = firstBranch[0].id;
    }
    
    if (!branchId) {
      return res.status(400).json({ error: "Cabang tidak ditemukan. Harap buat cabang terlebih dahulu di menu Admin." });
    }
    
    // We will use a db transaction
    const result = await db.transaction(async (tx) => {
      // 1. Insert Order
      const newOrder = await tx.insert(orders)
        .values({ branchId, createdBy, totalAmount, budgetId, status: "PENDING" })
        .returning();
        
      const orderId = newOrder[0].id;

      // 2. Insert Items if provided
      if (items && Array.isArray(items) && items.length > 0) {
        const itemsToInsert = items.map((item: any) => ({
          orderId,
          productCode: item.productCode,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          movementCategory: item.movementCategory
        }));
        await tx.insert(orderItems).values(itemsToInsert);
      }

      return newOrder[0];
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalAmount, budgetId } = req.body;
    const updatedOrder = await db.update(orders)
      .set({ status, totalAmount, budgetId })
      .where(eq(orders.id, id as any))
      .returning();
    if (updatedOrder.length === 0) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/orders/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED
    const updatedOrder = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id as any))
      .returning();
    if (updatedOrder.length === 0) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id as any));
      await tx.delete(orders).where(eq(orders.id, id as any));
    });

    res.json({ message: "Order and items deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EOD REPORTS CRUD ---

router.get("/eod-reports", async (req, res) => {
  try {
    const branchId = (req as any).user?.branchId;
    const role = (req as any).user?.role;

    let eodCond = [eq(eodReports.isDeleted, false)];
    if (branchId && role !== "owner" && role !== "accounting") {
      eodCond.push(eq(eodReports.branchId, branchId));
    }

    const allEod = await db.select().from(eodReports).where(and(...eodCond));
    res.json(allEod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/eod-reports", validateRequest(storeSchema.createEod), async (req, res) => {
  try {
    let { reportDate, totalOmzet, cashAmount, edcAmount, qrisAmount, pettyCashUsed, evidencePhotos } = req.body;
    
    let branchId = (req as any).user?.branchId || req.body.branchId;
    const submittedBy = (req as any).user?.id;

    if (!branchId) {
      const firstBranch = await db.select().from(branches).limit(1);
      if (firstBranch.length > 0) branchId = firstBranch[0].id;
    }

    if (!branchId) {
      return res.status(400).json({ error: "Cabang tidak ditemukan. Harap buat cabang terlebih dahulu di menu Admin." });
    }

    const newEod = await db.insert(eodReports)
      .values({ branchId, reportDate, totalOmzet, cashAmount, edcAmount, qrisAmount, pettyCashUsed, evidencePhotos, submittedBy, status: "PENDING" })
      .returning();
    res.status(201).json(newEod[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/eod-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reportDate, totalOmzet, cashAmount, edcAmount, qrisAmount, pettyCashUsed, status, approvedBy } = req.body;
    const updatedEod = await db.update(eodReports)
      .set({ reportDate, totalOmzet, cashAmount, edcAmount, qrisAmount, pettyCashUsed, status, approvedBy })
      .where(eq(eodReports.id, id as any))
      .returning();
    if (updatedEod.length === 0) return res.status(404).json({ message: "EOD Report not found" });
    res.json(updatedEod[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/eod-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || "system";
    const deletedEod = await db.update(eodReports)
      .set({ isDeleted: true, updatedBy: currentUserId })
      .where(eq(eodReports.id, id as any))
      .returning();
    if (deletedEod.length === 0) return res.status(404).json({ message: "EOD Report not found" });
    res.json({ message: "EOD Report deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PETTY CASH CRUD ---

router.get("/petty-cash", async (req, res) => {
  try {
    const branchId = (req as any).user?.branchId;
    const role = (req as any).user?.role;

    let pettyCond = [eq(pettyCashTransactions.isDeleted, false)];
    if (branchId && role !== "owner" && role !== "accounting") {
      pettyCond.push(eq(pettyCashTransactions.branchId, branchId));
    }

    const allPettyCash = await db.select().from(pettyCashTransactions).where(and(...pettyCond));
    res.json(allPettyCash);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/petty-cash", validateRequest(accountingSchema.createPettyCash), async (req, res) => {
  try {
    let { description, amount, receiptPhotoUrl } = req.body;

    let branchId = (req as any).user?.branchId || req.body.branchId;
    const recordedBy = (req as any).user?.id;

    if (!branchId) {
      const firstBranch = await db.select().from(branches).limit(1);
      if (firstBranch.length > 0) branchId = firstBranch[0].id;
    }

    if (!branchId) {
      return res.status(400).json({ error: "Cabang tidak ditemukan. Harap buat cabang terlebih dahulu di menu Admin." });
    }

    const newPettyCash = await db.insert(pettyCashTransactions)
      .values({ branchId, description, amount, receiptPhotoUrl, recordedBy })
      .returning();
    res.status(201).json(newPettyCash[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/petty-cash/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, receiptPhotoUrl } = req.body;
    const updatedPettyCash = await db.update(pettyCashTransactions)
      .set({ description, amount, receiptPhotoUrl })
      .where(eq(pettyCashTransactions.id, id as any))
      .returning();
    if (updatedPettyCash.length === 0) return res.status(404).json({ message: "Petty Cash not found" });
    res.json(updatedPettyCash[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/petty-cash/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || "system";
    const deletedPettyCash = await db.update(pettyCashTransactions)
      .set({ isDeleted: true, updatedBy: currentUserId })
      .where(eq(pettyCashTransactions.id, id as any))
      .returning();
    if (deletedPettyCash.length === 0) return res.status(404).json({ message: "Petty Cash not found" });
    res.json({ message: "Petty Cash deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
