import { Router } from "express";
import { auth } from "../auth";
import { validateRequest } from "../middlewares/validateRequest";
import { authSchema } from "../validators/schema";
import { db } from "../db";
import { roles, branches, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Endpoint Registrasi Custom
router.post("/register", validateRequest(authSchema.register), async (req, res) => {
  try {
    const { email, password, fullName, roleId, branchId, phone, employeeId } = req.body;

    if (!email || !password || !fullName || !roleId) {
      return res.status(400).json({ message: "Email, password, fullName, dan roleId wajib diisi." });
    }

    const roleExists = await db.select().from(roles).where(eq(roles.id, roleId));
    if (roleExists.length === 0) {
      return res.status(400).json({ message: "Role ID tidak valid." });
    }

    if (branchId) {
      const branchExists = await db.select().from(branches).where(eq(branches.id, branchId));
      if (branchExists.length === 0) {
        return res.status(400).json({ message: "Branch ID tidak valid." });
      }
    }

    const userExists = await db.select().from(users).where(eq(users.email, email));
    if (userExists.length > 0) {
      if (userExists[0].isDeleted) {
        // Reactivate user
        await db.update(users)
          .set({ 
            isDeleted: false,
            name: fullName,
            roleId,
            branchId: branchId || null,
            phone,
            employeeId: employeeId || null
          })
          .where(eq(users.id, userExists[0].id));

        return res.status(200).json({
          message: "Akun yang sebelumnya nonaktif berhasil diaktifkan kembali. Menggunakan password lama.",
          user: {
            id: userExists[0].id,
            email: userExists[0].email,
            fullName,
            roleId,
            branchId
          }
        });
      }

      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      }
    });

    if (!newUser || !newUser.user) {
      return res.status(500).json({ message: "Gagal membuat user di auth provider." });
    }

    await db.update(users)
      .set({ 
        roleId, 
        branchId: branchId || null, 
        phone,
        employeeId: employeeId || null
      })
      .where(eq(users.id, newUser.user.id));

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        fullName,
        roleId,
        branchId
      }
    });

  } catch (error: any) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: error.message });
  }
});

// Endpoint Login Custom
router.post("/login", validateRequest(authSchema.login), async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    
    // Support legacy 'email' field or new 'identifier' field
    const loginIdentifier = identifier || email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Email/ID Karyawan dan password wajib diisi." });
    }
    
    console.log("Login attempt for:", loginIdentifier, "Password length:", password?.length);

    let targetEmail = loginIdentifier;
    if (!loginIdentifier.includes('@')) {
      const userRecord = await db.select().from(users).where(eq(users.employeeId, loginIdentifier)).limit(1);
      if (userRecord.length === 0) {
        return res.status(401).json({ message: "Email atau ID Karyawan tidak terdaftar." });
      }
      targetEmail = userRecord[0].email;
    }

    const result = await auth.api.signInEmail({
      body: { email: targetEmail, password },
      asResponse: false,
    });

    if (!result || !result.token) {
      return res.status(401).json({ message: "Email/ID Karyawan atau password salah." });
    }

    // Set cookie manual untuk express karena kita memanggil API programmatic
    res.cookie("better-auth.session_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Ambil info lengkap user dari database
    const userInfo = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      branchId: users.branchId
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, result.user.id))
    .limit(1);

    return res.status(200).json({ 
      message: "Login berhasil",
      user: userInfo[0] || result.user,
      token: result.token
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(401).json({ message: "Email atau password salah." });
  }
});

// Endpoint Logout
router.post("/logout", async (req, res) => {
  res.clearCookie("better-auth.session_token", { path: "/" });
  return res.status(200).json({ message: "Logout berhasil" });
});

// Endpoint Cek Sesi (Me)
router.get("/me", async (req, res) => {
  try {
    // Check custom cookie or authorization header
    const token = req.cookies?.["better-auth.session_token"] || 
                  req.headers.authorization?.split(" ")[1];
                  
    if (!token) {
      // Try Better Auth standard check
      const session = await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      });
      if (!session) return res.status(401).json({ message: "Unauthorized" });
      
      const userInfo = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: roles.name,
        branchId: users.branchId
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, session.user.id))
      .limit(1);
      
      return res.json({ user: userInfo[0] || session.user });
    }

    // Jika ada token dari login manual
    const dbSession = await db.select().from(require("../db/schema").session).where(eq(require("../db/schema").session.token, token)).limit(1);
    
    if (dbSession.length === 0 || new Date() > new Date(dbSession[0].expiresAt)) {
      return res.status(401).json({ message: "Session expired" });
    }

    const userInfo = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      branchId: users.branchId
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, dbSession[0].userId))
    .limit(1);

    return res.json({ user: userInfo[0] });

  } catch (error) {
    console.error("Me Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Serahkan semua rute bawaan ke Better Auth Node Handler
router.use(toNodeHandler(auth));

export default router;
