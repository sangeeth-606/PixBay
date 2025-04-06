import express from 'express';
import { createProject,getUserProjects } from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create',authMiddleware, createProject); 
router.get('/user',authMiddleware, getUserProjects);  

export default router;