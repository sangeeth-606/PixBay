import express from 'express'
import { createWorkspace,joinWorkspace,getUserWorkspaces } from '../controllers/workspaceController';

const router= express.Router();

router.post('/create', createWorkspace);       
router.post('/join', joinWorkspace);           
router.get('/user', getUserWorkspaces);      

export default router;