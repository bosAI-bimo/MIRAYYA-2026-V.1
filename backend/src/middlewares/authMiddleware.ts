import { Request, Response, NextFunction } from "express";
import { auth } from "../auth";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Attach session user to request
    (req as any).user = session.user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
