import { Router } from "express";
import { db } from "../db";
import { users, attendance, branches, roles, payroll } from "../db/schema";
import { eq, sql, desc, and, gte, lte, ilike } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("hr", "admin", "owner"));

router.get("/dashboard-stats", async (req, res) => {
  try {
    // 1. Total Karyawan
    const totalEmployeesResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isDeleted, false));
    const totalEmployees = totalEmployeesResult[0]?.count || 0;

    // 2. Hadir Hari Ini (assuming today is 2026-06-16 based on metadata or just using current date)
    const today = new Date().toISOString().split('T')[0];
    const presentTodayResult = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(and(eq(attendance.attendanceDate, today), eq(attendance.isDeleted, false)));
    const presentToday = presentTodayResult[0]?.count || 0;

    // 3. Absen / Cuti
    const absent = totalEmployees - presentToday;

    // 4. Check-in Terbaru
    const recentCheckins = await db.select({
      id: attendance.id,
      name: users.name,
      timeIn: attendance.timeIn,
      status: sql<string>`CASE WHEN ${attendance.timeIn} > '09:00:00' THEN 'Terlambat' ELSE 'Tepat Waktu' END`,
      branchName: branches.name,
      roleName: roles.name
    })
    .from(attendance)
    .innerJoin(users, eq(attendance.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(and(eq(attendance.attendanceDate, today), eq(attendance.isDeleted, false)))
    .orderBy(desc(attendance.timeIn))
    .limit(5);

    res.json({
      totalEmployees,
      presentToday,
      absent,
      recentCheckins: recentCheckins.map(c => ({
        name: c.name,
        role: c.roleName || "Staff",
        branch: c.branchName || "Pusat",
        time: c.timeIn ? c.timeIn.substring(0, 5) + " WIB" : "-",
        status: c.status
      }))
    });
  } catch (error) {
    console.error("Error fetching HR stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const branchId = req.query.branchId as string;
    
    const offset = (page - 1) * limit;
    
    let conditions = [eq(users.isDeleted, false)];
    if (search) {
       conditions.push(ilike(users.name, `%${search}%`));
    }
    if (branchId && branchId !== 'all') {
       conditions.push(eq(users.branchId, branchId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Count total rows
    const totalQuery = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);
      
    const total = Number(totalQuery[0]?.count) || 0;

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      branch: branches.name,
      phone: users.phone,
      roleId: users.roleId,
      branchId: users.branchId,
      status: sql<string>`'Aktif'` // Default status as placeholder
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .where(whereClause)
    .limit(limit)
    .offset(offset);
    
    res.json({
      data: allUsers,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employee-dashboard", async (req, res) => {
  try {
    res.json({
      totalKehadiran: 0,
      tepatWaktu: 0,
      terlambat: 0,
      absen: 0,
      riwayatAbsensi: []
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/attendance-log", async (req, res) => {
  try {
    const logs = await db.select({
      id: attendance.id,
      date: attendance.attendanceDate,
      name: users.name,
      branch: branches.name,
      timeIn: attendance.timeIn,
      timeOut: attendance.timeOut,
      status: sql<string>`CASE 
        WHEN ${attendance.timeIn} IS NULL THEN 'Cuti'
        WHEN ${attendance.timeIn} > '09:00:00' THEN 'Terlambat' 
        ELSE 'Hadir' END`,
      photoStatus: sql<string>`CASE WHEN ${attendance.selfieUrl} IS NOT NULL THEN 'Valid' ELSE 'Invalid' END`,
      gpsStatus: sql<string>`CASE WHEN ${attendance.locationGps} IS NOT NULL THEN 'Valid' ELSE 'Invalid' END`
    })
    .from(attendance)
    .innerJoin(users, eq(attendance.userId, users.id))
    .leftJoin(branches, eq(users.branchId, branches.id))
    .where(eq(attendance.isDeleted, false))
    .orderBy(desc(attendance.attendanceDate), desc(attendance.timeIn));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- ATTENDANCE CRUD ---

router.get("/attendance", async (req, res) => {
  try {
    const allAttendance = await db.select().from(attendance).where(eq(attendance.isDeleted, false));
    res.json(allAttendance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/attendance", async (req, res) => {
  try {
    const { attendanceDate, timeIn, timeOut, selfieUrl, locationGps } = req.body;
    const userId = req.body.userId || (req as any).user?.id;
    const newAttendance = await db.insert(attendance)
      .values({ userId, attendanceDate, timeIn, timeOut, selfieUrl, locationGps })
      .returning();
    res.status(201).json(newAttendance[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { timeIn, timeOut, selfieUrl, locationGps } = req.body;
    const updatedAttendance = await db.update(attendance)
      .set({ timeIn, timeOut, selfieUrl, locationGps })
      .where(eq(attendance.id, id as any)) // UUID
      .returning();
    if (updatedAttendance.length === 0) return res.status(404).json({ message: "Attendance not found" });
    res.json(updatedAttendance[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || "system";
    const deletedAttendance = await db.update(attendance)
      .set({ isDeleted: true, updatedBy: userId })
      .where(eq(attendance.id, id as any))
      .returning();
    if (deletedAttendance.length === 0) return res.status(404).json({ message: "Attendance not found" });
    res.json({ message: "Attendance deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PAYROLL CRUD ---

router.get("/payroll", async (req, res) => {
  try {
    const allPayroll = await db.select().from(payroll).where(eq(payroll.isDeleted, false));
    res.json(allPayroll);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/payroll", async (req, res) => {
  try {
    const { userId, period, baseSalary, allowances, deductions, netSalary, slipPdfUrl } = req.body;
    const newPayroll = await db.insert(payroll)
      .values({ userId, period, baseSalary, allowances, deductions, netSalary, slipPdfUrl })
      .returning();
    res.status(201).json(newPayroll[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/payroll/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { period, baseSalary, allowances, deductions, netSalary, slipPdfUrl } = req.body;
    const updatedPayroll = await db.update(payroll)
      .set({ period, baseSalary, allowances, deductions, netSalary, slipPdfUrl })
      .where(eq(payroll.id, id as any))
      .returning();
    if (updatedPayroll.length === 0) return res.status(404).json({ message: "Payroll not found" });
    res.json(updatedPayroll[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/payroll/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || "system";
    const deletedPayroll = await db.update(payroll)
      .set({ isDeleted: true, updatedBy: userId })
      .where(eq(payroll.id, id as any))
      .returning();
    if (deletedPayroll.length === 0) return res.status(404).json({ message: "Payroll not found" });
    res.json({ message: "Payroll deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
