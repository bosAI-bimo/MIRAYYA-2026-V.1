import { z } from "zod";

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
};
