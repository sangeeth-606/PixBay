import express from 'express';
import { getUsers , addUser} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);

export default router;