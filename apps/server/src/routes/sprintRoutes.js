import express from 'express';
import { 
  createSprint, 
  getSprint, 
  getAllSprints, 
  updateSprint, 
  deleteSprint 
} from '../controllers/sprintController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new sprint
router.post('/create', authMiddleware, createSprint);

// Route for workspace sprints - put this BEFORE the /:sprintId route to ensure proper precedence
router.get('/workspace/:workspaceId', authMiddleware, getAllSprints);

// Route for project sprints - put this BEFORE the /:sprintId route
router.get('/project/:projectId', authMiddleware, getAllSprints);

// Get a single sprint - this needs to be after the more specific routes
router.get('/:sprintId', authMiddleware, getSprint);

// Update a sprint
router.put('/:sprintId', authMiddleware, updateSprint);

// Delete a sprint
router.delete('/:sprintId', authMiddleware, deleteSprint);

export default router;
