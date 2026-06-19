import { Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import { db } from "../db";
import { users, roles } from "../db/schema";
import { eq } from "drizzle-orm";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.["better-auth.session_token"] || 
                  req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Try standard session if using Better Auth directly
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    let userId = session?.user?.id;

    if (!userId && token) {
      // Check db if token is standard express cookie
      const dbSession = await db.select().from(require("../db/schema").session).where(eq(require("../db/schema").session.token, token)).limit(1);
      if (dbSession.length > 0 && new Date() <= new Date(dbSession[0].expiresAt)) {
        userId = dbSession[0].userId;
      }
    }

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Fetch full user info including role and branch
    const userInfo = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      branchId: users.branchId
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

    if (userInfo.length === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Attach full user to request
    (req as any).user = userInfo[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      res.status(403).json({ error: "Forbidden: No role assigned" });
      return;
    }

    if (allowedRoles.includes(user.role) || user.role === 'owner') {
      next();
    } else {
      res.status(403).json({ error: `Forbidden: Requires one of ${allowedRoles.join(', ')}` });
    }
  };
};
