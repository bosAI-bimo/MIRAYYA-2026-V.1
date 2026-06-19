import { Router } from "express";
import { db } from "../db";
import { eodReports, pettyCashTransactions, branches, budgets, revenueTargets, bankReconciliations, users } from "../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("accounting", "owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    // 1. EOD Pending
    const pendingEodResult = await db.select({ count: sql<number>`count(*)` })
      .from(eodReports)
      .where(eq(eodReports.status, "PENDING"));
    const pendingEod = pendingEodResult[0]?.count || 0;

    // 2. Laba Bersih, Omzet, dll (Simplified for now)
    const omzetResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` })
      .from(eodReports)
      .where(eq(eodReports.status, "APPROVED"));
    const totalOmzet = omzetResult[0]?.total || 0;

    // Fetch full pending EOD details with branch name
    const pendingEodListRaw = await db.select({
      id: eodReports.id,
      date: eodReports.reportDate,
      totalOmzet: eodReports.totalOmzet,
      cashAmount: eodReports.cashAmount,
      edcAmount: eodReports.edcAmount,
      qrisAmount: eodReports.qrisAmount,
      pettyCashUsed: eodReports.pettyCashUsed,
      status: eodReports.status,
      branchName: branches.name,
    })
    .from(eodReports)
    .leftJoin(branches, eq(eodReports.branchId, branches.id))
    .where(and(eq(eodReports.status, "PENDING"), eq(eodReports.isDeleted, false)))
    .orderBy(sql`${eodReports.reportDate} DESC`);

    const pendingEodList = pendingEodListRaw.map(eod => ({
      id: eod.id,
      branch: eod.branchName || "Unknown Branch",
      date: new Date(eod.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      omzet: `Rp ${Number(eod.totalOmzet).toLocaleString('id-ID')}`,
      cash: `Rp ${Number(eod.cashAmount).toLocaleString('id-ID')}`,
      edc: `Rp ${Number(eod.edcAmount).toLocaleString('id-ID')}`,
      qris: `Rp ${Number(eod.qrisAmount).toLocaleString('id-ID')}`,
      pettyCash: `Rp ${Number(eod.pettyCashUsed).toLocaleString('id-ID')}`,
      status: eod.status
    }));

    // For completed ones
    const completedEodListRaw = await db.select({
      id: eodReports.id,
      date: eodReports.reportDate,
      totalOmzet: eodReports.totalOmzet,
      status: eodReports.status,
      branchName: branches.name,
    })
    .from(eodReports)
    .leftJoin(branches, eq(eodReports.branchId, branches.id))
    .where(and(sql`${eodReports.status} != 'PENDING'`, eq(eodReports.isDeleted, false)))
    .orderBy(sql`${eodReports.reportDate} DESC`);
    
    const completedEodList = completedEodListRaw.map(eod => ({
      id: eod.id,
      branch: eod.branchName || "Unknown Branch",
      date: new Date(eod.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      omzet: `Rp ${Number(eod.totalOmzet).toLocaleString('id-ID')}`,
      status: eod.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'
    }));

    // Fetch Petty Cash List
    const pettyCashListRaw = await db.select({
      id: pettyCashTransactions.id,
      desc: pettyCashTransactions.description,
      amount: pettyCashTransactions.amount,
      date: pettyCashTransactions.transactionDate,
      branchName: branches.name,
      userName: users.name
    })
    .from(pettyCashTransactions)
    .leftJoin(branches, eq(pettyCashTransactions.branchId, branches.id))
    .leftJoin(users, eq(pettyCashTransactions.recordedBy, users.id))
    .where(eq(pettyCashTransactions.isDeleted, false))
    .orderBy(sql`${pettyCashTransactions.transactionDate} DESC`)
    .limit(10);

    const pettyCashList = pettyCashListRaw.map(pc => ({
      id: pc.id,
      desc: pc.desc,
      branch: pc.branchName || "Unknown Branch",
      by: pc.userName || "System",
      date: new Date(pc.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: `Rp ${Number(pc.amount).toLocaleString('id-ID')}`
    }));

    res.json({
      labaBersih: totalOmzet * 0.3, // Example logic
      totalOmzet: totalOmzet,
      arusKasNet: totalOmzet * 0.2, // Example logic
      targetOmzetPercentage: 82,
      pendingEod,
      pendingEodList,
      completedEodList,
      pettyCashList,
      pendingPo: 3 // Example, since PO table might not be fully linked in schema
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- BUDGETS CRUD ---

router.get("/budgets", async (req, res) => {
  try {
    const allBudgets = await db.select().from(budgets);
    res.json(allBudgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/budgets", async (req, res) => {
  try {
    const { branchId, month, amount, approvedBy } = req.body;
    const newBudget = await db.insert(budgets)
      .values({ branchId, month, amount, approvedBy })
      .returning();
    res.status(201).json(newBudget[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/budgets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, amount, approvedBy } = req.body;
    const updatedBudget = await db.update(budgets)
      .set({ month, amount, approvedBy })
      .where(eq(budgets.id, id as any))
      .returning();
    if (updatedBudget.length === 0) return res.status(404).json({ message: "Budget not found" });
    res.json(updatedBudget[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/budgets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await db.delete(budgets)
      .where(eq(budgets.id, id as any))
      .returning();
    if (deletedBudget.length === 0) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- REVENUE TARGETS CRUD ---

router.get("/revenue-targets", async (req, res) => {
  try {
    const allTargets = await db.select().from(revenueTargets);
    res.json(allTargets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/revenue-targets", async (req, res) => {
  try {
    const { branchId, month, targetRevenue, avgPeriodStart, avgPeriodEnd } = req.body;
    const newTarget = await db.insert(revenueTargets)
      .values({ branchId, month, targetRevenue, avgPeriodStart, avgPeriodEnd })
      .returning();
    res.status(201).json(newTarget[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/revenue-targets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, targetRevenue, avgPeriodStart, avgPeriodEnd } = req.body;
    const updatedTarget = await db.update(revenueTargets)
      .set({ month, targetRevenue, avgPeriodStart, avgPeriodEnd })
      .where(eq(revenueTargets.id, id as any))
      .returning();
    if (updatedTarget.length === 0) return res.status(404).json({ message: "Revenue Target not found" });
    res.json(updatedTarget[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/revenue-targets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTarget = await db.delete(revenueTargets)
      .where(eq(revenueTargets.id, id as any))
      .returning();
    if (deletedTarget.length === 0) return res.status(404).json({ message: "Revenue Target not found" });
    res.json({ message: "Revenue Target deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- BANK RECONCILIATIONS CRUD ---

router.get("/bank-reconciliations", async (req, res) => {
  try {
    const allReconciliations = await db.select().from(bankReconciliations);
    res.json(allReconciliations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/bank-reconciliations", async (req, res) => {
  try {
    const { bankAccount, reconcileDate, bankStatementBalance, posSalesBalance, difference, notes } = req.body;
    let branchId = req.body.branchId || (req as any).user?.branchId;
    
    if (!branchId) {
      const firstBranch = await db.select().from(branches).limit(1);
      if (firstBranch.length > 0) branchId = firstBranch[0].id;
    }

    const newRecon = await db.insert(bankReconciliations)
      .values({ branchId, bankAccount, reconcileDate, bankStatementBalance, posSalesBalance, difference, notes })
      .returning();
    res.status(201).json(newRecon[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/bank-reconciliations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { bankAccount, reconcileDate, bankStatementBalance, posSalesBalance, difference, notes } = req.body;
    const updatedRecon = await db.update(bankReconciliations)
      .set({ bankAccount, reconcileDate, bankStatementBalance, posSalesBalance, difference, notes })
      .where(eq(bankReconciliations.id, id as any))
      .returning();
    if (updatedRecon.length === 0) return res.status(404).json({ message: "Bank Reconciliation not found" });
    res.json(updatedRecon[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/bank-reconciliations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecon = await db.delete(bankReconciliations)
      .where(eq(bankReconciliations.id, id as any))
      .returning();
    if (deletedRecon.length === 0) return res.status(404).json({ message: "Bank Reconciliation not found" });
    res.json({ message: "Bank Reconciliation deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EOD REPORTS (For Approval) ---

router.get("/eod-reports", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const branchId = req.query.branchId as string;
    const status = req.query.status as string; // 'pending' or 'completed'
    
    const offset = (page - 1) * limit;
    
    let conditions = [eq(eodReports.isDeleted, false)];
    if (branchId && branchId !== 'all') {
       conditions.push(eq(eodReports.branchId, branchId));
    }
    if (status === 'pending') {
       conditions.push(eq(eodReports.status, 'PENDING'));
    } else if (status === 'completed') {
       // Assuming completed means anything not PENDING
       conditions.push(sql`${eodReports.status} != 'PENDING'`);
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Count total rows
    const totalQuery = await db.select({ count: sql<number>`count(*)` })
      .from(eodReports)
      .where(whereClause);
      
    const total = Number(totalQuery[0]?.count) || 0;

    const reports = await db.select({
      id: eodReports.id,
      reportDate: eodReports.reportDate,
      totalOmzet: eodReports.totalOmzet,
      cashAmount: eodReports.cashAmount,
      edcAmount: eodReports.edcAmount,
      qrisAmount: eodReports.qrisAmount,
      pettyCashUsed: eodReports.pettyCashUsed,
      status: eodReports.status,
      branchId: eodReports.branchId,
      branchName: branches.name,
    })
    .from(eodReports)
    .leftJoin(branches, eq(eodReports.branchId, branches.id))
    .where(whereClause)
    .orderBy(sql`${eodReports.reportDate} DESC`)
    .limit(limit)
    .offset(offset);
    
    res.json({
      data: reports,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/eod-reports/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED
    const updated = await db.update(eodReports)
      .set({ status })
      .where(eq(eodReports.id, id as any))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACCOUNTING REPORTS ---

router.get("/profit-loss", async (req, res) => {
  try {
    const { month, branchId } = req.query;
    // Dummy logic for now
    res.json({
      month,
      branchId,
      revenue: 50000000,
      cogs: 20000000,
      grossProfit: 30000000,
      operatingExpenses: 10000000,
      netProfit: 20000000
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/cash-flow", async (req, res) => {
  try {
    const { month, branchId } = req.query;
    // Dummy logic for now
    res.json({
      month,
      branchId,
      operatingActivities: 15000000,
      investingActivities: -5000000,
      financingActivities: 0,
      netCashFlow: 10000000,
      endingBalance: 45000000
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- JOURNAL ENTRIES ---

import { journalEntries } from "../db/schema";

router.get("/journal-entries", async (req, res) => {
  try {
    const entries = await db.select().from(journalEntries).where(eq(journalEntries.isDeleted, false));
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/journal-entries", async (req, res) => {
  try {
    const { entryDate, description, debitAccount, creditAccount, amount } = req.body;
    let branchId = req.body.branchId || (req as any).user?.branchId;
    const createdBy = (req as any).user?.id;

    if (!branchId) {
      const firstBranch = await db.select().from(branches).limit(1);
      if (firstBranch.length > 0) branchId = firstBranch[0].id;
    }

    const newEntry = await db.insert(journalEntries)
      .values({ entryDate, description, debitAccount, creditAccount, amount, branchId, createdBy })
      .returning();
    res.status(201).json(newEntry[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
