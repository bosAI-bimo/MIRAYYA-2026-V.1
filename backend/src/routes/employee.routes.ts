import { Router } from "express";
import { db } from "../db";
import { users, attendance, branches } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/authMiddleware";
import { uploadSelfieToSupabase } from "../lib/supabase";

const router = Router();

// Require authentication for all routes here
router.use(requireAuth);

// Utility for Haversine distance
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in m
  return d;
}

router.get("/attendance/my-records", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const records = await db.select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.isDeleted, false)))
      .orderBy(desc(attendance.attendanceDate));
      
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/attendance/check-in", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { selfieBase64, latitude, longitude, notes } = req.body;

    if (!selfieBase64 || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Selfie, latitude, and longitude are required." });
    }

    // Get user's branch to validate geofencing
    const userRecord = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!userRecord[0] || !userRecord[0].branchId) {
      return res.status(400).json({ error: "User is not assigned to any branch." });
    }

    const branchRecord = await db.select().from(branches).where(eq(branches.id, userRecord[0].branchId)).limit(1);
    const branch = branchRecord[0];

    let distance = 0;
    // Check geofencing if branch has lat/long setup
    if (branch && branch.latitude && branch.longitude) {
      distance = getDistanceFromLatLonInMeters(
        latitude, 
        longitude, 
        Number(branch.latitude), 
        Number(branch.longitude)
      );
      
      // If distance > 100 meters, reject
      if (distance > 100) {
        return res.status(400).json({ error: `Anda berada di luar jangkauan cabang. Jarak Anda: ${Math.round(distance)} meter.` });
      }
    }

    // Determine status
    const now = new Date();
    // Use local time for logic
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeIn = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    // Default working hour is 09:00:00. If > 09:00, terlambat.
    const isLate = hours > 9 || (hours === 9 && minutes > 0);
    const status = isLate ? "Terlambat" : "Tepat Waktu";

    // Format date YYYY-MM-DD
    const attendanceDate = now.toISOString().split('T')[0];

    // Check if already checked in today
    const existing = await db.select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.attendanceDate, attendanceDate)))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Anda sudah melakukan check-in hari ini." });
    }

    // Upload selfie
    const fileName = `checkin-${userId}-${Date.now()}.jpg`;
    const selfieUrl = await uploadSelfieToSupabase(selfieBase64, fileName);

    // Insert record
    const newRecord = await db.insert(attendance)
      .values({
        userId,
        attendanceDate,
        timeIn,
        selfieUrl,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        locationGps: `${latitude}, ${longitude}`,
        status,
        notes
      })
      .returning();

    res.status(201).json(newRecord[0]);
  } catch (error: any) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/attendance/check-out", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    const attendanceDate = now.toISOString().split('T')[0];
    const timeOut = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

    const existing = await db.select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.attendanceDate, attendanceDate)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(400).json({ error: "Anda belum melakukan check-in hari ini." });
    }

    if (existing[0].timeOut) {
      return res.status(400).json({ error: "Anda sudah melakukan check-out hari ini." });
    }

    const updatedRecord = await db.update(attendance)
      .set({ timeOut })
      .where(eq(attendance.id, existing[0].id))
      .returning();

    res.json(updatedRecord[0]);
  } catch (error: any) {
    console.error("Check-out error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
