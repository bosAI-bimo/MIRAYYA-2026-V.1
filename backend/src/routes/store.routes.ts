import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, orderItems, pettyCashTransactions, attendance, branches, users, products } from "../db/schema";
import { sql, eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

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

    // Omzet Hari Ini
    let eodCond = [eq(eodReports.isDeleted, false), sql`to_char(${eodReports.reportDate}, 'YYYY-MM-DD') = ${todayDate}`];
    if (branchId) eodCond.push(eq(eodReports.branchId, branchId));
    const eodResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` }).from(eodReports).where(and(...eodCond));
    const omzetHariIni = Number(eodResult[0]?.total || 0);

    // Karyawan
    let userCond = [eq(users.isDeleted, false)];
    if (branchId) userCond.push(eq(users.branchId, branchId));
    const totalKaryawanResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(and(...userCond));
    const totalKaryawanCabang = Number(totalKaryawanResult[0]?.count || 0);

    // Kehadiran
    let hadirCond = [eq(attendance.isDeleted, false), sql`to_char(${attendance.attendanceDate}, 'YYYY-MM-DD') = ${todayDate}`];
    if (branchId) hadirCond.push(eq(users.branchId, branchId));
    const hadirResult = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .leftJoin(users, eq(attendance.userId, users.id))
      .where(and(...hadirCond));
    const karyawanHadir = Number(hadirResult[0]?.count || 0);

    // PO Menunggu
    let poCond = [eq(orders.status, 'PENDING')];
    if (branchId) poCond.push(eq(orders.branchId, branchId));
    const poResult = await db.select({ count: sql<number>`count(*)` }).from(orders).where(and(...poCond));
    const poMenunggu = Number(poResult[0]?.count || 0);

    res.json({
      omzetHariIni,
      targetBulanan: 100000000, // Dummy
      pencapaianOmzet: (omzetHariIni / 100000000) * 100,
      transaksiHariIni: 0,
      stokKritis: 0,
      karyawanHadir,
      totalKaryawanCabang,
      peringatanKeterlambatan: 0,
      poMenunggu,
      pettyCashSisa: 5000000, // Dummy
      salesTrend: [],
      hourlyTraffic: [],
      topPerformers: [],
      lowStockItems: [],
      attendanceList: [],
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
router.post("/orders", async (req, res) => {
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

router.post("/eod-reports", async (req, res) => {
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

router.post("/petty-cash", async (req, res) => {
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
