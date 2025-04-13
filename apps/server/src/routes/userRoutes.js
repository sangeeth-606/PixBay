import express from 'express';
import { createUser,updateUser,deleteUser,getUser,checkUserExists} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);        
router.get('/:id', getUser);         
router.delete('/:id', deleteUser);
router.get('/check', checkUserExists);

export default router;