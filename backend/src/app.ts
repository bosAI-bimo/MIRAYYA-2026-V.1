import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import hrRoutes from "./routes/hr.routes";
import accountingRoutes from "./routes/accounting.routes";
import storeRoutes from "./routes/store.routes";
import ownerRoutes from "./routes/owner.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
