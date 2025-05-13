import express from 'express'
import { createWorkspace, joinWorkspace, getUserWorkspaces, workSpaceMembers, getWorkspaceByName, deleteWorkspace } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router= express.Router();

router.post('/create', authMiddleware ,createWorkspace);       
router.post('/join',authMiddleware, joinWorkspace);           
router.get('/user', authMiddleware,getUserWorkspaces);
router.get('/:name/members', authMiddleware, workSpaceMembers);
router.get('/by-name/:name', authMiddleware, getWorkspaceByName);
router.delete('/:name', authMiddleware, deleteWorkspace);      

export default router;