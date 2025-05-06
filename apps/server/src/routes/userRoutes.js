import express from 'express';
import { createUser,updateUser,deleteUser,getUser,checkUserExists} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);        
router.get('/check', checkUserExists);  // Moved this before the /:id route
router.get('/:id', getUser);         
router.delete('/:id', deleteUser);

export default router;