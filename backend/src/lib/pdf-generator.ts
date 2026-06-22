/**
 * PDF Generator for Mirayya ERP
 * Uses a simple approach without heavy dependencies — generates PDF manually.
 * For production, consider upgrading to pdfkit or puppeteer.
 */

interface PayslipData {
  employeeName: string;
  employeeEmail: string;
  branch: string;
  role: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
};

/**
 * Generate a simple text-based payslip as a downloadable file.
 * This creates a well-formatted plain text slip.
 * For full PDF, install pdfkit: npm i pdfkit
 */
export async function generatePayslipPdf(data: PayslipData): Promise<Buffer> {
  const periodDate = new Date(data.period);
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const periodStr = `${monthNames[periodDate.getMonth()]} ${periodDate.getFullYear()}`;

  // Transport allowance breakdown
  const transportAllowance = Math.round(data.allowances * 0.625); // ~500k of 800k
  const mealAllowance = data.allowances - transportAllowance;

  const lines = [
    "═══════════════════════════════════════════════════════════════",
    "                      SLIP GAJI KARYAWAN                      ",
    "                     MIRAYYA COSMETICS                         ",
    "═══════════════════════════════════════════════════════════════",
    "",
    `  Periode         : ${periodStr}`,
    `  Nama Karyawan   : ${data.employeeName}`,
    `  Email           : ${data.employeeEmail}`,
    `  Jabatan         : ${data.role}`,
    `  Cabang          : ${data.branch}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "  PENDAPATAN",
    "───────────────────────────────────────────────────────────────",
    `  Gaji Pokok                            ${formatRupiah(data.baseSalary).padStart(18)}`,
    `  Tunjangan Transportasi                ${formatRupiah(transportAllowance).padStart(18)}`,
    `  Tunjangan Makan                       ${formatRupiah(mealAllowance).padStart(18)}`,
    "                                        ──────────────────",
    `  Total Pendapatan                      ${formatRupiah(data.baseSalary + data.allowances).padStart(18)}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "  POTONGAN",
    "───────────────────────────────────────────────────────────────",
    `  Potongan Keterlambatan & Absensi      ${formatRupiah(data.deductions).padStart(18)}`,
    "                                        ──────────────────",
    `  Total Potongan                        ${formatRupiah(data.deductions).padStart(18)}`,
    "",
    "═══════════════════════════════════════════════════════════════",
    `  GAJI BERSIH (Take Home Pay)           ${formatRupiah(data.netSalary).padStart(18)}`,
    "═══════════════════════════════════════════════════════════════",
    "",
    `  Dicetak pada: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
    "",
    "  Catatan:",
    "  - Slip gaji ini dibuat secara otomatis oleh sistem ERP Mirayya.",
    "  - Jika ada pertanyaan, hubungi HR Manager.",
    "",
    "───────────────────────────────────────────────────────────────",
    "  TTD                                   TTD",
    "  Karyawan                              HR Manager",
    "",
    "",
    "",
    `  ${data.employeeName.padEnd(40)}_______________`,
    "═══════════════════════════════════════════════════════════════",
  ];

  return Buffer.from(lines.join("\n"), "utf-8");
}

interface ReportData {
  title: string;
  period: string;
  headers: string[];
  rows: string[][];
  summary?: Record<string, string>;
}

/**
 * Generate a generic report as formatted text.
 */
export async function generateReportPdf(data: ReportData): Promise<Buffer> {
  const lines = [
    "═══════════════════════════════════════════════════════════════",
    `  ${data.title.toUpperCase()}`,
    `  MIRAYYA COSMETICS — Periode: ${data.period}`,
    "═══════════════════════════════════════════════════════════════",
    "",
    "  " + data.headers.map(h => h.padEnd(20)).join(""),
    "  " + "─".repeat(data.headers.length * 20),
    ...data.rows.map(row => "  " + row.map(cell => cell.padEnd(20)).join("")),
    "",
  ];

  if (data.summary) {
    lines.push("───────────────────────────────────────────────────────────────");
    lines.push("  RINGKASAN");
    lines.push("───────────────────────────────────────────────────────────────");
    for (const [key, value] of Object.entries(data.summary)) {
      lines.push(`  ${key.padEnd(30)} ${value}`);
    }
  }

  lines.push("");
  lines.push(`  Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`);
  lines.push("═══════════════════════════════════════════════════════════════");

  return Buffer.from(lines.join("\n"), "utf-8");
}
