/**
 * Analytics Engine — Rule-Based Business Intelligence
 * Generates actionable insights without external AI API.
 */

interface ProductData {
  name: string;
  code: string;
  stock: number;
  minStock: number;
  movement?: string | null;
  hpp: number;
  sellPrice: number;
}

interface BranchPerformance {
  branch: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  status: string;
}

interface AttendanceInsight {
  totalEmployees: number;
  presentToday: number;
  lateCount: number;
}

// ═══════════════════════════════════════
// STOCK RECOMMENDATIONS
// ═══════════════════════════════════════

export function generateStockRecommendations(
  products: ProductData[],
  orderHistory?: { productCode: string; quantity: number; date: string }[]
): { type: string; priority: string; title: string; description: string; action: string }[] {
  const recommendations: { type: string; priority: string; title: string; description: string; action: string }[] = [];

  // Critical stock (below minimum)
  const criticalProducts = products.filter(p => p.stock <= p.minStock);
  if (criticalProducts.length > 0) {
    const topCritical = criticalProducts.slice(0, 5).map(p => p.name).join(", ");
    recommendations.push({
      type: "stock_critical",
      priority: criticalProducts.length > 5 ? "high" : "medium",
      title: `${criticalProducts.length} Produk Stok Kritis`,
      description: `Produk berikut stoknya di bawah minimum: ${topCritical}${criticalProducts.length > 5 ? ` dan ${criticalProducts.length - 5} lainnya` : ""}.`,
      action: "Segera buat Purchase Order untuk restok produk-produk ini."
    });
  }

  // Overstock detection (stock > 3x minStock for slow-moving)
  const overstocked = products.filter(p => p.movement === 'slow' && p.stock > (p.minStock * 3));
  if (overstocked.length > 0) {
    recommendations.push({
      type: "stock_overstock",
      priority: "low",
      title: `${overstocked.length} Produk Slow-Moving Overstock`,
      description: `Beberapa produk slow-moving memiliki stok berlebih. Ini mengikat modal kerja.`,
      action: "Pertimbangkan program bundling atau diskon untuk menghabiskan stok berlebih."
    });
  }

  // High margin products with low stock (opportunity cost)
  const highMarginLowStock = products.filter(p => {
    const margin = p.sellPrice > 0 ? ((p.sellPrice - p.hpp) / p.sellPrice) * 100 : 0;
    return margin > 40 && p.stock < (p.minStock * 1.5);
  });
  if (highMarginLowStock.length > 0) {
    recommendations.push({
      type: "stock_opportunity",
      priority: "high",
      title: "Produk Margin Tinggi Perlu Restok",
      description: `${highMarginLowStock.length} produk dengan margin >40% stoknya hampir habis. Kehilangan potensi profit.`,
      action: "Prioritaskan PO untuk produk margin tinggi ini."
    });
  }

  return recommendations;
}

// ═══════════════════════════════════════
// REVENUE INSIGHTS
// ═══════════════════════════════════════

export function generateRevenueInsights(
  branches: BranchPerformance[],
  monthlyTarget: number,
  currentOmzet: number
): { type: string; priority: string; title: string; description: string; action: string }[] {
  const recommendations: { type: string; priority: string; title: string; description: string; action: string }[] = [];

  const achievement = monthlyTarget > 0 ? (currentOmzet / monthlyTarget) * 100 : 0;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  const expectedProgress = (dayOfMonth / daysInMonth) * 100;

  // Target tracking
  if (achievement < expectedProgress * 0.7) {
    recommendations.push({
      type: "revenue_behind",
      priority: "high",
      title: "Pencapaian Omzet Jauh di Bawah Ekspektasi",
      description: `Hari ke-${dayOfMonth} seharusnya sudah ~${Math.round(expectedProgress)}% tapi baru ${Math.round(achievement)}%.`,
      action: "Implementasikan program promo agresif segera. Evaluasi strategi penjualan."
    });
  } else if (achievement < expectedProgress * 0.9) {
    recommendations.push({
      type: "revenue_warning",
      priority: "medium",
      title: "Pencapaian Omzet Sedikit di Bawah Target",
      description: `Perlu akselerasi ~${Math.round(expectedProgress - achievement)}% lagi untuk on-track.`,
      action: "Tingkatkan aktivitas promosi dan follow-up pelanggan."
    });
  } else if (achievement >= 100) {
    recommendations.push({
      type: "revenue_achieved",
      priority: "low",
      title: "🎉 Target Omzet Tercapai!",
      description: `Pencapaian sudah ${Math.round(achievement)}%. Luar biasa!`,
      action: "Pertahankan momentum dan kejar target lebih tinggi."
    });
  }

  // Underperforming branches
  const underperforming = branches.filter(b => b.status === 'Critical');
  if (underperforming.length > 0) {
    recommendations.push({
      type: "branch_critical",
      priority: "high",
      title: `${underperforming.length} Cabang Bermasalah`,
      description: `Cabang ${underperforming.map(b => b.branch).join(", ")} memiliki margin < 5%.`,
      action: "Audit biaya operasional dan evaluasi product mix di cabang tersebut."
    });
  }

  // Top performing branch
  const topBranch = branches.sort((a, b) => b.margin - a.margin)[0];
  if (topBranch && topBranch.margin > 20) {
    recommendations.push({
      type: "branch_top",
      priority: "low",
      title: `Cabang ${topBranch.branch} Top Performer`,
      description: `Margin ${topBranch.margin}% — pelajari strategi mereka untuk diterapkan di cabang lain.`,
      action: "Analisis best practices dari cabang ini dan replikasi ke cabang lain."
    });
  }

  return recommendations;
}

// ═══════════════════════════════════════
// SIMPLE FORECASTING (Linear Regression)
// ═══════════════════════════════════════

export function generateSimpleForecasting(
  historicalData: { month: string; revenue: number }[],
  monthsAhead: number = 3
): { month: string; projectedRevenue: number; confidence: number; trend: string }[] {
  if (historicalData.length < 2) return [];

  // Simple linear regression
  const n = historicalData.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = historicalData.map(d => d.revenue);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sumXX = x.reduce((a, xi) => a + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Determine trend
  const trend = slope > 0 ? "naik" : slope < 0 ? "turun" : "stabil";

  const forecasts = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].month + '-01');

  for (let i = 1; i <= monthsAhead; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);
    const nextMonth = nextDate.toISOString().substring(0, 7);
    
    const projectedRevenue = Math.max(0, Math.round(intercept + slope * (n + i - 1)));
    const confidence = Math.max(40, Math.round(90 - (i * 15))); // Confidence decreases over time

    forecasts.push({
      month: nextMonth,
      projectedRevenue,
      confidence,
      trend,
    });
  }

  return forecasts;
}

// ═══════════════════════════════════════
// COST OPTIMIZATION INSIGHTS
// ═══════════════════════════════════════

export function generateCostOptimization(
  pettyCashByBranch: { branch: string; used: number; budget: number }[]
): { type: string; priority: string; title: string; description: string; action: string }[] {
  const recommendations: { type: string; priority: string; title: string; description: string; action: string }[] = [];

  for (const pc of pettyCashByBranch) {
    const usage = pc.budget > 0 ? (pc.used / pc.budget) * 100 : 0;

    if (usage > 100) {
      recommendations.push({
        type: "cost_overbudget",
        priority: "high",
        title: `Cabang ${pc.branch} Over Budget`,
        description: `Pengeluaran petty cash ${Math.round(usage)}% dari budget. Melebihi anggaran.`,
        action: "Evaluasi pengeluaran dan tentukan mana yang bisa dikurangi."
      });
    } else if (usage > 80) {
      recommendations.push({
        type: "cost_warning",
        priority: "medium",
        title: `Budget ${pc.branch} Hampir Habis`,
        description: `Sudah menggunakan ${Math.round(usage)}% dari anggaran petty cash.`,
        action: "Kontrol pengeluaran untuk sisa bulan ini."
      });
    }
  }

  return recommendations;
}
