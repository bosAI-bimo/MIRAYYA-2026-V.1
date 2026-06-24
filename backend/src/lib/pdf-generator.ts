import PDFDocument from "pdfkit";

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

export async function generatePayslipPdf(data: PayslipData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const periodDate = new Date(data.period);
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const periodStr = `${monthNames[periodDate.getMonth()]} ${periodDate.getFullYear()}`;

      const transportAllowance = Math.round(data.allowances * 0.625);
      const mealAllowance = data.allowances - transportAllowance;

      doc.fontSize(20).text("SLIP GAJI KARYAWAN", { align: "center" });
      doc.fontSize(14).text("MIRAYYA COSMETICS", { align: "center" });
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(10);
      doc.text(`Periode         : ${periodStr}`);
      doc.text(`Nama Karyawan   : ${data.employeeName}`);
      doc.text(`Email           : ${data.employeeEmail}`);
      doc.text(`Jabatan         : ${data.role}`);
      doc.text(`Cabang          : ${data.branch}`);
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(12).text("PENDAPATAN", { underline: true });
      doc.moveDown(0.5);
      
      const drawRow = (label: string, value: string) => {
        const y = doc.y;
        doc.text(label, 50, y);
        doc.text(value, 400, y, { width: 145, align: "right" });
      };

      doc.fontSize(10);
      drawRow("Gaji Pokok", formatRupiah(data.baseSalary));
      drawRow("Tunjangan Transportasi", formatRupiah(transportAllowance));
      drawRow("Tunjangan Makan", formatRupiah(mealAllowance));
      doc.moveDown();
      drawRow("Total Pendapatan", formatRupiah(data.baseSalary + data.allowances));
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(12).text("POTONGAN", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      drawRow("Potongan Keterlambatan & Absensi", formatRupiah(data.deductions));
      doc.moveDown();
      drawRow("Total Potongan", formatRupiah(data.deductions));
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(12).text("GAJI BERSIH (Take Home Pay)", 50, doc.y);
      doc.text(formatRupiah(data.netSalary), 400, doc.y - 14, { width: 145, align: "right" });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      doc.fontSize(9).text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`);
      doc.moveDown();
      doc.text("Catatan:\n- Slip gaji ini dibuat secara otomatis oleh sistem ERP Mirayya.\n- Jika ada pertanyaan, hubungi HR Manager.");

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

interface ReportData {
  title: string;
  period: string;
  headers: string[];
  rows: string[][];
  summary?: Record<string, string>;
}

export async function generateReportPdf(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      doc.fontSize(18).text(data.title.toUpperCase(), { align: "center" });
      doc.fontSize(12).text(`MIRAYYA COSMETICS — Periode: ${data.period}`, { align: "center" });
      doc.moveDown();

      // Headers
      const colWidth = 780 / Math.max(data.headers.length, 1);
      let x = 30;
      doc.fontSize(10).font("Helvetica-Bold");
      data.headers.forEach(h => {
        doc.text(h, x, doc.y, { width: colWidth, lineBreak: false });
        x += colWidth;
      });
      doc.moveDown();
      doc.moveTo(30, doc.y).lineTo(810, doc.y).stroke();
      doc.moveDown(0.5);

      // Rows
      doc.font("Helvetica");
      data.rows.forEach(row => {
        x = 30;
        const y = doc.y;
        row.forEach(cell => {
          doc.text(String(cell), x, y, { width: colWidth, lineBreak: false });
          x += colWidth;
        });
        doc.moveDown();
      });
      doc.moveDown();

      if (data.summary) {
        doc.moveTo(30, doc.y).lineTo(810, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").text("RINGKASAN");
        doc.font("Helvetica");
        for (const [key, value] of Object.entries(data.summary)) {
          doc.text(`${key}: ${value}`);
        }
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
