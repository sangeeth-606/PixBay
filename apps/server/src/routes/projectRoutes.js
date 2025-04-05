import express from 'express';
import { createProject,getUserProjects } from '../controllers/projectController.js';

const router = express.Router();

router.post('/create', createProject); 
router.get('/user', getUserProjects);  

export default router;