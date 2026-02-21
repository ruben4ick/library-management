import { Router } from 'express';
import { getAllLoans, createLoan, returnLoan } from '../controllers/loan.controller';

const router = Router();

router.get('/', getAllLoans);
router.post('/', createLoan);
router.post('/:id/return', returnLoan);

export default router;
