import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all notifications for the user
router.get("/", authMiddleware, getUserNotifications);

// Mark a specific notification as read
router.put("/:id/read", authMiddleware, markNotificationAsRead);

export default router;