import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, orderItems, pettyCashTransactions, attendance, branches, users } from "../db/schema";
import { sql, eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("store_leader", "owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    // For now, return empty sets for lists to clear dummy data
    res.json({
      omzetHariIni: 0,
      targetBulanan: 1, // avoid div 0
      pencapaianOmzet: 0,
      transaksiHariIni: 0,
      stokKritis: 0,
      karyawanHadir: 0,
      totalKaryawanCabang: 0,
      peringatanKeterlambatan: 0,
      poMenunggu: 0,
      pettyCashSisa: 0,

      // Arrays replaced with empty arrays to strip UI dummy data
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

// --- INVENTORY MOCK (Until Phase 4 POS Integration) ---

router.get("/inventory", async (req, res) => {
  try {
    const inventoryData = [
      { code: "SKN-001", name: "Mirayya Glow Serum", category: "Skincare", hpp: 65000, sell: 120000, stock: 45, minStock: 20, movement: "slow" },
      { code: "SKN-002", name: "Mirayya Hydrating Toner", category: "Skincare", hpp: 45000, sell: 85000, stock: 12, minStock: 15, movement: "fast" },
      { code: "MKP-001", name: "Matte Lip Cream - Rose", category: "Makeup", hpp: 35000, sell: 75000, stock: 5, minStock: 15, movement: "fast" },
      { code: "MKP-002", name: "Flawless Cushion 01", category: "Makeup", hpp: 80000, sell: 150000, stock: 28, minStock: 10, movement: "slow" },
      { code: "MKP-003", name: "Flawless Cushion 02", category: "Makeup", hpp: 80000, sell: 150000, stock: 32, minStock: 10, movement: "slow" },
      { code: "BDY-001", name: "Brightening Body Lotion", category: "Bodycare", hpp: 50000, sell: 95000, stock: 8, minStock: 10, movement: "fast" },
      { code: "SKN-003", name: "Mirayya Acne Spot Treatment", category: "Skincare", hpp: 55000, sell: 105000, stock: 60, minStock: 15, movement: "slow" },
      { code: "MKP-004", name: "Lip Tint - Peach", category: "Makeup", hpp: 30000, sell: 65000, stock: 15, minStock: 20, movement: "fast" },
      { code: "MKP-005", name: "Lip Tint - Berry", category: "Makeup", hpp: 30000, sell: 65000, stock: 0, minStock: 20, movement: "fast" },
      { code: "BDY-002", name: "Exfoliating Body Scrub", category: "Bodycare", hpp: 60000, sell: 110000, stock: 40, minStock: 15, movement: "slow" },
      { code: "SKN-004", name: "Sunscreen SPF 50", category: "Skincare", hpp: 40000, sell: 80000, stock: 55, minStock: 30, movement: "slow" },
      { code: "SKN-005", name: "Gentle Facial Wash", category: "Skincare", hpp: 35000, sell: 70000, stock: 22, minStock: 25, movement: "fast" },
      { code: "MKP-006", name: "Mascara Waterproof", category: "Makeup", hpp: 45000, sell: 90000, stock: 10, minStock: 15, movement: "fast" },
      { code: "MKP-007", name: "Eyebrow Pencil - Brown", category: "Makeup", hpp: 25000, sell: 50000, stock: 75, minStock: 30, movement: "dead" },
      { code: "BDY-003", name: "Moisturizing Shower Gel", category: "Bodycare", hpp: 45000, sell: 85000, stock: 18, minStock: 20, movement: "fast" },
    ];
    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- ORDERS & ORDER ITEMS CRUD ---

router.get("/orders", async (req, res) => {
  try {
    const allOrders = await db.select().from(orders);
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
    const allEod = await db.select().from(eodReports).where(eq(eodReports.isDeleted, false));
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
    const allPettyCash = await db.select().from(pettyCashTransactions).where(eq(pettyCashTransactions.isDeleted, false));
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
