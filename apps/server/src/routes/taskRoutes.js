import express from 'express'
import { createTask, getProjectTasks } from '../controllers/taskController.js';

const router = express.Router();

router.post('/create', createTask);        
router.get('/project/:projectId', getProjectTasks); 

export default router;