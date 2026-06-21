import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  time,
  date,
  decimal,
  integer,
  json,
  boolean
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Better Auth uses text for id
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  roleId: uuid("role_id").references(() => roles.id),
  branchId: uuid("branch_id").references(() => branches.id),
  phone: varchar("phone", { length: 50 }),
  employeeId: varchar("employee_id", { length: 50 }).unique(),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});

export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  attendanceDate: date("attendance_date").notNull(),
  timeIn: time("time_in"),
  timeOut: time("time_out"),
  selfieUrl: text("selfie_url"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  status: varchar("status", { length: 50 }), // e.g. "Tepat Waktu", "Terlambat"
  notes: text("notes"),
  locationGps: varchar("location_gps", { length: 255 }),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const payroll = pgTable("payroll", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  period: date("period").notNull(),
  baseSalary: decimal("base_salary", { precision: 12, scale: 2 }).notNull(),
  allowances: decimal("allowances", { precision: 12, scale: 2 }).default("0"),
  deductions: decimal("deductions", { precision: 12, scale: 2 }).default("0"),
  netSalary: decimal("net_salary", { precision: 12, scale: 2 }).notNull(),
  slipPdfUrl: text("slip_pdf_url"),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  pettyCashBudget: decimal("petty_cash_budget", { precision: 15, scale: 2 }).default("0").notNull(),
  shoppingBudget: decimal("shopping_budget", { precision: 15, scale: 2 }).default("0").notNull(),
  targetAchievement: decimal("target_achievement", { precision: 15, scale: 2 }).default("0").notNull(),
  approvedBy: text("approved_by").references(() => users.id),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  createdBy: text("created_by").references(() => users.id).notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).notNull(), // PENDING, APPROVED, REJECTED
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  budgetId: uuid("budget_id").references(() => budgets.id),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productCode: varchar("product_code", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  movementCategory: varchar("movement_category", { length: 50 }), // FAST_MOVING, SLOW_MOVING
});

export const eodReports = pgTable("eod_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  reportDate: date("report_date").notNull(),
  totalOmzet: decimal("total_omzet", { precision: 15, scale: 2 }).notNull(),
  cashAmount: decimal("cash_amount", { precision: 15, scale: 2 }).default("0"),
  edcAmount: decimal("edc_amount", { precision: 15, scale: 2 }).default("0"),
  qrisAmount: decimal("qris_amount", { precision: 15, scale: 2 }).default("0"),
  pettyCashUsed: decimal("petty_cash_used", { precision: 15, scale: 2 }).default("0"),
  evidencePhotos: json("evidence_photos"), // array of urls
  submittedBy: text("submitted_by").references(() => users.id).notNull(),
  approvedBy: text("approved_by").references(() => users.id),
  status: varchar("status", { length: 50 }).default("PENDING"), // PENDING, APPROVED, REJECTED
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const pettyCashTransactions = pgTable("petty_cash_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  receiptPhotoUrl: text("receipt_photo_url"),
  recordedBy: text("recorded_by").references(() => users.id).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const bankReconciliations = pgTable("bank_reconciliations", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  bankAccount: varchar("bank_account", { length: 100 }).notNull(),
  reconcileDate: date("reconcile_date").notNull(),
  bankStatementBalance: decimal("bank_statement_balance", { precision: 15, scale: 2 }).notNull(),
  posSalesBalance: decimal("pos_sales_balance", { precision: 15, scale: 2 }).notNull(),
  difference: decimal("difference", { precision: 15, scale: 2 }).notNull(),
  notes: text("notes"),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const revenueTargets = pgTable("revenue_targets", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  targetRevenue: decimal("target_revenue", { precision: 15, scale: 2 }).notNull(),
  avgPeriodStart: date("avg_period_start"),
  avgPeriodEnd: date("avg_period_end"),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  entryDate: date("entry_date").notNull(),
  description: text("description").notNull(),
  debitAccount: varchar("debit_account", { length: 100 }).notNull(),
  creditAccount: varchar("credit_account", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id),
  createdBy: text("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const overtimeRequests = pgTable("overtime_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING"),
  approvedBy: text("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: text("updated_by"),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  hpp: decimal("hpp", { precision: 12, scale: 2 }).notNull(),
  sellPrice: decimal("sell_price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(10),
  movement: varchar("movement", { length: 50 }).default("slow"),
  isDeleted: boolean("is_deleted").default(false),
});
