import { Router } from "express";
import { db } from "../db";
import { eodReports, pettyCashTransactions, branches, budgets, revenueTargets, bankReconciliations, users, journalEntries } from "../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { accountingSchema } from "../validators/schema";

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

    // Pending PO count (real)
    const pendingPoResult = await db.select({ count: sql<number>`count(*)` })
      .from(require("../db/schema").orders)
      .where(eq(require("../db/schema").orders.status, "PENDING"));
    const pendingPoCount = Number(pendingPoResult[0]?.count || 0);

    // Monthly operating expenses
    const opexResult = await db.select({ total: sql<number>`COALESCE(sum(${pettyCashTransactions.amount}), 0)` })
      .from(pettyCashTransactions)
      .where(and(
        eq(pettyCashTransactions.isDeleted, false),
        sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${new Date().toISOString().substring(0, 7)}`
      ));
    const opex = Number(opexResult[0]?.total || 0);
    const estimatedCOGS = totalOmzet * 0.4;
    const labaBersih = totalOmzet - estimatedCOGS - opex;
    const arusKasNet = totalOmzet - opex - estimatedCOGS;

    // Target achievement from revenue_targets
    const currentMonth = new Date().toISOString().substring(0, 7);
    const targetResult = await db.select({ total: sql<number>`COALESCE(sum(${revenueTargets.targetRevenue}), 0)` })
      .from(revenueTargets)
      .where(and(eq(revenueTargets.isDeleted, false), eq(revenueTargets.month, currentMonth)));
    const totalTarget = Number(targetResult[0]?.total || 0) || 100000000;
    const targetOmzetPercentage = Math.min(Math.round((totalOmzet / totalTarget) * 100), 100);

    res.json({
      labaBersih,
      totalOmzet: totalOmzet,
      arusKasNet,
      targetOmzetPercentage,
      pendingEod,
      pendingEodList,
      completedEodList,
      pettyCashList,
      pendingPo: pendingPoCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- BUDGETS CRUD ---

router.get("/budgets", async (req, res) => {
  try {
    const allBudgets = await db.select().from(budgets).where(eq(budgets.isDeleted, false));
    res.json(allBudgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/budgets", validateRequest(accountingSchema.createBudget), async (req, res) => {
  try {
    const { branchId, month, pettyCashBudget, shoppingBudget, targetAchievement, approvedBy } = req.body;
    const newBudget = await db.insert(budgets)
      .values({ branchId, month, pettyCashBudget, shoppingBudget, targetAchievement, approvedBy })
      .returning();
    res.status(201).json(newBudget[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/budgets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, pettyCashBudget, shoppingBudget, targetAchievement, approvedBy } = req.body;
    const updatedBudget = await db.update(budgets)
      .set({ month, pettyCashBudget, shoppingBudget, targetAchievement, approvedBy })
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
    const deletedBudget = await db.update(budgets)
      .set({ isDeleted: true, updatedBy: (req as any).user?.id })
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
    const allTargets = await db.select().from(revenueTargets).where(eq(revenueTargets.isDeleted, false));
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
    const deletedTarget = await db.update(revenueTargets)
      .set({ isDeleted: true, updatedBy: (req as any).user?.id })
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
    const allReconciliations = await db.select().from(bankReconciliations).where(eq(bankReconciliations.isDeleted, false));
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
    const deletedRecon = await db.update(bankReconciliations)
      .set({ isDeleted: true, updatedBy: (req as any).user?.id })
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

router.put("/eod-reports/:id/approve", validateRequest(accountingSchema.actionEod), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED
    
    const result = await db.transaction(async (tx) => {
      const updated = await tx.update(eodReports)
        .set({ status, approvedBy: (req as any).user?.id })
        .where(eq(eodReports.id, id as any))
        .returning();
        
      const eod = updated[0];
      if (!eod) throw new Error("EOD Report not found");

      if (status === "APPROVED") {
        await tx.insert(journalEntries).values({
          entryDate: eod.reportDate,
          description: `Penerimaan Kas Laporan EOD - ${eod.reportDate}`,
          debitAccount: "Kas & Bank",
          creditAccount: "Pendapatan Penjualan",
          amount: eod.totalOmzet.toString(),
          branchId: eod.branchId,
          createdBy: (req as any).user?.id || "system",
        });
      }
      return eod;
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACCOUNTING REPORTS ---

router.get("/profit-loss", async (req, res) => {
  try {
    const { month, branchId } = req.query;
    if (!month) return res.status(400).json({ error: "Month is required (YYYY-MM)" });

    let eodCond = [eq(eodReports.status, "APPROVED"), eq(eodReports.isDeleted, false), sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${month}`];
    let pettyCond = [eq(pettyCashTransactions.isDeleted, false), sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${month}`];
    
    if (branchId && branchId !== 'all') {
      eodCond.push(eq(eodReports.branchId, branchId as string));
      pettyCond.push(eq(pettyCashTransactions.branchId, branchId as string));
    }

    const revenueResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` }).from(eodReports).where(and(...eodCond));
    const revenue = Number(revenueResult[0]?.total || 0);

    const expenseResult = await db.select({ total: sql<number>`sum(${pettyCashTransactions.amount})` }).from(pettyCashTransactions).where(and(...pettyCond));
    const operatingExpenses = Number(expenseResult[0]?.total || 0);

    // Simplification for Phase 1: COGS is 40% of revenue (can be refined later)
    const cogs = revenue * 0.4;
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    res.json({
      month,
      branchId,
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/export/profit-loss", async (req, res) => {
  try {
    const { month, branchId } = req.query;
    if (!month) return res.status(400).json({ error: "Month is required (YYYY-MM)" });

    let eodCond = [eq(eodReports.status, "APPROVED"), eq(eodReports.isDeleted, false), sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${month}`];
    let pettyCond = [eq(pettyCashTransactions.isDeleted, false), sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${month}`];
    
    if (branchId && branchId !== 'all') {
      eodCond.push(eq(eodReports.branchId, branchId as string));
      pettyCond.push(eq(pettyCashTransactions.branchId, branchId as string));
    }

    const revenueResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` }).from(eodReports).where(and(...eodCond));
    const revenue = Number(revenueResult[0]?.total || 0);

    const expenseResult = await db.select({ total: sql<number>`sum(${pettyCashTransactions.amount})` }).from(pettyCashTransactions).where(and(...pettyCond));
    const operatingExpenses = Number(expenseResult[0]?.total || 0);

    const cogs = revenue * 0.4;
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    // Create CSV content
    const csvLines = [
      "Kategori,Jumlah",
      `Pendapatan Kotor,${revenue}`,
      `Total HPP,${cogs}`,
      `Laba Kotor,${grossProfit}`,
      `Beban Operasional,${operatingExpenses}`,
      `Laba Bersih,${netProfit}`,
    ];
    
    const csvContent = csvLines.join("\n");

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="laporan-laba-rugi-${month}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/cash-flow", async (req, res) => {
  try {
    const { month, branchId } = req.query;
    if (!month) return res.status(400).json({ error: "Month is required (YYYY-MM)" });

    let eodCond = [eq(eodReports.status, "APPROVED"), eq(eodReports.isDeleted, false), sql`to_char(${eodReports.reportDate}, 'YYYY-MM') = ${month}`];
    let pettyCond = [eq(pettyCashTransactions.isDeleted, false), sql`to_char(${pettyCashTransactions.transactionDate}, 'YYYY-MM') = ${month}`];
    
    if (branchId && branchId !== 'all') {
      eodCond.push(eq(eodReports.branchId, branchId as string));
      pettyCond.push(eq(pettyCashTransactions.branchId, branchId as string));
    }

    const revenueResult = await db.select({ total: sql<number>`sum(${eodReports.totalOmzet})` }).from(eodReports).where(and(...eodCond));
    const operatingIn = Number(revenueResult[0]?.total || 0);

    const expenseResult = await db.select({ total: sql<number>`sum(${pettyCashTransactions.amount})` }).from(pettyCashTransactions).where(and(...pettyCond));
    const operatingOut = Number(expenseResult[0]?.total || 0) + (operatingIn * 0.4);

    const operatingActivities = operatingIn - operatingOut;
    const investingActivities = 0; 
    const financingActivities = 0; 
    const netCashFlow = operatingActivities + investingActivities + financingActivities;

    res.json({
      month,
      branchId,
      operatingActivities,
      investingActivities,
      financingActivities,
      netCashFlow,
      endingBalance: netCashFlow 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- JOURNAL ENTRIES ---



router.get("/journal-entries", async (req, res) => {
  try {
    const entries = await db.select().from(journalEntries).where(eq(journalEntries.isDeleted, false));
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/journal-entries", validateRequest(accountingSchema.createJournal), async (req, res) => {
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

router.put("/journal-entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { entryDate, description, debitAccount, creditAccount, amount } = req.body;
    const updatedBy = (req as any).user?.id;
    const updatedEntry = await db.update(journalEntries)
      .set({ entryDate, description, debitAccount, creditAccount, amount, updatedBy })
      .where(eq(journalEntries.id, id as any))
      .returning();
    if (updatedEntry.length === 0) return res.status(404).json({ message: "Journal Entry not found" });
    res.json(updatedEntry[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/journal-entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await db.update(journalEntries)
      .set({ isDeleted: true, updatedBy: (req as any).user?.id })
      .where(eq(journalEntries.id, id as any))
      .returning();
    if (deletedEntry.length === 0) return res.status(404).json({ message: "Journal Entry not found" });
    res.json({ message: "Journal Entry deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
