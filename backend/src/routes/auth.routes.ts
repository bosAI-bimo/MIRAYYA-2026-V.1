import { Router } from "express";
import { auth } from "../auth";
import { db } from "../db";
import { roles, branches, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Endpoint Registrasi Custom
// Frontend menembak ke POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, roleId, branchId, phone } = req.body;

    if (!email || !password || !fullName || !roleId) {
      return res.status(400).json({ message: "Email, password, fullName, dan roleId wajib diisi." });
    }

    // 1. Validasi Role
    const roleExists = await db.select().from(roles).where(eq(roles.id, roleId));
    if (roleExists.length === 0) {
      return res.status(400).json({ message: "Role ID tidak valid." });
    }

    // 2. Validasi Branch (jika diberikan, misalnya untuk Kepala Toko / BA)
    if (branchId) {
      const branchExists = await db.select().from(branches).where(eq(branches.id, branchId));
      if (branchExists.length === 0) {
        return res.status(400).json({ message: "Branch ID tidak valid." });
      }
    }

    // 3. Cek apakah email sudah terdaftar
    const userExists = await db.select().from(users).where(eq(users.email, email));
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Karena Better Auth membutuhkan pembuatan user melalui API internalnya agar session dan account ter-mapping dengan benar:
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

    // 4. Update data user dengan roleId, branchId, dan phone
    // Better Auth secara default hanya menyimpan name, email. 
    // Kita harus meng-update baris user yang baru saja dibuat oleh Better Auth.
    await db.update(users)
      .set({ 
        roleId, 
        branchId: branchId || null, 
        phone 
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
// Frontend menembak ke POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    // Panggil signInEmail dari Better Auth API
    // Better Auth secara otomatis akan mengatur Set-Cookie headers jika di-pass object res-nya.
    // Tapi karena ini programmatic API call dari express, kita bisa menggunakan toNodeHandler
    // atau meneruskan auth call.
    // Untuk login sederhana dengan cookie di express:
    
    // Namun untuk mempermudah dan menyerahkan kredensial ke Better Auth secara full, 
    // cara paling bersih adalah me-mount handler Better Auth.

  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat login." });
  }
});

// Serahkan semua rute bawaan (seperti sign-in, session, sign-out) ke Better Auth Node Handler
// Endpoint default Better Auth adalah /api/auth/sign-in/email dll.
router.use(toNodeHandler(auth));

export default router;
