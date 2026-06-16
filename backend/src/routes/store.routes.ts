import { Router } from "express";
import { db } from "../db";
import { eodReports, orders, orderItems, pettyCashTransactions, attendance, branches, users } from "../db/schema";
import { sql, eq } from "drizzle-orm";

const router = Router();

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
      { code: "SKN-001", name: "Mirayya Glow Serum", stock: 45, minStock: 20 },
      { code: "SKN-002", name: "Mirayya Hydrating Toner", stock: 12, minStock: 15 },
      { code: "MKP-001", name: "Matte Lip Cream - Rose", stock: 5, minStock: 15 },
      { code: "MKP-002", name: "Flawless Cushion 01", stock: 28, minStock: 10 },
      { code: "MKP-003", name: "Flawless Cushion 02", stock: 32, minStock: 10 },
      { code: "BDY-001", name: "Brightening Body Lotion", stock: 8, minStock: 10 },
      { code: "SKN-003", name: "Mirayya Acne Spot Treatment", stock: 60, minStock: 15 },
      { code: "MKP-004", name: "Lip Tint - Peach", stock: 15, minStock: 20 },
      { code: "MKP-005", name: "Lip Tint - Berry", stock: 0, minStock: 20 },
      { code: "BDY-002", name: "Exfoliating Body Scrub", stock: 40, minStock: 15 },
      { code: "SKN-004", name: "Sunscreen SPF 50", stock: 55, minStock: 30 },
      { code: "SKN-005", name: "Gentle Facial Wash", stock: 22, minStock: 25 },
      { code: "MKP-006", name: "Mascara Waterproof", stock: 10, minStock: 15 },
      { code: "MKP-007", name: "Eyebrow Pencil - Brown", stock: 75, minStock: 30 },
      { code: "BDY-003", name: "Moisturizing Shower Gel", stock: 18, minStock: 20 },
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
    const { branchId, createdBy, totalAmount, budgetId, items } = req.body;
    
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
    const allEod = await db.select().from(eodReports);
    res.json(allEod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/eod-reports", async (req, res) => {
  try {
    let { branchId, reportDate, totalOmzet, cashAmount, edcAmount, qrisAmount, pettyCashUsed, evidencePhotos, submittedBy } = req.body;
    
    // Auto-fix dummy IDs for testing
    const firstBranch = await db.select().from(branches).limit(1);
    if (firstBranch.length > 0) branchId = firstBranch[0].id;
    
    let firstUser = await db.select().from(users).limit(1);
    if (firstUser.length === 0) {
      const dummyUser = await db.insert(users).values({
        id: "dummy-user-id",
        name: "Dummy User",
        email: "dummy@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      submittedBy = dummyUser[0].id;
    } else {
      submittedBy = firstUser[0].id;
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
    const deletedEod = await db.delete(eodReports).where(eq(eodReports.id, id as any)).returning();
    if (deletedEod.length === 0) return res.status(404).json({ message: "EOD Report not found" });
    res.json({ message: "EOD Report deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PETTY CASH CRUD ---

router.get("/petty-cash", async (req, res) => {
  try {
    const allPettyCash = await db.select().from(pettyCashTransactions);
    res.json(allPettyCash);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/petty-cash", async (req, res) => {
  try {
    let { branchId, description, amount, receiptPhotoUrl, recordedBy } = req.body;

    // Auto-fix dummy IDs for testing
    const firstBranch = await db.select().from(branches).limit(1);
    if (firstBranch.length > 0) branchId = firstBranch[0].id;
    
    let firstUser = await db.select().from(users).limit(1);
    if (firstUser.length === 0) {
      const dummyUser = await db.insert(users).values({
        id: "dummy-user-id",
        name: "Dummy User",
        email: "dummy@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      recordedBy = dummyUser[0].id;
    } else {
      recordedBy = firstUser[0].id;
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
    const deletedPettyCash = await db.delete(pettyCashTransactions).where(eq(pettyCashTransactions.id, id as any)).returning();
    if (deletedPettyCash.length === 0) return res.status(404).json({ message: "Petty Cash not found" });
    res.json({ message: "Petty Cash deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
