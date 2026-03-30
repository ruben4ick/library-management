import { Router } from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/book.controller';
import { auth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', auth, requireRole('ADMIN'), createBook);
router.put('/:id', auth, requireRole('ADMIN'), updateBook);
router.delete('/:id', auth, requireRole('ADMIN'), deleteBook);

export default router;
