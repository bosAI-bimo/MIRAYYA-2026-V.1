import { z } from "zod";

export const authSchema = {
  register: z.object({
    body: z.object({
      email: z.string().email("Format email tidak valid"),
      password: z.string().min(6, "Password minimal 6 karakter"),
      fullName: z.string().min(1, "Nama lengkap wajib diisi"),
      roleId: z.string().min(1, "Role ID wajib diisi"),
      branchId: z.string().optional(),
      phone: z.string().optional(),
      employeeId: z.string().optional(),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.string().optional(),
      identifier: z.string().optional(),
      password: z.string().min(1, "Password wajib diisi"),
    }).refine(data => data.email || data.identifier, {
      message: "Email atau identifier wajib diisi",
      path: ["identifier"]
    }),
  }),
};

export const hrSchema = {
  createAttendance: z.object({
    body: z.object({
      userId: z.string().min(1, "User ID wajib diisi"),
      attendanceDate: z.string().min(1, "Tanggal wajib diisi"),
      timeIn: z.string().optional(),
      timeOut: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      status: z.string().optional(),
    }),
  }),
  createEmployee: z.object({
    body: z.object({
      name: z.string().min(1, "Nama wajib diisi"),
      email: z.string().email("Format email tidak valid"),
      roleId: z.string().min(1, "Role ID wajib diisi"),
      branchId: z.string().optional(),
      employeeId: z.string().optional(),
      phone: z.string().optional(),
      baseSalary: z.number().nonnegative().optional(),
    }),
  }),
  updateEmployee: z.object({
    body: z.object({
      name: z.string().min(1, "Nama wajib diisi").optional(),
      email: z.string().email("Format email tidak valid").optional(),
      roleId: z.string().min(1, "Role ID wajib diisi").optional(),
      branchId: z.string().optional(),
      employeeId: z.string().optional(),
      phone: z.string().optional(),
      baseSalary: z.number().nonnegative().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
  createBranch: z.object({
    body: z.object({
      name: z.string().min(1, "Nama cabang wajib diisi"),
      location: z.string().optional(),
      status: z.string().optional(),
    }),
  }),
  updateBranch: z.object({
    body: z.object({
      name: z.string().min(1, "Nama cabang wajib diisi").optional(),
      location: z.string().optional(),
      status: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
};

export const employeeSchema = {
  checkIn: z.object({
    body: z.object({
      latitude: z.number(),
      longitude: z.number(),
      selfieBase64: z.string().min(1, "Selfie wajib disertakan"),
      notes: z.string().optional()
    }),
  }),
  checkOut: z.object({
    body: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }),
  }),
  overtime: z.object({
    body: z.object({
      date: z.string().min(1, "Tanggal wajib diisi"),
      startTime: z.string().min(1, "Waktu mulai wajib diisi"),
      endTime: z.string().min(1, "Waktu selesai wajib diisi"),
      reason: z.string().min(1, "Alasan wajib diisi"),
    }),
  }),
};

export const accountingSchema = {
  createJournal: z.object({
    body: z.object({
      description: z.string().min(3, "Deskripsi minimal 3 karakter"),
      amount: z.number().positive("Jumlah harus lebih dari 0"),
      debitAccount: z.string().min(1, "Akun debit wajib diisi"),
      creditAccount: z.string().min(1, "Akun kredit wajib diisi"),
      entryDate: z.string().min(1, "Tanggal wajib diisi"),
      branchId: z.string().optional(),
    }),
  }),
  createBudget: z.object({
    body: z.object({
      branchId: z.string().min(1),
      month: z.string().min(1),
      pettyCashBudget: z.number().nonnegative(),
      shoppingBudget: z.number().nonnegative(),
      targetAchievement: z.number().nonnegative()
    })
  }),
  createPettyCash: z.object({
    body: z.object({
      description: z.string().min(3),
      amount: z.number().positive(),
      branchId: z.string().optional()
    })
  }),
  actionEod: z.object({
    body: z.object({
      notes: z.string().optional()
    })
  }),
  actionPo: z.object({
    body: z.object({
      notes: z.string().optional()
    })
  }),
};

export const storeSchema = {
  createOrder: z.object({
    body: z.object({
      totalAmount: z.number().positive(),
      budgetId: z.string().optional(),
      items: z.array(z.object({
        productCode: z.string().min(1),
        productName: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        movementCategory: z.string().optional()
      })).optional()
    })
  }),
  createEod: z.object({
    body: z.object({
      reportDate: z.string().min(1),
      totalOmzet: z.number().nonnegative(),
      cashAmount: z.number().nonnegative(),
      edcAmount: z.number().nonnegative(),
      qrisAmount: z.number().nonnegative(),
      pettyCashUsed: z.number().nonnegative(),
      evidencePhotos: z.array(z.string()).optional(),
      branchId: z.string().optional()
    })
  })
};

export const payrollSchema = {
  calculate: z.object({
    body: z.object({
      period: z.string().regex(/^\d{4}-\d{2}$/, "Format periode harus YYYY-MM"),
      branchId: z.string().optional(),
      baseSalaryDefault: z.number().positive().optional()
    })
  })
};
