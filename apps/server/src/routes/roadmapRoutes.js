import express from "express";
import {
  createMilestone,
  getMilestonesByProject,
  getMilestone,
  updateMilestone,
  deleteMilestone,
  createDependency,
  getTasksForMilestone,
  deleteDependency,
  getMilestonesByWorkspace,
} from "../controllers/roadmapController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Milestone routes
router.post("/projects/:projectId/milestones", authMiddleware, createMilestone);
router.get(
  "/projects/:projectId/milestones",
  authMiddleware,
  getMilestonesByProject
);
router.get("/milestones/:milestoneId", authMiddleware, getMilestone);
router.put("/milestones/:milestoneId", authMiddleware, updateMilestone);
router.delete("/milestones/:milestoneId", authMiddleware, deleteMilestone);
router.get(
  "/milestones/:milestoneId/tasks",
  authMiddleware,
  getTasksForMilestone
);
router.get(
  "/workspace/:workspaceName/milestones",
  authMiddleware,
  getMilestonesByWorkspace
);

// Dependency routes
router.post(
  "/projects/:projectId/dependencies",
  authMiddleware,
  createDependency
);
router.delete(
  "/projects/:projectId/dependencies/:dependencyId",
  authMiddleware,
  deleteDependency
);

export default router;
