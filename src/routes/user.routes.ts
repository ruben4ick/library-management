import { Router } from 'express';
import { getAllUsers, getUserById, getMe } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/me', auth, getMe);
router.get('/', auth, requireRole('ADMIN'), getAllUsers);
router.get('/:id', auth, requireRole('ADMIN'), getUserById);

export default router;
