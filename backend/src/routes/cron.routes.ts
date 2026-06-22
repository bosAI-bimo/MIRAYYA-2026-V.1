import { Router } from "express";
import { calculateNextMonthTargets } from "../lib/revenue-target-calculator";

const router = Router();

// Simple middleware to protect cron endpoints using a secret header or token
const requireCronAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  // In production, use a secure secret stored in env variables
  if (authHeader !== "Bearer MIRAYYA_CRON_SECRET_2026") {
    return res.status(401).json({ error: "Unauthorized cron execution" });
  }
  next();
};

/**
 * POST /api/cron/calculate-targets
 * Trigger the monthly revenue target calculation.
 * Usually called on the 28th of every month.
 */
router.post("/calculate-targets", requireCronAuth, async (req, res) => {
  try {
    const results = await calculateNextMonthTargets();
    res.json({
      success: true,
      message: `Berhasil menghitung target untuk ${results.length} cabang.`,
      data: results
    });
  } catch (error: any) {
    console.error("Cron Calculate Targets Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
