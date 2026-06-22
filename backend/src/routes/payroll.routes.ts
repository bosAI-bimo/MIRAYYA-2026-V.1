import { Router } from "express";
import { db } from "../db";
import { payroll, users, attendance, roles, branches } from "../db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { payrollSchema } from "../validators/schema";
import { generatePayslipPdf } from "../lib/pdf-generator";

const router = Router();

router.use(requireAuth);
router.use(requireRole("hr", "owner"));

/**
 * POST /api/payroll/calculate
 * Calculate payroll for all employees in a given period.
 * Body: { period: "2026-06", branchId?: string, baseSalaryDefault?: number }
 */
router.post("/calculate", validateRequest(payrollSchema.calculate), async (req, res) => {
  try {
    const { period, branchId, baseSalaryDefault = 3000000 } = req.body;
    if (!period) return res.status(400).json({ error: "Period wajib diisi (YYYY-MM)" });

    // Get all active employees
    let userConditions = [eq(users.isDeleted, false)];
    if (branchId && branchId !== "all") {
      userConditions.push(eq(users.branchId, branchId));
    }

    const employeeList = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      branchId: users.branchId,
      branchName: branches.name,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(and(...userConditions));

    const results = [];
    const workingDays = 22; // Standard working days per month

    for (const emp of employeeList) {
      // Count attendance days for this period
      const attendanceResult = await db.select({
        totalDays: sql<number>`count(*)`,
        lateDays: sql<number>`sum(CASE WHEN ${attendance.timeIn} > '09:00:00' THEN 1 ELSE 0 END)`,
      })
      .from(attendance)
      .where(and(
        eq(attendance.userId, emp.id),
        eq(attendance.isDeleted, false),
        sql`to_char(${attendance.attendanceDate}, 'YYYY-MM') = ${period}`
      ));

      const totalDays = Number(attendanceResult[0]?.totalDays || 0);
      const lateDays = Number(attendanceResult[0]?.lateDays || 0);
      const absentDays = workingDays - totalDays;

      // Calculate salary components
      const baseSalary = baseSalaryDefault;
      
      // Allowances: transport (500k) + meal (300k) - proportional to attendance
      const transportAllowance = Math.round((500000 / workingDays) * totalDays);
      const mealAllowance = Math.round((300000 / workingDays) * totalDays);
      const totalAllowances = transportAllowance + mealAllowance;

      // Deductions: late penalty (25k per late day) + absent penalty (proportional salary)
      const latePenalty = lateDays * 25000;
      const absentPenalty = Math.round((baseSalary / workingDays) * absentDays);
      const totalDeductions = latePenalty + absentPenalty;

      const netSalary = baseSalary + totalAllowances - totalDeductions;

      // Check if payroll already exists for this period + user
      const existingPayroll = await db.select().from(payroll)
        .where(and(eq(payroll.userId, emp.id), eq(payroll.period, `${period}-01`), eq(payroll.isDeleted, false)))
        .limit(1);

      let payrollRecord;
      if (existingPayroll.length > 0) {
        // Update existing
        const updated = await db.update(payroll)
          .set({
            baseSalary: baseSalary.toString(),
            allowances: totalAllowances.toString(),
            deductions: totalDeductions.toString(),
            netSalary: netSalary.toString(),
            updatedBy: (req as any).user?.id,
          })
          .where(eq(payroll.id, existingPayroll[0].id))
          .returning();
        payrollRecord = updated[0];
      } else {
        // Insert new
        const inserted = await db.insert(payroll)
          .values({
            userId: emp.id,
            period: `${period}-01`,
            baseSalary: baseSalary.toString(),
            allowances: totalAllowances.toString(),
            deductions: totalDeductions.toString(),
            netSalary: netSalary.toString(),
          })
          .returning();
        payrollRecord = inserted[0];
      }

      results.push({
        payrollId: payrollRecord.id,
        employeeId: emp.id,
        employeeName: emp.name,
        branch: emp.branchName || "Pusat",
        role: emp.roleName || "Staff",
        totalDays,
        lateDays,
        absentDays,
        baseSalary,
        allowances: totalAllowances,
        deductions: totalDeductions,
        netSalary,
      });
    }

    res.json({
      message: `Payroll berhasil dihitung untuk ${results.length} karyawan`,
      period,
      data: results,
      summary: {
        totalEmployees: results.length,
        totalNetSalary: results.reduce((sum, r) => sum + r.netSalary, 0),
        totalAllowances: results.reduce((sum, r) => sum + r.allowances, 0),
        totalDeductions: results.reduce((sum, r) => sum + r.deductions, 0),
      }
    });
  } catch (error: any) {
    console.error("Payroll Calculation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payroll/list
 * Get payroll list for a period
 */
router.get("/list", async (req, res) => {
  try {
    const { period } = req.query;
    
    let conditions = [eq(payroll.isDeleted, false)];
    if (period) {
      conditions.push(eq(payroll.period, `${period}-01`));
    }

    const payrollList = await db.select({
      id: payroll.id,
      userId: payroll.userId,
      employeeName: users.name,
      employeeEmail: users.email,
      branchName: branches.name,
      roleName: roles.name,
      period: payroll.period,
      baseSalary: payroll.baseSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
      slipPdfUrl: payroll.slipPdfUrl,
    })
    .from(payroll)
    .innerJoin(users, eq(payroll.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(and(...conditions))
    .orderBy(desc(payroll.period));

    res.json(payrollList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payroll/slip/:id/pdf
 * Generate and download payslip PDF
 */
router.get("/slip/:id/pdf", async (req, res) => {
  try {
    const { id } = req.params;

    const payrollData = await db.select({
      id: payroll.id,
      employeeName: users.name,
      employeeEmail: users.email,
      branchName: branches.name,
      roleName: roles.name,
      period: payroll.period,
      baseSalary: payroll.baseSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
    })
    .from(payroll)
    .innerJoin(users, eq(payroll.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(payroll.id, id as any))
    .limit(1);

    if (payrollData.length === 0) {
      return res.status(404).json({ error: "Payroll record not found" });
    }

    const data = payrollData[0];
    const pdfBuffer = await generatePayslipPdf({
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      branch: data.branchName || "Pusat",
      role: data.roleName || "Staff",
      period: data.period,
      baseSalary: Number(data.baseSalary),
      allowances: Number(data.allowances),
      deductions: Number(data.deductions),
      netSalary: Number(data.netSalary),
    });

    const periodStr = data.period.toString().substring(0, 7);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="slip-gaji-${data.employeeName.replace(/\s+/g, '-')}-${periodStr}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payroll/export-csv
 * Export payroll data as CSV
 */
router.get("/export-csv", async (req, res) => {
  try {
    const { period } = req.query;
    
    let conditions = [eq(payroll.isDeleted, false)];
    if (period) {
      conditions.push(eq(payroll.period, `${period}-01`));
    }

    const payrollList = await db.select({
      employeeName: users.name,
      employeeEmail: users.email,
      branchName: branches.name,
      roleName: roles.name,
      period: payroll.period,
      baseSalary: payroll.baseSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
    })
    .from(payroll)
    .innerJoin(users, eq(payroll.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(and(...conditions));

    const csvLines = [
      "Nama,Email,Cabang,Jabatan,Periode,Gaji Pokok,Tunjangan,Potongan,Gaji Bersih",
      ...payrollList.map(p =>
        `"${p.employeeName}","${p.employeeEmail}","${p.branchName || 'Pusat'}","${p.roleName || 'Staff'}","${p.period}",${p.baseSalary},${p.allowances},${p.deductions},${p.netSalary}`
      )
    ];

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="payroll-${period || 'all'}.csv"`);
    res.send("\uFEFF" + csvLines.join("\n")); // BOM for Excel UTF-8
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
