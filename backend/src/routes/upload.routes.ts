import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { uploadSelfieToSupabase } from "../lib/supabase";

const router = Router();

router.use(requireAuth);

/**
 * POST /api/upload/image
 * Generic image upload endpoint.
 * Body: { base64File: string, bucket?: string, prefix?: string }
 */
router.post("/image", async (req, res) => {
  try {
    const { base64File, bucket = "evidence-photos", prefix = "upload" } = req.body;

    if (!base64File) {
      return res.status(400).json({ error: "base64File is required" });
    }

    const fileName = `${prefix}-${(req as any).user?.id || 'unknown'}-${Date.now()}.jpg`;
    
    // Reuse the existing supabase upload function
    const url = await uploadSelfieToSupabase(base64File, fileName);

    res.json({ url, fileName });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

/**
 * POST /api/upload/eod-evidence
 * Upload EOD evidence photos (multiple).
 * Body: { photos: string[] } — array of base64 images
 */
router.post("/eod-evidence", async (req, res) => {
  try {
    const { photos } = req.body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: "photos array is required" });
    }

    const urls = [];
    for (let i = 0; i < photos.length; i++) {
      const fileName = `eod-${(req as any).user?.id || 'unknown'}-${Date.now()}-${i}.jpg`;
      const url = await uploadSelfieToSupabase(photos[i], fileName);
      urls.push(url);
    }

    res.json({ urls });
  } catch (error: any) {
    console.error("EOD Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

/**
 * POST /api/upload/receipt
 * Upload petty cash receipt photo.
 * Body: { base64File: string }
 */
router.post("/receipt", async (req, res) => {
  try {
    const { base64File } = req.body;

    if (!base64File) {
      return res.status(400).json({ error: "base64File is required" });
    }

    const fileName = `receipt-${(req as any).user?.id || 'unknown'}-${Date.now()}.jpg`;
    const url = await uploadSelfieToSupabase(base64File, fileName);

    res.json({ url, fileName });
  } catch (error: any) {
    console.error("Receipt Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
