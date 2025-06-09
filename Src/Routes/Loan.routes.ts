import { Router } from 'express';
import { createLoan, returnLoan } from '../Controllers/Loan.controller';
import { verifyToken } from '../Middlewares/Auth.middleware';

const router = Router();

router.post('/', verifyToken, createLoan);
router.post('/return/:id', verifyToken, returnLoan);

export default router;
