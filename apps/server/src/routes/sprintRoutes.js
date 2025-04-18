import express from 'express';
import { 
  createSprint, 
  getSprint, 
  getAllSprints, 
  updateSprint, 
  deleteSprint ,
  createTask
} from '../controllers/sprintController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createSprint);
router.get('/workspace/:workspaceId', authMiddleware, getAllSprints);
router.get('/project/:projectId', authMiddleware, getAllSprints);
router.get('/:sprintId', authMiddleware, getSprint);
router.put('/:sprintId', authMiddleware, updateSprint);
router.delete('/:sprintId', authMiddleware, deleteSprint);
router.post('/tasks', authMiddleware, createTask);

export default router;
