import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import hrRoutes from "./routes/hr.routes";
import accountingRoutes from "./routes/accounting.routes";
import storeRoutes from "./routes/store.routes";
import ownerRoutes from "./routes/owner.routes";
import adminRoutes from "./routes/admin.routes";
import employeeRoutes from "./routes/employee.routes";
import payrollRoutes from "./routes/payroll.routes";
import uploadRoutes from "./routes/upload.routes";
import cronRoutes from "./routes/cron.routes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" })); // Increased for base64 image uploads
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cron", cronRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
