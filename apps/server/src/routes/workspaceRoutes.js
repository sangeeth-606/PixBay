import express from 'express'
import { createWorkspace, joinWorkspace, getUserWorkspaces, workSpaceMembers } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router= express.Router();

router.post('/create', authMiddleware ,createWorkspace);       
router.post('/join',authMiddleware, joinWorkspace);           
router.get('/user', authMiddleware,getUserWorkspaces);
router.get('/:name/members', authMiddleware, workSpaceMembers);      

export default router;