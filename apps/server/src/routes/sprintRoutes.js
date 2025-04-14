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

// Get a single sprint
router.get('/:sprintId', authMiddleware, getSprint);

// Get all sprints for a project
router.get('/project/:projectId', authMiddleware, getAllSprints);

// Update a sprint
router.put('/:sprintId', authMiddleware, updateSprint);

// Delete a sprint
router.delete('/:sprintId', authMiddleware, deleteSprint);

export default router;
