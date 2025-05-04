import express from 'express'
import { createWorkspace, joinWorkspace, getUserWorkspaces, workSpaceMembers, getWorkspaceByName } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router= express.Router();

router.post('/create', authMiddleware ,createWorkspace);       
router.post('/join',authMiddleware, joinWorkspace);           
router.get('/user', authMiddleware,getUserWorkspaces);
router.get('/:name/members', authMiddleware, workSpaceMembers);
// Add this new route to get workspace by name explicitly
router.get('/by-name/:name', authMiddleware, getWorkspaceByName);      

export default router;