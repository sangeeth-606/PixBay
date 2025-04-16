import express from "express";
import {
  createProject,
  getProjectInfo,
  getWorkspaceProjects,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/projects - Create new project
router.post("/", authMiddleware, createProject);

// GET /api/projects/workspace/{workspaceName} - Get workspace projects
router.get("/workspace/:workspaceName", authMiddleware, getWorkspaceProjects);

// GET /api/projects/{projectId} - Get detailed project info
router.get("/:projectId", authMiddleware, getProjectInfo);

export default router;
