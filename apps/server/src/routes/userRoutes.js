import express from 'express';
import { createUser,updateUser,deleteUser,getUser} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);        
router.get('/:id', getUser);         
router.delete('/:id', deleteUser);

export default router;