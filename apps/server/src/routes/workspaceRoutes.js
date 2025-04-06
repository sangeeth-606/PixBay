import express from 'express'
import { createWorkspace,joinWorkspace,getUserWorkspaces } from '../controllers/workspaceController';
import authMiddleware from '../middleware/authMiddleware';
const router= express.Router();

router.post('/create', authMiddleware ,createWorkspace);       
router.post('/join',authMiddleware, joinWorkspace);           
router.get('/user', authMiddleware,getUserWorkspaces);      

export default router;