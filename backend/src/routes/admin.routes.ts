import { Router } from "express";
import { db } from "../db";
import { branches, roles, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole("hr", "owner"));

// --- BRANCHES ---

import { sql } from "drizzle-orm";

router.get("/branches", async (req, res) => {
  try {
    const allBranches = await db.select({
      id: branches.id,
      name: branches.name,
      address: branches.address,
      phone: branches.phone,
      employees: sql<number>`count(${users.id})::int`,
      status: sql<string>`'Aktif'`
    })
    .from(branches)
    .leftJoin(users, eq(branches.id, users.branchId))
    .groupBy(branches.id);
    
    res.json(allBranches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/branches", async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const newBranch = await db.insert(branches).values({ name, address, phone }).returning();
    res.status(201).json(newBranch[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/branches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const updatedBranch = await db.update(branches)
      .set({ name, address, phone })
      .where(eq(branches.id, id))
      .returning();
    if (updatedBranch.length === 0) return res.status(404).json({ message: "Branch not found" });
    res.json(updatedBranch[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/branches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBranch = await db.delete(branches).where(eq(branches.id, id)).returning();
    if (deletedBranch.length === 0) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROLES ---

router.get("/roles", async (req, res) => {
  try {
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/roles", async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = await db.insert(roles).values({ name }).returning();
    res.status(201).json(newRole[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedRole = await db.update(roles)
      .set({ name })
      .where(eq(roles.id, id))
      .returning();
    if (updatedRole.length === 0) return res.status(404).json({ message: "Role not found" });
    res.json(updatedRole[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await db.delete(roles).where(eq(roles.id, id)).returning();
    if (deletedRole.length === 0) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- USERS ---

router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users).where(eq(users.isDeleted, false));
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleId, branchId, phone } = req.body;
    const updatedUser = await db.update(users)
      .set({ name, roleId, branchId, phone })
      .where(eq(users.id, id))
      .returning();
    if (updatedUser.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id || "system";
    const deletedUser = await db.update(users)
      .set({ isDeleted: true, updatedBy: currentUserId })
      .where(eq(users.id, id))
      .returning();
    if (deletedUser.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
