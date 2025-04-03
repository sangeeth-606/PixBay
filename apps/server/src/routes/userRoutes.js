import express from 'express';
import { getUsers , addUser,updateUser} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.put('/update/:email', updateUser);

export default router;