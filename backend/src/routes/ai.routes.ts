import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Inisialisasi SDK Gemini (memerlukan GEMINI_API_KEY di .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Endpoint for generating AI insights
router.post("/insights", async (req, res) => {
  try {
    const { contextData, query } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: "GEMINI_API_KEY belum dikonfigurasi di server." 
      });
    }

    // Gunakan model Gemini 1.5 Flash (sangat cepat & ideal untuk analisis data teks)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Anda adalah seorang analis bisnis dan ahli ERP untuk Mirayya Cosmetics.
Berikut adalah data konteks ERP yang diberikan pengguna:
${JSON.stringify(contextData, null, 2)}

Pertanyaan/Instruksi dari pengguna:
${query || "Tolong berikan insight singkat berdasarkan data di atas."}

Berikan analisis yang profesional, komprehensif, dan mudah dibaca (gunakan markdown seperti bold/bullet points jika perlu). Fokuslah memberikan saran praktis yang dapat diambil tindakan oleh owner Mirayya Cosmetics.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({
      success: true,
      insight: responseText
    });

  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal memproses AI insights.", 
      error: error.message 
    });
  }
});

export default router;
