import express from 'express'
import { createTask, getProjectTasks } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create',authMiddleware, createTask);        
router.get('/task/:projectId',authMiddleware, getProjectTasks); 

export default router;