import express from 'express';
import { createUser, updateUser, deleteUser, getUser, checkUserExists, updateUserByEmail } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);        
router.get('/check', checkUserExists);  // Moved this before the /:id route
router.put('/email/:email', updateUserByEmail);  // Add this new route
router.get('/:id', getUser);         
router.put('/:id', updateUser);      // Add the missing update route
router.delete('/:id', deleteUser);

export default router;